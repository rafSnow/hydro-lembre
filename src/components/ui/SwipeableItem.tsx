'use client';

import React, { useState, useRef } from 'react';

interface SwipeableItemProps {
  children: React.ReactNode;
  actions: React.ReactNode;
  threshold?: number;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  actions,
  threshold = 80,
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null || !isSwiping) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // Only allow swiping to the left
    if (diff < 0) {
      setOffset(Math.max(diff, -threshold * 1.5));
    } else {
      setOffset(Math.min(diff, 10)); // Slight resistance to right swipe
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (offset < -threshold / 2) {
      setOffset(-threshold);
    } else {
      setOffset(0);
    }
    setStartX(null);
  };

  return (
    <div className="relative overflow-hidden touch-pan-y">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-end items-center bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <div className="flex items-center h-full px-4">{actions}</div>
      </div>

      {/* Foreground Content */}
      <div
        ref={itemRef}
        className="relative transition-transform duration-200 ease-out bg-white dark:bg-slate-900 rounded-2xl"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};
