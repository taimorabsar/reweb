export type AccountType = "OWNER" | "AGENT" | "AGENCY";
export type PropertyType = "APARTMENT" | "HOUSE" | "VILLA" | "PLOT" | "COMMERCIAL";
export type PropertyStatus = "ACTIVE" | "SOLD" | "RENTED";
export type ListingPurpose = "SALE" | "RENT";
export type Furnishing = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
export type Possession = "READY" | "UNDER_CONSTRUCTION";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "ADMIN";
  accountType?: AccountType;
  agencyName?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  _count?: { properties: number };
}

export interface Property {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  city: string;
  locality: string;
  propertyType: PropertyType;
  purpose?: ListingPurpose;
  isInvestment?: boolean;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  yearBuilt?: number | null;
  floors?: number | null;
  parkingSpaces?: number | null;
  furnishing?: Furnishing | null;
  possession?: Possession | null;
  features?: string[];
  images: string[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "name" | "email" | "phone" | "accountType" | "agencyName" | "avatarUrl">;
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
  purpose?: ListingPurpose;
  investment?: "true";
  sellerType?: AccountType;
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