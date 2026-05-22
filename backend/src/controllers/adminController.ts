import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/User";
import { Team } from "../models/Team";
import { Payment } from "../models/Payment";
import { Submission } from "../models/Submission";
import { toCsv, toXlsxBuffer } from "../utils/exporter";
import { sendEmail } from "../services/emailService";
import { broadcastTemplate } from "../services/emailTemplates";
import { ChatbotLog } from "../models/ChatbotLog";

export const adminOverviewController = asyncHandler(async (_req: Request, res: Response) => {
  const [users, teams, payments, submissions] = await Promise.all([
    User.countDocuments(),
    Team.countDocuments(),
    Payment.countDocuments(),
    Submission.countDocuments()
  ]);

  const revenue = await Payment.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  res.json({
    success: true,
    metrics: {
      users,
      teams,
      payments,
      submissions,
      revenue: revenue[0]?.total ?? 0
    }
  });
});

export const adminRegistrationTrendsController = asyncHandler(async (_req: Request, res: Response) => {
  const trend = await Team.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({ success: true, trend });
});

export const adminCategoryDistributionController = asyncHandler(async (_req: Request, res: Response) => {
  const distribution = await Team.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  res.json({ success: true, distribution });
});

export const adminListUsersController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const adminListTeamsController = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.find().populate("leader members").sort({ createdAt: -1 });
  res.json({ success: true, teams });
});

export const adminListPaymentsController = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await Payment.find().populate("team").sort({ createdAt: -1 });
  res.json({ success: true, payments });
});

export const adminExportUsersCsvController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find();
  const rows = users.map((user) => ({
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile ?? ""
  }));
  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=users.csv");
  res.send(csv);
});

export const adminExportUsersXlsxController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find();
  const rows = users.map((user) => ({
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile ?? ""
  }));
  const buffer = toXlsxBuffer(rows, "Users");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
  res.send(buffer);
});

export const adminExportTeamsCsvController = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.find();
  const rows = teams.map((team) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    category: team.category,
    paymentStatus: team.paymentStatus,
    discordVerified: team.discordVerified
  }));
  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=teams.csv");
  res.send(csv);
});

export const adminExportTeamsXlsxController = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.find();
  const rows = teams.map((team) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    category: team.category,
    paymentStatus: team.paymentStatus,
    discordVerified: team.discordVerified
  }));
  const buffer = toXlsxBuffer(rows, "Teams");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=teams.xlsx");
  res.send(buffer);
});

export const adminExportPaymentsCsvController = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await Payment.find();
  const rows = payments.map((payment) => ({
    transactionId: payment.transactionId,
    amount: payment.amount,
    status: payment.status,
    razorpayOrderId: payment.razorpayOrderId
  }));
  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=payments.csv");
  res.send(csv);
});

export const adminExportPaymentsXlsxController = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await Payment.find();
  const rows = payments.map((payment) => ({
    transactionId: payment.transactionId,
    amount: payment.amount,
    status: payment.status,
    razorpayOrderId: payment.razorpayOrderId
  }));
  const buffer = toXlsxBuffer(rows, "Payments");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=payments.xlsx");
  res.send(buffer);
});

export const adminEmailBroadcastController = asyncHandler(async (req: Request, res: Response) => {
  const { subject, message } = req.body as { subject: string; message: string };
  if (!subject || !message) {
    res.status(400).json({ success: false, message: "Missing fields" });
    return;
  }

  const users = await User.find();
  await Promise.all(
    users.map((user) =>
      sendEmail({
        to: user.email,
        subject,
        html: broadcastTemplate(subject, message)
      })
    )
  );

  res.json({ success: true, count: users.length });
});

export const adminChatbotLogsController = asyncHandler(async (_req: Request, res: Response) => {
  const logs = await ChatbotLog.find().populate("user").sort({ createdAt: -1 }).limit(200);
  res.json({ success: true, logs });
});

export const adminApproveTeamController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: "approved" | "rejected" };

  if (!status || !["approved", "rejected"].includes(status)) {
    res.status(400).json({ success: false, message: "Invalid status value" });
    return;
  }

  const team = await Team.findByIdAndUpdate(id, { approvalStatus: status }, { new: true });
  if (!team) {
    res.status(404).json({ success: false, message: "Team not found" });
    return;
  }

  res.json({ success: true, team });
});
