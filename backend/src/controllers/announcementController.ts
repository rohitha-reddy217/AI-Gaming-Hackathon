import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Announcement } from "../models/Announcement";
import { ApiError } from "../utils/apiError";
import { createAuditLog } from "../services/auditService";
import { postAnnouncementToDiscord } from "../services/discordService";

export const listAnnouncementsController = asyncHandler(async (req: Request, res: Response) => {
  const visibility = (req.query.visibility as string) || "all";
  const filter = visibility === "all" ? {} : { visibility };
  const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, announcements });
});

export const createAnnouncementController = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, visibility } = req.body as {
    title: string;
    content: string;
    visibility: "all" | "student" | "professional" | "startup" | "admin";
  };

  if (!title || !content || !visibility) {
    throw new ApiError(400, "Missing fields");
  }

  const announcement = await Announcement.create({ title, content, visibility });
  res.json({ success: true, announcement });

  await createAuditLog({
    actorUserId: req.user?.userId,
    action: "announcement.create",
    target: announcement._id.toString()
  });

  await postAnnouncementToDiscord(title, content);
});
