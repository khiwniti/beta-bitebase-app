"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Button } from "@bitebase/ui"
import { cn } from '../../lib/utils'

import {
  Database,
  Wifi,
  AlertCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  BarChart3,
  MapPin,
  Users,
  DollarSign,
  Package,
  FileText,
  Clock,
  BarChart2,
  LineChart,
  Table,
  PieChart,
  PackageOpen
} from 'lucide-react'

// Simple skeleton component for loading states
const Skeleton = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    {...props}
  />
)

interface DataPlaceholderProps {
  type?: 'loading' | 'empty' | 'error' | 'no-connection'
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

interface MetricPlaceholderProps {
  title: string
  icon?: React.ReactNode
  loading?: boolean
  className?: string
}

interface ChartPlaceholderProps {
  title: string
  height?: number
  loading?: boolean
  className?: string
}

interface TablePlaceholderProps {
  columns: string[]
  rows?: number
  loading?: boolean
  className?: string
}

interface PlaceholderProps {
  height?: string | number;
  className?: string;
  message?: string;
  subMessage?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function DataPlaceholder({
  height = 300,
  className,
  message = "No data available",
  subMessage = "Connect data sources to see information here",
  icon = <PackageOpen className="h-12 w-12" />,
  actionLabel,
  onAction
}: PlaceholderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-lg text-center",
        className
      )}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className="text-gray-400 mb-3">
        {icon}
      </div>
      <h4 className="text-gray-700 font-medium mb-1">{message}</h4>
      <p className="text-gray-500 text-sm max-w-md">{subMessage}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function MetricPlaceholder({ 
  className,
  title = "No metric data",
  height = 120
}: {
  className?: string;
  title?: string;
  height?: number | string;
}) {
  return (
    <div className={cn(
      "rounded-lg border bg-white p-6 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-600">{title}</div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-gray-100 rounded animate-pulse mt-2"></div>
      </div>
    </div>
  );
}

export function ChartPlaceholder({
  className,
  title = "Chart placeholder",
  chartType = "line",
  height = 300
}: {
  className?: string;
  title?: string;
  chartType?: "line" | "bar" | "pie";
  height?: number | string;
}) {
  const getIcon = () => {
    switch (chartType) {
      case "bar": return <BarChart2 className="h-12 w-12" />;
      case "pie": return <PieChart className="h-12 w-12" />;
      default: return <LineChart className="h-12 w-12" />;
    }
  };

  return (
    <div className={cn(
      "rounded-lg border bg-white shadow-sm overflow-hidden",
      className
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">No chart data available</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <DataPlaceholder
          height={height}
          icon={getIcon()}
          message={`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart data unavailable`}
          subMessage="Connect your data source to view this visualization"
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}

export function TablePlaceholder({
  className,
  title = "Table placeholder", 
  columns = 4,
  rows = 3,
  height = 300
}: {
  className?: string;
  title?: string;
  columns?: number;
  rows?: number;
  height?: number | string;
}) {
  return (
    <div className={cn(
      "rounded-lg border bg-white shadow-sm overflow-hidden",
      className
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">No table data available</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <DataPlaceholder
          height={height}
          icon={<Table className="h-12 w-12" />}
          message="Table data unavailable"
          subMessage="Connect your data source to populate this table"
          className="bg-gray-50"
        />
      </div>
    </div>
  );
}

export function ListPlaceholder({
  title,
  items = 5,
  loading = false,
  className = ''
}: {
  title: string
  items?: number
  loading?: boolean
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: items }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: items }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-400">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">No data available</div>
                  <div className="text-xs">--</div>
                </div>
              </div>
            ))
          )}
        </div>
        {!loading && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Connect your data source to see items here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Quick access to common placeholder types
export const PlaceholderTypes = {
  Loading: (props: Omit<DataPlaceholderProps, 'type'>) => <DataPlaceholder type="loading" {...props} />,
  Empty: (props: Omit<DataPlaceholderProps, 'type'>) => <DataPlaceholder type="empty" {...props} />,
  Error: (props: Omit<DataPlaceholderProps, 'type'>) => <DataPlaceholder type="error" {...props} />,
  NoConnection: (props: Omit<DataPlaceholderProps, 'type'>) => <DataPlaceholder type="no-connection" {...props} />
}

export default DataPlaceholder;
