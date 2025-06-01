import * as React from "react"
import { cn } from "../../lib/utils"

export interface DemographicData {
  area: string
  population: number
  medianIncome: number
  ageGroups: {
    "18-25": number
    "26-35": number
    "36-50": number
    "51-65": number
    "65+": number
  }
  coordinates: [number, number][]
}

export interface DemographicLayerProps {
  data: DemographicData[]
  metric: "population" | "income" | "age"
  visible?: boolean
  className?: string
}

const DemographicLayer = React.forwardRef<HTMLDivElement, DemographicLayerProps>(
  ({ data, metric, visible = true, className, ...props }, ref) => {
    if (!visible) return null

    const getColorIntensity = (value: number, max: number) => {
      const intensity = Math.min(value / max, 1)
      return `rgba(59, 130, 246, ${intensity * 0.6})` // Blue with varying opacity
    }

    const maxValue = React.useMemo(() => {
      switch (metric) {
        case "population":
          return Math.max(...data.map(d => d.population))
        case "income":
          return Math.max(...data.map(d => d.medianIncome))
        case "age":
          return Math.max(...data.map(d => d.ageGroups["26-35"])) // Focus on key demographic
        default:
          return 1
      }
    }, [data, metric])

    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 pointer-events-none", className)}
        {...props}
      >
        {data.map((area, index) => {
          let value: number
          switch (metric) {
            case "population":
              value = area.population
              break
            case "income":
              value = area.medianIncome
              break
            case "age":
              value = area.ageGroups["26-35"]
              break
            default:
              value = 0
          }

          return (
            <div
              key={area.area}
              className="absolute rounded-lg border border-blue-300/50"
              style={{
                backgroundColor: getColorIntensity(value, maxValue),
                left: `${20 + (index % 3) * 30}%`,
                top: `${20 + Math.floor(index / 3) * 25}%`,
                width: "25%",
                height: "20%",
              }}
            >
              <div className="absolute top-1 left-1 bg-white/90 rounded px-1 text-xs">
                {area.area}
              </div>
              <div className="absolute bottom-1 right-1 bg-white/90 rounded px-1 text-xs">
                {metric === "income" ? `$${(value / 1000).toFixed(0)}k` : value.toLocaleString()}
              </div>
            </div>
          )
        })}
        
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
          <div className="text-xs font-medium mb-1">
            {metric.charAt(0).toUpperCase() + metric.slice(1)} Density
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span>Low</span>
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>Medium</span>
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>High</span>
          </div>
        </div>
      </div>
    )
  }
)
DemographicLayer.displayName = "DemographicLayer"

export { DemographicLayer }
