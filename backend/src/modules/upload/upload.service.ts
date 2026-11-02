import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../config/env";
import { BadRequestError } from "../../utils/errors";

// Local-disk storage for development. Photos are saved in backend/uploads/properties
// and served by the API at /uploads/... Switch to cloud storage before launch.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "properties");
const PUBLIC_URL = (process.env.PUBLIC_URL || `http://localhost:${env.PORT}`).replace(/\/$/, "");

interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(
  file: Express.Multer.File
): Promise<UploadResult> {
  const ext = ALLOWED_TYPES[file.mimetype];
  if (!ext) {
    throw new BadRequestError(
      `Invalid file type: ${file.mimetype}. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestError(`File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  const fileName = `${uuidv4()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, fileName), file.buffer);

  const key = `properties/${fileName}`;
  const url = `${PUBLIC_URL}/uploads/${key}`;

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