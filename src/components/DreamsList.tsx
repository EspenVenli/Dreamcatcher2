import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Moon, Calendar, Clock, ChevronRight, Search, X, Star, Eye,
  Sparkles, Skull, Cloud, Filter, Flame
} from 'lucide-react';
import { Dream, DreamType, DreamStats } from '../types';
import { apiUrl } from '../api';
import { useToast } from './Toast';

interface DreamsListProps {
  onSelectDream: (dream: Dream) => void;
}

type SortMode = 'newest' | 'oldest' | 'duration' | 'awe';

const TYPE_ICON: Record<DreamType, React.ElementType> = {
  normal:    Moon,
  lucid:     Eye,
  vivid:     Sparkles,
  nightmare: Skull,
  fragment:  Cloud,
};

export default function DreamsList({ onSelectDream }: DreamsListProps) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState<DreamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [filterLucidity, setFilterLucidity] = useState<'' | 'Low' | 'Medium' | 'High'>('');
  const [filterType, setFilterType] = useState<'' | DreamType>('');
  const [sort, setSort] = useState<SortMode>('newest');
  const toast = useToast();

  const refresh = async () => {
    try {
      const [dreamsRes, statsRes] = await Promise.all([
        fetch(apiUrl('/api/dreams')),
        fetch(apiUrl('/api/stats')),
      ]);
      const ds = await dreamsRes.json();
      const st = await statsRes.json();
      setDreams(ds);
      setStats(st);
    } catch (e) {
      console.error('Failed to load dreams', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    let r = dreams.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(d =>
        (d.title || '').toLowerCase().includes(q) ||
        (d.content || '').toLowerCase().includes(q) ||
        (d.cleanedContent || '').toLowerCase().includes(q) ||
        (d.symbols || []).some(s => s.toLowerCase().includes(q)) ||
        (d.tags || []).some(s => s.toLowerCase().includes(q)),
      );
    }
    if (filterFavorite) r = r.filter(d => d.isFavorite);
    if (filterLucidity) r = r.filter(d => d.lucidity === filterLucidity);
    if (filterType) r = r.filter(d => d.dreamType === filterType);

    if (sort === 'oldest') r.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    else if (sort === 'duration') r.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    else if (sort === 'awe') r.sort((a, b) => (b.resonance?.awe || 0) - (a.resonance?.awe || 0));
    else r.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return r;
  }, [dreams, query, filterFavorite, filterLucidity, filterType, sort]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = async (dream: Dream, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !dream.isFavorite;
    setDreams(prev => prev.map(d => d.id === dream.id ? { ...d, isFavorite: next } : d));
    try {
      await fetch(apiUrl(`/api/dreams/${dream.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: next }),
      });
      toast.push(next ? 'Added to favorites' : 'Removed from favorites', 'success');
    } catch {
      toast.push('Failed to update favorite', 'error');
    }
  };

  const activeFilterCount =
    (filterFavorite ? 1 : 0) +
    (filterLucidity ? 1 : 0) +
    (filterType ? 1 : 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-primary"
        >
          <Moon size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-6">
      <header className="space-y-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
          Your Sanctuary
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          Archived <span className="italic text-primary text-glow">Journeys</span>
        </h1>
      </header>

      {/* Stats Summary */}
      {stats && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2"
        >
          <StatPill icon={Moon}    label="Dreams"  value={stats.total.toString()} />
          <StatPill icon={Flame}   label="Streak"  value={stats.streak.toString()} accent />
          <StatPill icon={Eye}     label="Lucid %" value={`${stats.lucidPct}%`} />
        </motion.div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search dreams, symbols, tags…"
          className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-full h-11 pl-11 pr-11 text-sm font-sans text-on-surface placeholder-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-on-surface-variant/60" />
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 text-[11px] uppercase tracking-wider transition-colors ${
            showFilters || activeFilterCount > 0 ? 'text-primary' : 'text-on-surface-variant/50 hover:text-primary'
          }`}
        >
          <Filter size={13} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortMode)}
          className="bg-surface-container-low border border-outline-variant/10 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-wider text-on-surface-variant outline-none focus:border-primary/30"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="duration">Longest</option>
          <option value="awe">Most awe</option>
        </select>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 space-y-4 overflow-hidden"
          >
            <FilterRow label="Quick">
              <Chip selected={filterFavorite} onClick={() => setFilterFavorite(!filterFavorite)} icon={Star}>
                Favorites
              </Chip>
            </FilterRow>
            <FilterRow label="Lucidity">
              {(['', 'Low', 'Medium', 'High'] as const).map(l => (
                <Chip key={l || 'any'} selected={filterLucidity === l} onClick={() => setFilterLucidity(l)}>
                  {l || 'Any'}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Type">
              {(['', 'normal', 'lucid', 'vivid', 'nightmare', 'fragment'] as const).map(t => (
                <Chip key={t || 'any'} selected={filterType === t} onClick={() => setFilterType(t)}>
                  {t ? t[0].toUpperCase() + t.slice(1) : 'Any'}
                </Chip>
              ))}
            </FilterRow>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dream list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          dreams.length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <Moon size={48} className="mx-auto mb-4" />
              <p className="font-serif italic">No dreams captured yet…</p>
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              <p className="font-sans text-sm">No dreams match these filters.</p>
              <button
                onClick={() => { setQuery(''); setFilterFavorite(false); setFilterLucidity(''); setFilterType(''); }}
                className="mt-3 text-primary text-xs uppercase tracking-wider hover:opacity-80"
              >
                Clear all
              </button>
            </div>
          )
        ) : (
          filtered.map((dream) => {
            const TypeIcon = TYPE_ICON[(dream.dreamType as DreamType) || 'normal'] || Moon;
            return (
              <motion.div
                key={dream.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectDream(dream)}
                className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-3 group cursor-pointer relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <TypeIcon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base text-on-surface group-hover:text-primary transition-colors leading-tight truncate">
                    {dream.title || 'Untitled Dream'}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-on-surface-variant/70 uppercase tracking-wider mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {dream.date}
                    </span>
                    {dream.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatDuration(dream.duration)}
                      </span>
                    )}
                  </div>
                  {dream.symbols && dream.symbols.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dream.symbols.slice(0, 3).map(s => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-primary/8 text-primary/80 border border-primary/15"
                        >
                          {s}
                        </span>
                      ))}
                      {dream.symbols.length > 3 && (
                        <span className="text-[9px] text-on-surface-variant/40 self-center">+{dream.symbols.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => toggleFavorite(dream, e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors"
                >
                  <Star
                    size={16}
                    className={dream.isFavorite ? 'text-tertiary fill-tertiary' : 'text-on-surface-variant/30'}
                  />
                </button>
                <ChevronRight className="text-on-surface-variant/30 group-hover:text-primary transition-colors flex-shrink-0 self-center" size={18} />
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 flex flex-col items-start gap-1 ${accent ? 'bg-primary/8 border-primary/20' : ''}`}>
      <Icon size={14} className={accent ? 'text-tertiary' : 'text-primary/70'} />
      <div>
        <p className={`text-lg font-serif font-bold leading-none ${accent ? 'text-tertiary' : 'text-on-surface'}`}>{value}</p>
        <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

interface ChipProps {
  key?: React.Key;
  selected: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  children: React.ReactNode;
}

function Chip({ selected, onClick, icon: Icon, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium border transition-all flex items-center gap-1.5 ${
        selected
          ? 'bg-primary text-surface border-primary shadow-[0_0_10px_rgba(168,133,238,0.2)]'
          : 'bg-surface-container-high border-outline-variant/15 text-on-surface-variant hover:border-primary/30 hover:text-primary'
      }`}
    >
      {Icon && <Icon size={11} className={selected ? '' : ''} />}
      {children}
    </button>
  );
}
