/**
 * Definição do esquema do banco de dados Dexie para o HydroLembre.
 * Versão: 1
 */

export const DB_SCHEMA_V1 = {
  profile: "++id, createdAt",
  records: "++id, date, timestamp",
  settings: "++id, key",
  goals: "++id, date",
  streaks: "++id, updatedAt",
};
