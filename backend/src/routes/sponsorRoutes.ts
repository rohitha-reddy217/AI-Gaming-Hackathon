import { Router } from "express";
import { listSponsorsController, createSponsorController, sponsorAnalyticsController } from "../controllers/sponsorController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

const router = Router();

router.get("/", listSponsorsController);
router.get("/analytics", sponsorAnalyticsController);
router.post("/", requireAuth, requireRole("admin"), createSponsorController);

export default router;
