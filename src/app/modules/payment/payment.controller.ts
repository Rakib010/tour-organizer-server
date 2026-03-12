import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { envVars } from "../../config/env";
import { paymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import { SSLService } from "../sslCommerz/sslCommerz.service";

// paymentUrl direct pawa jabe and payment korbe
const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await paymentServices.initPayment(bookingId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "payment done",
    data: result,
  });
});

// Merge query + body (SSLCommerz sends tran_id in body, we use transactionId)
const getPaymentParams = (req: Request): Record<string, string> => {
  const query = (req.query as Record<string, string>) || {};
  const body = (req.body as Record<string, string>) || {};
  return {
    transactionId: body.tran_id || body.transactionId || query.transactionId || "",
    amount: body.amount || query.amount || "",
    status: body.status || query.status || "success",
    message: body.message || query.message || "",
  };
};

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = getPaymentParams(req);
  const redirectBase = envVars.SSL.SSL_SUCCESS_FRONTEND_URL;
  const params = `transactionId=${encodeURIComponent(query.transactionId)}&message=${encodeURIComponent(
    query.message,
  )}&amount=${encodeURIComponent(query.amount)}&status=${encodeURIComponent(query.status || "success")}`;

  try {
    await paymentServices.successPayment(query);
    res.redirect(`${redirectBase}?${params}`);
  } catch (err: any) {
    const errMsg = err?.message || "Payment processing failed";
    res.redirect(
      `${redirectBase}?${params}&error=1&errorMessage=${encodeURIComponent(errMsg)}`,
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = getPaymentParams(req);
  const params = `transactionId=${encodeURIComponent(query.transactionId)}&message=${encodeURIComponent(
    query.message,
  )}&amount=${encodeURIComponent(query.amount)}&status=${encodeURIComponent(query.status || "fail")}`;
  try {
    await paymentServices.failPayment(query);
  } finally {
    res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?${params}`);
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = getPaymentParams(req);
  const params = `transactionId=${encodeURIComponent(query.transactionId)}&message=${encodeURIComponent(
    query.message,
  )}&amount=${encodeURIComponent(query.amount)}&status=${encodeURIComponent(query.status || "cancel")}`;
  try {
    await paymentServices.cancelPayment(query);
  } finally {
    res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?${params}`);
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
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await SSLService.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validated successfully",
    data: null,
  });
});

export const paymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadUrl,
  validatePayment,
};

