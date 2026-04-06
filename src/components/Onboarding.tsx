import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wind, Sun, Stars, Waves, Moon, Trees } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: { age: number; starSign: string }) => void;
}

const ZODIAC_SIGNS = [
  { name: 'Aries', icon: Wind },
  { name: 'Taurus', icon: Sun },
  { name: 'Gemini', icon: Stars },
  { name: 'Cancer', icon: Waves },
  { name: 'Leo', icon: Moon },
  { name: 'Virgo', icon: Trees },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [age, setAge] = useState<number>(24);
  const [selectedSign, setSelectedSign] = useState<string>('Gemini');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-24 pb-12 relative overflow-hidden">
      <div className="w-full max-w-md flex flex-col gap-10">
        {/* Progress Indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-[0_0_8px_rgba(168,133,238,0.5)]" />
          </div>
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            Step 1 of 3
          </span>
        </div>

        {/* Onboarding Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 md:p-10 rounded-lg shadow-[0_0_48px_rgba(168,133,238,0.06)] flex flex-col gap-8 border border-outline-variant/10"
        >
          <div className="space-y-3">
            <h1 className="font-serif text-4xl text-on-surface leading-tight tracking-tight">
              Tell the stars who you are
            </h1>
            <p className="text-on-surface-variant/80 font-sans text-sm leading-relaxed">
              Your celestial alignment helps us calibrate your dream frequency and personal archetypes.
            </p>
          </div>

          <div className="space-y-10">
            {/* Age Input Section */}
            <div className="space-y-4">
              <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                Current Age
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full bg-surface-container-low border-none rounded-xl py-5 px-6 text-xl font-serif text-on-surface placeholder:text-on-surface-variant/20 focus:ring-1 focus:ring-primary/40 transition-all outline-none"
                  placeholder="24"
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none group-focus-within:shadow-[0_0_15px_rgba(168,133,238,0.15)]" />
              </div>
            </div>

            {/* Zodiac Scroller Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-end ml-1">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70">
                  Star Sign
                </label>
                <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-tighter">
                  Swipe to select
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-20 border-x border-primary/10 bg-primary/5 pointer-events-none rounded-xl" />
                <div className="flex gap-4 overflow-x-auto py-4 px-[calc(50%-40px)] hide-scrollbar snap-x snap-mandatory">
                  {ZODIAC_SIGNS.map((sign) => (
                    <div
                      key={sign.name}
                      onClick={() => setSelectedSign(sign.name)}
                      className="snap-center flex-shrink-0 w-20 flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          selectedSign === sign.name
                            ? 'bg-gradient-to-br from-primary to-primary-container text-surface shadow-[0_0_15px_rgba(168,133,238,0.4)]'
                            : 'bg-surface-container-high text-on-surface-variant group-hover:text-primary'
                        }`}
                      >
                        <sign.icon size={28} />
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-widest font-medium transition-opacity ${
                          selectedSign === sign.name ? 'opacity-100 font-bold text-primary' : 'opacity-50 group-hover:opacity-100'
                        }`}
                      >
                        {sign.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <button
          onClick={() => onComplete({ age, starSign: selectedSign })}
          className="w-full mt-4 group relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-5 rounded-full font-bold tracking-widest uppercase text-xs shadow-[0_12px_24px_rgba(168,133,238,0.2)] active:scale-[0.98] transition-all duration-300"
        >
          <span className="relative z-10">Align with the Cosmos</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <p className="text-center text-on-surface-variant/40 text-[10px] uppercase tracking-[0.3em]">
          Authenticating Journey...
        </p>
      </div>
    </div>
  );
}
