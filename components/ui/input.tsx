import * as React from "react"
import { cn } from "../../lib/utils"
import { FormAccessibility } from "../../lib/accessibility"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  helperText?: string
  label?: string
  hideLabel?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error, 
    helperText, 
    label,
    hideLabel = false,
    id,
    required,
    disabled,
    ...props 
  }, ref) => {
    // Generate unique ID if not provided
    const inputId = id || React.useId()
    const hasError = Boolean(error)
    
    // Get accessibility props
    const fieldProps = FormAccessibility.getFieldProps(
      inputId,
      label || props['aria-label'] || '',
      error,
      helperText,
      required
    )
    
    const errorProps = FormAccessibility.getErrorProps(inputId)
    const helperProps = FormAccessibility.getHelperProps(inputId)

    return (
      <div className="space-y-1">
        {/* Label - visible or screen reader only */}
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-gray-900",
              hideLabel && "sr-only"
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {/* Input field */}
        <input
          {...fieldProps}
          type={type}
          className={cn(
            // Base styles with improved accessibility
            "flex h-10 w-full rounded-md border text-sm",
            "px-3 py-2 bg-white",
            
            // Focus styles with WCAG AA compliance
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            
            // Normal state colors (WCAG AA compliant)
            !hasError && !disabled && [
              "border-gray-400 text-gray-900",
              "hover:border-gray-500",
              "focus:border-blue-500"
            ],
            
            // Error state colors (WCAG AA compliant)
            hasError && !disabled && [
              "border-red-500 text-gray-900",
              "hover:border-red-600",
              "focus:border-red-500 focus:ring-red-500"
            ],
            
            // Disabled state
            disabled && [
              "bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed",
              "placeholder:text-gray-400"
            ],
            
            // Placeholder styles
            "placeholder:text-gray-500",
            
            // File input specific styles
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900",
            
            // High contrast mode support
            "@media (prefers-contrast: high) { border-width: 2px; }",
            
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        
        {/* Error message */}
        {error && (
          <div 
            {...errorProps}
            className="text-sm text-red-600 flex items-start gap-1"
          >
            <svg
              className="h-4 w-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              role="presentation"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Helper text */}
        {helperText && !error && (
          <div 
            {...helperProps}
            className="text-sm text-gray-600"
          >
            {helperText}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Create a separate component for simple inputs without wrapper
const SimpleInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'error' | 'helperText' | 'label'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-sm text-gray-900",
          "placeholder:text-gray-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
SimpleInput.displayName = "SimpleInput"

export { Input, SimpleInput }