import * as React from "react"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  height?: string | number
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ title, description, height = "300px", className, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("", className)} {...props}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </CardHeader>
        )}
        <CardContent>
          <div 
            className="w-full"
            style={{ height }}
          >
            {children}
          </div>
        </CardContent>
      </Card>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

export { ChartContainer }
