'use client';

import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePWA } from '@/hooks/usePWA';
import { Modal } from '@/components/ui/Modal';

export const AppSection: React.FC = () => {
  const { isStandalone, isIOS, canInstall, install } = usePWA();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      install();
    }
  };

  if (isStandalone) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <p className="text-sm font-medium">
            Você já está usando a versão instalada do HydroLembre.
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
          Aproveite acesso offline, carregamento mais rápido e notificações aprimoradas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl text-sky-600 dark:text-sky-400">
            {isIOS ? <Smartphone size={24} /> : <Download size={24} />}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isIOS ? 'Adicionar à Tela de Início' : 'Instalar Aplicativo'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isIOS 
                ? 'Tenha o HydroLembre na sua tela inicial para acesso rápido e melhor experiência.' 
                : 'Instale o HydroLembre para usar offline e ter uma experiência de aplicativo nativo.'}
            </p>
          </div>
        </div>

        <Button 
          onClick={handleInstallClick}
          disabled={!canInstall && !isIOS}
          className="w-full justify-center gap-2"
          variant={canInstall || isIOS ? 'primary' : 'secondary'}
        >
          {isIOS ? (
            <>
              <Smartphone size={18} />
              Ver Instruções
            </>
          ) : (
            <>
              <Download size={18} />
              {canInstall ? 'Instalar Agora' : 'Instalação não disponível'}
            </>
          )}
        </Button>

        {!canInstall && !isIOS && !isStandalone && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 text-xs">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              O seu navegador ou dispositivo pode não suportar a instalação automática. 
              Tente procurar por "Instalar" ou "Adicionar à tela de início" no menu do navegador.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
        title="Instalar no iOS"
      >
        <div className="space-y-6 py-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-400">
                1
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima) na barra inferior do Safari.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-400">
                2
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Role para baixo e toque em <strong>Adicionar à Tela de Início</strong>.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-400">
                3
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Toque em <strong>Adicionar</strong> no canto superior direito para confirmar.
              </p>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => setShowIOSInstructions(false)}
          >
            Entendi
          </Button>
        </div>
      </Modal>
    </div>
  );
};
