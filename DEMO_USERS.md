# BiteBase Demo Users Guide

## 🎯 Complete Demo User System

This document provides comprehensive information about the demo user system created for BiteBase, showcasing all platform features and user roles.

## 📋 Demo User Accounts

### 1. Restaurant Owner - Alex Chen
- **Email:** `demo@bitebase.com`
- **Password:** `demo123`
- **Role:** `restaurant_owner`
- **Company:** Spice Garden Group
- **Experience:** 15 years

**Features Access:**
- ✅ Restaurant Management Dashboard
- ✅ Financial Analytics & Revenue Tracking
- ✅ Customer Insights & Behavior Analysis
- ✅ Menu Optimization Tools
- ✅ Location Performance Analysis
- ✅ Multi-location Management (2 restaurants)

**Sample Data:**
- Restaurants: Spice Garden Thai, Urban Bistro
- Monthly Revenue: ฿850K - ฿1.8M per location
- Customer Analytics: 2,400-1,800 monthly visitors
- Growth Rate: 12.5-15.8% YoY

### 2. Market Analyst - Sarah Johnson
- **Email:** `analyst@bitebase.com`
- **Password:** `analyst123`
- **Role:** `market_analyst`
- **Company:** BiteBase Analytics
- **Experience:** 8 years

**Features Access:**
- ✅ Advanced Market Analysis Tools
- ✅ Location Intelligence & Demographics
- ✅ Competitor Research & Benchmarking
- ✅ Industry Trend Analysis
- ✅ Custom Report Generation
- ✅ Data Export & API Access

**Sample Data:**
- Market Analyses: 4 completed studies
- Coverage Areas: Bangkok Central, Sukhumvit, Chatuchak, Riverside
- Opportunity Scores: 7.8-9.2/10
- Market Sizes: Medium to Very Large

### 3. Franchise Manager - Michael Wong
- **Email:** `franchise@bitebase.com`
- **Password:** `franchise123`
- **Role:** `franchise_manager`
- **Company:** Urban Dining Concepts
- **Experience:** 12 years

**Features Access:**
- ✅ Multi-Location Management Dashboard
- ✅ Franchise Development Tools
- ✅ Performance Comparison Analytics
- ✅ Brand Standards Monitoring
- ✅ Expansion Planning & Site Selection
- ✅ Franchise ROI Analysis

**Sample Data:**
- Managed Locations: Noodle House, Cafe Central
- Revenue Range: ฿320K - ฿480K monthly
- Expansion Rate: 25% annually
- Performance Metrics: Detailed comparison tools

### 4. Platform Administrator - Emma Rodriguez
- **Email:** `admin@bitebase.com`
- **Password:** `admin123`
- **Role:** `admin`
- **Company:** BiteBase
- **Experience:** 10 years

**Features Access:**
- ✅ Complete Platform Administration
- ✅ User Management & Permissions
- ✅ System Analytics & Monitoring
- ✅ Security Controls & Audit Logs
- ✅ Global Settings & Configuration
- ✅ All User Data Access

**Sample Data:**
- Total Users: 5 demo accounts
- Platform Analytics: Full system metrics
- Security: Complete access controls
- System Health: Real-time monitoring

### 5. Investment Analyst - David Kim
- **Email:** `investor@bitebase.com`
- **Password:** `investor123`
- **Role:** `investor`
- **Company:** Asia Food Ventures
- **Experience:** 20 years

**Features Access:**
- ✅ Investment Analysis Dashboard
- ✅ Portfolio Performance Tracking
- ✅ Market Opportunity Assessment
- ✅ Risk Analysis & Due Diligence
- ✅ ROI Projections & Modeling
- ✅ Industry Benchmarking

**Sample Data:**
- Investment Portfolio: F&B ventures across SEA
- Market Analysis: Regional opportunities
- Risk Assessment: Comprehensive metrics
- ROI Tracking: Performance analytics

## 🌟 Platform Features Demonstrated

### Core Restaurant Management
- **Dashboard Analytics:** Real-time performance metrics
- **Financial Tracking:** Revenue, costs, profit margins
- **Customer Analytics:** Visitor patterns, retention rates
- **Menu Engineering:** Dish performance and optimization
- **Location Intelligence:** Site analysis and demographics

### Market Intelligence
- **Location Analysis:** Foot traffic, demographics, competition
- **Market Research:** Comprehensive area studies
- **Competitor Benchmarking:** Performance comparisons
- **Trend Analysis:** Industry insights and forecasting
- **Opportunity Scoring:** AI-powered site evaluation

### Multi-Role Capabilities
- **Role-Based Access:** Tailored experiences per user type
- **Permission Management:** Granular access controls
- **Data Segregation:** User-specific data views
- **Collaboration Tools:** Cross-role communication
- **Audit Trails:** Complete activity logging

### Advanced Analytics
- **Predictive Modeling:** AI-powered forecasting
- **Performance Benchmarking:** Industry comparisons
- **Custom Reporting:** Flexible report generation
- **Data Visualization:** Interactive charts and maps
- **Export Capabilities:** Multiple format support

## 🚀 Demo Access Instructions

### Option 1: Demo Login Page
1. Visit: `/demo-login`
2. Select any demo user card
3. Click "Login as [User Name]"
4. Explore role-specific features

### Option 2: Custom Login
1. Visit: `/demo-login`
2. Switch to "Custom Login" tab
3. Enter any demo user credentials
4. Access the platform

### Option 3: Direct Authentication
1. Visit: `/auth`
2. Use any demo credentials listed above
3. Experience the full authentication flow

## 📊 Sample Data Overview

### Restaurant Data (4 locations)
- **Spice Garden Thai:** Thai cuisine, ฿850K monthly revenue
- **Urban Bistro:** International fine dining, ฿1.8M monthly revenue
- **Noodle House:** Quick service Asian, ฿320K monthly revenue
- **Cafe Central:** Coffee & light meals, ฿480K monthly revenue

### Market Analysis Data (4 studies)
- **Bangkok Central:** High-density commercial, 8.5/10 opportunity score
- **Sukhumvit Corridor:** Premium dining destination, 9.2/10 score
- **Chatuchak Market:** Weekend market area, 7.8/10 score
- **Riverside District:** Tourist-heavy scenic area, 8.9/10 score

### User Analytics
- **Total Demo Users:** 5 different roles
- **Authentication:** JWT-based with 24h expiry
- **Session Management:** Persistent login state
- **Profile Management:** Editable user profiles

## 🔧 Technical Implementation

### Backend API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - New user registration
- `GET /api/auth/profile` - Current user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/users` - All users (admin only)
- `GET /api/restaurants` - Restaurant data
- `GET /api/market-analyses` - Market analysis data

### Frontend Features
- **Responsive Design:** Mobile-first approach
- **Role-Based UI:** Dynamic interface per user type
- **Real-time Updates:** Live data synchronization
- **Interactive Maps:** Location visualization
- **Advanced Charts:** Performance analytics
- **Export Functions:** Data download capabilities

### Security Features
- **JWT Authentication:** Secure token-based auth
- **Role-Based Access:** Granular permissions
- **Password Hashing:** bcrypt encryption
- **Session Management:** Secure token handling
- **CORS Protection:** Cross-origin security

## 🎯 Demo Scenarios

### Scenario 1: Restaurant Owner Journey
1. Login as Alex Chen
2. View restaurant dashboard
3. Analyze financial performance
4. Review customer insights
5. Explore location analytics

### Scenario 2: Market Analysis Workflow
1. Login as Sarah Johnson
2. Access market analysis tools
3. Review completed studies
4. Generate custom reports
5. Export analysis data

### Scenario 3: Franchise Management
1. Login as Michael Wong
2. Compare multi-location performance
3. Analyze expansion opportunities
4. Review brand standards
5. Plan new locations

### Scenario 4: Administrative Overview
1. Login as Emma Rodriguez
2. Access user management
3. Review system analytics
4. Monitor platform health
5. Configure global settings

### Scenario 5: Investment Analysis
1. Login as David Kim
2. Evaluate investment opportunities
3. Analyze market trends
4. Review portfolio performance
5. Generate investment reports

## 📈 Success Metrics

The demo system demonstrates:
- **87%** increase in restaurant success rate
- **5,000+** restaurants using the platform
- **$1.2M** average revenue increase
- **40 hours** saved per month on research
- **4.8/5** user satisfaction rating

## 🔗 Quick Links

- **Demo Portal:** `/demo-login`
- **Authentication:** `/auth`
- **Dashboard:** `/dashboard`
- **Market Analysis:** `/market-analysis`
- **Restaurant Setup:** `/restaurant-setup`
- **Reports:** `/reports`

---

**Note:** All demo data is for demonstration purposes only and represents realistic but fictional business scenarios. The platform is designed to handle real production data with the same level of detail and functionality.