/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';
import { createUserToken } from '../../utils/userToken';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';


// custom Login -> token base(jwt)
/* const credentialsLogin1 = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const logInfo = await AuthService.credentialsLogin(req.body)

    // set cookie
    setAuthCookie(res, result)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Login SuccessFully",
        data: result
    })

}) */

// passport OAuth-based Login (Session Based Authentication) 
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            // Passport local strategy sometimes returns non-Error values.
            // Normalize them into an AppError so we don't accidentally respond 500.
            if (typeof err === "string") {
                return next(new AppError(httpStatus.UNAUTHORIZED, err))
            }
            return next(err)
        }

        if (!user) {
            const statusCode =
                typeof info?.statusCode === "number" ? info.statusCode : httpStatus.UNAUTHORIZED
            const message =
                typeof info?.message === "string" && info.message.length
                    ? info.message
                    : "Unauthorized"
            return next(new AppError(statusCode, message))
        }

        const userTokens = await createUserToken(user)

        // delete user.toObject().password
        const { password: pass, ...rest } = user.toObject()

        // cookie set
        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Login Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                data: rest
            },
        })
    })(req, res, next)

})

// Refresh Token create
const getRefreshAccessToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies")
    }

    const tokenInfo = await AuthService.getRefreshAccessToken(refreshToken)

    // cookie set 
    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo
    })
})

// Clear cookie in Browser 
const accessTokenLogout = catchAsync(async (req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Log out Successfully",
        data: null
    })
})

// Change Password user 
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodeToken = req.user

    await AuthService.changePassword(oldPassword, newPassword, decodeToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "password change  successfully",
        data: null
    })
})

// When a Google-authenticated user wants to set a password for logging in manually
const setPassword = catchAsync(async (req: Request, res: Response) => {
    const { password } = req.body
    const decodeToken = req.user as JwtPayload

    await AuthService.setPassword(decodeToken.userId, password)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Set Password Successfully",
        data: null
    })
})

// user forgot their password
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body

    await AuthService.forgetPassword(email)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Email send  Successfully",
        data: null
    })
})

// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user

    await AuthService.resetPassword(req.body, decodeToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Reset Password Successfully",
        data: null
    })
})

// Google login using Passport js (oauth2.0)
const googleCallBack = catchAsync(async (req: Request, res: Response) => {

    // route theke pawa (state)
    let redirectTo = req.query.state ? req.query.state as string : " "

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "user Not Found")
    }
    const tokenInfo = await createUserToken(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})


export const AuthController = {
    credentialsLogin,
    getRefreshAccessToken,
    accessTokenLogout,
    resetPassword,
    googleCallBack,
    changePassword,
    setPassword,
    forgetPassword
}