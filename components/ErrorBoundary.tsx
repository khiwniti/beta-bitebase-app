"use client";

import React, { ReactNode, useState, useEffect } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ErrorBoundary({ children, fallback }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      // Ignore certain common errors that don't affect functionality
      if (
        error.message.includes("ResizeObserver loop limit exceeded") ||
        error.message.includes("Non-Error promise rejection captured") ||
        error.message.includes("Script error")
      ) {
        return;
      }

      setHasError(true);
      setError(new Error(error.message));

      // Only log errors in development
      if (process.env.NODE_ENV === "development") {
        console.error("ErrorBoundary caught an error:", error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Ignore certain promise rejections that are handled elsewhere
      if (
        typeof event.reason === "string" &&
        (event.reason.includes("AbortError") ||
          event.reason.includes("Network request failed"))
      ) {
        return;
      }

      setHasError(true);
      setError(new Error(event.reason));

      // Only log errors in development
      if (process.env.NODE_ENV === "development") {
        console.error(
          "ErrorBoundary caught an unhandled promise rejection:",
          event.reason,
        );
      }
    };

    // Only add listeners on client side
    if (typeof window !== "undefined") {
      window.addEventListener("error", handleError);
      window.addEventListener("unhandledrejection", handleUnhandledRejection);

      return () => {
        window.removeEventListener("error", handleError);
        window.removeEventListener(
          "unhandledrejection",
          handleUnhandledRejection,
        );
      };
    }
  }, []);

  const handleReset = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError) {
    // Custom fallback UI
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            <div className="mt-6 space-x-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === "development" && error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-600 cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
