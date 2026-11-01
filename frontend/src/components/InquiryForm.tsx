"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";

interface InquiryFormProps {
  propertyId: string;
  ownerName: string;
}

export default function InquiryForm({ propertyId, ownerName }: InquiryFormProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to send an inquiry");
      return;
    }

    if (message.trim().length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      await api.createInquiry({ propertyId, message: message.trim() });
      setSent(true);
      toast.success("Inquiry sent successfully!");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-green-800 font-semibold">Inquiry Sent!</h3>
        <p className="text-green-600 text-sm mt-1">
          {ownerName} will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact {ownerName}</h3>
      <p className="text-sm text-gray-500 mb-4">Send a message about this property</p>

      {!user ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Please <a href="/login" className="text-primary-600 font-medium">login</a> to send an inquiry
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi, I am interested in this property. Please share more details...`}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{message.length}/2000 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading || message.trim().length < 10}
            className="btn-primary w-full"
          >
            {loading ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
