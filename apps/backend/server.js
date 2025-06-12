/**
 * BiteBase Minimal Server for Vercel Deployment
 * Lightweight version of the main API server optimized for serverless deployment
 */

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const app = express();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "bitebase-demo-secret-key";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "demo-google-client-id";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(cors({
  origin: [
    "https://bitebase-frontend.vercel.app",
    "https://beta.bitebase.app",
    "http://localhost:3000",
    "http://localhost:12000",
    process.env.NEXT_PUBLIC_SITE_URL
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// API routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// User authentication endpoints
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object (in a real app, this would be saved to database)
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // In a real app, fetch user from database
    // For demo purposes, we'll create a mock user
    const mockUser = {
      id: "demo-user-id",
      email: email,
      name: "Demo User",
      password: await bcrypt.hash("demo123", 10) // Demo password
    };

    // Verify password
    const isValidPassword = await bcrypt.compare(password, mockUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      user: { id: mockUser.id, email: mockUser.email, name: mockUser.name },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Google OAuth login
app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Google token is required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Create or find user (in a real app, this would interact with database)
    const user = {
      id: googleId,
      email,
      name,
      picture,
      provider: "google"
    };

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Google login successful",
      user: { id: user.id, email: user.email, name: user.name, picture: user.picture },
      token: jwtToken
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// Protected route example
app.get("/api/user/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user
  });
});

// Restaurant search endpoint (mock data)
app.get("/api/restaurants/search", (req, res) => {
  const { query, lat, lng, radius } = req.query;
  
  // Mock restaurant data
  const mockRestaurants = [
    {
      id: "1",
      name: "The Local Bistro",
      cuisine: "International",
      rating: 4.5,
      priceRange: "$$",
      location: { lat: 13.7563, lng: 100.5018 },
      address: "123 Main St, Bangkok, Thailand",
      phone: "+66-2-123-4567",
      hours: "11:00 AM - 10:00 PM"
    },
    {
      id: "2", 
      name: "Spice Garden",
      cuisine: "Thai",
      rating: 4.8,
      priceRange: "$$$",
      location: { lat: 13.7563, lng: 100.5018 },
      address: "456 Sukhumvit Rd, Bangkok, Thailand",
      phone: "+66-2-987-6543",
      hours: "12:00 PM - 11:00 PM"
    }
  ];

  res.json({
    restaurants: mockRestaurants,
    total: mockRestaurants.length,
    query: query || "all"
  });
});

// AI Assistant endpoint (mock)
app.post("/api/ai/chat", authenticateToken, (req, res) => {
  const { message, context } = req.body;
  
  // Mock AI response
  const mockResponse = {
    response: `I understand you're asking about: "${message}". Based on your location and preferences, I'd recommend checking out The Local Bistro for great international cuisine or Spice Garden for authentic Thai food. Both have excellent ratings and are nearby!`,
    suggestions: [
      "Find restaurants near me",
      "Show me Thai restaurants",
      "What's the best rated restaurant?"
    ],
    timestamp: new Date().toISOString()
  };

  res.json(mockResponse);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Export for Vercel
module.exports = app;

// Start server if running directly (not in Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`BiteBase API server running on port ${PORT}`);
  });
}