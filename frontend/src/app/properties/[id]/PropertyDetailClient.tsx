"use client";

import { useState, useEffect } from "react";
import { Property } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatPrice, formatArea, formatDate, getPropertyTypeLabel } from "@/lib/utils";
import PropertyCard from "@/components/PropertyCard";
import InquiryForm from "@/components/InquiryForm";

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const { user } = useAuth();
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  const isOwner = user?.id === property.userId;

  useEffect(() => {
    async function loadSimilar() {
      try {
        const data = await api.getSimilarProperties(property.id);
        setSimilarProperties(data);
      } catch {
        // silent
      }
    }
    loadSimilar();
  }, [property.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
              <img
                src={property.images[selectedImage] || "/placeholder-property.jpg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary-600 text-white text-sm font-medium px-3 py-1.5 rounded-full">
                  {getPropertyTypeLabel(property.propertyType)}
                </span>
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-primary-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.locality}, {property.city}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(property.price)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-semibold text-gray-900">{getPropertyTypeLabel(property.propertyType)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-semibold text-gray-900">{property.bedrooms} BHK</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-semibold text-gray-900">{property.bathrooms}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Area</p>
                <p className="font-semibold text-gray-900">{formatArea(property.areaSqFt)}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>Listed by {property.user.name}</span>
              <span>Posted on {formatDate(property.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 sticky top-20">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-primary-600">{formatPrice(property.price)}</p>
              <p className="text-sm text-gray-500 mt-1">{formatArea(property.areaSqFt)}</p>
            </div>
            {!isOwner && (
              <InquiryForm propertyId={property.id} ownerName={property.user.name} />
            )}
            {isOwner && (
              <p className="text-sm text-gray-500 text-center py-4">
                This is your property listing.
              </p>
            )}
          </div>
        </div>
      </div>

      {similarProperties.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
