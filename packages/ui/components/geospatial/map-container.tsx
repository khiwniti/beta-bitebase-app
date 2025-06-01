import * as React from "react"
import { cn } from "../../lib/utils"

export interface MapContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  center?: [number, number]
  zoom?: number
  height?: string | number
  width?: string | number
}

const MapContainer = React.forwardRef<HTMLDivElement, MapContainerProps>(
  ({ className, center = [40.7128, -74.0060], zoom = 13, height = "400px", width = "100%", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg border bg-background",
          className
        )}
        style={{ height, width }}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600 mb-2">
              Interactive Map
            </div>
            <div className="text-sm text-gray-500">
              Center: {center[0].toFixed(4)}, {center[1].toFixed(4)} | Zoom: {zoom}
            </div>
          </div>
        </div>
        {children}
      </div>
    )
  }
)
MapContainer.displayName = "MapContainer"

export { MapContainer }
