'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const toggleId = id || generatedId;

    return (
      <label
        htmlFor={toggleId}
        className={cn(
          'flex items-center justify-between cursor-pointer group',
          className
        )}
      >
        {label && (
          <span className="text-base font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
        <div className="relative inline-flex items-center">
          <input
            id={toggleId}
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </div>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
