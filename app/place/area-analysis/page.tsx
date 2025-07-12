'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Building, 
  Car,
  Train,
  ShoppingBag,
  Coffee,
  Utensils,
  Star,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

export default function AreaAnalysisPage() {
  const [selectedArea, setSelectedArea] = useState('sukhumvit')

  const areaData = {
    sukhumvit: {
      name: 'Sukhumvit District',
      score: 8.5,
      population: '125,000',
      avgIncome: '฿45,000',
      footTraffic: 'Very High',
      competition: 'High',
      demographics: {
        age: { '18-25': 25, '26-35': 35, '36-45': 25, '46+': 15 },
        income: { 'Low': 15, 'Medium': 45, 'High': 40 },
        lifestyle: { 'Professionals': 40, 'Students': 20, 'Tourists': 25, 'Locals': 15 }
      },
      amenities: [
        { name: 'BTS Stations', count: 8, icon: Train },
        { name: 'Shopping Malls', count: 12, icon: ShoppingBag },
        { name: 'Hotels', count: 45, icon: Building },
        { name: 'Offices', count: 120, icon: Building },
        { name: 'Parking Lots', count: 25, icon: Car }
      ],
      restaurants: {
        total: 450,
        byType: {
          'Thai': 120,
          'International': 95,
          'Fast Food': 85,
          'Cafe': 75,
          'Fine Dining': 45,
          'Street Food': 30
        }
      },
      insights: [
        'High concentration of office workers during lunch hours',
        'Strong tourist presence, especially on weekends',
        'Premium pricing acceptable due to high income demographics',
        'Competition is intense but market size supports multiple players'
      ]
    }
  }

  const currentArea = areaData[selectedArea]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPin className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentArea.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">Location Intelligence & Demographics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentArea.score}</span>
              <span className="text-gray-600 dark:text-gray-400">/10</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Population</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentArea.population}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Income</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentArea.avgIncome}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Foot Traffic</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentArea.footTraffic}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Competition</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentArea.competition}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demographics Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Age Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(currentArea.demographics.age).map(([age, percentage]) => (
                  <div key={age} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{age} years</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${Number(percentage)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Number(percentage)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Income Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(currentArea.demographics.income).map(([level, percentage]) => (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{level} Income</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Number(percentage)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Number(percentage)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Lifestyle Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(currentArea.demographics.lifestyle).map(([segment, percentage]) => (
                  <div key={segment} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{segment}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Number(percentage)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Number(percentage)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Area Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Area Amenities & Infrastructure
            </CardTitle>
            <CardDescription>
              Key facilities and infrastructure that impact foot traffic and accessibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {currentArea.amenities.map((amenity) => {
                const IconComponent = amenity.icon
                return (
                  <div key={amenity.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <IconComponent className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{amenity.name}</p>
                    <p className="text-2xl font-bold text-primary-600">{amenity.count}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Competition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="h-5 w-5 mr-2" />
              Restaurant Landscape
            </CardTitle>
            <CardDescription>
              Analysis of existing restaurants and competition in the area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Total Restaurants: {currentArea.restaurants.total}</h4>
                <div className="space-y-3">
                  {Object.entries(currentArea.restaurants.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${(Number(count) / currentArea.restaurants.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{Number(count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Market Opportunity</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Despite high competition, the large market size and diverse customer base provide opportunities for differentiated concepts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Key Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentArea.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Detailed Report
          </Button>
          <Button>
            <MapPin className="h-4 w-4 mr-2" />
            Analyze Another Area
          </Button>
        </div>
      </div>
  )
}
