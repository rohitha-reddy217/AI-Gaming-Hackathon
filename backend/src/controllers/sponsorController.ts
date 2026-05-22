import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Sponsor } from "../models/Sponsor";
import { Team } from "../models/Team";
import { Payment } from "../models/Payment";
import { ApiError } from "../utils/apiError";
import { createAuditLog } from "../services/auditService";

export const listSponsorsController = asyncHandler(async (_req: Request, res: Response) => {
  const sponsors = await Sponsor.find().sort({ createdAt: -1 });
  res.json({ success: true, sponsors });
});

export const createSponsorController = asyncHandler(async (req: Request, res: Response) => {
  const { name, sponsorTier, logo, links } = req.body as {
    name: string;
    sponsorTier: "platinum" | "gold" | "silver" | "community";
    logo: string;
    links: string[];
  };

  if (!name || !sponsorTier || !logo) {
    throw new ApiError(400, "Missing fields");
  }

  const sponsor = await Sponsor.create({ name, sponsorTier, logo, links });
  res.json({ success: true, sponsor });

  await createAuditLog({
    actorUserId: req.user?.userId,
    action: "sponsor.create",
    target: sponsor._id.toString()
  });
});

export const sponsorAnalyticsController = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.countDocuments();
  const distribution = await Team.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
  const revenue = await Payment.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  res.json({ success: true, teams, distribution, revenue: revenue[0]?.total ?? 0 });
});
