'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { recordRepository } from '@/lib/db/repositories/recordRepository';
import { profileRepository } from '@/lib/db/repositories/profileRepository';
import { getLast7Days, getLast30Days, today, getDaysInRange } from '@/lib/utils/dateUtils';
import { calculateAverage } from '@/lib/utils/hydrationUtils';

/**
 * Hook para buscar e agregar estatísticas de consumo de água.
 */
export function useStats() {
  const stats = useLiveQuery(async () => {
    const profile = await profileRepository.getProfile();
    const firstDate = await recordRepository.getFirstRecordDate();

    if (!profile) return null;

    const last7 = getLast7Days();
    const last30 = getLast30Days();
    
    const totals7 = await recordRepository.getTotalsByPeriod(last7[0], last7[6]);
    const totals30 = await recordRepository.getTotalsByPeriod(last30[0], last30[29]);
    
    // Média dos últimos 7 e 30 dias
    const avg7Days = calculateAverage(last7.map(date => ({ totalMl: totals7[date] || 0 })), 7);
    const avg30Days = calculateAverage(last30.map(date => ({ totalMl: totals30[date] || 0 })), 30);

    // Total histórico em litros
    const allRecords = await recordRepository.getAllRecords();
    const totalMl = allRecords.reduce((acc, r) => acc + r.volume_ml, 0);
    const totalHistoricalLiters = Number((totalMl / 1000).toFixed(1));

    // Total de dias monitorados
    let totalDaysTracked = 0;
    if (firstDate) {
      const days = getDaysInRange(firstDate, today());
      totalDaysTracked = days.length;
    }

    // Melhor dia histórico
    const allTotals = await recordRepository.getTotalsByPeriod(firstDate || today(), today());
    let bestDay = null;
    let maxMl = 0;
    
    for (const [date, total] of Object.entries(allTotals)) {
      if (total > maxMl) {
        maxMl = total;
        bestDay = { date, totalMl: total };
      }
    }

    // Dados para o gráfico de tendência (últimos 30 dias)
    const trendData = last30.map(date => ({
      date,
      totalMl: totals30[date] || 0
    }));

    return {
      avg7Days,
      avg30Days,
      totalHistoricalLiters,
      totalDaysTracked,
      bestDay,
      trendData,
      goalMl: profile.daily_goal_ml
    };
  }, []);

  return {
    avg7Days: stats?.avg7Days ?? 0,
    avg30Days: stats?.avg30Days ?? 0,
    totalHistoricalLiters: stats?.totalHistoricalLiters ?? 0,
    totalDaysTracked: stats?.totalDaysTracked ?? 0,
    bestDay: stats?.bestDay ?? null,
    trendData: stats?.trendData ?? [],
    goalMl: stats?.goalMl ?? 2000,
    isLoading: stats === undefined,
  };
}
