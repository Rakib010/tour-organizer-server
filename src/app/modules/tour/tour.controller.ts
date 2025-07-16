import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { tourServices } from "./tour.service"
import { sendResponse } from "../../utils/sendResponse"

const createTour = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body

    const result = await tourServices.createTour(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Created Successfully",
        data: result
    })
})


export const tourController = {
    createTour
}