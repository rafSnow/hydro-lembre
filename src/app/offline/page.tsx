'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-sky-100 dark:border-slate-700 max-w-sm w-full space-y-6">
        <div className="bg-sky-100 dark:bg-sky-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <WifiOff className="w-10 h-10 text-sky-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Você está offline
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Parece que você está sem conexão. O HydroLembre funciona offline para registros, mas esta página ainda não foi carregada.
          </p>
        </div>

        <Button 
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
