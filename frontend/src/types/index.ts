export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count?: { properties: number };
}

export type PropertyType = "APARTMENT" | "HOUSE" | "VILLA" | "PLOT" | "COMMERCIAL";
export type PropertyStatus = "ACTIVE" | "SOLD" | "RENTED";

export interface Property {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  city: string;
  locality: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "name" | "email" | "phone">;
}

export interface Reply {
  id: string;
  inquiryId: string;
  senderId: string;
  message: string;
  createdAt: string;
  sender: Pick<User, "id" | "name" | "email">;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  senderId: string;
  message: string;
  createdAt: string;
  property: Pick<Property, "id" | "title" | "city" | "locality" | "price"> & {
    user: Pick<User, "id" | "name" | "email">;
  };
  sender: Pick<User, "id" | "name" | "email">;
  replies: Reply[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PropertySearchParams {
  city?: string;
  locality?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sort?: string;
  cursor?: string;
  limit?: number;
}

export interface UploadResult {
  url: string;
  key: string;
}
