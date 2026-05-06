'use client';

import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/components/ui/Snackbar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

export const QuickVolumesSection: React.FC = () => {
  const { settings, updateSetting, isLoading } = useSettings();
  const { showSnackbar } = useSnackbar();
  const [newVolume, setNewVolume] = useState('');

  if (isLoading) return null;

  const handleAddVolume = async () => {
    const vol = Number(newVolume);
    if (!vol || vol < 1 || vol > 2000) {
      showSnackbar({ message: 'Volume inválido (1-2000ml).' });
      return;
    }
    if (settings.quick_volumes.length >= 8) {
      showSnackbar({ message: 'Máximo de 8 volumes atingido.' });
      return;
    }

    const updated = [...settings.quick_volumes, vol];
    await updateSetting('quick_volumes', updated);
    setNewVolume('');
    showSnackbar({ message: 'Volume adicionado!' });
  };

  const handleRemoveVolume = async (index: number) => {
    const updated = settings.quick_volumes.filter((_, i) => i !== index);
    await updateSetting('quick_volumes', updated);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const updated = [...settings.quick_volumes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= updated.length) return;

    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    await updateSetting('quick_volumes', updated);
  };

  const handleRestoreDefaults = async () => {
    await updateSetting('quick_volumes', [150, 200, 300, 500]);
    showSnackbar({ message: 'Atalhos restaurados.' });
  };

  return (
    <section className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Novo volume (ml)"
          value={newVolume}
          onChange={(e) => setNewVolume(e.target.value)}
        />
        <Button onClick={handleAddVolume} size="sm" className="h-12 w-12 p-0 flex-shrink-0">
          <Plus size={24} />
        </Button>
      </div>

      <div className="space-y-3">
        {settings.quick_volumes.map((volume, index) => (
          <div
            key={`${volume}-${index}`}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm"
          >
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {volume} ml
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleMove(index, 'down')}
                disabled={index === settings.quick_volumes.length - 1}
              >
                <ArrowDown size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={() => handleRemoveVolume(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full gap-2 text-slate-500"
        onClick={handleRestoreDefaults}
      >
        <RotateCcw size={16} />
        Restaurar padrões
      </Button>
    </section>
  );
};
