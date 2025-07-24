'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Phone,
  Globe,
  ChefHat
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  priceRange: number;
  address: string;
  distance: number;
  isOpen: boolean;
  openHours: string;
  phone: string;
  website?: string;
  image: string;
  features: string[];
  popularDishes: string[];
  avgWaitTime: number;
  crowdLevel: 'Low' | 'Medium' | 'High';
  trending: boolean;
}

const RestaurantExplorerTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock restaurant data
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Gaggan Anand',
      cuisine: ['Indian', 'Progressive'],
      rating: 4.8,
      reviewCount: 2847,
      priceRange: 4,
      address: '68/1 Soi Langsuan, Ploenchit Rd, Bangkok',
      distance: 1.2,
      isOpen: true,
      openHours: '6:00 PM - 12:00 AM',
      phone: '+66 2 652 1700',
      website: 'https://gaggananand.com',
      image: '/api/placeholder/300/200',
      features: ['Fine Dining', 'Tasting Menu', 'Wine Pairing', 'Reservations Required'],
      popularDishes: ['Yogurt Explosion', 'Lick It Up', 'Charcoal'],
      avgWaitTime: 0,
      crowdLevel: 'High',
      trending: true
    },
    {
      id: '2',
      name: 'Jay Fai',
      cuisine: ['Thai', 'Street Food'],
      rating: 4.6,
      reviewCount: 1923,
      priceRange: 2,
      address: '327 Maha Chai Rd, Samran Rat, Bangkok',
      distance: 2.8,
      isOpen: true,
      openHours: '2:00 PM - 8:00 PM',
      phone: '+66 2 223 9384',
      image: '/api/placeholder/300/200',
      features: ['Michelin Star', 'Cash Only', 'No Reservations', 'Long Queue'],
      popularDishes: ['Crab Omelet', 'Pad Kee Mao', 'Tom Yum Soup'],
      avgWaitTime: 45,
      crowdLevel: 'High',
      trending: true
    },
    {
      id: '3',
      name: 'Sorn',
      cuisine: ['Thai', 'Southern Thai'],
      rating: 4.7,
      reviewCount: 856,
      priceRange: 4,
      address: '56 Sukhumvit Soi 26, Bangkok',
      distance: 3.5,
      isOpen: false,
      openHours: '6:00 PM - 11:00 PM',
      phone: '+66 2 663 3710',
      website: 'https://sornbangkok.com',
      image: '/api/placeholder/300/200',
      features: ['Michelin Star', 'Tasting Menu', 'Authentic Ingredients', 'Intimate Setting'],
      popularDishes: ['Southern Curry', 'Fermented Fish', 'Wild Herbs'],
      avgWaitTime: 0,
      crowdLevel: 'Medium',
      trending: false
    },
    {
      id: '4',
      name: 'Thip Samai',
      cuisine: ['Thai', 'Pad Thai'],
      rating: 4.4,
      reviewCount: 3421,
      priceRange: 1,
      address: '313 Maha Chai Rd, Samran Rat, Bangkok',
      distance: 2.9,
      isOpen: true,
      openHours: '5:00 PM - 2:00 AM',
      phone: '+66 2 221 6280',
      image: '/api/placeholder/300/200',
      features: ['Famous Pad Thai', 'Late Night', 'Local Favorite', 'Quick Service'],
      popularDishes: ['Pad Thai Wrapped in Egg', 'Pad Thai with Prawns', 'Orange Juice'],
      avgWaitTime: 15,
      crowdLevel: 'Medium',
      trending: false
    },
    {
      id: '5',
      name: 'Le Du',
      cuisine: ['Thai', 'Contemporary'],
      rating: 4.5,
      reviewCount: 1247,
      priceRange: 4,
      address: '399/3 Silom Rd, Bang Rak, Bangkok',
      distance: 4.1,
      isOpen: true,
      openHours: '6:00 PM - 12:00 AM',
      phone: '+66 2 919 9918',
      website: 'https://ledubkk.com',
      image: '/api/placeholder/300/200',
      features: ['Michelin Star', 'Modern Thai', 'Wine Selection', 'Chef\'s Table'],
      popularDishes: ['Massaman Curry', 'Tom Kha Gai', 'Mango Sticky Rice'],
      avgWaitTime: 0,
      crowdLevel: 'Medium',
      trending: true
    },
    {
      id: '6',
      name: 'Somtam Nua',
      cuisine: ['Thai', 'Isaan'],
      rating: 4.3,
      reviewCount: 2156,
      priceRange: 1,
      address: '392/14 Siam Square Soi 5, Bangkok',
      distance: 1.8,
      isOpen: true,
      openHours: '10:00 AM - 10:00 PM',
      phone: '+66 2 251 4880',
      image: '/api/placeholder/300/200',
      features: ['Casual Dining', 'Spicy Food', 'Group Friendly', 'Air Conditioned'],
      popularDishes: ['Som Tam', 'Larb', 'Grilled Chicken'],
      avgWaitTime: 20,
      crowdLevel: 'High',
      trending: false
    }
  ];

  const cuisineTypes = ['all', 'Thai', 'Indian', 'Contemporary', 'Street Food', 'Fine Dining'];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine.includes(selectedCuisine);
    return matchesSearch && matchesCuisine;
  });

  const getPriceSymbol = (priceRange: number) => {
    return '$'.repeat(priceRange);
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={() => setSelectedRestaurant(restaurant)}
    >
      <div className="relative">
        <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <ChefHat className="w-12 h-12 text-gray-400" />
        </div>
        {restaurant.trending && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
          restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {restaurant.isOpen ? 'Open' : 'Closed'}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating}</span>
            <span className="text-gray-500">({restaurant.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {restaurant.cuisine.map((c, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {c}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{getPriceSymbol(restaurant.priceRange)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{restaurant.avgWaitTime}m wait</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Badge className={getCrowdColor(restaurant.crowdLevel)}>
            <Users className="w-3 h-3 mr-1" />
            {restaurant.crowdLevel}
          </Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restaurant Intelligence</h2>
          <p className="text-gray-600">Discover and analyze restaurants with AI-powered insights</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search restaurants, cuisine, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === 'all' ? 'All Cuisines' : cuisine}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Found {filteredRestaurants.length} restaurants
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Sort by:</span>
          <select className="border border-gray-300 rounded px-2 py-1">
            <option>Rating</option>
            <option>Distance</option>
            <option>Price</option>
            <option>Wait Time</option>
          </select>
        </div>
      </div>

      {/* Restaurant Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {/* Restaurant Detail Modal/Sidebar */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                  <p className="text-gray-600">{selectedRestaurant.address}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRestaurant(null)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedRestaurant.rating}</div>
                  <div className="text-sm text-gray-600">{selectedRestaurant.reviewCount} reviews</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedRestaurant.avgWaitTime}m</div>
                  <div className="text-sm text-gray-600">Average wait</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedRestaurant.phone}</span>
                    </div>
                    {selectedRestaurant.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a href={selectedRestaurant.website} className="text-blue-600 hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedRestaurant.openHours}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.features.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Popular Dishes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.popularDishes.map((dish, index) => (
                      <Badge key={index} className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                        {dish}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantExplorerTab;