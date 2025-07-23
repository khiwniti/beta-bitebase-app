'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Package,
  DollarSign,
  Calendar,
  Truck,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  stock: number;
  minStock: number;
  supplier: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  usedInDishes: string[];
  status: 'available' | 'low' | 'out';
  seasonality: 'high' | 'medium' | 'low';
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      // Mock ingredient data
      const mockData: Ingredient[] = [
        {
          id: '1',
          name: 'Rice Noodles',
          category: 'Carbohydrates',
          currentPrice: 45,
          previousPrice: 42,
          unit: 'kg',
          stock: 150,
          minStock: 50,
          supplier: 'Bangkok Noodle Co.',
          lastUpdated: '2024-01-15',
          trend: 'up',
          trendPercentage: 7.1,
          usedInDishes: ['Pad Thai', 'Pad See Ew', 'Drunken Noodles'],
          status: 'available',
          seasonality: 'low'
        },
        {
          id: '2',
          name: 'Shrimp',
          category: 'Seafood',
          currentPrice: 280,
          previousPrice: 320,
          unit: 'kg',
          stock: 25,
          minStock: 20,
          supplier: 'Fresh Sea Market',
          lastUpdated: '2024-01-15',
          trend: 'down',
          trendPercentage: -12.5,
          usedInDishes: ['Pad Thai', 'Tom Yum', 'Shrimp Curry'],
          status: 'low',
          seasonality: 'medium'
        },
        {
          id: '3',
          name: 'Coconut Milk',
          category: 'Dairy',
          currentPrice: 35,
          previousPrice: 35,
          unit: 'liter',
          stock: 80,
          minStock: 30,
          supplier: 'Tropical Foods Ltd.',
          lastUpdated: '2024-01-15',
          trend: 'stable',
          trendPercentage: 0,
          usedInDishes: ['Green Curry', 'Massaman Curry', 'Tom Kha'],
          status: 'available',
          seasonality: 'low'
        },
        {
          id: '4',
          name: 'Thai Basil',
          category: 'Herbs',
          currentPrice: 120,
          previousPrice: 100,
          unit: 'kg',
          stock: 5,
          minStock: 10,
          supplier: 'Herb Garden Co.',
          lastUpdated: '2024-01-15',
          trend: 'up',
          trendPercentage: 20,
          usedInDishes: ['Green Curry', 'Thai Basil Stir Fry'],
          status: 'low',
          seasonality: 'high'
        },
        {
          id: '5',
          name: 'Chicken Breast',
          category: 'Meat',
          currentPrice: 180,
          previousPrice: 175,
          unit: 'kg',
          stock: 0,
          minStock: 25,
          supplier: 'Premium Poultry',
          lastUpdated: '2024-01-15',
          trend: 'up',
          trendPercentage: 2.9,
          usedInDishes: ['Green Curry', 'Chicken Satay', 'Basil Chicken'],
          status: 'out',
          seasonality: 'low'
        },
        {
          id: '6',
          name: 'Mango',
          category: 'Fruits',
          currentPrice: 80,
          previousPrice: 120,
          unit: 'kg',
          stock: 40,
          minStock: 15,
          supplier: 'Tropical Fruits Market',
          lastUpdated: '2024-01-15',
          trend: 'down',
          trendPercentage: -33.3,
          usedInDishes: ['Mango Sticky Rice', 'Mango Salad'],
          status: 'available',
          seasonality: 'high'
        }
      ];

      setTimeout(() => {
        setIngredients(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setLoading(false);
    }
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    if (filterStatus === 'all') return true;
    return ingredient.status === filterStatus;
  });

  const sortedIngredients = [...filteredIngredients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return b.currentPrice - a.currentPrice;
      case 'stock':
        return b.stock - a.stock;
      case 'trend':
        return b.trendPercentage - a.trendPercentage;
      default:
        return 0;
    }
  });

  const totalIngredients = ingredients.length;
  const lowStockCount = ingredients.filter(i => i.status === 'low').length;
  const outOfStockCount = ingredients.filter(i => i.status === 'out').length;
  const avgPriceIncrease = ingredients.reduce((sum, i) => sum + i.trendPercentage, 0) / ingredients.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ingredient data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingredient Analysis</h1>
            <p className="text-gray-600">Track ingredient costs and availability</p>
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="trend">Sort by Trend</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ingredients</p>
                <p className="text-2xl font-bold text-gray-900">{totalIngredients}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price Change</p>
                <p className="text-2xl font-bold text-gray-900">
                  {avgPriceIncrease > 0 ? '+' : ''}{avgPriceIncrease.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-900">Inventory Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ingredients
                .filter(i => i.status === 'low' || i.status === 'out')
                .map(ingredient => (
                  <div key={ingredient.id} className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{ingredient.name}</h4>
                        <p className="text-sm text-gray-600">
                          Stock: {ingredient.stock} {ingredient.unit} 
                          (Min: {ingredient.minStock} {ingredient.unit})
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ingredient.status === 'out' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ingredient.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Ingredients Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ingredient Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Used In
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ChefHat className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">Updated: {ingredient.lastUpdated}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {ingredient.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ฿{ingredient.currentPrice}/{ingredient.unit}
                        </div>
                        <div className="text-sm text-gray-500">
                          Was: ฿{ingredient.previousPrice}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ingredient.stock} {ingredient.unit}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: {ingredient.minStock} {ingredient.unit}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {ingredient.trend === 'up' && (
                          <>
                            <TrendingUp className="h-4 w-4 text-red-500" />
                            <span className="ml-1 text-sm text-red-600">+{ingredient.trendPercentage}%</span>
                          </>
                        )}
                        {ingredient.trend === 'down' && (
                          <>
                            <TrendingDown className="h-4 w-4 text-green-500" />
                            <span className="ml-1 text-sm text-green-600">{ingredient.trendPercentage}%</span>
                          </>
                        )}
                        {ingredient.trend === 'stable' && (
                          <span className="text-sm text-gray-500">Stable</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{ingredient.supplier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ingredient.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : ingredient.status === 'low'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ingredient.status === 'available' ? 'Available' : 
                         ingredient.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {ingredient.usedInDishes.slice(0, 2).map((dish, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {dish}
                          </span>
                        ))}
                        {ingredient.usedInDishes.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{ingredient.usedInDishes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Trends */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Trend Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Price Increases</h4>
              <div className="space-y-3">
                {ingredients
                  .filter(i => i.trend === 'up')
                  .sort((a, b) => b.trendPercentage - a.trendPercentage)
                  .map(ingredient => (
                    <div key={ingredient.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{ingredient.name}</p>
                        <p className="text-sm text-gray-600">
                          ฿{ingredient.previousPrice} → ฿{ingredient.currentPrice}
                        </p>
                      </div>
                      <span className="text-red-600 font-medium">+{ingredient.trendPercentage}%</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Price Decreases</h4>
              <div className="space-y-3">
                {ingredients
                  .filter(i => i.trend === 'down')
                  .sort((a, b) => a.trendPercentage - b.trendPercentage)
                  .map(ingredient => (
                    <div key={ingredient.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{ingredient.name}</p>
                        <p className="text-sm text-gray-600">
                          ฿{ingredient.previousPrice} → ฿{ingredient.currentPrice}
                        </p>
                      </div>
                      <span className="text-green-600 font-medium">{ingredient.trendPercentage}%</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ingredient Cost Optimization</h3>
          <p className="text-blue-700 mb-4">
            Track ingredient costs and availability to optimize menu pricing and reduce food waste.
            Data is integrated with supplier systems and market price feeds.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Cost Savings</h4>
              <p className="text-sm text-gray-600">฿12,500 this month</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Waste Reduction</h4>
              <p className="text-sm text-gray-600">15% decrease</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Menu Impact</h4>
              <p className="text-sm text-gray-600">3 dishes affected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}