import { Router } from "express";
import { paymentController } from "./paymet.controller";

const router = Router();

// api/v1/payment
router.post("/init-payment/:bookingId", paymentController.initPayment);
router.post("/success", paymentController.successPayment);
router.post("/fail", paymentController.failPayment);
router.post("/cancel", paymentController.cancelPayment);

export const paymentRoutes = router;