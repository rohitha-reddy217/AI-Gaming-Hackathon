import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/roles";
import { ApiError } from "../utils/apiError";

export const requireRole = (...roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (!role || !roles.includes(role)) {
    throw new ApiError(403, "Forbidden");
  }
  next();
};
