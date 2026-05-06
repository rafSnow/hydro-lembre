'use client';

import React from 'react';
import { Flame, Trophy } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCard({ currentStreak, bestStreak }: StreakCardProps) {
  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Comece hoje e construa sua sequência!";
    if (streak >= 1 && streak <= 6) return "Você está começando! Continue!";
    if (streak >= 7 && streak <= 29) return "Uma semana de constância! Incrível!";
    return "Um mês de hidratação! Você é um exemplo!";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
            Sua sequência atual
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-900 dark:text-white">
              {currentStreak}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              dias consecutivos
            </span>
          </div>
        </div>
        <div 
          className={`p-3 rounded-2xl ${currentStreak > 0 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}
          aria-hidden="true"
        >
          <Flame 
            className={`w-8 h-8 ${currentStreak > 0 ? 'text-orange-500 animate-pulse-slow' : 'text-slate-400'}`} 
            fill={currentStreak > 0 ? 'currentColor' : 'none'}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
          <Trophy className="w-4 h-4" />
          <span>{bestStreak} Recorde pessoal</span>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-300 text-sm">
        {getMotivationalMessage(currentStreak)}
      </p>

      {/* Estilo para animação da chama */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
