import * as React from "react"

import { cn } from "../../lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asSection?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asSection = false, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, ...props }, ref) => {
    const Component = asSection ? 'section' : 'div';
    
    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-gray-50 shadow-sm",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
          className
        )}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        {...props}
      />
    );
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, ...props }, ref) => {
    const headingProps = {
      ref,
      className: cn(
        "text-lg font-semibold leading-none tracking-tight",
        // Ensure proper text contrast ratios
        "text-gray-900 dark:text-gray-100",
        className
      ),
      ...props
    };
    
    switch (level) {
      case 1:
        return <h1 {...headingProps} />;
      case 2:
        return <h2 {...headingProps} />;
      case 3:
        return <h3 {...headingProps} />;
      case 4:
        return <h4 {...headingProps} />;
      case 5:
        return <h5 {...headingProps} />;
      case 6:
        return <h6 {...headingProps} />;
      default:
        return <h3 {...headingProps} />;
    }
  }
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm", 
      // WCAG AA compliant secondary text colors (4.5:1 contrast)
      "text-gray-600 dark:text-gray-300", 
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } 