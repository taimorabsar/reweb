"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Property, PropertySearchParams } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import SearchFilters from "@/components/SearchFilters";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Lowest price" },
  { value: "price_desc", label: "Highest price" },
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<PropertySearchParams>({});

  const loadProperties = useCallback(async (params: PropertySearchParams, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await api.searchProperties({ ...params, limit: 12 });
      if (append) {
        setProperties((prev) => [...prev, ...res.data]);
      } else {
        setProperties(res.data);
      }
      setTotal(res.pagination.total);
      setNextCursor(res.pagination.nextCursor);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const initialParams: PropertySearchParams = {};
    const city = searchParams.get("city");
    if (city) initialParams.city = city;
    const type = searchParams.get("propertyType");
    if (type) initialParams.propertyType = type as Property["propertyType"];
    const purpose = searchParams.get("purpose");
    initialParams.purpose = purpose === "RENT" ? "RENT" : "SALE";
    if (searchParams.get("investment") === "true") initialParams.investment = "true";
    const sort = searchParams.get("sort");
    if (sort) initialParams.sort = sort;
    setCurrentParams(initialParams);
    loadProperties(initialParams);
  }, [searchParams, loadProperties]);

  const handleSearch = (params: PropertySearchParams) => {
    setCurrentParams(params);
    loadProperties(params);
  };

  const handleSortChange = (sort: string) => {
    handleSearch({ ...currentParams, sort });
  };

  const loadMore = () => {
    if (nextCursor) {
      loadProperties({ ...currentParams, cursor: nextCursor }, true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
      </div>

      <SearchFilters key={JSON.stringify(currentParams)} onSearch={handleSearch} initialParams={currentParams} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-gray-900">
          Results: {loading ? "..." : `${total.toLocaleString("en-PK")} ${total === 1 ? "Listing" : "Listings"}`}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            id="sort-by"
            value={currentParams.sort || "newest"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {nextCursor && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-secondary"
                >
                  {loadingMore ? "Loading..." : "Load More Properties"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}