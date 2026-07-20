import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  price: z.number().positive("Price must be positive").max(100000000),
  city: z.string().min(1, "City is required").max(100),
  locality: z.string().min(1, "Locality is required").max(200),
  propertyType: z.enum(["APARTMENT", "HOUSE", "VILLA", "PLOT", "COMMERCIAL"]),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  areaSqFt: z.number().positive("Area must be positive").max(100000),
  images: z.array(z.string().url()).min(1, "At least one image is required").max(10),
  status: z.enum(["ACTIVE", "SOLD", "RENTED"]).optional().default("ACTIVE"),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  city: z.string().optional(),
  locality: z.string().optional(),
  propertyType: z.enum(["APARTMENT", "HOUSE", "VILLA", "PLOT", "COMMERCIAL"]).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "SOLD", "RENTED"]).optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "oldest"]).optional().default("newest"),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>;
