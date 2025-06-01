import React from 'react';
import { cn } from '../../lib/utils';

interface AnalysisCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AnalysisCard({
  title,
  description,
  className,
  children,
  footer
}: AnalysisCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-white shadow-sm hover:shadow transition-all duration-300",
      className
    )}>
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="p-6 pt-0">
        {children}
      </div>
      {footer && (
        <div className="p-6 pt-0 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}

export default AnalysisCard; 