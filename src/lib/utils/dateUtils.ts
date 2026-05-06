import { format, parse, startOfDay, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Converte um objeto Date para string no formato ISO local (YYYY-MM-DD).
 * @param date Objeto Date
 * @returns string "YYYY-MM-DD"
 */
export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Retorna a data de hoje formatada como string (YYYY-MM-DD).
 */
export function today(): string {
  return toDateString(new Date());
}

/**
 * Retorna a data de ontem formatada como string (YYYY-MM-DD).
 */
export function yesterday(): string {
  return toDateString(subDays(new Date(), 1));
}

/**
 * Converte uma string de data (YYYY-MM-DD) para um objeto Date.
 * @param dateStr string de data
 * @returns Objeto Date (início do dia local)
 */
export function parseDate(dateStr: string): Date {
  return parse(dateStr, "yyyy-MM-dd", new Date());
}

/**
 * Formata uma data para exibição amigável em português.
 * @param dateStr string de data ou objeto Date
 * @returns "Seg, 05 mai"
 */
export function formatDisplayDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? parseDate(dateStr) : dateStr;
  
  const formatted = format(date, "EEE, dd MMM", { locale: ptBR });
  // Capitaliza a primeira letra do dia da semana e do mês
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formata uma data para exibição por extenso em português.
 * @param dateStr string de data ou objeto Date
 * @returns "Segunda-feira, 05 de maio de 2026"
 */
export function formatLongDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? parseDate(dateStr) : dateStr;
  
  const formatted = format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Verifica se uma string de data corresponde ao dia de hoje.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === today();
}

/**
 * Retorna um array de strings de datas (YYYY-MM-DD) em um intervalo específico.
 */
export function getDaysInRange(from: string, to: string): string[] {
  const start = parseDate(from);
  const end = parseDate(to);
  
  const days = eachDayOfInterval({ start, end });
  return days.map(toDateString);
}

/**
 * Retorna os últimos 7 dias (incluindo hoje) como strings (YYYY-MM-DD).
 */
export function getLast7Days(): string[] {
  const end = new Date();
  const start = subDays(end, 6);
  
  return eachDayOfInterval({ start, end }).map(toDateString);
}

/**
 * Retorna os últimos 30 dias (incluindo hoje) como strings (YYYY-MM-DD).
 */
export function getLast30Days(): string[] {
  const end = new Date();
  const start = subDays(end, 29);
  
  return eachDayOfInterval({ start, end }).map(toDateString);
}
