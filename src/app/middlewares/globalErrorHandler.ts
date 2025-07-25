/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleCastError, handlerDuplicateError, handlerValidationError, handlerZodError } from "../helpers/handleAllErrorFunction";
import { TErrorSources } from "../interfaces/errors.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";


export const globalErrorhandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.NODE_ENV === "development") {
        console.log(err)
    }


    let errorSources: TErrorSources[] = []
    let statuscode = 500
    let message = `Something Went Wrong!!`

    // single file 
    if (req.file) {
        await deleteImageFromCloudinary(req.file.path)
    }

    // multiple files
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

        await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))
    }

    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statuscode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statuscode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statuscode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statuscode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }

    else if (err instanceof AppError) {
        statuscode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statuscode = 500
        message = err.message
    }

    res.status(statuscode).json({
        success: false,
        message,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}