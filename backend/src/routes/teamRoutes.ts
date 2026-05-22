import { Router } from "express";
import { createTeamController, getMyTeamController, updateTeamController, addMemberController } from "../controllers/teamController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, createTeamController);
router.get("/me", requireAuth, getMyTeamController);
router.patch("/:teamId", requireAuth, updateTeamController);
router.post("/:teamId/members", requireAuth, addMemberController);

export default router;
