"use client";

import { useState, useEffect } from "react"; import CitySelect from "@/components/CitySelect";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Furnishing, ListingPurpose, Possession, PropertyType } from "@/types";
import { FEATURE_OPTIONS } from "@/lib/features";
import toast from "react-hot-toast";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
];

const FURNISHING_OPTIONS: { value: Furnishing; label: string }[] = [
  { value: "FURNISHED", label: "Furnished" },
  { value: "SEMI_FURNISHED", label: "Semi-furnished" },
  { value: "UNFURNISHED", label: "Unfurnished" },
];

const POSSESSION_OPTIONS: { value: Possession; label: string }[] = [
  { value: "READY", label: "Ready to move" },
  { value: "UNDER_CONSTRUCTION", label: "Under construction" },
];

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    locality: "",
    propertyType: "APARTMENT" as PropertyType,
    purpose: "SALE" as ListingPurpose,
    isInvestment: false,
    bedrooms: "2",
    bathrooms: "2",
    areaSqFt: "",
    yearBuilt: "",
    floors: "",
    parkingSpaces: "",
    furnishing: "",
    possession: "",
    features: [] as string[],
    status: "ACTIVE",
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadProperty() {
      try {
        const property = await api.getProperty(id);
        if (property.userId !== user?.id) {
          toast.error("You can only edit your own properties");
          router.push("/dashboard");
          return;
        }
        setForm({
          title: property.title,
          description: property.description,
          price: String(property.price),
          city: property.city,
          locality: property.locality,
          propertyType: property.propertyType,
          purpose: property.purpose ?? "SALE",
          isInvestment: property.isInvestment ?? false,
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          areaSqFt: String(property.areaSqFt),
          yearBuilt: property.yearBuilt != null ? String(property.yearBuilt) : "",
          floors: property.floors != null ? String(property.floors) : "",
          parkingSpaces: property.parkingSpaces != null ? String(property.parkingSpaces) : "",
          furnishing: property.furnishing ?? "",
          possession: property.possession ?? "",
          features: property.features ?? [],
          status: property.status,
        });
        setImages(property.images);
      } catch (error) {
        toast.error((error as Error).message);
        router.push("/dashboard");
      } finally {
        setFetching(false);
      }
    }
    if (user) loadProperty();
  }, [id, user, router]);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (code: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(code)
        ? prev.features.filter((f) => f !== code)
        : [...prev.features, code],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price || !form.city || !form.locality || !form.areaSqFt) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.title.length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }

    if (form.description.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    setLoading(true);
    try {
      await api.updateProperty(id, {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        city: form.city,
        locality: form.locality,
        propertyType: form.propertyType,
        purpose: form.purpose,
        isInvestment: form.isInvestment,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaSqFt: Number(form.areaSqFt),
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        floors: form.floors ? Number(form.floors) : undefined,
        parkingSpaces: form.parkingSpaces ? Number(form.parkingSpaces) : undefined,
        furnishing: form.furnishing ? (form.furnishing as Furnishing) : undefined,
        possession: form.possession ? (form.possession as Possession) : undefined,
        features: form.features,
        images,
        status: form.status as any,
      });

      toast.success("Property updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error((error as Error).message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || fetching) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  const isRent = form.purpose === "RENT";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Basic Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing for *</label>
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden" role="group">
              {([["SALE", "Sale"], ["RENT", "Rent"]] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, purpose: value }))}
                  className={`px-6 py-2 text-sm font-semibold transition-colors ${
                    form.purpose === value
                      ? "bg-primary-700 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isInvestment}
                onChange={(e) => setForm((prev) => ({ ...prev, isInvestment: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-600"
              />
              This is an investment opportunity
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={5}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
              <select
                value={form.propertyType}
                onChange={(e) => updateForm("propertyType", e.target.value)}
                className="input-field"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRent ? "Rent per month (PKR) *" : "Price (PKR) *"}
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
              <select
                value={form.bedrooms}
                onChange={(e) => updateForm("bedrooms", e.target.value)}
                className="input-field"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n === 0 ? "Studio" : n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
              <select
                value={form.bathrooms}
                onChange={(e) => updateForm("bathrooms", e.target.value)}
                className="input-field"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq.ft.) *</label>
              <input
                type="number"
                value={form.areaSqFt}
                onChange={(e) => updateForm("areaSqFt", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateForm("status", e.target.value)}
              className="input-field"
            >
              <option value="ACTIVE">Active</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
            </select>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Building Details (optional)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year built</label>
              <input
                type="number"
                value={form.yearBuilt}
                onChange={(e) => updateForm("yearBuilt", e.target.value)}
                placeholder="2018"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
              <input
                type="number"
                value={form.floors}
                onChange={(e) => updateForm("floors", e.target.value)}
                placeholder="2"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parking spaces</label>
              <input
                type="number"
                value={form.parkingSpaces}
                onChange={(e) => updateForm("parkingSpaces", e.target.value)}
                placeholder="1"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
              <select
                value={form.furnishing}
                onChange={(e) => updateForm("furnishing", e.target.value)}
                className="input-field"
              >
                <option value="">Not specified</option>
                {FURNISHING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Possession</label>
              <select
                value={form.possession}
                onChange={(e) => updateForm("possession", e.target.value)}
                className="input-field"
              >
                <option value="">Not specified</option>
                {POSSESSION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Features</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FEATURE_OPTIONS.map((f) => (
                <label key={f.value} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.features.includes(f.value)}
                    onChange={() => toggleFeature(f.value)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <CitySelect
                value={form.city}
                onChange={(v) => updateForm("city", v)}
                emptyLabel="Select city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality *</label>
              <input
                type="text"
                value={form.locality}
                onChange={(e) => updateForm("locality", e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Images</h2>
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500">Images are managed through existing URLs. To change images, re-create the listing.</p>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? "Updating..." : "Update Property"}
          </button>
          <button type="button" onClick={() => router.push("/dashboard")} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}