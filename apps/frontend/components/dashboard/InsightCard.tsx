import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InsightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'positive' | 'neutral' | 'warning' | 'opportunity';
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function InsightCard({
  title,
  description,
  icon: Icon,
  category,
  actionText,
  onAction,
  className,
}: InsightCardProps) {
  const categoryColors = {
    positive: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-500/20 text-green-600',
      action: 'text-green-600 hover:text-green-700'
    },
    neutral: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-500/20 text-blue-600',
      action: 'text-blue-600 hover:text-blue-700'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'bg-amber-500/20 text-amber-600',
      action: 'text-amber-600 hover:text-amber-700'
    },
    opportunity: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-500/20 text-purple-600',
      action: 'text-purple-600 hover:text-purple-700'
    },
  };

  const colors = categoryColors[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group rounded-xl border p-4 shadow-sm transition-all duration-200',
        colors.bg,
        colors.border,
        'hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("rounded-lg p-2 flex-shrink-0", colors.icon)}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          
          {actionText && onAction && (
            <button 
              onClick={onAction}
              className={cn(
                "mt-3 text-sm font-medium flex items-center gap-1",
                colors.action
              )}
            >
              {actionText}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 