import { db } from "../index";
import type { StreakCache } from "../types";

/**
 * Repositório para gerenciar o cache de streaks (sequências).
 * Armazena estatísticas calculadas para evitar reprocessamento pesado.
 */
export const streakRepository = {
  /**
   * Obtém o cache atual de streaks.
   */
  async getStreakCache(): Promise<StreakCache | undefined> {
    try {
      return await db.streaks.toCollection().first();
    } catch (error) {
      console.error("Erro ao obter cache de streak:", error);
      return undefined;
    }
  },

  /**
   * Atualiza ou cria o cache de streaks.
   */
  async updateStreakCache(data: Omit<StreakCache, "id" | "updatedAt">): Promise<void> {
    const now = new Date();
    try {
      const cache = await this.getStreakCache();
      if (cache?.id) {
        await db.streaks.update(cache.id, {
          ...data,
          updatedAt: now,
        });
      } else {
        await db.streaks.add({
          ...data,
          updatedAt: now,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar cache de streak:", error);
      throw error;
    }
  },
};
