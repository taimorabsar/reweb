import { Request, Response, NextFunction } from "express";
import * as uploadService from "./upload.service";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";

export async function uploadFiles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new BadRequestError("No files uploaded");
    }

    const results = await uploadService.uploadMultipleFiles(files);
    sendSuccess(res, results, "Files uploaded successfully");
  } catch (error) {
    next(error);
  }
}
