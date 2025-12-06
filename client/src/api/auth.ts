import { apiClient } from "./client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setToken, removeToken } from "@/utils/token";
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
    const response = await apiClient<User>(`/users/${userId}`, {
      method: "GET",
      requiresAuth: true,
    });
    return response;
  },
};

// React Query Hooks
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: authApi.signup,
  });
};

export const useVerifyEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useResendCodeMutation = () => {
  return useMutation({
    mutationFn: authApi.resendCode,
  });
};

export const useAuthStatus = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["auth", "status"],
    queryFn: authApi.getAuthStatus,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserProfile = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: () => authApi.getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    queryClient.clear();
    window.location.href = "/";
  };
};
