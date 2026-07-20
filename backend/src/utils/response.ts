import { Response } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown[];
  pagination?: {
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

export function sendSuccess<T>(res: Response, data: T, message = "Success", statusCode = 200): void {
  const response: ApiResponse<T> = { success: true, message, data };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = "Created successfully"): void {
  sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  nextCursor: string | null,
  message = "Success"
): void {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination: {
      nextCursor,
      hasMore: nextCursor !== null,
      total,
    },
  };
  res.status(200).json(response);
}

export function sendError(res: Response, message: string, statusCode = 500, errors?: unknown[]): void {
  const response: ApiResponse = { success: false, message };
  if (errors) {
    response.errors = errors;
  }
  res.status(statusCode).json(response);
}
