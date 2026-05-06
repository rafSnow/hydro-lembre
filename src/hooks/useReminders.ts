'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { settingsRepository } from '@/lib/db/repositories/settingsRepository';
import { reminderScheduler } from '@/lib/notifications/reminderScheduler';
import { notificationManager } from '@/lib/notifications/notificationManager';
import { DEFAULT_SETTINGS } from '@/lib/db/types';

/**
 * Hook para gerenciar lembretes e notificações de forma reativa.
 */
export function useReminders() {
  const settings = useLiveQuery(() => settingsRepository.getAllSettings(), []);
  const [nextReminderIn, setNextReminderIn] = useState<number>(0);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    notificationManager.getPermission()
  );

  const isEnabled = settings?.reminders_enabled ?? DEFAULT_SETTINGS.reminders_enabled;
  const intervalMin = settings?.reminder_interval_min ?? DEFAULT_SETTINGS.reminder_interval_min;
  const startTime = settings?.reminder_start_time ?? DEFAULT_SETTINGS.reminder_start_time;
  const endTime = settings?.reminder_end_time ?? DEFAULT_SETTINGS.reminder_end_time;
  const message = settings?.reminder_message ?? DEFAULT_SETTINGS.reminder_message;

  const isIOSWithoutSupport = notificationManager.needsHomeScreenInstall();

  /**
   * Solicita permissão de notificação e atualiza o estado local e o banco.
   */
  const requestPermission = async () => {
    const result = await notificationManager.requestPermission();
    setPermission(result);
    await settingsRepository.setSetting('notification_permission', result);
  };

  /**
   * Ativa ou desativa os lembretes.
   */
  const toggleReminders = async (enabled: boolean) => {
    await settingsRepository.setSetting('reminders_enabled', enabled);
    if (!enabled) {
      reminderScheduler.stop();
    }
  };

  /**
   * Atualiza partes da configuração de lembretes.
   */
  const updateConfig = async (partial: {
    intervalMin?: number;
    startTime?: string;
    endTime?: string;
    message?: string;
  }) => {
    if (partial.intervalMin !== undefined) await settingsRepository.setSetting('reminder_interval_min', partial.intervalMin);
    if (partial.startTime !== undefined) await settingsRepository.setSetting('reminder_start_time', partial.startTime);
    if (partial.endTime !== undefined) await settingsRepository.setSetting('reminder_end_time', partial.endTime);
    if (partial.message !== undefined) await settingsRepository.setSetting('reminder_message', partial.message);
  };

  /**
   * Efeito para (re)iniciar o scheduler quando as configurações mudarem.
   */
  useEffect(() => {
    if (isEnabled && permission === 'granted') {
      reminderScheduler.restart({
        intervalMin,
        startTime,
        endTime,
        message,
      });
      setNextReminderIn(reminderScheduler.getNextReminderIn());
    } else {
      reminderScheduler.stop();
    }
  }, [isEnabled, intervalMin, startTime, endTime, message, permission]);

  /**
   * Efeito para atualizar o tempo restante do próximo lembrete a cada minuto.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (reminderScheduler.isActive()) {
        setNextReminderIn(reminderScheduler.getNextReminderIn());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    isEnabled,
    intervalMin,
    startTime,
    endTime,
    message,
    permission,
    isIOSWithoutSupport,
    nextReminderIn,
    requestPermission,
    toggleReminders,
    updateConfig,
    isLoading: settings === undefined,
  };
}
