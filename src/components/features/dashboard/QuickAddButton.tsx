'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Droplets } from 'lucide-react';

interface QuickAddButtonProps {
  volume_ml: number;
  onAdd: (volume: number) => void;
  isLoading?: boolean;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  volume_ml,
  onAdd,
  isLoading,
}) => {
  return (
    <Button
      onClick={() => onAdd(volume_ml)}
      isLoading={isLoading}
      size="lg"
      className="w-full flex-col h-auto py-6 gap-2 shadow-lg shadow-primary/20"
      aria-label={`Registrar consumo de ${volume_ml} ml de água`}
    >
      <div className="flex items-center gap-2">
        <Droplets className="w-6 h-6" />
        <span className="text-xl">Beber Água</span>
      </div>
      <span className="text-sm font-normal opacity-90">
        Volume padrão: {volume_ml} ml
      </span>
    </Button>
  );
};
