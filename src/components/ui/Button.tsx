'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none',
      secondary: 'bg-surface-light text-primary-dark hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-400 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none',
      ghost: 'bg-transparent text-primary hover:bg-surface-light dark:hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none',
      destructive: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none',
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-6 py-3 text-base font-semibold rounded-xl',
      lg: 'px-8 py-4 text-lg font-bold rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
