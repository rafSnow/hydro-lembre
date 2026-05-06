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

  /**
   * Inicia o agendamento de lembretes.
   */
  start(config: ReminderConfig): void {
    this.stop();
    this.config = config;

    // Converte minutos para milissegundos
    const intervalMs = config.intervalMin * 60 * 1000;

    this.timerId = setInterval(() => {
      this.tick();
    }, intervalMs);

    console.log(`Scheduler iniciado: a cada ${config.intervalMin}min das ${config.startTime} às ${config.endTime}`);
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
    const [startH, startM] = this.config.startTime.split(':').map(Number);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const startMin = startH * 60 + startM;

    // Se ainda não chegamos no horário de início de hoje
    if (nowMin < startMin) {
      return startMin - nowMin;
    }

    // Se já passou do horário de fim de hoje, o próximo é amanhã no início
    const [endH, endM] = this.config.endTime.split(':').map(Number);
    const endMin = endH * 60 + endM;
    if (nowMin > endMin) {
      return (24 * 60 - nowMin) + startMin;
    }

    // Se estamos dentro da janela, o próximo é daqui a um intervalo
    return this.config.intervalMin;
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
   * Executado a cada intervalo do setInterval.
   */
  private tick(): void {
    if (!this.config) return;

    if (this.isWithinWindow(this.config.startTime, this.config.endTime)) {
      notificationManager.sendNotification('HydroLembre 💧', {
        body: this.config.message,
      });
    }
  }
}

// Singleton exportado
export const reminderScheduler = new ReminderScheduler();
