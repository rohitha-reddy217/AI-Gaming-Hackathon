import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Team } from "../models/Team";
import { Payment } from "../models/Payment";
import { User } from "../models/User";

export const publicStatsController = asyncHandler(async (_req: Request, res: Response) => {
  const [teams, users] = await Promise.all([Team.countDocuments(), User.countDocuments()]);
  const revenueAgg = await Payment.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  res.json({
    success: true,
    stats: {
      teams,
      users,
      revenue: revenueAgg[0]?.total ?? 0
    }
  });
});

export const publicDebugTeamsController = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.find().populate("leader members").sort({ createdAt: -1 });
  const users = await User.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    count: {
      teams: teams.length,
      users: users.length
    },
    teams,
    users
  });
});

