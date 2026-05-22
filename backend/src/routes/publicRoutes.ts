import { Router } from "express";
import { publicStatsController, publicDebugTeamsController } from "../controllers/publicController";

const router = Router();

router.get("/stats", publicStatsController);
router.get("/debug-teams", publicDebugTeamsController);

export default router;
