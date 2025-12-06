import { apiClient } from "./client";
import type {
  LoginCredentials,
  LoginResponse,
  SignupData,
  SignupResponse,
  VerifyEmailData,
  VerifyEmailResponse,
  ResendCodeData,
  User,
} from "@/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient<{ token: string; confirmed: boolean }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
    );
    return response;
  },

  signup: async (data: SignupData): Promise<SignupResponse> => {
    const response = await apiClient<SignupResponse>("/users", {
      method: "POST",
      body: JSON.stringify({ user: data }),
    });
    return response;
  },

  verifyEmail: async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
    const response = await apiClient<VerifyEmailResponse>(
      "/auth/verify-email",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    return response;
  },

  resendCode: async (data: ResendCodeData): Promise<{ message: string }> => {
    const response = await apiClient<{ message: string }>("/auth/resend-code", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  getAuthStatus: async (): Promise<{
    userId: number;
    email: string;
    role: "admin" | "client";
    confirmed: boolean;
  }> => {
    const response = await apiClient<{
      userId: number;
      email: string;
      role: "admin" | "client";
      confirmed: boolean;
    }>("/auth/status", {
      method: "GET",
      requiresAuth: true,
    });
    return response;
  },

  getUserProfile: async (userId: number): Promise<User> => {
    // TODO: Replace with actual endpoint when backend implements it
    // For now, we'll use auth/status and fetch additional data if needed
    const response = await apiClient<User>(`/users/${userId}`, {
      method: "GET",
      requiresAuth: true,
    });
    return response;
  },
};
