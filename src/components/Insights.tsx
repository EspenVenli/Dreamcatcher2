import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Waves, Key, BookOpen, Brain, Settings2, Sparkles, Moon, Sun, Wind, Flame, BarChart3 } from 'lucide-react';
import { WeeklySynthesis, DreamStats } from '../types';
import { apiUrl } from '../api';
import { lookupSymbol } from '../data/symbols';

interface InsightsProps {
  synthesis: WeeklySynthesis | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ICON_MAP: Record<string, any> = {
  Waves, Key, Sparkles, Moon, Sun, Wind, Flame, BookOpen, Brain,
};

export default function Insights({ synthesis, onGenerate, isGenerating }: InsightsProps) {
  const [stats, setStats] = useState<DreamStats | null>(null);

  useEffect(() => {
    fetch(apiUrl('/api/stats')).then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  // No synthesis yet — show derived patterns + nudge to generate.
  if (!synthesis) {
    return (
      <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-8">
        <header className="space-y-2">
          <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
            Insights
          </span>
          <h1 className="font-serif text-4xl text-on-surface leading-tight">
            Patterns <span className="italic text-primary text-glow">emerging</span>
          </h1>
        </header>

        {stats && stats.total > 0 ? (
          <DerivedInsights stats={stats} />
        ) : (
          <div className="text-center py-8 opacity-60">
            <Brain size={40} className="mx-auto mb-3 text-primary" />
            <p className="font-serif italic">Record a dream to see patterns emerge.</p>
          </div>
        )}

        <div className="bg-surface-container-high rounded-3xl p-6 border border-primary/15 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
          </div>
          <div className="relative space-y-4">
            <h3 className="font-serif text-xl text-on-surface">Weekly Synthesis</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Let the Collective Whisper compose a poetic reading of your week — a headline, archetypal patterns, shadow work, and a moodscape.
            </p>
            <button
              onClick={onGenerate}
              disabled={isGenerating || !stats || stats.total === 0}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-bold tracking-widest uppercase text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40"
            >
              {isGenerating ? 'Synthesising…' : 'Generate weekly synthesis'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-32 px-6 space-y-8 max-w-md mx-auto">
      {/* Hero Insight Header */}
      <header className="space-y-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
          Weekly Synthesis · {synthesis.date}
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          {synthesis.headline.split(' ').map((word, i, arr) => (
            <span key={i} className={i === arr.length - 1 ? 'italic text-primary text-glow' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>
      </header>

      {stats && stats.total > 0 && <DerivedInsights stats={stats} compact />}

      <div className="grid grid-cols-2 gap-4">
        {/* Patterns Main Card */}
        <motion.section
          whileHover={{ scale: 1.01 }}
          className="col-span-2 bg-surface-container-high rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
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

        <motion.section
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low rounded-2xl p-5 flex flex-col justify-between aspect-square border border-outline-variant/10"
        >
          <BookOpen className="text-tertiary" size={32} />
          <div>
            <h3 className="font-serif text-lg leading-tight">Celestial Alignment</h3>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              {synthesis.celestialAlignment}
            </p>
          </div>
        </motion.section>

        <motion.section
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low rounded-2xl p-5 flex flex-col justify-between aspect-square border border-outline-variant/10"
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

      <motion.section
        whileHover={{ scale: 1.01 }}
        className="bg-surface-container-highest rounded-2xl p-7 relative overflow-hidden border border-primary/5"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 30%, #A885EE 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Settings2 className="text-primary" size={22} />
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
            {isGenerating ? 'Synthesising…' : 'Refresh synthesis'}
          </button>
        </div>
      </motion.section>

      <section className="space-y-4">
        <h3 className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">
          Dominant Moodscape
        </h3>
        <div className="h-48 w-full rounded-2xl overflow-hidden relative group cursor-pointer">
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

function DerivedInsights({ stats, compact }: { stats: DreamStats; compact?: boolean }) {
  const topSymbol = stats.topSymbols[0];
  const dominantEmotion = (() => {
    const r = stats.avgResonance;
    const max = Math.max(r.calm, r.awe, r.fear);
    if (max === r.awe) return { name: 'Awe', value: r.awe, color: '#f0bd8b' };
    if (max === r.fear) return { name: 'Fear', value: r.fear, color: '#cbc3d3' };
    return { name: 'Calm', value: r.calm, color: '#a885ee' };
  })();

  return (
    <div className={`grid ${compact ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
      <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 flex flex-col gap-2">
        <Flame size={16} className="text-tertiary" />
        <div>
          <p className="font-serif text-2xl font-bold text-on-surface tabular-nums leading-none">{stats.streak}</p>
          <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mt-1">day streak</p>
        </div>
      </div>
      <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 flex flex-col gap-2">
        <Sparkles size={16} style={{ color: dominantEmotion.color }} />
        <div>
          <p className="font-serif text-base font-bold text-on-surface leading-none">{dominantEmotion.name}</p>
          <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mt-1">dominant emotion</p>
        </div>
      </div>
      {topSymbol && (
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 flex flex-col gap-2 col-span-1">
          <span className="text-xl">{lookupSymbol(topSymbol.name).emoji ?? '✦'}</span>
          <div>
            <p className="font-serif text-base font-bold text-on-surface truncate leading-none">{topSymbol.name}</p>
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mt-1">top symbol · ×{topSymbol.count}</p>
          </div>
        </div>
      )}
      {!compact && stats.total > 0 && (
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 flex flex-col gap-2">
          <BarChart3 size={16} className="text-primary" />
          <div>
            <p className="font-serif text-2xl font-bold text-on-surface leading-none">{stats.total}</p>
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mt-1">dreams logged</p>
          </div>
        </div>
      )}
    </div>
  );
}
