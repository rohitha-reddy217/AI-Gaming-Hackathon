import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Team } from "../models/Team";
import { User } from "../models/User";
import { generateId } from "../utils/ids";
import { ApiError } from "../utils/apiError";
import { createAuditLog } from "../services/auditService";
import { sendEmail } from "../services/emailService";
import { registrationSuccessTemplate } from "../services/emailTemplates";

export const createTeamController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { teamName, category, projectDetails } = req.body as {
    teamName: string;
    category: "student" | "professional" | "startup";
    projectDetails: { title: string; theme: string; techStack: string[]; description: string };
  };

  if (!teamName || !category || !projectDetails) {
    throw new ApiError(400, "Missing fields");
  }

  const leader = await User.findOne({ userId: req.user.userId });
  if (!leader) {
    throw new ApiError(404, "Leader not found");
  }

  const existing = await Team.findOne({ leader: leader._id });
  if (existing) {
    throw new ApiError(409, "Team already exists");
  }

  const team = await Team.create({
    teamId: generateId(),
    teamName,
    category,
    leader: leader._id,
    members: [],
    projectDetails,
    paymentStatus: "pending",
    discordVerified: false
  });

  res.json({ success: true, team });

  await createAuditLog({
    actorUserId: req.user.userId,
    action: "team.create",
    target: team.teamId
  });
});

export const getMyTeamController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const team = await Team.findOne({ $or: [{ leader: user._id }, { members: user._id }] }).populate("leader members");
  res.json({ success: true, team });
});

export const updateTeamController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { teamId } = req.params as { teamId: string };
  const update = req.body as Partial<{
    teamName: string;
    projectDetails: { title: string; theme: string; techStack: string[]; description: string };
  }>;

  const team = await Team.findOne({ teamId });
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (req.user.role !== "admin" && team.leader.toString() !== user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  const updated = await Team.findByIdAndUpdate(team._id, update, { new: true });
  res.json({ success: true, team: updated });

  await createAuditLog({
    actorUserId: req.user.userId,
    action: "team.update",
    target: team.teamId
  });
});

export const addMemberController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { teamId } = req.params as { teamId: string };
  const { email } = req.body as { email: string };

  const team = await Team.findOne({ teamId });
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const member = await User.findOne({ email });
  if (!member) {
    throw new ApiError(404, "User not found");
  }

  if (team.members.some((id) => id.toString() === member._id.toString())) {
    throw new ApiError(409, "Member already added");
  }

  team.members.push(member._id);
  await team.save();

  res.json({ success: true, team });

  await createAuditLog({
    actorUserId: req.user.userId,
    action: "team.add_member",
    target: team.teamId,
    metadata: { memberEmail: member.email }
  });
});
