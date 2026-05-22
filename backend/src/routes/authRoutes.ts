import { Router } from "express";
import { sendOtpController, verifyOtpController, meController, csrfController, adminLoginController } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/otp/send", sendOtpController);
router.post("/otp/verify", verifyOtpController);
router.get("/me", requireAuth, meController);
router.get("/csrf", csrfController);
router.post("/admin/login", adminLoginController);

export default router;
