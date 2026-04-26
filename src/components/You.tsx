import React from 'react';
import { motion } from 'motion/react';
import {
  User, Stars, Settings, LogOut,
  Moon, Brain, Heart, Eye, BookOpen, Compass,
  Clock, Zap, ChevronRight, Sparkles
} from 'lucide-react';
import { UserProfile, DreamGoal, EmotionalTone, Screen } from '../types';

interface YouProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigate?: (screen: Screen) => void;
}

const GOAL_LABELS: Record<DreamGoal, string> = {
  'track-recurring':    'Track recurring dreams',
  'explore-symbols':    'Explore symbolism',
  'process-emotions':   'Process emotions',
  'improve-lucidity':   'Improve lucid dreaming',
  'understand-patterns':'Understand patterns',
  'just-curious':       'Just curious',
};

const GOAL_ICONS: Record<DreamGoal, React.ElementType> = {
  'track-recurring':    Moon,
  'explore-symbols':    BookOpen,
  'process-emotions':   Heart,
  'improve-lucidity':   Eye,
  'understand-patterns':Brain,
  'just-curious':       Compass,
};

const MOOD_LABELS: Record<EmotionalTone, string> = {
  'peaceful':    'Peaceful',
  'anxious':     'Anxious',
  'adventurous': 'Adventurous',
  'melancholic': 'Melancholic',
  'surreal':     'Surreal',
  'vivid':       'Vivid',
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

export default function You({ user, onLogout, onNavigate }: YouProps) {
  const hasGoals = user?.goals && user.goals.length > 0;
  const hasMoods = user?.typicalMoods && user.typicalMoods.length > 0;

  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-8">
      <header className="space-y-1">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-70">
          Your Profile
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          The <span className="italic text-primary" style={{ textShadow: '0 0 20px rgba(168,133,238,0.4)' }}>Dreamer</span>
        </h1>
      </header>

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
            {user?.starSign && (
              <div className="flex items-center gap-1.5 mt-2">
                <Stars size={12} className="text-primary opacity-70" />
                <span className="text-xs text-primary/80 font-medium">{user.starSign}</span>
                {user.age && (
                  <>
                    <span className="text-on-surface-variant/30 text-xs">·</span>
                    <span className="text-xs text-on-surface-variant/60">{user.age} yrs</span>
                  </>
                )}
              </div>
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

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <button
          onClick={() => onNavigate?.('insights')}
          className="w-full bg-surface-container-low px-5 py-4 rounded-xl border border-outline-variant/5 flex items-center justify-between group hover:bg-surface-container-high transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Weekly Synthesis</span>
          </div>
          <ChevronRight size={16} className="text-on-surface-variant/30" />
        </button>
        <button className="w-full bg-surface-container-low px-5 py-4 rounded-xl border border-outline-variant/5 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Preferences</span>
          </div>
          <ChevronRight size={16} className="text-on-surface-variant/30" />
        </button>

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
          Dreamcatcher v3.0 · Lucid Interface
        </p>
      </div>
    </div>
  );
}
