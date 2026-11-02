"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Property, Inquiry } from "@/types";
import { formatPrice, formatDate, getPropertyTypeLabel } from "@/lib/utils";
import toast from "react-hot-toast";

type Tab = "properties" | "sent" | "received";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([]);
  const [receivedInquiries, setReceivedInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const [props, sent, received] = await Promise.all([
          api.getMyProperties(),
          api.getMyInquiries(),
          api.getPropertyInquiriesForOwner(),
        ]);
        setProperties(props);
        setSentInquiries(sent);
        setReceivedInquiries(received);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    if (user) loadData();
  }, [user]);

  async function refreshSent() {
    const sent = await api.getMyInquiries();
    setSentInquiries(sent);
  }

  async function refreshReceived() {
    const received = await api.getPropertyInquiriesForOwner();
    setReceivedInquiries(received);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success("Property deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {activeTab === "properties" && `${properties.length} properties listed`}
            {activeTab === "sent" && `${sentInquiries.length} inquiries sent`}
            {activeTab === "received" && `${receivedInquiries.length} inquiries received`}
          </p>
        </div>
        {activeTab === "properties" && (
          <Link href="/dashboard/new" className="btn-primary text-sm">
            + Add Property
          </Link>
        )}
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        <TabButton
          active={activeTab === "properties"}
          onClick={() => setActiveTab("properties")}
          label="Properties"
        />
        <TabButton
          active={activeTab === "sent"}
          onClick={() => setActiveTab("sent")}
          label="Sent"
          count={sentInquiries.length}
        />
        <TabButton
          active={activeTab === "received"}
          onClick={() => setActiveTab("received")}
          label="Received"
          count={receivedInquiries.length}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : activeTab === "properties" ? (
        <PropertiesTab properties={properties} onDelete={handleDelete} />
      ) : activeTab === "sent" ? (
        <SentTab inquiries={sentInquiries} onRefresh={refreshSent} />
      ) : (
        <ReceivedTab inquiries={receivedInquiries} onRefresh={refreshReceived} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors relative ${
        active
          ? "border-primary-600 text-primary-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-2 bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}

function PropertiesTab({
  properties,
  onDelete,
}: {
  properties: Property[];
  onDelete: (id: string) => void;
}) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
        <p className="text-gray-500 mb-4">Start by listing your first property</p>
        <Link href="/dashboard/new" className="btn-primary inline-block">
          + Add Property
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <div key={property.id} className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="w-full sm:w-40 h-40 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={property.images[0] || "/placeholder-property.jpg"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                <p className="text-sm text-gray-500 truncate">{property.locality}, {property.city}</p>
              </div>
              <span className="text-lg font-bold text-primary-600 flex-shrink-0">
                {formatPrice(property.price)}
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 mt-2 text-sm text-gray-500 flex-wrap">
              <span>{getPropertyTypeLabel(property.propertyType)}</span>
              {property.bedrooms > 0 && <span>{property.bedrooms} bed</span>}
              <span>{property.areaSqFt.toLocaleString("en-PK")} sq ft</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                property.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : property.status === "SOLD"
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-700"
              }`}>
                {property.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Link
                href={`/dashboard/${property.id}/edit`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Edit
              </Link>
              <Link
                href={`/properties/${property.id}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                View
              </Link>
              <button
                onClick={() => onDelete(property.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Delete
              </button>
              <span className="text-xs text-gray-400 sm:ml-auto">
                {formatDate(property.createdAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SentTab({
  inquiries,
  onRefresh,
}: {
  inquiries: Inquiry[];
  onRefresh: () => Promise<void>;
}) {
  if (inquiries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries sent yet</h3>
        <p className="text-gray-500">Browse properties and send an inquiry to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {inquiries.map((inquiry) => (
        <SentInquiryCard key={inquiry.id} inquiry={inquiry} onReplySent={onRefresh} />
      ))}
    </div>
  );
}

function SentInquiryCard({
  inquiry,
  onReplySent,
}: {
  inquiry: Inquiry;
  onReplySent: () => Promise<void>;
}) {
  const { user } = useAuth();
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(inquiry.replies && inquiry.replies.length > 0);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (replyMessage.trim().length < 1) return;

    setSending(true);
    try {
      await api.createReply({ inquiryId: inquiry.id, message: replyMessage.trim() });
      setReplyMessage("");
      await onReplySent();
      setExpanded(true);
      toast.success("Reply sent!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-medium text-gray-900 truncate">{inquiry.property.title}</span>
            <span className="hidden sm:inline text-gray-400 text-sm">•</span>
            <span className="text-xs text-gray-400">{inquiry.property.locality}, {inquiry.property.city}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Link
              href={`/properties/${inquiry.property.id}`}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              View property →
            </Link>
            <span className="text-xs text-gray-400">{formatDate(inquiry.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="ml-0 sm:ml-[52px]">
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Your message</p>
          <p className="text-sm text-gray-700">{inquiry.message}</p>
        </div>

        {inquiry.replies && inquiry.replies.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium mb-3 flex items-center gap-1"
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {inquiry.replies.length} {inquiry.replies.length === 1 ? "reply" : "replies"} from owner
          </button>
        )}

        {expanded && inquiry.replies && inquiry.replies.length > 0 && (
          <div className="space-y-2 mb-3">
            {inquiry.replies.map((reply) => (
              <div
                key={reply.id}
                className={`p-3 rounded-lg text-sm ${
                  reply.senderId === user?.id
                    ? "bg-primary-50 border border-primary-100"
                    : "bg-green-50 border border-green-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900">{reply.sender.name}</span>
                  {reply.senderId !== user?.id && (
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Owner</span>
                  )}
                  <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                </div>
                <p className="text-gray-700 break-words">{reply.message}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleReply} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Reply..."
            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          <button
            type="submit"
            disabled={sending || replyMessage.trim().length < 1}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:w-auto"
          >
            {sending ? "..." : "Reply"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ReceivedTab({
  inquiries,
  onRefresh,
}: {
  inquiries: Inquiry[];
  onRefresh: () => Promise<void>;
}) {
  if (inquiries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
        <p className="text-gray-500">When someone inquires about your properties, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {inquiries.map((inquiry) => (
        <ReceivedInquiryCard key={inquiry.id} inquiry={inquiry} onReplySent={onRefresh} />
      ))}
    </div>
  );
}

function ReceivedInquiryCard({
  inquiry,
  onReplySent,
}: {
  inquiry: Inquiry;
  onReplySent: () => Promise<void>;
}) {
  const { user } = useAuth();
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(inquiry.replies && inquiry.replies.length > 0);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (replyMessage.trim().length < 1) return;

    setSending(true);
    try {
      await api.createReply({ inquiryId: inquiry.id, message: replyMessage.trim() });
      setReplyMessage("");
      await onReplySent();
      setExpanded(true);
      toast.success("Reply sent!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-700 font-medium text-sm sm:text-base">
            {inquiry.sender.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-medium text-gray-900 truncate">{inquiry.sender.name}</span>
            <span className="text-xs text-gray-400">{formatDate(inquiry.createdAt)}</span>
          </div>
          <Link
            href={`/properties/${inquiry.property.id}`}
            className="text-xs text-primary-600 hover:text-primary-700 mt-0.5 inline-block truncate max-w-full"
          >
            Re: {inquiry.property.title} — {inquiry.property.locality}, {inquiry.property.city}
          </Link>
        </div>
      </div>

      <div className="ml-0 sm:ml-[52px]">
        <p className="text-sm text-gray-700 mb-3 break-words">{inquiry.message}</p>

        {inquiry.replies && inquiry.replies.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium mb-3 flex items-center gap-1"
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {inquiry.replies.length} {inquiry.replies.length === 1 ? "reply" : "replies"}
          </button>
        )}

        {expanded && inquiry.replies && inquiry.replies.length > 0 && (
          <div className="space-y-2 mb-3">
            {inquiry.replies.map((reply) => (
              <div
                key={reply.id}
                className={`p-3 rounded-lg text-sm ${
                  reply.senderId === user?.id
                    ? "bg-primary-50 border border-primary-100"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900">{reply.sender.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                </div>
                <p className="text-gray-700 break-words">{reply.message}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleReply} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Reply to this inquiry..."
            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          <button
            type="submit"
            disabled={sending || replyMessage.trim().length < 1}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:w-auto"
          >
            {sending ? "..." : "Reply"}
          </button>
        </form>
      </div>
    </div>
  );
}
