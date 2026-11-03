import { PropertySearchParams } from "@/types";
import { formatPrice } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  VILLA: "Villa",
  PLOT: "Plot",
  COMMERCIAL: "Commercial",
};

// Keep only the filters a saved search remembers.
export function cleanSearchParams(params: PropertySearchParams): PropertySearchParams {
  const out: PropertySearchParams = {};
  if (params.city) out.city = params.city;
  if (params.propertyType) out.propertyType = params.propertyType;
  if (params.purpose) out.purpose = params.purpose;
  if (params.investment) out.investment = params.investment;
  if (params.minPrice) out.minPrice = params.minPrice;
  if (params.maxPrice) out.maxPrice = params.maxPrice;
  if (params.bedrooms) out.bedrooms = params.bedrooms;
  if (params.sort) out.sort = params.sort;
  return out;
}

export function describeSearch(params: PropertySearchParams): string {
  const parts: string[] = [];
  parts.push(params.purpose === "RENT" ? "Rent" : "Sale");
  if (params.city) parts.push(params.city);
  if (params.propertyType) parts.push(TYPE_LABELS[params.propertyType] ?? params.propertyType);
  if (params.investment) parts.push("Investment");
  if (params.bedrooms) parts.push(`${params.bedrooms}+ beds`);
  if (params.minPrice && params.maxPrice) {
    parts.push(`${formatPrice(params.minPrice)} to ${formatPrice(params.maxPrice)}`);
  } else if (params.minPrice) {
    parts.push(`From ${formatPrice(params.minPrice)}`);
  } else if (params.maxPrice) {
    parts.push(`Up to ${formatPrice(params.maxPrice)}`);
  }
  return parts.join(" · ");
}

export function searchToQuery(params: PropertySearchParams): string {
  const query = new URLSearchParams();
  Object.entries(cleanSearchParams(params)).forEach(([key, value]) => {
    query.set(key, String(value));
  });
  return query.toString();
}