import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    throw new ApiError(422, "Validation failed", result.error.flatten());
  }

  next();
};
