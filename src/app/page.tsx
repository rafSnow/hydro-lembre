'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileRepository } from '@/lib/db/repositories/profileRepository';
import { Droplet } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const done = await profileRepository.isOnboardingDone();
        if (done) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error);
        router.push('/onboarding');
      }
    }
    init();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-white dark:bg-slate-950 p-6 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
        <Droplet className="w-10 h-10 text-primary" fill="currentColor" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
        HydroLembre
      </h1>
      <p className="text-slate-500 dark:text-slate-400 animate-pulse">
        Carregando sua hidratação...
      </p>
    </div>
  );
}
