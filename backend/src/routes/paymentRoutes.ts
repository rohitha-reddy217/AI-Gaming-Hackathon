import { Router } from "express";
import { createPaymentOrderController, listTeamPaymentsController, razorpayWebhookController, refundPaymentController, verifyPaymentController } from "../controllers/paymentController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

const router = Router();

router.post("/order", requireAuth, createPaymentOrderController);
router.post("/verify", requireAuth, verifyPaymentController);
router.get("/:teamId", requireAuth, listTeamPaymentsController);
router.post("/webhook", razorpayWebhookController);
router.post("/refund", requireAuth, requireRole("admin"), refundPaymentController);

export default router;
