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
  const API_BASE = "http://localhost:12000/api";

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("bitebase_token");
      if (token) {
        try {
          const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            if (userData && userData.id && userData.email && userData.role) {
              setUser({
                id: userData.id,
                email: userData.email,
                role: userData.role,
                name: userData.name || '',
                uid: userData.id.toString(),
              });
            } else {
              localStorage.removeItem("bitebase_token");
            }
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
      // Demo login for testing - bypass backend
      if (email === 'demo@bitebase.com' && password === 'demo123') {
        const demoUser = {
          id: 1,
          email: 'demo@bitebase.com',
          role: 'user',
          name: 'Demo User',
          uid: '1',
        };
        
        // Store demo token
        localStorage.setItem("bitebase_token", "demo_token_123");
        document.cookie = `auth_token=demo_token_123; path=/; max-age=${7 * 24 * 60 * 60}`;
        document.cookie = `user_role=user; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        setUser(demoUser);
        setLoading(false);
        return;
      }

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

      if (data && data.token && data.user && data.user.id && data.user.email && data.user.role) {
        // Store token in localStorage and cookie
        localStorage.setItem("bitebase_token", data.token);
        document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        document.cookie = `user_role=${data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

        // Set user
        setUser({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name || '',
          uid: data.user.id.toString(),
        });
      } else {
        throw new Error("Invalid response data from server");
      }

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

      if (data && data.token && data.user && data.user.id && data.user.email && data.user.role) {
        // Store token in localStorage and cookie
        localStorage.setItem("bitebase_token", data.token);
        document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        document.cookie = `user_role=${data.user.role}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

        // Set user
        setUser({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name || '',
          uid: data.user.id.toString(),
        });

        // Mark as first-time user for tour
        markUserAsFirstTime();
      } else {
        throw new Error("Invalid response data from server");
      }
      
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

      if (data && data.token && data.user && data.user.id && data.user.email && data.user.role) {
        // Store token
        localStorage.setItem("bitebase_token", data.token);

        // Set user
        setUser({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name || '',
          uid: data.user.id.toString(),
        });

        if (data.isNewUser) {
          markUserAsFirstTime();
        }

        setLoading(false);
        return { isNewUser: data.isNewUser || false };
      } else {
        throw new Error("Invalid response data from server");
      }
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
      
      // Clear cookies
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
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
