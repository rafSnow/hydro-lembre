'use client';

import { AppShell } from "@/components/layout/AppShell";
import { SnackbarProvider } from "@/components/ui/Snackbar";
import { useReminders } from "@/hooks/useReminders";
import { useEffect } from "react";
import { reminderScheduler } from "@/lib/notifications/reminderScheduler";

/**
 * Componente interno para inicializar o agendamento de lembretes.
 */
function ReminderSchedulerInitializer() {
  // O hook useReminders já lida com a inicialização do scheduler via useEffect
  useReminders();

  useEffect(() => {
    // Cleanup ao desmontar a aplicação
    return () => reminderScheduler.stop();
  }, []);

  return null;
}

/**
 * Layout compartilhado para as rotas da aplicação (pós-onboarding).
 * Utiliza o AppShell para fornecer navegação e estrutura base.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider>
      <ReminderSchedulerInitializer />
      <AppShell>{children}</AppShell>
    </SnackbarProvider>
  );
}
