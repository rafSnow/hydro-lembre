'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsRepository } from '@/lib/db/repositories/settingsRepository';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Load initial theme from DB and localStorage
  useEffect(() => {
    const initTheme = async () => {
      try {
        const savedTheme = await settingsRepository.getSetting<Theme>('theme');
        const localTheme = localStorage.getItem('theme') as Theme | null;
        
        if (savedTheme) {
          setThemeState(savedTheme);
        } else if (localTheme) {
          setThemeState(localTheme);
        }
      } catch (e) {
        console.error('Failed to load theme:', e);
      }
    };
    initTheme();
  }, []);

  // Effect to apply theme whenever 'theme' state changes
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme: Theme) => {
      let resolved: 'light' | 'dark' = 'light';
      
      if (currentTheme === 'system') {
        resolved = mediaQuery.matches ? 'dark' : 'light';
      } else {
        resolved = currentTheme;
      }

      setResolvedTheme(resolved);
      
      if (resolved === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme(theme);

    // Listen for system changes if system theme is selected
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    console.log('Setting theme to:', newTheme);
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    try {
      await settingsRepository.setSetting('theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme to DB:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
