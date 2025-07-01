# Market Research Dashboard Components

This directory contains comprehensive dashboard components for restaurant market research and business intelligence. All components are designed with professional market analysis standards and include placeholder data that follows industry best practices.

## 🎯 Overview

The dashboard system provides a complete market research platform for cafe and restaurant businesses, covering all essential aspects of market analysis:

- **Revenue Analytics** - Financial performance and profitability analysis
- **Customer Analytics** - Customer behavior, demographics, and retention
- **Market Share Analysis** - Competitive positioning and market penetration
- **Location Intelligence** - Foot traffic, demographics, and location factors
- **Menu Performance** - Item popularity, pricing optimization, and profitability
- **Digital Presence** - Online reputation, social media, and search visibility
- **Forecasting & Trends** - Predictive analytics and market trend analysis
- **ROI & Performance** - Return on investment and operational efficiency

## 📊 Components

### Core Dashboard Components

#### `MarketResearchDashboard.tsx`
The main comprehensive dashboard that integrates all market research components into a unified interface.

**Features:**
- Executive summary with key metrics
- Tabbed interface for different analysis areas
- AI-powered insights and recommendations
- Quick action buttons for common tasks
- Time range filtering across all components

#### `DashboardGrid.tsx`
Foundational grid system and reusable components for consistent dashboard layouts.

**Components:**
- `MetricCard` - Display key performance indicators
- `ChartCard` - Container for charts and visualizations
- `InsightCard` - AI insights and recommendations
- `ActivityItem` - Recent activity and system updates
- `DashboardSection` - Organized content sections

### Specialized Analytics Dashboards

#### `RevenueAnalyticsDashboard.tsx`
Comprehensive financial performance analysis.

**Features:**
- Revenue trends and profit margins
- Revenue breakdown by category (food, beverages, delivery, etc.)
- Payment method analysis
- Top-performing menu items by revenue
- Cost analysis and profitability metrics

**Key Metrics:**
- Total Revenue, Average Order Value, Gross Margin, Net Profit
- Cost of Goods, Operating Expenses
- Payment method distribution and trends

#### `CustomerAnalyticsDashboard.tsx`
Deep customer behavior and demographic analysis.

**Features:**
- Customer growth and retention metrics
- Demographic breakdown (age, gender, location)
- Visit patterns and behavior analysis
- Customer lifetime value analysis
- Top customer identification

**Key Metrics:**
- Total Customers, New Customers, Retention Rate
- Average Visit Frequency, Customer Lifetime Value
- Demographics distribution and behavior patterns

#### `MarketShareDashboard.tsx`
Competitive positioning and market analysis.

**Features:**
- Market share tracking and trends
- Competitor analysis and benchmarking
- Market segment performance
- Geographic market share analysis
- Competitive advantages assessment

**Key Metrics:**
- Market Share, Market Rank, Competitive Index
- Brand Awareness, Market Penetration
- Competitor performance comparison

#### `LocationIntelligenceDashboard.tsx`
Foot traffic and location factor analysis.

**Features:**
- Foot traffic patterns (hourly, daily, weekly)
- Accessibility and location scoring
- Demographic analysis of catchment area
- Nearby amenities and their impact
- Competitor mapping and threat assessment

**Key Metrics:**
- Daily Foot Traffic, Peak Hours, Catchment Radius
- Accessibility Score, Demographic Match
- Competitor density and threat levels

#### `MenuPerformanceDashboard.tsx`
Menu optimization and item performance analysis.

**Features:**
- Top-performing and underperforming items
- Category performance analysis
- Pricing analysis across price ranges
- Menu health scoring
- Optimization recommendations

**Key Metrics:**
- Total Menu Items, Average Item Rating
- Menu Profitability, Top Seller Revenue
- Category performance and pricing analysis

#### `DigitalPresenceDashboard.tsx`
Online reputation and digital marketing analysis.

**Features:**
- Review platform performance
- Social media metrics and engagement
- Search engine rankings and visibility
- Online directory listings
- Recent review monitoring

**Key Metrics:**
- Online Reviews, Average Rating, Social Followers
- Online Visibility, Engagement Rate
- Platform-specific performance metrics

#### `ForecastingDashboard.tsx`
Predictive analytics and trend forecasting.

**Features:**
- Revenue and customer growth projections
- Seasonal trend analysis
- Growth opportunity identification
- Risk assessment and mitigation
- Market trend analysis

**Key Metrics:**
- Revenue Growth Projection, Customer Growth
- Market Expansion Opportunities, Risk Score
- Seasonal performance forecasts

#### `ROIDashboard.tsx`
Return on investment and operational efficiency analysis.

**Features:**
- Investment performance analysis
- Operational efficiency metrics
- Cost optimization opportunities
- Performance benchmarking
- ROI tracking by category

**Key Metrics:**
- Overall ROI, Marketing ROI, Operational Efficiency
- Customer Acquisition Cost, Payback Period
- Cost optimization potential

## 🚀 Usage

### Basic Implementation

```tsx
import { MarketResearchDashboard } from '../components/dashboard'

export default function MarketResearchPage() {
  return (
    <div className="container mx-auto p-6">
      <MarketResearchDashboard />
    </div>
  )
}
```

### Individual Component Usage

```tsx
import { 
  RevenueAnalyticsDashboard,
  CustomerAnalyticsDashboard,
  MarketShareDashboard 
} from '../components/dashboard'

export default function CustomDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  
  return (
    <div className="space-y-8">
      <RevenueAnalyticsDashboard 
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
      <CustomerAnalyticsDashboard 
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
      <MarketShareDashboard 
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    </div>
  )
}
```

## 🎨 Design System

All components follow the established design system:

- **Colors**: Consistent color palette for different data types
- **Typography**: Hierarchical text sizing and weights
- **Spacing**: Consistent padding and margins
- **Icons**: Lucide React icons for consistency
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Full dark mode support

## 📱 Responsive Design

All components are fully responsive and optimized for:
- **Desktop**: Full feature set with detailed views
- **Tablet**: Optimized layouts with touch-friendly controls
- **Mobile**: Simplified views with essential information

## 🔧 Customization

### Time Range Filtering
All dashboard components support time range filtering:
- 7 days, 30 days, 90 days, 1 year
- Consistent interface across all components

### Theming
Components support both light and dark themes through Tailwind CSS classes.

### Data Integration
Components are designed to work with placeholder data but can be easily integrated with real APIs by:
1. Replacing mock data functions with API calls
2. Updating data interfaces to match your API structure
3. Adding loading and error states

## 🧪 Testing

Each component includes:
- TypeScript interfaces for type safety
- Placeholder data for development and testing
- Error handling and loading states
- Responsive design testing

## 📈 Performance

- **Lazy Loading**: Components can be lazy-loaded for better performance
- **Memoization**: React.memo used where appropriate
- **Optimized Rendering**: Efficient re-rendering patterns
- **Bundle Size**: Modular imports to minimize bundle size

## 🔮 Future Enhancements

Planned improvements:
- Real-time data updates via WebSocket
- Advanced filtering and search capabilities
- Export functionality for all charts and data
- Custom dashboard builder
- AI-powered insights and recommendations
- Integration with external analytics platforms

## 📝 Notes

- All data shown is placeholder/mock data for demonstration
- Components are production-ready and follow React best practices
- Fully accessible with proper ARIA labels and keyboard navigation
- Optimized for performance with minimal re-renders
- Comprehensive TypeScript support for type safety
