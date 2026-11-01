"use client";

import { useState } from "react"; import CitySelect from "@/components/CitySelect";
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

const BEDROOM_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4+" },
];

const FIELD_CLASS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors";

export default function SearchFilters({ onSearch, initialParams = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<PropertySearchParams>({
    city: initialParams.city || "",
    propertyType: initialParams.propertyType || undefined,
    purpose: initialParams.purpose || undefined,
    investment: initialParams.investment || undefined,
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
    cleaned.purpose = filters.purpose || "SALE";
    if (filters.investment) cleaned.investment = filters.investment;
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
      purpose: "SALE",
      investment: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      sort: "newest",
    });
    onSearch({ purpose: "SALE", sort: "newest" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
      onKeyDown={handleKeyDown}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <CitySelect
            value={filters.city || ""}
            onChange={(v) => updateFilter("city", v)}
            emptyLabel="All cities"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={filters.propertyType || ""}
            onChange={(e) => updateFilter("propertyType", (e.target.value as PropertyType) || undefined)}
            className={FIELD_CLASS}
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
            className={FIELD_CLASS}
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
            placeholder="Min (PKR)"
            value={filters.minPrice || ""}
            onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            placeholder="Max (PKR)"
            value={filters.maxPrice || ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="flt-purpose" className="text-sm font-medium text-gray-700">
            Listing type
          </label>
          <select
            id="flt-purpose"
            value={filters.purpose || "SALE"}
            onChange={(e) => updateFilter("purpose", e.target.value as "SALE" | "RENT")}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          >
          
            <option value="SALE">Sale</option>
            <option value="RENT">Rent</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={filters.investment === "true"}
            onChange={(e) => updateFilter("investment", e.target.checked ? "true" : undefined)}
            className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-600"
          />
          Investment properties only
        </label>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button onClick={handleSearch} className="btn-primary">
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