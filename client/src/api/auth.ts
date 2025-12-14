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
  UpdateUserData,
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

    return {
      ...response,
      registration_date: new Date(response.registration_date),
      birth_date: new Date(response.birth_date),
    };
  },

  updateUserProfile: async (
    userId: number,
    data: UpdateUserData,
  ): Promise<User> => {
    const response = await apiClient<User>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });

    return {
      ...response,
      registration_date: new Date(response.registration_date),
      birth_date: new Date(response.birth_date),
    };
  },

  deleteUser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient<{ message: string }>(`/users/${userId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
    return response;
  },

  getAllSellers: async (): Promise<
    Array<{
      id: number;
      name: string;
      last_name: string;
      registration_date: string;
      avatar?: string;
    }>
  > => {
    const response = await apiClient<
      Array<{
        id: number;
        name: string;
        last_name: string;
        registration_date: string;
        avatar?: string;
      }>
    >("/users/sellers/all", {
      method: "GET",
      requiresAuth: false,
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

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserData }) =>
      authApi.updateUserProfile(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile", data.id] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => authApi.deleteUser(userId),
    onSuccess: () => {
      removeToken();
      queryClient.clear();
    },
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

export const useAllSellers = () => {
  return useQuery({
    queryKey: ["users", "sellers"],
    queryFn: authApi.getAllSellers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
