import { Request, Response, NextFunction } from "express";
import * as inquiryService from "./inquiry.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export async function createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await inquiryService.createInquiry(req.user!.userId, req.body);
    sendCreated(res, result, "Inquiry sent successfully");
  } catch (error) {
    next(error);
  }
}

export async function getInquiriesForProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await inquiryService.getInquiriesForProperty(
      req.params.propertyId,
      req.user!.userId
    );
    sendSuccess(res, result, "Inquiries fetched successfully");
  } catch (error) {
    next(error);
  }
}

export async function getMyInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await inquiryService.getMyInquiries(req.user!.userId);
    sendSuccess(res, result, "Your inquiries fetched successfully");
  } catch (error) {
    next(error);
  }
}

export async function deleteInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await inquiryService.deleteInquiry(req.params.id, req.user!.userId);
    sendSuccess(res, null, "Inquiry deleted successfully");
  } catch (error) {
    next(error);
  }
}

export async function getInquiriesForOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await inquiryService.getInquiriesForOwner(req.user!.userId);
    sendSuccess(res, result, "Owner inquiries fetched successfully");
  } catch (error) {
    next(error);
  }
}
