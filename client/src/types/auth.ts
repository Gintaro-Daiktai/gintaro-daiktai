export interface User {
  id: number;
  email: string;
  name: string;
  last_name: string;
  role: "admin" | "client";
  confirmed: boolean;
  phone_number: string;
  balance: number;
  registration_date: Date;
  birth_date: Date;
  avatar?: string; // Base64 or URL
}

export interface DecodedToken {
  sub: number; // userId
  email: string;
  role: "admin" | "client";
  confirmed: boolean;
  iat?: number;
  exp?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  confirmed: boolean;
}

export interface SignupData {
  name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  birth_date: string; // ISO date string
}

export interface SignupResponse {
  userId: number;
  email: string;
  message: string;
}

export interface VerifyEmailData {
  userId: number;
  code: string;
}

export interface VerifyEmailResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    role: "admin" | "client";
    confirmed: boolean;
  };
}

export interface ResendCodeData {
  userId?: number;
  email?: string;
}
