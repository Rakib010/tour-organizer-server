/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interfaces";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interfaces";
import { getTransactionId } from "../../utils/getTransactionId";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId();

    const user = await User.findById(userId).select("name email phone address");
    if (!user?.phone || !user.address) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Please update your profile (phone & address) to book a tour"
        );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom title");
    if (!tour?.costFrom) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking amount");
    }

    const session = await Booking.startSession();
    session.startTransaction();

    let bookingDoc: any;

    try {
        const booking = await Booking.create(
            [
                {
                    user: userId,
                    status: BOOKING_STATUS.PENDING,
                    ...payload,
                },
            ],
            { session }
        );

        const payment = await Payment.create(
            [
                {
                    booking: booking[0]._id,
                    status: PAYMENT_STATUS.UNPAID,
                    transactionId,
                    amount,
                },
            ],
            { session }
        );

        bookingDoc = await Booking.findByIdAndUpdate(
            booking[0]._id,
            { payment: payment[0]._id },
            { new: true, runValidators: true, session }
        )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");

        // Commit first — do NOT hold the DB transaction open during SSL API call
        await session.commitTransaction();
    } catch (error: any) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    const sslPayload: ISSLCommerz = {
        address: user.address,
        email: user.email,
        phoneNumber: user.phone,
        name: user.name,
        amount,
        transactionId,
    };

    try {
        const sslPayment = await SSLService.sslPaymentInit(sslPayload);

        return {
            booking: bookingDoc,
            paymentUrl: sslPayment.GatewayPageURL,
        };
    } catch (error: any) {
        // Booking exists but payment gateway failed — mark unpaid booking as failed
        await Booking.findByIdAndUpdate(bookingDoc?._id, {
            status: BOOKING_STATUS.FAILED,
        });
        await Payment.findOneAndUpdate(
            { transactionId },
            { status: PAYMENT_STATUS.FAILED }
        );
        throw error;
    }
};

const getUserBookings = async (userId: string) => {
    const bookings = await Booking.find({ user: userId })
        .populate("tour", "title costFrom")
        .populate("payment")
        .sort({ createdAt: -1 });

    return bookings;
};

const getAllBookings = async () => {
    const bookings = await Booking.find()
        .populate("user", "name email phone address")
        .populate("tour", "title costFrom")
        .populate("payment")
        .sort({ createdAt: -1 });

    return bookings;
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getAllBookings,
};
