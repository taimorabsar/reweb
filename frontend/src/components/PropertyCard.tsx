"use client";

import Link from "next/link";
import { Property } from "@/types";
import { formatPrice, getPropertyTypeLabel, getPurposeLabel } from "@/lib/utils";
import PropertyStats from "@/components/PropertyStats";
import TimeAgo from "@/components/TimeAgo"; import FavoriteButton from "@/components/FavoriteButton";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0] || "/placeholder-property.jpg";
  const isRent = property.purpose === "RENT";

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-primary-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {getPropertyTypeLabel(property.propertyType)}
            </span>
            <span className="bg-white text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {getPurposeLabel(property.purpose)}
            </span>
          </div>
          {property.status !== "ACTIVE" && (
            <div className="absolute top-3 right-14">
              <span className="bg-accent-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {property.status}
              </span>
            </div>
          )}
          <FavoriteButton propertyId={property.id} className="absolute top-3 right-3" />{property.isInvestment && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-accent-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Investment
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-2xl font-extrabold text-primary-700">
            {formatPrice(property.price)}
            {isRent && <span className="text-sm font-medium text-gray-500"> / month</span>}
          </p>
          <h3 className="text-base font-semibold text-gray-900 truncate mt-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 truncate">
            {property.locality}, {property.city}
          </p>

          <div className="mt-4">
            <PropertyStats
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              areaSqFt={property.areaSqFt}
              size="sm"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <TimeAgo date={property.createdAt} className="text-xs text-gray-500" />
          </div>
        </div>
      </div>
    </Link>
  );
}