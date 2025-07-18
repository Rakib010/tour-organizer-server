/* handleCastError.ts
handleDuplicateError.ts
handlerValidationError.ts
handlerZodError.ts */


/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { TErrorSources, TGenericErrorResponse } from "../interfaces/errors.types"


export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id"
    }
}


/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)

    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    }
}



/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {

    const errorSources: TErrorSources[] = []

    const errors = Object.values(err.errors)

    errors.forEach((errorObject: any) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }))

    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources
    }


}

export const handlerZodError = (err: any): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = []

    err.issues.forEach((issue: any) => {
        errorSources.push({
            //path : "nickname iside lastname inside name"
            // path: issue.path.length > 1 && issue.path.reverse().join(" inside "),

            path: issue.path[issue.path.length - 1],
            message: issue.message
        })
    })

    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources

    }
}

