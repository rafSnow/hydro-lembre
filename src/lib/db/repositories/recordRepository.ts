import { db } from "../index";
import type { WaterRecord } from "../types";
import { toDateString } from "@/lib/utils/dateUtils";

/**
 * Repositório para gerenciar os registros de ingestão de água.
 */
export const recordRepository = {
  /**
   * Adiciona um novo registro de água para a data atual.
   */
  async addRecord(volume_ml: number, note?: string): Promise<number> {
    const now = new Date();
    try {
      return await db.records.add({
        volume_ml,
        date: toDateString(now),
        timestamp: now,
        note,
      });
    } catch (error) {
      console.error("Erro ao adicionar registro:", error);
      throw error;
    }
  },

  /**
   * Adiciona um registro de água para uma data específica.
   */
  async addRecordToDate(volume_ml: number, date: string, timestamp: Date = new Date()): Promise<number> {
    try {
      return await db.records.add({
        volume_ml,
        date,
        timestamp,
      });
    } catch (error) {
      console.error(`Erro ao adicionar registro na data ${date}:`, error);
      throw error;
    }
  },

  /**
   * Obtém todos os registros da data de hoje.
   */
  async getTodayRecords(): Promise<WaterRecord[]> {
    const today = toDateString(new Date());
    try {
      return await db.records.where("date").equals(today).sortBy("timestamp");
    } catch (error) {
      console.error("Erro ao obter registros de hoje:", error);
      return [];
    }
  },

  /**
   * Obtém registros de uma data específica.
   */
  async getRecordsByDate(date: string): Promise<WaterRecord[]> {
    try {
      return await db.records.where("date").equals(date).sortBy("timestamp");
    } catch (error) {
      console.error(`Erro ao obter registros da data ${date}:`, error);
      return [];
    }
  },

  /**
   * Obtém todos os registros em um intervalo de datas (YYYY-MM-DD).
   */
  async getRecordsByPeriod(from: string, to: string): Promise<WaterRecord[]> {
    try {
      return await db.records
        .where("date")
        .between(from, to, true, true)
        .toArray();
    } catch (error) {
      console.error(`Erro ao obter registros do período ${from} a ${to}:`, error);
      return [];
    }
  },

  /**
   * Calcula o total de água consumida em uma data específica.
   */
  async getTotalByDate(date: string): Promise<number> {
    try {
      const records = await this.getRecordsByDate(date);
      return records.reduce((acc, r) => acc + r.volume_ml, 0);
    } catch (error) {
      console.error(`Erro ao calcular total da data ${date}:`, error);
      return 0;
    }
  },

  /**
   * Retorna um mapa de totais consumidos por data em um período.
   * @returns Record<string, number> Ex: { "2026-05-01": 1800 }
   */
  async getTotalsByPeriod(from: string, to: string): Promise<Record<string, number>> {
    try {
      const records = await this.getRecordsByPeriod(from, to);
      const totals: Record<string, number> = {};
      
      records.forEach(r => {
        totals[r.date] = (totals[r.date] || 0) + r.volume_ml;
      });
      
      return totals;
    } catch (error) {
      console.error(`Erro ao obter totais do período ${from} a ${to}:`, error);
      return {};
    }
  },

  /**
   * Remove um registro individual pelo ID.
   */
  async deleteRecord(id: number): Promise<void> {
    try {
      await db.records.delete(id);
    } catch (error) {
      console.error(`Erro ao excluir registro ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza o volume de um registro existente.
   */
  async updateRecord(id: number, volume_ml: number): Promise<void> {
    try {
      await db.records.update(id, { volume_ml });
    } catch (error) {
      console.error(`Erro ao atualizar registro ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtém todos os registros (usado para exportação).
   */
  async getAllRecords(): Promise<WaterRecord[]> {
    try {
      return await db.records.toArray();
    } catch (error) {
      console.error("Erro ao obter todos os registros:", error);
      return [];
    }
  },

  /**
   * Obtém a contagem total de registros.
   */
  async getRecordCount(): Promise<number> {
    try {
      return await db.records.count();
    } catch (error) {
      console.error("Erro ao obter contagem de registros:", error);
      return 0;
    }
  },

  /**
   * Obtém a data do primeiro registro realizado.
   */
  async getFirstRecordDate(): Promise<string | undefined> {
    try {
      const first = await db.records.orderBy("timestamp").first();
      return first?.date;
    } catch (error) {
      console.error("Erro ao obter data do primeiro registro:", error);
      return undefined;
    }
  },

  /**
   * Remove todos os registros do histórico.
   */
  async clearAllRecords(): Promise<void> {
    try {
      await db.records.clear();
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      throw error;
    }
  },
};
