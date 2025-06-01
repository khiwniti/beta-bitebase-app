import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number | null;
  change?: number | null;
  period?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  loading?: boolean;
  formatter?: (value: number) => string;
}

export function MetricCard({
  title,
  value,
  change,
  period,
  icon,
  className,
  variant = 'default',
  loading = false,
  formatter = (val) => val.toString()
}: MetricCardProps) {
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;
  const formattedValue = value !== null && typeof value === 'number' ? formatter(value) : value;
  
  return (
    <div className={cn(
      "rounded-lg border bg-white shadow-sm hover:shadow-md transition-all duration-300",
      variant === 'ghost' && 'border-transparent bg-transparent shadow-none',
      variant === 'outline' && 'bg-transparent',
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <div className="text-gray-400">{icon}</div>}
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
        </div>
        <div className="mt-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded-md animate-pulse w-2/3"></div>
              <div className="h-4 bg-gray-100 rounded-md animate-pulse w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formattedValue ?? '--'}
              </div>
              {(change !== undefined && change !== null) && (
                <div className="flex items-center text-sm">
                  {isPositiveChange ? (
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+{Math.abs(change).toFixed(1)}%</span>
                    </div>
                  ) : isNegativeChange ? (
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      <span>-{Math.abs(change).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Minus className="w-4 h-4 mr-1" />
                      <span>0%</span>
                    </div>
                  )}
                  {period && (
                    <span className="text-gray-500 ml-1">{period}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
