import * as React from "react"
import { cn } from "../../lib/utils"

export interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "flex-1 px-4 py-6 space-y-2",
          className
        )}
        {...props}
      >
        {children}
      </nav>
    )
  }
)
Navigation.displayName = "Navigation"

export { Navigation }
