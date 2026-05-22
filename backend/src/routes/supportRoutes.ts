import { Router } from "express";
import { createSupportTicketController, listSupportTicketsController, replySupportTicketController } from "../controllers/supportController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

const router = Router();

router.post("/", requireAuth, createSupportTicketController);
router.get("/", requireAuth, requireRole("admin"), listSupportTicketsController);
router.post("/:ticketId/reply", requireAuth, requireRole("admin"), replySupportTicketController);

export default router;
