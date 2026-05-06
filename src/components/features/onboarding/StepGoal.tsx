'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';

interface StepGoalProps {
  weight: number | '';
  dailyGoal: number;
  isManual: boolean;
  onWeightChange: (value: number | '') => void;
  onGoalChange: (value: number) => void;
  onManualToggle: (value: boolean) => void;
}

export const StepGoal: React.FC<StepGoalProps> = ({
  weight,
  dailyGoal,
  isManual,
  onWeightChange,
  onGoalChange,
  onManualToggle,
}) => {
  const [error, setError] = React.useState<string>('');

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) {
      onGoalChange(0);
      return;
    }
    
    if (val < 500 || val > 6000) {
      setError('A meta deve estar entre 500ml e 6000ml');
    } else {
      setError('');
    }
    onGoalChange(val);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Qual é sua meta diária?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Calculamos uma meta recomendada com base no seu peso.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Seu peso (kg)"
          type="number"
          placeholder="Ex: 70"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value === '' ? '' : Number(e.target.value))}
          disabled={isManual}
        />

        <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border border-primary/20">
          <p className="text-sm text-primary-dark dark:text-primary font-medium">
            Meta recomendada: <span className="text-lg font-bold">{dailyGoal.toLocaleString()} ml</span>
          </p>
        </div>

        <Toggle
          label="Definir meta manualmente"
          checked={isManual}
          onChange={(e) => onManualToggle(e.target.checked)}
        />

        {isManual && (
          <Input
            label="Meta personalizada (ml)"
            type="number"
            placeholder="Ex: 2500"
            value={dailyGoal}
            onChange={handleGoalChange}
            error={error}
          />
        )}
      </div>
    </div>
  );
};
