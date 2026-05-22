import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CampusAmbassador } from "../models/CampusAmbassador";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";
import { generateId } from "../utils/ids";

export const getAmbassadorProfileController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let ambassador = await CampusAmbassador.findOne({ user: user._id });
  if (!ambassador) {
    ambassador = await CampusAmbassador.create({
      user: user._id,
      referralCode: generateId().slice(0, 8).toUpperCase(),
      points: 0,
      leaderboardRank: 0
    });
  }

  res.json({ success: true, ambassador });
});

export const getAmbassadorLeaderboardController = asyncHandler(async (_req: Request, res: Response) => {
  const leaderboard = await CampusAmbassador.find().sort({ points: -1 }).limit(50);
  res.json({ success: true, leaderboard });
});
