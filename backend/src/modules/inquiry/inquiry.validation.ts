import { z } from "zod";

export const createInquirySchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must not exceed 2000 characters"),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
