import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={`bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md ${className}`} 
      aria-hidden="true"
    />
  );
}
