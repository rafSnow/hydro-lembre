import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import { recordRepository } from "@/lib/db/repositories/recordRepository";
import { goalRepository } from "@/lib/db/repositories/goalRepository";
import { profileRepository } from "@/lib/db/repositories/profileRepository";
import { getDaysInRange } from "@/lib/utils/dateUtils";
import type { WaterRecord } from "@/lib/db/types";

export interface DailyData {
  date: string;
  totalMl: number;
  goalMl: number;
  records: WaterRecord[];
  goalReached: boolean;
  pct: number;
}

export interface UseHistoryProps {
  from: string;
  to: string;
}

export function useHistory({ from, to }: UseHistoryProps) {
  const records = useLiveQuery(() => recordRepository.getRecordsByPeriod(from, to), [from, to]);
  const goals = useLiveQuery(() => goalRepository.getGoalsForPeriod(from, to), [from, to]);
  const profile = useLiveQuery(() => profileRepository.getProfile(), []);

  const dailyData = useMemo(() => {
    if (!records || !profile) return [];

    const days = getDaysInRange(from, to);
    const data: DailyData[] = days.map((date) => {
      const dayRecords = records.filter((r) => r.date === date);
      const totalMl = dayRecords.reduce((acc, r) => acc + r.volume_ml, 0);
      const goalMl = goals?.[date] ?? profile.daily_goal_ml;
      const pct = Math.min(Math.round((totalMl / goalMl) * 100), 100);
      const goalReached = totalMl >= goalMl;

      return {
        date,
        totalMl,
        goalMl,
        records: dayRecords,
        goalReached,
        pct,
      };
    });

    // Return descending (most recent first) for the list, but we'll need it ascending for the chart
    return data.reverse();
  }, [records, goals, profile, from, to]);

  const stats = useMemo(() => {
    if (dailyData.length === 0) {
      return {
        periodAverage: 0,
        daysWithGoal: 0,
        totalConsumed: 0,
      };
    }

    const totalConsumed = dailyData.reduce((acc, d) => acc + d.totalMl, 0);
    const daysWithGoal = dailyData.filter((d) => d.goalReached).length;
    const periodAverage = Math.round(totalConsumed / dailyData.length);

    return {
      periodAverage,
      daysWithGoal,
      totalConsumed,
    };
  }, [dailyData]);

  return {
    dailyData,
    ...stats,
    isLoading: records === undefined || profile === undefined,
  };
}
