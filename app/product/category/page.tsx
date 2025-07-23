'use client';

import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  DollarSign,
  Package,
  Star
} from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  totalRevenue: number;
  avgRating: number;
  popularity: number;
  color: string;
  items: string[];
}

export default function MenuCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Mock data with Wongnai-style categories
      const mockCategories: MenuCategory[] = [
        {
          id: '1',
          name: 'Thai Dishes',
          description: 'Traditional Thai cuisine and local favorites',
          itemCount: 15,
          totalRevenue: 850000,
          avgRating: 4.6,
          popularity: 92,
          color: 'bg-red-500',
          items: ['Pad Thai', 'Green Curry', 'Tom Yum', 'Massaman Curry', 'Som Tam']
        },
        {
          id: '2',
          name: 'Appetizers',
          description: 'Starters and small plates',
          itemCount: 8,
          totalRevenue: 320000,
          avgRating: 4.4,
          popularity: 78,
          color: 'bg-green-500',
          items: ['Spring Rolls', 'Satay', 'Fish Cakes', 'Chicken Wings']
        },
        {
          id: '3',
          name: 'Soups',
          description: 'Hot and cold soups',
          itemCount: 6,
          totalRevenue: 240000,
          avgRating: 4.5,
          popularity: 65,
          color: 'bg-blue-500',
          items: ['Tom Yum', 'Tom Kha', 'Wonton Soup', 'Chicken Soup']
        },
        {
          id: '4',
          name: 'Desserts',
          description: 'Sweet treats and traditional desserts',
          itemCount: 10,
          totalRevenue: 180000,
          avgRating: 4.7,
          popularity: 58,
          color: 'bg-purple-500',
          items: ['Mango Sticky Rice', 'Ice Cream', 'Thai Custard', 'Coconut Cake']
        },
        {
          id: '5',
          name: 'Beverages',
          description: 'Hot and cold drinks',
          itemCount: 12,
          totalRevenue: 150000,
          avgRating: 4.3,
          popularity: 72,
          color: 'bg-yellow-500',
          items: ['Thai Tea', 'Fresh Juice', 'Coffee', 'Smoothies']
        },
        {
          id: '6',
          name: 'Seafood',
          description: 'Fresh seafood dishes',
          itemCount: 7,
          totalRevenue: 420000,
          avgRating: 4.8,
          popularity: 85,
          color: 'bg-teal-500',
          items: ['Grilled Fish', 'Shrimp Curry', 'Crab Fried Rice', 'Fish Soup']
        }
      ];

      setTimeout(() => {
        setCategories(mockCategories);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);
  const totalRevenue = categories.reduce((sum, cat) => sum + cat.totalRevenue, 0);
  const avgRating = categories.reduce((sum, cat) => sum + cat.avgRating, 0) / categories.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu categories...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Categories</h1>
            <p className="text-gray-600">Organize and manage your menu categories</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Grid className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">฿{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Category Header */}
              <div className={`${category.color} h-2`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Category Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="text-xl font-bold text-gray-900">{category.itemCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-xl font-bold text-gray-900">฿{(category.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-lg font-bold text-gray-900">{category.avgRating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Popularity</p>
                    <div className="flex items-center">
                      <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${category.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{category.popularity}%</span>
                    </div>
                  </div>
                </div>

                {/* Popular Items */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Popular Items</p>
                  <div className="flex flex-wrap gap-1">
                    {category.items.slice(0, 3).map((item, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                    {category.items.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        +{category.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  View Items
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Performance</h2>
          <div className="space-y-4">
            {categories
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .map((category, index) => (
                <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded ${category.color} mr-3`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.itemCount} items</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-medium text-gray-900">฿{category.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Popularity</p>
                      <p className="font-medium text-gray-900">{category.popularity}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium text-gray-900">{category.avgRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Wongnai Integration Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Category Optimization</h3>
          <p className="text-blue-700">
            Categories are optimized based on Wongnai customer preferences and ordering patterns. 
            Popular categories are automatically promoted for better visibility.
          </p>
        </div>
      </div>
    </div>
  );
}