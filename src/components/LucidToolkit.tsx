import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Bell, BellOff, Moon, Brain, Hand, Compass, Sparkles, Clock } from 'lucide-react';
import { useToast } from './Toast';

const TECHNIQUES = [
  {
    name: 'MILD',
    full: 'Mnemonic Induction of Lucid Dreams',
    icon: Brain,
    steps: [
      'As you fall asleep, repeat: "next time I dream, I will know I am dreaming."',
      'Visualise yourself becoming lucid in a recent dream.',
      'Hold the intention until you drift off.',
    ],
  },
  {
    name: 'WBTB',
    full: 'Wake Back To Bed',
    icon: Clock,
    steps: [
      'Set an alarm for 4–6 hours after sleep onset.',
      'Stay awake gently for 15–30 minutes — read about dreams.',
      'Return to bed practising MILD or WILD.',
    ],
  },
  {
    name: 'WILD',
    full: 'Wake-Initiated Lucid Dream',
    icon: Eye,
    steps: [
      'Lie still, fully relaxed, eyes closed, after WBTB.',
      'Watch hypnagogic imagery without engaging it.',
      'When the dreamscape stabilises, gently step into it — already aware.',
    ],
  },
  {
    name: 'SSILD',
    full: 'Senses-Initiated Lucid Dream',
    icon: Hand,
    steps: [
      'Cycle attention through sight (closed eyes), sound, then bodily sensation.',
      'Do 6 short cycles, then 3 long ones.',
      'Let yourself drift off — lucidity often arrives within the next REM phase.',
    ],
  },
];

const REALITY_CHECKS = [
  { check: 'Look at your hands', why: 'In dreams they often distort, gain extra fingers, or shimmer.' },
  { check: 'Read text twice', why: 'In dreams the text rarely stays the same on a second read.' },
  { check: 'Push a finger through your palm', why: 'In dreams it often passes through.' },
  { check: 'Pinch your nose and try to breathe', why: 'In dreams you can usually still breathe.' },
  { check: 'Check a clock or phone', why: 'Time is unstable in dreams; the second-hand jumps or melts.' },
  { check: 'Ask: "How did I get here?"', why: 'In dreams the answer is usually missing or absurd.' },
];

const DREAM_SIGNS = [
  'Recurring location or building',
  'Specific person who often appears',
  'A sense of urgency without explanation',
  'Inability to find your phone or keys',
  'Late for an exam or flight',
  'Animals that speak',
  'Familiar street that suddenly turns strange',
];

export default function LucidToolkit() {
  const [intervalMin, setIntervalMin] = useState(60);
  const [running, setRunning] = useState(false);
  const [nextAt, setNextAt] = useState<number | null>(null);
  const [intention, setIntention] = useState('');
  const [notifAllowed, setNotifAllowed] = useState<NotificationPermission>('default');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setNotifAllowed(Notification.permission);
    }
    const saved = localStorage.getItem('dreamcatcher.intention');
    if (saved) setIntention(saved);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const requestPerm = async () => {
    if (typeof Notification === 'undefined') {
      toast.push('Notifications not supported here', 'error');
      return;
    }
    const p = await Notification.requestPermission();
    setNotifAllowed(p);
    if (p === 'granted') toast.push('Notifications enabled', 'success');
  };

  const fireCheck = () => {
    const c = REALITY_CHECKS[Math.floor(Math.random() * REALITY_CHECKS.length)];
    if (notifAllowed === 'granted') {
      try {
        new Notification('Reality Check', { body: c.check, silent: false });
      } catch {}
    } else {
      toast.push(`Reality check: ${c.check}`, 'info');
    }
  };

  const start = () => {
    if (running) return;
    setRunning(true);
    setNextAt(Date.now() + intervalMin * 60 * 1000);
    timerRef.current = setInterval(() => {
      fireCheck();
      setNextAt(Date.now() + intervalMin * 60 * 1000);
    }, intervalMin * 60 * 1000);
    tickRef.current = setInterval(() => {
      // force re-render for countdown
      setNextAt(prev => prev);
    }, 1000);
    toast.push(`Reality checks every ${intervalMin} min`, 'success');
  };

  const stop = () => {
    setRunning(false);
    setNextAt(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    timerRef.current = null;
    tickRef.current = null;
    toast.push('Reality checks paused', 'info');
  };

  const saveIntention = () => {
    localStorage.setItem('dreamcatcher.intention', intention);
    toast.push('Tonight\'s intention saved', 'success');
  };

  // Force a re-render every second while running, to update countdown
  const [, setNow] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const countdown = (() => {
    if (!nextAt) return null;
    const ms = Math.max(0, nextAt - Date.now());
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  })();

  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
          Awakening Within
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          Lucid <span className="italic text-primary text-glow">Toolkit</span>
        </h1>
      </header>

      {/* Reality check timer */}
      <section className="bg-surface-container-high rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h2 className="font-serif text-lg text-on-surface">Reality Check Timer</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Make reality-checking habitual during the day, and it'll cross over into your dreams.
          </p>

          <div className="flex items-center gap-3">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">Every</label>
            <select
              value={intervalMin}
              onChange={e => setIntervalMin(Number(e.target.value))}
              disabled={running}
              className="bg-surface-container-low border border-outline-variant/15 rounded-full px-4 py-2 text-sm outline-none focus:border-primary/30 disabled:opacity-50"
            >
              {[15, 30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{m} min</option>)}
            </select>
          </div>

          {notifAllowed !== 'granted' && (
            <button
              onClick={requestPerm}
              className="w-full h-11 rounded-full bg-surface-container-low border border-outline-variant/15 text-on-surface-variant text-xs uppercase tracking-wider hover:border-primary/30 hover:text-primary transition-all"
            >
              Enable browser notifications
            </button>
          )}

          {running ? (
            <div className="space-y-3">
              <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">Next check</span>
                <span className="font-mono text-2xl text-primary tabular-nums">{countdown}</span>
              </div>
              <button onClick={stop} className="w-full h-12 rounded-full bg-tertiary/20 text-tertiary text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                <BellOff size={14} /> Stop
              </button>
            </div>
          ) : (
            <button onClick={start} className="w-full h-12 rounded-full bg-gradient-to-br from-primary to-primary-container text-surface text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg">
              <Bell size={14} /> Start checks
            </button>
          )}
        </div>
      </section>

      {/* Tonight's intention */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Moon size={16} className="text-primary" />
          <h2 className="font-serif text-lg">Tonight's Intention</h2>
        </div>
        <textarea
          value={intention}
          onChange={e => setIntention(e.target.value)}
          rows={3}
          placeholder="What do you want to notice in your dreams tonight?"
          className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-2xl py-3 px-4 text-sm font-serif italic text-on-surface placeholder-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 outline-none transition-all leading-relaxed"
        />
        <button onClick={saveIntention} className="px-5 h-10 rounded-full bg-primary/15 text-primary text-[11px] uppercase tracking-wider font-medium hover:bg-primary/25 transition-colors">
          Set intention
        </button>
      </section>

      {/* Techniques */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-primary" />
          <h2 className="font-serif text-lg">Techniques</h2>
        </div>
        <div className="space-y-3">
          {TECHNIQUES.map((t, idx) => (
            <TechniqueCard key={t.name} technique={t} delay={idx * 0.05} />
          ))}
        </div>
      </section>

      {/* Reality checks */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Hand size={16} className="text-primary" />
          <h2 className="font-serif text-lg">Reality Checks</h2>
        </div>
        <div className="space-y-2">
          {REALITY_CHECKS.map(rc => (
            <div key={rc.check} className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
              <p className="font-serif text-base text-on-surface">{rc.check}</p>
              <p className="text-xs text-on-surface-variant/60 mt-1 leading-relaxed">{rc.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dream signs */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <h2 className="font-serif text-lg">Common Dream Signs</h2>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 space-y-2">
          {DREAM_SIGNS.map(s => (
            <div key={s} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="text-primary mt-1">·</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TechniqueCard({ technique, delay }: { key?: React.Key; technique: typeof TECHNIQUES[number]; delay: number }) {
  const [open, setOpen] = useState(false);
  const Icon = technique.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden"
    >
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base text-on-surface">{technique.name}</h3>
          <p className="text-[11px] text-on-surface-variant/60">{technique.full}</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-primary">{open ? 'Hide' : 'Show'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ol className="px-4 pb-4 space-y-2 text-sm text-on-surface-variant">
              {technique.steps.map((step, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-primary font-bold tabular-nums">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
