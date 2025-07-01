'use client'

import React, { useState } from 'react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  Utensils, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Phone,
  Mail,
  Globe,
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  Star
} from 'lucide-react'

export default function RestaurantSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [restaurantData, setRestaurantData] = useState({
    // Basic Info
    name: '',
    description: '',
    cuisine: '',
    priceRange: '',
    
    // Location
    address: '',
    city: 'Bangkok',
    district: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    
    // Contact
    phone: '',
    email: '',
    website: '',
    
    // Operations
    openingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    },
    capacity: '',
    averageTicket: '',
    
    // Features
    features: [] as string[]
  })

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Restaurant details and cuisine' },
    { id: 2, title: 'Location', description: 'Address and location details' },
    { id: 3, title: 'Contact Information', description: 'Phone, email, and website' },
    { id: 4, title: 'Operating Hours', description: 'Business hours and capacity' },
    { id: 5, title: 'Features & Services', description: 'Additional services offered' },
    { id: 6, title: 'Review & Complete', description: 'Confirm your information' }
  ]

  const cuisineTypes = [
    'Thai', 'Chinese', 'Japanese', 'Korean', 'Italian', 'French', 'American', 
    'Mexican', 'Indian', 'Mediterranean', 'Vietnamese', 'Fusion', 'Seafood', 
    'BBQ', 'Vegetarian', 'Fast Food', 'Cafe', 'Bakery', 'Other'
  ]

  const priceRanges = [
    { value: '$', label: '$ - Budget (Under ฿200)' },
    { value: '$$', label: '$$ - Moderate (฿200-500)' },
    { value: '$$$', label: '$$$ - Upscale (฿500-1000)' },
    { value: '$$$$', label: '$$$$ - Fine Dining (฿1000+)' }
  ]

  const restaurantFeatures = [
    'Delivery', 'Takeout', 'Dine-in', 'Outdoor Seating', 'Private Dining',
    'Live Music', 'WiFi', 'Parking', 'Air Conditioning', 'Credit Cards',
    'Reservations', 'Catering', 'Bar/Alcohol', 'Kid-Friendly', 'Pet-Friendly',
    'Wheelchair Accessible', 'Vegan Options', 'Halal', 'Breakfast', 'Late Night'
  ]

  const handleInputChange = (field: string, value: any) => {
    setRestaurantData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setRestaurantData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // TODO: Submit restaurant data to backend
    console.log('Submitting restaurant data:', restaurantData)
    alert('Restaurant setup completed successfully!')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input
                id="name"
                value={restaurantData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your restaurant name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={restaurantData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Describe your restaurant's atmosphere and specialties..."
              />
            </div>

            <div>
              <Label htmlFor="cuisine">Cuisine Type *</Label>
              <select
                id="cuisine"
                value={restaurantData.cuisine}
                onChange={(e) => handleInputChange('cuisine', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select cuisine type</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="priceRange">Price Range *</Label>
              <select
                id="priceRange"
                value={restaurantData.priceRange}
                onChange={(e) => handleInputChange('priceRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select price range</option>
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={restaurantData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={restaurantData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Sukhumvit"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={restaurantData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="10110"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={restaurantData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Bangkok"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Location Tip</h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Accurate location information helps customers find you and improves your visibility in local searches.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={restaurantData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+66 2 123 4567"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={restaurantData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@restaurant.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  value={restaurantData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.restaurant.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Operating Hours</h4>
              <div className="space-y-3">
                {Object.entries(restaurantData.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium capitalize">{day}</div>
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleInputChange('openingHours', {
                        ...restaurantData.openingHours,
                        [day]: { ...hours, closed: !e.target.checked }
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    {!hours.closed ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleInputChange('openingHours', {
                            ...restaurantData.openingHours,
                            [day]: { ...hours, open: e.target.value }
                          })}
                          className="w-24"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleInputChange('openingHours', {
                            ...restaurantData.openingHours,
                            [day]: { ...hours, close: e.target.value }
                          })}
                          className="w-24"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Seating Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="capacity"
                    type="number"
                    value={restaurantData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="50"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="averageTicket">Average Ticket (฿)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="averageTicket"
                    type="number"
                    value={restaurantData.averageTicket}
                    onChange={(e) => handleInputChange('averageTicket', e.target.value)}
                    placeholder="300"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Restaurant Features & Services</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select all features and services that apply to your restaurant.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {restaurantFeatures.map(feature => (
                  <button
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    className={`p-3 text-sm border rounded-lg transition-colors ${
                      restaurantData.features.includes(feature)
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-medium text-green-900 dark:text-green-100">Ready to Complete Setup</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Please review your information below and click "Complete Setup" to finish.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Restaurant Name</h5>
                  <p className="text-gray-600 dark:text-gray-400">{restaurantData.name || 'Not specified'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Cuisine Type</h5>
                  <p className="text-gray-600 dark:text-gray-400">{restaurantData.cuisine || 'Not specified'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Price Range</h5>
                  <p className="text-gray-600 dark:text-gray-400">{restaurantData.priceRange || 'Not specified'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Phone</h5>
                  <p className="text-gray-600 dark:text-gray-400">{restaurantData.phone || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Address</h5>
                <p className="text-gray-600 dark:text-gray-400">
                  {restaurantData.address ? 
                    `${restaurantData.address}, ${restaurantData.district}, ${restaurantData.city}` : 
                    'Not specified'
                  }
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Features</h5>
                <div className="flex flex-wrap gap-2 mt-1">
                  {restaurantData.features.length > 0 ? 
                    restaurantData.features.map(feature => (
                      <Badge key={feature} variant="secondary">{feature}</Badge>
                    )) : 
                    <p className="text-gray-600 dark:text-gray-400">No features selected</p>
                  }
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <MainLayout pageTitle="Restaurant Setup" pageDescription="Set up your restaurant profile and preferences">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant Setup</h1>
            <Badge variant="outline">Step {currentStep} of {steps.length}</Badge>
          </div>
          
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep > step.id 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.id 
                      ? 'border-primary-500 text-primary-500' 
                      : 'border-gray-300 text-gray-300'
                }`}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <div className="ml-2 min-w-0">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-4 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === steps.length ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Complete Setup
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
