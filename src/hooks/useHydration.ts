'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { recordRepository } from '@/lib/db/repositories/recordRepository';
import { profileRepository } from '@/lib/db/repositories/profileRepository';
import { today, toDateString } from '@/lib/utils/dateUtils';
import { useState, useEffect, useCallback } from 'react';

export function useHydration() {
  const todayRecords = useLiveQuery(() => recordRepository.getTodayRecords(), []);
  const profile = useLiveQuery(() => profileRepository.getProfile(), []);

  // Estado para detectar rollover de dia (virada de meia-noite)
  const [currentDate, setCurrentDate] = useState(today());

  const checkDayRollover = useCallback(() => {
    const now = today();
    if (now !== currentDate) {
      setCurrentDate(now);
      return true;
    }
    return false;
  }, [currentDate]);

  // Verificar rollover a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      checkDayRollover();
    }, 60000);
    return () => clearInterval(interval);
  }, [checkDayRollover]);

  const totalMl = todayRecords?.reduce((acc, r) => acc + r.volume_ml, 0) ?? 0;
  const goalMl = profile?.daily_goal_ml ?? 2000;
  const progressPct = Math.min(Math.round((totalMl / goalMl) * 100), 100);
  const remainingMl = Math.max(goalMl - totalMl, 0);
  const goalReached = totalMl >= goalMl;
  const defaultCupMl = profile?.default_cup_ml ?? 200;
  const isLoading = todayRecords === undefined || profile === undefined;

  const addWater = async (volume_ml: number) => {
    const id = await recordRepository.addRecord(volume_ml);
    // Haptic feedback se disponível
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    return { id };
  };

  const removeWater = async (id: number) => {
    await recordRepository.deleteRecord(id);
  };

  return {
    todayRecords: todayRecords ?? [],
    totalMl,
    goalMl,
    progressPct,
    remainingMl,
    goalReached,
    defaultCupMl,
    isLoading,
    addWater,
    removeWater,
    checkDayRollover,
    currentDate,
  };
}
