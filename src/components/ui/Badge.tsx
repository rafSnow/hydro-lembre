'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    primary: 'bg-primary/10 text-primary-dark dark:bg-primary/20 dark:text-primary',
    success: 'bg-success/10 text-green-700 dark:bg-success/20 dark:text-success',
    warning: 'bg-warning/10 text-amber-700 dark:bg-warning/20 dark:text-warning',
    gray: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
