import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wind, Sun, Stars, Waves, Moon, Trees,
  Flame, Scale, Crosshair, Fish, Mountain, Droplets, Leaf,
  ArrowRight, Check, Sparkles, Clock, Brain,
  Eye, BookOpen, Heart, Compass, Zap
} from 'lucide-react';
import { UserProfile, DreamGoal, EmotionalTone, DreamRecallFrequency } from '../types';

interface OnboardingProps {
  onComplete: (data: UserProfile) => void;
}

const ZODIAC_SIGNS = [
  { name: 'Aries',       icon: Flame },
  { name: 'Taurus',      icon: Leaf },
  { name: 'Gemini',      icon: Stars },
  { name: 'Cancer',      icon: Waves },
  { name: 'Leo',         icon: Sun },
  { name: 'Virgo',       icon: Trees },
  { name: 'Libra',       icon: Scale },
  { name: 'Scorpio',     icon: Droplets },
  { name: 'Sagittarius', icon: Crosshair },
  { name: 'Capricorn',   icon: Mountain },
  { name: 'Aquarius',    icon: Wind },
  { name: 'Pisces',      icon: Fish },
];

const GOALS: { id: DreamGoal; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'track-recurring',    label: 'Track recurring dreams',     desc: 'Spot patterns over time',        icon: Moon },
  { id: 'explore-symbols',    label: 'Explore symbolism',          desc: 'Decode hidden meanings',         icon: BookOpen },
  { id: 'process-emotions',   label: 'Process emotions',           desc: 'Understand your inner world',    icon: Heart },
  { id: 'improve-lucidity',   label: 'Improve lucid dreaming',     desc: 'Gain control in the dreamscape', icon: Eye },
  { id: 'understand-patterns', label: 'Understand patterns',       desc: 'Weekly and monthly insights',    icon: Brain },
  { id: 'just-curious',       label: 'Just curious',               desc: 'Explore at your own pace',       icon: Compass },
];

const MOODS: { id: EmotionalTone; label: string }[] = [
  { id: 'peaceful',     label: 'Peaceful' },
  { id: 'anxious',      label: 'Anxious' },
  { id: 'adventurous',  label: 'Adventurous' },
  { id: 'melancholic',  label: 'Melancholic' },
  { id: 'surreal',      label: 'Surreal' },
  { id: 'vivid',        label: 'Vivid' },
];

const RECALL_OPTIONS: { id: DreamRecallFrequency; label: string; sub: string }[] = [
  { id: 'rarely',        label: 'Rarely',        sub: 'A few times a year' },
  { id: 'sometimes',     label: 'Sometimes',     sub: 'A couple times a month' },
  { id: 'often',         label: 'Often',         sub: 'Several times a week' },
  { id: 'almost-always', label: 'Almost always', sub: 'Every morning' },
];

const TOTAL_STEPS = 5;

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [age, setAge] = useState<number>(24);
  const [selectedSign, setSelectedSign] = useState<string>('Gemini');

  // Step 2
  const [goals, setGoals] = useState<DreamGoal[]>([]);

  // Step 3
  const [recurringDreams, setRecurringDreams] = useState('');
  const [typicalMoods, setTypicalMoods] = useState<EmotionalTone[]>([]);

  // Step 4
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [dreamRecall, setDreamRecall] = useState<DreamRecallFrequency>('sometimes');

  const toggleGoal = (id: DreamGoal) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const toggleMood = (id: EmotionalTone) => {
    setTypicalMoods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));

  const handleFinish = () => {
    onComplete({
      age,
      starSign: selectedSign,
      goals,
      recurringDreams,
      typicalMoods,
      bedtime,
      wakeTime,
      dreamRecall,
    });
  };

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

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

          {/* ── STEP 1: Who you are ── */}
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
                  Tell the stars<br />who you are
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Your celestial alignment helps calibrate your personal dream archetypes.
                </p>
              </div>

              {/* Age */}
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

              {/* Zodiac */}
              <div className="space-y-3">
                <div className="flex justify-between items-end ml-1">
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/70">Star Sign</label>
                  <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">Swipe to select</span>
                </div>
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-20 border-x border-primary/10 bg-primary/5 pointer-events-none rounded-xl" />
                  <div className="flex gap-3 overflow-x-auto py-3 px-[calc(50%-40px)] hide-scrollbar snap-x snap-mandatory">
                    {ZODIAC_SIGNS.map(sign => (
                      <div
                        key={sign.name}
                        onClick={() => setSelectedSign(sign.name)}
                        className="snap-center flex-shrink-0 w-20 flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                          selectedSign === sign.name
                            ? 'bg-gradient-to-br from-primary to-primary-container text-surface shadow-[0_0_14px_rgba(168,133,238,0.4)]'
                            : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                        }`}>
                          <sign.icon size={22} />
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest font-medium transition-all ${
                          selectedSign === sign.name ? 'text-primary opacity-100' : 'opacity-40'
                        }`}>
                          {sign.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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

          {/* ── STEP 3: Dream landscape ── */}
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
                  Your dream<br />landscape
                </h1>
                <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed">
                  Tell us about the recurring themes and emotional textures of your dreams.
                </p>
              </div>

              {/* Recurring dreams */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-primary/70 ml-1">
                  Recurring Dreams
                </label>
                <textarea
                  value={recurringDreams}
                  onChange={e => setRecurringDreams(e.target.value)}
                  rows={4}
                  placeholder="e.g. I often dream about flying over a city, or being back at school unable to find my classroom…"
                  className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-xl py-4 px-5 text-sm font-sans text-on-surface placeholder-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 outline-none resize-none transition-all leading-relaxed"
                />
                <p className="text-[10px] text-on-surface-variant/40 ml-1">Optional — skip if you're not sure yet</p>
              </div>

              {/* Typical moods */}
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
                        className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                          selected
                            ? 'bg-primary text-surface shadow-[0_0_10px_rgba(168,133,238,0.3)]'
                            : 'bg-surface-container-low border border-outline-variant/15 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        {mood.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Sleep schedule ── */}
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

              {/* Sleep times */}
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

              {/* Dream recall */}
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
            </motion.div>
          )}

          {/* ── STEP 5: Welcome ── */}
          {step === 5 && (
            <motion.div
              key="step5"
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
                  Your dreamscape is ready. Each night, whisper your dreams and let the cosmos interpret them for you.
                </p>
              </div>

              <div className="w-full space-y-3 text-left">
                {[
                  { icon: Zap,      text: 'AI-powered dream analysis' },
                  { icon: Moon,     text: 'Track recurring themes over time' },
                  { icon: Stars,    text: 'Weekly cosmic synthesis' },
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
          <span className="relative z-10">
            {step === 1 ? 'Align with the Cosmos' :
             step === 2 ? 'Set My Intentions' :
             step === 3 ? 'Continue the Journey' :
             step === 4 ? 'Almost There' :
             'Enter the Dreamscape'}
          </span>
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

        {step < TOTAL_STEPS && step !== 2 && (
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
