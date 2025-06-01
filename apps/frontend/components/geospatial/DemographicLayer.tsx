"use client"

import React from 'react'

interface Demographics {
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

interface DemographicLayerProps {
  data: Demographics[]
  metric: "population" | "income" | "age"
  visible: boolean
}

export function DemographicLayer({ data, metric, visible }: DemographicLayerProps) {
  if (!visible || data.length === 0) return null
  
  const getColorByMetric = (demo: Demographics) => {
    switch (metric) {
      case "population":
        if (demo.population > 80000) return "bg-red-500"
        if (demo.population > 60000) return "bg-orange-500"
        if (demo.population > 40000) return "bg-yellow-500"
        return "bg-green-500"
      case "income":
        if (demo.medianIncome > 50000) return "bg-purple-500"
        if (demo.medianIncome > 40000) return "bg-blue-500"
        if (demo.medianIncome > 30000) return "bg-teal-500"
        return "bg-gray-500"
      case "age":
        const youngProfessionals = demo.ageGroups["26-35"]
        if (youngProfessionals > 40) return "bg-pink-500"
        if (youngProfessionals > 30) return "bg-indigo-500"
        if (youngProfessionals > 20) return "bg-cyan-500"
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }
  
  const getMetricValue = (demo: Demographics) => {
    switch (metric) {
      case "population":
        return `${(demo.population / 1000).toFixed(1)}K`
      case "income":
        return `$${(demo.medianIncome / 1000).toFixed(1)}K`
      case "age":
        return `${demo.ageGroups["26-35"]}%`
      default:
        return ""
    }
  }
  
  const getMetricLabel = () => {
    switch (metric) {
      case "population":
        return "Population"
      case "income":
        return "Median Income"
      case "age":
        return "Young Professionals (26-35)"
      default:
        return ""
    }
  }
  
  return (
    <>
      {/* Demographic areas */}
      {data.map((demo, index) => (
        <div
          key={demo.area}
          className="absolute pointer-events-none"
          style={{
            left: `${20 + (index % 3) * 25}%`,
            top: `${20 + Math.floor(index / 3) * 30}%`,
            width: "20%",
            height: "25%",
          }}
        >
          <div className={`w-full h-full ${getColorByMetric(demo)} opacity-30 rounded-lg`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-800">
                <div className="text-center">
                  <div className="font-bold">{demo.area}</div>
                  <div className="text-xs">{getMetricValue(demo)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg">
        <div className="text-xs font-semibold text-gray-700 mb-2">
          {getMetricLabel()}
        </div>
        <div className="space-y-1">
          {metric === "population" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">&gt;80K</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-xs text-gray-600">60K-80K</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-600">40K-60K</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">&lt;40K</span>
              </div>
            </>
          )}
          {metric === "income" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-xs text-gray-600">&gt;$50K</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600">$40K-$50K</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-teal-500 rounded"></div>
                <span className="text-xs text-gray-600">$30K-$40K</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span className="text-xs text-gray-600">&lt;$30K</span>
              </div>
            </>
          )}
          {metric === "age" && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded"></div>
                <span className="text-xs text-gray-600">&gt;40%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                <span className="text-xs text-gray-600">30%-40%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                <span className="text-xs text-gray-600">20%-30%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span className="text-xs text-gray-600">&lt;20%</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
