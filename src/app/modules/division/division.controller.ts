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
    const query = req.query
    const result = await divisionServices.getAllDivision(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get All Division",
        data: result.data,
        meta: result.meta,
    })
})

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await divisionServices.getSingleDivision(slug);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
    });
});

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
    deleteDivision,
    getSingleDivision
}
