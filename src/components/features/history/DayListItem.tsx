"use client";

import React from "react";
import { ChevronRight, CheckCircle2, Droplets, Circle } from "lucide-react";
import { formatDisplayDate, isToday, yesterday } from "@/lib/utils/dateUtils";

interface DayListItemProps {
  date: string;
  totalMl: number;
  goalMl: number;
  goalReached: boolean;
  onPress: () => void;
}

export function DayListItem({ date, totalMl, goalMl, goalReached, onPress }: DayListItemProps) {
  const displayDate = isToday(date) ? "Hoje" : date === yesterday() ? "Ontem" : formatDisplayDate(date);
  const progressPct = Math.min(Math.round((totalMl / goalMl) * 100), 100);

  // Explicit color to avoid any Tailwind v4/v3 theme mapping issues
  const hydrationBlue = "#0EA5E9";

  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-4 p-4 transition-colors active:bg-gray-100 dark:active:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0"
    >
      <div className="flex-shrink-0">
        {goalReached ? (
          <CheckCircle2 className="w-6 h-6" style={{ color: hydrationBlue }} />
        ) : totalMl > 0 ? (
          <Droplets className="w-6 h-6" style={{ color: hydrationBlue, opacity: 0.6 }} />
        ) : (
          <Circle className="w-6 h-6 text-gray-200 dark:text-gray-700" />
        )}
      </div>

      <div className="flex-1 text-left">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{displayDate}</span>
          <span className="text-base font-bold text-gray-900 dark:text-white">{totalMl.toLocaleString()} ml</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${progressPct}%`, 
              backgroundColor: hydrationBlue 
            }}
          />
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}
