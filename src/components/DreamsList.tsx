import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Calendar, Clock, ChevronRight, Heart, Search, X, Mic } from 'lucide-react';
import { Dream, EmotionTag } from '../types';
import { apiUrl } from '../api';

interface DreamsListProps {
  onSelectDream: (dream: Dream) => void;
  onGoToWhisper?: () => void;
}

const EMOTION_COLORS: Record<string, string> = {
  anxious:'bg-amber-500/15 text-amber-400', peaceful:'bg-teal-500/15 text-teal-400',
  confused:'bg-purple-500/15 text-purple-400', joyful:'bg-yellow-500/15 text-yellow-400',
  afraid:'bg-red-500/15 text-red-400', nostalgic:'bg-blue-500/15 text-blue-400',
  melancholic:'bg-slate-500/15 text-slate-400', hopeful:'bg-orange-500/15 text-orange-400',
  lonely:'bg-indigo-500/15 text-indigo-400', loved:'bg-pink-500/15 text-pink-400',
  angry:'bg-red-600/15 text-red-500', excited:'bg-yellow-400/15 text-yellow-300',
  overwhelmed:'bg-cyan-500/15 text-cyan-400', grief:'bg-neutral-500/15 text-neutral-400',
  curious:'bg-lime-500/15 text-lime-400', free:'bg-sky-500/15 text-sky-400',
  lost:'bg-gray-500/15 text-gray-400', safe:'bg-emerald-500/15 text-emerald-400',
  euphoric:'bg-fuchsia-500/15 text-fuchsia-400', serene:'bg-teal-400/15 text-teal-300',
  wonder:'bg-blue-400/15 text-blue-300',
};

const EMOTION_EMOJIS: Record<string, string> = {
  anxious:'😰', peaceful:'😌', confused:'😕', joyful:'😄', afraid:'😨', nostalgic:'🌙',
  melancholic:'🌧️', hopeful:'🌅', lonely:'🫥', loved:'💜', angry:'🔥', ashamed:'😶',
  excited:'✨', overwhelmed:'🌊', numb:'🪨', grief:'🖤', curious:'🔍', trapped:'🔒',
  free:'🕊️', hunted:'👁️', lost:'🌫️', safe:'🛡️', unsettled:'🌀', euphoric:'💫',
  guilty:'🌑', tender:'🌸', powerful:'⚡', helpless:'🍃', strange:'🌀', serene:'🌊',
  desperate:'🌑', wonder:'🔭',
};

type FilterType = 'all' | 'lucid' | 'favourites';

function groupByMonth(dreams: Dream[]): { label: string; dreams: Dream[] }[] {
  const groups: Record<string, Dream[]> = {};
  dreams.forEach(dream => {
    // dream.date is like "May 18, 2026" — extract "May 2026"
    const parts = dream.date?.split(' ');
    const label = parts && parts.length >= 3 ? `${parts[0]} ${parts[2]}` : (dream.date || 'Unknown');
    if (!groups[label]) groups[label] = [];
    groups[label].push(dream);
  });
  return Object.entries(groups).map(([label, dreams]) => ({ label, dreams }));
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function DreamsList({ onSelectDream, onGoToWhisper }: DreamsListProps) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetch(apiUrl('/api/dreams'))
      .then(res => res.json())
      .then(data => { setDreams(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...dreams];
    if (filter === 'lucid') result = result.filter(d => d.isLucid);
    if (filter === 'favourites') result = result.filter(d => d.isFavourite);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title?.toLowerCase().includes(q) ||
        d.content?.toLowerCase().includes(q) ||
        d.symbols?.some(s => s.toLowerCase().includes(q))
      );
    }
    return result;
  }, [dreams, filter, search]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-primary">
          <Moon size={40} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-32 px-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <header className="space-y-1 pt-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">Your Sanctuary</span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          Dream <span className="italic text-primary" style={{ textShadow: '0 0 20px rgba(168,133,238,0.3)' }}>Journal</span>
        </h1>
      </header>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dreams, symbols..."
          className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl py-3 pl-10 pr-10 text-sm text-on-surface placeholder-on-surface/30 focus:outline-none focus:border-primary/30 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-on-surface/60">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {(['all', 'lucid', 'favourites'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-medium transition-all border ${
              filter === f
                ? 'bg-primary/20 border-primary/30 text-primary'
                : 'bg-surface-container-low border-outline-variant/10 text-on-surface/40 hover:text-on-surface/70'
            }`}
          >
            {f === 'all' ? `All (${dreams.length})` : f === 'lucid' ? '✦ Lucid' : '♥ Saved'}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {dreams.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary-container/20 border border-primary/20 flex items-center justify-center">
              <Moon size={28} className="text-primary/60" />
            </div>
          </div>
          <div className="space-y-2 max-w-xs">
            <p className="font-serif text-lg text-on-surface/70 italic">Your journal is empty</p>
            <p className="text-xs text-on-surface/40 leading-relaxed">
              Whisper your first dream when you wake up — before the memory fades
            </p>
          </div>
          {onGoToWhisper && (
            <button
              onClick={onGoToWhisper}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-medium uppercase tracking-wider hover:bg-primary/25 transition-colors"
            >
              <Mic size={14} />
              Whisper a Dream
            </button>
          )}
        </motion.div>
      )}

      {/* No results from filter/search */}
      {dreams.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-on-surface/40">
          <p className="font-serif italic text-sm">No dreams match your search</p>
          <button onClick={() => { setSearch(''); setFilter('all'); }} className="mt-3 text-xs text-primary/60 hover:text-primary transition-colors">Clear filters</button>
        </div>
      )}

      {/* Grouped dream list */}
      {grouped.map(({ label, dreams: groupDreams }) => (
        <div key={label} className="space-y-3">
          <h2 className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface/30 ml-1">{label}</h2>
          {groupDreams.map(dream => (
            <motion.div
              key={dream.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDream(dream)}
              className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 cursor-pointer group hover:border-primary/15 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${dream.isLucid ? 'bg-primary/20 border border-primary/30' : 'bg-primary/8'}`}>
                  <Moon size={18} className={dream.isLucid ? 'text-primary' : 'text-primary/60'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
                      {dream.title || 'Untitled Dream'}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {dream.isFavourite && <Heart size={11} className="text-pink-400 fill-pink-400" />}
                      <ChevronRight size={14} className="text-on-surface/20 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] text-on-surface/35 flex items-center gap-1">
                      <Calendar size={9} />{dream.date}
                    </span>
                    {dream.duration && (
                      <span className="text-[10px] text-on-surface/35 flex items-center gap-1">
                        <Clock size={9} />{formatDuration(dream.duration)}
                      </span>
                    )}
                  </div>
                  {(dream.isLucid || dream.emotionTag) && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {dream.isLucid && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/12 text-primary border border-primary/15 uppercase tracking-wider">✦ Lucid</span>
                      )}
                      {dream.emotionTag && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider ${EMOTION_COLORS[dream.emotionTag] ?? 'bg-surface-container text-on-surface/40'}`}>
                          {EMOTION_EMOJIS[dream.emotionTag]} {dream.emotionTag}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
