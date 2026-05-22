import { Router } from "express";
import { chatbotController } from "../controllers/chatbotController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, chatbotController);

export default router;
