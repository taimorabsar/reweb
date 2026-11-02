"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/lib/favorites-context";
import { Property } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const { isFavorite } = useFavorites();
  const router = useRouter();
  const [homes, setHomes] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api
      .getFavorites()
      .then((list) => {
        if (!cancelled) setHomes(list);
      })
      .catch(() => {
        // silent
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || !user) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  const visible = homes.filter((p) => isFavorite(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Saved</h1>
      <p className="text-gray-500 mt-1">Homes you have saved with the heart button.</p>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No saved homes yet</h3>
            <p className="text-gray-500">Tap the heart on any listing to keep it here.</p>
            <Link href="/properties" className="btn-primary inline-block mt-6">
              Browse properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}