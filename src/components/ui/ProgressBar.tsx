'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPct?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  showPct = true,
  className = '' 
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPct) && (
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          {showPct && <span>{safeProgress}%</span>}
        </div>
      )}
      <div 
        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={safeProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
