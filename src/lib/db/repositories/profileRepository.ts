import { db } from "../index";
import type { Profile } from "../types";

/**
 * Repositório para gerenciar o perfil do usuário no HydroLembre.
 */
export const profileRepository = {
  /**
   * Obtém o perfil único do usuário.
   */
  async getProfile(): Promise<Profile | undefined> {
    try {
      return await db.profile.toCollection().first();
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
      return undefined;
    }
  },

  /**
   * Cria o perfil inicial do usuário.
   */
  async createProfile(data: Omit<Profile, "id" | "createdAt" | "updatedAt">): Promise<number> {
    const now = new Date();
    try {
      return await db.profile.add({
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados do perfil existente.
   */
  async updateProfile(data: Partial<Profile>): Promise<void> {
    try {
      const profile = await this.getProfile();
      if (profile?.id) {
        await db.profile.update(profile.id, {
          ...data,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },

  /**
   * Verifica se o usuário já concluiu o fluxo de onboarding.
   */
  async isOnboardingDone(): Promise<boolean> {
    const profile = await this.getProfile();
    return profile?.onboarding_done ?? false;
  },

  /**
   * Marca o onboarding como concluído no perfil.
   */
  async setOnboardingDone(): Promise<void> {
    await this.updateProfile({ onboarding_done: true });
  },
};
