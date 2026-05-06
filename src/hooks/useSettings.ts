'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { profileRepository } from '@/lib/db/repositories/profileRepository';
import { settingsRepository } from '@/lib/db/repositories/settingsRepository';
import { recordRepository } from '@/lib/db/repositories/recordRepository';
import { goalRepository } from '@/lib/db/repositories/goalRepository';
import { db } from '@/lib/db';
import {
  type Profile,
  type DefaultSettings,
  type SettingsKeys,
  DEFAULT_SETTINGS,
} from '@/lib/db/types';

/**
 * Hook para gerenciar as configurações e o perfil do usuário.
 */
export function useSettings() {
  const profile = useLiveQuery(() => profileRepository.getProfile());
  const allSettings = useLiveQuery(() => settingsRepository.getAllSettings());

  const settings: DefaultSettings = {
    ...DEFAULT_SETTINGS,
    ...(allSettings || {}),
  } as DefaultSettings;

  const isLoading = profile === undefined || allSettings === undefined;

  /**
   * Atualiza os dados do perfil.
   */
  const updateProfile = async (data: Partial<Profile>) => {
    await profileRepository.updateProfile(data);
  };

  /**
   * Atualiza uma configuração específica.
   */
  const updateSetting = async <T,>(key: SettingsKeys, value: T) => {
    await settingsRepository.setSetting(key, value);
  };

  /**
   * Limpa apenas o histórico de registros e metas diárias.
   */
  const resetAllData = async () => {
    await db.transaction('rw', [db.records, db.goals], async () => {
      await db.records.clear();
      await db.goals.clear();
    });
  };

  /**
   * Limpa absolutamente tudo e reinicia o app para o estado de onboarding.
   */
  const resetEverything = async () => {
    await db.transaction('rw', [db.profile, db.records, db.settings, db.goals, db.streaks], async () => {
      await db.profile.clear();
      await db.records.clear();
      await db.settings.clear();
      await db.goals.clear();
      await db.streaks.clear();
    });
    window.location.href = '/onboarding';
  };

  /**
   * Calcula a meta recomendada com base no peso.
   */
  const calculateGoal = (weight: number): number => {
    // 35ml por kg, arredondado para o múltiplo de 50 mais próximo
    const rawGoal = weight * 35;
    return Math.round(rawGoal / 50) * 50;
  };

  return {
    profile,
    settings,
    isLoading,
    updateProfile,
    updateSetting,
    resetAllData,
    resetEverything,
    calculateGoal,
  };
}
