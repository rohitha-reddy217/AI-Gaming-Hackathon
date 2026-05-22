import { Router } from "express";
import { listAnnouncementsController, createAnnouncementController } from "../controllers/announcementController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

const router = Router();

router.get("/", listAnnouncementsController);
router.post("/", requireAuth, requireRole("admin"), createAnnouncementController);

export default router;
