'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { recordRepository } from '@/lib/db/repositories/recordRepository';
import { profileRepository } from '@/lib/db/repositories/profileRepository';
import { goalRepository } from '@/lib/db/repositories/goalRepository';
import { formatLongDate } from '@/lib/utils/dateUtils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SwipeableItem } from '@/components/ui/SwipeableItem';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSnackbar } from '@/components/ui/Snackbar';
import { ChevronLeft, Trash2, Edit2, Droplets } from 'lucide-react';
import { format } from 'date-fns';

export default function DayDetailPage() {
  const { date } = useParams() as { date: string };
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const records = useLiveQuery(() => recordRepository.getRecordsByDate(date), [date]);
  const profile = useLiveQuery(() => profileRepository.getProfile(), []);
  const customGoal = useLiveQuery(() => goalRepository.getGoalForDate(date), [date]);

  const [editingRecord, setEditingRecord] = useState<{ id: number; volume: string } | null>(null);

  const totalMl = records?.reduce((acc, r) => acc + r.volume_ml, 0) ?? 0;
  const goalMl = customGoal ?? profile?.daily_goal_ml ?? 2000;
  const progressPct = Math.min(Math.round((totalMl / goalMl) * 100), 100);

  const handleDelete = async (id: number, volume: number) => {
    try {
      await recordRepository.deleteRecord(id);
      showSnackbar({
        message: 'Registro removido.',
        actionLabel: 'Desfazer',
        onAction: async () => {
          await recordRepository.addRecordToDate(volume, date);
        },
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingRecord) return;
    const vol = Number(editingRecord.volume);
    if (!vol || vol < 1 || vol > 2000) {
      showSnackbar({ message: 'Volume inválido.' });
      return;
    }
    try {
      await recordRepository.updateRecord(editingRecord.id, vol);
      setEditingRecord(null);
      showSnackbar({ message: 'Registro atualizado.' });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full p-2 h-auto">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
          {formatLongDate(date)}
        </h1>
      </div>

      {/* Summary Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total consumido</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-primary">{totalMl}</span>
              <span className="text-sm font-bold text-slate-400">/ {goalMl} ml</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Progresso</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{progressPct}%</div>
          </div>
        </div>
        <ProgressBar progress={progressPct} showPct={false} className="h-3" />
      </div>

      {/* Records List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          Registros do dia
        </h2>

        {records && records.length > 0 ? (
          <div className="space-y-3">
            {records.map((record) => (
              <SwipeableItem
                key={record.id}
                threshold={100}
                actions={
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl"
                      onClick={() => setEditingRecord({ id: record.id!, volume: record.volume_ml.toString() })}
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl"
                      onClick={() => handleDelete(record.id!, record.volume_ml)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                }
              >
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white">
                        {record.volume_ml} ml
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {format(record.timestamp, 'HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:hidden">
                     <span className="text-xs text-slate-300 italic">Deslize para editar</span>
                  </div>
                  <div className="hidden sm:flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingRecord({ id: record.id!, volume: record.volume_ml.toString() })}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => handleDelete(record.id!, record.volume_ml)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Droplets size={32} />
            </div>
            <p className="text-slate-500 font-medium">Nenhum registro neste dia.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Editar registro"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingRecord(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>
              Salvar alterações
            </Button>
          </>
        }
      >
        <Input
          label="Volume (ml)"
          type="number"
          value={editingRecord?.volume || ''}
          onChange={(e) => setEditingRecord(prev => prev ? { ...prev, volume: e.target.value } : null)}
          placeholder="Ex: 200"
          autoFocus
        />
      </Modal>
    </div>
  );
}
