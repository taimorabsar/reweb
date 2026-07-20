import { Request, Response, NextFunction } from "express";
import * as propertyService from "./property.service";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";

export async function createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await propertyService.createProperty(req.user!.userId, req.body);
    sendCreated(res, result, "Property created successfully");
  } catch (error) {
    next(error);
  }
}

export async function getProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await propertyService.getProperty(req.params.id);
    sendSuccess(res, result, "Property fetched successfully");
  } catch (error) {
    next(error);
  }
}

export async function updateProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await propertyService.updateProperty(req.params.id, req.user!.userId, req.body);
    sendSuccess(res, result, "Property updated successfully");
  } catch (error) {
    next(error);
  }
}

export async function deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await propertyService.deleteProperty(req.params.id, req.user!.userId);
    sendSuccess(res, null, "Property deleted successfully");
  } catch (error) {
    next(error);
  }
}

export async function searchProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await propertyService.searchProperties(req.query as any);
    sendPaginated(res, result.data, result.total, result.nextCursor);
  } catch (error) {
    next(error);
  }
}

export async function getSimilarProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await propertyService.getSimilarProperties(req.params.id);
    sendSuccess(res, result, "Similar properties fetched");
  } catch (error) {
    next(error);
  }
}

export async function getMyProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await propertyService.getMyProperties(req.user!.userId);
    sendSuccess(res, result, "My properties fetched successfully");
  } catch (error) {
    next(error);
  }
}
