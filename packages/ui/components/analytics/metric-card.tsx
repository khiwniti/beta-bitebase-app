import * as React from "react"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
    period: string
  }
  icon?: React.ReactNode
  description?: string
  className?: string
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, change, icon, description, className, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("", className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span
                className={cn(
                  "flex items-center",
                  change.type === "increase" ? "text-green-600" : "text-red-600"
                )}
              >
                {change.type === "increase" ? "↗" : "↘"}
                {Math.abs(change.value)}%
              </span>
              <span>from {change.period}</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    )
  }
)
MetricCard.displayName = "MetricCard"

export { MetricCard }
