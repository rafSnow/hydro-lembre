import { isYesterday, isToday } from "date-fns";
import { parseDate } from "./dateUtils";

interface DailyGoalStatus {
  date: string;
  goalReached: boolean;
}

/**
 * Calcula o streak atual e o melhor streak histórico.
 * @param dailyData Array de objetos com a data e se a meta foi atingida
 */
export function calculateStreak(dailyData: DailyGoalStatus[]): { current: number; best: number } {
  if (!dailyData || dailyData.length === 0) {
    return { current: 0, best: 0 };
  }

  // Ordena por data decrescente (mais recente primeiro)
  const sortedData = [...dailyData].sort((a, b) => b.date.localeCompare(a.date));

  let current = 0;
  let best = 0;
  let tempStreak = 0;

  // Calcula o streak atual
  const todayDate = sortedData.find((d) => isToday(parseDate(d.date)));
  const yesterdayData = sortedData.find((d) => isYesterday(parseDate(d.date)));

  // Se atingiu a meta hoje, o streak atual começa a contar de hoje
  // Se não atingiu hoje mas atingiu ontem, o streak ainda é válido (o dia não acabou)
  // Se não atingiu hoje nem ontem, o streak quebrou (current = 0)
  
  let currentStreakValid = false;
  if (todayDate?.goalReached) {
    currentStreakValid = true;
  } else if (yesterdayData?.goalReached) {
    // Se hoje ainda não atingiu mas ontem sim, o streak atual ainda é o que vinha de ontem
    currentStreakValid = true;
  }

  if (currentStreakValid) {
    for (let i = 0; i < sortedData.length; i++) {
      const d = sortedData[i];
      const date = parseDate(d.date);
      
      // Ignora o dia de hoje no loop se ainda não atingiu a meta, 
      // para não quebrar o streak prematuramente
      if (isToday(date) && !d.goalReached) continue;

      if (d.goalReached) {
        current++;
      } else {
        break;
      }
    }
  }

  // Calcula o melhor streak (best)
  // Para o best, precisamos da lista em ordem cronológica
  const chronologicalData = [...dailyData].sort((a, b) => a.date.localeCompare(b.date));
  tempStreak = 0;
  for (const d of chronologicalData) {
    if (d.goalReached) {
      tempStreak++;
      if (tempStreak > best) {
        best = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  return { current, best };
}

/**
 * Calcula a média de consumo diário em um período.
 */
export function calculateAverage(dailyData: { totalMl: number }[], days: number): number {
  if (!dailyData || dailyData.length === 0) return 0;
  const total = dailyData.slice(0, days).reduce((acc, d) => acc + d.totalMl, 0);
  return Math.round(total / Math.min(dailyData.length, days));
}

/**
 * Calcula a meta recomendada com base no peso.
 */
export function calculateGoalAuto(weight_kg: number): number {
  const rawGoal = weight_kg * 35;
  const roundedGoal = Math.round(rawGoal / 50) * 50;
  return Math.min(Math.max(roundedGoal, 500), 6000);
}

/**
 * Formata o volume para exibição amigável.
 */
export function formatVolume(ml: number): string {
  if (ml >= 1000) {
    const liters = ml / 1000;
    return liters.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + " L";
  }
  return ml.toLocaleString("pt-BR") + " ml";
}
