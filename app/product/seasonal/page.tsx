'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  Star,
  Clock,
  Users,
  Thermometer,
  Leaf,
  Sun,
  Snowflake,
  CloudRain
} from 'lucide-react';

interface SeasonalMenu {
  id: string;
  name: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  startDate: string;
  endDate: string;
  items: SeasonalItem[];
  status: 'active' | 'planned' | 'ended';
  expectedRevenue: number;
  actualRevenue?: number;
  customerFeedback: number;
}

interface SeasonalItem {
  id: string;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  availability: string;
  popularity: number;
  isSpecial: boolean;
}

export default function SeasonalMenuPage() {
  const [seasonalMenus, setSeasonalMenus] = useState<SeasonalMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSeasonalMenus();
  }, []);

  const fetchSeasonalMenus = async () => {
    try {
      // Mock seasonal menu data
      const mockData: SeasonalMenu[] = [
        {
          id: '1',
          name: 'Summer Fresh Collection',
          season: 'summer',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          status: 'active',
          expectedRevenue: 450000,
          actualRevenue: 380000,
          customerFeedback: 4.6,
          items: [
            {
              id: '1',
              name: 'Mango Sticky Rice',
              description: 'Fresh seasonal mango with coconut sticky rice',
              price: 120,
              ingredients: ['Mango', 'Sticky Rice', 'Coconut Milk'],
              availability: 'June - August',
              popularity: 92,
              isSpecial: true
            },
            {
              id: '2',
              name: 'Cold Tom Yum',
              description: 'Refreshing cold version of classic Tom Yum',
              price: 180,
              ingredients: ['Shrimp', 'Lemongrass', 'Lime', 'Chili'],
              availability: 'Summer months',
              popularity: 78,
              isSpecial: false
            },
            {
              id: '3',
              name: 'Tropical Fruit Salad',
              description: 'Mixed seasonal tropical fruits with spicy dressing',
              price: 95,
              ingredients: ['Papaya', 'Mango', 'Pineapple', 'Chili', 'Lime'],
              availability: 'Year-round (peak summer)',
              popularity: 85,
              isSpecial: false
            }
          ]
        },
        {
          id: '2',
          name: 'Autumn Comfort Menu',
          season: 'autumn',
          startDate: '2024-09-01',
          endDate: '2024-11-30',
          status: 'planned',
          expectedRevenue: 520000,
          customerFeedback: 0,
          items: [
            {
              id: '4',
              name: 'Pumpkin Curry',
              description: 'Rich curry with seasonal pumpkin and coconut',
              price: 220,
              ingredients: ['Pumpkin', 'Coconut Milk', 'Red Curry Paste'],
              availability: 'September - November',
              popularity: 0,
              isSpecial: true
            },
            {
              id: '5',
              name: 'Warm Tom Kha',
              description: 'Comforting coconut soup perfect for cooler weather',
              price: 160,
              ingredients: ['Chicken', 'Coconut Milk', 'Galangal', 'Mushrooms'],
              availability: 'Autumn/Winter',
              popularity: 0,
              isSpecial: false
            }
          ]
        },
        {
          id: '3',
          name: 'Winter Warmth Series',
          season: 'winter',
          startDate: '2024-12-01',
          endDate: '2025-02-28',
          status: 'planned',
          expectedRevenue: 380000,
          customerFeedback: 0,
          items: [
            {
              id: '6',
              name: 'Spicy Beef Stew',
              description: 'Hearty beef stew with warming spices',
              price: 280,
              ingredients: ['Beef', 'Potatoes', 'Carrots', 'Thai Spices'],
              availability: 'December - February',
              popularity: 0,
              isSpecial: true
            }
          ]
        },
        {
          id: '4',
          name: 'Spring Fresh Start',
          season: 'spring',
          startDate: '2024-03-01',
          endDate: '2024-05-31',
          status: 'ended',
          expectedRevenue: 400000,
          actualRevenue: 420000,
          customerFeedback: 4.8,
          items: [
            {
              id: '7',
              name: 'Young Coconut Salad',
              description: 'Fresh young coconut with herbs and lime',
              price: 140,
              ingredients: ['Young Coconut', 'Thai Herbs', 'Lime', 'Chili'],
              availability: 'March - May',
              popularity: 88,
              isSpecial: true
            }
          ]
        }
      ];

      setTimeout(() => {
        setSeasonalMenus(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching seasonal menus:', error);
      setLoading(false);
    }
  };

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring': return <Leaf className="h-5 w-5 text-green-500" />;
      case 'summer': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'autumn': return <CloudRain className="h-5 w-5 text-orange-500" />;
      case 'winter': return <Snowflake className="h-5 w-5 text-blue-500" />;
      default: return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring': return 'bg-green-100 text-green-800';
      case 'summer': return 'bg-yellow-100 text-yellow-800';
      case 'autumn': return 'bg-orange-100 text-orange-800';
      case 'winter': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMenus = seasonalMenus.filter(menu => {
    if (selectedSeason === 'all') return true;
    return menu.season === selectedSeason;
  });

  const totalExpectedRevenue = seasonalMenus.reduce((sum, menu) => sum + menu.expectedRevenue, 0);
  const totalActualRevenue = seasonalMenus.reduce((sum, menu) => sum + (menu.actualRevenue || 0), 0);
  const activeMenus = seasonalMenus.filter(menu => menu.status === 'active').length;
  const avgFeedback = seasonalMenus
    .filter(menu => menu.customerFeedback > 0)
    .reduce((sum, menu) => sum + menu.customerFeedback, 0) / 
    seasonalMenus.filter(menu => menu.customerFeedback > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seasonal menu data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seasonal Menu Planning</h1>
            <p className="text-gray-600">Plan seasonal menus and special offerings</p>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Seasonal Menu
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Menus</p>
                <p className="text-2xl font-bold text-gray-900">{activeMenus}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expected Revenue</p>
                <p className="text-2xl font-bold text-gray-900">฿{totalExpectedRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{avgFeedback ? avgFeedback.toFixed(1) : 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {seasonalMenus.reduce((sum, menu) => sum + menu.items.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Menus Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredMenus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getSeasonIcon(menu.season)}
                    <h3 className="ml-2 text-lg font-semibold text-gray-900">{menu.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeasonColor(menu.season)}`}>
                      {menu.season.charAt(0).toUpperCase() + menu.season.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      menu.status === 'active' ? 'bg-green-100 text-green-800' :
                      menu.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {menu.status.charAt(0).toUpperCase() + menu.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">
                      {new Date(menu.startDate).toLocaleDateString()} - {new Date(menu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Items</p>
                    <p className="font-medium text-gray-900">{menu.items.length} dishes</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">Menu Items</h4>
                <div className="space-y-3">
                  {menu.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          {item.isSpecial && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Special
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-bold text-gray-900">฿{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Ingredients</p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients.map((ingredient, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Availability</p>
                          <p className="text-gray-900">{item.availability}</p>
                          {item.popularity > 0 && (
                            <div className="mt-2">
                              <p className="text-gray-600 mb-1">Popularity</p>
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-emerald-500 h-2 rounded-full" 
                                    style={{ width: `${item.popularity}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{item.popularity}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Performance */}
              <div className="px-6 pb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Expected Revenue</p>
                      <p className="text-lg font-bold text-gray-900">฿{menu.expectedRevenue.toLocaleString()}</p>
                    </div>
                    {menu.actualRevenue && (
                      <div>
                        <p className="text-sm text-gray-600">Actual Revenue</p>
                        <p className="text-lg font-bold text-gray-900">฿{menu.actualRevenue.toLocaleString()}</p>
                      </div>
                    )}
                    {menu.customerFeedback > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Customer Rating</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-lg font-bold text-gray-900">{menu.customerFeedback}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Edit className="h-4 w-4 inline mr-2" />
                    Edit Menu
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seasonal Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Seasonal Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Best Performing Seasons</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium text-gray-900">Spring</span>
                  </div>
                  <span className="text-green-600 font-medium">105% of target</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium text-gray-900">Summer</span>
                  </div>
                  <span className="text-yellow-600 font-medium">84% of target</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Upcoming Opportunities</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-900">Winter Menu Launch</p>
                  <p className="text-sm text-gray-600">December 1st - Focus on warm, comfort foods</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="font-medium text-gray-900">Autumn Specials</p>
                  <p className="text-sm text-gray-600">September 1st - Pumpkin and seasonal ingredients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Seasonal Menu Optimization</h3>
          <p className="text-blue-700 mb-4">
            Plan seasonal menus based on ingredient availability, customer preferences, and weather patterns.
            Integration with supplier data ensures optimal timing and cost efficiency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Ingredient Tracking</h4>
              <p className="text-sm text-gray-600">Real-time seasonal availability</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Weather Integration</h4>
              <p className="text-sm text-gray-600">Menu suggestions based on weather</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Customer Preferences</h4>
              <p className="text-sm text-gray-600">Historical data analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}