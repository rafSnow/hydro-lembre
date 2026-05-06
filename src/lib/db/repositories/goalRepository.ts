import { db } from "../index";

/**
 * Repositório para gerenciar metas diárias personalizadas.
 * Permite que o usuário tenha metas diferentes em dias específicos.
 */
export const goalRepository = {
  /**
   * Obtém a meta para uma data específica.
   */
  async getGoalForDate(date: string): Promise<number | undefined> {
    try {
      const entry = await db.goals.where("date").equals(date).first();
      return entry?.goal_ml;
    } catch (error) {
      console.error(`Erro ao obter meta da data ${date}:`, error);
      return undefined;
    }
  },

  /**
   * Define ou atualiza a meta para uma data específica.
   */
  async setGoalForDate(date: string, goal_ml: number): Promise<void> {
    try {
      const entry = await db.goals.where("date").equals(date).first();
      if (entry?.id) {
        await db.goals.update(entry.id, { goal_ml });
      } else {
        await db.goals.add({ date, goal_ml });
      }
    } catch (error) {
      console.error(`Erro ao definir meta da data ${date}:`, error);
      throw error;
    }
  },

  /**
   * Retorna um mapa de metas por data em um período.
   */
  async getGoalsForPeriod(from: string, to: string): Promise<Record<string, number>> {
    try {
      const entries = await db.goals.where("date").between(from, to, true, true).toArray();
      const goals: Record<string, number> = {};
      entries.forEach(e => {
        goals[e.date] = e.goal_ml;
      });
      return goals;
    } catch (error) {
      console.error(`Erro ao obter metas do período ${from} a ${to}:`, error);
      return {};
    }
  },

  /**
   * Remove a meta personalizada de uma data (voltando para a meta do perfil).
   */
  async deleteGoalForDate(date: string): Promise<void> {
    try {
      await db.goals.where("date").equals(date).delete();
    } catch (error) {
      console.error(`Erro ao excluir meta da data ${date}:`, error);
      throw error;
    }
  },

  /**
   * Obtém todas as metas personalizadas (usado para exportação).
   */
  async getAllGoals(): Promise<any[]> {
    try {
      return await db.goals.toArray();
    } catch (error) {
      console.error("Erro ao obter todas as metas:", error);
      return [];
    }
  },
};
