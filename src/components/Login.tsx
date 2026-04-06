import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Moon } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary-container/8 blur-[140px]" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[60%] h-[50%] rounded-full bg-secondary-container/6 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[30%] rounded-full bg-tertiary/4 blur-[100px]" />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm z-10 flex flex-col items-center"
      >
        {/* Brand */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="relative inline-block mb-5">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-surface-container-high border border-primary/20 flex items-center justify-center">
              <Moon className="text-primary w-8 h-8" />
            </div>
          </div>
          <h1 className="font-serif text-4xl text-on-surface tracking-tight mb-2">Dreamcatcher</h1>
          <p className="text-on-surface-variant font-sans text-sm tracking-wide opacity-60 italic">
            A sanctuary for your subconscious
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-primary text-[10px] font-medium tracking-[0.15em] uppercase mb-2 ml-1 opacity-70">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 focus:ring-1 focus:ring-primary/20 rounded-xl h-14 px-5 text-on-surface font-sans text-sm placeholder-on-surface-variant/25 transition-all duration-300 outline-none"
                placeholder="name@whisper.com"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-end mb-2 px-1">
                <label className="text-primary text-[10px] font-medium tracking-[0.15em] uppercase opacity-70">
                  Secret Word
                </label>
                <button
                  type="button"
                  className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider hover:text-primary transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 focus:ring-1 focus:ring-primary/20 rounded-xl h-14 px-5 text-on-surface font-sans text-sm placeholder-on-surface-variant/25 transition-all duration-300 outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 bloom-shadow"
            >
              <span className="tracking-widest uppercase text-xs">Enter the Dreamscape</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.form>

        {/* Register Link */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-on-surface-variant/60 text-sm font-sans mb-3">New to the dreamscape?</p>
          <button
            onClick={onLogin}
            className="group inline-flex items-center gap-2"
          >
            <span className="text-primary font-serif italic text-lg group-hover:opacity-80 transition-opacity">
              Begin your Journey
            </span>
            <ArrowRight size={15} className="text-primary transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </motion.main>

      {/* Footer mark */}
      <div className="absolute bottom-8 left-0 w-full px-10 opacity-25 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[1px] bg-primary" />
          <span className="text-[8px] uppercase tracking-[0.3em] font-medium text-primary">
            Lucid Interface v2.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={10} className="text-primary" />
        </div>
      </div>
    </div>
  );
}
