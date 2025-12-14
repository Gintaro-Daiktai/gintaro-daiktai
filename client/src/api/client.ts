import { getToken, removeToken } from "@/utils/token";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_PREFIX = "/api";

// Callback for handling unauthorized errors
let onUnauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiClient = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { requiresAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add Authorization header if token exists
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    let data: unknown;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (response.status === 401) {
      const errorMessage =
        data && typeof data === "object" && "message" in data
          ? String(data.message)
          : "";

      const isTokenIssue =
        errorMessage.toLowerCase().includes("token") ||
        (errorMessage.toLowerCase().includes("unauthorized") && requiresAuth);

      if (isTokenIssue && requiresAuth) {
        removeToken();
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }

      throw new ApiError(401, errorMessage || "Unauthorized", data);
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorMessage =
        data && typeof data === "object" && "message" in data
          ? String(data.message)
          : typeof data === "string"
            ? data
            : "An error occurred";

      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
