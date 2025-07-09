import httpStatus from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StatusCodes, } from 'http-status-codes';
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await userServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: result
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await userServices.getAllUsers()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All User Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })

})


export const UserController = {
    createUser,
    getAllUsers
}

// route matching -> controller -> service -> model -> db