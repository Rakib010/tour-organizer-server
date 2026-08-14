/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import axios from "axios";
import { envVars } from "../../config/env";
import { ISSLCommerz } from "./sslCommerz.interfaces";
import AppError from "../../errorHelpers/AppError";
import { Payment } from "../payment/payment.model";

const toFormBody = (payload: Record<string, string | number>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
        params.append(key, String(value ?? ""));
    }
    return params.toString();
};

const sslPaymentInit = async (payload: ISSLCommerz) => {
    try {
        const data = {
            store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd: envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            ipn_url: envVars.SSL.SSL_IPN_URL,
            shipping_method: "NO",
            product_name: "Tour Package",
            product_category: "Tour",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address || "Dhaka",
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: payload.phoneNumber,
            ship_name: payload.name,
            ship_add1: payload.address || "Dhaka",
            ship_add2: "N/A",
            ship_city: "Dhaka",
            ship_state: "Dhaka",
            ship_postcode: "1000",
            ship_country: "Bangladesh",
        };

        const response = await axios.post(
            envVars.SSL.SSL_PAYMENT_API,
            toFormBody(data),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                timeout: 25000,
            }
        );

        const result = response.data;

        if (!result?.GatewayPageURL) {
            const reason =
                result?.failedreason ||
                result?.status ||
                "SSLCommerz did not return a payment URL";
            throw new AppError(httpStatus.BAD_REQUEST, String(reason));
        }

        return result;
    } catch (error: any) {
        if (error instanceof AppError) throw error;

        const message =
            error?.response?.data?.failedreason ||
            error?.response?.data?.message ||
            error?.message ||
            "SSLCommerz payment init failed";

        throw new AppError(httpStatus.BAD_REQUEST, message);
    }
};

const validatePayment = async (payload: any) => {
    try {
        const response = await axios.get(
            `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.SSL_STORE_ID}&store_passwd=${encodeURIComponent(envVars.SSL.SSL_STORE_PASS)}`,
            { timeout: 20000 }
        );

        await Payment.updateOne(
            { transactionId: payload.tran_id },
            { paymentGatewayData: response.data },
            { runValidators: true }
        );
    } catch (error: any) {
        throw new AppError(401, `Payment Validation Error, ${error.message}`);
    }
};

export const SSLService = {
    sslPaymentInit,
    validatePayment,
};
