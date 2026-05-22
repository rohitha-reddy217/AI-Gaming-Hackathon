import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";

export const updateMeController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { name, mobile, avatar } = req.body as { name?: string; mobile?: string; avatar?: string };

  const user = await User.findOneAndUpdate(
    { userId: req.user.userId },
    { name, mobile, avatar },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, user });
});
