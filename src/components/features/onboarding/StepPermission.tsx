'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface StepPermissionProps {
  onNext: () => void;
}

export const StepPermission: React.FC<StepPermissionProps> = ({ onNext }) => {
  const [status, setStatus] = React.useState<NotificationPermission | 'not-supported' | 'idle'>('idle');

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      setStatus('not-supported');
      return;
    }

    const permission = await Notification.requestPermission();
    setStatus(permission);
    
    if (permission === 'granted') {
      setTimeout(onNext, 1500);
    }
  };

  const isIOS = () => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  };

  return (
    <div className="space-y-8 text-center py-4">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Ativar notificações
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Não perca o horário da sua hidratação. Enviaremos lembretes gentis durante o dia.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
            <Bell className="w-12 h-12 text-primary" />
          </div>
          {status === 'granted' && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {status === 'idle' && (
          <Button onClick={requestPermission} className="w-full" size="lg">
            Ativar Notificações
          </Button>
        )}

        {status === 'granted' && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3 text-left">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <p className="text-sm font-medium text-success-dark">
              ✅ Notificações ativadas! Você será avisado nos horários configurados.
            </p>
          </div>
        )}

        {status === 'denied' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-900 dark:text-red-400">
                  Notificações bloqueadas
                </p>
                <p className="text-xs text-red-700 dark:text-red-500/80">
                  Para receber lembretes, você precisa permitir as notificações nas configurações do seu navegador.
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onNext} className="w-full">
              Continuar sem notificações
            </Button>
          </div>
        )}

        {status === 'not-supported' && isIOS() && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">
                Suporte no iOS
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-500/80">
                Para receber notificações no iOS, adicione este app à sua Tela de Início (Compartilhar &gt; Adicionar à Tela de Início).
              </p>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <Button variant="ghost" onClick={onNext} className="w-full">
            Pular por agora
          </Button>
        )}
      </div>
    </div>
  );
};
