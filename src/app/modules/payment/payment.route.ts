/*
 * tour-server previous implementation (kept for reference, not removed)
 *
 * import { Router } from "express";
 * import { paymentController } from "./paymet.controller";
 * import { checkAuth } from "../../middlewares/checkAuth";
 * import { Role } from "../user/user.interface";
 *
 * const router = Router();
 *
 * // api/v1/payment
 * router.post("/init-payment/:bookingId", paymentController.initPayment);
 * router.post("/success", paymentController.successPayment);
 * router.post("/fail", paymentController.failPayment);
 * router.post("/cancel", paymentController.cancelPayment);
 *
 * router.get('/invoice/:paymentId',
 *     checkAuth(...Object.values(Role)),
 *     paymentController.getInvoiceDownloadUrl)
 *
 * router.post("/validate-payment", paymentController.validatePayment)
 *
 * export const paymentRoutes = router;
 */

import { Router } from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// api/v1/payment - SSLCommerz redirects with POST; GET added for fallback
router.post("/init-payment/:bookingId", paymentController.initPayment);
router.post("/success", paymentController.successPayment);
router.get("/success", paymentController.successPayment);
router.post("/fail", paymentController.failPayment);
router.get("/fail", paymentController.failPayment);
router.post("/cancel", paymentController.cancelPayment);
router.get("/cancel", paymentController.cancelPayment);

router.get(
  "/invoice/:paymentId",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.GUIDE),
  paymentController.getInvoiceDownloadUrl,
);

router.post("/validate-payment", paymentController.validatePayment);

export const paymentRoutes = router;