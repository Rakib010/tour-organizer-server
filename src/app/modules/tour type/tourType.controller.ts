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

const getAllTourTypes = catchAsync(async (_req, res) => {
    const data = await tourTypeService.getAllTourTypes();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour types retrieved successfully",
        data,
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
    deleteTourType
}