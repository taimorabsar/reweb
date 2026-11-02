"use client";

import { useFavorites } from "@/lib/favorites-context";

interface FavoriteButtonProps {
  propertyId: string;
  variant?: "icon" | "labeled";
  className?: string;
}

export default function FavoriteButton({ propertyId, variant = "icon", className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(propertyId);

  const heart = (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleFavorite(propertyId);
  };

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={`btn-secondary !px-4 !py-2 inline-flex items-center gap-1.5 ${saved ? "!text-accent-600" : ""} ${className}`}
      >
        {heart}
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved homes" : "Save this home"}
      className={`w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors ${
        saved ? "text-accent-600" : "text-gray-600"
      } ${className}`}
    >
      {heart}
    </button>
  );
}