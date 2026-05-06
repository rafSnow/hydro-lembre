'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { profileRepository } from '@/lib/db/repositories/profileRepository';
import { settingsRepository } from '@/lib/db/repositories/settingsRepository';

export interface OnboardingData {
  name: string;
  weight_kg: number | '';
  daily_goal_ml: number;
  is_manual_goal: boolean;
  default_cup_ml: number;
  reminders_enabled: boolean;
  reminder_interval_min: number;
  reminder_start_time: string;
  reminder_end_time: string;
  reminder_message: string;
}

const INITIAL_DATA: OnboardingData = {
  name: '',
  weight_kg: '',
  daily_goal_ml: 2000,
  is_manual_goal: false,
  default_cup_ml: 200,
  reminders_enabled: true,
  reminder_interval_min: 60,
  reminder_start_time: '08:00',
  reminder_end_time: '22:00',
  reminder_message: 'Hora de beber água! 💧',
};

export function useOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateGoal = useCallback((weight: number): number => {
    // Meta automática = peso_kg × 35 ml, arredondada para múltiplo de 50 mais próximo
    const rawGoal = weight * 35;
    const roundedGoal = Math.round(rawGoal / 50) * 50;
    // Meta mínima: 500 ml | máxima: 6000 ml
    return Math.min(Math.max(roundedGoal, 500), 6000);
  }, []);

  const updateField = useCallback(<K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Se mudar o peso e não for meta manual, recalcula a meta
      if (field === 'weight_kg' && !prev.is_manual_goal && typeof value === 'number') {
        newData.daily_goal_ml = calculateGoal(value);
      }
      
      return newData;
    });
  }, [calculateGoal]);

  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skipStep = useCallback(() => {
    // Regras de negócio para "Pular":
    // Se pular nome e peso, já temos valores padrão no INITIAL_DATA (2000ml)
    nextStep();
  }, [nextStep]);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Salvar perfil
      await profileRepository.createProfile({
        name: formData.name || undefined,
        weight_kg: typeof formData.weight_kg === 'number' ? formData.weight_kg : undefined,
        daily_goal_ml: formData.daily_goal_ml,
        default_cup_ml: formData.default_cup_ml,
        onboarding_done: true,
      });

      // 2. Salvar settings
      await settingsRepository.setSetting('reminders_enabled', formData.reminders_enabled);
      await settingsRepository.setSetting('reminder_interval_min', formData.reminder_interval_min);
      await settingsRepository.setSetting('reminder_start_time', formData.reminder_start_time);
      await settingsRepository.setSetting('reminder_end_time', formData.reminder_end_time);
      await settingsRepository.setSetting('reminder_message', formData.reminder_message);
      await settingsRepository.setSetting('theme', 'system');
      await settingsRepository.setSetting('notification_permission', 'not_asked');
      await settingsRepository.setSetting('quick_volumes', [150, 200, 300, 500]);
      await settingsRepository.setSetting('ios_banner_dismissed', false);

      // 3. Redirecionar
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    updateField,
    nextStep,
    prevStep,
    skipStep,
    submit,
    calculateGoal,
  };
}
