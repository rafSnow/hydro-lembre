'use client';

import React from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLiveQuery } from 'dexie-react-hooks';
import { settingsRepository } from '@/lib/db/repositories/settingsRepository';
import { notificationManager } from '@/lib/notifications/notificationManager';

export const IOSInstallBanner: React.FC = () => {
  const isDismissed = useLiveQuery(() => settingsRepository.getSetting<boolean>('ios_banner_dismissed'), []);
  const needsInstall = notificationManager.needsHomeScreenInstall();

  if (isDismissed || !needsInstall) {
    return null;
  }

  const handleDismiss = async () => {
    await settingsRepository.setSetting('ios_banner_dismissed', true);
  };

  return (
    <div className="relative bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-5 mb-6 overflow-hidden">
      <button 
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Ativar Notificações no iOS
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Para receber lembretes de hidratação no iPhone, você precisa adicionar este app à sua Tela de Início.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-white dark:border-slate-800">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Share size={20} className="text-primary-dark dark:text-primary" />
            </div>
            <span className="text-sm font-medium">1. Toque no botão de Compartilhar</span>
          </div>

          <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-white dark:border-slate-800">
            <div className="bg-primary/20 p-2 rounded-lg">
              <PlusSquare size={20} className="text-primary-dark dark:text-primary" />
            </div>
            <span className="text-sm font-medium">2. Role e toque em &quot;Adicionar à Tela de Início&quot;</span>
          </div>
        </div>

        <Button size="sm" variant="outline" className="w-full mt-2" onClick={handleDismiss}>
          Entendi
        </Button>
      </div>
      
      {/* Decoração visual */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
