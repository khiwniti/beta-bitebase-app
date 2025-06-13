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
  },
  {
    id: 3,
    publicId: "green-garden-cafe",
    name: "Green Garden Café",
    nameOnly: {
      primary: "Green Garden Café",
      thai: "กรีน การ์เด้น คาเฟ่",
      english: "Green Garden Café"
    },
    cuisine: "Healthy",
    categories: [
      {
        id: 59,
        name: "คาเฟ่",
        internationalName: "Cafe",
        iconUrl: "https://static2.wongnai.com/static/7.9.1/category/common/images/color/59.png"
      }
    ],
    rating: 4.4,
    priceRange: {
      name: "200-400 บาท",
      value: 2,
      min: 200,
      max: 400
    },
    location: {
      address: "789 Sukhumvit Road, Asok, Bangkok 10110",
      district: "อโศก",
      city: "กรุงเทพมหานคร",
      lat: 13.7307,
      lng: 100.5418
    },
    contact: {
      phone: "+66-2-456-7890",
      email: "hello@greengardencafe.com",
      website: "https://greengardencafe.com"
    },
    hours: [
      { day: "Monday", open: "07:00", close: "20:00", closed: false },
      { day: "Tuesday", open: "07:00", close: "20:00", closed: false },
      { day: "Wednesday", open: "07:00", close: "20:00", closed: false },
      { day: "Thursday", open: "07:00", close: "20:00", closed: false },
      { day: "Friday", open: "07:00", close: "21:00", closed: false },
      { day: "Saturday", open: "08:00", close: "21:00", closed: false },
      { day: "Sunday", open: "08:00", close: "20:00", closed: false }
    ],
    features: ["delivery", "takeout", "dine-in", "vegan-options", "wifi", "outdoor-seating", "healthy-menu"],
    description: "Organic, healthy café focusing on plant-based dishes, fresh juices, and sustainable ingredients. Perfect for health-conscious diners.",
    images: [
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800"
    ],
    menu: {
      categories: [
        { id: 1, name: "Smoothie Bowls", nameEn: "Smoothie Bowls", nameTh: "สมูทตี้โบว์ล" },
        { id: 2, name: "Salads", nameEn: "Fresh Salads", nameTh: "สลัดสด" },
        { id: 3, name: "Wraps", nameEn: "Healthy Wraps", nameTh: "แร็ปเพื่อสุขภาพ" },
        { id: 4, name: "Beverages", nameEn: "Fresh Drinks", nameTh: "เครื่องดื่มสด" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Acai Berry Bowl", price: 280, description: "Acai, banana, granola, fresh berries", popular: true, vegan: true },
        { id: 2, categoryId: 2, name: "Quinoa Power Salad", price: 320, description: "Quinoa, kale, avocado, chickpeas, tahini dressing", vegan: true },
        { id: 3, categoryId: 3, name: "Veggie Hummus Wrap", price: 250, description: "Hummus, roasted vegetables, spinach, whole wheat wrap", popular: true, vegan: true },
        { id: 4, categoryId: 4, name: "Green Detox Juice", price: 180, description: "Kale, cucumber, apple, lemon, ginger", vegan: true }
      ]
    },
    analytics: {
      monthlyVisitors: 3200,
      averageOrderValue: 285,
      popularTimes: ["08:00-10:00", "12:00-14:00"],
      topDishes: ["Acai Berry Bowl", "Veggie Hummus Wrap", "Green Detox Juice"],
      customerSatisfaction: 4.4,
      repeatCustomerRate: 0.75
    },
    reviews: [
      { id: 1, rating: 5, comment: "Love the healthy options! Great for my diet.", author: "Anna S.", date: "2024-12-16" },
      { id: 2, rating: 4, comment: "Fresh ingredients and good vibes. Perfect for brunch.", author: "David R.", date: "2024-12-13" }
    ]
  },
  {
    id: 4,
    publicId: "spice-route-indian",
    name: "Spice Route",
    nameOnly: {
      primary: "Spice Route",
      thai: "สไปซ์ รูท",
      english: "Spice Route"
    },
    cuisine: "Indian",
    categories: [
      {
        id: 18,
        name: "อินเดีย",
        internationalName: "Indian",
        iconUrl: "https://static2.wongnai.com/static/7.9.1/category/common/images/color/18.png"
      }
    ],
    rating: 4.3,
    priceRange: {
      name: "250-500 บาท",
      value: 3,
      min: 250,
      max: 500
    },
    location: {
      address: "321 Ploenchit Road, Lumpini, Bangkok 10330",
      district: "เพลินจิต",
      city: "กรุงเทพมหานคร",
      lat: 13.7307,
      lng: 100.5418
    },
    contact: {
      phone: "+66-2-567-8901",
      email: "info@spiceroute-bangkok.com",
      website: "https://spiceroute-bangkok.com"
    },
    hours: [
      { day: "Monday", open: "11:30", close: "22:00", closed: false },
      { day: "Tuesday", open: "11:30", close: "22:00", closed: false },
      { day: "Wednesday", open: "11:30", close: "22:00", closed: false },
      { day: "Thursday", open: "11:30", close: "22:00", closed: false },
      { day: "Friday", open: "11:30", close: "22:30", closed: false },
      { day: "Saturday", open: "11:30", close: "22:30", closed: false },
      { day: "Sunday", open: "11:30", close: "22:00", closed: false }
    ],
    features: ["delivery", "takeout", "dine-in", "vegetarian-options", "halal", "spice-levels"],
    description: "Authentic North Indian cuisine with traditional tandoor oven. Family recipes passed down through generations.",
    images: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
      "https://images.unsplash.com/photo-1574653853027-5d3ac9b4b4c7?w=800"
    ],
    menu: {
      categories: [
        { id: 1, name: "Appetizers", nameEn: "Starters", nameTh: "อาหารเรียกน้ำย่อย" },
        { id: 2, name: "Tandoor", nameEn: "Tandoor Specials", nameTh: "ทันดูร์" },
        { id: 3, name: "Curry", nameEn: "Curry Dishes", nameTh: "แกง" },
        { id: 4, name: "Biryani", nameEn: "Biryani & Rice", nameTh: "บิรยานี" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Samosa", price: 180, description: "Crispy pastry with spiced potato filling", popular: true, vegetarian: true },
        { id: 2, categoryId: 2, name: "Tandoori Chicken", price: 380, description: "Marinated chicken cooked in tandoor oven", popular: true },
        { id: 3, categoryId: 3, name: "Butter Chicken", price: 350, description: "Creamy tomato curry with tender chicken", popular: true },
        { id: 4, categoryId: 4, name: "Chicken Biryani", price: 320, description: "Fragrant basmati rice with spiced chicken" }
      ]
    },
    analytics: {
      monthlyVisitors: 2100,
      averageOrderValue: 420,
      popularTimes: ["19:00-21:00", "12:30-14:00"],
      topDishes: ["Butter Chicken", "Tandoori Chicken", "Chicken Biryani"],
      customerSatisfaction: 4.3,
      repeatCustomerRate: 0.71
    },
    reviews: [
      { id: 1, rating: 5, comment: "Authentic Indian flavors! The butter chicken is incredible.", author: "Raj P.", date: "2024-12-15" },
      { id: 2, rating: 4, comment: "Great food but can be quite spicy. Ask for mild if sensitive.", author: "Jenny W.", date: "2024-12-11" }
    ]
  },
  {
    id: 5,
    publicId: "street-food-corner",
    name: "Street Food Corner",
    nameOnly: {
      primary: "Street Food Corner",
      thai: "สตรีทฟู้ด คอร์เนอร์",
      english: "Street Food Corner"
    },
    cuisine: "Thai",
    categories: [
      {
        id: 1,
        name: "ไทย",
        internationalName: "Thai",
        iconUrl: "https://static2.wongnai.com/static/7.9.1/category/common/images/color/1.png"
      }
    ],
    rating: 4.1,
    priceRange: {
      name: "100-250 บาท",
      value: 1,
      min: 100,
      max: 250
    },
    location: {
      address: "654 Chatuchak Market, Chatuchak, Bangkok 10900",
      district: "จตุจักร",
      city: "กรุงเทพมหานคร",
      lat: 13.7307,
      lng: 100.5418
    },
    contact: {
      phone: "+66-2-678-9012",
      email: "orders@streetfoodcorner.com",
      website: "https://streetfoodcorner.com"
    },
    hours: [
      { day: "Monday", open: "10:00", close: "21:00", closed: false },
      { day: "Tuesday", open: "10:00", close: "21:00", closed: false },
      { day: "Wednesday", open: "10:00", close: "21:00", closed: false },
      { day: "Thursday", open: "10:00", close: "21:00", closed: false },
      { day: "Friday", open: "10:00", close: "22:00", closed: false },
      { day: "Saturday", open: "09:00", close: "22:00", closed: false },
      { day: "Sunday", open: "09:00", close: "21:00", closed: false }
    },
    features: ["delivery", "takeout", "dine-in", "budget-friendly", "authentic-thai", "quick-service"],
    description: "Authentic Thai street food in a clean, modern setting. All the flavors you love from Bangkok's streets.",
    images: [
      "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=800",
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800"
    ],
    menu: {
      categories: [
        { id: 1, name: "Noodles", nameEn: "Noodle Dishes", nameTh: "ก๋วยเตี๋ยว" },
        { id: 2, name: "Rice", nameEn: "Rice Dishes", nameTh: "ข้าว" },
        { id: 3, name: "Stir-fry", nameEn: "Stir-fried", nameTh: "ผัด" },
        { id: 4, name: "Salads", nameEn: "Thai Salads", nameTh: "ยำ" }
      ],
      items: [
        { id: 1, categoryId: 1, name: "Pad Thai", price: 120, description: "Classic stir-fried rice noodles with shrimp", popular: true },
        { id: 2, categoryId: 2, name: "Khao Pad", price: 100, description: "Thai fried rice with egg and vegetables" },
        { id: 3, categoryId: 3, name: "Pad Krapow", price: 110, description: "Stir-fried basil with pork and fried egg", popular: true },
        { id: 4, categoryId: 4, name: "Som Tam", price: 80, description: "Spicy green papaya salad", popular: true }
      ]
    },
    analytics: {
      monthlyVisitors: 4500,
      averageOrderValue: 145,
      popularTimes: ["12:00-14:00", "18:00-20:00"],
      topDishes: ["Pad Thai", "Pad Krapow", "Som Tam"],
      customerSatisfaction: 4.1,
      repeatCustomerRate: 0.85
    },
    reviews: [
      { id: 1, rating: 4, comment: "Great authentic Thai food at reasonable prices!", author: "Tom H.", date: "2024-12-16" },
      { id: 2, rating: 4, comment: "Love the pad thai here. Quick service too.", author: "Niran K.", date: "2024-12-14" }
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
      healthy: "If you're looking for healthy options, **Green Garden Café** in Asok is perfect! 🥗 They specialize in organic, plant-based dishes with great vegan options. Their Acai Berry Bowl and Quinoa Power Salad are very popular.",
      budget: "For authentic and affordable Thai food, **Street Food Corner** at Chatuchak is amazing! 🍜 You can get delicious Pad Thai, Pad Krapow, and Som Tam for under 150 baht. Great value and authentic flavors!",
      spicy: "**Spice Route** serves incredible North Indian cuisine! 🌶️ Their Butter Chicken and Tandoori specialties are fantastic. They can adjust spice levels, so just let them know your preference."
    }
  },
  menu_analysis: {
    triggers: ["menu", "dishes", "food", "what to order"],
    responses: {
      popular_items: "Here are the most popular dishes across our restaurants:\n\n🔥 **Top Picks:**\n• Spaghetti Carbonara (Bella Italia) - ฿320\n• Omakase Set (Sushi Zen) - ฿1,200\n• Acai Berry Bowl (Green Garden) - ฿280\n• Butter Chicken (Spice Route) - ฿350\n• Pad Thai (Street Food Corner) - ฿120",
      vegetarian: "Great vegetarian options available! 🌱\n\n• **Green Garden Café** - Fully plant-based menu\n• **Bella Italia** - Pizza Margherita, Penne Arrabbiata\n• **Spice Route** - Samosa, various vegetarian curries\n• **Street Food Corner** - Pad Thai (vegetarian version), Som Tam"
    }
  },
  price_analysis: {
    triggers: ["price", "cost", "budget", "expensive", "cheap"],
    responses: {
      budget_friendly: "**Budget-Friendly Options (Under ฿200):**\n\n🏆 Street Food Corner - ฿100-250\n• Pad Thai - ฿120\n• Som Tam - ฿80\n• Khao Pad - ฿100\n\n💡 Green Garden Café also has items under ฿200 like their Green Detox Juice (฿180)",
      mid_range: "**Mid-Range Dining (฿200-600):**\n\n🍝 Bella Italia - ฿300-600\n🥗 Green Garden Café - ฿200-400\n🌶️ Spice Route - ฿250-500\n\nPerfect for casual dining with good quality!",
      premium: "**Premium Experience (฿600+):**\n\n🍣 Sushi Zen - ฿600-1000+\nTheir Omakase set (฿1,200) offers an exceptional dining experience with the freshest ingredients."
    }
  },
  location_based: {
    triggers: ["near", "location", "area", "district"],
    responses: {
      silom: "In **Silom area**, you have **Bella Italia** - perfect for Italian cuisine in the business district. Great for lunch meetings or dinner after work!",
      thonglor: "**Thonglor** is home to **Sushi Zen** - one of Bangkok's finest sushi restaurants. Perfect for the trendy Thonglor crowd!",
      asok: "In **Asok**, check out **Green Garden Café** - ideal for healthy meals near the business district. Great for health-conscious professionals!",
      chatuchak: "**Chatuchak** has **Street Food Corner** - perfect when visiting the weekend market. Authentic Thai flavors at great prices!"
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
      } else if (lowerMessage.includes('healthy') || lowerMessage.includes('vegan')) {
        specificResponse = AI_SCENARIOS.restaurant_recommendation.responses.healthy;
      } else if (lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
        specificResponse = AI_SCENARIOS.restaurant_recommendation.responses.budget;
      } else if (lowerMessage.includes('spicy') || lowerMessage.includes('indian')) {
        specificResponse = AI_SCENARIOS.restaurant_recommendation.responses.spicy;
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

    // Check for price analysis
    else if (AI_SCENARIOS.price_analysis.triggers.some(trigger => lowerMessage.includes(trigger))) {
      intent = 'price_analysis';
      
      if (lowerMessage.includes('budget') || lowerMessage.includes('cheap')) {
        specificResponse = AI_SCENARIOS.price_analysis.responses.budget_friendly;
      } else if (lowerMessage.includes('expensive') || lowerMessage.includes('premium')) {
        specificResponse = AI_SCENARIOS.price_analysis.responses.premium;
      } else {
        specificResponse = AI_SCENARIOS.price_analysis.responses.mid_range;
      }
    }

    // Check for location-based queries
    else if (AI_SCENARIOS.location_based.triggers.some(trigger => lowerMessage.includes(trigger))) {
      intent = 'location_based';
      
      if (lowerMessage.includes('silom')) {
        specificResponse = AI_SCENARIOS.location_based.responses.silom;
      } else if (lowerMessage.includes('thonglor')) {
        specificResponse = AI_SCENARIOS.location_based.responses.thonglor;
      } else if (lowerMessage.includes('asok')) {
        specificResponse = AI_SCENARIOS.location_based.responses.asok;
      } else if (lowerMessage.includes('chatuchak')) {
        specificResponse = AI_SCENARIOS.location_based.responses.chatuchak;
      }
    }

    // Default response if no specific match
    if (!specificResponse) {
      specificResponse = "I'd be happy to help you find the perfect restaurant! 🍽️ You can ask me about:\n\n• Restaurant recommendations by cuisine\n• Popular dishes and menu items\n• Price ranges and budget options\n• Locations and areas\n• Dietary preferences (vegetarian, vegan, etc.)\n\nWhat would you like to know?";
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

    if (restaurant.features.includes('vegan-options')) {
      insights.push("🌱 Vegan-friendly - Plant-based options available");
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
        "Recommend healthy options",
        "Best sushi in Bangkok"
      ],
      menu_analysis: [
        "What are the most popular dishes?",
        "Show vegetarian options",
        "What should I order at Bella Italia?",
        "Recommend dishes under 200 baht"
      ],
      price_analysis: [
        "Show budget restaurants",
        "What's the most expensive option?",
        "Mid-range dining recommendations",
        "Best value for money"
      ],
      location_based: [
        "Restaurants near Silom",
        "What's good in Thonglor?",
        "Dining options in Asok",
        "Food near Chatuchak Market"
      ],
      general: [
        "Recommend a restaurant",
        "Show popular dishes",
        "Budget-friendly options",
        "Restaurants with delivery"
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