/**
 * Enhanced Error Boundary Component
 * Provides comprehensive error handling with connection status monitoring
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Activity, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { connectionMonitor, ConnectionStatus } from '../lib/connection-monitor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showConnectionStatus?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  connectionStatus: ConnectionStatus;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private statusUnsubscribe?: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      connectionStatus: connectionMonitor.getStatus(),
      retryCount: 0,
    };
  }

  componentDidMount() {
    // Subscribe to connection status updates
    this.statusUnsubscribe = connectionMonitor.subscribe((status) => {
      this.setState({ connectionStatus: status });
    });
  }

  componentWillUnmount() {
    // Unsubscribe from connection status updates
    if (this.statusUnsubscribe) {
      this.statusUnsubscribe();
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service (in production)
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In production, this would send to error tracking service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      connectionStatus: this.state.connectionStatus,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.log('📊 Error Report:', errorReport);
    
    // TODO: Send to analytics/monitoring service
    // analytics.captureException(error, errorReport);
  };

  private handleRetry = async () => {
    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1,
    }));

    // Force connection check before retry
    await connectionMonitor.forceCheck();

    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private getErrorCategory(error: Error): 'network' | 'data' | 'render' | 'unknown' {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'network';
    }
    if (message.includes('data') || message.includes('json') || message.includes('parse')) {
      return 'data';
    }
    if (message.includes('render') || message.includes('component')) {
      return 'render';
    }
    return 'unknown';
  }

  private getErrorSuggestions(category: string, connectionStatus: ConnectionStatus): string[] {
    const suggestions: string[] = [];

    if (!connectionStatus.isConnected) {
      suggestions.push('Check your internet connection');
      suggestions.push('Ensure the backend server is running');
    }

    switch (category) {
      case 'network':
        suggestions.push('Try refreshing the page');
        suggestions.push('Check if the API server is accessible');
        break;
      case 'data':
        suggestions.push('The data format may have changed');
        suggestions.push('Try clearing your browser cache');
        break;
      case 'render':
        suggestions.push('A component failed to render properly');
        suggestions.push('Try refreshing the page');
        break;
      default:
        suggestions.push('An unexpected error occurred');
        suggestions.push('Try refreshing the page or contact support');
    }

    return suggestions;
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, connectionStatus, retryCount } = this.state;
      const errorCategory = error ? this.getErrorCategory(error) : 'unknown';
      const suggestions = this.getErrorSuggestions(errorCategory, connectionStatus);

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                Oops! Something went wrong
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We're sorry, but an unexpected error has occurred. Here's what we know:
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Connection Status */}
              {this.props.showConnectionStatus && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {connectionStatus.isConnected ? (
                      <Wifi className="w-5 h-5 text-green-600" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      Connection Status: {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span>Backend: {connectionStatus.backendHealth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-500" />
                      <span>Response: {connectionStatus.apiResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span>Errors: {connectionStatus.errorCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Error Details
                  </h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                      {error?.message || 'Unknown error occurred'}
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Suggested Solutions
                  </h3>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-blue-500 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                  disabled={retryCount >= 3}
                >
                  <RefreshCw className="w-4 h-4" />
                  {retryCount >= 3 ? 'Max Retries Reached' : `Retry ${retryCount > 0 ? `(${retryCount}/3)` : ''}`}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleRefresh}
                  className="flex items-center gap-2"
                >
                  Refresh Page
                </Button>
              </div>

              {/* Debug Info (Development only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    Debug Information (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Error Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error reporting in functional components
export function useErrorHandler() {
  const reportError = React.useCallback((error: Error, context?: string) => {
    console.error(`🚨 Manual Error Report ${context ? `(${context})` : ''}:`, error);
    
    // In production, send to monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
    
    console.log('📊 Manual Error Report:', errorReport);
  }, []);

  return { reportError };
}
