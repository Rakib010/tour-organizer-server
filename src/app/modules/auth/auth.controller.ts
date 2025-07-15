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



const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const logInfo = await AuthService.credentialsLogin(req.body)

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(err)
        }

        if (!user) {
            return next(new AppError(401, info.message))
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


    /* First time ey khane cookie set korsilam akhn middleware use kortesi 
    -> setAuthCookie(res, userTokens)  */
    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })


    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false,
    // })

})

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

const accessTokenLogout = catchAsync(async (req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Log out Successfully",
        data: null
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodeToken = req.user

    await AuthService.resetPassword(oldPassword, newPassword, decodeToken as JwtPayload)

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
    googleCallBack
}