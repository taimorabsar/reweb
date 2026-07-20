import { z } from "zod";

export const createReplySchema = z.object({
  inquiryId: z.string().uuid("Invalid inquiry ID"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must not exceed 2000 characters"),
});

export type CreateReplyInput = z.infer<typeof createReplySchema>;
