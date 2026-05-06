'use client';

import React, { useState, useEffect } from 'react';
import { useHydration } from '@/hooks/useHydration';
import { useReminders } from '@/hooks/useReminders';
import { useSnackbar } from '@/components/ui/Snackbar';
import { HydrationRing } from '@/components/features/dashboard/HydrationRing';
import { QuickAddButton } from '@/components/features/dashboard/QuickAddButton';
import { VolumeShortcuts } from '@/components/features/dashboard/VolumeShortcuts';
import { CustomVolumeInput } from '@/components/features/dashboard/CustomVolumeInput';
import { TodayRecordsList } from '@/components/features/dashboard/TodayRecordsList';
import { MotivationalMessage } from '@/components/features/dashboard/MotivationalMessage';
import { ReminderStatus } from '@/components/features/dashboard/ReminderStatus';
import { IOSInstallBanner } from '@/components/features/dashboard/IOSInstallBanner';
import { GoalReachedBanner } from '@/components/features/dashboard/GoalReachedBanner';
import { formatDisplayDate } from '@/lib/utils/dateUtils';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    todayRecords,
    totalMl,
    goalMl,
    progressPct,
    goalReached,
    defaultCupMl,
    isLoading: isHydrationLoading,
    addWater,
    removeWater,
    checkDayRollover,
    currentDate,
  } = useHydration();

  const {
    isEnabled: isReminderEnabled,
    nextReminderIn,
    startTime,
    endTime,
    permission,
    toggleReminders,
    isLoading: isRemindersLoading,
  } = useReminders();

  const { showSnackbar } = useSnackbar();
  const [isAdding, setIsAdding] = useState(false);

  // Verificar virada de dia ao focar na aba/janela
  useEffect(() => {
    const handleFocus = () => {
      if (checkDayRollover()) {
        showSnackbar({
          message: 'Novo dia! 🌅 Meta resetada.',
          duration: 4000,
        });
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkDayRollover, showSnackbar]);

  const handleAddWater = async (volume: number) => {
    setIsAdding(true);
    try {
      const { id } = await addWater(volume);
      showSnackbar({
        message: `${volume} ml adicionados!`,
        actionLabel: 'Desfazer',
        onAction: () => removeWater(id),
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao adicionar água:', error);
      showSnackbar({ message: 'Erro ao registrar água. tente novamente.' });
    } finally {
      setIsAdding(false);
    }
  };

  const handlePauseReminders = async () => {
    await toggleReminders(false);
    showSnackbar({ message: 'Lembretes pausados por hoje.' });
  };

  const isLoading = isHydrationLoading || isRemindersLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-500 animate-pulse">Carregando seus dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Hoje
          </h1>
          <p className="text-sm font-bold text-primary">
            {formatDisplayDate(currentDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ReminderStatus 
            isEnabled={isReminderEnabled}
            nextReminderIn={nextReminderIn}
            startTime={startTime}
            endTime={endTime}
            permission={permission}
          />
          <Link 
            href="/configuracoes"
            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Banners */}
      <section>
        <IOSInstallBanner />
        <GoalReachedBanner 
          goalReached={goalReached}
          isReminderEnabled={isReminderEnabled}
          onPauseReminders={handlePauseReminders}
        />
      </section>

      {/* Hero Section - Ring & Motivation */}
      <section className="flex flex-col items-center gap-6 py-4">
        <HydrationRing
          totalMl={totalMl}
          goalMl={goalMl}
          progressPct={progressPct}
          goalReached={goalReached}
        />
        <MotivationalMessage progressPct={progressPct} />
      </section>

      {/* Action Section - Quick Add */}
      <section className="space-y-6">
        <QuickAddButton
          volume_ml={defaultCupMl}
          onAdd={handleAddWater}
          isLoading={isAdding}
        />
        
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider px-1">
            Atalhos rápidos
          </h3>
          <VolumeShortcuts onSelect={handleAddWater} disabled={isAdding} />
        </div>

        <CustomVolumeInput onAdd={handleAddWater} />
      </section>

      {/* History Section - Recent Records */}
      <section>
        <TodayRecordsList 
          records={todayRecords} 
          onDelete={async (id) => {
            await removeWater(id);
            showSnackbar({ message: 'Registro removido.' });
          }} 
        />
      </section>
    </div>
  );
}
