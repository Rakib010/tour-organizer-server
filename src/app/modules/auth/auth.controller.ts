import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from '../../utils/catchAsync';
import { AuthService } from './auth.service';


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const logInfo = await AuthService.credentialsLogin(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Login Successfully",
        data: logInfo
    })
})

export const AuthController = {
    credentialsLogin
}