/**
 * Production Monitoring and Error Tracking Service
 * Replaces console.log with proper logging and monitoring
 */

// Error tracking interface
interface ErrorContext {
  userId?: string;
  userEmail?: string;
  page?: string;
  action?: string;
  timestamp?: string;
  userAgent?: string;
  url?: string;
  additionalData?: Record<string, any>;
}

// Performance metrics interface
interface PerformanceMetric {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count";
  timestamp: string;
  context?: Record<string, any>;
}

// User analytics event interface
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

class MonitoringService {
  private isProduction: boolean;
  private apiUrl: string;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  // Error tracking
  async trackError(error: Error, context?: ErrorContext): Promise<void> {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      ...context,
    };

    // Log to console in development
    if (!this.isProduction) {
      console.error("🚨 Error tracked:", errorData);
    }

    // Send to monitoring service in production
    if (this.isProduction) {
      try {
        await this.sendToMonitoring("/monitoring/errors", errorData);
      } catch (monitoringError) {
        console.error(
          "Failed to send error to monitoring service:",
          monitoringError,
        );
      }
    }

    // Send to external services (Sentry, etc.)
    this.sendToExternalServices("error", errorData);
  }

  // Performance monitoring
  async trackPerformance(metric: PerformanceMetric): Promise<void> {
    const performanceData = {
      ...metric,
      timestamp: metric.timestamp || new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    // Log to console in development
    if (!this.isProduction) {
      console.log("📊 Performance metric:", performanceData);
    }

    // Send to monitoring service
    if (this.isProduction) {
      try {
        await this.sendToMonitoring("/monitoring/performance", performanceData);
      } catch (error) {
        console.error("Failed to send performance metric:", error);
      }
    }
  }

  // User analytics
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    const eventData = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
      sessionId: this.getSessionId(),
    };

    // Log to console in development
    if (!this.isProduction) {
      console.log("📈 Analytics event:", eventData);
    }

    // Send to analytics service
    if (this.isProduction) {
      try {
        await this.sendToMonitoring("/analytics/events", eventData);
      } catch (error) {
        console.error("Failed to send analytics event:", error);
      }
    }

    // Send to external analytics services
    this.sendToExternalServices("analytics", eventData);
  }

  // API call monitoring
  async trackApiCall(
    endpoint: string,
    method: string,
    duration: number,
    status: number,
    error?: string,
  ): Promise<void> {
    const apiCallData = {
      endpoint,
      method,
      duration,
      status,
      error,
      timestamp: new Date().toISOString(),
      success: status >= 200 && status < 300,
    };

    // Log to console in development
    if (!this.isProduction) {
      const emoji = apiCallData.success ? "✅" : "❌";
      console.log(`${emoji} API Call:`, apiCallData);
    }

    // Send to monitoring service
    if (this.isProduction) {
      try {
        await this.sendToMonitoring("/monitoring/api-calls", apiCallData);
      } catch (monitoringError) {
        console.error("Failed to track API call:", monitoringError);
      }
    }
  }

  // User session tracking
  async trackUserSession(
    userId: string,
    action: "login" | "logout" | "session_start" | "session_end",
  ): Promise<void> {
    const sessionData = {
      userId,
      action,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    // Log to console in development
    if (!this.isProduction) {
      console.log("👤 User session:", sessionData);
    }

    // Send to monitoring service
    if (this.isProduction) {
      try {
        await this.sendToMonitoring("/monitoring/sessions", sessionData);
      } catch (error) {
        console.error("Failed to track user session:", error);
      }
    }
  }

  // Business metrics tracking
  async trackBusinessMetric(
    metric: string,
    value: number,
    context?: Record<string, any>,
  ): Promise<void> {
    const businessData = {
      metric,
      value,
      context,
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (!this.isProduction) {
      console.log("💼 Business metric:", businessData);
    }

    // Send to monitoring service
    if (this.isProduction) {
      try {
        await this.sendToMonitoring(
          "/monitoring/business-metrics",
          businessData,
        );
      } catch (error) {
        console.error("Failed to track business metric:", error);
      }
    }
  }

  // Health check monitoring
  async trackHealthCheck(
    service: string,
    status: "healthy" | "unhealthy",
    responseTime?: number,
    error?: string,
  ): Promise<void> {
    const healthData = {
      service,
      status,
      responseTime,
      error,
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (!this.isProduction) {
      const emoji = status === "healthy" ? "💚" : "💔";
      console.log(`${emoji} Health check:`, healthData);
    }

    // Send to monitoring service
    if (this.isProduction) {
      try {
        await this.sendToMonitoring("/monitoring/health", healthData);
      } catch (monitoringError) {
        console.error("Failed to track health check:", monitoringError);
      }
    }
  }

  // Private helper methods
  private async sendToMonitoring(endpoint: string, data: any): Promise<void> {
    if (!this.apiUrl) return;

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Monitoring request failed: ${response.status}`);
    }
  }

  private sendToExternalServices(type: "error" | "analytics", data: any): void {
    // Sentry for error tracking
    if (
      type === "error" &&
      typeof window !== "undefined" &&
      (window as any).Sentry
    ) {
      (window as any).Sentry.captureException(new Error(data.message), {
        extra: data,
      });
    }

    // Google Analytics for events
    if (
      type === "analytics" &&
      typeof window !== "undefined" &&
      (window as any).gtag
    ) {
      (window as any).gtag("event", data.event, data.properties);
    }

    // Mixpanel for user analytics
    if (
      type === "analytics" &&
      typeof window !== "undefined" &&
      (window as any).mixpanel
    ) {
      (window as any).mixpanel.track(data.event, data.properties);
    }
  }

  private getSessionId(): string {
    if (typeof window === "undefined") return "server";

    let sessionId = sessionStorage.getItem("bitebase_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("bitebase_session_id", sessionId);
    }
    return sessionId;
  }

  // Utility methods for common tracking scenarios
  trackPageView(page: string, userId?: string): void {
    this.trackEvent({
      event: "page_view",
      properties: { page },
      userId,
    });
  }

  trackButtonClick(buttonName: string, context?: Record<string, any>): void {
    this.trackEvent({
      event: "button_click",
      properties: { button_name: buttonName, ...context },
    });
  }

  trackFormSubmission(
    formName: string,
    success: boolean,
    error?: string,
  ): void {
    this.trackEvent({
      event: "form_submission",
      properties: { form_name: formName, success, error },
    });
  }

  trackSearchQuery(
    query: string,
    results: number,
    filters?: Record<string, any>,
  ): void {
    this.trackEvent({
      event: "search_query",
      properties: { query, results_count: results, filters },
    });
  }

  trackFeatureUsage(feature: string, context?: Record<string, any>): void {
    this.trackEvent({
      event: "feature_usage",
      properties: { feature, ...context },
    });
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();

// Export types
export type { ErrorContext, PerformanceMetric, AnalyticsEvent };
