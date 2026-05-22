import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("SERVER ERROR:", err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? null
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};
