import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/response";
import { env } from "../config/env";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  console.error("Unexpected error:", err);

  const message =
    env.NODE_ENV === "production" ? "Internal server error" : err.message;

  sendError(res, message, 500);
}
