'use client';

import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { reminderScheduler } from '@/lib/notifications/reminderScheduler';

interface ReminderStatusProps {
  isEnabled: boolean;
  nextReminderIn: number;
  startTime: string;
  endTime: string;
  permission: NotificationPermission | 'unsupported';
}

export const ReminderStatus: React.FC<ReminderStatusProps> = ({
  isEnabled,
  nextReminderIn,
  startTime,
  endTime,
  permission,
}) => {
  const isWithinWindow = reminderScheduler.isWithinWindow(startTime, endTime);
  const isGranted = permission === 'granted';

  if (!isEnabled) {
    return (
      <Link href="/configuracoes">
        <Badge variant="gray" className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <BellOff size={12} />
          Lembretes desativados
        </Badge>
      </Link>
    );
  }

  if (!isGranted) {
    return (
      <Link href="/configuracoes">
        <Badge variant="warning" className="flex items-center gap-1.5 cursor-pointer hover:bg-warning/20 transition-colors">
          <Bell size={12} />
          Sem permissão
        </Badge>
      </Link>
    );
  }

  if (!isWithinWindow) {
    return (
      <Badge variant="gray" className="flex items-center gap-1.5">
        <BellOff size={12} />
        Fora do horário ({startTime}-{endTime})
      </Badge>
    );
  }

  return (
    <Badge variant="primary" className="flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20">
      <Bell size={12} className="animate-pulse" />
      Próximo em {nextReminderIn}min
    </Badge>
  );
};
