import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { exchangeDiscordCode, fetchDiscordUser, addMemberRole, fetchDiscordAnnouncements, sendWelcomeMessage } from "../services/discordService";
import { User } from "../models/User";
import { Team } from "../models/Team";
import { ApiError } from "../utils/apiError";

export const discordVerifyController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { code } = req.body as { code: string };
  if (!code) {
    throw new ApiError(400, "Missing code");
  }

  const tokenData = await exchangeDiscordCode(code);
  const discordUser = await fetchDiscordUser(tokenData.access_token);

  const user = await User.findOneAndUpdate(
    { userId: req.user.userId },
    { discordId: discordUser.id },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await addMemberRole({ userId: discordUser.id, role: user.role === "professional" ? "professional" : user.role === "startup" ? "startup" : "student" });

  await Team.updateMany({ leader: user._id }, { discordVerified: true });

  const team = await Team.findOne({ leader: user._id });
  await sendWelcomeMessage(discordUser.id, team?.teamId);

  res.json({ success: true, discordId: discordUser.id });
});

export const discordFeedController = asyncHandler(async (_req: Request, res: Response) => {
  const feed = await fetchDiscordAnnouncements();
  res.json({ success: true, feed });
});
