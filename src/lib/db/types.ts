/**
 * Interfaces TypeScript para as entidades do banco de dados HydroLembre.
 */

export interface Profile {
  id?: number;
  name?: string;
  weight_kg?: number;
  daily_goal_ml: number;
  default_cup_ml: number;
  onboarding_done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterRecord {
  id?: number;
  volume_ml: number;
  date: string; // Formato YYYY-MM-DD
  timestamp: Date;
  note?: string;
}

export interface SettingEntry {
  id?: number;
  key: string;
  value: unknown;
}

export interface Goal {
  id?: number;
  date: string; // Formato YYYY-MM-DD
  goal_ml: number;
}

export interface StreakCache {
  id?: number;
  current_streak: number;
  best_streak: number;
  last_date: string; // Data do último registro que contou para o streak
  updatedAt: Date;
}

/**
 * União de todas as chaves de configuração válidas.
 */
export type SettingsKeys =
  | "reminders_enabled"
  | "reminder_interval_min"
  | "reminder_start_time"
  | "reminder_end_time"
  | "reminder_message"
  | "theme"
  | "notification_permission"
  | "quick_volumes"
  | "ios_banner_dismissed";

/**
 * Estrutura completa das configurações da aplicação.
 */
export interface DefaultSettings {
  reminders_enabled: boolean;
  reminder_interval_min: number;
  reminder_start_time: string; // HH:MM
  reminder_end_time: string; // HH:MM
  reminder_message: string;
  theme: "light" | "dark" | "system";
  notification_permission: NotificationPermission | "not_asked";
  quick_volumes: number[];
  ios_banner_dismissed: boolean;
}

/**
 * Valores padrão para as configurações iniciais.
 */
export const DEFAULT_SETTINGS: DefaultSettings = {
  reminders_enabled: true,
  reminder_interval_min: 60,
  reminder_start_time: "08:00",
  reminder_end_time: "22:00",
  reminder_message: "Hora de beber água! 💧",
  theme: "system",
  notification_permission: "not_asked",
  quick_volumes: [150, 200, 300, 500],
  ios_banner_dismissed: false,
};
