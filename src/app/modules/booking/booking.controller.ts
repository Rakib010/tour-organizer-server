import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";


const createBooking = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const decodeToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(payload, decodeToken.userId)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
})

const getUserBookings = catchAsync(
    async (req: Request, res: Response) => {
        const decodeToken = req.user as JwtPayload
        const bookings = await BookingService.getUserBookings(decodeToken.userId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings,
        });
    }
);

const getAllBookings = catchAsync(
    async (req: Request, res: Response) => {
        const bookings = await BookingService.getAllBookings();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings,
            // meta: {},
        });
    }
);





export const BookingController = {
    createBooking,
    getAllBookings,
    getUserBookings,

}