import { Metadata } from "next";
import PropertyDetailClient from "./PropertyDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface PageProps {
  params: { id: string };
}

async function getProperty(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/properties/${id}`, {
      next: { revalidate: 3600 } as any,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = await getProperty(params.id);

  if (!property) {
    return { title: "Property Not Found" };
  }

  const title = `${property.title} in ${property.locality}, ${property.city} | RealEstate`;
  const description = `${property.title} - ${property.bedrooms > 0 ? `${property.bedrooms} bedroom ` : ""}${property.propertyType.toLowerCase()} in ${property.locality}, ${property.city}. ${property.description.slice(0, 150)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: property.images[0] ? [{ url: property.images[0], width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: property.images[0] ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = await getProperty(params.id);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Property Not Found</h1>
        <p className="text-gray-500 mt-2">This property may have been removed or does not exist.</p>
        <a href="/properties" className="text-primary-600 font-medium mt-4 inline-block">
          Browse Properties
        </a>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: property.title,
            description: property.description,
            url: `${API_URL}/properties/${property.id}`,
            image: property.images,
            address: {
              "@type": "PostalAddress",
              addressLocality: property.locality,
              addressRegion: property.city,
            },
            offers: {
              "@type": "Offer",
              price: property.price,
              priceCurrency: "PKR",
            },
          }),
        }}
      />
      <PropertyDetailClient property={property} />
    </>
  );
}
