import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen } from 'lucide-react';
import { lookupSymbol } from '../data/symbols';

interface SymbolModalProps {
  symbol: string | null;
  onClose: () => void;
}

export default function SymbolModal({ symbol, onClose }: SymbolModalProps) {
  return (
    <AnimatePresence>
      {symbol && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className="bg-surface-container-high border border-primary/15 rounded-3xl p-7 max-w-md w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container-highest transition-colors flex items-center justify-center"
            >
              <X size={16} className="text-on-surface-variant" />
            </button>

            <SymbolBody name={symbol} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SymbolBody({ name }: { name: string }) {
  const entry = lookupSymbol(name);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
          {entry.emoji ?? <BookOpen size={20} className="text-primary" />}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60">Symbol Reading</p>
          <h3 className="font-serif text-2xl text-on-surface">{entry.name}</h3>
        </div>
      </div>
      <p className="font-serif italic text-primary/90 text-base leading-relaxed">
        {entry.short}
      </p>
      <p className="text-on-surface-variant text-sm leading-relaxed">
        {entry.long}
      </p>
      <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40 pt-2 border-t border-outline-variant/10">
        Notice how this lands in your body — that’s the truer reading.
      </div>
    </div>
  );
}
