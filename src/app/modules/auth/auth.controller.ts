import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';



const credentialsLogin = catchAsync(async (req: Request, res: Response) => {

    const logInfo = await AuthService.credentialsLogin(req.body)

    // cookie set
    setAuthCookie(res, logInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Login Successfully",
        data: logInfo
    })
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

    await AuthService.resetPassword(oldPassword, newPassword, decodeToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Reset Password Successfully",
        data: null
    })
})



export const AuthController = {
    credentialsLogin,
    getRefreshAccessToken,
    accessTokenLogout,
    resetPassword
}