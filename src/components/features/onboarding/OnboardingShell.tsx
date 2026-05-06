'use client';

import React from 'react';
import { Droplet, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OnboardingShellProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export const OnboardingShell: React.FC<OnboardingShellProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  isSubmitting,
  children,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Droplet className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <h1 className="text-xl font-black text-primary tracking-tight">
              HydroLembre
            </h1>
          </div>
          
          {currentStep > 1 && currentStep < 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-slate-500 hover:text-slate-900 px-2"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Voltar
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-md mx-auto space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={onNext}
            isLoading={isSubmitting}
          >
            {currentStep === totalSteps ? 'Concluir' : 'Próximo'}
          </Button>
          
          {currentStep < 5 && (
            <Button
              variant="ghost"
              className="w-full text-slate-400"
              onClick={onSkip}
              disabled={isSubmitting}
            >
              Pular por agora
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};
