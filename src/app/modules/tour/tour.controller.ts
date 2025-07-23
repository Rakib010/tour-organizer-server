import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { tourServices } from "./tour.service"
import { sendResponse } from "../../utils/sendResponse"
import { ITour } from './tour.interface';

const createTour = catchAsync(async (req: Request, res: Response) => {
    /*  console.log({
         body: req.body,
         files: req.files
     }) */

    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }

    const result = await tourServices.createTour(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Tour created successfully',
        data: result,
    });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const tours = await tourServices.getAllTours(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tours retrieved successfully',
        data: tours
    });
});

const getSingleTours = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const tours = await tourServices.getSingleTours(slug);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tours retrieved successfully',
        data: tours
    });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }
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
    getAllTours,
    updateTour,
    deleteTour,
    getSingleTours
}