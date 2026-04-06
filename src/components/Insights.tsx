import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Waves, Key, BookOpen, Brain, Settings2, Sparkles, Moon, Sun, Wind } from 'lucide-react';
import { WeeklySynthesis } from '../types';

interface InsightsProps {
  synthesis: WeeklySynthesis | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ICON_MAP: Record<string, any> = {
  Waves,
  Key,
  Sparkles,
  Moon,
  Sun,
  Wind
};

export default function Insights({ synthesis, onGenerate, isGenerating }: InsightsProps) {
  if (!synthesis) {
    return (
      <div className="pt-24 pb-32 px-6 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center text-primary animate-pulse">
          <Brain size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="font-serif text-3xl text-on-surface">Weekly Synthesis</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Every Sunday night, the Collective Whisper synthesizes your dreams and celestial alignments.
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-5 rounded-full bg-primary text-on-primary font-bold tracking-widest uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {isGenerating ? 'Synthesizing...' : 'Generate Latest Synthesis'}
        </button>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-32 px-6 space-y-8 max-w-md mx-auto">
      {/* Hero Insight Header */}
      <header className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
            Weekly Synthesis • {synthesis.date}
          </span>
        </div>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          {synthesis.headline.split(' ').map((word, i) => (
            <span key={i} className={i === synthesis.headline.split(' ').length - 1 ? "italic text-primary text-glow" : ""}>
              {word}{' '}
            </span>
          ))}
        </h1>
      </header>

      {/* Insights Summary Bento Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Patterns Main Card */}
        <motion.section
          whileHover={{ scale: 1.01 }}
          className="col-span-2 bg-surface-container-high rounded-lg p-6 relative overflow-hidden group bloom-glow"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-serif text-xl text-primary mb-1">Patterns</h2>
              <p className="text-on-surface-variant text-sm">Recurring motifs this week</p>
            </div>
            <TrendingUp className="text-primary/40" size={24} />
          </div>
          <div className="space-y-4">
            {synthesis.patterns.map((pattern, i) => {
              const Icon = ICON_MAP[pattern.icon] || Waves;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{pattern.name}</span>
                      <span className="text-primary">{pattern.frequency}% frequency</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pattern.frequency}%` }}
                        className="bg-gradient-to-r from-primary-container to-primary h-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Star Sign Connections */}
        <motion.section
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low rounded-lg p-5 flex flex-col justify-between aspect-square border border-outline-variant/10"
        >
          <BookOpen className="text-tertiary" size={32} />
          <div>
            <h3 className="font-serif text-lg leading-tight">Celestial Alignment</h3>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              {synthesis.celestialAlignment}
            </p>
          </div>
        </motion.section>

        {/* Psychological Insight Card */}
        <motion.section
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low rounded-lg p-5 flex flex-col justify-between aspect-square border border-outline-variant/10"
        >
          <Brain className="text-secondary" size={32} />
          <div>
            <h3 className="font-serif text-lg leading-tight">Shadow Work</h3>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              {synthesis.shadowWork}
            </p>
          </div>
        </motion.section>
      </div>

      {/* Deep Analysis Section */}
      <motion.section
        whileHover={{ scale: 1.01 }}
        className="bg-surface-container-highest rounded-lg p-8 relative overflow-hidden border border-primary/5"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 20% 30%, #A885EE 0%, transparent 50%)' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Settings2 className="text-primary" size={24} />
            <h2 className="font-serif text-2xl">The Collective Whisper</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-sm italic mb-6">
            "{synthesis.collectiveWhisper}"
          </p>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-sm tracking-widest uppercase transition-transform active:scale-95 shadow-lg shadow-primary/10"
          >
            {isGenerating ? 'Synthesizing...' : 'Refresh Synthesis'}
          </button>
        </div>
      </motion.section>

      {/* Visual Moodscape */}
      <section className="space-y-4">
        <h3 className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">
          Dominant Moodscape
        </h3>
        <div className="h-48 w-full rounded-lg overflow-hidden relative group cursor-pointer">
          <img
            src={synthesis.moodscape.imageUrl}
            alt="Dreamscape mood"
            className="w-full h-full object-cover grayscale opacity-60 transition-all group-hover:grayscale-0 group-hover:scale-105 duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <span className="block text-xs uppercase tracking-tighter opacity-60">Visual Tone</span>
              <span className="font-serif text-xl">{synthesis.moodscape.title}</span>
            </div>
            <div className="flex -space-x-2">
              {synthesis.moodscape.colors.map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-on-surface/10" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
