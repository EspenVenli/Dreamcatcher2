import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, TrendingDown, Moon, Sparkles, BarChart2,
  Brain, Stars, Zap, Clock, ChevronRight,
  Waves, Key, Sun, Wind, BookOpen, Settings2,
} from 'lucide-react';
import { Dream, WeeklySynthesis, UserProfile, EmotionTag } from '../types';
import { apiUrl } from '../api';

interface InsightsProps {
  synthesis: WeeklySynthesis | null;
  onGenerate: () => void;
  isGenerating: boolean;
  user: UserProfile | null;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Waves,
  Key,
  Sparkles,
  Moon,
  Sun,
  Wind,
};

const EMOTION_COLORS: Record<EmotionTag, { bg: string; bar: string; label: string }> = {
  anxious:     { bg: 'bg-amber-500/10',   bar: 'bg-amber-500',   label: 'Anxious' },
  peaceful:    { bg: 'bg-teal-500/10',    bar: 'bg-teal-500',    label: 'Peaceful' },
  confused:    { bg: 'bg-purple-500/10',  bar: 'bg-purple-500',  label: 'Confused' },
  joyful:      { bg: 'bg-yellow-400/10',  bar: 'bg-yellow-400',  label: 'Joyful' },
  afraid:      { bg: 'bg-red-500/10',     bar: 'bg-red-500',     label: 'Afraid' },
  nostalgic:   { bg: 'bg-blue-500/10',    bar: 'bg-blue-500',    label: 'Nostalgic' },
  melancholic: { bg: 'bg-slate-500/10',   bar: 'bg-slate-500',   label: 'Melancholic' },
  hopeful:     { bg: 'bg-orange-400/10',  bar: 'bg-orange-400',  label: 'Hopeful' },
  lonely:      { bg: 'bg-indigo-500/10',  bar: 'bg-indigo-500',  label: 'Lonely' },
  loved:       { bg: 'bg-pink-500/10',    bar: 'bg-pink-500',    label: 'Loved' },
  angry:       { bg: 'bg-red-600/10',     bar: 'bg-red-600',     label: 'Angry' },
  ashamed:     { bg: 'bg-stone-500/10',   bar: 'bg-stone-500',   label: 'Ashamed' },
  excited:     { bg: 'bg-yellow-300/10',  bar: 'bg-yellow-300',  label: 'Excited' },
  overwhelmed: { bg: 'bg-cyan-500/10',    bar: 'bg-cyan-500',    label: 'Overwhelmed' },
  numb:        { bg: 'bg-zinc-500/10',    bar: 'bg-zinc-500',    label: 'Numb' },
  grief:       { bg: 'bg-neutral-500/10', bar: 'bg-neutral-500', label: 'Grief' },
  curious:     { bg: 'bg-lime-500/10',    bar: 'bg-lime-500',    label: 'Curious' },
  trapped:     { bg: 'bg-rose-500/10',    bar: 'bg-rose-500',    label: 'Trapped' },
  free:        { bg: 'bg-sky-500/10',     bar: 'bg-sky-500',     label: 'Free' },
  hunted:      { bg: 'bg-red-900/10',     bar: 'bg-red-900',     label: 'Hunted' },
  lost:        { bg: 'bg-gray-500/10',    bar: 'bg-gray-500',    label: 'Lost' },
  safe:        { bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', label: 'Safe' },
  unsettled:   { bg: 'bg-violet-500/10',  bar: 'bg-violet-500',  label: 'Unsettled' },
  euphoric:    { bg: 'bg-fuchsia-500/10', bar: 'bg-fuchsia-500', label: 'Euphoric' },
  guilty:      { bg: 'bg-stone-600/10',   bar: 'bg-stone-600',   label: 'Guilty' },
  tender:      { bg: 'bg-pink-300/10',    bar: 'bg-pink-300',    label: 'Tender' },
  powerful:    { bg: 'bg-amber-600/10',   bar: 'bg-amber-600',   label: 'Powerful' },
  helpless:    { bg: 'bg-green-900/10',   bar: 'bg-green-900',   label: 'Helpless' },
  strange:     { bg: 'bg-purple-900/10',  bar: 'bg-purple-900',  label: 'Strange' },
  serene:      { bg: 'bg-teal-300/10',    bar: 'bg-teal-300',    label: 'Serene' },
  desperate:   { bg: 'bg-red-800/10',     bar: 'bg-red-800',     label: 'Desperate' },
  wonder:      { bg: 'bg-blue-300/10',    bar: 'bg-blue-300',    label: 'Wonder' },
};

function fmt12h(t?: string) {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function getDayKey(dateStr: string): string {
  try {
    return new Date(dateStr).toISOString().slice(0, 10);
  } catch {
    return dateStr;
  }
}

export default function Insights({ synthesis, onGenerate, isGenerating, user }: InsightsProps) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loadingDreams, setLoadingDreams] = useState(true);

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const res = await fetch(apiUrl('/api/dreams'));
        const data = await res.json();
        setDreams(Array.isArray(data) ? data : []);
      } catch {
        setDreams([]);
      } finally {
        setLoadingDreams(false);
      }
    };
    fetchDreams();
  }, []);

  // ── Dream Frequency ──────────────────────────────────────────────────────
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);

  const thisWeekCount = dreams.filter(d => {
    try { return new Date(d.date) >= oneWeekAgo; } catch { return false; }
  }).length;
  const lastWeekCount = dreams.filter(d => {
    try {
      const dt = new Date(d.date);
      return dt >= twoWeeksAgo && dt < oneWeekAgo;
    } catch { return false; }
  }).length;

  const trend = thisWeekCount > lastWeekCount ? 'up' : thisWeekCount < lastWeekCount ? 'down' : 'same';

  // ── Emotional Fingerprint ─────────────────────────────────────────────────
  const emotionCounts: Partial<Record<EmotionTag, number>> = {};
  dreams.forEach(d => {
    if (d.emotionTag) {
      emotionCounts[d.emotionTag] = (emotionCounts[d.emotionTag] ?? 0) + 1;
    }
  });
  const emotionEntries = (Object.entries(emotionCounts) as [EmotionTag, number][])
    .sort((a, b) => b[1] - a[1]);
  const maxEmotion = emotionEntries[0]?.[1] ?? 1;

  // ── Recurring Symbols ─────────────────────────────────────────────────────
  const symbolCounts: Record<string, number> = {};
  dreams.forEach(d => {
    d.symbols?.forEach(s => {
      symbolCounts[s] = (symbolCounts[s] ?? 0) + 1;
    });
  });
  const topSymbols = Object.entries(symbolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // ── Lucid Dream Tracker ───────────────────────────────────────────────────
  const lucidDreams = dreams.filter(d => d.isLucid);
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const lucidDaySet = new Set(
    lucidDreams.map(d => {
      try { return new Date(d.date).toISOString().slice(0, 10); } catch { return ''; }
    })
  );

  const RECALL_LABELS: Record<string, string> = {
    'rarely': 'Rarely',
    'sometimes': 'Sometimes',
    'often': 'Often',
    'almost-always': 'Almost always',
  };

  const astro = user?.astrologyProfile;

  const ZODIAC_SYMBOLS: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
  };

  return (
    <div className="pt-8 pb-32 px-6 space-y-6 max-w-md mx-auto">

      {/* Header */}
      <header className="space-y-1">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-70">Dashboard</span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          Your <span className="italic text-primary" style={{ textShadow: '0 0 20px rgba(168,133,238,0.4)' }}>Insights</span>
        </h1>
      </header>

      {/* 1. Dream Frequency */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/50">Dream Frequency</h2>
          <BarChart2 size={16} className="text-primary/50" />
        </div>
        <div className="flex items-end gap-6">
          <div className="text-center">
            <p className="font-serif text-5xl text-on-surface">{thisWeekCount}</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 mt-1">This Week</p>
          </div>
          <div className="flex items-center pb-4">
            {trend === 'up' && <TrendingUp size={22} className="text-teal-400" />}
            {trend === 'down' && <TrendingDown size={22} className="text-red-400" />}
            {trend === 'same' && <ChevronRight size={22} className="text-on-surface/30" />}
          </div>
          <div className="text-center">
            <p className="font-serif text-5xl text-on-surface/40">{lastWeekCount}</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/30 mt-1">Last Week</p>
          </div>
        </div>
      </motion.section>

      {/* 2. Emotional Fingerprint */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/50">Emotional Fingerprint</h2>
          <Brain size={16} className="text-primary/50" />
        </div>
        {emotionEntries.length === 0 ? (
          <p className="text-sm text-on-surface-variant/40 italic">
            Tag dreams with emotions to see your fingerprint.
          </p>
        ) : (
          <div className="space-y-3">
            {emotionEntries.map(([tag, count]) => {
              const cfg = EMOTION_COLORS[tag];
              return (
                <div key={tag} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface/70 font-medium">{cfg.label}</span>
                    <span className="text-on-surface/40">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxEmotion) * 100}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={`h-full rounded-full ${cfg.bar}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* 3. Recurring Symbols */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/50">Recurring Symbols</h2>
          <Sparkles size={16} className="text-primary/50" />
        </div>
        {topSymbols.length === 0 ? (
          <p className="text-sm text-on-surface-variant/40 italic">
            Symbols from your dreams will appear here.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topSymbols.map(([symbol, count]) => (
              <span
                key={symbol}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5"
              >
                {symbol}
                <span className="text-primary/50">× {count}</span>
              </span>
            ))}
          </div>
        )}
      </motion.section>

      {/* 4. Lucid Dream Tracker */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/50">Lucid Dream Tracker</h2>
          <Zap size={16} className="text-primary/50" />
        </div>
        <div className="flex items-center gap-6 mb-5">
          <div className="text-center">
            <p className="font-serif text-4xl text-on-surface">{lucidDreams.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 mt-1">Total Lucid</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-4xl text-on-surface">
              {(() => {
                let streak = 0;
                for (let i = last7Days.length - 1; i >= 0; i--) {
                  if (lucidDaySet.has(last7Days[i])) streak++;
                  else break;
                }
                return streak;
              })()}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 mt-1">Day Streak</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface/30 mb-2">Last 7 Days</p>
          <div className="flex gap-2">
            {last7Days.map((day, i) => {
              const isLucid = lucidDaySet.has(day);
              return (
                <div
                  key={day}
                  title={day}
                  className={`flex-1 h-8 rounded-lg transition-all ${
                    isLucid
                      ? 'bg-primary shadow-[0_0_8px_rgba(168,133,238,0.4)]'
                      : 'bg-surface-container-highest'
                  }`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            {last7Days.map(day => (
              <p key={day} className="flex-1 text-center text-[8px] text-on-surface/20">
                {new Date(day + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}
              </p>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. Weekly Synthesis */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-surface-container-highest rounded-2xl p-6 relative overflow-hidden border border-primary/5"
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 30%, #A885EE 0%, transparent 50%)' }}
        />
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-4">
            <Settings2 className="text-primary mt-0.5" size={20} />
            <div>
              <h2 className="font-serif text-xl">The Collective Whisper</h2>
              <p className="text-[10px] text-on-surface/35 mt-0.5 leading-relaxed">A message distilled from the patterns across all your recent dreams</p>
            </div>
          </div>
          {synthesis ? (
            <>
              <p className="text-on-surface-variant leading-relaxed text-sm italic mb-2">
                "{synthesis.collectiveWhisper}"
              </p>
              <p className="text-[10px] text-on-surface/30 mb-5">{synthesis.date}</p>
            </>
          ) : (
            <p className="text-on-surface-variant/50 text-sm mb-5 leading-relaxed">
              Generate a synthesis to reveal patterns across all your recent dreams.
            </p>
          )}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-xs tracking-widest uppercase transition-transform active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? 'Synthesizing...' : synthesis ? 'Refresh Synthesis' : 'Generate Synthesis'}
          </button>
        </div>
      </motion.section>

      {/* 6. Astrological Context */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/50">Astrological Context</h2>
          <Stars size={16} className="text-primary/50" />
        </div>

        {astro ? (
          <div className="space-y-4">
            {astro.mode === 'full-chart' && astro.fullChart ? (
              <div className="flex gap-6">
                {[
                  { symbol: '☉', label: 'Sun',    sign: astro.fullChart.sun?.sign },
                  { symbol: '☽', label: 'Moon',   sign: astro.fullChart.moon?.sign },
                  { symbol: '↑', label: 'Rising', sign: astro.fullChart.rising?.sign },
                ].map(p => (
                  <div key={p.label} className="text-center">
                    <p className="text-xl mb-1">{p.symbol}</p>
                    <p className="text-xs text-on-surface-variant/40 uppercase tracking-wider">{p.label}</p>
                    <p className="text-sm font-medium text-on-surface mt-0.5">
                      {p.sign ? `${ZODIAC_SYMBOLS[p.sign] ?? ''} ${p.sign}` : '—'}
                    </p>
                  </div>
                ))}
              </div>
            ) : astro.sunSign ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ZODIAC_SYMBOLS[astro.sunSign] ?? '✦'}</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface/30">Sun Sign</p>
                  <p className="text-sm font-medium text-on-surface">{astro.sunSign}</p>
                </div>
              </div>
            ) : null}
            <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
              <p className="text-xs text-on-surface-variant/60 leading-relaxed italic">
                Mercury retrograde through April 15 — themes of miscommunication and revisited memories may be surfacing in your dreams.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-on-surface-variant/40 italic">
              Add your birth chart in the Profile tab to unlock astrological dream context.
            </p>
            <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
              <p className="text-xs text-on-surface-variant/60 leading-relaxed italic">
                Mercury retrograde through April 15 — themes of miscommunication and revisited memories may be surfacing in your dreams.
              </p>
            </div>
          </div>
        )}
      </motion.section>

      {/* 7. Sleep & Recall Correlation */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/50">Sleep Profile</h2>
          <Clock size={16} className="text-primary/50" />
        </div>
        {user?.bedtime || user?.wakeTime || user?.dreamRecall ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-container-low rounded-xl p-3 text-center border border-outline-variant/10">
              <Moon size={14} className="text-primary/60 mx-auto mb-1" />
              <p className="text-xs font-medium text-on-surface">{fmt12h(user?.bedtime)}</p>
              <p className="text-[9px] uppercase tracking-wider text-on-surface/30 mt-0.5">Bedtime</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center border border-outline-variant/10">
              <Sun size={14} className="text-primary/60 mx-auto mb-1" />
              <p className="text-xs font-medium text-on-surface">{fmt12h(user?.wakeTime)}</p>
              <p className="text-[9px] uppercase tracking-wider text-on-surface/30 mt-0.5">Wake</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center border border-outline-variant/10">
              <Zap size={14} className="text-primary/60 mx-auto mb-1" />
              <p className="text-xs font-medium text-on-surface">
                {user?.dreamRecall ? RECALL_LABELS[user.dreamRecall] : '—'}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-on-surface/30 mt-0.5">Recall</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant/40 italic">
            Add your sleep schedule in Settings to track sleep-dream correlations.
          </p>
        )}
        {user?.sleepQuality && (
          <div className="mt-3 flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-widest text-on-surface/30">Sleep Quality</p>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/10 text-primary capitalize border border-primary/20">
              {user.sleepQuality}
            </span>
          </div>
        )}
      </motion.section>

    </div>
  );
}
