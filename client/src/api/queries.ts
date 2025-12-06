import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth";
import { setToken, removeToken } from "@/utils/token";

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
