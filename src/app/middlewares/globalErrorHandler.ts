/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";


export const globalErrorhandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statuscode = 500
    let message = `Something Went Wrong!!`

   /*  //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    } */

    if (err instanceof AppError) {
        statuscode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statuscode = 500
        message = err.message
    }

    res.status(statuscode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}