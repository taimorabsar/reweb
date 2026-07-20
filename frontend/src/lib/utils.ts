export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `\u20B9${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `\u20B9${(price / 100000).toFixed(2)} L`;
  }
  return `\u20B9${price.toLocaleString("en-IN")}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatArea(area: number): string {
  return `${area.toLocaleString("en-IN")} sq.ft.`;
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
