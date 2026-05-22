import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { chatWithOpenAI } from "../services/openaiService";
import { ChatbotLog } from "../models/ChatbotLog";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";

export const chatbotController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { message, history } = req.body as {
    message: string;
    history: { role: "user" | "assistant"; content: string }[];
  };

  if (!message) {
    throw new ApiError(400, "Message is required");
  }

  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let response = "I can help with registration, submissions, payments, and Discord setup.";
  try {
    response = await chatWithOpenAI({ message, history: history || [] });
  } catch {
    response = "I can help with registration, submissions, payments, and Discord setup.";
  }

  await ChatbotLog.create({ user: user._id, message, response });

  res.json({ success: true, response });
});
