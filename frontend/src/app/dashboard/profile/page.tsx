"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { AccountType } from "@/types";

const ACCOUNT_TYPES: { value: AccountType; label: string; hint: string }[] = [
  { value: "OWNER", label: "Property owner", hint: "Selling or renting out your own property" },
  { value: "AGENT", label: "Real estate agent", hint: "Listing properties for clients" },
  { value: "AGENCY", label: "Real estate agency", hint: "A company with several agents" },
];

export default function ProfilePage() {
  const { user, loading: authLoading, setUser } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    accountType: "OWNER" as AccountType,
    agencyName: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        accountType: user.accountType ?? "OWNER",
        agencyName: user.agencyName ?? "",
        avatarUrl: user.avatarUrl ?? "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (form.name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }

    const needsAgency = form.accountType !== "OWNER";
    if (needsAgency && !form.agencyName.trim()) {
      toast.error("Please enter your agency or company name");
      return;
    }

    const changes: {
      name?: string;
      phone?: string;
      accountType?: AccountType;
      agencyName?: string;
      avatarUrl?: string;
    } = {};
    if (form.name.trim() !== user.name) changes.name = form.name.trim();
    if (form.phone.trim() && form.phone.trim() !== (user.phone ?? "")) changes.phone = form.phone.trim();
    if (form.accountType !== (user.accountType ?? "OWNER")) changes.accountType = form.accountType;
    if (needsAgency && form.agencyName.trim() !== (user.agencyName ?? "")) {
      changes.agencyName = form.agencyName.trim();
    }
    if (form.avatarUrl.trim() && form.avatarUrl.trim() !== (user.avatarUrl ?? "")) {
      changes.avatarUrl = form.avatarUrl.trim();
    }

    if (Object.keys(changes).length === 0) {
      toast("Nothing to save");
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateProfile(changes);
      setUser(updated);
      toast.success("Profile saved");
    } catch (error) {
      toast.error((error as Error).message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  const initials = (form.name || user.name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Account type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ACCOUNT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, accountType: t.value }))}
                className={`text-left rounded-xl border p-4 transition-colors ${
                  form.accountType === t.value
                    ? "border-primary-700 bg-primary-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                aria-pressed={form.accountType === t.value}
              >
                <p className="text-sm font-semibold text-gray-900">{t.label}</p>
                <p className="text-xs text-gray-500 mt-1">{t.hint}</p>
              </button>
            ))}
          </div>

          {form.accountType !== "OWNER" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency / company name *
              </label>
              <input
                type="text"
                value={form.agencyName}
                onChange={(e) => setForm((prev) => ({ ...prev, agencyName: e.target.value }))}
                placeholder="e.g. Your Realty Name"
                className="input-field"
              />
            </div>
          )}
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Contact details</h2>

          <div className="flex items-center gap-4">
            {form.avatarUrl.trim() ? (
              <img
                src={form.avatarUrl.trim()}
                alt=""
                className="w-16 h-16 rounded-full object-cover bg-gray-100"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 font-bold text-xl flex items-center justify-center"
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo link (optional)</label>
              <input
                type="url"
                value={form.avatarUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                placeholder="https://..."
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">
                Paste the link to an image for now. Photo upload comes with image storage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="03XX XXXXXXX"
                className="input-field"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500">Email: {user.email}</p>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving..." : "Save Profile"}
          </button>
          <button type="button" onClick={() => router.push("/dashboard")} className="btn-secondary">
            Back
          </button>
        </div>
      </form>
    </div>
  );
}