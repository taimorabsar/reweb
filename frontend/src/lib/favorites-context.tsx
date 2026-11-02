"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface FavoritesContextType {
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function flip(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const userId = user?.id;

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setIds(new Set());
      return;
    }
    api
      .getFavoriteIds()
      .then((list) => {
        if (!cancelled) setIds(new Set(list));
      })
      .catch(() => {
        // silent: hearts simply stay empty
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isFavorite = useCallback((propertyId: string) => ids.has(propertyId), [ids]);

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!userId) {
        toast("Log in to save homes");
        router.push("/login");
        return;
      }
      const wasSaved = ids.has(propertyId);
      setIds((prev) => flip(prev, propertyId));
      try {
        if (wasSaved) await api.removeFavorite(propertyId);
        else await api.addFavorite(propertyId);
        toast.success(wasSaved ? "Removed from saved homes" : "Saved to your homes");
      } catch (error) {
        setIds((prev) => flip(prev, propertyId));
        toast.error((error as Error).message || "Could not update saved homes");
      }
    },
    [userId, ids, router]
  );

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}