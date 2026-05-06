'use client';

import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '@/contexts/ThemeContext';

interface TrendChartProps {
  data: Array<{ date: string; totalMl: number }>;
  goalMl: number;
}

const formatXAxis = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), 'dd/MM', { locale: ptBR });
  } catch {
    return dateStr;
  }
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    payload: {
      date: string;
      totalMl: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 shadow-lg rounded-xl border border-slate-100 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          {formatXAxis(data.date)}
        </p>
        <p className="text-sm font-bold text-sky-500">
          {Number(payload[0].value).toLocaleString('pt-BR')} ml
        </p>
      </div>
    );
  }
  return null;
};

export function TrendChart({ data, goalMl }: TrendChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const axisColor = isDark ? '#94A3B8' : '#64748B';
  const primaryColor = '#0EA5E9';

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={isDark ? 0.4 : 0.3} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis} 
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: primaryColor, strokeWidth: 1 }} />
          <ReferenceLine 
            y={goalMl} 
            stroke={isDark ? "#38BDF8" : "#94A3B8"} 
            strokeDasharray="3 3" 
            strokeOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="totalMl"
            stroke={primaryColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTotal)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
