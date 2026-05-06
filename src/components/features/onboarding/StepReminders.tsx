'use client';

import React from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';

import type { OnboardingData } from '@/hooks/useOnboarding';

interface StepRemindersProps {
  enabled: boolean;
  interval: number;
  startTime: string;
  endTime: string;
  message: string;
  onChange: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

const INTERVAL_OPTIONS = [
  { label: '30min', value: 30 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
];

export const StepReminders: React.FC<StepRemindersProps> = ({
  enabled,
  interval,
  startTime,
  endTime,
  message,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Quando te lembramos?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Lembretes te ajudam a manter a constância.
        </p>
      </div>

      <div className="space-y-6">
        <Toggle
          label="Ativar lembretes"
          checked={enabled}
          onChange={(e) => onChange('reminders_enabled', e.target.checked)}
        />

        {enabled && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Intervalo entre lembretes
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERVAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onChange('reminder_interval_min', opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      interval === opt.value
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Início"
                type="time"
                value={startTime}
                onChange={(e) => onChange('reminder_start_time', e.target.value)}
              />
              <Input
                label="Fim"
                type="time"
                value={endTime}
                onChange={(e) => onChange('reminder_end_time', e.target.value)}
              />
            </div>

            <Input
              label="Mensagem (opcional)"
              placeholder="Hora de beber água! 💧"
              value={message}
              onChange={(e) => onChange('reminder_message', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
