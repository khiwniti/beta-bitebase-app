import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"
import { AccessibleColors } from "../../lib/accessibility"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    asChild = false, 
    loading = false,
    loadingText = "Loading...",
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading
    
    // Generate accessible button classes with WCAG AA compliant colors
    const getVariantClasses = () => {
      switch (variant) {
        case "default":
          return cn(
            "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
            "border-2 border-blue-600 hover:border-blue-700 focus:border-blue-700"
          )
        case "destructive":
          return cn(
            "bg-red-600 text-white hover:bg-red-700 focus:bg-red-700",
            "border-2 border-red-600 hover:border-red-700 focus:border-red-700"
          )
        case "outline":
          return cn(
            "border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-50 focus:bg-gray-50",
            "hover:border-gray-500 focus:border-gray-500"
          )
        case "secondary":
          return cn(
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:bg-gray-200",
            "border-2 border-gray-100 hover:border-gray-200 focus:border-gray-200"
          )
        case "ghost":
          return cn(
            "text-gray-700 hover:bg-gray-100 focus:bg-gray-100",
            "border-2 border-transparent hover:border-gray-200 focus:border-gray-200"
          )
        case "link":
          return cn(
            "text-blue-600 underline-offset-4 hover:underline focus:underline",
            "border-2 border-transparent focus:border-blue-600"
          )
        default:
          return ""
      }
    }

    return (
      <Comp
        className={cn(
          // Base styles with improved accessibility
          "inline-flex items-center justify-center whitespace-nowrap rounded-md",
          "text-sm font-medium transition-all duration-200",
          
          // Enhanced focus indicators for WCAG compliance
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          
          // High contrast mode support
          "@media (prefers-contrast: high) { border-width: 2px; }",
          
          // Disabled styles with proper contrast
          isDisabled && [
            "opacity-60 cursor-not-allowed",
            "hover:bg-current hover:text-current hover:border-current",
            "focus:bg-current focus:text-current focus:border-current"
          ],
          
          // Size variants
          {
            "h-10 px-4 py-2 min-w-[44px]": size === "default", // 44px minimum touch target
            "h-9 rounded-md px-3 min-w-[36px]": size === "sm",
            "h-11 rounded-md px-8 min-w-[44px]": size === "lg",
            "h-10 w-10 min-w-[44px]": size === "icon", // Ensure 44px minimum for touch
          },
          
          // Variant-specific colors (WCAG AA compliant)
          getVariantClasses(),
          
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        // Add screen reader support for loading states
        aria-label={loading && loadingText ? loadingText : props['aria-label']}
        type={props.type || "button"}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="presentation"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {loading ? loadingText : children}
        
        {/* Screen reader only text for icon buttons */}
        {size === "icon" && !props['aria-label'] && (
          <span className="sr-only">
            Button
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }