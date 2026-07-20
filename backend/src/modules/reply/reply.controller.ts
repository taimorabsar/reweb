import { Request, Response, NextFunction } from "express";
import * as replyService from "./reply.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export async function createReply(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await replyService.createReply(req.user!.userId, req.body);
    sendCreated(res, result, "Reply sent successfully");
  } catch (error) {
    next(error);
  }
}

export async function getRepliesForInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await replyService.getRepliesForInquiry(
      req.params.inquiryId,
      req.user!.userId
    );
    sendSuccess(res, result, "Replies fetched successfully");
  } catch (error) {
    next(error);
  }
}
