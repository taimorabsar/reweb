"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Property } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatPrice, formatArea, formatDate, getPropertyTypeLabel, getPurposeLabel } from "@/lib/utils";
import PropertyCard from "@/components/PropertyCard";
import InquiryForm from "@/components/InquiryForm";
import PropertyStats from "@/components/PropertyStats";
import TimeAgo from "@/components/TimeAgo";

interface PropertyDetailClientProps {
  property: Property;
}

// Assumes Pakistani numbers: 03XX... or 3XX... become 923XX...
function toWhatsAppNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("3")) return `92${digits}`;
  return digits;
}

function cellClass(index: number, count: number): string {
  if (index === 0) return "col-span-2 row-span-2";
  if (count === 2) return "col-span-2 row-span-2";
  if (count === 3) return "col-span-2";
  if (count === 4) return index === 1 ? "col-span-2" : "col-span-1";
  return "col-span-1";
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const { user } = useAuth();
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const isOwner = user?.id === property.userId;
  const images = property.images;
  const shown = images.slice(0, 5);
  const extra = images.length - shown.length;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${property.locality}, ${property.city}, Pakistan`
  )}`;

  const contactName = property.user.name;
  const initials = contactName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const phone = property.user.phone || null;
  const whatsappNumber = phone ? toWhatsAppNumber(phone) : null;

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

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") {
        setLightbox((i) => (i === null ? i : (i + 1) % images.length));
      }
      if (e.key === "ArrowLeft") {
        setLightbox((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: property.title, url });
      } catch {
        // the person closed the share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const handleWhatsAppShare = () => {
    const text = `${property.title} - ${formatPrice(property.price)}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const summary: [string, string][] = [
    ["Property type", getPropertyTypeLabel(property.propertyType)], ["Listing type", getPurposeLabel(property.purpose)], ...(property.isInvestment ? [["Investment", "Yes"] as [string, string]] : []),
    ["Area", formatArea(property.areaSqFt)],
    ...(property.bedrooms > 0 ? [["Bedrooms", String(property.bedrooms)] as [string, string]] : []),
    ...(property.bathrooms > 0 ? [["Bathrooms", String(property.bathrooms)] as [string, string]] : []),
    ["City", property.city],
    ["Locality", property.locality],
    ["Listing ID", property.id.slice(0, 8).toUpperCase()],
    ["Posted on", formatDate(property.createdAt)],
    ["Status", property.status.charAt(0) + property.status.slice(1).toLowerCase()],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1.5">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/properties" className="hover:text-primary-600">Properties</Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/properties?city=${encodeURIComponent(property.city)}`}
          className="hover:text-primary-600"
        >
          {property.city}
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            {images.length === 0 ? (
              <img
                src="/placeholder-property.jpg"
                alt={property.title}
                className="w-full h-[260px] sm:h-[420px] object-cover rounded-xl"
              />
            ) : images.length === 1 ? (
              <button
                type="button"
                onClick={() => setLightbox(0)}
                className="block w-full h-[260px] sm:h-[420px] rounded-xl overflow-hidden"
                aria-label="Open photo"
              >
                <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
              </button>
            ) : (
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[260px] sm:h-[420px] rounded-xl overflow-hidden">
                {shown.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightbox(idx)}
                    className={`relative overflow-hidden ${cellClass(idx, shown.length)}`}
                    aria-label={`Open photo ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={idx === 0 ? property.title : ""}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {idx === shown.length - 1 && extra > 0 && (
                      <span className="absolute inset-0 bg-black/55 text-white font-semibold text-lg flex items-center justify-center">
                        +{extra} photos
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <span className="absolute top-3 left-3 bg-primary-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full pointer-events-none">
              {getPropertyTypeLabel(property.propertyType)} · {getPurposeLabel(property.purpose)}
            </span>
          </div>

          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.locality}, {property.city}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !px-4 !py-2"
                >
                  Directions
                </a>
                <button type="button" onClick={handleShare} className="btn-secondary !px-4 !py-2">
                  Share
                </button>
                <button type="button" onClick={handleWhatsAppShare} className="btn-secondary !px-4 !py-2">
                  WhatsApp
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="text-3xl font-extrabold text-primary-700">
                  {formatPrice(property.price)}
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  {property.status !== "ACTIVE" && (
                    <span className="bg-accent-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {property.status}
                    </span>
                  )}
                  {property.purpose === "RENT" && <span className="font-medium text-gray-700">Rent per month</span>}<TimeAgo date={property.createdAt} prefix="Posted " />
                </div>
              </div>
              <PropertyStats
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                areaSqFt={property.areaSqFt}
                size="lg"
              />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Summary</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
              {summary.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-gray-500">{label}</dt>
                  <dd className="font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div>
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 font-bold text-lg flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{contactName}</p>
                  <p className="text-sm text-gray-500">Listing contact</p>
                </div>
              </div>

              {phone && (
                <div className="mt-4 space-y-2">
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="btn-primary block text-center">
                    Call {phone}
                  </a>
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary block text-center"
                    >
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>

            {isOwner ? (
              <div className="card p-5 text-center">
                <p className="text-sm text-gray-500">This is your property listing.</p>
                <Link
                  href={`/dashboard/${property.id}/edit`}
                  className="text-primary-600 font-medium text-sm mt-2 inline-block hover:text-primary-700"
                >
                  Edit listing
                </Link>
              </div>
            ) : (
              <InquiryForm propertyId={property.id} ownerName={property.user.name} />
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

      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 w-11 h-11 text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous photo"
              className="absolute left-3 w-11 h-11 text-white text-4xl leading-none"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox - 1 + images.length) % images.length);
              }}
            >
              &#8249;
            </button>
          )}
          <img
            src={images[lightbox]}
            alt={`${property.title}, photo ${lightbox + 1} of ${images.length}`}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next photo"
              className="absolute right-3 w-11 h-11 text-white text-4xl leading-none"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % images.length);
              }}
            >
              &#8250;
            </button>
          )}
          <span className="absolute bottom-4 text-white text-sm">
            {lightbox + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}