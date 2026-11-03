import { ApiResponse, PaginatedResponse, AuthResponse, Property, PropertySearchParams, Inquiry, Reply, User, UploadResult, SavedSearch } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch {
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          headers["Authorization"] = `Bearer ${this.accessToken}`;
          let retryResponse: Response;
          try {
            retryResponse = await fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers,
            });
          } catch {
            throw new Error("Cannot connect to server after refresh.");
          }
          const retryData = await retryResponse.json();
          if (!retryResponse.ok) {
            throw new Error(retryData.message || "Request failed");
          }
          return retryData as T;
        }
        this.logout();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(data.message || "Request failed");
    }

    return data as T;
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Auth
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const res = await this.request<ApiResponse<AuthResponse>>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  }

  async login(data: { email: string; password: string }) {
    const res = await this.request<ApiResponse<AuthResponse>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  }

  async logoutApi() {
    try {
      await this.request<ApiResponse<null>>("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the API call fails, clear local tokens
    }
    this.logout();
  }

  async updateProfile(data: { name?: string; phone?: string; accountType?: "OWNER" | "AGENT" | "AGENCY"; agencyName?: string; avatarUrl?: string }) { const res = await this.request<ApiResponse<User>>("/api/auth/profile", { method: "PUT", body: JSON.stringify(data) }); return res.data; } async getFavoriteIds() { const res = await this.request<ApiResponse<string[]>>("/api/favorites/ids"); return res.data; } async getFavorites() { const res = await this.request<ApiResponse<Property[]>>("/api/favorites"); return res.data; } async addFavorite(propertyId: string) { await this.request<ApiResponse<{ propertyId: string }>>(`/api/favorites/${propertyId}`, { method: "POST" }); } async removeFavorite(propertyId: string) { await this.request<ApiResponse<{ propertyId: string }>>(`/api/favorites/${propertyId}`, { method: "DELETE" }); } async getSavedSearches() { const res = await this.request<ApiResponse<SavedSearch[]>>("/api/saved-searches"); return res.data; } async createSavedSearch(data: { name: string; params: PropertySearchParams }) { const res = await this.request<ApiResponse<SavedSearch>>("/api/saved-searches", { method: "POST", body: JSON.stringify(data) }); return res.data; } async deleteSavedSearch(id: string) { await this.request<ApiResponse<{ id: string }>>(`/api/saved-searches/${id}`, { method: "DELETE" }); } async getProfile() {
    const res = await this.request<ApiResponse<User>>("/api/auth/profile");
    return res.data;
  }

  // Properties
  async searchProperties(params: PropertySearchParams = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const query = searchParams.toString();
    const res = await this.request<PaginatedResponse<Property>>(
      `/api/properties${query ? `?${query}` : ""}`
    );
    return res;
  }

  async getProperty(id: string) {
    const res = await this.request<ApiResponse<Property>>(`/api/properties/${id}`);
    return res.data;
  }

  async getSimilarProperties(id: string) {
    const res = await this.request<ApiResponse<Property[]>>(`/api/properties/${id}/similar`);
    return res.data;
  }

  async getMyProperties() {
    const res = await this.request<ApiResponse<Property[]>>("/api/properties/my");
    return res.data;
  }

  async createProperty(data: Omit<Property, "id" | "userId" | "createdAt" | "updatedAt" | "user" | "status">) {
    const res = await this.request<ApiResponse<Property>>("/api/properties", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async updateProperty(id: string, data: Partial<Property>) {
    const res = await this.request<ApiResponse<Property>>(`/api/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async deleteProperty(id: string) {
    const res = await this.request<ApiResponse<null>>(`/api/properties/${id}`, {
      method: "DELETE",
    });
    return res;
  }

  // Upload
  async uploadFiles(files: File[]): Promise<UploadResult[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data.data;
  }

  // Inquiries
  async createInquiry(data: { propertyId: string; message: string }) {
    const res = await this.request<ApiResponse<Inquiry>>("/api/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async getMyInquiries() {
    const res = await this.request<ApiResponse<Inquiry[]>>("/api/inquiries/my");
    return res.data;
  }

  async getPropertyInquiries(propertyId: string) {
    const res = await this.request<ApiResponse<Inquiry[]>>(
      `/api/inquiries/property/${propertyId}`
    );
    return res.data;
  }

  async getPropertyInquiriesForOwner() {
    const res = await this.request<ApiResponse<Inquiry[]>>("/api/inquiries/owner");
    return res.data;
  }

  async deleteInquiry(id: string) {
    const res = await this.request<ApiResponse<null>>(`/api/inquiries/${id}`, {
      method: "DELETE",
    });
    return res;
  }

  // Replies
  async createReply(data: { inquiryId: string; message: string }) {
    const res = await this.request<ApiResponse<Reply>>("/api/replies", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async getRepliesForInquiry(inquiryId: string) {
    const res = await this.request<ApiResponse<Reply[]>>(
      `/api/replies/${inquiryId}`
    );
    return res.data;
  }
}

export const api = new ApiClient();
