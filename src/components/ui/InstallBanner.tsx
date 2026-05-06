'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detecta iOS
    const userAgent = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(userAgent) && !((window as any).MSStream);
    
    // Verifica se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || (typeof document !== 'undefined' && document.referrer.includes('android-app://'));

    if (isStandalone) return;

    setIsIOS(ios);

    // Verifica se o usuário dispensou recentemente (7 dias)
    const lastDismissed = localStorage.getItem('pwa_install_dismissed');
    if (lastDismissed) {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(lastDismissed) < sevenDays) {
        return;
      }
    }

    // Listener para o evento de instalação do Chrome/Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      // Mostra o banner após 15 segundos
      setTimeout(() => setShowBanner(true), 15000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para iOS, mostramos o banner de qualquer forma pois não há evento
    if (ios) {
      setTimeout(() => setShowBanner(true), 20000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      deferredPrompt.current = null;
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

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
          {!isIOS && (
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
