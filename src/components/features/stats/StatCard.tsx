'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
}

export function StatCard({ icon: Icon, label, value, subtitle, color = 'primary' }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const colorClasses = {
    primary: 'text-sky-500 bg-sky-50 dark:bg-sky-900/20',
    success: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    info: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
  };

  return (
    <div 
      ref={cardRef}
      className={`bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {label}
        </span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </span>
        {subtitle && (
          <span className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
