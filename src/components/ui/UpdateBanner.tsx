'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const sw = navigator.serviceWorker;

      // Listener para novas versões
      const handleControllerChange = () => {
        // Recarrega apenas se for uma nova ativação
        // window.location.reload();
      };

      sw.addEventListener('controllerchange', handleControllerChange);

      // Verifica se há um SW esperando
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          setShowBanner(true);
        }

        if (reg) {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowBanner(true);
                }
              });
            }
          });
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-slide-down">
      <div className="bg-sky-500 text-white rounded-2xl shadow-xl p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Nova versão disponível 🎉</p>
            <p className="text-xs opacity-90">Atualize para as últimas melhorias.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={handleUpdate}
            className="bg-white text-sky-600 hover:bg-sky-50"
          >
            Atualizar
          </Button>
          <button 
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-white/10 rounded-full"
            aria-label="Ignorar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
