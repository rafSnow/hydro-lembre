'use client';

import React from 'react';
import { useStreak } from '@/hooks/useStreak';
import { useStats } from '@/hooks/useStats';
import { StreakCard } from '@/components/features/stats/StreakCard';
import { StatCard } from '@/components/features/stats/StatCard';
import { 
  BarChart3, 
  Calendar, 
  Droplets, 
  CheckCircle2, 
  Trophy, 
  TrendingUp 
} from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils/dateUtils';
import dynamic from 'next/dynamic';

// Carregamento dinâmico do gráfico para evitar bloqueio do carregamento inicial
const DynamicTrendChart = dynamic(
  () => import('@/components/features/stats/TrendChart').then(mod => mod.TrendChart),
  { 
    ssr: false, 
    loading: () => <div className="h-[180px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" /> 
  }
);

export default function EstatisticasPage() {
  const { currentStreak, bestStreak, isLoading: isLoadingStreak } = useStreak();
  const { 
    avg7Days, 
    avg30Days, 
    totalHistoricalLiters, 
    totalDaysTracked, 
    bestDay,
    trendData,
    goalMl,
    isLoading: isLoadingStats 
  } = useStats();

  const isLoading = isLoadingStreak || isLoadingStats;

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        <div className="h-48 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-3xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-3xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-3xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Suas Estatísticas</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Acompanhe sua constância e progresso</p>
      </header>

      <StreakCard currentStreak={currentStreak} bestStreak={bestStreak} />

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={BarChart3} 
          label="Média 7 dias" 
          value={`${avg7Days.toLocaleString('pt-BR')} ml`}
          subtitle="Consumo diário"
          color="primary"
        />
        <StatCard 
          icon={Calendar} 
          label="Média 30 dias" 
          value={`${avg30Days.toLocaleString('pt-BR')} ml`}
          subtitle="Consumo diário"
          color="info"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={Droplets} 
          label="Total histórico" 
          value={`${totalHistoricalLiters.toLocaleString('pt-BR')} L`}
          subtitle="Água ingerida"
          color="success"
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Dias ativos" 
          value={totalDaysTracked}
          subtitle="Monitorados"
          color="warning"
        />
      </div>

      {bestDay && (
        <StatCard 
          icon={Trophy} 
          label="Melhor dia" 
          value={`${bestDay.totalMl.toLocaleString('pt-BR')} ml`}
          subtitle={`Em ${formatDisplayDate(bestDay.date)}`}
          color="warning"
        />
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tendência</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
            Consumo nos últimos 30 dias
          </h3>
          
          {trendData.length >= 3 ? (
            <DynamicTrendChart data={trendData} goalMl={goalMl} />
          ) : (
            <div className="h-[180px] flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Droplets className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Registre por pelo menos 3 dias para ver sua tendência de consumo.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
