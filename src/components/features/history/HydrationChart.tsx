"use client";

import React, { useEffect, useState } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  Cell, 
  CartesianGrid 
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseDate } from "@/lib/utils/dateUtils";
import type { DailyData } from "@/hooks/useHistory";
import { useTheme } from "@/contexts/ThemeContext";

interface HydrationChartProps {
  data: DailyData[];
  goalMl: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DailyData;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DailyData;
    const date = parseDate(data.date);
    const formattedDate = format(date, "dd/MM", { locale: ptBR });
    
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-lg text-xs">
        <p className="font-bold mb-1">{formattedDate}</p>
        <p className="text-primary-dark dark:text-primary font-medium">
          {data.totalMl} ml / {data.goalMl} ml
        </p>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {data.goalReached ? "✅ Meta atingida" : "💧 Em progresso"}
        </p>
      </div>
    );
  }
  return null;
};

export function HydrationChart({ data, goalMl }: HydrationChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure Recharts only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[200px] w-full bg-surface-light dark:bg-surface-dark animate-pulse rounded-xl mb-6" />;
  }

  const isDark = resolvedTheme === "dark";

  // We need the data in chronological order for the chart
  const chartData = [...data].reverse();

  // Scrollable wrapper if many days
  const isScrollable = chartData.length > 14;

  // Colors based on theme
  const primaryColor = "#0EA5E9"; // sky-500
  const reachedColor = primaryColor;
  const pendingColor = isDark ? "#1E293B" : "#E2E8F0"; // Slate-800 in dark, Slate-200 in light
  const gridColor = isDark ? "#334155" : "#CBD5E1"; // slate-700 in dark, slate-300 in light
  const axisColor = isDark ? "#94A3B8" : "#64748B"; // slate-400 in dark, slate-500 in light

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-800 transition-colors">
      <div className={`${isScrollable ? "overflow-x-auto" : ""}`}>
        <div style={{ minWidth: isScrollable ? `${chartData.length * 40}px` : "100%", height: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis
                dataKey="date"
                tickFormatter={(dateStr) => format(parseDate(dateStr), "dd/MM")}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: axisColor }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: axisColor }} 
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: isDark ? "#0EA5E910" : "#0EA5E905" }} 
              />
              <ReferenceLine 
                y={goalMl} 
                stroke={isDark ? "#38BDF8" : "#0284C7"} 
                strokeDasharray="3 3" 
                strokeOpacity={0.6}
              />
              <Bar dataKey="totalMl" radius={[4, 4, 0, 0]} barSize={20} fill={primaryColor}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.goalReached ? reachedColor : pendingColor}
                    stroke={!entry.goalReached ? (isDark ? "#334155" : "#CBD5E1") : "none"}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
