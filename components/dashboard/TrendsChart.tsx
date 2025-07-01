import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DataPoint {
  date: string;
  value: number;
}

interface TrendsDataset {
  id: string;
  label: string;
  data: DataPoint[];
  color: string;
  dashed?: boolean;
  fill?: boolean;
}

interface TrendsChartProps {
  title?: string;
  datasets: TrendsDataset[];
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  loading?: boolean;
  onTimeRangeChange?: (range: 'day' | 'week' | 'month' | 'quarter' | 'year') => void;
  height?: number;
  className?: string;
}

export default function TrendsChart({
  title = 'Trends',
  datasets,
  timeRange = 'month',
  loading = false,
  onTimeRangeChange,
  height = 300,
  className = '',
}: TrendsChartProps) {
  const [activeDatasets, setActiveDatasets] = useState<string[]>(datasets.map(d => d.id));
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Format dates based on time range
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    switch (timeRange) {
      case 'day':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return date.toLocaleDateString([], { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      case 'quarter':
        return date.toLocaleDateString([], { month: 'short' });
      case 'year':
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString();
    }
  };

  // Toggle dataset visibility
  const toggleDataset = (datasetId: string) => {
    setActiveDatasets(prev => {
      if (prev.includes(datasetId)) {
        return prev.filter(id => id !== datasetId);
      } else {
        return [...prev, datasetId];
      }
    });
  };

  // Prepare data for Chart.js
  const chartData = {
    labels: datasets.length > 0 && datasets[0].data.length > 0
      ? datasets[0].data.map(d => formatDate(d.date))
      : [],
    datasets: datasets
      .filter(dataset => activeDatasets.includes(dataset.id))
      .map(dataset => ({
        label: dataset.label,
        data: dataset.data.map(d => d.value),
        borderColor: dataset.color,
        backgroundColor: dataset.fill ? `${dataset.color}20` : 'transparent',
        borderWidth: 2,
        borderDash: dataset.dashed ? [5, 5] : [],
        pointBackgroundColor: dataset.color,
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: dataset.fill,
      })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#64748b',
        bodyColor: '#1e293b',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        bodyFont: {
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 10,
          },
          callback: function(value: any) {
            return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
      {/* Chart Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-gray-500" />
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center">
          <div className="relative inline-flex rounded-md border border-gray-200">
            <button
              onClick={() => onTimeRangeChange && onTimeRangeChange('day')}
              className={cn(
                "px-3 py-1.5 text-xs rounded-l-md",
                timeRange === 'day'
                  ? "bg-gray-100 text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Day
            </button>
            <button
              onClick={() => onTimeRangeChange && onTimeRangeChange('week')}
              className={cn(
                "px-3 py-1.5 text-xs",
                timeRange === 'week'
                  ? "bg-gray-100 text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Week
            </button>
            <button
              onClick={() => onTimeRangeChange && onTimeRangeChange('month')}
              className={cn(
                "px-3 py-1.5 text-xs",
                timeRange === 'month'
                  ? "bg-gray-100 text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Month
            </button>
            <button
              onClick={() => onTimeRangeChange && onTimeRangeChange('year')}
              className={cn(
                "px-3 py-1.5 text-xs rounded-r-md",
                timeRange === 'year'
                  ? "bg-gray-100 text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div ref={chartContainerRef} style={{ height: `${height}px`, position: 'relative' }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-green-600 mb-2"></div>
              <span className="text-sm text-gray-600">Loading data...</span>
            </div>
          </div>
        ) : datasets.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 size={24} className="mx-auto mb-2" />
              <p>No data available</p>
            </div>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-3">
          {datasets.map(dataset => (
            <button
              key={dataset.id}
              onClick={() => toggleDataset(dataset.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all",
                activeDatasets.includes(dataset.id)
                  ? "bg-gray-100 font-medium"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <span
                className="block w-3 h-3 rounded-full"
                style={{ backgroundColor: dataset.color }}
              />
              {dataset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}