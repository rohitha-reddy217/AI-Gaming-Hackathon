import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { generateOtp, verifyOtp } from "../services/otpService";
import { User } from "../models/User";
import { generateId } from "../utils/ids";
import { signJwt } from "../services/jwtService";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../types/roles";
import { setCsrfCookie } from "../middleware/csrf";
import bcrypt from "bcryptjs";

export const sendOtpController = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  await generateOtp(email);
  res.json({ success: true });
});

export const verifyOtpController = asyncHandler(async (req: Request, res: Response) => {
  const { email, code, name, role, mobile } = req.body as {
    email: string;
    code: string;
    name: string;
    role: UserRole;
    mobile?: string;
  };

  if (!email || !code || !name || !role) {
    throw new ApiError(400, "Missing fields");
  }

  const valid = await verifyOtp(email, code);
  if (!valid) {
    throw new ApiError(401, "Invalid or expired OTP");
  }

  const existing = await User.findOne({ email });
  const user = existing
    ? await User.findByIdAndUpdate(
        existing._id,
        { name, role, mobile },
        { new: true }
      )
    : await User.create({
        userId: generateId(),
        name,
        role,
        email,
        mobile
      });

  if (!user) {
    throw new ApiError(500, "Failed to create or update user");
  }

  const token = signJwt({ userId: user.userId, role: user.role, email: user.email, name: user.name });

  res.json({
    success: true,
    token,
    user: {
      userId: user.userId,
      role: user.role,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      discordId: user.discordId,
      avatar: user.avatar
    }
  });
});

export const meController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findOne({ userId: req.user.userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    success: true,
    user: {
      userId: user.userId,
      role: user.role,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      discordId: user.discordId,
      avatar: user.avatar
    }
  });
});

export const csrfController = asyncHandler(async (_req: Request, res: Response) => {
  const token = setCsrfCookie(res);
  res.json({ success: true, csrfToken: token });
});

export const adminLoginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    throw new ApiError(400, "Missing credentials");
  }

  const user = await User.findOne({ email, role: "admin" });
  if (!user || !user.passwordHash) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signJwt({ userId: user.userId, role: user.role, email: user.email, name: user.name });
  res.json({ success: true, token });
});
