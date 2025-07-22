'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminTabs from '../../../../components/admin/AdminTabs';
import { useTranslations } from '../../../../hooks/useTranslations';
import { 
  ArrowLeft,
  MapPin, 
  Star, 
  Clock,
  Phone,
  Globe,
  Users,
  TrendingUp,
  BarChart3,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Award,
  Target,
  Utensils,
  ChefHat,
  Coffee
} from 'lucide-react';

interface RestaurantDetails {
  id: string;
  brand: string;
  city: string;
  area: string;
  cuisine: string;
  rating: number;
  totalReviews: number;
  medianPrice: number;
  logo?: string;
  address: string;
  phone: string;
  website: string;
  openingHours: string;
  description: string;
  weeklyStats: {
    totalVisits: number;
    totalRevenue: number;
    avgOrderValue: number;
    growthRate: number;
  };
  locationInsights: {
    footTraffic: number;
    competitorDensity: number;
    demographicScore: number;
    accessibilityScore: number;
  };
  menuAnalysis: {
    totalItems: number;
    avgPrice: number;
    popularItems: Array<{
      name: string;
      price: number;
      orders: number;
      rating: number;
    }>;
    categories: string[];
  };
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    platform: string;
  }>;
}

export default function RestaurantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('admin');
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchRestaurantDetails();
  }, [params.id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real app, fetch from API
      const mockData: RestaurantDetails = {
        id: params.id as string,
        brand: "McDonald's",
        city: "Bangkok",
        area: "Siam",
        cuisine: "Fast Food",
        rating: 4.2,
        totalReviews: 22450,
        medianPrice: 150,
        logo: "🍟",
        address: "999 Rama I Rd, Pathum Wan, Bangkok 10330",
        phone: "+66 2 658 1000",
        website: "https://mcdonalds.co.th",
        openingHours: "06:00 - 24:00",
        description: "World's leading fast-food restaurant chain serving quality burgers, fries, and beverages.",
        weeklyStats: {
          totalVisits: 1240,
          totalRevenue: 186000,
          avgOrderValue: 150,
          growthRate: 12.5
        },
        locationInsights: {
          footTraffic: 8.5,
          competitorDensity: 7.2,
          demographicScore: 9.1,
          accessibilityScore: 9.8
        },
        menuAnalysis: {
          totalItems: 45,
          avgPrice: 120,
          popularItems: [
            { name: "Big Mac", price: 159, orders: 450, rating: 4.3 },
            { name: "McChicken", price: 139, orders: 380, rating: 4.1 },
            { name: "French Fries", price: 59, orders: 620, rating: 4.5 },
            { name: "Coca-Cola", price: 39, orders: 580, rating: 4.2 }
          ],
          categories: ["Burgers", "Chicken", "Sides", "Beverages", "Desserts", "Breakfast"]
        },
        reviews: [
          {
            id: "1",
            author: "John D.",
            rating: 5,
            comment: "Great service and food quality. Always consistent!",
            date: "2025-01-15",
            platform: "Wongnai"
          },
          {
            id: "2", 
            author: "Sarah M.",
            rating: 4,
            comment: "Good location, fast service. Sometimes crowded during lunch.",
            date: "2025-01-12",
            platform: "Google"
          },
          {
            id: "3",
            author: "Mike T.",
            rating: 4,
            comment: "Standard McDonald's experience. Clean and efficient.",
            date: "2025-01-10",
            platform: "TripAdvisor"
          }
        ]
      };
      
      setRestaurant(mockData);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminTabs />
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminTabs />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Restaurant not found</h3>
            <button
              onClick={() => router.back()}
              className="mt-4 text-emerald-600 hover:text-emerald-700"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTabs />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back') || 'Back'}
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="text-4xl mr-4">{restaurant.logo}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{restaurant.brand}</h1>
                  <div className="flex items-center mt-1 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{restaurant.area}, {restaurant.city}</span>
                    <span className="mx-2">•</span>
                    <span>{restaurant.cuisine}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-4">
                      {renderStars(restaurant.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        {restaurant.rating} ({restaurant.totalReviews.toLocaleString()})
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      ฿{restaurant.medianPrice} avg
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">
                    +{restaurant.weeklyStats.growthRate}%
                  </div>
                  <div className="text-sm text-gray-600">Weekly Growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'location', label: 'Location Intelligence', icon: MapPin },
                { id: 'menu', label: 'Menu Analysis', icon: Utensils },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{restaurant.weeklyStats.totalVisits.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Visits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">฿{restaurant.weeklyStats.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">฿{restaurant.weeklyStats.avgOrderValue}</div>
                    <div className="text-sm text-gray-600">Avg Order</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">+{restaurant.weeklyStats.growthRate}%</div>
                    <div className="text-sm text-gray-600">Growth</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Intelligence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Foot Traffic</div>
                      <div className="text-xl font-bold text-gray-900">{restaurant.locationInsights.footTraffic}/10</div>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Demographics</div>
                      <div className="text-xl font-bold text-gray-900">{restaurant.locationInsights.demographicScore}/10</div>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Competition</div>
                      <div className="text-xl font-bold text-gray-900">{restaurant.locationInsights.competitorDensity}/10</div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Accessibility</div>
                      <div className="text-xl font-bold text-gray-900">{restaurant.locationInsights.accessibilityScore}/10</div>
                    </div>
                    <MapPin className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Address</div>
                      <div className="text-sm text-gray-600">{restaurant.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Phone</div>
                      <div className="text-sm text-gray-600">{restaurant.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Website</div>
                      <a href={restaurant.website} className="text-sm text-emerald-600 hover:text-emerald-700">
                        {restaurant.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Hours</div>
                      <div className="text-sm text-gray-600">{restaurant.openingHours}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-sm text-gray-600">{restaurant.description}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Location Intelligence Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-blue-600">{restaurant.locationInsights.footTraffic}/10</div>
                <div className="text-sm font-medium text-gray-900">Foot Traffic Score</div>
                <div className="text-xs text-gray-600 mt-2">High pedestrian activity in this area</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-green-600">{restaurant.locationInsights.demographicScore}/10</div>
                <div className="text-sm font-medium text-gray-900">Demographics Match</div>
                <div className="text-xs text-gray-600 mt-2">Target audience alignment</div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-orange-600">{restaurant.locationInsights.competitorDensity}/10</div>
                <div className="text-sm font-medium text-gray-900">Competition Level</div>
                <div className="text-xs text-gray-600 mt-2">Moderate competition density</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-purple-600">{restaurant.locationInsights.accessibilityScore}/10</div>
                <div className="text-sm font-medium text-gray-900">Accessibility</div>
                <div className="text-xs text-gray-600 mt-2">Excellent transport links</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ChefHat className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{restaurant.menuAnalysis.totalItems}</div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">฿{restaurant.menuAnalysis.avgPrice}</div>
                  <div className="text-sm text-gray-600">Average Price</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Coffee className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{restaurant.menuAnalysis.categories.length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items</h3>
              <div className="space-y-4">
                {restaurant.menuAnalysis.popularItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.orders} orders this week</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">฿{item.price}</div>
                      <div className="flex items-center">
                        {renderStars(item.rating)}
                        <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Categories</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.menuAnalysis.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>
            <div className="space-y-6">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{review.author}</div>
                        <div className="text-sm text-gray-600">{review.platform} • {review.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 ml-13">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}