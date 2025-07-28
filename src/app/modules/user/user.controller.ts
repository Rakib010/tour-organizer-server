/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import StatusCodes from 'http-status-codes';
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

// route matching -> controller -> service -> model -> db

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await userServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: result
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id

    /* const token = req.headers.authorization
    const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload */

    const verifiedToken = req.user

    const payload = req.body

    const result = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User updated Successfully",
        data: result
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query

    const users = await userServices.getAllUsers(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All User Retrieved Successfully",
        data: users,

    })

})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const users = await userServices.getMe(decodedToken.userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "personal user get ",
        data: users,

    })
})

const getSingleUsers = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const user = await userServices.getSingleUsers(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tours retrieved successfully',
        data: user
    });
});


export const UserController = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUsers,
    getMe
}

