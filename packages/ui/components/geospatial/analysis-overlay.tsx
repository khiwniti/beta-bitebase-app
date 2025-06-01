import * as React from "react"
import { cn } from "../../lib/utils"

export interface AnalysisOverlayProps {
  type: "heatmap" | "density" | "competition" | "demographics"
  data?: any[]
  opacity?: number
  visible?: boolean
  className?: string
}

const AnalysisOverlay = React.forwardRef<HTMLDivElement, AnalysisOverlayProps>(
  ({ type, data = [], opacity = 0.7, visible = true, className, ...props }, ref) => {
    if (!visible) return null

    const getOverlayStyle = () => {
      switch (type) {
        case "heatmap":
          return "bg-gradient-radial from-red-500/50 via-yellow-500/30 to-transparent"
        case "density":
          return "bg-gradient-radial from-blue-500/50 via-cyan-500/30 to-transparent"
        case "competition":
          return "bg-gradient-radial from-purple-500/50 via-pink-500/30 to-transparent"
        case "demographics":
          return "bg-gradient-radial from-green-500/50 via-emerald-500/30 to-transparent"
        default:
          return "bg-gradient-radial from-gray-500/50 via-gray-400/30 to-transparent"
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 pointer-events-none",
          getOverlayStyle(),
          className
        )}
        style={{ opacity }}
        {...props}
      >
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
          {data.length > 0 && (
            <div className="text-gray-600">
              {data.length} data points
            </div>
          )}
        </div>
      </div>
    )
  }
)
AnalysisOverlay.displayName = "AnalysisOverlay"

export { AnalysisOverlay }
