import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wind, Sun, Stars, Moon, Trees,
  Flame, Scale, Crosshair, Fish, Mountain, Droplets, Leaf,
  ArrowRight, Check, Sparkles, Clock,
  Brain, Eye, BookOpen, Heart, Compass, Zap, Bell, BellOff,
  Calendar, MapPin, Loader, AlertCircle,
} from 'lucide-react';
import {
  UserProfile, DreamGoal, EmotionalTone, DreamRecallFrequency,
  StressLevel, LifePhase, DreamRelationship, SleepQuality,
  AstroMode, ZodiacSign, AstrologyProfile, FullBirthChart, BirthData,
} from '../types';
import { apiUrl } from '../api';

interface OnboardingProps {
  onComplete: (data: UserProfile) => void;
}

const GOALS: { id: DreamGoal; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'track-recurring',     label: 'Track recurring dreams',      desc: 'Spot patterns over time',        icon: Moon },
  { id: 'explore-symbols',     label: 'Explore symbolism',           desc: 'Decode hidden meanings',         icon: BookOpen },
  { id: 'process-emotions',    label: 'Process emotions',            desc: 'Understand your inner world',    icon: Heart },
  { id: 'improve-lucidity',    label: 'Improve lucid dreaming',      desc: 'Gain control in the dreamscape', icon: Eye },
  { id: 'understand-patterns', label: 'Understand patterns',         desc: 'Weekly and monthly insights',    icon: Brain },
  { id: 'just-curious',        label: 'Just curious',                desc: 'Explore at your own pace',       icon: Compass },
];

const MOODS: { id: EmotionalTone; label: string; symbol: string }[] = [
  { id: 'peaceful',     label: 'Peaceful',     symbol: '☽' },
  { id: 'anxious',      label: 'Anxious',      symbol: '⊗' },
  { id: 'adventurous',  label: 'Adventurous',  symbol: '↑' },
  { id: 'melancholic',  label: 'Melancholic',  symbol: '●' },
  { id: 'surreal',      label: 'Surreal',      symbol: '◎' },
  { id: 'vivid',        label: 'Vivid',        symbol: '✦' },
  { id: 'joyful',       label: 'Joyful',       symbol: '○' },
  { id: 'confused',     label: 'Confused',     symbol: '∞' },
  { id: 'afraid',       label: 'Afraid',       symbol: '◈' },
  { id: 'hopeful',      label: 'Hopeful',      symbol: '△' },
  { id: 'curious',      label: 'Curious',      symbol: '⊙' },
  { id: 'excited',      label: 'Excited',      symbol: '⋆' },
  { id: 'overwhelmed',  label: 'Overwhelmed',  symbol: '≋' },
  { id: 'lonely',       label: 'Lonely',       symbol: '◌' },
  { id: 'wonder',       label: 'Wonder',       symbol: '✧' },
  { id: 'euphoric',     label: 'Euphoric',     symbol: '◉' },
  { id: 'tender',       label: 'Tender',       symbol: '❍' },
  { id: 'strange',      label: 'Strange',      symbol: '⊛' },
  { id: 'safe',         label: 'Safe',         symbol: '▽' },
  { id: 'lost',         label: 'Lost',         symbol: '≈' },
];

const RECALL_OPTIONS: { id: DreamRecallFrequency; label: string; sub: string }[] = [
  { id: 'rarely',        label: 'Rarely',        sub: 'A few times a year' },
  { id: 'sometimes',     label: 'Sometimes',     sub: 'A couple times a month' },
  { id: 'often',         label: 'Often',         sub: 'Several times a week' },
  { id: 'almost-always', label: 'Almost always', sub: 'Every morning' },
];

const LIFE_PHASES: { id: LifePhase; label: string; icon: React.ElementType }[] = [
  { id: 'transition',        label: 'A Transition',         icon: Wind },
  { id: 'loss',              label: 'A Loss',               icon: Leaf },
  { id: 'new-beginning',     label: 'A New Beginning',      icon: Flame },
  { id: 'stillness',         label: 'A Period of Stillness', icon: Mountain },
  { id: 'prefer-not-to-say', label: 'Prefer not to say',   icon: Compass },
];

const ZODIAC_SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};
const ZODIAC_SIGN_LIST = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const TOTAL_STEPS = 9;

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [age, setAge] = useState<number>(24);

  // Step 2
  const [goals, setGoals] = useState<DreamGoal[]>([]);

  // Step 3 — Dream World
  const [keptJournalBefore, setKeptJournalBefore] = useState<boolean | undefined>(undefined);
  const [dreamRelationship, setDreamRelationship] = useState<DreamRelationship | undefined>(undefined);
  const [hasRecurring, setHasRecurring] = useState<boolean>(false);
  const [recurringDreams, setRecurringDreams] = useState('');

  // Step 4 — Sleep
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [dreamRecall, setDreamRecall] = useState<DreamRecallFrequency>('sometimes');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | undefined>(undefined);

  // Step 5 — Life Right Now
  const [stressLevel, setStressLevel] = useState<StressLevel | undefined>(undefined);
  const [lifePhase, setLifePhase] = useState<LifePhase | undefined>(undefined);

  // Step 6 — Emotional Palette
  const [typicalMoods, setTypicalMoods] = useState<EmotionalTone[]>([]);

  // Step 7 — Morning Reminder
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('07:15');

  // Step 8 — Astrology
  const [astroMode, setAstroMode] = useState<AstroMode>('sun-sign');
  const [selectedSunSign, setSelectedSunSign] = useState<ZodiacSign | undefined>(undefined);
  const [astroBirthDate, setAstroBirthDate] = useState('');
  const [astroBirthTime, setAstroBirthTime] = useState('');
  const [astroBirthPlace, setAstroBirthPlace] = useState('');
  const [astroUnknownTime, setAstroUnknownTime] = useState(false);
  const [astroCalculating, setAstroCalculating] = useState(false);
  const [astroCalcError, setAstroCalcError] = useState<string | null>(null);
  const [astroCalculatedChart, setAstroCalculatedChart] = useState<FullBirthChart | undefined>(undefined);
  const [astroGeocodedPlace, setAstroGeocodedPlace] = useState<string | undefined>(undefined);

  const toggleGoal = (id: DreamGoal) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const toggleMood = (id: EmotionalTone) => {
    setTypicalMoods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));

  async function handleAstroCalculate() {
    if (!astroBirthDate || !astroBirthPlace) return;
    setAstroCalculating(true);
    setAstroCalcError(null);
    try {
      const res = await fetch(apiUrl('/api/astrology/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: astroBirthDate,
          time: astroUnknownTime ? undefined : astroBirthTime || undefined,
          place: astroBirthPlace,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Calculation failed');
      setAstroCalculatedChart(data.chart);
      setAstroGeocodedPlace(data.geocodedPlace);
    } catch (err: unknown) {
      setAstroCalcError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setAstroCalculating(false);
    }
  }

  const handleFinish = () => {
    let astrologyProfile: AstrologyProfile | undefined;
    if (astroMode === 'sun-sign' && selectedSunSign) {
      astrologyProfile = { mode: 'sun-sign', sunSign: selectedSunSign };
    } else if (astroMode === 'full-chart' && astroCalculatedChart) {
      const bd: BirthData = {
        date: astroBirthDate,
        time: astroUnknownTime ? undefined : astroBirthTime || undefined,
        place: astroBirthPlace,
        geocodedPlace: astroGeocodedPlace,
      };
      astrologyProfile = { mode: 'full-chart', birthData: bd, fullChart: astroCalculatedChart };
    }
    onComplete({
      age,
      goals,
      recurringDreams: hasRecurring ? recurringDreams : undefined,
      keptJournalBefore,
      dreamRelationship,
      sleepQuality,
      stressLevel,
      lifePhase,
      typicalMoods,
      bedtime,
      wakeTime,
      dreamRecall,
      morningReminder: {
        enabled: reminderEnabled,
        time: reminderEnabled ? reminderTime : undefined,
      },
      ...(astrologyProfile ? { astrologyProfile } : {}),
    });
  };

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const isOptionalStep = [3, 5, 6, 7, 8].includes(step);

  const ctaLabel = () => {
    if (step === 1) return 'Set My Intentions';
    if (step === 2) return 'Continue the Journey';
    if (step === 3) return 'Continue';
    if (step === 4) return 'Continue';
    if (step === 5) return 'Continue';
    if (step === 6) return 'Set Up My Reminder';
    if (step === 7) return 'Continue';
    if (step === 8) return 'Almost There';
    return 'Enter the Dreamscape';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-20 pb-12 relative overflow-hidden">
      <div className="w-full max-w-md flex flex-col gap-8">

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
              style={{ boxShadow: '0 0 8px rgba(168,133,238,0.5)' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Age ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-8"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  Tell us<br />about yourself
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  A few quick details to personalise your dream sanctuary.
                </p>
              </div>

              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Current Age
                </label>
                <input
                  type="number"
                  value={age}
                  min={13}
                  max={120}
                  onChange={e => setAge(parseInt(e.target.value) || 24)}
                  className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-xl py-4 px-6 text-xl font-serif text-on-surface focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Goals ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-8"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  What calls<br />you here?
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Select everything that resonates. We'll personalise your experience accordingly.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {GOALS.map(goal => {
                  const selected = goals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                        selected
                          ? 'border-primary/40 bg-primary/8 shadow-[0_0_12px_rgba(168,133,238,0.1)]'
                          : 'border-outline-variant/10 bg-surface-container-low hover:border-outline-variant/25'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        selected ? 'bg-primary text-surface' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {selected ? <Check size={18} /> : <goal.icon size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium transition-colors ${selected ? 'text-primary' : 'text-on-surface'}`}>
                          {goal.label}
                        </p>
                        <p className="text-xs text-on-surface-variant/60 mt-0.5">{goal.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Your Dream World ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-8"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  Your dream<br />world
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Let's understand your relationship with dreaming.
                </p>
              </div>

              {/* Journal before */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Have you kept a dream journal before?
                </label>
                <div className="flex gap-3">
                  {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(opt => (
                    <button
                      key={String(opt.val)}
                      onClick={() => setKeptJournalBefore(opt.val)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        keptJournalBefore === opt.val
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:border-outline-variant/25'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dream relationship */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  How do you see your dreams?
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'meaningful' as DreamRelationship,  label: 'They carry meaning' },
                    { id: 'just-noise' as DreamRelationship,  label: 'Just random noise' },
                    { id: 'not-sure'   as DreamRelationship,  label: "I'm not sure yet" },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setDreamRelationship(opt.id)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl border transition-all duration-200 ${
                        dreamRelationship === opt.id
                          ? 'border-primary/40 bg-primary/8 text-primary'
                          : 'border-outline-variant/10 bg-surface-container-low text-on-surface hover:border-outline-variant/25'
                      }`}
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        dreamRelationship === opt.id ? 'border-primary bg-primary' : 'border-outline-variant/30'
                      }`}>
                        {dreamRelationship === opt.id && <Check size={9} className="text-surface" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurring dreams */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Do you have recurring dreams?
                </label>
                <div className="flex gap-3">
                  {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(opt => (
                    <button
                      key={String(opt.val)}
                      onClick={() => setHasRecurring(opt.val)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        hasRecurring === opt.val
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:border-outline-variant/25'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {hasRecurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <textarea
                      value={recurringDreams}
                      onChange={e => setRecurringDreams(e.target.value)}
                      rows={3}
                      placeholder="Briefly describe one..."
                      className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-xl py-3 px-4 text-sm font-sans text-on-surface placeholder-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 outline-none resize-none transition-all leading-relaxed"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Sleep ── */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-8"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  When do<br />you sleep?
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Your sleep rhythm shapes the quality and depth of your dreamscape.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1 flex items-center gap-1.5">
                    <Moon size={10} /> Bedtime
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={e => setBedtime(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-xl py-4 px-4 text-base font-serif text-on-surface focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1 flex items-center gap-1.5">
                    <Sun size={10} /> Wake Time
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={e => setWakeTime(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-xl py-4 px-4 text-base font-serif text-on-surface focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  How often do you recall dreams?
                </label>
                <div className="space-y-2">
                  {RECALL_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setDreamRecall(opt.id)}
                      className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                        dreamRecall === opt.id
                          ? 'border-primary/40 bg-primary/8 shadow-[0_0_12px_rgba(168,133,238,0.1)]'
                          : 'border-outline-variant/10 bg-surface-container-low hover:border-outline-variant/25'
                      }`}
                    >
                      <div className="text-left">
                        <p className={`text-sm font-medium transition-colors ${dreamRecall === opt.id ? 'text-primary' : 'text-on-surface'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-on-surface-variant/50 mt-0.5">{opt.sub}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        dreamRecall === opt.id ? 'border-primary bg-primary' : 'border-outline-variant/30'
                      }`}>
                        {dreamRecall === opt.id && <Check size={11} className="text-surface" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Sleep Quality
                </label>
                <div className="flex gap-2">
                  {(['poor', 'average', 'good'] as SleepQuality[]).map(q => (
                    <button
                      key={q}
                      onClick={() => setSleepQuality(q)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${
                        sleepQuality === q
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:border-outline-variant/25'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 5: Life Right Now ── */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-8"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  What's moving<br />through your life?
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Context helps us understand the lens through which you dream.
                </p>
              </div>

              {/* Stress Level */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Current Stress Level
                </label>
                <div className="flex gap-2">
                  {(['low', 'moderate', 'high'] as StressLevel[]).map(level => (
                    <button
                      key={level}
                      onClick={() => setStressLevel(level)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${
                        stressLevel === level
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:border-outline-variant/25'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Life Phase */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Are you in any of these?
                </label>
                <div className="space-y-2">
                  {LIFE_PHASES.map(phase => {
                    const selected = lifePhase === phase.id;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => setLifePhase(phase.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                          selected
                            ? 'border-primary/40 bg-primary/8 shadow-[0_0_12px_rgba(168,133,238,0.1)]'
                            : 'border-outline-variant/10 bg-surface-container-low hover:border-outline-variant/25'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          selected ? 'bg-primary text-surface' : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {selected ? <Check size={16} /> : <phase.icon size={16} />}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${selected ? 'text-primary' : 'text-on-surface'}`}>
                          {phase.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 6: Emotional Palette ── */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-8"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  Your emotional<br />palette
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  What emotional tones do your dreams most often carry?
                </p>
              </div>

              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Typical Emotional Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(mood => {
                    const selected = typicalMoods.includes(mood.id);
                    return (
                      <button
                        key={mood.id}
                        onClick={() => toggleMood(mood.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                          selected
                            ? 'bg-primary text-surface shadow-[0_0_10px_rgba(168,133,238,0.3)]'
                            : 'bg-surface-container-low border border-outline-variant/15 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        <span>{mood.symbol}</span>
                        <span>{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 7: Morning reminder ── */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-8"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  Catch them<br />before they fade
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Dreams dissolve within minutes of waking. A gentle morning nudge helps you capture them before they're gone.
                </p>
              </div>

              {/* Visual */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary-container/20 border border-primary/20 flex items-center justify-center">
                    {reminderEnabled
                      ? <Bell size={32} className="text-primary" />
                      : <BellOff size={32} className="text-on-surface/30" />
                    }
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <div
                className="flex items-center justify-between bg-surface-container-low px-5 py-4 rounded-xl border border-outline-variant/10 cursor-pointer"
                onClick={() => setReminderEnabled(v => !v)}
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">Morning dream reminder</p>
                  <p className="text-xs text-on-surface-variant/50 mt-0.5">
                    {reminderEnabled ? 'On — you can change the time below' : 'Off — you can turn this on later in Settings'}
                  </p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${reminderEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${reminderEnabled ? 'left-7' : 'left-1'}`} />
                </div>
              </div>

              {/* Time picker */}
              {reminderEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1 flex items-center gap-1.5">
                    <Clock size={10} /> Reminder time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={e => setReminderTime(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-xl py-4 px-5 text-xl font-serif text-on-surface focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                  <p className="text-[10px] text-on-surface-variant/40 ml-1">Set this to a few minutes after you usually wake up</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── STEP 8: Astrology ── */}
          {step === 8 && (
            <motion.div
              key="step8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="glass-panel p-8 rounded-2xl border border-outline-variant/10 flex flex-col gap-6"
            >
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  Your cosmic<br />blueprint
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Optional — go as deep as you like. Your chart personalises your dream insights.
                </p>
              </div>

              {/* Mode cards */}
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'sun-sign' as AstroMode, glyph: '☉', title: 'Sun Sign Only', sub: 'Quick — just your star sign' },
                  { id: 'full-chart' as AstroMode, glyph: '✦', title: 'Full Birth Chart', sub: 'Calculated from birth data' },
                ]).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setAstroMode(m.id); setAstroCalculatedChart(undefined); setAstroCalcError(null); }}
                    className={`rounded-xl px-4 py-4 text-left transition-all border ${
                      astroMode === m.id
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-surface-container-low border-outline-variant/10 text-on-surface/60 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="text-xl mb-1">{m.glyph}</div>
                    <div className="text-xs font-semibold">{m.title}</div>
                    <div className="text-[10px] opacity-60 mt-0.5 leading-snug">{m.sub}</div>
                  </button>
                ))}
              </div>

              {/* Sun Sign picker */}
              {astroMode === 'sun-sign' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p className="text-xs text-on-surface/40 ml-1">Select your sun sign</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ZODIAC_SIGN_LIST.map(sign => (
                      <button
                        key={sign}
                        type="button"
                        onClick={() => setSelectedSunSign(sign as ZodiacSign)}
                        className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-xs transition-all ${
                          selectedSunSign === sign
                            ? 'bg-primary/20 text-primary border border-primary/40'
                            : 'bg-surface-container text-on-surface/60 border border-outline-variant/10 hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="text-lg leading-none">{ZODIAC_SIGN_SYMBOLS[sign]}</span>
                        <span className="mt-1 text-[10px] leading-tight">{sign}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Full Birth Chart form */}
              {astroMode === 'full-chart' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
                      <Calendar size={10} /> Date of Birth
                    </label>
                    <input
                      type="date"
                      value={astroBirthDate}
                      onChange={e => { setAstroBirthDate(e.target.value); setAstroCalculatedChart(undefined); }}
                      className="w-full bg-surface-container-low border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
                      <Clock size={10} /> Time of Birth
                    </label>
                    <input
                      type="time"
                      value={astroBirthTime}
                      onChange={e => { setAstroBirthTime(e.target.value); setAstroCalculatedChart(undefined); }}
                      disabled={astroUnknownTime}
                      className="w-full bg-surface-container-low border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none transition-colors disabled:opacity-40"
                    />
                    <label className="flex items-center gap-2 ml-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={astroUnknownTime}
                        onChange={e => { setAstroUnknownTime(e.target.checked); setAstroCalculatedChart(undefined); }}
                        className="rounded border-outline-variant/30 accent-primary"
                      />
                      <span className="text-[10px] text-on-surface/40">I don't know my birth time</span>
                    </label>
                  </div>

                  {/* Place */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-on-surface/40 ml-1">
                      <MapPin size={10} /> Place of Birth
                    </label>
                    <input
                      type="text"
                      value={astroBirthPlace}
                      onChange={e => { setAstroBirthPlace(e.target.value); setAstroCalculatedChart(undefined); }}
                      placeholder="City, Country — e.g. Oslo, Norway"
                      className="w-full bg-surface-container-low border border-outline-variant/15 focus:border-primary/40 rounded-xl py-3 px-4 text-sm text-on-surface placeholder-on-surface/20 focus:outline-none transition-colors"
                    />
                    <p className="text-[10px] text-on-surface/30 ml-1">Include the country for best results</p>
                  </div>

                  {astroCalcError && (
                    <div className="flex items-start gap-2 bg-error/10 border border-error/20 rounded-xl px-4 py-3">
                      <AlertCircle size={14} className="text-error mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-error/80">{astroCalcError}</p>
                    </div>
                  )}

                  {astroCalculatedChart ? (
                    <div className="space-y-2">
                      {astroGeocodedPlace && (
                        <p className="text-[10px] text-on-surface/30 px-1">📍 {astroGeocodedPlace}</p>
                      )}
                      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
                        {(['sun','moon','rising'] as const).map((key, i) => {
                          const pl = astroCalculatedChart[key as keyof FullBirthChart] as { sign: ZodiacSign } | undefined;
                          if (!pl || typeof pl !== 'object' || !('sign' in pl)) return null;
                          const symbols: Record<string, string> = { sun: '☉', moon: '☽', rising: '↑' };
                          const labels: Record<string, string> = { sun: 'Sun', moon: 'Moon', rising: 'Rising' };
                          return (
                            <div
                              key={key}
                              className={`flex items-center justify-between px-4 py-2.5 ${i !== 0 ? 'border-t border-outline-variant/5' : ''}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base w-5 text-center text-primary/60">{symbols[key]}</span>
                                <span className="text-xs text-on-surface/50">{labels[key]}</span>
                              </div>
                              <span className="text-xs font-medium text-on-surface">
                                {ZODIAC_SIGN_SYMBOLS[pl.sign]} {pl.sign}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => { setAstroCalculatedChart(undefined); setAstroCalcError(null); }}
                        className="text-[10px] text-on-surface/30 hover:text-on-surface/60 transition-colors ml-1"
                      >
                        Recalculate with different details
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAstroCalculate}
                      disabled={!astroBirthDate || !astroBirthPlace || astroCalculating}
                      className="w-full py-3.5 rounded-xl bg-primary/15 border border-primary/30 text-sm text-primary font-semibold hover:bg-primary/25 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {astroCalculating ? (
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
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── STEP 9: Welcome ── */}
          {step === 9 && (
            <motion.div
              key="step9"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-10 rounded-2xl border border-outline-variant/10 flex flex-col items-center gap-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_32px_rgba(168,133,238,0.4)]">
                  <Sparkles size={36} className="text-surface" />
                </div>
              </motion.div>

              <div className="space-y-3">
                <h1 className="font-serif text-3xl text-on-surface leading-tight tracking-tight">
                  Welcome to the<br />Sanctuary
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed max-w-xs">
                  Your dreamscape is ready. Each morning, whisper your dreams and let the cosmos interpret them for you.
                </p>
              </div>

              <div className="w-full space-y-3 text-left">
                {[
                  { icon: Zap,   text: 'AI-powered dream analysis' },
                  { icon: Moon,  text: 'Track recurring themes over time' },
                  { icon: Stars, text: 'Weekly cosmic synthesis' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon size={15} className="text-primary" />
                    </div>
                    <span className="text-sm text-on-surface-variant">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* CTA Button */}
        <motion.button
          key={`cta-${step}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={step === TOTAL_STEPS ? handleFinish : next}
          disabled={step === 2 && goals.length === 0}
          className="w-full group relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-5 rounded-full font-bold tracking-widest uppercase text-xs shadow-[0_12px_24px_rgba(168,133,238,0.2)] active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="relative z-10">{ctaLabel()}</span>
          {step < TOTAL_STEPS
            ? <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
            : <Sparkles size={16} className="relative z-10" />
          }
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>

        {step === 2 && goals.length === 0 && (
          <p className="text-center text-on-surface-variant/50 text-xs">
            Select at least one intention to continue
          </p>
        )}

        {isOptionalStep && step < TOTAL_STEPS && (
          <button
            onClick={next}
            className="text-center text-on-surface-variant/40 text-[11px] uppercase tracking-[0.2em] hover:text-on-surface-variant/70 transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
