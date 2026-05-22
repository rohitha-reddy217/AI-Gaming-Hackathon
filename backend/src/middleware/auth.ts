import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../types/roles";

export type AuthUser = {
  userId: string;
  role: UserRole;
  email: string;
  name?: string;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    throw new ApiError(401, "Invalid token");
  }
};
