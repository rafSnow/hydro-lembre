/**
 * Solicita ao navegador que torne o armazenamento persistente para o HydroLembre.
 * Isso reduz as chances de o navegador limpar os dados do IndexedDB automaticamente.
 * @returns Promise<boolean> true se o armazenamento for persistente
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window !== "undefined" && navigator.storage?.persist) {
    try {
      return await navigator.storage.persist();
    } catch (error) {
      console.error("Erro ao solicitar armazenamento persistente:", error);
      return false;
    }
  }
  return false;
}

/**
 * Retorna uma estimativa de quanto armazenamento o HydroLembre está usando.
 * @returns Promise<{usage: number, quota: number}> uso e cota total em bytes
 */
export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
  if (typeof window !== "undefined" && navigator.storage?.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage ?? 0,
        quota: estimate.quota ?? 0,
      };
    } catch (error) {
      console.error("Erro ao obter estimativa de armazenamento:", error);
    }
  }
  return { usage: 0, quota: 0 };
}
