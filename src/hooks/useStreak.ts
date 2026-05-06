'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { recordRepository } from '@/lib/db/repositories/recordRepository';
import { goalRepository } from '@/lib/db/repositories/goalRepository';
import { streakRepository } from '@/lib/db/repositories/streakRepository';
import { profileRepository } from '@/lib/db/repositories/profileRepository';
import { calculateStreak } from '@/lib/utils/hydrationUtils';
import { today, getDaysInRange } from '@/lib/utils/dateUtils';

/**
 * Hook para gerenciar e calcular as sequências (streaks) do usuário.
 */
export function useStreak() {
  const streakInfo = useLiveQuery(async () => {
    const profile = await profileRepository.getProfile();
    const firstDate = await recordRepository.getFirstRecordDate();
    
    if (!profile || !firstDate) {
      return { current: 0, best: 0 };
    }

    const todayDate = today();
    // Busca todos os totais e metas para calcular o streak histórico
    const totals = await recordRepository.getTotalsByPeriod(firstDate, todayDate);
    const customGoals = await goalRepository.getGoalsForPeriod(firstDate, todayDate);
    
    const allDays = getDaysInRange(firstDate, todayDate);
    const dailyStatus = allDays.map(date => {
      const total = totals[date] || 0;
      const goal = customGoals[date] ?? profile.daily_goal_ml;
      return {
        date,
        goalReached: total >= goal
      };
    });

    return calculateStreak(dailyStatus);
  }, []);

  // Atualiza o cache na tabela streaks quando o cálculo muda
  useEffect(() => {
    if (streakInfo) {
      streakRepository.updateStreakCache({
        current_streak: streakInfo.current,
        best_streak: streakInfo.best,
        last_date: today(),
      });
    }
  }, [streakInfo]);

  return {
    currentStreak: streakInfo?.current ?? 0,
    bestStreak: streakInfo?.best ?? 0,
    isLoading: streakInfo === undefined,
  };
}
