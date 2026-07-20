"use client";

import { useState } from "react";
import { PropertySearchParams, PropertyType } from "@/types";

interface SearchFiltersProps {
  onSearch: (params: PropertySearchParams) => void;
  initialParams?: PropertySearchParams;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const BEDROOM_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4+" },
];

export default function SearchFilters({ onSearch, initialParams = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<PropertySearchParams>({
    city: initialParams.city || "",
    propertyType: initialParams.propertyType || undefined,
    minPrice: initialParams.minPrice || undefined,
    maxPrice: initialParams.maxPrice || undefined,
    bedrooms: initialParams.bedrooms || undefined,
    sort: initialParams.sort || "newest",
  });

  const updateFilter = <K extends keyof PropertySearchParams>(
    key: K,
    value: PropertySearchParams[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const cleaned: PropertySearchParams = {};
    if (filters.city) cleaned.city = filters.city;
    if (filters.propertyType) cleaned.propertyType = filters.propertyType;
    if (filters.minPrice) cleaned.minPrice = filters.minPrice;
    if (filters.maxPrice) cleaned.maxPrice = filters.maxPrice;
    if (filters.bedrooms !== undefined && filters.bedrooms > 0) cleaned.bedrooms = filters.bedrooms;
    if (filters.sort) cleaned.sort = filters.sort;
    onSearch(cleaned);
  };

  const handleReset = () => {
    setFilters({
      city: "",
      propertyType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      sort: "newest",
    });
    onSearch({ sort: "newest" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            placeholder="Search city..."
            value={filters.city || ""}
            onChange={(e) => updateFilter("city", e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={filters.propertyType || ""}
            onChange={(e) => updateFilter("propertyType", (e.target.value as PropertyType) || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            value={filters.bedrooms ?? ""}
            onChange={(e) => updateFilter("bedrooms", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            {BEDROOM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={filters.sort || "newest"}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSearch}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Search Properties
        </button>
        <button
          onClick={handleReset}
          className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
