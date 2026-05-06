'use client';

import React from 'react';
import { Droplet } from 'lucide-react';

interface VolumeShortcutsProps {
  shortcuts?: number[];
  onSelect: (volume: number) => void;
  disabled?: boolean;
}

const DEFAULT_SHORTCUTS = [150, 200, 300, 500, 750, 1000];

export const VolumeShortcuts: React.FC<VolumeShortcutsProps> = ({
  shortcuts = DEFAULT_SHORTCUTS,
  onSelect,
  disabled,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {shortcuts.map((volume) => (
        <button
          key={volume}
          onClick={() => onSelect(volume)}
          disabled={disabled}
          aria-label={`Adicionar ${volume} ml`}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 active:scale-95 active:bg-slate-50 dark:active:bg-slate-800 transition-all disabled:opacity-50"
        >
          <Droplet className="w-4 h-4 text-primary mb-1" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {volume}
          </span>
          <span className="text-[10px] text-slate-400">ml</span>
        </button>
      ))}
    </div>
  );
};
