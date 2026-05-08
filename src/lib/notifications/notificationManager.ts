/**
 * Gerenciador de notificações para o HydroLembre.
 * Lida com suporte do navegador, permissões e envio de notificações.
 */

export const notificationManager = {
  /**
   * Verifica se o navegador suporta a Notification API.
   */
  checkSupport(): { supported: boolean; reason?: string } {
    if (typeof window === 'undefined') return { supported: false, reason: 'SSR' };

    const isNotificationSupported = 'Notification' in window;
    
    if (!isNotificationSupported) {
      if (this.isIOS()) {
        return { 
          supported: false, 
          reason: 'O iOS requer que o app seja instalado na Tela de Início para suportar notificações.' 
        };
      }
      return { supported: false, reason: 'Este navegador não suporta notificações.' };
    }

    return { supported: true };
  },

  /**
   * Obtém o estado atual da permissão de notificação.
   */
  getPermission(): NotificationPermission | 'unsupported' {
    const support = this.checkSupport();
    if (!support.supported) return 'unsupported';
    return Notification.permission;
  },

  /**
   * Solicita permissão ao usuário para enviar notificações.
   */
  async requestPermission(): Promise<NotificationPermission> {
    const support = this.checkSupport();
    if (!support.supported) return 'denied';

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return 'denied';
    }
  },

  /**
   * Envia uma notificação se disponível e permitido.
   */
  async sendNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    const permission = this.getPermission();
    
    if (permission !== 'granted') {
      console.warn('Tentativa de enviar notificação sem permissão ou suporte.');
      return false;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options,
    };

    try {
      // Tenta usar o Service Worker para mostrar a notificação (melhor para PWA/Android)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && 'showNotification' in registration) {
          await registration.showNotification(title, defaultOptions);
          return true;
        }
      }

      // Fallback para a API de Notificação padrão
      new Notification(title, defaultOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  },

  /**
   * Detecta se o dispositivo é iOS (iPhone, iPad, iPod).
   */
  isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) && 
      !(window as any).MSStream
    );
  },

  /**
   * Verifica se o iOS precisa de instalação na Home Screen para notificações.
   */
  needsHomeScreenInstall(): boolean {
    if (!this.isIOS()) return false;
    
    // Se for iOS e não estiver em modo standalone (PWA instalado)
    const isStandalone = 
      (window.navigator as any).standalone || 
      window.matchMedia('(display-mode: standalone)').matches;
    
    return !isStandalone;
  }
};
