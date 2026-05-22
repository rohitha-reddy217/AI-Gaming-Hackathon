import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ApiError } from "../utils/apiError";

const CSRF_COOKIE = "csrf-token";

export const setCsrfCookie = (res: Response) => {
  const token = crypto.randomBytes(16).toString("hex");
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
  });
  return token;
};

export const csrfProtection = (req: Request, _res: Response, next: NextFunction) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }

  if (req.path.startsWith("/api/payments/webhook")) {
    return next();
  }

  const csrfHeader = req.headers["x-csrf-token"] as string | undefined;
  const csrfCookie = req.cookies?.[CSRF_COOKIE];

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    throw new ApiError(403, "CSRF token invalid");
  }

  next();
};
