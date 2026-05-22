import { Router } from "express";
import {
	adminOverviewController,
	adminRegistrationTrendsController,
	adminCategoryDistributionController,
	adminListUsersController,
	adminListTeamsController,
	adminListPaymentsController,
	adminExportUsersCsvController,
	adminExportUsersXlsxController,
	adminExportTeamsCsvController,
	adminExportTeamsXlsxController,
	adminExportPaymentsCsvController,
	adminExportPaymentsXlsxController,
	adminEmailBroadcastController,
	adminChatbotLogsController,
	adminApproveTeamController
} from "../controllers/adminController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

const router = Router();

router.get("/overview", requireAuth, requireRole("admin"), adminOverviewController);
router.get("/registration-trends", requireAuth, requireRole("admin"), adminRegistrationTrendsController);
router.get("/category-distribution", requireAuth, requireRole("admin"), adminCategoryDistributionController);
router.get("/users", requireAuth, requireRole("admin"), adminListUsersController);
router.get("/teams", requireAuth, requireRole("admin"), adminListTeamsController);
router.patch("/teams/:id/approval", requireAuth, requireRole("admin"), adminApproveTeamController);
router.get("/payments", requireAuth, requireRole("admin"), adminListPaymentsController);
router.get("/exports/users.csv", requireAuth, requireRole("admin"), adminExportUsersCsvController);
router.get("/exports/users.xlsx", requireAuth, requireRole("admin"), adminExportUsersXlsxController);
router.get("/exports/teams.csv", requireAuth, requireRole("admin"), adminExportTeamsCsvController);
router.get("/exports/teams.xlsx", requireAuth, requireRole("admin"), adminExportTeamsXlsxController);
router.get("/exports/payments.csv", requireAuth, requireRole("admin"), adminExportPaymentsCsvController);
router.get("/exports/payments.xlsx", requireAuth, requireRole("admin"), adminExportPaymentsXlsxController);
router.post("/email/broadcast", requireAuth, requireRole("admin"), adminEmailBroadcastController);
router.get("/chatbot/logs", requireAuth, requireRole("admin"), adminChatbotLogsController);

export default router;
