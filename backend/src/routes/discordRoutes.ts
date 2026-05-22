import { Router } from "express";
import { discordVerifyController, discordFeedController } from "../controllers/discordController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/verify", requireAuth, discordVerifyController);
router.get("/feed", discordFeedController);

export default router;
