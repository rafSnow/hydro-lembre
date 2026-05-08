'use client';

import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/components/ui/Snackbar';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { notificationManager } from '@/lib/notifications/notificationManager';
import { Bell } from 'lucide-react';
import { clsx } from 'clsx';

const PRESET_INTERVALS = [
  { label: '1m', value: 1 },
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
];

export const RemindersSection: React.FC = () => {
  const { settings, updateSetting, isLoading } = useSettings();
  const { showSnackbar } = useSnackbar();
  const [isCustomInterval, setIsCustomInterval] = useState(false);

  if (isLoading) return null;

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = notificationManager.getPermission();
      if (permission === 'default' || permission === 'unsupported') {
        const result = await notificationManager.requestPermission();
        if (result !== 'granted') {
          showSnackbar({ message: 'Permissão de notificação negada.' });
          return;
        }
      } else if (permission === 'denied') {
        showSnackbar({ message: 'Ative as notificações nas configurações do seu navegador.' });
        return;
      }
    }
    await updateSetting('reminders_enabled', enabled);
  };

  const handleTestNotification = async () => {
    const sent = await notificationManager.sendNotification('Teste do HydroLembre 💧', {
      body: 'Seus lembretes estão funcionando corretamente!',
    });
    if (!sent) {
      showSnackbar({ message: 'Erro ao enviar notificação. Verifique as permissões.' });
    }
  };

  const formatIntervalDisplay = (min: number) => {
    if (min < 60) return `${min} minutos`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h${m > 0 ? ` ${m}m` : ''}`;
  };

  return (
    <section className="space-y-6">
      <Toggle
        label="Lembretes periódicos"
        checked={settings.reminders_enabled}
        onChange={(e) => handleToggle(e.target.checked)}
      />

      {settings.reminders_enabled && (
        <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Intervalo entre lembretes
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_INTERVALS.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => {
                    updateSetting('reminder_interval_min', interval.value);
                    setIsCustomInterval(false);
                  }}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                    settings.reminder_interval_min === interval.value && !isCustomInterval
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  {interval.label}
                </button>
              ))}
              <button
                onClick={() => setIsCustomInterval(true)}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                  isCustomInterval
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                Personalizado
              </button>
            </div>
            {isCustomInterval && (
              <Input
                type="number"
                min={1}
                max={1440}
                placeholder="Minutos"
                value={settings.reminder_interval_min}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(1440, Number(e.target.value)));
                  updateSetting('reminder_interval_min', val);
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Início"
              type="time"
              value={settings.reminder_start_time}
              onChange={(e) => updateSetting('reminder_start_time', e.target.value)}
            />
            <Input
              label="Fim"
              type="time"
              value={settings.reminder_end_time}
              onChange={(e) => updateSetting('reminder_end_time', e.target.value)}
            />
          </div>

          <Input
            label="Mensagem"
            value={settings.reminder_message}
            onChange={(e) => updateSetting('reminder_message', e.target.value)}
            placeholder="Ex: Hora de beber água! 💧"
          />

          <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
            <p className="text-sm text-primary-dark dark:text-primary leading-relaxed text-center italic">
              &quot;Você receberá lembretes a cada {formatIntervalDisplay(settings.reminder_interval_min)} das {settings.reminder_start_time} às {settings.reminder_end_time}&quot;
            </p>
          </div>

          <Button variant="outline" className="w-full gap-2" onClick={handleTestNotification}>
            <Bell size={18} />
            Testar notificação
          </Button>
        </div>
      )}
    </section>
  );
};
