function trimZeros(n: string): string {
  return n.replace(/\.?0+$/, "");
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${trimZeros((price / 10000000).toFixed(2))} Crore`;
  }
  if (price >= 100000) {
    return `PKR ${trimZeros((price / 100000).toFixed(2))} Lakh`;
  }
  return `PKR ${price.toLocaleString("en-PK")}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatArea(area: number): string {
  return `${area.toLocaleString("en-PK")} sq ft`;
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: "Apartment",
    HOUSE: "House",
    VILLA: "Villa",
    PLOT: "Plot",
    COMMERCIAL: "Commercial",
  };
  return labels[type] || type;
}
export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  return formatDate(dateString);
}

export function getPurposeLabel(purpose?: string): string {
  return purpose === "RENT" ? "For Rent" : "For Sale";
}