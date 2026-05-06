"use client";

import React from "react";

interface HistoryStatsProps {
  periodAverage: number;
  daysWithGoal: number;
  totalConsumed: number;
}

export function HistoryStats({ periodAverage, daysWithGoal, totalConsumed }: HistoryStatsProps) {
  const stats = [
    {
      label: "Média diária",
      value: `${periodAverage.toLocaleString()} ml`,
      color: "text-primary",
    },
    {
      label: "Dias com meta",
      value: daysWithGoal,
      color: "text-success",
    },
    {
      label: "Total no período",
      value: `${(totalConsumed / 1000).toFixed(1)} L`,
      color: "text-primary-dark",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-center"
        >
          <span className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {stat.label}
          </span>
          <span className={`block text-sm font-bold ${stat.color}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
