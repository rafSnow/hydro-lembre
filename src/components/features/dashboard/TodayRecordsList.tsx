'use client';

import React from 'react';
import { type WaterRecord } from '@/lib/db/types';
import { format } from 'date-fns';
import { Trash2, Droplet, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { today } from '@/lib/utils/dateUtils';

interface TodayRecordsListProps {
  records: WaterRecord[];
  onDelete: (id: number) => void;
  maxItems?: number;
}

export const TodayRecordsList: React.FC<TodayRecordsListProps> = ({
  records,
  onDelete,
  maxItems = 3,
}) => {
  const displayRecords = records.slice(-maxItems).reverse();
  const hasMore = records.length > maxItems;

  if (records.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-primary/5 dark:bg-primary/5 rounded-2xl border border-dashed border-primary/20">
        <Droplet className="w-8 h-8 text-primary/30 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Nenhum registro ainda hoje</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Últimos registros
        </h3>
        {hasMore && (
          <Link 
            href={`/historico/dia?date=${today()}`}
            className="text-xs text-primary font-bold flex items-center gap-0.5 hover:underline"
          >
            Ver todos
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {displayRecords.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Droplet className="w-4 h-4 text-primary" fill="currentColor" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {record.volume_ml} ml
                </p>
                <p className="text-[10px] text-primary/60 font-medium">
                  {format(record.timestamp, 'HH:mm')}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => record.id && onDelete(record.id)}
              className="p-2 text-primary/40 hover:text-red-500 transition-colors"
              aria-label="Excluir registro"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
