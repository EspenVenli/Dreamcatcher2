import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sparkles, Wind, Eye, Clock, ChevronRight, Star, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface SleepProps {
  user: UserProfile | null;
  embedded?: boolean;
}

const TECHNIQUES = [
  {
    id: 'mild',
    name: 'MILD',
    full: 'Mnemonic Induction of Lucid Dreams',
    icon: '☽',
    difficulty: 'Beginner',
    description: 'As you fall asleep, repeat: "I will recognise when I am dreaming." Visualise yourself becoming lucid in a recent dream. Plant the intention like a seed.',
    steps: [
      'Set an alarm for 5–6 hours after sleep',
      'When you wake, recall your dream vividly',
      'Return to sleep repeating your intention',
      'Visualise the dream — this time, you notice you are dreaming',
    ],
  },
  {
    id: 'wbtb',
    name: 'WBTB',
    full: 'Wake Back To Bed',
    icon: '◎',
    difficulty: 'Intermediate',
    description: 'Wake after 5–6 hours of sleep, stay awake for 20–30 minutes engaging your mind with dreaming, then return to sleep. REM sleep deepens and lucidity follows.',
    steps: [
      'Sleep for 5–6 hours, then wake with an alarm',
      'Stay awake 20–30 min — read about lucid dreaming',
      'Hold the intention of becoming aware in the dream',
      'Return to sleep — entry into REM is rapid here',
    ],
  },
  {
    id: 'wild',
    name: 'WILD',
    full: 'Wake-Initiated Lucid Dream',
    icon: '✦',
    difficulty: 'Advanced',
    description: 'Carry consciousness directly from wakefulness into the dream state. Requires stillness — let sleep paralysis wash over you without fear.',
    steps: [
      'Lie completely still, eyes closed',
      'Count breaths or watch the hypnagogic images',
      'Do not move — let the body sleep while mind watches',
      'Step into the forming dream world consciously',
    ],
  },
  {
    id: 'reality',
    name: 'Reality Checks',
    full: 'Waking Reality Testing',
    icon: '◈',
    difficulty: 'Daily Practice',
    description: 'Test reality throughout your day. These habits bleed into dreams — one day you will do a reality check inside a dream and realise you are there.',
    steps: [
      'Push a finger through your palm — does it pass through?',
      'Read text, look away, read again — does it change?',
      'Check the time twice — does it shift?',
      'Ask yourself sincerely: could I be dreaming right now?',
    ],
  },
];

const MEDITATIONS = [
  {
    title: 'The Threshold',
    duration: '7 min',
    description: 'A visualisation to soften the boundary between waking and dreaming. Bring yourself to the edge of sleep — conscious and still.',
    icon: '☽',
  },
  {
    title: 'Body to Sleep',
    duration: '10 min',
    description: 'A body scan that releases tension from feet to crown. The body dissolves into the bed. The mind remains as a quiet witness.',
    icon: '●',
  },
  {
    title: 'Dream Seed',
    duration: '5 min',
    description: 'Plant one image, one question, one intention before sleep. Ask your dreaming mind to meet you there.',
    icon: '✦',
  },
];

export default function Sleep({ user, embedded = false }: SleepProps) {
  const [openTechnique, setOpenTechnique] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'techniques' | 'meditations' | 'tonight'>('tonight');

  const tonight = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className={embedded ? 'space-y-4' : 'pt-6 pb-32 px-6 max-w-md mx-auto space-y-6'}>
      {/* Header — only shown as standalone screen */}
      {!embedded && (
        <header className="space-y-1 pt-2">
          <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">Sleep Sanctuary</span>
          <h1 className="font-serif text-4xl text-on-surface leading-tight">
            Dream <span className="italic text-primary" style={{ textShadow: '0 0 20px rgba(168,133,238,0.3)' }}>Deeper</span>
          </h1>
        </header>
      )}

      {/* Section tabs */}
      <div className="flex bg-surface-container-high rounded-xl p-1">
        {(['tonight', 'techniques', 'meditations'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium capitalize transition-all ${
              activeSection === tab
                ? 'bg-primary/20 text-primary'
                : 'text-on-surface/40 hover:text-on-surface/60'
            }`}
          >
            {tab === 'tonight' ? 'Tonight' : tab === 'techniques' ? 'Techniques' : 'Meditations'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* Tonight */}
        {activeSection === 'tonight' && (
          <motion.div
            key="tonight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="bg-surface-container-low rounded-2xl border border-primary/10 p-5 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none p-4">
                <Moon size={80} />
              </div>
              <div className="flex items-center gap-2">
                <Moon size={14} className="text-primary/60" />
                <span className="text-[10px] uppercase tracking-widest text-on-surface/40">{tonight}</span>
              </div>
              <h2 className="font-serif text-xl text-on-surface italic">Tonight's Intention</h2>
              <p className="text-sm text-on-surface/70 leading-relaxed font-serif italic">
                "Before you close your eyes, let your mind settle on one image — a door, a landscape, a face. Hold it softly. Ask your dreaming self to take you somewhere true."
              </p>
            </div>

            {/* Reality check reminder */}
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Eye size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Reality check</p>
                <p className="text-xs text-on-surface/50 mt-0.5 leading-relaxed">Push your finger through your palm right now. If you practice this while awake, you'll do it in your dreams.</p>
              </div>
            </div>

            {/* Pre-sleep checklist */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-on-surface/30 ml-1">Pre-sleep ritual</p>
              {[
                { icon: '◎', text: 'Set your phone face-down 30 minutes before sleep' },
                { icon: '☽', text: 'Recall a dream from last night before you sleep' },
                { icon: '✦', text: 'Choose one intention to carry into the dreamscape' },
                { icon: '●', text: 'Let your body grow heavy — you are safe to drift' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/10">
                  <span className="text-primary/50 text-base w-5 text-center font-mono">{item.icon}</span>
                  <p className="text-xs text-on-surface/60">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Techniques */}
        {activeSection === 'techniques' && (
          <motion.div
            key="techniques"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-3"
          >
            <p className="text-xs text-on-surface/40 leading-relaxed">Four paths into the lucid dream state. Start with MILD — it's the most accessible.</p>
            {TECHNIQUES.map(t => (
              <div key={t.id} className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
                <button
                  onClick={() => setOpenTechnique(openTechnique === t.id ? null : t.id)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <span className="text-xl w-8 text-center text-primary/60 font-mono">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-on-surface">{t.name}</span>
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary/70">{t.difficulty}</span>
                    </div>
                    <p className="text-[10px] text-on-surface/40 mt-0.5">{t.full}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-on-surface/20 flex-shrink-0 transition-transform ${openTechnique === t.id ? 'rotate-90' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openTechnique === t.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-outline-variant/10 px-4 pb-4 pt-3 space-y-3"
                    >
                      <p className="text-xs text-on-surface/60 leading-relaxed font-serif italic">{t.description}</p>
                      <div className="space-y-2">
                        {t.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-[10px] text-primary/50 font-mono mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
                            <p className="text-xs text-on-surface/50 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}

        {/* Meditations */}
        {activeSection === 'meditations' && (
          <motion.div
            key="meditations"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <p className="text-xs text-on-surface/40 leading-relaxed">Guided visualisations to soften the passage into sleep. Read slowly, or close your eyes and breathe.</p>
            {MEDITATIONS.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-primary/50 font-mono">{m.icon}</span>
                    <div>
                      <h3 className="text-sm font-medium text-on-surface font-serif italic">{m.title}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={9} className="text-on-surface/30" />
                        <span className="text-[10px] text-on-surface/30">{m.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-on-surface/55 leading-relaxed">{m.description}</p>
              </motion.div>
            ))}

            {/* Breathing exercise */}
            <div className="bg-gradient-to-br from-primary/8 to-primary-container/8 rounded-2xl border border-primary/10 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Wind size={16} className="text-primary/60" />
                <h3 className="text-sm font-medium text-primary/80">4-7-8 Breathing</h3>
              </div>
              <p className="text-xs text-on-surface/50 leading-relaxed">
                Inhale for <strong className="text-on-surface/70">4</strong> counts · Hold for <strong className="text-on-surface/70">7</strong> counts · Exhale for <strong className="text-on-surface/70">8</strong> counts.
                Repeat four times. This activates the parasympathetic nervous system and prepares the body for deep sleep.
              </p>
              <BreathingOrb />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function BreathingOrb() {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [label, setLabel] = useState('Tap to begin');

  function start() {
    if (phase !== 'idle') return;
    setPhase('inhale');
    setLabel('Inhale...');
    setTimeout(() => { setPhase('hold'); setLabel('Hold...'); }, 4000);
    setTimeout(() => { setPhase('exhale'); setLabel('Exhale...'); }, 11000);
    setTimeout(() => { setPhase('idle'); setLabel('Tap to begin'); }, 19000);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={start} className="relative w-20 h-20 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 border border-primary/30"
          animate={phase === 'inhale' ? { scale: 1.6, opacity: 0.8 } : phase === 'hold' ? { scale: 1.6, opacity: 0.8 } : phase === 'exhale' ? { scale: 1, opacity: 0.4 } : { scale: 1, opacity: 0.4 }}
          transition={phase === 'inhale' ? { duration: 4, ease: 'easeIn' } : phase === 'hold' ? { duration: 7 } : phase === 'exhale' ? { duration: 8, ease: 'easeOut' } : { duration: 0.3 }}
        />
        <Sparkles size={20} className="text-primary relative z-10" />
      </button>
      <p className="text-xs text-on-surface/40 tracking-widest uppercase">{label}</p>
    </div>
  );
}
