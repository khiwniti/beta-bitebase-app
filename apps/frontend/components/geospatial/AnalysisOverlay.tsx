"use client"

import React from 'react'

interface AnalysisOverlayProps {
  type: "heatmap" | "density" | "competition" | "demographics"
  visible: boolean
}

export function AnalysisOverlay({ type, visible }: AnalysisOverlayProps) {
  if (!visible) return null
  
  const getOverlayContent = () => {
    switch (type) {
      case "heatmap":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Heatmap simulation */}
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500 opacity-30 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-orange-500 opacity-25 rounded-full blur-lg"></div>
            <div className="absolute bottom-1/3 left-1/2 w-28 h-28 bg-yellow-500 opacity-20 rounded-full blur-lg"></div>
            <div className="absolute top-3/4 right-1/3 w-20 h-20 bg-green-500 opacity-15 rounded-full blur-md"></div>
          </div>
        )
      case "density":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Density dots */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                }}
              />
            ))}
          </div>
        )
      case "competition":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Competition zones */}
            <div className="absolute top-1/4 left-1/4 w-40 h-40 border-2 border-red-500 border-dashed rounded-lg opacity-60">
              <div className="absolute -top-6 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                High Competition
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4 w-32 h-32 border-2 border-yellow-500 border-dashed rounded-lg opacity-60">
              <div className="absolute -top-6 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                Medium Competition
              </div>
            </div>
            <div className="absolute top-1/2 right-1/2 w-24 h-24 border-2 border-green-500 border-dashed rounded-lg opacity-60">
              <div className="absolute -top-6 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Low Competition
              </div>
            </div>
          </div>
        )
      case "demographics":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Demographics overlay */}
            <div className="absolute top-1/3 left-1/4 w-36 h-24 bg-purple-500 opacity-20 rounded-lg">
              <div className="absolute -top-6 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                Young Professionals
              </div>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-32 h-28 bg-blue-500 opacity-20 rounded-lg">
              <div className="absolute -top-6 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Families
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 w-28 h-20 bg-green-500 opacity-20 rounded-lg">
              <div className="absolute -top-6 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Students
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <>
      {getOverlayContent()}
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg">
        <div className="text-xs font-semibold text-gray-700 mb-2">
          {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
        </div>
        <div className="space-y-1">
          {type === "heatmap" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">High Activity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Medium Activity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Low Activity</span>
              </div>
            </>
          )}
          {type === "density" && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Restaurant Locations</span>
            </div>
          )}
          {type === "competition" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-red-500 border-dashed"></div>
                <span className="text-xs text-gray-600">High Competition</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-yellow-500 border-dashed"></div>
                <span className="text-xs text-gray-600">Medium Competition</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-green-500 border-dashed"></div>
                <span className="text-xs text-gray-600">Low Competition</span>
              </div>
            </>
          )}
          {type === "demographics" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-xs text-gray-600">Young Professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600">Families</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Students</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
