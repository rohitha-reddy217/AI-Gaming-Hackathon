import { Router } from "express";
import { updateMeController } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.patch("/me", requireAuth, updateMeController);

export default router;
