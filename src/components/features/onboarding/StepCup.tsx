'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';

interface StepCupProps {
  value: number;
  onChange: (value: number) => void;
}

const CUP_OPTIONS = [
  { id: 'small', label: 'Copo pequeno', volume: 150, icon: '🥤' },
  { id: 'standard', label: 'Copo padrão', volume: 200, icon: '☕' },
  { id: 'large', label: 'Copo grande', volume: 300, icon: '🧃' },
  { id: 'bottle-sm', label: 'Garrafa pequena', volume: 500, icon: '🍶' },
  { id: 'bottle-md', label: 'Garrafa média', volume: 750, icon: '💧' },
  { id: 'bottle-lg', label: 'Garrafa grande', volume: 1000, icon: '🚰' },
];

export const StepCup: React.FC<StepCupProps> = ({ value, onChange }) => {
  const [isCustom, setIsCustom] = React.useState(!CUP_OPTIONS.some(opt => opt.volume === value));

  const handleSelect = (volume: number) => {
    setIsCustom(false);
    onChange(volume);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Qual é o seu copo ou recipiente?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Isso facilita o registro rápido da sua hidratação.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CUP_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.volume)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              !isCustom && value === opt.volume
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'
            }`}
          >
            <span className="text-2xl mb-1">{opt.icon}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {opt.label}
            </span>
            <span className="text-xs text-slate-500">{opt.volume} ml</span>
          </button>
        ))}
        
        <button
          onClick={() => setIsCustom(true)}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
            isCustom
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'
          }`}
        >
          <span className="text-2xl mb-1">✨</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Outro
          </span>
          <span className="text-xs text-slate-500">Personalizado</span>
        </button>
      </div>

      {isCustom && (
        <Input
          label="Volume personalizado (ml)"
          type="number"
          placeholder="Ex: 250"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          autoFocus
        />
      )}
    </div>
  );
};
