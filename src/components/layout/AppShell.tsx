import React from "react";
import { BottomNav } from "./BottomNav";
import { InstallBanner } from "../ui/InstallBanner";
import { UpdateBanner } from "../ui/UpdateBanner";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Wrapper principal da aplicação que gerencia a área de conteúdo e a navegação.
 * Garante que o conteúdo não seja sobreposto pela BottomNav.
 */
export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <UpdateBanner />
      
      {/* Header opcional */}
      {title && (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center dark:bg-slate-900/80 dark:border-slate-800">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
        </header>
      )}

      {/* Área de conteúdo */}
      <main className="flex-1 px-4 pt-4 pb-24 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Navegação Inferior */}
      <BottomNav />
      <InstallBanner />
    </div>
  );
}
