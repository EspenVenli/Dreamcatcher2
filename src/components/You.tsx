import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Stars, LogOut,
  Moon, Brain, Heart, Eye, BookOpen, Compass,
  Clock, Zap, AlertCircle, Loader, MapPin, Calendar, Check,
} from 'lucide-react';
import {
  UserProfile, DreamGoal, EmotionalTone, AstrologyProfile,
  ZodiacSign, FullBirthChart, BirthData,
} from '../types';
import { apiUrl } from '../api';
import Sleep from './Sleep';

// ── Constants ────────────────────────────────────────────────────────────────

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const PLANETS: { key: keyof Omit<FullBirthChart, 'mc' | 'hasTime'>; label: string; symbol: string }[] = [
  { key: 'sun',       label: 'Sun',        symbol: '☉' },
  { key: 'moon',      label: 'Moon',       symbol: '☽' },
  { key: 'rising',    label: 'Rising',     symbol: '↑' },
  { key: 'mercury',   label: 'Mercury',    symbol: '☿' },
  { key: 'venus',     label: 'Venus',      symbol: '♀' },
  { key: 'mars',      label: 'Mars',       symbol: '♂' },
  { key: 'jupiter',   label: 'Jupiter',    symbol: '♃' },
  { key: 'saturn',    label: 'Saturn',     symbol: '♄' },
  { key: 'uranus',    label: 'Uranus',     symbol: '♅' },
  { key: 'neptune',   label: 'Neptune',    symbol: '♆' },
  { key: 'pluto',     label: 'Pluto',      symbol: '♇' },
  { key: 'northNode', label: 'North Node', symbol: '☊' },
];

const GOAL_LABELS: Record<DreamGoal, string> = {
  'track-recurring':     'Track recurring dreams',
  'explore-symbols':     'Explore symbolism',
  'process-emotions':    'Process emotions',
  'improve-lucidity':    'Improve lucid dreaming',
  'understand-patterns': 'Understand patterns',
  'just-curious':        'Just curious',
};

const GOAL_ICONS: Record<DreamGoal, React.ElementType> = {
  'track-recurring':     Moon,
  'explore-symbols':     BookOpen,
  'process-emotions':    Heart,
  'improve-lucidity':    Eye,
  'understand-patterns': Brain,
  'just-curious':        Compass,
};

const MOOD_LABELS: Record<EmotionalTone, string> = {
  'peaceful':    'Peaceful',
  'anxious':     'Anxious',
  'adventurous': 'Adventurous',
  'melancholic': 'Melancholic',
  'surreal':     'Surreal',
  'vivid':       'Vivid',
  'joyful':      'Joyful',
  'confused':    'Confused',
  'afraid':      'Afraid',
  'hopeful':     'Hopeful',
  'curious':     'Curious',
  'excited':     'Excited',
  'overwhelmed': 'Overwhelmed',
  'lonely':      'Lonely',
  'wonder':      'Wonder',
  'euphoric':    'Euphoric',
  'tender':      'Tender',
  'strange':     'Strange',
  'safe':        'Safe',
  'lost':        'Lost',
};

const RECALL_LABELS: Record<string, string> = {
  'rarely':        'Rarely',
  'sometimes':     'Sometimes',
  'often':         'Often',
  'almost-always': 'Almost always',
};

function fmt12h(t?: string) {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface YouProps {
  user: UserProfile | null;
  onLogout: () => void;
  onUpdateAstrology: (profile: AstrologyProfile) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

// ── Chart Visual (decorative) ─────────────────────────────────────────────────

function ChartVisual({ chart }: { chart?: FullBirthChart }) {
  const cx = 120, cy = 120, r = 90;
  const houseAngles = Array.from({ length: 12 }, (_, i) => (i * 30 - 90) * (Math.PI / 180));
  const placedPlanets = chart ? PLANETS.filter(p => chart[p.key as keyof FullBirthChart]) : [];

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(168,133,238,0.15)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.65} fill="none" stroke="rgba(168,133,238,0.08)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill="none" stroke="rgba(168,133,238,0.08)" strokeWidth="1" />
      {/* House lines */}
      {houseAngles.map((angle, i) => (
        <line
          key={i}
          x1={cx + r * 0.3 * Math.cos(angle)}
          y1={cy + r * 0.3 * Math.sin(angle)}
          x2={cx + r * Math.cos(angle)}
          y2={cy + r * Math.sin(angle)}
          stroke="rgba(168,133,238,0.12)"
          strokeWidth="0.5"
        />
      ))}
      {/* Planet glyphs placed at even intervals */}
      {placedPlanets.slice(0, 10).map((p, i) => {
        const angle = (i * (360 / Math.max(placedPlanets.length, 1)) - 90) * (Math.PI / 180);
        const pr = r * 0.78;
        const x = cx + pr * Math.cos(angle);
        const y = cy + pr * Math.sin(angle);
        return (
          <text
            key={p.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            fill="rgba(168,133,238,0.7)"
          >
            {p.symbol}
          </text>
        );
      })}
      {/* Center glyph */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="18" fill="rgba(168,133,238,0.25)">✦</text>
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

type Tab = 'profile' | 'chart' | 'sleep' | 'settings';

export default function You({ user, onLogout, onUpdateAstrology, onUpdateProfile }: YouProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [chartViewMode, setChartViewMode] = useState<'table' | 'visual'>('table');

  // Settings state
  const [birthDate,   setBirthDate]   = useState(user?.astrologyProfile?.birthData?.date  ?? '');
  const [birthTime,   setBirthTime]   = useState(user?.astrologyProfile?.birthData?.time  ?? '');
  const [birthPlace,  setBirthPlace]  = useState(user?.astrologyProfile?.birthData?.place ?? '');
  const [unknownTime, setUnknownTime] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calcError,   setCalcError]   = useState<string | null>(null);
  const [calcSuccess, setCalcSuccess] = useState(false);

  const [reminderEnabled, setReminderEnabled] = useState(user?.morningReminder?.enabled ?? true);
  const [reminderTime,    setReminderTime]    = useState(user?.morningReminder?.time ?? '07:15');
  const [savedReminder,   setSavedReminder]   = useState(false);

  const [settingsBedtime,  setSettingsBedtime]  = useState(user?.bedtime  ?? '22:30');
  const [settingsWakeTime, setSettingsWakeTime] = useState(user?.wakeTime ?? '07:00');
  const [savedSleep,       setSavedSleep]       = useState(false);

  const hasGoals = user?.goals && user.goals.length > 0;
  const hasMoods = user?.typicalMoods && user.typicalMoods.length > 0;
  const astro    = user?.astrologyProfile;
  const chart    = astro?.fullChart;

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleCalculateChart() {
    if (!birthDate || !birthPlace) return;
    setCalculating(true);
    setCalcError(null);
    setCalcSuccess(false);
    try {
      const res = await fetch(apiUrl('/api/astrology/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: birthDate,
          time: unknownTime ? undefined : birthTime || undefined,
          place: birthPlace,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Calculation failed');
      const bd: BirthData = {
        date: birthDate,
        time: unknownTime ? undefined : birthTime || undefined,
        place: birthPlace,
        geocodedPlace: data.geocodedPlace,
      };
      const newProfile: AstrologyProfile = {
        mode: 'full-chart',
        birthData: bd,
        fullChart: data.chart,
      };
      onUpdateAstrology(newProfile);
      setCalcSuccess(true);
    } catch (err: unknown) {
      setCalcError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCalculating(false);
    }
  }

  function handleSaveReminder() {
    onUpdateProfile({
      morningReminder: { enabled: reminderEnabled, time: reminderEnabled ? reminderTime : undefined },
    });
    setSavedReminder(true);
    setTimeout(() => setSavedReminder(false), 2000);
  }

  function handleSaveSleep() {
    onUpdateProfile({ bedtime: settingsBedtime, wakeTime: settingsWakeTime });
    setSavedSleep(true);
    setTimeout(() => setSavedSleep(false), 2000);
  }

  // ── Tab: Profile ─────────────────────────────────────────────────────────────

  const ProfileTab = (
    <div className="space-y-8">
      {/* Identity Card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden border border-primary/10"
      >
        <div className="absolute top-0 right-0 p-4 opacity-[0.04] pointer-events-none">
          <User size={100} />
        </div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary-container/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Moon size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-xl text-on-surface">Dreamer</h2>
            <p className="text-on-surface-variant text-sm opacity-60 italic mt-0.5">
              Sanctuary member since 2026
            </p>
            {user?.age && (
              <p className="text-xs text-on-surface-variant/50 mt-1">{user.age} years old</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 flex flex-col gap-3">
          <Clock size={18} className="text-tertiary opacity-80" />
          <div>
            <h3 className="text-[10px] font-sans uppercase tracking-widest text-on-surface/40 mb-1">Sleep Window</h3>
            <p className="text-sm font-medium text-on-surface">
              {fmt12h(user?.bedtime)} – {fmt12h(user?.wakeTime)}
            </p>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 flex flex-col gap-3">
          <Zap size={18} className="text-primary opacity-80" />
          <div>
            <h3 className="text-[10px] font-sans uppercase tracking-widest text-on-surface/40 mb-1">Dream Recall</h3>
            <p className="text-sm font-medium text-on-surface">
              {user?.dreamRecall ? RECALL_LABELS[user.dreamRecall] : '—'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Goals */}
      {hasGoals && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40 ml-1">My Intentions</h2>
          <div className="space-y-2">
            {user!.goals!.map(goal => {
              const Icon = GOAL_ICONS[goal];
              return (
                <div
                  key={goal}
                  className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/10"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <span className="text-sm text-on-surface">{GOAL_LABELS[goal]}</span>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Recurring dreams */}
      {user?.recurringDreams && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40 ml-1">Recurring Themes</h2>
          <div className="bg-surface-container-low px-5 py-4 rounded-xl border border-outline-variant/10">
            <p className="text-sm text-on-surface/80 italic font-serif leading-relaxed">
              "{user.recurringDreams}"
            </p>
          </div>
        </motion.section>
      )}

      {/* Emotional tones */}
      {hasMoods && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40 ml-1">Emotional Palette</h2>
          <div className="flex flex-wrap gap-2">
            {user!.typicalMoods!.map(mood => (
              <span
                key={mood}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {MOOD_LABELS[mood]}
              </span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Sign out */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={onLogout}
          className="w-full bg-surface-container-low/50 px-5 py-4 rounded-xl border border-outline-variant/5 flex items-center justify-between group hover:bg-error-container/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-on-surface-variant group-hover:text-error transition-colors" />
            <span className="text-sm font-medium group-hover:text-error transition-colors">Sign Out</span>
          </div>
        </button>
      </motion.div>

      <div className="text-center pt-2">
        <p className="text-[9px] text-on-surface-variant/25 uppercase tracking-[0.3em]">
          Dreamcatcher v2.0 · Lucid Interface
        </p>
      </div>
    </div>
  );

  // ── Tab: Chart ───────────────────────────────────────────────────────────────

  const ChartTab = (
    <div className="space-y-6">
      {/* Top 3 placements */}
      {(chart || (astro?.sunSign)) ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-high rounded-2xl p-6 border border-primary/10"
          >
            <div className="flex justify-around">
              {[
                { symbol: '☉', label: 'Sun',    sign: chart?.sun?.sign ?? astro?.sunSign },
                { symbol: '☽', label: 'Moon',   sign: chart?.moon?.sign },
                { symbol: '↑', label: 'Rising', sign: chart?.rising?.sign },
              ].map(p => (
                <div key={p.label} className="text-center">
                  <p className="text-2xl mb-1 text-primary/60">{p.symbol}</p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">{p.label}</p>
                  {p.sign ? (
                    <>
                      <p className="text-lg mt-1">{ZODIAC_SYMBOLS[p.sign as ZodiacSign] ?? ''}</p>
                      <p className="text-xs font-medium text-on-surface">{p.sign}</p>
                    </>
                  ) : (
                    <p className="text-2xl text-on-surface/20 mt-1">—</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Table / Visual toggle */}
          {chart && (
            <>
              <div className="flex bg-surface-container-high rounded-xl p-1">
                {(['table', 'visual'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setChartViewMode(mode)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      chartViewMode === mode
                        ? 'bg-primary/20 text-primary'
                        : 'text-on-surface/40 hover:text-on-surface/60'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {chartViewMode === 'table' ? (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden"
                  >
                    {PLANETS.filter(p => {
                      const key = p.key as keyof FullBirthChart;
                      if (p.key === 'rising' && !chart.hasTime) return false;
                      return !!chart[key];
                    }).map((p, i) => {
                      const placement = chart[p.key as keyof FullBirthChart] as { sign: ZodiacSign; degree?: number; house?: number } | undefined;
                      if (!placement || typeof placement !== 'object' || !('sign' in placement)) return null;
                      return (
                        <div
                          key={p.key}
                          className={`flex items-center justify-between px-4 py-2.5 ${i !== 0 ? 'border-t border-outline-variant/5' : ''}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base w-5 text-center text-primary/60">{p.symbol}</span>
                            <span className="text-xs text-on-surface/50">{p.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-on-surface">
                              {ZODIAC_SYMBOLS[placement.sign]} {placement.sign}
                              {placement.degree !== undefined && (
                                <span className="text-on-surface/40 font-normal"> {placement.degree}°</span>
                              )}
                            </span>
                            {placement.house && (
                              <span className="text-[10px] text-on-surface/30 bg-surface-container px-1.5 py-0.5 rounded-full">
                                H{placement.house}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="visual"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-4"
                  >
                    <ChartVisual chart={chart} />
                    <p className="text-center text-[9px] text-on-surface/20 uppercase tracking-wider mt-2">
                      Decorative representation
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {!chart && astro?.sunSign && (
            <div className="bg-surface-container-low rounded-xl border border-dashed border-primary/20 px-5 py-6 text-center space-y-2">
              <p className="text-sm text-on-surface/50 leading-relaxed">
                Add your birth date, time, and place in Settings to generate your full chart.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-surface-container-low rounded-xl border border-dashed border-primary/20 px-5 py-8 flex flex-col items-center gap-3 text-center">
          <Stars size={28} className="text-primary/30" />
          <p className="text-sm text-on-surface/40 leading-relaxed max-w-xs">
            Go to Settings and enter your birth data to generate your astrological chart.
          </p>
        </div>
      )}
    </div>
  );

  // ── Tab: Settings ─────────────────────────────────────────────────────────────

  const SettingsTab = (
    <div className="space-y-8">

      {/* Chart section */}
      <section className="space-y-4">
        <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40 ml-1">Chart</h2>
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-5 space-y-4">

          {/* Birth Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
              <Calendar size={10} /> Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => { setBirthDate(e.target.value); setCalcSuccess(false); }}
              className="w-full bg-surface-container border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none transition-colors"
            />
          </div>

          {/* Birth Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
              <Clock size={10} /> Time of Birth
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={e => { setBirthTime(e.target.value); setCalcSuccess(false); }}
              disabled={unknownTime}
              className="w-full bg-surface-container border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none transition-colors disabled:opacity-40"
            />
            <label className="flex items-center gap-2 ml-1 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={e => { setUnknownTime(e.target.checked); setCalcSuccess(false); }}
                className="rounded border-outline-variant/30 accent-primary"
              />
              <span className="text-[10px] text-on-surface/40">I don't know my birth time</span>
            </label>
          </div>

          {/* Birth Place */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
              <MapPin size={10} /> Place of Birth
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={e => { setBirthPlace(e.target.value); setCalcSuccess(false); }}
              placeholder="City, Country — e.g. Copenhagen, Denmark"
              className="w-full bg-surface-container border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface placeholder-on-surface/20 focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-on-surface/30 ml-1">Include the country for best results</p>
          </div>

          {calcError && (
            <div className="flex items-start gap-2 bg-error/10 border border-error/20 rounded-xl px-4 py-3">
              <AlertCircle size={14} className="text-error mt-0.5 flex-shrink-0" />
              <p className="text-xs text-error/80">{calcError}</p>
            </div>
          )}

          {calcSuccess && (
            <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-3">
              <Check size={14} className="text-teal-400" />
              <p className="text-xs text-teal-400">Chart calculated and saved!</p>
            </div>
          )}

          <button
            onClick={handleCalculateChart}
            disabled={!birthDate || !birthPlace || calculating}
            className="w-full py-3.5 rounded-xl bg-primary/15 border border-primary/30 text-sm text-primary font-semibold hover:bg-primary/25 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {calculating ? (
              <>
                <Loader size={14} className="animate-spin" />
                Calculating your chart…
              </>
            ) : (
              <>
                <Stars size={14} />
                Calculate Chart
              </>
            )}
          </button>
        </div>
      </section>

      {/* Morning Reminder */}
      <section className="space-y-4">
        <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40 ml-1">Morning Reminder</h2>
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-5 space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setReminderEnabled(v => !v)}
          >
            <div>
              <p className="text-sm font-medium text-on-surface">Morning dream reminder</p>
              <p className="text-xs text-on-surface-variant/50 mt-0.5">
                {reminderEnabled ? 'On' : 'Off'}
              </p>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${reminderEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${reminderEnabled ? 'left-7' : 'left-1'}`} />
            </div>
          </div>
          {reminderEnabled && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none transition-colors"
              />
            </div>
          )}
          <button
            onClick={handleSaveReminder}
            className="w-full py-3 rounded-xl bg-primary/15 border border-primary/30 text-sm text-primary font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-2"
          >
            {savedReminder ? <><Check size={14} /> Saved!</> : 'Save Reminder'}
          </button>
        </div>
      </section>

      {/* Sleep Window */}
      <section className="space-y-4">
        <h2 className="font-sans text-xs uppercase tracking-widest text-on-surface/40 ml-1">Sleep Window</h2>
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-on-surface/40 ml-1 flex items-center gap-1">
                <Moon size={9} /> Bedtime
              </label>
              <input
                type="time"
                value={settingsBedtime}
                onChange={e => setSettingsBedtime(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-3 text-sm text-on-surface focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-on-surface/40 ml-1 flex items-center gap-1">
                Wake Time
              </label>
              <input
                type="time"
                value={settingsWakeTime}
                onChange={e => setSettingsWakeTime(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-3 text-sm text-on-surface focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleSaveSleep}
            className="w-full py-3 rounded-xl bg-primary/15 border border-primary/30 text-sm text-primary font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-2"
          >
            {savedSleep ? <><Check size={14} /> Saved!</> : 'Save Sleep Window'}
          </button>
        </div>
      </section>

      {/* Sign Out */}
      <button
        onClick={onLogout}
        className="w-full bg-surface-container-low/50 px-5 py-4 rounded-xl border border-outline-variant/5 flex items-center justify-between group hover:bg-error-container/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <LogOut size={18} className="text-on-surface-variant group-hover:text-error transition-colors" />
          <span className="text-sm font-medium group-hover:text-error transition-colors">Sign Out</span>
        </div>
      </button>

    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-6">
      <header className="space-y-1">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-70">
          Your Profile
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          The <span className="italic text-primary" style={{ textShadow: '0 0 20px rgba(168,133,238,0.4)' }}>Dreamer</span>
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex bg-surface-container-high rounded-xl p-1 gap-0.5">
        {(['profile', 'chart', 'sleep', 'settings'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-[10px] font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-primary/20 text-primary'
                : 'text-on-surface/40 hover:text-on-surface/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile'  && ProfileTab}
          {activeTab === 'chart'    && ChartTab}
          {activeTab === 'sleep'    && <Sleep user={user} embedded />}
          {activeTab === 'settings' && SettingsTab}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
