import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { divisionServices } from './division.service';



const createDivision = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body

    const result = await divisionServices.createDivision(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Created Successfully",
        data: result
    })
})

const getAllDivision = catchAsync(async (req: Request, res: Response) => {

    const result = await divisionServices.getAllDivision()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get All Division",
        data: result
    })
})

const updatedDivision = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const payload = req.body

    const result = await divisionServices.updatedDivision(id, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "division update successfully",
        data: result
    })
})

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id

    const result = await divisionServices.deleteDivision(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "division deleted",
        data: result
    })
})


export const divisionController = {
    createDivision,
    getAllDivision,
    updatedDivision,
    deleteDivision
}
