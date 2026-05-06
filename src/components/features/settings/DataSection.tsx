'use client';

import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/components/ui/Snackbar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useLiveQuery } from 'dexie-react-hooks';
import { recordRepository } from '@/lib/db/repositories/recordRepository';
import { Download, Upload, Trash2, AlertTriangle, FileJson, FileSpreadsheet } from 'lucide-react';
import { exportService } from '@/lib/export/exportService';
import { importService } from '@/lib/export/importService';

export const DataSection: React.FC = () => {
  const { resetAllData, resetEverything, isLoading } = useSettings();
  const { showSnackbar } = useSnackbar();
  
  const recordCount = useLiveQuery(() => recordRepository.getRecordCount(), []);
  const firstRecordDate = useLiveQuery(() => recordRepository.getFirstRecordDate(), []);

  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [isResetEverythingModalOpen, setIsResetEverythingModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  // Import states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportErrorModalOpen, setIsImportErrorModalOpen] = useState(false);
  const [importData, setImportData] = useState<string>('');
  const [importValidationErrors, setImportValidationErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  if (isLoading) return null;

  const handleExportJSON = async () => {
    try {
      const json = await exportService.exportToJSON();
      const date = new Date().toISOString().split('T')[0];
      exportService.downloadFile(json, `hydrolembre-backup-${date}.json`, 'application/json');
      showSnackbar({ message: 'Backup JSON exportado com sucesso.' });
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      showSnackbar({ message: 'Erro ao exportar backup.' });
    }
  };

  const handleExportCSV = async () => {
    try {
      const csv = await exportService.exportToCSV();
      const date = new Date().toISOString().split('T')[0];
      exportService.downloadFile(csv, `hydrolembre-registros-${date}.csv`, 'text/csv');
      showSnackbar({ message: 'Registros CSV exportados com sucesso.' });
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      showSnackbar({ message: 'Erro ao exportar CSV.' });
    }
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const validation = importService.validateJSON(content);
          if (validation.valid) {
            setImportData(content);
            setImportValidationErrors([]);
            setIsImportModalOpen(true);
          } else {
            setImportValidationErrors(validation.errors);
            setIsImportErrorModalOpen(true);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const executeImport = async () => {
    try {
      const result = await importService.importFromJSON(importData, importMode);
      if (result.success) {
        showSnackbar({ message: `${result.imported} registros importados com sucesso.` });
        setIsImportModalOpen(false);
        // Recarregar para garantir que o tema e outras settings sejam aplicadas
        if (importMode === 'replace') {
          setTimeout(() => window.location.reload(), 1500);
        }
      } else {
        setImportValidationErrors(result.errors);
        setIsImportModalOpen(false);
        setIsImportErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Erro na importação:', error);
      showSnackbar({ message: 'Erro inesperado durante a importação.' });
    }
  };

  const handleClearHistory = async () => {
    try {
      await resetAllData();
      showSnackbar({ message: 'Histórico limpo com sucesso.' });
      setIsClearHistoryModalOpen(false);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      showSnackbar({ message: 'Erro ao limpar dados.' });
    }
  };

  const handleResetEverything = async () => {
    if (confirmText !== 'CONFIRMAR') {
      showSnackbar({ message: 'Digite CONFIRMAR para prosseguir.' });
      return;
    }
    try {
      await resetEverything();
    } catch (error) {
      console.error('Erro ao resetar tudo:', error);
      showSnackbar({ message: 'Erro ao resetar aplicação.' });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <section className="space-y-8">
      {/* Stats */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-white">{recordCount || 0}</span> registros armazenados desde <span className="font-bold text-slate-900 dark:text-white">{formatDate(firstRecordDate)}</span>
        </p>
      </div>

      {/* Export/Import Actions */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" className="gap-2 justify-start" onClick={handleExportJSON}>
            <FileJson size={18} className="text-blue-500" />
            <div className="text-left">
              <p className="text-sm font-semibold">Exportar JSON</p>
              <p className="text-xs text-slate-500">Backup completo</p>
            </div>
          </Button>
          
          <Button variant="outline" className="gap-2 justify-start" onClick={handleExportCSV}>
            <FileSpreadsheet size={18} className="text-green-500" />
            <div className="text-left">
              <p className="text-sm font-semibold">Exportar CSV</p>
              <p className="text-xs text-slate-500">Para Excel / Sheets</p>
            </div>
          </Button>
        </div>

        <Button variant="outline" className="w-full gap-2 py-6 border-dashed" onClick={handleImportFile}>
          <Upload size={18} />
          <div className="text-left">
            <p className="text-sm font-semibold">Importar Backup JSON</p>
            <p className="text-xs text-slate-500">Restaure seus dados de outro dispositivo</p>
          </div>
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <Button
          variant="outline"
          className="w-full gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
          onClick={() => setIsClearHistoryModalOpen(true)}
        >
          <Trash2 size={18} />
          Limpar histórico
        </Button>

        <Button
          variant="destructive"
          className="w-full gap-2"
          onClick={() => setIsResetEverythingModalOpen(true)}
        >
          <AlertTriangle size={18} />
          Apagar tudo
        </Button>
      </div>

      {/* Import Confirmation Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar dados"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsImportModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={executeImport}>
              Confirmar Importação
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Como você deseja importar os dados?
          </p>
          
          <div className="space-y-2">
            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-colors cursor-pointer ${importMode === 'merge' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800'}`}>
              <input 
                type="radio" 
                name="importMode" 
                className="mt-1"
                checked={importMode === 'merge'} 
                onChange={() => setImportMode('merge')} 
              />
              <div>
                <p className="font-semibold text-sm">Mesclar com dados atuais</p>
                <p className="text-xs text-slate-500 italic">Adiciona apenas novos registros, preservando os atuais.</p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-colors cursor-pointer ${importMode === 'replace' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-100 dark:border-slate-800'}`}>
              <input 
                type="radio" 
                name="importMode" 
                className="mt-1"
                checked={importMode === 'replace'} 
                onChange={() => setImportMode('replace')} 
              />
              <div>
                <p className="font-semibold text-sm text-red-600 dark:text-red-400">Substituir tudo</p>
                <p className="text-xs text-slate-500 italic">Apaga todos os dados atuais e substitui pelo backup.</p>
              </div>
            </label>
          </div>
        </div>
      </Modal>

      {/* Import Error Modal */}
      <Modal
        isOpen={isImportErrorModalOpen}
        onClose={() => setIsImportErrorModalOpen(false)}
        title="Erro na Importação"
        footer={
          <Button onClick={() => setIsImportErrorModalOpen(false)}>
            Fechar
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
            <AlertTriangle size={18} className="shrink-0" />
            <p>Ocorreram erros ao validar ou importar o arquivo:</p>
          </div>
          <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
            {importValidationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      </Modal>

      {/* Clear History Modal */}
      <Modal
        isOpen={isClearHistoryModalOpen}
        onClose={() => setIsClearHistoryModalOpen(false)}
        title="Limpar Histórico"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsClearHistoryModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClearHistory}>
              Limpar Dados
            </Button>
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-400">
          Isso apagará todos os seus registros de água e metas diárias, mas manterá seu perfil e configurações. Esta ação não pode ser desfeita.
        </p>
      </Modal>

      {/* Reset Everything Modal */}
      <Modal
        isOpen={isResetEverythingModalOpen}
        onClose={() => setIsResetEverythingModalOpen(false)}
        title="Apagar Tudo"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsResetEverythingModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetEverything}
              disabled={confirmText !== 'CONFIRMAR'}
            >
              Apagar Absolutamente Tudo
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
            <AlertTriangle size={18} className="shrink-0" />
            <p className="font-bold uppercase">Atenção Máxima!</p>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Esta ação removerá todos os dados, configurações, lembretes e progresso. O aplicativo será reiniciado como se fosse a primeira vez.
          </p>
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">
              Digite CONFIRMAR para autorizar:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="CONFIRMAR"
              className="text-center font-bold tracking-widest border-red-200 focus:ring-red-500"
            />
          </div>
        </div>
      </Modal>
    </section>
  );
};
