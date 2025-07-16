// Dashboard Components Export
export { default as BusinessIntelligenceHub } from './BusinessIntelligenceHub'
export { default as InsightCard } from './InsightCard'
export { default as InsightsDashboard } from './InsightsDashboard'
export { default as RestaurantMap } from './RestaurantMap'
export { default as TrendsChart } from './TrendsChart'

// New Market Research Dashboard Components
export { default as RevenueAnalyticsDashboard } from './RevenueAnalyticsDashboard'
export { default as CustomerAnalyticsDashboard } from './CustomerAnalyticsDashboard'
export { default as MarketShareDashboard } from './MarketShareDashboard'
export { default as LocationIntelligenceDashboard } from './LocationIntelligenceDashboard'
export { default as MenuPerformanceDashboard } from './MenuPerformanceDashboard'
export { default as DigitalPresenceDashboard } from './DigitalPresenceDashboard'
export { default as ForecastingDashboard } from './ForecastingDashboard'
export { default as ROIDashboard } from './ROIDashboard'
export { default as MarketResearchDashboard } from './MarketResearchDashboard'

// Enhanced Dashboard Components (Frontend-focused)
export { default as EnhancedMetricCard } from './EnhancedMetricCard'
export { default as ChartWidget } from './ChartWidget'
export { default as KPIDashboard } from './KPIDashboard'
export { default as DataTable } from './DataTable'
export { default as EnhancedInsightCard, InsightsGrid } from './EnhancedInsightCard'
export { default as ActivityFeed } from './ActivityFeed'
export { default as StatisticsOverview } from './StatisticsOverview'
export { default as RealtimeWidget } from './RealtimeWidget'
export { default as ComparisonChart } from './ComparisonChart'

// Re-export commonly used components from DashboardGrid
export {
  MetricCard,
  ChartCard,
  DashboardInsightCard,
  ActivityItem,
  DashboardSection,
  DashboardGrid
} from './DashboardGrid'

// Export types for better TypeScript support
export type { 
  InsightType, 
  InsightPriority, 
  InsightCategory, 
  Insight, 
  InsightAction 
} from './EnhancedInsightCard'

export type { 
  ActivityType, 
  ActivityPriority, 
  ActivityStatus, 
  ActivityItem as ActivityItemType 
} from './ActivityFeed'

export type { 
  ChartType, 
  ChartDataPoint, 
  ChartSeries 
} from './ChartWidget'

export type { 
  StatisticItem 
} from './StatisticsOverview'

export type { 
  RealtimeDataPoint 
} from './RealtimeWidget'

export type { 
  ComparisonDataPoint 
} from './ComparisonChart'

export type { 
  Column 
} from './DataTable'
