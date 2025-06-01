import * as React from "react"
import { cn } from "../../lib/utils"

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "flex items-center justify-between h-16 px-6 border-b bg-background",
          className
        )}
        {...props}
      >
        {children}
      </header>
    )
  }
)
Header.displayName = "Header"

export { Header }
