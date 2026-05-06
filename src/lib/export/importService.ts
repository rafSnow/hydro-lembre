import { db } from "../db";
import type { Profile, WaterRecord, Goal, DefaultSettings } from "../db/types";

export type ImportResult = {
  success: boolean;
  imported: number;
  errors: string[];
};

export type ImportMode = "merge" | "replace";

export interface ExportSchema {
  version: string;
  exportedAt: string;
  profile?: Profile;
  records?: WaterRecord[];
  goals?: Goal[];
  settings?: DefaultSettings;
}

/**
 * Serviço responsável pela importação de dados do usuário.
 */
export const importService = {
  /**
   * Valida se a string JSON bruta possui a estrutura correta para importação.
   */
  validateJSON(raw: string): { valid: boolean; data?: ExportSchema; errors: string[] } {
    const errors: string[] = [];
    let data: any;

    try {
      data = JSON.parse(raw);
    } catch (e) {
      return { valid: false, errors: ["Arquivo JSON inválido ou corrompido."] };
    }

    if (!data.version) {
      errors.push("Versão do esquema não encontrada.");
    } else if (data.version !== "1.0") {
      errors.push(`Versão do esquema incompatível: ${data.version}. Esperado: 1.0`);
    }

    if (!data.exportedAt) {
      errors.push("Data de exportação não encontrada.");
    }

    if (data.records && !Array.isArray(data.records)) {
      errors.push("O campo 'records' deve ser uma lista.");
    }

    if (data.goals && !Array.isArray(data.goals)) {
      errors.push("O campo 'goals' deve ser uma lista.");
    }

    return {
      valid: errors.length === 0,
      data: errors.length === 0 ? (data as ExportSchema) : undefined,
      errors,
    };
  },

  /**
   * Importa os dados de um JSON validado para o banco de dados.
   */
  async importFromJSON(raw: string, mode: ImportMode): Promise<ImportResult> {
    const { valid, data, errors } = this.validateJSON(raw);

    if (!valid || !data) {
      return { success: false, imported: 0, errors };
    }

    let importedCount = 0;
    const importErrors: string[] = [];

    try {
      await db.transaction("rw", [db.records, db.goals, db.profile, db.settings], async () => {
        // 1. Lidar com Perfil (sempre atualiza se presente)
        if (data.profile) {
          const currentProfile = await db.profile.toCollection().first();
          const profileToImport = { ...data.profile };
          delete profileToImport.id; // Remover ID para evitar conflito

          if (currentProfile?.id) {
            await db.profile.update(currentProfile.id, profileToImport);
          } else {
            await db.profile.add(profileToImport);
          }
        }

        // 2. Lidar com Configurações (sempre atualiza se presente)
        if (data.settings) {
          for (const [key, value] of Object.entries(data.settings)) {
            const entry = await db.settings.where("key").equals(key).first();
            if (entry?.id) {
              await db.settings.update(entry.id, { value });
            } else {
              await db.settings.add({ key, value });
            }
          }
        }

        // 3. Lidar com Metas Diárias
        if (data.goals && data.goals.length > 0) {
          if (mode === "replace") {
            await db.goals.clear();
          }

          for (const goal of data.goals) {
            const goalToImport = { ...goal };
            delete goalToImport.id;

            if (mode === "merge") {
              // No merge, metas para a mesma data são substituídas pela importada
              const existing = await db.goals.where("date").equals(goal.date).first();
              if (existing?.id) {
                await db.goals.update(existing.id, goalToImport);
              } else {
                await db.goals.add(goalToImport);
              }
            } else {
              await db.goals.add(goalToImport);
            }
          }
        }

        // 4. Lidar com Registros de Água
        if (data.records && data.records.length > 0) {
          if (mode === "replace") {
            await db.records.clear();
          }

          const recordsToInsert: WaterRecord[] = [];

          for (const record of data.records) {
            const recordToImport = { 
              ...record,
              timestamp: new Date(record.timestamp) // Garantir objeto Date
            };
            delete recordToImport.id;

            if (mode === "merge") {
              // No merge, verificar por timestamp exato para evitar duplicatas
              const exists = await db.records
                .where("timestamp")
                .equals(recordToImport.timestamp)
                .first();
              
              if (!exists) {
                recordsToInsert.push(recordToImport);
              }
            } else {
              recordsToInsert.push(recordToImport);
            }
          }

          if (recordsToInsert.length > 0) {
            await db.records.bulkAdd(recordsToInsert);
            importedCount = recordsToInsert.length;
          }
        }
      });

      return { success: true, imported: importedCount, errors: [] };
    } catch (e: any) {
      console.error("Erro durante a importação:", e);
      return { 
        success: false, 
        imported: 0, 
        errors: [`Erro no banco de dados: ${e.message || "Desconhecido"}`] 
      };
    }
  },
};
