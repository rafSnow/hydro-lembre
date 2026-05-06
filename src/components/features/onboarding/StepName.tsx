'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';

interface StepNameProps {
  value: string;
  onChange: (value: string) => void;
}

export const StepName: React.FC<StepNameProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Como podemos te chamar?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Usaremos para personalizar sua experiência
        </p>
      </div>

      <Input
        label="Seu nome (opcional)"
        placeholder="Seu nome (opcional)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
    </div>
  );
};
