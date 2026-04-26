import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Flame, Eye, BarChart3, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { DreamStats } from '../types';
import { apiUrl } from '../api';
import { lookupSymbol } from '../data/symbols';
import SymbolModal from './SymbolModal';

export default function Stats() {
  const [stats, setStats] = useState<DreamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl('/api/stats'))
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-primary">
          <BarChart3 size={48} />
        </motion.div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="pt-24 pb-32 px-6 max-w-md mx-auto text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-surface-container-high flex items-center justify-center text-primary">
          <BarChart3 size={40} />
        </div>
        <h2 className="font-serif text-3xl text-on-surface">No data yet</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Once you've recorded a few dreams, this is where your patterns, streaks, and emotional rhythms will surface.
        </p>
      </div>
    );
  }

  const totalLucidity = stats.lucidity.Low + stats.lucidity.Medium + stats.lucidity.High;
  const maxTimeline = Math.max(1, ...stats.timeline.map(t => t.count));

  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
          Patterns of the Sleeping Self
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          Your <span className="italic text-primary text-glow">Constellation</span>
        </h1>
      </header>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-3">
        <BigStat icon={Moon}  label="Dreams" value={stats.total} />
        <BigStat icon={Flame} label="Streak" value={stats.streak} accent />
        <BigStat icon={Eye}   label="Lucid"  value={`${stats.lucidPct}%`} />
      </div>

      {/* Timeline heatmap */}
      <section className="space-y-4 bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-on-surface">Last 30 days</h2>
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">Frequency</span>
        </div>
        <div className="flex items-end gap-[3px] h-24">
          {stats.timeline.map((t) => {
            const h = (t.count / maxTimeline) * 100;
            return (
              <div
                key={t.date}
                title={`${t.date}: ${t.count} dream${t.count !== 1 ? 's' : ''}`}
                className="flex-1 rounded-sm relative group"
                style={{
                  height: `${Math.max(6, h)}%`,
                  background: t.count > 0
                    ? `rgba(168, 133, 238, ${0.25 + (t.count / maxTimeline) * 0.6})`
                    : 'rgba(74, 69, 81, 0.15)',
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant/40">
          <span>30d ago</span>
          <span>Today</span>
        </div>
      </section>

      {/* Resonance chart */}
      {stats.recentResonance.length > 0 && (
        <section className="space-y-4 bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-on-surface">Emotional Currents</h2>
            <TrendingUp size={16} className="text-primary/50" />
          </div>
          <ResonanceChart data={stats.recentResonance} />
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest">
            <Legend color="#a885ee" label="Calm" />
            <Legend color="#f0bd8b" label="Awe" />
            <Legend color="#cbc3d3" label="Fear" />
          </div>
        </section>
      )}

      {/* Lucidity distribution */}
      <section className="space-y-4 bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
        <h2 className="font-serif text-lg text-on-surface">Lucidity Distribution</h2>
        <div className="space-y-3">
          {(['High', 'Medium', 'Low'] as const).map(level => {
            const v = stats.lucidity[level];
            const pct = totalLucidity > 0 ? Math.round((v / totalLucidity) * 100) : 0;
            return (
              <div key={level} className="space-y-1">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-sans text-on-surface-variant">{level}</span>
                  <span className="font-sans tabular-nums text-primary">{v} · {pct}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className={`h-full rounded-full ${level === 'High' ? 'bg-tertiary' : level === 'Medium' ? 'bg-primary' : 'bg-outline-variant'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Average resonance */}
      <section className="space-y-4 bg-surface-container-high rounded-2xl p-6 border border-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Sparkles size={120} className="absolute -top-4 -right-4" />
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="font-serif text-lg text-on-surface">Average Resonance</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <ResonanceTile label="Calm" value={stats.avgResonance.calm} color="#a885ee" />
            <ResonanceTile label="Awe"  value={stats.avgResonance.awe}  color="#f0bd8b" />
            <ResonanceTile label="Fear" value={stats.avgResonance.fear} color="#cbc3d3" />
          </div>
        </div>
      </section>

      {/* Top symbols */}
      {stats.topSymbols.length > 0 && (
        <section className="space-y-4 bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-on-surface">Most Frequent Symbols</h2>
            <BookOpen size={16} className="text-primary/50" />
          </div>
          <div className="space-y-2.5">
            {stats.topSymbols.map((s) => {
              const entry = lookupSymbol(s.name);
              const max = stats.topSymbols[0].count;
              return (
                <button
                  key={s.name}
                  onClick={() => setActiveSymbol(s.name)}
                  className="w-full flex items-center gap-3 group text-left"
                >
                  <span className="text-xl w-7 text-center">{entry.emoji ?? '✦'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-end text-xs mb-1">
                      <span className="font-sans text-on-surface group-hover:text-primary transition-colors truncate">{s.name}</span>
                      <span className="font-sans text-primary tabular-nums">×{s.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.count / max) * 100}%` }}
                        className="h-full bg-gradient-to-r from-primary-container to-primary rounded-full"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">Tap a symbol for its reading</p>
        </section>
      )}

      <SymbolModal symbol={activeSymbol} onClose={() => setActiveSymbol(null)} />
    </div>
  );
}

function BigStat({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${accent ? 'bg-primary/8 border-primary/20' : 'bg-surface-container-low border-outline-variant/10'}`}>
      <Icon size={18} className={accent ? 'text-tertiary' : 'text-primary/70'} />
      <div>
        <p className={`font-serif text-2xl font-bold leading-none ${accent ? 'text-tertiary' : 'text-on-surface'}`}>{value}</p>
        <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 mt-1">{label}</p>
      </div>
    </div>
  );
}

function ResonanceTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="relative w-16 h-16 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(74,69,81,0.3)" strokeWidth="2.5" />
          <motion.circle
            cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
            initial={{ strokeDasharray: '0 97.4' }}
            animate={{ strokeDasharray: `${(value / 100) * 97.4} 97.4` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-base font-bold tabular-nums" style={{ color }}>{value}</span>
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">{label}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-on-surface-variant/60">{label}</span>
    </div>
  );
}

function ResonanceChart({ data }: { data: { date: string; calm: number; awe: number; fear: number }[] }) {
  if (data.length === 0) return null;
  const w = 320;
  const h = 100;
  const stepX = data.length === 1 ? 0 : w / (data.length - 1);
  const path = (key: 'calm' | 'awe' | 'fear') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${h - (d[key] / 100) * h}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs>
        <linearGradient id="g-calm" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a885ee" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a885ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path('calm')} L ${(data.length - 1) * stepX} ${h} L 0 ${h} Z`} fill="url(#g-calm)" />
      <path d={path('calm')} fill="none" stroke="#a885ee" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <path d={path('awe')}  fill="none" stroke="#f0bd8b" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0" />
      <path d={path('fear')} fill="none" stroke="#cbc3d3" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="3 3" />
      {data.map((d, i) => (
        <circle key={i} cx={i * stepX} cy={h - (d.calm / 100) * h} r="1.6" fill="#a885ee" />
      ))}
    </svg>
  );
}
