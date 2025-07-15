'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Navigation,
  Search,
  Filter,
  BarChart3,
  Target
} from 'lucide-react';

interface LocationData {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  footTraffic: number;
  demographics: {
    avgAge: number;
    incomeLevel: string;
    primaryInterests: string[];
  };
  competition: {
    count: number;
    avgRating: number;
    priceRange: string;
  };
  score: number;
  insights: string[];
}

const LocationIntelligenceTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock location data
  const locations: LocationData[] = [
    {
      id: '1',
      name: 'Siam Square',
      address: 'Siam Square, Pathum Wan, Bangkok',
      coordinates: [100.5352, 13.7459],
      footTraffic: 15000,
      demographics: {
        avgAge: 28,
        incomeLevel: 'High',
        primaryInterests: ['Shopping', 'Dining', 'Entertainment']
      },
      competition: {
        count: 45,
        avgRating: 4.2,
        priceRange: '$$-$$$'
      },
      score: 8.7,
      insights: [
        'High foot traffic during lunch and dinner hours',
        'Young professional demographic with disposable income',
        'Strong competition but high demand for quality dining'
      ]
    },
    {
      id: '2',
      name: 'Thonglor District',
      address: 'Thonglor, Watthana, Bangkok',
      coordinates: [100.5692, 13.7307],
      footTraffic: 8500,
      demographics: {
        avgAge: 32,
        incomeLevel: 'Very High',
        primaryInterests: ['Fine Dining', 'Nightlife', 'Luxury Shopping']
      },
      competition: {
        count: 28,
        avgRating: 4.5,
        priceRange: '$$$-$$$$'
      },
      score: 9.1,
      insights: [
        'Affluent area with high spending power',
        'Premium dining market with less competition',
        'Evening and weekend peak traffic'
      ]
    },
    {
      id: '3',
      name: 'Chatuchak Weekend Market',
      address: 'Chatuchak, Bangkok',
      coordinates: [100.5499, 13.7998],
      footTraffic: 25000,
      demographics: {
        avgAge: 26,
        incomeLevel: 'Medium',
        primaryInterests: ['Shopping', 'Street Food', 'Culture']
      },
      competition: {
        count: 120,
        avgRating: 3.8,
        priceRange: '$-$$'
      },
      score: 7.3,
      insights: [
        'Extremely high foot traffic on weekends',
        'Price-sensitive customers seeking authentic experiences',
        'High competition but massive market opportunity'
      ]
    }
  ];

  const analyzeLocation = async (location: LocationData) => {
    setIsAnalyzing(true);
    setSelectedLocation(location);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-50';
    if (score >= 7.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getIncomeColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'bg-purple-100 text-purple-800';
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Location Intelligence</h2>
          <p className="text-gray-600">Analyze locations with demographic insights and foot traffic data</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <MapPin className="w-4 h-4 mr-2" />
          Open Interactive Map
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Location Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search locations, addresses, or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button>
              <Navigation className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Location Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyzed Locations</h3>
          {locations.map((location) => (
            <Card 
              key={location.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedLocation?.id === location.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => analyzeLocation(location)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  <Badge className={`${getScoreColor(location.score)} border-0`}>
                    {location.score}/10
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{location.footTraffic.toLocaleString()} daily</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>{location.competition.count} competitors</span>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Badge className={getIncomeColor(location.demographics.incomeLevel)}>
                    {location.demographics.incomeLevel} Income
                  </Badge>
                  <Badge variant="outline">
                    Avg Age: {location.demographics.avgAge}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location Details</h3>
          
          {isAnalyzing ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing location data...</p>
              </CardContent>
            </Card>
          ) : selectedLocation ? (
            <div className="space-y-4">
              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedLocation.name}</CardTitle>
                  <CardDescription>{selectedLocation.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedLocation.footTraffic.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Daily Foot Traffic</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {selectedLocation.score}/10
                      </div>
                      <div className="text-sm text-gray-600">Location Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Age:</span>
                      <span className="font-semibold">{selectedLocation.demographics.avgAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Income Level:</span>
                      <Badge className={getIncomeColor(selectedLocation.demographics.incomeLevel)}>
                        {selectedLocation.demographics.incomeLevel}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-2">Primary Interests:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedLocation.demographics.primaryInterests.map((interest, index) => (
                          <Badge key={index} variant="outline">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Competition Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Competition Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Competitors:</span>
                      <span className="font-semibold">{selectedLocation.competition.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating:</span>
                      <span className="font-semibold">{selectedLocation.competition.avgRating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range:</span>
                      <Badge variant="outline">{selectedLocation.competition.priceRange}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLocation.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a location to view detailed analysis</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationIntelligenceTab;