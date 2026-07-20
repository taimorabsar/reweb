import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.register(req.body);
    sendCreated(res, result, "Registration successful");
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.refreshTokens(req.body.refreshToken);
    sendSuccess(res, result, "Token refreshed successfully");
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.getProfile(req.user!.userId);
    sendSuccess(res, result, "Profile fetched successfully");
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await authService.logout(req.user!.userId);
    sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
}
