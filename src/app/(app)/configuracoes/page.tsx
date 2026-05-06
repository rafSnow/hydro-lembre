'use client';

import React from 'react';
import { ProfileSection } from '@/components/features/settings/ProfileSection';
import { RemindersSection } from '@/components/features/settings/RemindersSection';
import { QuickVolumesSection } from '@/components/features/settings/QuickVolumesSection';
import { AppearanceSection } from '@/components/features/settings/AppearanceSection';
import { DataSection } from '@/components/features/settings/DataSection';
import { User, Bell, LayoutGrid, Palette, Database, Info } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 px-1">
      <div className="text-primary">{icon}</div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
        {title}
      </h2>
    </div>
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  return (
    <div className="space-y-10 pb-10">
      <SettingsSection title="Perfil" icon={<User size={20} />}>
        <ProfileSection />
      </SettingsSection>

      <SettingsSection title="Lembretes" icon={<Bell size={20} />}>
        <RemindersSection />
      </SettingsSection>

      <SettingsSection title="Atalhos de Volume" icon={<LayoutGrid size={20} />}>
        <QuickVolumesSection />
      </SettingsSection>

      <SettingsSection title="Aparência" icon={<Palette size={20} />}>
        <AppearanceSection />
      </SettingsSection>

      <SettingsSection title="Seus Dados" icon={<Database size={20} />}>
        <DataSection />
      </SettingsSection>

      <SettingsSection title="Sobre" icon={<Info size={20} />}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Versão</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
              v1.0.0
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            HydroLembre é um PWA focado em privacidade e simplicidade para te ajudar a manter o hábito de beber água. Seus dados nunca saem do seu dispositivo.
          </p>
          <button className="text-sm text-primary font-semibold hover:underline">
            Política de Privacidade
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
