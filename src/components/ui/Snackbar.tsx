'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface SnackbarOptions {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarOptions | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideSnackbar = useCallback(() => {
    setSnackbar(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const showSnackbar = useCallback((options: SnackbarOptions) => {
    // Se já houver um snackbar, limpa o timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setSnackbar(options);

    const duration = options.duration || 5000;
    timerRef.current = setTimeout(() => {
      hideSnackbar();
    }, duration);
  }, [hideSnackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          actionLabel={snackbar.actionLabel}
          onAction={() => {
            snackbar.onAction?.();
            hideSnackbar();
          }}
          onDismiss={hideSnackbar}
        />
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, actionLabel, onAction, onDismiss }) => {
  return (
    <div 
      className="fixed bottom-24 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4">
        <p className="text-sm font-medium">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="text-primary font-bold text-sm uppercase tracking-wider hover:text-primary-dark transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
