import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3Client, S3_BUCKET } from "../../config/s3";
import { env } from "../../config/env";
import { BadRequestError } from "../../utils/errors";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(
  file: Express.Multer.File
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new BadRequestError(
      `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestError(`File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  const ext = file.originalname.includes(".")
    ? file.originalname.split(".").pop() || "bin"
    : "bin";
  const key = `properties/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  const url = `https://${S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

  return { url, key };
}

export async function uploadMultipleFiles(
  files: Express.Multer.File[]
): Promise<UploadResult[]> {
  if (!files || files.length === 0) {
    throw new BadRequestError("At least one file is required");
  }

  if (files.length > MAX_FILES) {
    throw new BadRequestError(`Maximum ${MAX_FILES} files allowed`);
  }

  const results = await Promise.all(files.map((file) => uploadFile(file)));
  return results;
}
