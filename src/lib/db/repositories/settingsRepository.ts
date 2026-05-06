import { db } from "../index";
import { type DefaultSettings, type SettingsKeys, DEFAULT_SETTINGS } from "../types";

/**
 * Repositório para gerenciar configurações chave-valor no HydroLembre.
 */
export const settingsRepository = {
  /**
   * Obtém o valor de uma configuração específica.
   */
  async getSetting<T>(key: SettingsKeys): Promise<T | undefined> {
    try {
      const entry = await db.settings.where("key").equals(key).first();
      return entry ? (entry.value as T) : undefined;
    } catch (error) {
      console.error(`Erro ao obter a configuração ${key}:`, error);
      return undefined;
    }
  },

  /**
   * Salva ou atualiza uma configuração.
   */
  async setSetting<T>(key: SettingsKeys, value: T): Promise<void> {
    try {
      const entry = await db.settings.where("key").equals(key).first();
      if (entry?.id) {
        await db.settings.update(entry.id, { value });
      } else {
        await db.settings.add({ key, value });
      }
    } catch (error) {
      console.error(`Erro ao salvar a configuração ${key}:`, error);
      throw error;
    }
  },

  /**
   * Obtém todas as configurações salvas como um objeto.
   */
  async getAllSettings(): Promise<Partial<DefaultSettings>> {
    try {
      const entries = await db.settings.toArray();
      const settings: Record<string, unknown> = {};
      entries.forEach(e => {
        settings[e.key] = e.value;
      });
      return settings as Partial<DefaultSettings>;
    } catch (error) {
      console.error("Erro ao obter todas as configurações:", error);
      return {};
    }
  },

  /**
   * Restaura todas as configurações para seus valores padrão.
   */
  async resetSettings(): Promise<void> {
    try {
      await db.transaction("rw", db.settings, async () => {
        await db.settings.clear();
        const entries = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
          key,
          value,
        }));
        await db.settings.bulkAdd(entries);
      });
    } catch (error) {
      console.error("Erro ao resetar configurações:", error);
      throw error;
    }
  },
};
