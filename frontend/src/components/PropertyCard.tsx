"use client";

import Link from "next/link";
import { Property } from "@/types";
import { formatPrice, formatArea, getPropertyTypeLabel } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0] || "/placeholder-property.jpg";

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-primary-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {getPropertyTypeLabel(property.propertyType)}
            </span>
          </div>
          {property.status !== "ACTIVE" && (
            <div className="absolute top-3 right-3">
              <span className="bg-accent-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {property.status}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {property.locality}, {property.city}
          </p>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.bedrooms} Bed
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {formatArea(property.areaSqFt)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-xl font-extrabold text-primary-700">
              {formatPrice(property.price)}
            </span>
            {property.bathrooms > 0 && (
              <span className="text-xs text-gray-500">
                {property.bathrooms} Bath
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}