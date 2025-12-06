import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";

const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  return !isTokenExpired(token);
};
