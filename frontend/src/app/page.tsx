"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react"; import CitySelect from "@/components/CitySelect";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Property } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.searchProperties({ sort: "newest", limit: 6 });
        setFeaturedProperties(res.data);
      } catch {
        // silent fail on home page
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (propertyType) params.set("propertyType", propertyType);
    const query = params.toString();
    router.push(query ? `/properties?${query}` : "/properties");
  };

  const listHref = user ? "/dashboard/new" : "/register";

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Find your next home{" "}
              <span className="text-accent-300 whitespace-nowrap">across Pakistan</span>
            </h1>
            <p className="mt-5 text-lg text-primary-100 max-w-xl">
              Browse houses, plots and commercial space, and contact the agent or
              owner directly.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white rounded-2xl p-4 md:p-5 shadow-xl max-w-4xl flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1">
              <label htmlFor="hero-city" className="sr-only">
                City
              </label>
              <CitySelect
                id="hero-city"
                value={city}
                onChange={setCity}
                emptyLabel="All cities"
                className="input-field h-12 text-base text-gray-900 bg-white"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="hero-type" className="sr-only">
                Property type
              </label>
              <select
                id="hero-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="input-field h-12 text-base text-gray-900 bg-white"
              >
                <option value="">All property types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary h-12 px-8 text-base font-semibold">
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/properties" className="text-primary-100 underline hover:text-white">
              Browse all properties
            </Link>
            <Link href={listHref} className="text-primary-100 underline hover:text-white">
              List your property
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Properties</h2>
            <p className="text-gray-500 mt-1">Recently added listings</p>
          </div>
          <Link
            href="/properties"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No properties listed yet.</p>
            <p className="mt-2">Be the first to list a property!</p>
          </div>
        )}
      </section>

      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Clear Listings</h3>
              <p className="text-sm text-gray-500">Price, size, location and photos on every listing.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Search</h3>
              <p className="text-sm text-gray-500">Find properties quickly with advanced filters and search.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Direct Contact</h3>
              <p className="text-sm text-gray-500">Message the agent or owner behind each listing directly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-50 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700">
            Selling or renting out a property?
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Create an account and post your listing in a few minutes.
          </p>
          <Link href={listHref} className="btn-primary inline-block mt-6 px-8 py-3 text-base">
            List your property
          </Link>
        </div>
      </section>
    </div>
  );
}