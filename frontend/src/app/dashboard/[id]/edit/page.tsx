"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { PropertyType } from "@/types";
import toast from "react-hot-toast";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
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
    bedrooms: "2",
    bathrooms: "2",
    areaSqFt: "",
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
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          areaSqFt: String(property.areaSqFt),
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
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaSqFt: Number(form.areaSqFt),
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Basic Details</h2>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR) *</label>
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
          <h2 className="text-lg font-semibold text-gray-900">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
                className="input-field"
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
