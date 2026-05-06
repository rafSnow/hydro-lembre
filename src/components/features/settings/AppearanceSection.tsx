'use client';

import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';
import { clsx } from 'clsx';

type Theme = 'light' | 'dark' | 'system';

const THEMES: { id: Theme; label: string; icon: any }[] = [
  { id: 'light', label: 'Claro', icon: Sun },
  { id: 'dark', label: 'Escuro', icon: Moon },
  { id: 'system', label: 'Sistema', icon: Laptop },
];

export const AppearanceSection: React.FC = () => {
  const { isLoading } = useSettings();
  const { theme: currentTheme, setTheme } = useTheme();

  if (isLoading) return null;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isSelected = currentTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={clsx(
                'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary-dark dark:text-primary'
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
              )}
            >
              <Icon size={24} />
              <span className="text-sm font-semibold">{theme.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
