"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplet, Calendar, BarChart3, Settings } from "lucide-react";

/**
 * Componente de navegação inferior fixo para mobile.
 * Apresenta 4 abas principais com indicação visual da rota ativa.
 */
export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", icon: Droplet, href: "/dashboard" },
    { label: "Histórico", icon: Calendar, href: "/historico" },
    { label: "Stats", icon: BarChart3, href: "/estatisticas" },
    { label: "Ajustes", icon: Settings, href: "/configuracoes" },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe dark:bg-slate-900 dark:border-slate-800"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              <item.icon
                size={24}
                className={isActive ? "fill-primary/10" : ""}
              />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
