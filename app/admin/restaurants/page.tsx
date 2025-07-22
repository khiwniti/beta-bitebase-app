'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AdminTabs from '../../../components/admin/AdminTabs';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Eye,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  ChevronRight
} from 'lucide-react';

interface Restaurant {
  id: string;
  brand: string;
  city: string;
  area: string;
  cuisine: string;
  rating: number;
  totalReviews: number;
  medianPrice: number;
  logo?: string;
  weeklyStats?: {
    totalVisits: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
}

interface AdminRestaurantFilters {
  search: string;
  city: string;
  area: string;
  cuisine: string;
  page: number;
  limit: number;
}

export default function AdminRestaurantsPage() {
  // Fallback translations for when NextIntl context is not available
  const fallbackTranslations = {
    'restaurants.title': 'Restaurant Management',
    'restaurants.subtitle': 'Manage and analyze restaurant data with location intelligence',
    'restaurants.search': 'Search restaurants...',
    'restaurants.filters.all': 'All Cuisines',
    'restaurants.filters.allAreas': 'All Areas',
    'restaurants.stats.total': 'Total Restaurants',
    'restaurants.stats.avgRating': 'Average Rating',
    'restaurants.stats.avgPrice': 'Average Price',
    'restaurants.stats.topCuisines': 'Top Cuisines',
    'restaurants.stats.topAreas': 'Top Areas',
    'restaurants.table.name': 'Restaurant',
    'restaurants.table.location': 'Location',
    'restaurants.table.cuisine': 'Cuisine',
    'restaurants.table.rating': 'Rating',
    'restaurants.table.price': 'Price',
    'restaurants.table.status': 'Status',
    'restaurants.table.actions': 'Actions',
    'restaurants.actions.view': 'View Details',
    'restaurants.actions.edit': 'Edit',
    'restaurants.actions.delete': 'Delete',
    'restaurants.status.operational': 'Operational',
    'restaurants.status.closed': 'Closed',
    'restaurants.status.temporarily_closed': 'Temporarily Closed',
    'restaurants.noResults': 'No restaurants found',
    'restaurants.loading': 'Loading restaurants...'
  };

  let t: (key: string) => string;
  try {
    t = useTranslations('admin');
  } catch (error) {
    // Fallback when NextIntl context is not available
    t = (key: string) => fallbackTranslations[key as keyof typeof fallbackTranslations] || key;
  }
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalRestaurants: 0,
    averageRating: 0,
    averagePrice: 0,
    topCuisines: [],
    topAreas: [],
    ratingDistribution: {}
  });
  
  const [filters, setFilters] = useState<AdminRestaurantFilters>({
    search: '',
    city: 'Bangkok',
    area: '',
    cuisine: '',
    page: 1,
    limit: 20
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.city && { city: filters.city }),
        ...(filters.area && { area: filters.area }),
        ...(filters.cuisine && { cuisine: filters.cuisine })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/restaurants?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.data.restaurants);
        setSummary(data.data.summary);
      } else {
        console.error('Failed to fetch restaurants');
        // Fallback to mock data
        setMockData();
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const allMockRestaurants: Restaurant[] = [
      {
        id: '1',
        brand: "McDonald's",
        city: 'Bangkok',
        area: 'Siam',
        cuisine: 'Fast Food',
        rating: 4.2,
        totalReviews: 22450,
        medianPrice: 150,
        logo: '🍟',
        weeklyStats: {
          totalVisits: 1240,
          totalRevenue: 186000,
          avgOrderValue: 150
        }
      },
      {
        id: '2',
        brand: 'Burger King',
        city: 'Bangkok',
        area: 'Sukhumvit',
        cuisine: 'Fast Food',
        rating: 4.1,
        totalReviews: 9517,
        medianPrice: 120,
        logo: '👑',
        weeklyStats: {
          totalVisits: 890,
          totalRevenue: 106800,
          avgOrderValue: 120
        }
      },
      {
        id: '3',
        brand: 'Starbucks',
        city: 'Bangkok',
        area: 'Phrom Phong',
        cuisine: 'Coffee',
        rating: 4.3,
        totalReviews: 12890,
        medianPrice: 180,
        logo: '☕',
        weeklyStats: {
          totalVisits: 2100,
          totalRevenue: 378000,
          avgOrderValue: 180
        }
      }
    ];

    // Apply client-side filtering
    let filteredRestaurants = allMockRestaurants;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.brand.toLowerCase().includes(searchTerm) ||
        restaurant.area.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm)
      );
    }

    // City filter
    if (filters.city) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.city === filters.city
      );
    }

    // Area filter
    if (filters.area) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.area.toLowerCase().includes(filters.area.toLowerCase())
      );
    }

    // Cuisine filter
    if (filters.cuisine) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.cuisine === filters.cuisine
      );
    }

    setRestaurants(filteredRestaurants);
    setSummary({
      totalRestaurants: filteredRestaurants.length,
      averageRating: filteredRestaurants.length > 0 ? 
        filteredRestaurants.reduce((sum, r) => sum + r.rating, 0) / filteredRestaurants.length : 0,
      averagePrice: filteredRestaurants.length > 0 ?
        filteredRestaurants.reduce((sum, r) => sum + r.medianPrice, 0) / filteredRestaurants.length : 0,
      topCuisines: getTopCuisines(filteredRestaurants),
      topAreas: getTopAreas(filteredRestaurants),
      ratingDistribution: getRatingDistribution(filteredRestaurants)
    });
  };

  const getTopCuisines = (restaurants: Restaurant[]) => {
    const cuisineCount: { [key: string]: number } = {};
    restaurants.forEach(r => {
      cuisineCount[r.cuisine] = (cuisineCount[r.cuisine] || 0) + 1;
    });
    return Object.entries(cuisineCount)
      .map(([cuisine, count]) => ({ cuisine, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getTopAreas = (restaurants: Restaurant[]) => {
    const areaCount: { [key: string]: number } = {};
    restaurants.forEach(r => {
      areaCount[r.area] = (areaCount[r.area] || 0) + 1;
    });
    return Object.entries(areaCount)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getRatingDistribution = (restaurants: Restaurant[]) => {
    const distribution: { [key: string]: number } = {
      '4-5': 0,
      '3-4': 0,
      '2-3': 0,
      '1-2': 0
    };
    restaurants.forEach(r => {
      if (r.rating >= 4) distribution['4-5']++;
      else if (r.rating >= 3) distribution['3-4']++;
      else if (r.rating >= 2) distribution['2-3']++;
      else distribution['1-2']++;
    });
    return distribution;
  };

  const handleRestaurantClick = async (restaurant: Restaurant) => {
    // Navigate to restaurant details page
    window.location.href = `/admin/restaurants/${restaurant.id}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTabs />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('restaurants.title')}</h1>
          <p className="text-gray-600">Manage and analyze restaurant data with location-based insights</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalRestaurants}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{summary.averageRating.toFixed(1)}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-gray-900">฿{summary.averagePrice}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">฿670K</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                  placeholder="Search restaurants..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, page: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                <option value="Bangkok">Bangkok</option>
                <option value="Chiang Mai">Chiang Mai</option>
                <option value="Phuket">Phuket</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
              <input
                type="text"
                value={filters.area}
                onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value, page: 1 }))}
                placeholder="Area..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value, page: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Cuisines</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Thai">Thai</option>
                <option value="Japanese">Japanese</option>
                <option value="Italian">Italian</option>
                <option value="Coffee">Coffee</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchRestaurants}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Restaurant List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('restaurants.list')}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weekly Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {restaurant.logo}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{restaurant.brand}</div>
                          <div className="text-sm text-gray-500">{restaurant.cuisine}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{restaurant.area}</div>
                      <div className="text-sm text-gray-500">{restaurant.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex">
                          {renderStars(restaurant.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {restaurant.rating} ({restaurant.totalReviews.toLocaleString()})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">฿{restaurant.medianPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.weeklyStats && (
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 text-gray-400 mr-1" />
                            {restaurant.weeklyStats.totalVisits.toLocaleString()} visits
                          </div>
                          <div className="flex items-center mt-1">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                            ฿{restaurant.weeklyStats.totalRevenue.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRestaurantClick(restaurant)}
                        className="text-green-600 hover:text-blue-900 flex items-center"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {restaurants.length === 0 && !loading && (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No restaurants found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, summary.totalRestaurants)} of {summary.totalRestaurants} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page * filters.limit >= summary.totalRestaurants}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}