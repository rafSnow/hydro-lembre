import { notificationManager } from './notificationManager';

/**
 * Interface para configuração do scheduler.
 */
interface ReminderConfig {
  intervalMin: number;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  message: string;
}

/**
 * Classe responsável por agendar e executar os lembretes de hidratação.
 * Utiliza setInterval para funcionar enquanto o app estiver aberto.
 */
class ReminderScheduler {
  private timerId: ReturnType<typeof setInterval> | null = null;
  private config: ReminderConfig | null = null;
  private lastNotifiedKey: string | null = null; // Chave para evitar notificações duplicadas (HH:MM)

  /**
   * Inicia o agendamento de lembretes.
   */
  start(config: ReminderConfig): void {
    this.stop();
    this.config = config;

    // Tick a cada 30 segundos para garantir precisão e atualização do dashboard
    this.timerId = setInterval(() => {
      this.tick();
    }, 30000);

    console.log(`Scheduler iniciado: a cada ${config.intervalMin}min das ${config.startTime} às ${config.endTime}`);
    
    // Executa o primeiro tick imediatamente para atualizar estado inicial
    this.tick();
  }

  /**
   * Interrompe o agendamento ativo.
   */
  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Reinicia o agendamento com uma nova configuração.
   */
  restart(config: ReminderConfig): void {
    this.start(config);
  }

  /**
   * Verifica se o scheduler está ativo.
   */
  isActive(): boolean {
    return this.timerId !== null;
  }

  /**
   * Calcula quantos minutos faltam para o próximo lembrete.
   * Considera se estamos dentro da janela de horário.
   */
  getNextReminderIn(): number {
    if (!this.config) return 0;

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    
    const [startH, startM] = this.config.startTime.split(':').map(Number);
    const startMinTotal = startH * 60 + startM;

    const [endH, endM] = this.config.endTime.split(':').map(Number);
    const endMinTotal = endH * 60 + endM;

    // Se ainda não começou hoje
    if (nowMin < startMinTotal) {
      return startMinTotal - nowMin;
    }

    // Se já passou do horário de fim de hoje
    if (nowMin >= endMinTotal) {
      return (24 * 60 - nowMin) + startMinTotal;
    }

    // Se estamos na janela, calculamos o próximo slot a partir do início
    // Ex: Início 08:00, Intervalo 30min -> Slots: 08:00, 08:30, 09:00...
    const minutesSinceStart = nowMin - startMinTotal;
    const nextSlotIn = this.config.intervalMin - (minutesSinceStart % this.config.intervalMin);
    
    // Se o próximo slot ultrapassar o horário de fim, o próximo é amanhã
    if (nowMin + nextSlotIn > endMinTotal) {
        return (24 * 60 - nowMin) + startMinTotal;
    }

    return nextSlotIn === 0 ? this.config.intervalMin : nextSlotIn;
  }

  /**
   * Verifica se o horário atual está dentro da janela permitida.
   */
  isWithinWindow(startTime: string, endTime: string): boolean {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    return nowMin >= startMin && nowMin <= endMin;
  }

  /**
   * Executado periodicamente.
   */
  private async tick(): Promise<void> {
    if (!this.config) return;

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const timeKey = `${now.getHours()}:${now.getMinutes()}`;

    if (this.isWithinWindow(this.config.startTime, this.config.endTime)) {
      const [startH, startM] = this.config.startTime.split(':').map(Number);
      const startMinTotal = startH * 60 + startM;
      
      const minutesSinceStart = nowMin - startMinTotal;
      
      // Verifica se estamos EXATAMENTE em um minuto de lembrete (múltiplo do intervalo)
      const isReminderMinute = minutesSinceStart % this.config.intervalMin === 0;

      if (isReminderMinute && this.lastNotifiedKey !== timeKey) {
        this.lastNotifiedKey = timeKey;
        await notificationManager.sendNotification('HydroLembre 💧', {
          body: this.config.message,
        });
      }
    }
  }
}

// Singleton exportado
export const reminderScheduler = new ReminderScheduler();
