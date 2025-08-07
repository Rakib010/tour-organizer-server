/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from './booking.model';
import { Payment } from '../payment/payment.model';
import { PAYMENT_STATUS } from '../payment/payment.interfaces';
import { Tour } from '../tour/tour.model';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interfaces';
import { getTransactionId } from '../../utils/getTransactionId';


/*
 * Duplicate DB Collections / replica
 * Replica DB -> [ Create Booking -> Create Payment ->  Update Booking -> Error] -> Real DB
 */


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId()

    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const user = await User.findById(userId)

        if (!user?.phone || !user.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile to book a tour")
        }

        const tour = await Tour.findById(payload.tour).select("costFrom")

        if (!tour?.costFrom) {
            throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!")
        }

        const amount = Number(tour.costFrom) * Number(payload.guestCount)


        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload,
        }], { session })

        const bookingId = [...user.bookings as any, booking[0]._id]
        await User.findByIdAndUpdate(user._id, { bookings: bookingId }, { runValidators: true, session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session })

        // populate like objectId set kora ashe akhn populate kore user or tour sob gula data pawa jabe
        const updateBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")

        // send to sslCommerz service
        const userAddress = (updateBooking?.user as any).address
        const userEmail = (updateBooking?.user as any).email
        const userPhoneNumber = (updateBooking?.user as any).phone
        const userName = (updateBooking?.user as any).name


        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId,

        }
        //  console.log("sslpayload", sslPayload)

        const sslPayment = await SSLService.sslPaymentInit(sslPayload)

        await session.commitTransaction() // transaction
        session.endSession()

        return {
            booking: updateBooking,
            paymentUrl: sslPayment.GatewayPageURL,
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction() //rollback
        session.endSession()
        throw error
    }
};

const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {
    return {}
}




export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};