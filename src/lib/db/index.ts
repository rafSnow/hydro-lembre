import Dexie, { type Table } from "dexie";
import { DB_SCHEMA_V1 } from "./schema";
import type { Profile, WaterRecord, SettingEntry, Goal, StreakCache } from "./types";

/**
 * Classe principal do banco de dados HydroLembre utilizando Dexie.js.
 */
export class HydroLembreDB extends Dexie {
  profile!: Table<Profile>;
  records!: Table<WaterRecord>;
  settings!: Table<SettingEntry>;
  goals!: Table<Goal>;
  streaks!: Table<StreakCache>;

  constructor() {
    super("hydrolembre");
    
    this.version(1).stores(DB_SCHEMA_V1);
  }
}

/**
 * Instância singleton do banco de dados para uso em toda a aplicação.
 */
export const db = new HydroLembreDB();
