import { Router } from "express";
import { getAmbassadorProfileController, getAmbassadorLeaderboardController } from "../controllers/campusAmbassadorController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, getAmbassadorProfileController);
router.get("/leaderboard", getAmbassadorLeaderboardController);

export default router;
