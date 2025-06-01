"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '../../lib/api-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Button } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import { 
  CheckCircle, 
  ArrowRight, 
  Settings, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Utensils,
  Wifi,
  CreditCard,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'

interface Restaurant {
  id: number | string
  name: string
  cuisine: string
  latitude: number
  longitude: number
  address: string
  rating: number
  price_range: string
  platform: string
  phone?: string
  website?: string
  hours?: string
  features?: string[]
  images?: string[]
}

interface NewRestaurantForm {
  name: string
  cuisine: string
  address: string
  phone: string
  website: string
  email: string
  description: string
  price_range: string
  seating_capacity: number
  opening_hours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  features: string[]
  target_demographics: string[]
  marketing_budget: number
  social_media: {
    facebook: string
    instagram: string
    twitter: string
    tiktok: string
  }
  delivery_platforms: string[]
  payment_methods: string[]
  special_dietary: string[]
  latitude?: number
  longitude?: number
}

export default function RestaurantSetupPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new')
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null)
  const [showMap, setShowMap] = useState(false)
  
  // New restaurant form state
  const [newRestaurant, setNewRestaurant] = useState<NewRestaurantForm>({
    name: '',
    cuisine: '',
    address: '',
    phone: '',
    website: '',
    email: '',
    description: '',
    price_range: 'moderate',
    seating_capacity: 50,
    opening_hours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    },
    features: [],
    target_demographics: [],
    marketing_budget: 10000,
    social_media: {
      facebook: '',
      instagram: '',
      twitter: '',
      tiktok: ''
    },
    delivery_platforms: [],
    payment_methods: [],
    special_dietary: []
  })

  const cuisineOptions = [
    'Thai', 'Italian', 'Japanese', 'Chinese', 'American', 'Mexican', 'Indian', 'French',
    'Mediterranean', 'Korean', 'Vietnamese', 'Greek', 'Spanish', 'Middle Eastern',
    'Fusion', 'Seafood', 'Steakhouse', 'Vegetarian', 'Vegan', 'Fast Food', 'Cafe', 'Bakery'
  ]

  const featureOptions = [
    'Outdoor Seating', 'Private Dining', 'Live Music', 'Bar/Lounge', 'Takeout',
    'Delivery', 'Catering', 'WiFi', 'Parking', 'Wheelchair Accessible',
    'Pet Friendly', 'Family Friendly', 'Romantic', 'Business Meetings', 'Events'
  ]

  const demographicOptions = [
    'Young Professionals', 'Families', 'Students', 'Tourists', 'Business Travelers',
    'Seniors', 'Health Conscious', 'Food Enthusiasts', 'Budget Conscious', 'Luxury Diners'
  ]

  const deliveryPlatforms = [
    'Grab Food', 'Food Panda', 'Line Man', 'Uber Eats', 'Robinhood', 'GET Food'
  ]

  const paymentMethods = [
    'Cash', 'Credit Card', 'PromptPay', 'True Money', 'Rabbit LINE Pay', 'AliPay', 'WeChat Pay'
  ]

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Keto', 'Low-Carb', 'Organic'
  ]

  useEffect(() => {
    if (activeTab === 'existing') {
      fetchRestaurants()
    }
  }, [activeTab])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAllRestaurants()
      if (response.error) {
        setError(response.error)
        setRestaurants([])
      } else {
        setRestaurants(response.data || [])
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch restaurants')
      console.error('Error fetching restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchRestaurants = async () => {
    if (!searchQuery.trim()) {
      fetchRestaurants()
      return
    }

    try {
      setLoading(true)
      // Mock search for now
      const filtered = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setRestaurants(filtered)
      setError(null)
    } catch (err) {
      setError('Failed to search restaurants')
      console.error('Error searching restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchRestaurants()
    }
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setNewRestaurant(prev => ({ ...prev, latitude: lat, longitude: lng }))
    setShowMap(false)
  }

  const handleFeatureToggle = (feature: string) => {
    setNewRestaurant(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleDemographicToggle = (demographic: string) => {
    setNewRestaurant(prev => ({
      ...prev,
      target_demographics: prev.target_demographics.includes(demographic)
        ? prev.target_demographics.filter(d => d !== demographic)
        : [...prev.target_demographics, demographic]
    }))
  }

  const handleDeliveryToggle = (platform: string) => {
    setNewRestaurant(prev => ({
      ...prev,
      delivery_platforms: prev.delivery_platforms.includes(platform)
        ? prev.delivery_platforms.filter(p => p !== platform)
        : [...prev.delivery_platforms, platform]
    }))
  }

  const handlePaymentToggle = (method: string) => {
    setNewRestaurant(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method]
    }))
  }

  const handleDietaryToggle = (option: string) => {
    setNewRestaurant(prev => ({
      ...prev,
      special_dietary: prev.special_dietary.includes(option)
        ? prev.special_dietary.filter(o => o !== option)
        : [...prev.special_dietary, option]
    }))
  }

  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setNewRestaurant(prev => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day as keyof typeof prev.opening_hours],
          [field]: value
        }
      }
    }))
  }

  const handleSubmitNewRestaurant = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      // Mock submission for now
      console.log('Submitting new restaurant:', newRestaurant)
      alert('Restaurant setup submitted successfully! (Demo mode)')
      setError(null)
    } catch (err) {
      setError('Failed to submit restaurant setup')
      console.error('Error submitting restaurant:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Setup</h1>
        <p className="text-gray-600">Set up new restaurants or connect existing ones to BiteBase Intelligence</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('new')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'new'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏪 New Restaurant Setup
            </button>
            <button
              onClick={() => setActiveTab('existing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'existing'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔗 Connect Existing Restaurant
            </button>
          </nav>
        </div>

        {/* New Restaurant Setup Tab */}
        {activeTab === 'new' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">New Restaurant Setup</h2>
              <p className="text-gray-600">Complete the form below to set up your new restaurant with BiteBase Intelligence</p>
            </div>

            <form onSubmit={handleSubmitNewRestaurant} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  📋 Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                    <input
                      type="text"
                      required
                      value={newRestaurant.name}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type *</label>
                    <select
                      required
                      value={newRestaurant.cuisine}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, cuisine: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select cuisine type</option>
                      {cuisineOptions.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newRestaurant.phone}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+66 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newRestaurant.email}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="restaurant@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={newRestaurant.website}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://www.restaurant.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range *</label>
                    <select
                      required
                      value={newRestaurant.price_range}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, price_range: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="budget">Budget (฿ - Under ฿200)</option>
                      <option value="moderate">Moderate (฿฿ - ฿200-500)</option>
                      <option value="upscale">Upscale (฿฿฿ - ฿500-1000)</option>
                      <option value="fine_dining">Fine Dining (฿฿฿฿ - Over ฿1000)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newRestaurant.description}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your restaurant concept, atmosphere, and unique features..."
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  📍 Location Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      required
                      value={newRestaurant.address}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, address: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter complete address including street, district, city, and postal code"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📍 Select Location on Map
                    </button>
                    {selectedLocation && (
                      <div className="text-sm text-gray-600">
                        Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={newRestaurant.seating_capacity}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, seating_capacity: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Number of seats"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Marketing Budget (฿)</label>
                      <input
                        type="number"
                        min="0"
                        value={newRestaurant.marketing_budget}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, marketing_budget: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Monthly marketing budget"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  🕒 Operating Hours
                </h3>
                <div className="space-y-4">
                  {Object.entries(newRestaurant.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24 text-sm font-medium text-gray-700 capitalize">{day}</div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => handleHoursChange(day, 'closed', !e.target.checked)}
                          className="mr-2"
                        />
                        Open
                      </label>
                      {!hours.closed && (
                        <>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features & Amenities */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  ✨ Features & Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {featureOptions.map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRestaurant.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Demographics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  👥 Target Demographics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {demographicOptions.map(demographic => (
                    <label key={demographic} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRestaurant.target_demographics.includes(demographic)}
                        onChange={() => handleDemographicToggle(demographic)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{demographic}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  📱 Social Media Presence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                    <input
                      type="url"
                      value={newRestaurant.social_media.facebook}
                      onChange={(e) => setNewRestaurant(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, facebook: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://facebook.com/restaurant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <input
                      type="url"
                      value={newRestaurant.social_media.instagram}
                      onChange={(e) => setNewRestaurant(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, instagram: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://instagram.com/restaurant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={newRestaurant.social_media.twitter}
                      onChange={(e) => setNewRestaurant(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, twitter: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://twitter.com/restaurant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
                    <input
                      type="url"
                      value={newRestaurant.social_media.tiktok}
                      onChange={(e) => setNewRestaurant(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, tiktok: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://tiktok.com/@restaurant"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Platforms */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  🚚 Delivery Platforms
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {deliveryPlatforms.map(platform => (
                    <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRestaurant.delivery_platforms.includes(platform)}
                        onChange={() => handleDeliveryToggle(platform)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  💳 Payment Methods
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {paymentMethods.map(method => (
                    <label key={method} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRestaurant.payment_methods.includes(method)}
                        onChange={() => handlePaymentToggle(method)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Dietary Options */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  🥗 Special Dietary Options
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {dietaryOptions.map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRestaurant.special_dietary.includes(option)}
                        onChange={() => handleDietaryToggle(option)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset the form?')) {
                      setNewRestaurant({
                        name: '',
                        cuisine: '',
                        address: '',
                        phone: '',
                        website: '',
                        email: '',
                        description: '',
                        price_range: 'moderate',
                        seating_capacity: 50,
                        opening_hours: {
                          monday: { open: '09:00', close: '22:00', closed: false },
                          tuesday: { open: '09:00', close: '22:00', closed: false },
                          wednesday: { open: '09:00', close: '22:00', closed: false },
                          thursday: { open: '09:00', close: '22:00', closed: false },
                          friday: { open: '09:00', close: '23:00', closed: false },
                          saturday: { open: '09:00', close: '23:00', closed: false },
                          sunday: { open: '10:00', close: '21:00', closed: false }
                        },
                        features: [],
                        target_demographics: [],
                        marketing_budget: 10000,
                        social_media: {
                          facebook: '',
                          instagram: '',
                          twitter: '',
                          tiktok: ''
                        },
                        delivery_platforms: [],
                        payment_methods: [],
                        special_dietary: []
                      })
                      setSelectedLocation(null)
                    }
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Setting up...
                    </>
                  ) : (
                    <>
                      🚀 Complete Restaurant Setup
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Restaurant Tab */}
        {activeTab === 'existing' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Connect Existing Restaurant</h2>
              <p className="text-gray-600">Search and connect your existing restaurant to BiteBase Intelligence</p>
            </div>

            {/* Search Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Search Restaurants</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search restaurants by name, cuisine, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={searchRestaurants}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Search
                </button>
                <button
                  onClick={fetchRestaurants}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Show All
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Available Restaurants</h3>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Loading...' : `Found ${restaurants.length} restaurants`}
                </p>
              </div>

              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading restaurants...</span>
                  </div>
                ) : restaurants.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-500 mb-2">No restaurants found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-lg">{restaurant.name}</h4>
                          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                            Connect
                          </button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">Cuisine:</span> {restaurant.cuisine}</p>
                          <p><span className="font-medium">Address:</span> {restaurant.address}</p>
                          <p><span className="font-medium">Rating:</span> ⭐ {restaurant.rating}/5</p>
                          <p><span className="font-medium">Price Range:</span> {restaurant.price_range}</p>
                          <p><span className="font-medium">Platform:</span> {restaurant.platform}</p>
                          {restaurant.phone && (
                            <p><span className="font-medium">Phone:</span> {restaurant.phone}</p>
                          )}
                          {restaurant.hours && (
                            <p><span className="font-medium">Hours:</span> {restaurant.hours}</p>
                          )}
                          {restaurant.features && restaurant.features.length > 0 && (
                            <p><span className="font-medium">Features:</span> {restaurant.features.join(', ')}</p>
                          )}
                          {restaurant.website && (
                            <p><span className="font-medium">Website:</span> 
                              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" 
                                 className="text-green-600 hover:text-green-800 ml-1">
                                Visit
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simple Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Restaurant Location</h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-600 mb-4">Interactive Map Interface</p>
                <p className="text-sm text-gray-500 mb-4">Click on the map to select your restaurant location</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleLocationSelect(13.7563, 100.5018)}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    📍 Bangkok Central (13.7563, 100.5018)
                  </button>
                  <button
                    onClick={() => handleLocationSelect(13.7308, 100.5418)}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    📍 Sukhumvit Area (13.7308, 100.5418)
                  </button>
                  <button
                    onClick={() => handleLocationSelect(13.7995, 100.5546)}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    📍 Chatuchak Market (13.7995, 100.5546)
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}