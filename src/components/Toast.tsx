import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastCtx {
  push: (text: string, tone?: ToastMessage['tone']) => void;
}

const Ctx = createContext<ToastCtx>({ push: () => {} });

export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = useCallback((text: string, tone: ToastMessage['tone'] = 'info') => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[min(92vw,360px)]">
        <AnimatePresence>
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} />
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

function ToastItem({ toast }: { key?: React.Key; toast: ToastMessage }) {
  const Icon = toast.tone === 'success' ? CheckCircle2 : toast.tone === 'error' ? AlertCircle : Info;
  const accent =
    toast.tone === 'success' ? 'text-primary' :
    toast.tone === 'error'   ? 'text-tertiary' :
    'text-on-surface-variant';
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="pointer-events-auto bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant/15 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3"
    >
      <Icon size={16} className={accent} />
      <span className="text-sm text-on-surface flex-1">{toast.text}</span>
    </motion.div>
  );
}

/**
 * Minimal hook for measurements & responsive state. Lives here so
 * components can share it without spinning up another file.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
