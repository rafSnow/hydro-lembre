'use client';

import React from 'react';

interface HydrationRingProps {
  totalMl: number;
  goalMl: number;
  progressPct: number;
  goalReached: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HydrationRing: React.FC<HydrationRingProps> = ({
  totalMl,
  goalMl,
  progressPct,
  goalReached,
  size = 'md',
}) => {
  const sizes = {
    sm: { box: 120, stroke: 8, fontMain: 'text-2xl', fontSub: 'text-xs' },
    md: { box: 240, stroke: 16, fontMain: 'text-5xl', fontSub: 'text-sm' },
    lg: { box: 300, stroke: 20, fontMain: 'text-6xl', fontSub: 'text-base' },
  };

  const { box, stroke, fontMain, fontSub } = sizes[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPct / 100) * circumference;

  const getRingColor = () => {
    // Both goalReached and in-progress now use the same primary blue for consistency
    if (goalReached || progressPct > 0) return 'text-primary';
    return 'text-slate-200 dark:text-slate-800';
  };

  return (
    <div 
      className="flex flex-col items-center justify-center relative"
      aria-label={`${totalMl} ml de ${goalMl} ml consumidos hoje`}
      role="progressbar"
      aria-valuenow={progressPct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        className="transform -rotate-90"
      >
        {/* Background Ring */}
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-slate-100 dark:text-slate-900"
        />
        {/* Progress Ring */}
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease',
          }}
          strokeLinecap="round"
          className={getRingColor()}
        />
      </svg>

      {/* Center Text */}
      <div className={`absolute flex flex-col items-center justify-center text-center ${goalReached ? 'animate-bounce' : ''}`}>
        <span className={`${fontMain} font-black text-slate-900 dark:text-white transition-all`}>
          {progressPct}%
        </span>
        <span className={`${fontSub} font-medium text-slate-500 dark:text-slate-400`}>
          {totalMl.toLocaleString()} / {goalMl.toLocaleString()} ml
        </span>
      </div>
      
      {goalReached && (
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse -z-10" />
      )}
    </div>
  );
};
