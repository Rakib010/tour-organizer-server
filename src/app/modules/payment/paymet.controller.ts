import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { envVars } from "../../config/env";
import { paymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import { SSLService } from "../sslCommerz/sslCommerz.service";


// paymentUrl direct pawa jabe and payment korbe 
const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId
    const result = await paymentServices.initPayment(bookingId)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "payment done",
        data: result,
    });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
    // query ta ssl commerz service er success_url(like transactionId pass korse) theke pacchi 
    const query = req.query
    const result = await paymentServices.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await paymentServices.failPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await paymentServices.cancelPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const getInvoiceDownloadUrl = catchAsync(async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const result = await paymentServices.getInvoiceDownloadUrl(paymentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Invoice download URL retrieved successfully",
        data: result,
    });
}
);

const validatePayment = catchAsync(async (req: Request, res: Response) => {
   // console.log("sslcommerz IPN url body ", req.body)

    await SSLService.validatePayment(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment validated successfully",
        data: null,
    });
}
);

export const paymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl,
    validatePayment
}