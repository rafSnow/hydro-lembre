import { profileRepository } from "../db/repositories/profileRepository";
import { recordRepository } from "../db/repositories/recordRepository";
import { goalRepository } from "../db/repositories/goalRepository";
import { settingsRepository } from "../db/repositories/settingsRepository";
import { DEFAULT_SETTINGS } from "../db/types";

/**
 * Serviço responsável pela exportação dos dados do usuário.
 */
export const exportService = {
  /**
   * Gera um JSON com todos os dados do usuário.
   */
  async exportToJSON(): Promise<string> {
    const profile = await profileRepository.getProfile();
    const records = await recordRepository.getAllRecords();
    const goals = await goalRepository.getAllGoals();
    const savedSettings = await settingsRepository.getAllSettings();

    // Combina configurações salvas com valores padrão
    const settings = { ...DEFAULT_SETTINGS, ...savedSettings };

    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      profile,
      records,
      goals,
      settings,
    };

    return JSON.stringify(data, null, 2);
  },

  /**
   * Gera um CSV com os registros de hidratação.
   * Colunas: Data,Hora,Volume (ml),Observação
   */
  async exportToCSV(): Promise<string> {
    const records = await recordRepository.getAllRecords();
    
    // Ordenar por data/hora decrescente
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Header do CSV
    const header = "Data,Hora,Volume (ml),Observação";
    
    // Linhas do CSV
    const rows = sortedRecords.map(r => {
      const timestamp = new Date(r.timestamp);
      // Formatação pt-BR para data e hora
      const date = timestamp.toLocaleDateString('pt-BR');
      const time = timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const volume = r.volume_ml;
      const note = r.note ? `"${r.note.replace(/"/g, '""')}"` : ""; // Escapar aspas
      
      return `${date},${time},${volume},${note}`;
    });

    // BOM para o Excel abrir corretamente com UTF-8
    const BOM = "\uFEFF";
    return BOM + [header, ...rows].join("\n");
  },

  /**
   * Inicia o download de um arquivo no navegador.
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Limpeza
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  },
};
