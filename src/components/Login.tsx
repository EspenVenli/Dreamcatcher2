import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Key } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Ethereal Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary-container/5 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[60%] h-[50%] rounded-full bg-secondary-container/5 blur-[100px]" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcUejIcgOCcghwI1EzTuKoQjRW2xe0JoKePb-lKv3NgAgndRzfXyqOGrKJY7BaevOV08wIhh9zHNIVsiTfoG98JSWBThp_mfRiJNMkkDHZLhUkR4UOcQEm1o3NfKQtDlkCBMw4jDbUZ6sbuOAQlw3LUFkPHIzNvez4OZlfcup6MdbzkKVyZNsqzbVJduV9-2eFf5kcwho4cI9YmkfnnWtwccdMMCvZrhJRHc2l-3nCg3mYDiZlO3tVk_lbvmHPYPT731RcG579BFWE"
          alt="Nebula background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm z-10 flex flex-col items-center"
      >
        {/* Brand Identity */}
        <div className="mb-12 text-center">
          <Sparkles className="text-primary w-12 h-12 mb-4 mx-auto" />
          <h1 className="font-serif text-4xl text-on-surface tracking-tight mb-2">Dreamcatcher</h1>
          <p className="text-on-surface-variant font-sans text-sm tracking-wide opacity-80 italic">
            Enter the sanctuary of your subconscious
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <label className="block text-primary text-[10px] font-medium tracking-[0.15em] uppercase mb-1.5 ml-1 opacity-70">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary/30 rounded-lg h-14 px-5 text-on-surface font-sans placeholder-on-surface-variant/30 transition-all duration-300"
                placeholder="name@whisper.com"
              />
            </div>
            <div className="relative group">
              <div className="flex justify-between items-end mb-1.5 px-1">
                <label className="text-primary text-[10px] font-medium tracking-[0.15em] uppercase opacity-70">
                  Secret Word
                </label>
                <button className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider hover:text-primary transition-colors">
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary/30 rounded-lg h-14 px-5 text-on-surface font-sans placeholder-on-surface-variant/30 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onLogin}
              className="w-full h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 bloom-shadow"
            >
              <span className="tracking-widest uppercase text-xs">Sign In</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="relative py-4 flex items-center gap-4 px-2">
            <div className="h-[1px] flex-grow bg-outline-variant/15" />
            <span className="text-on-surface-variant/40 text-[10px] uppercase tracking-[0.2em] font-medium">
              Or Drift In Via
            </span>
            <div className="h-[1px] w-8 bg-outline-variant/15" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center h-14 rounded-lg bg-surface-container-highest/30 border border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Jl6vyzOgGfKtoPZOa0TPkK2ms6bN-xvzx0lxQvY_5mYVJ2DjAFQUvyqW26YCQdPMP7jIRNlODTrtALMqf6sIR2jdZqMTaMDO1aiX9tDIHEBuLtIvxjWgbrk6kViqkajFSJkoxfVyXqlleVZtPFTeNNGIPlFDDMGbcow1Eimtc9u6sTGY2tddYPMlLEZB2oEvjYjMwqrQC0iPeZUD8DUv4SIgLZMbepanff7v2jLXiKe5f58TYO1zWrn9BhrvQQpew6hgA4L32qbB"
                alt="Google"
                className="w-5 h-5 opacity-80"
                referrerPolicy="no-referrer"
              />
              <span className="text-on-surface text-xs font-medium uppercase tracking-wider">Google</span>
            </button>
            <button className="flex items-center justify-center h-14 rounded-lg bg-surface-container-highest/30 border border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors gap-3">
              <Key size={18} className="text-on-surface/80" />
              <span className="text-on-surface text-xs font-medium uppercase tracking-wider">Passkey</span>
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-on-surface-variant/70 text-sm font-sans mb-2">New to the dreamscape?</p>
          <button className="group inline-flex items-center gap-2">
            <span className="text-primary font-serif italic text-lg group-hover:text-primary-fixed-dim transition-colors">
              Begin your Journey
            </span>
            <ArrowRight size={16} className="text-primary transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.main>

      <div className="absolute bottom-8 left-0 w-full px-12 opacity-30 flex justify-between items-center pointer-events-none">
        <div className="flex flex-col">
          <div className="w-12 h-[1px] bg-primary mb-2" />
          <span className="text-[8px] uppercase tracking-[0.3em] font-medium text-primary">
            Lucid Interface v1.0
          </span>
        </div>
        <div className="h-2 w-2 rounded-full border border-primary animate-pulse" />
      </div>
    </div>
  );
}
