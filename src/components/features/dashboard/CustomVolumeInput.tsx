'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface CustomVolumeInputProps {
  onAdd: (volume: number) => void;
}

export const CustomVolumeInput: React.FC<CustomVolumeInputProps> = ({ onAdd }) => {
  const [volume, setVolume] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAdd = () => {
    const val = parseInt(volume);
    if (isNaN(val) || val < 1 || val > 2000) {
      setError('Volume deve ser entre 1 e 2000 ml');
      return;
    }
    
    onAdd(val);
    setVolume('');
    setError('');
  };

  return (
    <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Volume personalizado
      </h3>
      <div className="flex gap-2">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Ex: 250"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          error={error}
          className="h-11"
        />
        <Button 
          onClick={handleAdd}
          className="shrink-0 h-11 px-4"
          variant="secondary"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};
