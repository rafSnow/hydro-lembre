'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePWA } from '@/hooks/usePWA';

export function InstallBanner() {
  const { isStandalone, isIOS, canInstall, install } = usePWA();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    // Verifica se o usuário dispensou recentemente (7 dias)
    const lastDismissed = localStorage.getItem('pwa_install_dismissed');
    if (lastDismissed) {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(lastDismissed) < sevenDays) {
        return;
      }
    }

    // Mostra o banner após um delay se puder instalar ou se for iOS
    if (canInstall || isIOS) {
      const timer = setTimeout(() => setShowBanner(true), 15000);
      return () => clearTimeout(timer);
    }
  }, [isStandalone, canInstall, isIOS]);

  const handleInstall = async () => {
    if (isIOS) {
      // No iOS apenas mostramos o banner com as instruções
      // O botão "Instalar" não aparece para iOS no banner original,
      // mas mantemos a lógica por segurança.
      return;
    }
    await install();
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
  };

  if (!showBanner || isStandalone) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-sky-100 dark:border-slate-700 p-4 flex items-center gap-4">
        <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl flex-shrink-0">
          {isIOS ? (
            <Smartphone className="w-6 h-6 text-sky-500" />
          ) : (
            <Download className="w-6 h-6 text-sky-500" />
          )}
        </div>
        
        <div className="flex-grow">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Instale o HydroLembre
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isIOS 
              ? 'Toque em compartilhar e "Adicionar à Tela de Início"' 
              : 'Use offline e receba lembretes melhorados.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isIOS && canInstall && (
            <Button size="sm" onClick={handleInstall}>
              Instalar
            </Button>
          )}
          <button 
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
