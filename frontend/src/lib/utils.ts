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