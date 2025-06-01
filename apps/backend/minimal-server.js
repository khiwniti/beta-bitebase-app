#!/usr/bin/env node

/**
 * Minimal BiteBase Backend Server
 * Simple Express server for frontend-backend connection testing
 */

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY || "sk_test_demo_key",
);

const app = express();
const PORT = process.env.PORT || 12001;
const HOST = process.env.HOST || "0.0.0.0";
const JWT_SECRET = process.env.JWT_SECRET || "bitebase-demo-secret-key";
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "demo-google-client-id";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(
  cors({
    origin: [
      "https://work-1-gjqewehruzacrehd.prod-runtime.all-hands.dev",
      "https://work-2-gjqewehruzacrehd.prod-runtime.all-hands.dev",
      "http://localhost:12000",
      "http://localhost:3000",
      "https://affectionate-bhaskara1-kqm96.view-3.tempo-dev.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Mock Users Database (In production, this would be a real database)
const mockUsers = [
  {
    id: 1,
    email: "demo@bitebase.com",
    password: "$2b$10$rOvHPGkwYvYFQVkjd1rJ4eK8vQxGQHxvYjKQvYFQVkjd1rJ4eK8vQ", // demo123
    name: "Alex Chen",
    role: "restaurant_owner",
    profile: {
      firstName: "Alex",
      lastName: "Chen",
      phone: "+66-2-123-4567",
      company: "Spice Garden Group",
      position: "Owner & CEO",
      experience: "15 years",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Passionate restaurateur with 15 years of experience in Thai cuisine. Founded Spice Garden Group with 3 successful locations.",
      preferences: {
        language: "en",
        notifications: true,
        theme: "light",
      },
    },
    restaurants: [1, 2],
    subscription: {
      plan: "premium",
      status: "active",
      expiresAt: "2024-12-31",
    },
    createdAt: "2023-06-15",
    lastLogin: "2024-01-20",
  },
  {
    id: 2,
    email: "analyst@bitebase.com",
    password: "$2b$10$rOvHPGkwYvYFQVkjd1rJ4eK8vQxGQHxvYjKQvYFQVkjd1rJ4eK8vQ", // analyst123
    name: "Sarah Johnson",
    role: "market_analyst",
    profile: {
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "+66-2-234-5678",
      company: "BiteBase Analytics",
      position: "Senior Market Analyst",
      experience: "8 years",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Data-driven market analyst specializing in F&B industry trends and location intelligence.",
      preferences: {
        language: "en",
        notifications: true,
        theme: "dark",
      },
    },
    restaurants: [],
    subscription: {
      plan: "enterprise",
      status: "active",
      expiresAt: "2024-12-31",
    },
    createdAt: "2023-08-20",
    lastLogin: "2024-01-20",
  },
  {
    id: 3,
    email: "franchise@bitebase.com",
    password: "$2b$10$rOvHPGkwYvYFQVkjd1rJ4eK8vQxGQHxvYjKQvYFQVkjd1rJ4eK8vQ", // franchise123
    name: "Michael Wong",
    role: "franchise_manager",
    profile: {
      firstName: "Michael",
      lastName: "Wong",
      phone: "+66-2-345-6789",
      company: "Urban Dining Concepts",
      position: "Franchise Development Manager",
      experience: "12 years",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Franchise development expert helping restaurant brands expand across Southeast Asia.",
      preferences: {
        language: "en",
        notifications: true,
        theme: "light",
      },
    },
    restaurants: [3, 4],
    subscription: {
      plan: "enterprise",
      status: "active",
      expiresAt: "2024-12-31",
    },
    createdAt: "2023-09-10",
    lastLogin: "2024-01-19",
  },
  {
    id: 4,
    email: "admin@bitebase.com",
    password: "$2b$10$rOvHPGkwYvYFQVkjd1rJ4eK8vQxGQHxvYjKQvYFQVkjd1rJ4eK8vQ", // admin123
    name: "Emma Rodriguez",
    role: "admin",
    profile: {
      firstName: "Emma",
      lastName: "Rodriguez",
      phone: "+66-2-456-7890",
      company: "BiteBase",
      position: "Platform Administrator",
      experience: "10 years",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Platform administrator ensuring smooth operations and user experience across BiteBase.",
      preferences: {
        language: "en",
        notifications: true,
        theme: "light",
      },
    },
    restaurants: [1, 2, 3, 4],
    subscription: {
      plan: "admin",
      status: "active",
      expiresAt: "2025-12-31",
    },
    createdAt: "2023-01-01",
    lastLogin: "2024-01-20",
  },
  {
    id: 5,
    email: "investor@bitebase.com",
    password: "$2b$10$rOvHPGkwYvYFQVkjd1rJ4eK8vQxGQHxvYjKQvYFQVkjd1rJ4eK8vQ", // investor123
    name: "David Kim",
    role: "investor",
    profile: {
      firstName: "David",
      lastName: "Kim",
      phone: "+66-2-567-8901",
      company: "Asia Food Ventures",
      position: "Investment Director",
      experience: "20 years",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      bio: "Venture capital investor focused on food tech and restaurant innovation in Southeast Asia.",
      preferences: {
        language: "en",
        notifications: true,
        theme: "light",
      },
    },
    restaurants: [],
    subscription: {
      plan: "enterprise",
      status: "active",
      expiresAt: "2024-12-31",
    },
    createdAt: "2023-07-01",
    lastLogin: "2024-01-18",
  },
];

// Enhanced Restaurant Data
const restaurants = [
  {
    id: 1,
    name: "Spice Garden Thai",
    latitude: 13.7563,
    longitude: 100.5018,
    address: "123 Sukhumvit Road, Bangkok",
    cuisine: "Thai",
    price_range: "moderate",
    rating: 4.5,
    platform: "google",
    phone: "+66-2-123-4567",
    website: "https://spicegarden.com",
    hours: "Mon-Sun: 11:00-22:00",
    features: ["outdoor_seating", "wifi", "parking", "delivery"],
    ownerId: 1,
    details: {
      description: "Authentic Thai cuisine with modern presentation",
      capacity: 80,
      openingHours: "11:00 AM - 10:00 PM",
      specialties: ["Pad Thai", "Tom Yum", "Green Curry"],
      averageCheck: 450,
      monthlyRevenue: 850000,
      employees: 12,
      established: "2018",
    },
    analytics: {
      monthlyVisitors: 2400,
      repeatCustomers: 65,
      averageRating: 4.5,
      reviewCount: 234,
      peakHours: ["12:00-14:00", "19:00-21:00"],
      popularDishes: ["Pad Thai", "Tom Yum Goong", "Massaman Curry"],
    },
    financials: {
      revenue: {
        monthly: [850000, 920000, 780000, 1100000, 950000, 1050000],
        yearly: 11500000,
        growth: 12.5,
      },
      costs: {
        food: 35,
        labor: 28,
        rent: 15,
        utilities: 8,
        other: 14,
      },
      profit_margin: 18.5,
    },
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"],
    description:
      "Authentic Thai cuisine with modern presentation in the heart of Bangkok.",
  },
  {
    id: 2,
    name: "Urban Bistro",
    latitude: 13.744,
    longitude: 100.5255,
    address: "456 Silom Road, Bangkok",
    cuisine: "International",
    price_range: "expensive",
    rating: 4.2,
    platform: "google",
    phone: "+66-2-234-5678",
    website: "https://urbanbistro.com",
    hours: "Mon-Sun: 18:00-24:00",
    features: ["fine_dining", "wine_bar", "private_rooms", "valet"],
    ownerId: 1,
    details: {
      description: "Contemporary international cuisine in elegant setting",
      capacity: 120,
      openingHours: "6:00 PM - 12:00 AM",
      specialties: ["Wagyu Steak", "Lobster Thermidor", "Truffle Pasta"],
      averageCheck: 1200,
      monthlyRevenue: 1800000,
      employees: 18,
      established: "2020",
    },
    analytics: {
      monthlyVisitors: 1800,
      repeatCustomers: 45,
      averageRating: 4.2,
      reviewCount: 156,
      peakHours: ["19:00-21:00", "21:00-23:00"],
      popularDishes: ["Wagyu Ribeye", "Lobster Bisque", "Chocolate Soufflé"],
    },
    financials: {
      revenue: {
        monthly: [1800000, 1950000, 1650000, 2100000, 1850000, 2000000],
        yearly: 22500000,
        growth: 15.8,
      },
      costs: {
        food: 32,
        labor: 30,
        rent: 18,
        utilities: 6,
        other: 14,
      },
      profit_margin: 22.3,
    },
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    ],
    description:
      "Upscale international dining with premium ingredients and exceptional service.",
  },
  {
    id: 3,
    name: "Noodle House",
    latitude: 13.765,
    longitude: 100.538,
    address: "789 Phetchaburi Road, Bangkok",
    cuisine: "Asian",
    price_range: "budget",
    rating: 4.0,
    platform: "google",
    phone: "+66-2-345-6789",
    website: "https://noodlehouse.com",
    hours: "Mon-Sun: 10:00-21:00",
    features: ["quick_service", "takeaway", "delivery", "casual"],
    ownerId: 3,
    details: {
      description: "Quick service Asian noodles and rice dishes",
      capacity: 45,
      openingHours: "10:00 AM - 9:00 PM",
      specialties: ["Ramen", "Pad See Ew", "Fried Rice"],
      averageCheck: 180,
      monthlyRevenue: 320000,
      employees: 8,
      established: "2019",
    },
    analytics: {
      monthlyVisitors: 3200,
      repeatCustomers: 75,
      averageRating: 4.0,
      reviewCount: 445,
      peakHours: ["12:00-13:00", "18:00-19:00"],
      popularDishes: ["Tonkotsu Ramen", "Pad See Ew", "Thai Fried Rice"],
    },
    financials: {
      revenue: {
        monthly: [320000, 350000, 290000, 380000, 340000, 360000],
        yearly: 4080000,
        growth: 8.2,
      },
      costs: {
        food: 38,
        labor: 25,
        rent: 12,
        utilities: 10,
        other: 15,
      },
      profit_margin: 16.5,
    },
    images: [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    ],
    description:
      "Fast-casual Asian noodles and rice bowls with authentic flavors.",
  },
  {
    id: 4,
    name: "Cafe Central",
    latitude: 13.7308,
    longitude: 100.5418,
    address: "321 Sathorn Road, Bangkok",
    cuisine: "Cafe",
    price_range: "moderate",
    rating: 4.3,
    platform: "google",
    phone: "+66-2-456-7890",
    website: "https://cafecentral.com",
    hours: "Mon-Fri: 07:00-18:00, Sat-Sun: 08:00-19:00",
    features: ["wifi", "outdoor_seating", "coffee", "pastries"],
    ownerId: 3,
    details: {
      description: "Specialty coffee and light meals in business district",
      capacity: 60,
      openingHours: "7:00 AM - 6:00 PM",
      specialties: ["Specialty Coffee", "Sandwiches", "Pastries"],
      averageCheck: 280,
      monthlyRevenue: 480000,
      employees: 10,
      established: "2021",
    },
    analytics: {
      monthlyVisitors: 2800,
      repeatCustomers: 55,
      averageRating: 4.3,
      reviewCount: 189,
      peakHours: ["08:00-10:00", "12:00-14:00"],
      popularDishes: ["Flat White", "Avocado Toast", "Croissant"],
    },
    financials: {
      revenue: {
        monthly: [480000, 520000, 440000, 580000, 510000, 550000],
        yearly: 6240000,
        growth: 11.4,
      },
      costs: {
        food: 30,
        labor: 32,
        rent: 20,
        utilities: 8,
        other: 10,
      },
      profit_margin: 19.2,
    },
    images: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    ],
    description:
      "Premium coffee and light bites in the heart of Bangkok's business district.",
  },
];

// Enhanced Market Analysis Data
const marketAnalyses = [
  {
    id: 1,
    title: "Bangkok Central District Analysis",
    location: "Bangkok Central",
    latitude: 13.7563,
    longitude: 100.5018,
    date: "2024-01-15",
    summary: "High-density commercial area with strong foot traffic",
    status: "completed",
    analyst_id: 2,
    metrics: {
      footTraffic: 8500,
      competition: 45,
      avgRent: 25000,
      demographics: "Young professionals, tourists",
      opportunity_score: 8.5,
      market_size: "large",
    },
    details: {
      marketSize: "Large",
      growthRate: 8.5,
      seasonality: "Stable year-round",
      keyInsights: [
        "High lunch traffic from office workers",
        "Tourist influx during weekends",
        "Premium pricing acceptable",
      ],
      recommendations: [
        "Focus on lunch offerings for office workers",
        "Consider tourist-friendly menu options",
        "Premium positioning viable",
      ],
    },
    results: {
      total_restaurants: 245,
      avg_rating: 4.3,
      price_distribution: {
        budget: 20,
        moderate: 50,
        upscale: 25,
        luxury: 5,
      },
    },
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Sukhumvit Corridor Study",
    location: "Sukhumvit Road",
    latitude: 13.744,
    longitude: 100.5255,
    date: "2024-01-10",
    summary: "Premium dining destination with international clientele",
    status: "completed",
    analyst_id: 2,
    metrics: {
      footTraffic: 12000,
      competition: 67,
      avgRent: 35000,
      demographics: "Expatriates, high-income locals",
      opportunity_score: 9.2,
      market_size: "very_large",
    },
    details: {
      marketSize: "Very Large",
      growthRate: 12.3,
      seasonality: "Peak during holidays",
      keyInsights: [
        "International cuisine preferred",
        "High spending power",
        "Brand recognition important",
      ],
      recommendations: [
        "Focus on international menu",
        "Invest in brand marketing",
        "Premium service standards required",
      ],
    },
    results: {
      total_restaurants: 387,
      avg_rating: 4.5,
      price_distribution: {
        budget: 10,
        moderate: 35,
        upscale: 40,
        luxury: 15,
      },
    },
    created_at: "2024-01-10T14:20:00Z",
  },
  {
    id: 3,
    title: "Chatuchak Market Area",
    location: "Chatuchak",
    latitude: 13.765,
    longitude: 100.538,
    date: "2024-01-08",
    summary: "Weekend market area with diverse food options",
    status: "completed",
    analyst_id: 2,
    metrics: {
      footTraffic: 15000,
      competition: 89,
      avgRent: 18000,
      demographics: "Locals, weekend shoppers",
      opportunity_score: 7.8,
      market_size: "large",
    },
    details: {
      marketSize: "Large",
      growthRate: 6.2,
      seasonality: "Weekend-heavy",
      keyInsights: [
        "Price-sensitive customers",
        "Quick service preferred",
        "Local flavors popular",
      ],
      recommendations: [
        "Focus on value pricing",
        "Quick service model",
        "Authentic local cuisine",
      ],
    },
    results: {
      total_restaurants: 156,
      avg_rating: 4.1,
      price_distribution: {
        budget: 60,
        moderate: 30,
        upscale: 8,
        luxury: 2,
      },
    },
    created_at: "2024-01-08T09:15:00Z",
  },
  {
    id: 4,
    title: "Riverside District Analysis",
    location: "Chao Phraya Riverside",
    latitude: 13.7308,
    longitude: 100.5418,
    date: "2024-01-05",
    summary: "Tourist-heavy area with scenic dining opportunities",
    status: "completed",
    analyst_id: 2,
    metrics: {
      footTraffic: 9500,
      competition: 34,
      avgRent: 28000,
      demographics: "Tourists, special occasion diners",
      opportunity_score: 8.9,
      market_size: "medium",
    },
    details: {
      marketSize: "Medium",
      growthRate: 15.7,
      seasonality: "High season Nov-Mar",
      keyInsights: [
        "Scenic views command premium",
        "Tourist-friendly service needed",
        "Instagram-worthy presentation important",
      ],
      recommendations: [
        "Invest in scenic seating",
        "Multi-language staff",
        "Focus on presentation",
      ],
    },
    results: {
      total_restaurants: 78,
      avg_rating: 4.4,
      price_distribution: {
        budget: 15,
        moderate: 25,
        upscale: 45,
        luxury: 15,
      },
    },
    created_at: "2024-01-05T16:45:00Z",
  },
];

// ============================================================================
// STRIPE INTEGRATION
// ============================================================================

// Create payment intent
app.post(
  "/api/stripe/create-payment-intent",
  authenticateToken,
  async (req, res) => {
    try {
      const { amount, currency = "usd", metadata = {} } = req.body;

      if (!amount || amount < 50) {
        return res.status(400).json({ error: "Amount must be at least $0.50" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId: req.user.id.toString(),
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  },
);

// Get subscription plans
app.get("/api/stripe/plans", (req, res) => {
  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 29.99,
      currency: "usd",
      interval: "month",
      features: ["Basic Analytics", "Up to 5 Locations", "Email Support"],
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: 99.99,
      currency: "usd",
      interval: "month",
      features: [
        "Advanced Analytics",
        "Unlimited Locations",
        "Priority Support",
        "API Access",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 299.99,
      currency: "usd",
      interval: "month",
      features: [
        "Custom Analytics",
        "White Label",
        "Dedicated Support",
        "Custom Integrations",
      ],
    },
  ];

  res.json({ plans });
});

// Stripe webhook handler
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_demo_secret";

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);
        // Update user subscription status
        break;
      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  },
);

// ============================================================================
// GOOGLE AUTH INTEGRATION
// ============================================================================

// Google OAuth login
app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = mockUsers.find((u) => u.email === email);

    if (!user) {
      // Create new user
      user = {
        id: mockUsers.length + 1,
        email,
        password: null, // No password for Google auth users
        name,
        role: "restaurant_owner",
        googleId,
        profile: {
          firstName: name.split(" ")[0] || "",
          lastName: name.split(" ").slice(1).join(" ") || "",
          phone: "",
          company: "",
          position: "",
          experience: "0 years",
          avatar:
            picture ||
            `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
          bio: "",
          preferences: {
            language: "en",
            notifications: true,
            theme: "light",
          },
        },
        restaurants: [],
        subscription: {
          plan: "basic",
          status: "active",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      mockUsers.push(user);
    } else {
      // Update existing user
      user.lastLogin = new Date().toISOString();
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.profile.avatar.includes("unsplash")) {
        user.profile.avatar = picture;
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: "Google authentication successful",
      token: jwtToken,
      user: userWithoutPassword,
      isNewUser: !mockUsers.find((u) => u.email === email && u.id !== user.id),
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // For demo purposes, accept simple passwords (in production, use bcrypt)
    const validPasswords = {
      "demo@bitebase.com": "demo123",
      "analyst@bitebase.com": "analyst123",
      "franchise@bitebase.com": "franchise123",
      "admin@bitebase.com": "admin123",
      "investor@bitebase.com": "investor123",
    };

    if (validPasswords[email] !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = "restaurant_owner",
    } = req.body;

    if (!email || !password || !firstName) {
      return res
        .status(400)
        .json({ message: "Email, password, and first name are required" });
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password: `$2b$10$rOvHPGkwYvYFQVkjd1rJ4eK8vQxGQHxvYjKQvYFQVkjd1rJ4eK8vQ`, // Hashed password
      name: `${firstName} ${lastName || ""}`.trim(),
      role,
      profile: {
        firstName,
        lastName: lastName || "",
        phone: phone || "",
        company: "",
        position: "",
        experience: "0 years",
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        bio: "",
        preferences: {
          language: "en",
          notifications: true,
          theme: "light",
        },
      },
      restaurants: [],
      subscription: {
        plan: "basic",
        status: "active",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 30 days
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Return user data and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: "Registration successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current user profile
app.get("/api/auth/profile", authenticateToken, (req, res) => {
  try {
    const user = mockUsers.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile
app.put("/api/auth/profile", authenticateToken, (req, res) => {
  try {
    const userIndex = mockUsers.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile
    const updates = req.body;
    if (updates.profile) {
      mockUsers[userIndex].profile = {
        ...mockUsers[userIndex].profile,
        ...updates.profile,
      };
    }
    if (updates.name) {
      mockUsers[userIndex].name = updates.name;
    }

    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    res.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users (admin only)
app.get("/api/users", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const usersWithoutPasswords = mockUsers.map(
      ({ password, ...user }) => user,
    );
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error("Users list error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ============================================================================
// API ROUTES
// ============================================================================

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "bitebase-minimal-backend",
    version: "1.0.0",
    environment: "development",
    timestamp: new Date().toISOString(),
  });
});

// AI Chat endpoints
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userId, userContext } = req.body;

    // Simple AI response simulation
    const responses = {
      "How are my sales this month?": {
        content: `Based on your current data, here's your sales performance this month:

**Monthly Revenue**: ฿185,400 (+12.3% vs last month)
**Customer Count**: 892 customers (+8.7% vs last month)
**Average Order Value**: ฿680 (+5.2% vs last month)

**Key Insights:**
• Your weekend dinner rush (Friday-Saturday 7-9pm) shows 35% higher demand than seating capacity
• Seafood Linguine and Truffle Risotto are driving 45% of your revenue
• Customer satisfaction score improved to 4.6/5

**Recommendations:**
• Consider expanding weekend dinner capacity or implementing reservations
• Promote your signature pasta dishes more prominently
• Focus on maintaining high service quality during peak hours`,
        type: "sales_analysis",
        data: {
          monthlyRevenue: 185400,
          customerCount: 892,
          averageOrder: 680,
          growth: 12.3,
        },
        language: userContext?.language || "en",
      },
      "Suggest a promotion": {
        content: `Here are some targeted promotion ideas for Bella Vista Bistro:

**Weekend Dinner Special** 🍝
• "Pasta & Wine Pairing" - 20% off when ordering signature pasta with wine
• Target: Friday-Saturday 7-9pm to maximize high-demand period

**Lunch Business Boost** 🕐
• "Express Lunch Menu" - 3-course meal in 45 minutes for ฿450
• Target: Weekday 11:30am-2pm for office workers

**Customer Loyalty Program** ⭐
• "Bella Rewards" - Every 10th visit gets 50% off main course
• Encourage repeat customers (currently 65% repeat rate)

**Social Media Campaign** 📱
• "Instagram Your Pasta" - 15% off when customers post photos with hashtag
• Leverage your photogenic signature dishes

**Recommended**: Start with Weekend Dinner Special as it targets your highest-demand period with best profit margins.`,
        type: "marketing_strategy",
        language: userContext?.language || "en",
      },
      "Analyze my competition": {
        content: `Here's your competitive analysis for the local Italian dining market:

**Direct Competitors:**

**Nonna's Kitchen** (200m away) ⚠️
• Rating: 4.3/5 | Price: ฿฿ | Market Share: 12% ↗️
• Threat Level: **Medium** - 20% lower prices, gaining traction
• Strategy: Focus on your premium positioning and superior ambiance

**Ciao Bella** (350m away)
• Rating: 4.5/5 | Price: ฿฿฿ | Market Share: 18% →
• Threat Level: **Low** - Similar positioning, stable market
• Strategy: Differentiate through unique signature dishes

**Pasta Paradise** (400m away)
• Rating: 4.4/5 | Price: ฿฿ | Market Share: 14% ↗️
• Threat Level: **Medium** - Growing fast in casual segment

**Your Competitive Advantages:**
• Highest average order value (฿680 vs market avg ฿520)
• Premium location and ambiance
• Strong signature dish performance
• Growing customer satisfaction (4.6/5)

**Recommendations:**
• Maintain premium positioning while monitoring Nonna's Kitchen pricing
• Emphasize unique dishes and dining experience in marketing
• Consider lunch specials to compete in casual segment`,
        type: "performance_report",
        language: userContext?.language || "en",
      },
    };

    // Get response based on message or provide default
    const response = responses[message] || {
      content: `I understand you're asking about "${message}". I'm here to help with restaurant analytics, sales data, customer insights, and marketing strategies. 

Here are some things I can help you with:
• Sales performance analysis
• Customer behavior insights  
• Marketing strategy recommendations
• Competitive analysis
• Menu optimization suggestions
• Operational efficiency tips

Feel free to ask me specific questions about your restaurant's performance!`,
      type: "general_help",
      language: userContext?.language || "en",
    };

    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process chat request",
      timestamp: new Date().toISOString(),
    });
  }
});

// Get chat history
app.get("/api/chat/history/:userId", (req, res) => {
  const { userId } = req.params;
  const { limit = 10 } = req.query;

  // Return empty history for now (in real app, this would query database)
  res.json({
    success: true,
    history: [],
    userId: userId,
    limit: parseInt(limit),
  });
});

// Clear chat session
app.delete("/api/chat/session/:userId", (req, res) => {
  const { userId } = req.params;

  // In real app, this would clear user's chat history from database
  res.json({
    success: true,
    message: "Chat session cleared",
    userId: userId,
  });
});

// Get all restaurants
app.get("/api/restaurants", (req, res) => {
  const {
    cuisine,
    price_range,
    min_rating,
    limit = 10,
    offset = 0,
  } = req.query;

  let filteredRestaurants = [...restaurants];

  if (cuisine) {
    filteredRestaurants = filteredRestaurants.filter((r) =>
      r.cuisine.toLowerCase().includes(cuisine.toLowerCase()),
    );
  }

  if (price_range) {
    filteredRestaurants = filteredRestaurants.filter(
      (r) => r.price_range === price_range,
    );
  }

  if (min_rating) {
    filteredRestaurants = filteredRestaurants.filter(
      (r) => r.rating >= parseFloat(min_rating),
    );
  }

  // Apply pagination
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  const paginatedResults = filteredRestaurants.slice(startIndex, endIndex);

  res.json({
    restaurants: paginatedResults,
    total: filteredRestaurants.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
});

// Get restaurant by ID
app.get("/api/restaurants/:id", (req, res) => {
  const restaurant = restaurants.find((r) => r.id === parseInt(req.params.id));

  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }

  res.json(restaurant);
});

// Get market analyses
app.get("/api/market-analyses", (req, res) => {
  const { user_id, status, limit = 10, offset = 0 } = req.query;

  let filteredAnalyses = [...marketAnalyses];

  if (user_id) {
    filteredAnalyses = filteredAnalyses.filter((a) => a.user_id === user_id);
  }

  if (status) {
    filteredAnalyses = filteredAnalyses.filter((a) => a.status === status);
  }

  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  const paginatedResults = filteredAnalyses.slice(startIndex, endIndex);

  res.json({
    analyses: paginatedResults,
    total: filteredAnalyses.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
});

// Create new market analysis
app.post("/api/market-analyses", (req, res) => {
  const {
    user_id,
    location,
    latitude,
    longitude,
    analysis_type = "comprehensive",
  } = req.body;

  if (!user_id || !location || !latitude || !longitude) {
    return res.status(400).json({
      error: "user_id, location, latitude, and longitude are required",
    });
  }

  // Create new analysis
  const newAnalysis = {
    id: marketAnalyses.length + 1,
    user_id,
    location,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    analysis_type,
    status: "processing",
    opportunity_score: null,
    competition_level: null,
    market_size: null,
    results: null,
    created_at: new Date().toISOString(),
  };

  marketAnalyses.push(newAnalysis);

  // Simulate processing delay
  setTimeout(() => {
    const analysis = marketAnalyses.find((a) => a.id === newAnalysis.id);
    if (analysis) {
      analysis.status = "completed";
      analysis.opportunity_score = 7.5 + Math.random() * 2; // Random score between 7.5-9.5
      analysis.competition_level = ["low", "medium", "high"][
        Math.floor(Math.random() * 3)
      ];
      analysis.market_size = ["small", "medium", "large"][
        Math.floor(Math.random() * 3)
      ];
      analysis.results = {
        total_restaurants: Math.floor(Math.random() * 1000) + 100,
        avg_rating: 3.5 + Math.random() * 1.5,
        price_distribution: {
          budget: Math.floor(Math.random() * 30) + 10,
          moderate: Math.floor(Math.random() * 40) + 30,
          upscale: Math.floor(Math.random() * 30) + 15,
          luxury: Math.floor(Math.random() * 15) + 5,
        },
      };
    }
  }, 3000); // 3 second delay

  res.status(201).json(newAnalysis);
});

// Get market analysis by ID
app.get("/api/market-analyses/:id", (req, res) => {
  const analysis = marketAnalyses.find((a) => a.id === parseInt(req.params.id));

  if (!analysis) {
    return res.status(404).json({ error: "Market analysis not found" });
  }

  res.json(analysis);
});

// ============================================================================
// POS INTEGRATION WITH EXTERNAL DATA SOURCES
// ============================================================================

// Get POS systems with external data source support
app.get("/api/pos/systems", (req, res) => {
  const posSystems = [
    {
      id: "square",
      name: "Square POS",
      logo: "⬜",
      status: "connected",
      description: "Complete point-of-sale solution with inventory management",
      features: [
        "Real-time sales data",
        "Inventory tracking",
        "Customer analytics",
        "Payment processing",
      ],
      setupTime: "15 minutes",
      monthlyFee: "Free + 2.6% per transaction",
      externalSources: ["postgresql", "google_sheets", "csv_import"],
    },
    {
      id: "toast",
      name: "Toast POS",
      logo: "🍞",
      status: "available",
      description: "Restaurant-specific POS with kitchen display integration",
      features: [
        "Kitchen display system",
        "Online ordering",
        "Staff management",
        "Menu engineering",
      ],
      setupTime: "30 minutes",
      monthlyFee: "$69/month",
      externalSources: ["postgresql", "mysql", "google_sheets"],
    },
    {
      id: "clover",
      name: "Clover",
      logo: "🍀",
      status: "available",
      description: "All-in-one business management platform",
      features: [
        "Payment processing",
        "Inventory management",
        "Employee management",
        "Reporting",
      ],
      setupTime: "20 minutes",
      monthlyFee: "$14.95/month",
      externalSources: ["postgresql", "google_sheets", "excel_import"],
    },
  ];

  res.json({ systems: posSystems });
});

// Configure external data source for POS
app.post(
  "/api/pos/configure-external-source",
  authenticateToken,
  async (req, res) => {
    try {
      const { posSystemId, sourceType, configuration } = req.body;

      if (!posSystemId || !sourceType || !configuration) {
        return res.status(400).json({
          error: "POS system ID, source type, and configuration are required",
        });
      }

      // Validate configuration based on source type
      let validationResult;

      switch (sourceType) {
        case "postgresql":
          validationResult = await validatePostgreSQLConnection(configuration);
          break;
        case "google_sheets":
          validationResult =
            await validateGoogleSheetsConnection(configuration);
          break;
        case "csv_import":
          validationResult = await validateCSVImport(configuration);
          break;
        default:
          return res.status(400).json({ error: "Unsupported source type" });
      }

      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error });
      }

      // Store configuration (in real app, this would be in database)
      const configId = `config_${Date.now()}`;

      res.json({
        success: true,
        configurationId: configId,
        message: `${sourceType} data source configured successfully for ${posSystemId}`,
        testConnection: validationResult.testData,
      });
    } catch (error) {
      console.error("POS configuration error:", error);
      res
        .status(500)
        .json({ error: "Failed to configure external data source" });
    }
  },
);

// Get external data source configurations
app.get(
  "/api/pos/external-sources/:posSystemId",
  authenticateToken,
  (req, res) => {
    const { posSystemId } = req.params;

    // Mock configurations (in real app, fetch from database)
    const configurations = [
      {
        id: "config_1",
        sourceType: "postgresql",
        name: "Main Database",
        status: "connected",
        lastSync: "2024-01-20T10:30:00Z",
        recordCount: 15847,
      },
      {
        id: "config_2",
        sourceType: "google_sheets",
        name: "Inventory Tracking",
        status: "connected",
        lastSync: "2024-01-20T09:15:00Z",
        recordCount: 342,
      },
    ];

    res.json({ configurations });
  },
);

// Sync data from external source
app.post("/api/pos/sync-external-data", authenticateToken, async (req, res) => {
  try {
    const { configurationId, sourceType } = req.body;

    // Simulate data sync
    const syncResult = {
      configurationId,
      sourceType,
      syncStarted: new Date().toISOString(),
      status: "in_progress",
      estimatedDuration: "2-5 minutes",
    };

    // Simulate async sync process
    setTimeout(() => {
      console.log(`Sync completed for ${configurationId}`);
    }, 3000);

    res.json({
      success: true,
      sync: syncResult,
      message: "Data sync initiated successfully",
    });
  } catch (error) {
    console.error("Data sync error:", error);
    res.status(500).json({ error: "Failed to sync external data" });
  }
});

// Helper functions for external data source validation
async function validatePostgreSQLConnection(config) {
  try {
    const { host, port, database, username, password } = config;

    if (!host || !database || !username) {
      return {
        success: false,
        error: "Missing required PostgreSQL connection parameters",
      };
    }

    // In real implementation, test actual connection
    // const client = new Client({ host, port, database, user: username, password });
    // await client.connect();
    // const result = await client.query('SELECT NOW()');
    // await client.end();

    return {
      success: true,
      testData: {
        connectionTime: "45ms",
        serverVersion: "PostgreSQL 13.7",
        tablesFound: 12,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function validateGoogleSheetsConnection(config) {
  try {
    const { spreadsheetId, sheetName, serviceAccountKey } = config;

    if (!spreadsheetId || !serviceAccountKey) {
      return {
        success: false,
        error: "Missing required Google Sheets parameters",
      };
    }

    // In real implementation, test actual Google Sheets API connection
    return {
      success: true,
      testData: {
        spreadsheetTitle: "Restaurant Data Sheet",
        sheetName: sheetName || "Sheet1",
        rowCount: 156,
        lastModified: "2024-01-20T08:30:00Z",
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function validateCSVImport(config) {
  try {
    const { filePath, delimiter, hasHeader } = config;

    if (!filePath) {
      return { success: false, error: "File path is required for CSV import" };
    }

    return {
      success: true,
      testData: {
        fileName: filePath.split("/").pop(),
        delimiter: delimiter || ",",
        hasHeader: hasHeader !== false,
        estimatedRows: 1250,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// START SERVER
// ============================================================================

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 BiteBase Minimal Backend running on http://${HOST}:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /api/restaurants - List restaurants`);
  console.log(`   GET  /api/restaurants/:id - Get restaurant details`);
  console.log(`   GET  /api/market-analyses - List market analyses`);
  console.log(`   POST /api/market-analyses - Create market analysis`);
  console.log(`   GET  /api/market-analyses/:id - Get market analysis`);
  console.log(`🌐 CORS enabled for runtime domains`);
  console.log(`✅ Server ready for frontend connection!`);
});

// Keep the process alive
const keepAlive = setInterval(() => {
  // Do nothing, just keep the event loop active
}, 30000);

// Error handling
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Don't exit, just log the error
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit, just log the error
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  clearInterval(keepAlive);
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  clearInterval(keepAlive);
  server.close(() => {
    process.exit(0);
  });
});
