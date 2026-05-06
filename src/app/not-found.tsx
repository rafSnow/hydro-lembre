import React from 'react';
import Link from 'next/link';
import { Droplets, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
      <div className="relative mb-8">
        <Droplets size={80} className="text-primary animate-bounce" />
        <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-4 border-slate-50 dark:border-slate-950">
          404
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Opa! Página não encontrada
      </h1>
      
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs">
        Parece que essa gota d'água se perdeu no caminho. Que tal voltar para o início?
      </p>
      
      <Link href="/dashboard">
        <Button className="gap-2 px-8">
          <Home size={18} />
          Voltar ao Dashboard
        </Button>
      </Link>
    </div>
  );
}
