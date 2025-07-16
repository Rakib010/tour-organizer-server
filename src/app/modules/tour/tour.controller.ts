import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { tourServices } from "./tour.service"
import { sendResponse } from "../../utils/sendResponse"

const createTour = catchAsync(async (req: Request, res: Response) => {
    const result = await tourServices.createTour(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Tour created successfully',
        data: result,
    });
});

/* const getAllTours = catchAsync(async (req: Request, res: Response) => {
    //  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const result = await tourServices.getAllTours();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tours retrieved successfully',
        data: result,
    });
});
 */
const updateTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await tourServices.updateTour(id, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour updated successfully',
        data: result,
    });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await tourServices.deleteTour(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tour deleted successfully',
        data: result,
    });
});




export const tourController = {
    createTour,
    //getAllTours,
    updateTour,
    deleteTour
}