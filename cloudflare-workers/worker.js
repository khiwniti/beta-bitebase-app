// BiteBase API - Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Routes
    if (path === '/') {
      return new Response(JSON.stringify({
        message: "BiteBase API is running on Cloudflare Workers!",
        version: "1.0.0",
        docs: "/docs"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/health') {
      return new Response(JSON.stringify({
        status: "healthy",
        service: "bitebase-api-workers",
        version: "1.0.0",
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/manifest.json') {
      return new Response(JSON.stringify({
        name: "BiteBase",
        short_name: "BiteBase",
        description: "Restaurant Management System",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/restaurants') {
      const restaurants = {
        restaurants: [
          {
            id: 1,
            name: "Bella Italia",
            cuisine: "Italian",
            rating: 4.5,
            location: "Downtown",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"
          },
          {
            id: 2,
            name: "Burger Palace",
            cuisine: "American",
            rating: 4.2,
            location: "Mall District",
            image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400"
          },
          {
            id: 3,
            name: "Sushi Zen",
            cuisine: "Japanese",
            rating: 4.8,
            location: "City Center",
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
          }
        ]
      };
      return new Response(JSON.stringify(restaurants), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/restaurants/')) {
      const id = parseInt(path.split('/')[3]);
      const restaurants = {
        1: {
          id: 1,
          name: "Bella Italia",
          cuisine: "Italian",
          rating: 4.5,
          location: "Downtown",
          description: "Authentic Italian cuisine in the heart of downtown",
          menu: [
            { id: 1, name: "Pizza Margherita", price: 12.99, category: "Pizza" },
            { id: 2, name: "Pasta Carbonara", price: 14.99, category: "Pasta" },
            { id: 3, name: "Tiramisu", price: 6.99, category: "Dessert" }
          ]
        },
        2: {
          id: 2,
          name: "Burger Palace",
          cuisine: "American",
          rating: 4.2,
          location: "Mall District",
          description: "Gourmet burgers and classic American fare",
          menu: [
            { id: 4, name: "Classic Burger", price: 9.99, category: "Burgers" },
            { id: 5, name: "Deluxe Burger", price: 12.99, category: "Burgers" },
            { id: 6, name: "Fries", price: 4.99, category: "Sides" }
          ]
        },
        3: {
          id: 3,
          name: "Sushi Zen",
          cuisine: "Japanese",
          rating: 4.8,
          location: "City Center",
          description: "Fresh sushi and traditional Japanese dishes",
          menu: [
            { id: 7, name: "Salmon Roll", price: 8.99, category: "Sushi" },
            { id: 8, name: "Tuna Sashimi", price: 12.99, category: "Sashimi" },
            { id: 9, name: "Miso Soup", price: 3.99, category: "Soup" }
          ]
        }
      };

      const restaurant = restaurants[id];
      if (restaurant) {
        return new Response(JSON.stringify(restaurant), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ error: "Restaurant not found" }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (path === '/api/menu') {
      const menu = {
        menu: [
          { id: 1, name: "Pizza Margherita", price: 12.99, category: "Pizza", restaurant: "Bella Italia" },
          { id: 2, name: "Pasta Carbonara", price: 14.99, category: "Pasta", restaurant: "Bella Italia" },
          { id: 3, name: "Tiramisu", price: 6.99, category: "Dessert", restaurant: "Bella Italia" },
          { id: 4, name: "Classic Burger", price: 9.99, category: "Burgers", restaurant: "Burger Palace" },
          { id: 5, name: "Deluxe Burger", price: 12.99, category: "Burgers", restaurant: "Burger Palace" },
          { id: 6, name: "Fries", price: 4.99, category: "Sides", restaurant: "Burger Palace" },
          { id: 7, name: "Salmon Roll", price: 8.99, category: "Sushi", restaurant: "Sushi Zen" },
          { id: 8, name: "Tuna Sashimi", price: 12.99, category: "Sashimi", restaurant: "Sushi Zen" },
          { id: 9, name: "Miso Soup", price: 3.99, category: "Soup", restaurant: "Sushi Zen" }
        ]
      };
      return new Response(JSON.stringify(menu), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Auth endpoints
    if (path === '/api/auth/register' && request.method === 'POST') {
      return new Response(JSON.stringify({
        message: "Registration successful",
        status: "success",
        user: { id: 1, email: "user@example.com" }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/auth/login' && request.method === 'POST') {
      return new Response(JSON.stringify({
        message: "Login successful",
        status: "success",
        token: "jwt-token-here"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Page endpoints
    if (path === '/privacy') {
      return new Response(JSON.stringify({
        page: "privacy",
        title: "Privacy Policy",
        content: "Your privacy is important to us..."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/terms') {
      return new Response(JSON.stringify({
        page: "terms",
        title: "Terms of Service",
        content: "By using our service, you agree to..."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/reset-password') {
      return new Response(JSON.stringify({
        page: "reset-password",
        title: "Reset Password",
        content: "Enter your email to reset password"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // API Documentation
    if (path === '/docs') {
      const docs = `
<!DOCTYPE html>
<html>
<head>
    <title>BiteBase API Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .method { color: #fff; padding: 3px 8px; border-radius: 3px; font-weight: bold; }
        .get { background: #61affe; }
        .post { background: #49cc90; }
        code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🍽️ BiteBase API Documentation</h1>
    <p>RESTful API for restaurant management system</p>
    
    <div class="endpoint">
        <span class="method get">GET</span> <code>/health</code>
        <p>Health check endpoint</p>
    </div>
    
    <div class="endpoint">
        <span class="method get">GET</span> <code>/api/restaurants</code>
        <p>Get list of all restaurants</p>
    </div>
    
    <div class="endpoint">
        <span class="method get">GET</span> <code>/api/restaurants/{id}</code>
        <p>Get specific restaurant details with menu</p>
    </div>
    
    <div class="endpoint">
        <span class="method get">GET</span> <code>/api/menu</code>
        <p>Get all menu items from all restaurants</p>
    </div>
    
    <div class="endpoint">
        <span class="method post">POST</span> <code>/api/auth/login</code>
        <p>User authentication</p>
    </div>
    
    <div class="endpoint">
        <span class="method post">POST</span> <code>/api/auth/register</code>
        <p>User registration</p>
    </div>
</body>
</html>`;
      return new Response(docs, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  },
};