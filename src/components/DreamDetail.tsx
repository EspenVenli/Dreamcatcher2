import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun, PenTool, Share2, Heart, Sparkles, Edit2, Trash2,
  Save, X as XIcon, Tag as TagIcon, Plus, Star, Download, RotateCw, Check
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { Dream } from '../types';
import { apiUrl } from '../api';
import { useToast } from './Toast';
import SymbolModal from './SymbolModal';
import { lookupSymbol } from '../data/symbols';

interface DreamDetailProps {
  dream: Dream;
  onUpdate?: (dream: Dream) => void;
  onDelete?: () => void;
}

export default function DreamDetail({ dream, onUpdate, onDelete }: DreamDetailProps) {
  const [current, setCurrent] = useState<Dream>(dream);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [titleDraft, setTitleDraft] = useState(dream.title);
  const [contentDraft, setContentDraft] = useState(dream.content);
  const [notesDraft, setNotesDraft] = useState(dream.notes || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [tagDraft, setTagDraft] = useState('');
  const [showSymbol, setShowSymbol] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const toast = useToast();

  const patch = async (updates: Partial<Dream>) => {
    const next = { ...current, ...updates };
    setCurrent(next);
    onUpdate?.(next);
    try {
      const res = await fetch(apiUrl(`/api/dreams/${current.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const saved = await res.json();
      setCurrent(saved);
      onUpdate?.(saved);
    } catch {
      toast.push('Could not save changes', 'error');
    }
  };

  const saveTitle = async () => {
    setEditingTitle(false);
    if (titleDraft.trim() && titleDraft !== current.title) {
      await patch({ title: titleDraft.trim() });
      toast.push('Title saved', 'success');
    }
  };

  const saveContent = async () => {
    setEditingContent(false);
    if (contentDraft.trim() && contentDraft !== current.content) {
      await patch({ content: contentDraft });
      toast.push('Dream updated', 'success');
    }
  };

  const saveNotes = async () => {
    setEditingNotes(false);
    if (notesDraft !== (current.notes || '')) {
      await patch({ notes: notesDraft });
      toast.push('Notes saved', 'success');
    }
  };

  const addTag = async () => {
    const t = tagDraft.trim();
    if (!t) return;
    if ((current.tags || []).includes(t)) {
      setTagDraft('');
      return;
    }
    setTagDraft('');
    await patch({ tags: [...(current.tags || []), t] });
  };

  const removeTag = async (tag: string) => {
    await patch({ tags: (current.tags || []).filter(t => t !== tag) });
  };

  const toggleFavorite = async () => {
    const next = !current.isFavorite;
    await patch({ isFavorite: next });
    toast.push(next ? 'Added to favorites' : 'Removed from favorites', 'success');
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/api/dreams/${current.id}`), { method: 'DELETE' });
      toast.push('Dream released', 'success');
      onDelete?.();
    } catch {
      toast.push('Could not delete dream', 'error');
    }
  };

  const handleReanalyze = async () => {
    setReanalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Re-analyze this dream. Provide a refined title, cleaned narrative, and a richer psychological analysis.
        Dream: ${current.content}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              cleanedContent: { type: Type.STRING },
              analysis: { type: Type.STRING },
              lucidity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              symbols: { type: Type.ARRAY, items: { type: Type.STRING } },
              resonance: {
                type: Type.OBJECT,
                properties: {
                  calm: { type: Type.NUMBER },
                  awe: { type: Type.NUMBER },
                  fear: { type: Type.NUMBER },
                },
              },
            },
            required: ['title', 'cleanedContent', 'analysis', 'lucidity', 'symbols', 'resonance'],
          },
        },
      });
      const result = JSON.parse(response.text);
      await patch(result);
      toast.push('Dream re-analyzed', 'success');
    } catch (e) {
      console.error(e);
      toast.push('Re-analysis failed', 'error');
    } finally {
      setReanalyzing(false);
    }
  };

  const handleExport = () => {
    const md = [
      `# ${current.title}`,
      `*${current.date}*`,
      '',
      `**Lucidity:** ${current.lucidity}`,
      current.dreamType ? `**Type:** ${current.dreamType}` : '',
      current.symbols?.length ? `**Symbols:** ${current.symbols.join(', ')}` : '',
      current.tags?.length ? `**Tags:** ${current.tags.join(', ')}` : '',
      '',
      '## The Whisper',
      '',
      current.content,
      '',
      current.cleanedContent ? `## Cleaned Narrative\n\n${current.cleanedContent}\n` : '',
      current.analysis ? `## Analysis\n\n${current.analysis}\n` : '',
      current.notes ? `## My Notes\n\n${current.notes}\n` : '',
    ].filter(Boolean).join('\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${current.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.push('Dream exported', 'success');
  };

  return (
    <div className="pt-8 pb-32 px-6 max-w-3xl mx-auto space-y-12 relative">
      {reanalyzing && (
        <div className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Sparkles size={40} className="text-primary" />
          </motion.div>
          <p className="text-on-surface-variant text-sm">Deepening analysis…</p>
        </div>
      )}

      {/* Hero Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans uppercase tracking-widest text-primary/60">
            {current.date}
          </span>
          <div className="h-px flex-1 bg-outline-variant/15" />
          <button
            onClick={toggleFavorite}
            className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors"
            aria-label="Toggle favorite"
          >
            <Star size={16} className={current.isFavorite ? 'text-tertiary fill-tertiary' : 'text-on-surface-variant/40'} />
          </button>
        </div>

        {editingTitle ? (
          <div className="flex gap-2 items-start">
            <input
              autoFocus
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveTitle()}
              className="flex-1 text-4xl md:text-5xl font-serif font-bold bg-transparent border-b-2 border-primary/40 focus:border-primary outline-none text-on-surface"
            />
            <button onClick={saveTitle} className="w-10 h-10 rounded-full bg-primary text-surface flex items-center justify-center"><Check size={18} /></button>
            <button onClick={() => { setTitleDraft(current.title); setEditingTitle(false); }} className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center"><XIcon size={18} /></button>
          </div>
        ) : (
          <button onClick={() => setEditingTitle(true)} className="text-left group flex items-start gap-3">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
              {current.title}
            </h2>
            <Edit2 size={16} className="text-on-surface-variant/30 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        <div className="flex items-center gap-4 py-2 flex-wrap">
          <span className="flex items-center gap-1 text-tertiary">
            <Sun size={14} />
            <span className="text-sm font-sans font-medium uppercase tracking-tighter">
              {current.lucidity} Lucidity
            </span>
          </span>
          {current.dreamType && current.dreamType !== 'normal' && (
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-sans uppercase tracking-wider border border-primary/20">
              {current.dreamType}
            </span>
          )}
        </div>
      </section>

      {/* The Whisper: Raw Text Section */}
      <section className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-container/40 to-transparent rounded-full" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif italic text-primary/80">The Whisper</h3>
            <button
              onClick={() => { setContentDraft(current.content); setEditingContent(true); }}
              className="text-on-surface-variant/40 hover:text-primary transition-colors"
              aria-label="Edit dream"
            >
              {editingContent ? <XIcon size={18} /> : <PenTool size={18} />}
            </button>
          </div>
          {editingContent ? (
            <div className="space-y-3">
              <textarea
                autoFocus
                value={contentDraft}
                onChange={e => setContentDraft(e.target.value)}
                rows={10}
                className="w-full bg-surface-container-low border border-outline-variant/15 focus:border-primary/30 rounded-xl py-4 px-5 font-serif text-lg italic text-on-surface focus:ring-1 focus:ring-primary/20 outline-none transition-all leading-relaxed"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setContentDraft(current.content); setEditingContent(false); }} className="px-4 h-10 rounded-full bg-surface-container-high text-on-surface-variant text-xs uppercase tracking-wider">Cancel</button>
                <button onClick={saveContent} className="px-4 h-10 rounded-full bg-primary text-surface text-xs uppercase tracking-wider font-bold flex items-center gap-2"><Save size={13} /> Save</button>
              </div>
            </div>
          ) : (
            <div className="font-serif text-xl md:text-2xl leading-relaxed text-on-surface/90 space-y-6">
              {current.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Analysis */}
      {current.analysis && (
        <section className="bg-surface-container-high rounded-2xl p-7 relative overflow-hidden border border-primary/10">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Sparkles size={120} className="absolute top-2 right-2" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h3 className="font-serif italic text-primary/80 text-lg">The Collective Whisper</h3>
            </div>
            <p className="font-serif text-lg italic leading-relaxed text-on-surface/90">
              "{current.analysis}"
            </p>
          </div>
        </section>
      )}

      {/* Key Symbols Grid */}
      {current.symbols && current.symbols.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-sans uppercase tracking-widest text-on-surface/50">Key Symbols</h3>
          <div className="flex flex-wrap gap-2">
            {current.symbols.map((symbol) => {
              const entry = lookupSymbol(symbol);
              return (
                <button
                  key={symbol}
                  onClick={() => setShowSymbol(symbol)}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10 hover:bg-surface-container-high hover:border-primary/30 transition-all"
                >
                  <span className="text-base">{entry.emoji ?? '✦'}</span>
                  <span className="text-sm font-medium">{symbol}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">Tap a symbol for its reading</p>
        </section>
      )}

      {/* Tags */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-sans uppercase tracking-widest text-on-surface/50">My Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {(current.tags || []).map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
            >
              <TagIcon size={11} />
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-tertiary">
                <XIcon size={11} />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input
              value={tagDraft}
              onChange={e => setTagDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder="add tag…"
              className="bg-surface-container-low border border-outline-variant/10 rounded-full px-3 py-1.5 text-xs outline-none focus:border-primary/30 placeholder-on-surface-variant/40 w-28"
            />
            <button onClick={addTag} className="w-7 h-7 rounded-full bg-surface-container-high hover:bg-primary hover:text-surface text-on-surface-variant flex items-center justify-center transition-colors">
              <Plus size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-sans uppercase tracking-widest text-on-surface/50">My Notes</h3>
          {!editingNotes && (
            <button onClick={() => { setNotesDraft(current.notes || ''); setEditingNotes(true); }} className="text-on-surface-variant/40 hover:text-primary">
              <Edit2 size={14} />
            </button>
          )}
        </div>
        {editingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notesDraft}
              onChange={e => setNotesDraft(e.target.value)}
              rows={4}
              autoFocus
              placeholder="What did this dream stir up for you?"
              className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingNotes(false)} className="px-3 h-9 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] uppercase tracking-wider">Cancel</button>
              <button onClick={saveNotes} className="px-3 h-9 rounded-full bg-primary text-surface text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5"><Save size={12} /> Save</button>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 min-h-[3rem]">
            {current.notes ? (
              <p className="text-sm text-on-surface/80 italic font-serif leading-relaxed whitespace-pre-wrap">{current.notes}</p>
            ) : (
              <p className="text-sm text-on-surface-variant/40 italic">No notes yet. Tap the pencil to add some.</p>
            )}
          </div>
        )}
      </section>

      {/* Emotional Resonance Chart */}
      {current.resonance && (
        <section className="bg-surface-container-low rounded-2xl p-7 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <Sun size={96} />
            </motion.div>
          </div>
          <h3 className="text-sm font-sans uppercase tracking-widest text-on-surface/50">
            Emotional Resonance
          </h3>
          <div className="space-y-4">
            {Object.entries(current.resonance).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-serif text-base italic capitalize">{key}</span>
                  <span className="text-xs font-sans text-primary">{value as number}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value as number}%` }}
                    className={`h-full rounded-full ${
                      key === 'awe' ? 'bg-tertiary' : key === 'fear' ? 'bg-outline-variant' : 'bg-primary-container'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Actions Bar */}
      <div className="grid grid-cols-4 gap-3 pt-4">
        <ActionButton icon={RotateCw} label="Re-analyze" onClick={handleReanalyze} />
        <ActionButton icon={Download} label="Export" onClick={handleExport} />
        <ActionButton icon={Share2} label="Share" onClick={() => {
          if (navigator.share) {
            navigator.share({ title: current.title, text: current.content }).catch(() => {});
          } else {
            navigator.clipboard?.writeText(`${current.title}\n\n${current.content}`);
            toast.push('Copied to clipboard', 'success');
          }
        }} />
        <ActionButton icon={Trash2} label="Delete" tone="danger" onClick={() => setConfirmDelete(true)} />
      </div>

      <SymbolModal symbol={showSymbol} onClose={() => setShowSymbol(null)} />

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }}
              className="bg-surface-container-high border border-tertiary/20 rounded-3xl p-7 max-w-sm w-full"
            >
              <h3 className="font-serif text-xl text-on-surface">Release this dream?</h3>
              <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">This will permanently delete it from your sanctuary. There's no undo.</p>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 h-11 rounded-full bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">Keep</button>
                <button onClick={handleDelete} className="flex-1 h-11 rounded-full bg-tertiary text-surface text-xs uppercase tracking-wider font-bold">Release</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, tone }: { icon: React.ElementType; label: string; onClick: () => void; tone?: 'danger' }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-active:scale-95 ${
        tone === 'danger' ? 'bg-tertiary/10 text-tertiary group-hover:bg-tertiary/20' : 'bg-surface-container-high text-on-surface-variant group-hover:bg-primary/15 group-hover:text-primary'
      }`}>
        <Icon size={18} />
      </div>
      <span className="text-[9px] font-sans font-medium uppercase tracking-widest text-on-surface/60">
        {label}
      </span>
    </button>
  );
}
