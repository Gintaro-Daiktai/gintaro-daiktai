import React, { createContext, useState, useEffect } from "react";
import {
  getToken,
  setToken as saveToken,
  removeToken,
  decodeToken,
  isTokenValid,
} from "@/utils/token";
import type { AuthState, User } from "@/types/auth";

interface AuthContextType extends AuthState {
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();

      if (token && isTokenValid(token)) {
        const decoded = decodeToken(token);

        if (decoded) {
          // Create basic user from JWT payload
          const user: User = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            confirmed: decoded.confirmed,
            // These will be populated when full profile is fetched
            name: "",
            last_name: "",
            phone_number: "",
            balance: 0,
            registration_date: new Date(),
            birth_date: new Date(),
          };

          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }

      // No valid token found
      removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    initAuth();

    // Listen for logout events from apiClient
    const handleLogout = () => {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const setAuth = (token: string, user: User) => {
    saveToken(token);
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const clearAuth = () => {
    removeToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: User) => {
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setAuth,
        clearAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
