import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon } from 'lucide-react';
import { UserProfile, Dream } from '../types';
import { apiUrl } from '../api';

interface Message {
  id: string;
  role: 'user' | 'oracle';
  text: string;
}

type Category = 'all' | 'symbols' | 'emotions' | 'patterns' | 'future';

const CATEGORY_QUESTIONS: Record<Category, string[]> = {
  all: [
    'What has been shifting in my dreams this month?',
    'What does my chart say about my recent dreams?',
    'What recurring theme should I pay attention to?',
  ],
  symbols: [
    'What does water keep symbolising in my dreams?',
    'Why do I dream about running or being chased?',
    'What does my childhood home represent?',
    'Why do certain people keep appearing in my dreams?',
  ],
  emotions: [
    'What emotions am I processing in my sleep?',
    'Why do my dreams leave me feeling anxious?',
    'What is the fear in my dreams trying to tell me?',
    'Why do I wake up sad even from neutral dreams?',
  ],
  patterns: [
    'Are there patterns in when I have vivid dreams?',
    'What themes repeat across my last month of dreams?',
    'Do my dreams reflect what is happening in my waking life?',
    'How has my dream life changed over time?',
  ],
  future: [
    'What might my dreams be preparing me for?',
    'What intention should I set before sleeping tonight?',
    'What is my subconscious trying to work through?',
    'What would it mean to follow what my dreams are pointing at?',
  ],
};

interface MirrorProps {
  user: UserProfile | null;
  initialDream?: Dream | null;
  onReady?: () => void;
}

const DEFAULT_QUESTIONS = [
  'Why do I keep dreaming about water?',
  'What has been shifting in my dreams this month?',
  'What does my chart say about my recent dreams?',
  'What emotions am I processing in my sleep?',
  'Why do I dream about running?',
  'What recurring theme should I pay attention to?',
];

// Static starfield dots (pre-computed so they don't re-render)
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top:  `${(i * 137.508) % 100}%`,
  left: `${(i * 97.3)   % 100}%`,
  size: i % 5 === 0 ? 2 : 1,
  opacity: 0.15 + (i % 7) * 0.07,
}));

export default function Mirror({ user, initialDream, onReady }: MirrorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const bottomRef = useRef<HTMLDivElement>(null);
  const didAutoAsk = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetch(apiUrl('/api/dreams'))
      .then(r => r.json())
      .then(d => setDreams(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Auto-ask about a dream when navigated from DreamDetail
  useEffect(() => {
    if (initialDream && !didAutoAsk.current) {
      didAutoAsk.current = true;
      const q = `I want to understand my dream called "${initialDream.title}" from ${initialDream.date}. It involved: ${initialDream.symbols?.join(', ')}. What can you tell me about it?`;
      setTimeout(() => {
        setInput(q);
        handleSend(q);
        onReady?.();
      }, 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDream]);

  // Personalise the "all" questions based on top dream symbol
  const questions = useMemo(() => {
    const base = CATEGORY_QUESTIONS[activeCategory];
    if (activeCategory !== 'all' || dreams.length === 0) return base;
    const allSymbols = dreams.flatMap(d => d.symbols ?? []);
    const symbolCount: Record<string, number> = {};
    allSymbols.forEach(s => { symbolCount[s] = (symbolCount[s] ?? 0) + 1; });
    const topSymbol = Object.entries(symbolCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!topSymbol) return base;
    return [`Why do I keep dreaming about ${topSymbol.toLowerCase()}?`, ...base.slice(1)];
  }, [dreams, activeCategory]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('/api/mirror/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages, userProfile: user }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'oracle',
        text: data.text ?? 'The mirror is silent for now...',
      }]);
    } catch (err) {
      console.error('Mirror error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'oracle',
        text: 'The mirror is clouded for now. Try again in a moment.',
      }]);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] pt-6 relative overflow-hidden">

      {/* Starfield background */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
        {/* Subtle radial glow in center */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(168,133,238,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <div className="px-6 pb-3 flex-shrink-0 relative z-10">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-70">Your oracle</span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight mt-1">
          The <span className="italic text-primary" style={{ textShadow: '0 0 20px rgba(168,133,238,0.4)' }}>Mirror</span>
        </h1>
      </div>

      {/* Category picker — hidden once chat starts */}
      {messages.length === 0 && (
        <div className="px-6 pb-3 flex-shrink-0 relative z-10">
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
            {(['all', 'symbols', 'emotions', 'patterns', 'future'] as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.12em] font-medium transition-all border ${
                  activeCategory === cat
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-surface-container-high/60 border-outline-variant/10 text-on-surface/40 hover:text-on-surface/70'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-4 relative z-10">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary-container/20 border border-primary/20 flex items-center justify-center">
                <Sparkles size={28} className="text-primary" />
              </div>
            </motion.div>
            <div className="space-y-2 max-w-xs">
              <p className="font-serif text-lg text-on-surface/80 italic">
                "What do you wish to understand?"
              </p>
              <p className="text-xs text-on-surface/40 leading-relaxed">
                Ask anything about your dreams, patterns, or inner life. The Mirror sees only you.
              </p>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'oracle' && (
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5">
                  <Sparkles size={13} className="text-primary" />
                </div>
              )}
              <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary/20 text-on-surface rounded-tr-sm border border-primary/20'
                  : 'bg-surface-container-high text-on-surface/90 rounded-tl-sm border border-outline-variant/10 font-serif italic'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5">
              <Sparkles size={13} className="text-primary" />
            </div>
            <div className="bg-surface-container-high border border-outline-variant/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-32 pt-2 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-2 bg-surface-container-high/80 backdrop-blur-sm border border-outline-variant/15 rounded-2xl px-4 py-3 focus-within:border-primary/30 transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask your dreams anything..."
            className="flex-1 bg-transparent text-sm text-on-surface placeholder-on-surface/30 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="relative w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
            style={{
              background: 'radial-gradient(circle at 35% 35%, rgba(211,187,255,0.35), rgba(168,133,238,0.15))',
              boxShadow: input.trim() ? '0 0 12px rgba(168,133,238,0.4), inset 0 0 8px rgba(168,133,238,0.1)' : 'none',
              border: '1px solid rgba(168,133,238,0.3)',
            }}
          >
            <Moon size={15} className="text-primary" style={{ filter: input.trim() ? 'drop-shadow(0 0 4px rgba(168,133,238,0.8))' : 'none' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
