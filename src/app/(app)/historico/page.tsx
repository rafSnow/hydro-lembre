"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { subDays } from "date-fns";
import { toDateString } from "@/lib/utils/dateUtils";
import { useHistory } from "@/hooks/useHistory";
import { PeriodSelector, type Period } from "@/components/features/history/PeriodSelector";
import { HistoryStats } from "@/components/features/history/HistoryStats";
import { DayListItem } from "@/components/features/history/DayListItem";
import { AppShell } from "@/components/layout/AppShell";
import dynamic from "next/dynamic";

const DynamicHydrationChart = dynamic(
  () => import("@/components/features/history/HydrationChart").then(mod => mod.HydrationChart),
  { 
    ssr: false, 
    loading: () => <div className="h-[200px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl mb-6" /> 
  }
);

export default function HistoryPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("7d");
  const [dateRange, setDateRange] = useState({
    from: toDateString(subDays(new Date(), 6)),
    to: toDateString(new Date()),
  });

  const { dailyData, periodAverage, daysWithGoal, totalConsumed, isLoading } = useHistory(dateRange);

  const handlePeriodChange = (newPeriod: Period, from: string, to: string) => {
    setPeriod(newPeriod);
    setDateRange({ from, to });
  };

  const handleDayClick = (date: string) => {
    router.push(`/historico/${date}`);
  };

  return (
    <AppShell title="Histórico">
      <div className="p-4 pb-20">
        <PeriodSelector value={period} onChange={handlePeriodChange} />
        
        <HistoryStats 
          periodAverage={periodAverage} 
          daysWithGoal={daysWithGoal} 
          totalConsumed={totalConsumed} 
        />

        <DynamicHydrationChart data={dailyData} goalMl={dailyData[0]?.goalMl ?? 2000} />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Registros por dia</h2>
          <span className="text-xs text-gray-500">{dailyData.length} dias</span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : dailyData.length > 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {dailyData.map((day) => (
              <DayListItem
                key={day.date}
                date={day.date}
                totalMl={day.totalMl}
                goalMl={day.goalMl}
                goalReached={day.goalReached}
                onPress={() => handleDayClick(day.date)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🥤</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhum registro</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[240px]">
              Não encontramos nenhum registro de hidratação neste período.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
