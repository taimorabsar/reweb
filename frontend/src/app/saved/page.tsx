"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/lib/favorites-context";
import { Property, SavedSearch } from "@/types";
import { describeSearch, searchToQuery } from "@/lib/saved-searches";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";

type Tab = "homes" | "searches";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const { isFavorite } = useFavorites();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("homes");
  const [homes, setHomes] = useState<Property[]>([]);
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([api.getFavorites(), api.getSavedSearches()])
      .then(([homeList, searchList]) => {
        if (cancelled) return;
        setHomes(homeList);
        setSearches(searchList);
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

  const handleDeleteSearch = async (id: string) => {
    try {
      await api.deleteSavedSearch(id);
      setSearches((prev) => prev.filter((s) => s.id !== id));
      toast.success("Saved search removed");
    } catch (error) {
      toast.error((error as Error).message || "Could not remove this search");
    }
  };

  if (authLoading || !user) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  const visibleHomes = homes.filter((p) => isFavorite(p.id));

  const tabClass = (active: boolean) =>
    `px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
      active
        ? "border-primary-700 text-primary-700"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Saved</h1>

      <div className="mt-6 flex gap-2 border-b border-gray-200" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "homes"} onClick={() => setTab("homes")} className={tabClass(tab === "homes")}>
          Saved homes
        </button>
        <button type="button" role="tab" aria-selected={tab === "searches"} onClick={() => setTab("searches")} className={tabClass(tab === "searches")}>
          Saved searches
        </button>
      </div>

      <div className="mt-8">
        {tab === "homes" ? (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : visibleHomes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleHomes.map((property) => (
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
          )
        ) : loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : searches.length > 0 ? (
          <ul className="space-y-3 max-w-3xl">
            {searches.map((s) => (
              <li key={s.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{describeSearch(s.params)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/properties?${searchToQuery(s.params)}`} className="btn-primary !px-4 !py-2">
                    View results
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteSearch(s.id)}
                    className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No saved searches yet</h3>
            <p className="text-gray-500">Set your filters on the Properties page, then press Save search.</p>
            <Link href="/properties" className="btn-primary inline-block mt-6">
              Search properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}