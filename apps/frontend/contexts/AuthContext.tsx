"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { markUserAsFirstTime, clearUserSessionData } from "../utils/tourUtils";
import { GoogleAuth } from "google-auth-library";

// Custom User interface to match our backend
interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  uid?: string; // For compatibility with existing code
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signInWithGoogle: (accountType?: string) => Promise<{ isNewUser: boolean }>;
  signInWithGoogleToken: (token: string) => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Backend API base URL
  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://work-2-gjqewehruzacrehd.prod-runtime.all-hands.dev/api"
      : "http://localhost:12001/api";

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("bitebase_token");
      if (token) {
        try {
          const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name,
              uid: userData.id.toString(),
            });
          } else {
            localStorage.removeItem("bitebase_token");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("bitebase_token");
        }
      }
      setLoading(false);
      setMounted(true);
    };

    checkAuth();
  }, []);

  // Skip hydration check for demo

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();

      // Store token
      localStorage.setItem("bitebase_token", data.token);

      // Set user
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        uid: data.user.id.toString(),
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName:
            userData?.firstName || userData?.name || email.split("@")[0],
          lastName: userData?.lastName || "User",
          phone: userData?.phone || "",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();

      // Store token
      localStorage.setItem("bitebase_token", data.token);

      // Set user
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        uid: data.user.id.toString(),
      });

      // Mark as first-time user for tour
      markUserAsFirstTime();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async (accountType?: string) => {
    setLoading(true);
    try {
      // For now, we'll simulate Google sign-in by creating a demo account
      // In production, you would integrate with Google OAuth
      const demoEmail = `demo.${Date.now()}@bitebase.ai`;
      const demoPassword = "demo123456";

      await signUp(demoEmail, demoPassword, {
        name: "Demo User",
        role: accountType || "user",
      });

      return { isNewUser: true };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogleToken = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Google authentication failed");
      }

      const data = await response.json();

      // Store token
      localStorage.setItem("bitebase_token", data.token);

      // Set user
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        uid: data.user.id.toString(),
      });

      if (data.isNewUser) {
        markUserAsFirstTime();
      }

      setLoading(false);
      return { isNewUser: data.isNewUser };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Clear token and user data
      localStorage.removeItem("bitebase_token");
      setUser(null);

      // Clear user session data on logout
      clearUserSessionData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGoogleToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
