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
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Initialize Google OAuth client only if credentials are provided
let googleClient = null;
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "demo-google-client-id") {
  googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
  console.log("Google OAuth initialized with client ID:", GOOGLE_CLIENT_ID.substring(0, 20) + "...");
} else {
  console.log("Google OAuth not configured - using demo mode");
}

// In-memory user storage (in production, this would be a database)
const users = new Map();

// Initialize admin user
const initializeAdminUser = async () => {
  const adminEmail = "admin@bitebase.app";
  const adminPassword = "Libralytics1234!*";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const adminUser = {
    id: "admin-user-001",
    email: adminEmail,
    name: "BiteBase Admin",
    role: "admin",
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    isDemo: true
  };
  
  users.set(adminEmail, adminUser);
  console.log("Admin user initialized:", adminEmail);
};

// Initialize admin user on startup
initializeAdminUser();

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
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const user = {
      id: Date.now().toString(),
      email,
      name: `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0],
      firstName: firstName || email.split('@')[0],
      lastName: lastName || 'User',
      phone: phone || '',
      role: "user", // Regular users get 'user' role
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isDemo: false // Regular users don't get demo data
    };

    // Store user
    users.set(email, user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role
      },
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

    // Find user in storage
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role
      },
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

    // Check if Google OAuth is configured
    if (!googleClient) {
      return res.status(503).json({ 
        error: "Google authentication is not configured on this server",
        message: "Please contact the administrator to set up Google OAuth credentials"
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: "Email not provided by Google" });
    }

    // Check if user already exists
    let user = users.get(email);
    
    if (!user) {
      // Create new user
      user = {
        id: googleId,
        email,
        name: name || email.split('@')[0],
        picture,
        provider: "google",
        role: "user", // Regular users get 'user' role
        createdAt: new Date().toISOString(),
        isDemo: false // Google users don't get demo data
      };
      
      // Store user
      users.set(email, user);
      console.log("New Google user created:", email);
    } else {
      // Update existing user with Google info
      user.picture = picture;
      user.provider = "google";
      users.set(email, user);
      console.log("Existing user logged in with Google:", email);
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        picture: user.picture,
        role: user.role
      },
      token: jwtToken
    });
  } catch (error) {
    console.error("Google auth error:", error);
    if (error.message && error.message.includes("Token used too early")) {
      res.status(401).json({ error: "Token used too early. Please try again." });
    } else if (error.message && error.message.includes("Invalid token")) {
      res.status(401).json({ error: "Invalid Google token" });
    } else {
      res.status(500).json({ error: "Google authentication failed" });
    }
  }
});

// Check Google OAuth configuration
app.get("/api/auth/google/config", (req, res) => {
  res.json({
    configured: !!googleClient,
    clientId: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 20) + "..." : null,
    message: googleClient ? "Google OAuth is configured" : "Google OAuth is not configured"
  });
});

// Get current user info
app.get("/api/auth/me", authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route example
app.get("/api/user/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user
  });
});

// Restaurant search endpoint (role-based data)
app.get("/api/restaurants/search", authenticateToken, (req, res) => {
  const { query, lat, lng, radius } = req.query;
  
  // Get user to check role
  const user = users.get(req.user.email);
  
  // Only admin users get demo data
  if (user && user.role === "admin") {
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
  } else {
    // Regular users get empty data
    res.json({
      restaurants: [],
      total: 0,
      query: query || "all",
      message: "No restaurants found. Start by adding your restaurant data."
    });
  }
});

// AI Assistant endpoint (role-based)
app.post("/api/ai/chat", authenticateToken, (req, res) => {
  const { message, context } = req.body;
  
  // Get user to check role
  const user = users.get(req.user.email);
  
  if (user && user.role === "admin") {
    // Admin gets demo AI responses
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
  } else {
    // Regular users get basic response
    const basicResponse = {
      response: `Hello! I'm your BiteBase AI assistant. I can help you with restaurant location analysis, market research, and business insights. To get started, please set up your restaurant profile and add your location data.`,
      suggestions: [
        "Set up my restaurant profile",
        "Add location data",
        "Learn about market analysis"
      ],
      timestamp: new Date().toISOString()
    };
    res.json(basicResponse);
  }
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