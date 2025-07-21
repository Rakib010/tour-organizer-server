import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { tourTypeService } from "./tourType.service";



const createTourType = catchAsync(async (req: Request, res: Response) => {
    const data = await tourTypeService.createTourType(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour type created successfully",
        data,
    });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const data = await tourTypeService.getAllTourTypes(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour types retrieved successfully",
        data,
    });
});

const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await tourTypeService.getSingleTourTypes(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type retrieved successfully',
        data: result,
    });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await tourTypeService.updateTourType(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type updated successfully",
        data,
    });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await tourTypeService.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type deleted successfully",
        data: result,
    });
});

export const tourTypeController = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
    getSingleTourType
}