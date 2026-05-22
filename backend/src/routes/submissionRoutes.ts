import { Router } from "express";
import { submitProjectController } from "../controllers/submissionController";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "ppt", maxCount: 1 },
    { name: "apk", maxCount: 1 },
    { name: "zip", maxCount: 1 },
    { name: "demo", maxCount: 1 }
  ]),
  submitProjectController
);

export default router;
