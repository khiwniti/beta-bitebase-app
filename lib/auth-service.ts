/**
 * Production-Ready Authentication Service
 * Replaces demo authentication with real JWT-based auth
 */

import { API_CONFIG } from "./config";

interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  uid?: string;
  subscription_tier?: "basic" | "pro" | "enterprise";
  subscription_status?: "active" | "inactive" | "trial";
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refresh_token?: string;
    expires_in: number;
  };
  error?: string;
}

class AuthService {
  private baseUrl: string;
  private tokenKey = "bitebase_token";
  private refreshTokenKey = "bitebase_refresh_token";

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // Production-ready sign in
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Login failed",
        };
      }

      if (data.success && data.data) {
        // Store tokens securely
        this.storeTokens(data.data.token, data.data.refresh_token);

        return {
          success: true,
          data: data.data,
        };
      }

      return {
        success: false,
        error: "Invalid response from server",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Production-ready sign up
  async signUp(
    email: string,
    password: string,
    userData?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      company?: string;
    },
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: userData?.firstName || email.split("@")[0],
          last_name: userData?.lastName || "User",
          phone: userData?.phone || "",
          company: userData?.company || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Registration failed",
        };
      }

      if (data.success && data.data) {
        // Store tokens securely
        this.storeTokens(data.data.token, data.data.refresh_token);

        return {
          success: true,
          data: data.data,
        };
      }

      return {
        success: false,
        error: "Invalid response from server",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Google OAuth sign in
  async signInWithGoogle(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Google authentication failed",
        };
      }

      if (data.success && data.data) {
        this.storeTokens(data.data.token, data.data.refresh_token);

        return {
          success: true,
          data: data.data,
        };
      }

      return {
        success: false,
        error: "Invalid response from server",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Verify current session
  async verifySession(): Promise<{ user: User | null; error?: string }> {
    const token = this.getToken();

    if (!token) {
      return { user: null };
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token might be expired, try to refresh
        const refreshResult = await this.refreshToken();
        if (refreshResult.success && refreshResult.data) {
          return { user: refreshResult.data.user };
        }

        this.clearTokens();
        return { user: null, error: "Session expired" };
      }

      const data = await response.json();

      if (data.success && data.data) {
        return { user: data.data };
      }

      return { user: null, error: "Invalid session" };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        error: "No refresh token available",
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.clearTokens();
        return {
          success: false,
          error: data.message || "Token refresh failed",
        };
      }

      if (data.success && data.data) {
        this.storeTokens(data.data.token, data.data.refresh_token);

        return {
          success: true,
          data: data.data,
        };
      }

      return {
        success: false,
        error: "Invalid response from server",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    const token = this.getToken();

    if (token) {
      try {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout request failed:", error);
      }
    }

    this.clearTokens();
  }

  // Token management
  private storeTokens(token: string, refreshToken?: string): void {
    localStorage.setItem(this.tokenKey, token);

    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    // Set secure HTTP-only cookies for additional security
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);

    // Clear cookies
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  // Password reset
  async requestPasswordReset(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        error: response.ok
          ? undefined
          : data.message || "Password reset request failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Email verification
  async verifyEmail(
    token: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        error: response.ok
          ? undefined
          : data.message || "Email verification failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export type { User, AuthResponse };
