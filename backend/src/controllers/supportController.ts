import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { SupportTicket } from "../models/SupportTicket";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";
import { generateId } from "../utils/ids";
import { createAuditLog } from "../services/auditService";

export const createSupportTicketController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { category, message } = req.body as { category: "registration" | "payment" | "technical" | "general"; message: string };
  if (!category || !message) {
    throw new ApiError(400, "Missing fields");
  }

  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const ticket = await SupportTicket.create({
    ticketId: generateId(),
    user: user._id,
    category,
    status: "open",
    messages: [{ sender: "user", message, createdAt: new Date() }]
  });

  res.json({ success: true, ticket });

  await createAuditLog({
    actorUserId: req.user.userId,
    action: "support.create",
    target: ticket.ticketId
  });
});

export const listSupportTicketsController = asyncHandler(async (_req: Request, res: Response) => {
  const tickets = await SupportTicket.find().sort({ createdAt: -1 });
  res.json({ success: true, tickets });
});

export const replySupportTicketController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const { message, sender } = req.body as { message: string; sender: "user" | "admin" };

  const ticket = await SupportTicket.findOne({ ticketId });
  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  ticket.messages.push({ sender, message, createdAt: new Date() });
  await ticket.save();

  res.json({ success: true, ticket });

  await createAuditLog({
    actorUserId: req.user?.userId,
    action: "support.reply",
    target: ticket.ticketId
  });
});
