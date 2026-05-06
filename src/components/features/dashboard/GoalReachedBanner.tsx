'use client';

import React from 'react';
import { Trophy, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GoalReachedBannerProps {
  goalReached: boolean;
  isReminderEnabled: boolean;
  onPauseReminders: () => void;
}

export const GoalReachedBanner: React.FC<GoalReachedBannerProps> = ({
  goalReached,
  isReminderEnabled,
  onPauseReminders,
}) => {
  const [confetti, setConfetti] = React.useState<Array<{left: string, color: string, duration: string, delay: string}>>([]);

  React.useEffect(() => {
    if (goalReached && confetti.length === 0) {
      // Use queueMicrotask to avoid 'synchronous setState in effect' warning
      queueMicrotask(() => {
        const newConfetti = [...Array(12)].map(() => ({
          left: `${Math.random() * 100}%`,
          color: ['#0EA5E9', '#38BDF8', '#7DD3FC', '#0284C7'][Math.floor(Math.random() * 4)],
          duration: `${2 + Math.random() * 3}s`,
          delay: `${Math.random() * 5}s`,
        }));
        setConfetti(newConfetti);
      });
    }
  }, [goalReached, confetti.length]);

  if (!goalReached) return null;

  return (
    <div className="relative bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-6 overflow-hidden text-center">
      {/* Confetti Animation via CSS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((c, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              top: '-10%',
              left: c.left,
              backgroundColor: c.color,
              animation: `confetti-fall ${c.duration} linear infinite`,
              animationDelay: c.delay,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="bg-primary/20 p-3 rounded-full text-primary">
          <Trophy size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Meta Atingida! 🎉
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 max-w-[280px]">
          Parabéns pela hidratação de hoje! Você está cuidando muito bem da sua saúde.
        </p>

        {isReminderEnabled && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-2 flex items-center gap-2"
            onClick={onPauseReminders}
          >
            <BellOff size={16} />
            Pausar lembretes de hoje
          </Button>
        )}
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(120vh) rotate(720deg); }
        }
      `}</style>
    </div>
  );
};
