'use client'

import React, { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Alert, AlertDescription } from './alert'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Add your error reporting service here
      // e.g., Sentry, LogRocket, etc.
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl shadow-2xl border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-900">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-red-700">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Message */}
              <Alert className="border-red-200 bg-red-50">
                <Bug className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Error:</strong> {this.state.error?.message || 'Unknown error occurred'}
                </AlertDescription>
              </Alert>

              {/* Error Details (if enabled) */}
              {this.props.showDetails && this.state.error && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <details>
                    <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                      Technical Details
                    </summary>
                    <div className="space-y-2 text-gray-600">
                      <div>
                        <strong>Error:</strong> {this.state.error.name}
                      </div>
                      <div>
                        <strong>Message:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1 bg-primary hover:bg-primary-600"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1"
                >
                  Reload Page
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                If this problem persists, please contact our support team with the error details above.
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo)
    
    // Log to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Add your error reporting service here
    }
  }
}

// Simple error fallback component
export function SimpleErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error
  resetError: () => void 
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
      <p className="text-red-700 mb-4">{error.message}</p>
      <Button 
        onClick={resetError}
        variant="outline"
        className="border-red-300 text-red-700 hover:bg-red-50"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try again
      </Button>
    </div>
  )
}

// Loading error component
export function LoadingErrorFallback({ 
  error, 
  retry 
}: { 
  error: Error
  retry: () => void 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="text-center p-6">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={retry} className="bg-primary hover:bg-primary-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}