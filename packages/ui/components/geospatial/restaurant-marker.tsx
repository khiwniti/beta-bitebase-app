import * as React from "react"
import { cn } from "../../lib/utils"

export interface RestaurantMarkerProps {
  restaurant: {
    id: string
    name: string
    cuisine: string
    rating?: number
    position: [number, number]
  }
  isSelected?: boolean
  onClick?: (restaurant: any) => void
  className?: string
}

const RestaurantMarker = React.forwardRef<HTMLDivElement, RestaurantMarkerProps>(
  ({ restaurant, isSelected = false, onClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
          "bg-red-500 text-white rounded-full p-2 shadow-lg hover:shadow-xl",
          isSelected && "bg-red-700 scale-110",
          className
        )}
        onClick={() => onClick?.(restaurant)}
        {...props}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          🍽️
        </div>
        {isSelected && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-black p-2 rounded shadow-lg whitespace-nowrap z-10">
            <div className="font-semibold">{restaurant.name}</div>
            <div className="text-sm text-gray-600">{restaurant.cuisine}</div>
            {restaurant.rating && (
              <div className="text-sm">⭐ {restaurant.rating}/5</div>
            )}
          </div>
        )}
      </div>
    )
  }
)
RestaurantMarker.displayName = "RestaurantMarker"

export { RestaurantMarker }
