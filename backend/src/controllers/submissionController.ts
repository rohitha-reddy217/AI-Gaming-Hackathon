import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Team } from "../models/Team";
import { Submission } from "../models/Submission";
import { ApiError } from "../utils/apiError";
import { uploadBufferToCloudinary } from "../services/cloudinaryService";
import { createAuditLog } from "../services/auditService";

export const submitProjectController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { teamId, githubLink, demoVideo } = req.body as {
    teamId: string;
    githubLink?: string;
    demoVideo?: string;
  };

  const team = await Team.findOne({ teamId });
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const files = req.files as Record<string, Express.Multer.File[]>;

  const pptFile = files?.ppt?.[0];
  const apkFile = files?.apk?.[0];
  const zipFile = files?.zip?.[0];
  const demoFile = files?.demo?.[0];

  const ensure = (file?: Express.Multer.File, allowed?: string[]) => {
    if (!file) return;
    if (allowed && !allowed.includes(file.mimetype)) {
      throw new ApiError(400, `Invalid file type: ${file.mimetype}`);
    }
  };

  ensure(pptFile, ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]);
  ensure(apkFile, ["application/vnd.android.package-archive", "application/octet-stream"]);
  ensure(zipFile, ["application/zip", "application/x-zip-compressed"]);
  ensure(demoFile, ["video/mp4", "video/webm", "video/quicktime"]);

  const pptUrl = pptFile
    ? await uploadBufferToCloudinary(pptFile.buffer, "incuxai/submissions", "raw")
    : undefined;
  const apkBuild = apkFile
    ? await uploadBufferToCloudinary(apkFile.buffer, "incuxai/submissions", "raw")
    : undefined;
  const zipBuild = zipFile
    ? await uploadBufferToCloudinary(zipFile.buffer, "incuxai/submissions", "raw")
    : undefined;
  const demoVideoUrl = demoFile
    ? await uploadBufferToCloudinary(demoFile.buffer, "incuxai/submissions", "video")
    : demoVideo;

  const submission = await Submission.findOneAndUpdate(
    { team: team._id },
    {
      githubLink,
      demoVideo: demoVideoUrl,
      pptUrl,
      apkBuild,
      zipBuild,
      submittedAt: new Date()
    },
    { upsert: true, new: true }
  );

  res.json({ success: true, submission });

  await createAuditLog({
    actorUserId: req.user.userId,
    action: "submission.upsert",
    target: team.teamId
  });
});
