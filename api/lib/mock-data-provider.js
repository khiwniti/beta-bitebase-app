// Comprehensive Mock Data Provider
// Realistic restaurant data for testing all BiteBase features and AI assistant

const MOCK_RESTAURANTS = [
  {
    id: 1,
    publicId: "bella-italia-silom",
    name: "Bella Italia",
    nameOnly: {
      primary: "Bella Italia",
      thai: "เบลลา อิตาเลีย",
      english: "Bella Italia"
    },
    cuisine: "Italian",
    categories: [
      {
        id: 15,
        name: "อิตาเลียน",
        internationalName: "Italian",
        iconUrl: "https://static2.wongnai.com/static/7.9.1/category/common/images/color/15.png"
      }
    ],
    rating: 4.2,
    priceRange: {
      name: "300-600 บาท",
      value: 3,
      min: 300,
      max: 600
    },
    location: {
      address: "123 Silom Road, Silom, Bangkok 10500",
      district: "สีลม",
      city: "กรุงเทพมหานคร",
      lat: 13.7307,
      lng: 100.5418
    },
    contact: {
      phone: "+66-2-234-5678",
      email: "info@bellaitalia-bangkok.com",
      website: "https://bellaitalia-bangkok.com"
    },
    hours: [
      { day: "Monday", open: "11:00", close: "22:00", closed: false },
      { day: "Tuesday", open: "11:00", close: "22:00", closed: false },
      { day: "Wednesday", open: "11:00", close: "22:00", closed: false },
      { day: "Thursday", open: "11:00", close: "22:00", closed: false },
      { day: "Friday", open: "11:00", close: "23:00", closed: false },
      { day: "Saturday", open: "11:00", close: "23:00", closed: false },
      { day: "Sunday", open: "12:00", close: "21:00", closed: false }
    ],
    features: ["delivery", "takeout", "dine-in", "outdoor-seating", "wifi"],
    description: "Authentic Italian cuisine with fresh ingredients and traditional recipes. Family-owned restaurant serving Bangkok for over 15 years.",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800"
    ],
    menu: {
      categories: [
        { id: 1, name: "Antipasti", nameEn: "Appetizers", nameTh: "อาหารเรียกน้ำย่อย" },
        { id: 2, name: "Pasta", nameEn: "Pasta", nameTh: "พาสต้า" },
        { id: 3, name: "Pizza", nameEn: "Pizza", nameTh: "พิซซ่า" },
        { id: 4, name: "Secondi", nameEn: "Main Course", nameTh: "อาหารจานหลัก" },
        { id: 5, name: "Dolci", nameEn: "Desserts", nameTh: "ของหวาน" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Bruschetta Classica", price: 220, description: "Grilled bread with fresh tomatoes, garlic, and basil", popular: true, vegetarian: true },
        { id: 2, categoryId: 1, name: "Antipasto Misto", price: 380, description: "Selection of Italian cured meats, cheeses, and olives" },
        { id: 3, categoryId: 2, name: "Spaghetti Carbonara", price: 320, description: "Classic Roman pasta with eggs, pecorino cheese, and guanciale", popular: true },
        { id: 4, categoryId: 2, name: "Penne Arrabbiata", price: 280, description: "Spicy tomato sauce with garlic, chili, and herbs", vegetarian: true },
        { id: 5, categoryId: 3, name: "Pizza Margherita", price: 420, description: "San Marzano tomatoes, fresh mozzarella, and basil", popular: true, vegetarian: true },
        { id: 6, categoryId: 3, name: "Pizza Quattro Stagioni", price: 520, description: "Four seasons pizza with artichokes, ham, mushrooms, and olives" },
        { id: 7, categoryId: 4, name: "Osso Buco", price: 680, description: "Braised veal shanks with saffron risotto" },
        { id: 8, categoryId: 5, name: "Tiramisu", price: 180, description: "Classic coffee-flavored dessert with mascarpone", popular: true, vegetarian: true }
      ]
    },
    analytics: {
      monthlyVisitors: 2450,
      averageOrderValue: 485,
      popularTimes: ["19:00-21:00", "12:00-14:00"],
      topDishes: ["Spaghetti Carbonara", "Pizza Margherita", "Tiramisu"],
      customerSatisfaction: 4.2,
      repeatCustomerRate: 0.68
    },
    reviews: [
      { id: 1, rating: 5, comment: "Amazing authentic Italian food! The carbonara is perfect.", author: "Sarah M.", date: "2024-12-15" },
      { id: 2, rating: 4, comment: "Great atmosphere and delicious pizza. Will come back!", author: "John D.", date: "2024-12-10" },
      { id: 3, rating: 4, comment: "Good food but service was a bit slow during peak hours.", author: "Lisa K.", date: "2024-12-08" }
    ]
  },
  {
    id: 2,
    publicId: "sushi-zen-thonglor",
    name: "Sushi Zen",
    nameOnly: {
      primary: "Sushi Zen",
      thai: "ซูชิ เซน",
      english: "Sushi Zen"
    },
    cuisine: "Japanese",
    categories: [
      {
        id: 8,
        name: "ญี่ปุ่น",
        internationalName: "Japanese",
        iconUrl: "https://static2.wongnai.com/static/7.9.1/category/common/images/color/8.png"
      }
    ],
    rating: 4.6,
    priceRange: {
      name: "600-1000 บาท",
      value: 4,
      min: 600,
      max: 1000
    },
    location: {
      address: "456 Thonglor Road, Watthana, Bangkok 10110",
      district: "ทองหล่อ",
      city: "กรุงเทพมหานคร",
      lat: 13.7307,
      lng: 100.5418
    },
    contact: {
      phone: "+66-2-345-6789",
      email: "reservations@sushizen.com",
      website: "https://sushizen-bangkok.com"
    },
    hours: [
      { day: "Monday", open: "", close: "", closed: true },
      { day: "Tuesday", open: "17:00", close: "22:00", closed: false },
      { day: "Wednesday", open: "17:00", close: "22:00", closed: false },
      { day: "Thursday", open: "17:00", close: "22:00", closed: false },
      { day: "Friday", open: "17:00", close: "23:00", closed: false },
      { day: "Saturday", open: "17:00", close: "23:00", closed: false },
      { day: "Sunday", open: "17:00", close: "21:00", closed: false }
    ],
    features: ["dine-in", "takeout", "omakase", "sake-bar", "private-dining"],
    description: "Premium sushi experience with fresh fish flown in daily from Tsukiji. Traditional Edomae-style sushi by Chef Takeshi.",
    images: [
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800"
    ],
    menu: {
      categories: [
        { id: 1, name: "Nigiri", nameEn: "Nigiri Sushi", nameTh: "ซูชิ" },
        { id: 2, name: "Sashimi", nameEn: "Sashimi", nameTh: "ซาชิมิ" },
        { id: 3, name: "Maki", nameEn: "Rolls", nameTh: "โรล" },
        { id: 4, name: "Omakase", nameEn: "Chef's Choice", nameTh: "โอมากาเซ่" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Otoro Nigiri", price: 180, description: "Premium fatty tuna belly", popular: true },
        { id: 2, categoryId: 1, name: "Salmon Nigiri", price: 90, description: "Fresh Norwegian salmon" },
        { id: 3, categoryId: 2, name: "Tuna Sashimi", price: 220, description: "Fresh bluefin tuna sashimi (5 pieces)", popular: true },
        { id: 4, categoryId: 3, name: "Dragon Roll", price: 320, description: "Eel and cucumber topped with avocado" },
        { id: 5, categoryId: 4, name: "Omakase Set", price: 1200, description: "Chef's selection of 12 pieces nigiri and maki", popular: true }
      ]
    },
    analytics: {
      monthlyVisitors: 1850,
      averageOrderValue: 750,
      popularTimes: ["19:30-21:30"],
      topDishes: ["Omakase Set", "Otoro Nigiri", "Tuna Sashimi"],
      customerSatisfaction: 4.6,
      repeatCustomerRate: 0.82
    },
    reviews: [
      { id: 1, rating: 5, comment: "Best sushi in Bangkok! Chef Takeshi is amazing.", author: "Michael T.", date: "2024-12-14" },
      { id: 2, rating: 5, comment: "Incredible omakase experience. Worth every baht!", author: "Emma L.", date: "2024-12-12" }
    ]
  }
];

// AI Assistant Scenarios and Responses
const AI_SCENARIOS = {
  restaurant_recommendation: {
    triggers: ["recommend", "suggest", "best", "good", "where to eat"],
    responses: {
      italian: "Based on your preferences, I highly recommend **Bella Italia** in Silom! 🍝 They have authentic Italian cuisine with a 4.2★ rating. Their Spaghetti Carbonara and Pizza Margherita are customer favorites. Perfect for a romantic dinner or family meal.",
      japanese: "For an exceptional Japanese experience, try **Sushi Zen** in Thonglor! 🍣 This premium sushi restaurant (4.6★) offers fresh fish flown in daily from Tsukiji. Their Omakase set is absolutely incredible - perfect for special occasions.",
      budget: "For authentic and affordable options, I recommend checking our budget-friendly restaurants with great value for money!",
      general: "I'd be happy to help you find the perfect restaurant! What type of cuisine are you in the mood for?"
    }
  },
  menu_analysis: {
    triggers: ["menu", "dishes", "food", "what to order"],
    responses: {
      popular_items: "Here are the most popular dishes:\n\n🔥 **Top Picks:**\n• Spaghetti Carbonara (Bella Italia) - ฿320\n• Omakase Set (Sushi Zen) - ฿1,200\n• Pizza Margherita (Bella Italia) - ฿420",
      vegetarian: "Great vegetarian options available! 🌱\n\n• **Bella Italia** - Pizza Margherita, Penne Arrabbiata, Bruschetta Classica"
    }
  }
};

class MockDataProvider {
  constructor() {
    this.restaurants = MOCK_RESTAURANTS;
    this.aiScenarios = AI_SCENARIOS;
  }

  // Get all restaurants with filters
  getRestaurants(filters = {}) {
    let results = [...this.restaurants];

    // Apply filters
    if (filters.cuisine) {
      results = results.filter(r => 
        r.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }

    if (filters.location) {
      results = results.filter(r => 
        r.location.district.includes(filters.location) ||
        r.location.city.includes(filters.location) ||
        r.location.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const priceValue = parseInt(filters.priceRange);
      results = results.filter(r => r.priceRange.value === priceValue);
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      results = results.filter(r => r.rating >= minRating);
    }

    if (filters.features) {
      const requiredFeatures = Array.isArray(filters.features) ? filters.features : [filters.features];
      results = results.filter(r => 
        requiredFeatures.every(feature => r.features.includes(feature))
      );
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedResults,
      pagination: {
        page,
        limit,
        total: results.length,
        pages: Math.ceil(results.length / limit)
      },
      filters: filters,
      mcpEnhanced: true
    };
  }

  // Get single restaurant by ID or publicId
  getRestaurant(identifier) {
    const restaurant = this.restaurants.find(r => 
      r.id.toString() === identifier.toString() || 
      r.publicId === identifier
    );

    if (!restaurant) {
      throw new Error(`Restaurant not found: ${identifier}`);
    }

    return {
      success: true,
      data: restaurant,
      mcpEnhanced: true
    };
  }

  // Get restaurant analytics
  getRestaurantAnalytics(identifier) {
    const restaurant = this.restaurants.find(r => 
      r.id.toString() === identifier.toString() || 
      r.publicId === identifier
    );

    if (!restaurant) {
      throw new Error(`Restaurant not found: ${identifier}`);
    }

    return {
      success: true,
      data: {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          publicId: restaurant.publicId
        },
        analytics: restaurant.analytics,
        insights: this.generateInsights(restaurant),
        recommendations: this.generateRecommendations(restaurant)
      },
      mcpEnhanced: true
    };
  }

  // AI Assistant Response
  getAIResponse(message, context = {}) {
    const lowerMessage = message.toLowerCase();
    
    // Determine intent
    let intent = 'general';
    let specificResponse = null;

    // Check for restaurant recommendation
    if (AI_SCENARIOS.restaurant_recommendation.triggers.some(trigger => lowerMessage.includes(trigger))) {
      intent = 'restaurant_recommendation';
      
      // Check for specific cuisine or criteria
      if (lowerMessage.includes('italian')) {
        specificResponse = AI_SCENARIOS.restaurant_recommendation.responses.italian;
      } else if (lowerMessage.includes('japanese') || lowerMessage.includes('sushi')) {
        specificResponse = AI_SCENARIOS.restaurant_recommendation.responses.japanese;
      } else if (lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
        specificResponse = AI_SCENARIOS.restaurant_recommendation.responses.budget;
      } else {
        specificResponse = AI_SCENARIOS.restaurant_recommendation.responses.general;
      }
    }

    // Check for menu analysis
    else if (AI_SCENARIOS.menu_analysis.triggers.some(trigger => lowerMessage.includes(trigger))) {
      intent = 'menu_analysis';
      
      if (lowerMessage.includes('popular')) {
        specificResponse = AI_SCENARIOS.menu_analysis.responses.popular_items;
      } else if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
        specificResponse = AI_SCENARIOS.menu_analysis.responses.vegetarian;
      }
    }

    // Default response if no specific match
    if (!specificResponse) {
      specificResponse = "I'd be happy to help you find the perfect restaurant! 🍽️ You can ask me about:\n\n• Restaurant recommendations by cuisine\n• Popular dishes and menu items\n• Locations and areas\n• Dietary preferences\n\nWhat would you like to know?";
    }

    return {
      success: true,
      data: {
        response: specificResponse,
        intent: intent,
        context: context,
        suggestions: this.getContextualSuggestions(intent),
        timestamp: new Date().toISOString()
      },
      mcpEnhanced: true
    };
  }

  // Generate insights for restaurant
  generateInsights(restaurant) {
    const insights = [];

    if (restaurant.analytics.repeatCustomerRate > 0.8) {
      insights.push("🔥 Excellent customer loyalty - 80%+ repeat customers");
    }

    if (restaurant.rating > 4.5) {
      insights.push("⭐ Premium quality - Consistently high ratings");
    }

    if (restaurant.analytics.averageOrderValue > 500) {
      insights.push("💰 High-value dining - Premium price point");
    } else if (restaurant.analytics.averageOrderValue < 200) {
      insights.push("💵 Budget-friendly - Great value for money");
    }

    if (restaurant.features.includes('delivery')) {
      insights.push("🚚 Delivery available - Convenient ordering");
    }

    return insights;
  }

  // Generate recommendations
  generateRecommendations(restaurant) {
    const recommendations = [];

    // Based on cuisine, recommend similar restaurants
    const similarRestaurants = this.restaurants.filter(r => 
      r.id !== restaurant.id && 
      (r.cuisine === restaurant.cuisine || r.priceRange.value === restaurant.priceRange.value)
    ).slice(0, 2);

    similarRestaurants.forEach(r => {
      recommendations.push({
        type: 'similar_restaurant',
        restaurant: {
          id: r.id,
          name: r.name,
          cuisine: r.cuisine,
          rating: r.rating
        },
        reason: `Similar ${r.cuisine} cuisine` + (r.priceRange.value === restaurant.priceRange.value ? ' and price range' : '')
      });
    });

    return recommendations;
  }

  // Get contextual suggestions
  getContextualSuggestions(intent) {
    const suggestions = {
      restaurant_recommendation: [
        "Show me Italian restaurants",
        "What's good for a budget meal?",
        "Best sushi in Bangkok"
      ],
      menu_analysis: [
        "What are the most popular dishes?",
        "Show vegetarian options",
        "What should I order at Bella Italia?"
      ],
      general: [
        "Recommend a restaurant",
        "Show popular dishes",
        "Budget-friendly options"
      ]
    };

    return suggestions[intent] || suggestions.general;
  }

  // Get market analysis data
  getMarketAnalysis() {
    const totalRestaurants = this.restaurants.length;
    const avgRating = this.restaurants.reduce((sum, r) => sum + r.rating, 0) / totalRestaurants;
    const cuisineDistribution = {};
    const priceDistribution = {};

    this.restaurants.forEach(r => {
      cuisineDistribution[r.cuisine] = (cuisineDistribution[r.cuisine] || 0) + 1;
      priceDistribution[r.priceRange.name] = (priceDistribution[r.priceRange.name] || 0) + 1;
    });

    return {
      success: true,
      data: {
        overview: {
          totalRestaurants,
          averageRating: parseFloat(avgRating.toFixed(1)),
          totalMonthlyVisitors: this.restaurants.reduce((sum, r) => sum + r.analytics.monthlyVisitors, 0),
          averageOrderValue: Math.round(this.restaurants.reduce((sum, r) => sum + r.analytics.averageOrderValue, 0) / totalRestaurants)
        },
        distribution: {
          cuisine: cuisineDistribution,
          priceRange: priceDistribution
        },
        topPerformers: {
          byRating: [...this.restaurants].sort((a, b) => b.rating - a.rating).slice(0, 3),
          byVisitors: [...this.restaurants].sort((a, b) => b.analytics.monthlyVisitors - a.analytics.monthlyVisitors).slice(0, 3),
          byRevenue: [...this.restaurants].sort((a, b) => (b.analytics.monthlyVisitors * b.analytics.averageOrderValue) - (a.analytics.monthlyVisitors * a.analytics.averageOrderValue)).slice(0, 3)
        }
      },
      mcpEnhanced: true
    };
  }
}

module.exports = MockDataProvider;