'use client';

import React from 'react';

interface MotivationalMessageProps {
  progressPct: number;
  name?: string;
}

export const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ 
  progressPct, 
  name 
}) => {
  const userName = name || 'amigo';
  
  const getMessage = () => {
    if (progressPct === 0) return `Bom dia, ${userName}! Vamos começar a se hidratar? 💧`;
    if (progressPct < 25) return "Ótimo começo! Continue assim 🌊";
    if (progressPct < 50) return `Você está indo bem! Já ${progressPct}% da meta 👍`;
    if (progressPct < 75) return "Metade do caminho! Você está arrasando 🚀";
    if (progressPct < 100) return "Quase lá! Só mais um pouco para completar 💪";
    return "Meta atingida! Parabéns pela hidratação de hoje 🎉";
  };

  return (
    <div className="text-center px-4">
      <p className="text-base font-bold text-primary dark:text-primary leading-relaxed">
        {getMessage()}
      </p>
    </div>
  );
};
