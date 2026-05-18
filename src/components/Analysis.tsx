import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, PenTool, Share2, Heart, CheckCircle2, Moon } from 'lucide-react';
import { Dream, EmotionTag } from '../types';

interface AnalysisProps {
  dream: Dream;
  onSave: (emotionTag?: EmotionTag, isLucid?: boolean, isFavourite?: boolean) => void;
}

const EMOTION_TAGS: { id: EmotionTag; label: string; emoji: string }[] = [
  { id: 'anxious',     label: 'Anxious',     emoji: '😰' },
  { id: 'peaceful',    label: 'Peaceful',    emoji: '😌' },
  { id: 'confused',    label: 'Confused',    emoji: '😕' },
  { id: 'joyful',      label: 'Joyful',      emoji: '😄' },
  { id: 'afraid',      label: 'Afraid',      emoji: '😨' },
  { id: 'nostalgic',   label: 'Nostalgic',   emoji: '🌙' },
  { id: 'melancholic', label: 'Melancholic', emoji: '🌧️' },
  { id: 'hopeful',     label: 'Hopeful',     emoji: '🌅' },
  { id: 'lonely',      label: 'Lonely',      emoji: '🫥' },
  { id: 'loved',       label: 'Loved',       emoji: '💜' },
  { id: 'angry',       label: 'Angry',       emoji: '🔥' },
  { id: 'ashamed',     label: 'Ashamed',     emoji: '😶' },
  { id: 'excited',     label: 'Excited',     emoji: '✨' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '🌊' },
  { id: 'numb',        label: 'Numb',        emoji: '🪨' },
  { id: 'grief',       label: 'Grief',       emoji: '🖤' },
  { id: 'curious',     label: 'Curious',     emoji: '🔍' },
  { id: 'trapped',     label: 'Trapped',     emoji: '🔒' },
  { id: 'free',        label: 'Free',        emoji: '🕊️' },
  { id: 'hunted',      label: 'Hunted',      emoji: '👁️' },
  { id: 'lost',        label: 'Lost',        emoji: '🌫️' },
  { id: 'safe',        label: 'Safe',        emoji: '🛡️' },
  { id: 'unsettled',   label: 'Unsettled',   emoji: '🌀' },
  { id: 'euphoric',    label: 'Euphoric',    emoji: '💫' },
  { id: 'guilty',      label: 'Guilty',      emoji: '🌑' },
  { id: 'tender',      label: 'Tender',      emoji: '🌸' },
  { id: 'powerful',    label: 'Powerful',    emoji: '⚡' },
  { id: 'helpless',    label: 'Helpless',    emoji: '🍃' },
  { id: 'strange',     label: 'Strange',     emoji: '🌀' },
  { id: 'serene',      label: 'Serene',      emoji: '🌊' },
  { id: 'desperate',   label: 'Desperate',   emoji: '🌑' },
  { id: 'wonder',      label: 'Wonder',      emoji: '🔭' },
];

export default function Analysis({ dream, onSave }: AnalysisProps) {
  const [emotionTag, setEmotionTag] = useState<EmotionTag | undefined>();
  const [isLucid, setIsLucid] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <div className="pt-8 pb-32 px-6 max-w-3xl mx-auto space-y-10">
      {/* Hero Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans uppercase tracking-widest text-primary/60">
            Analysis Complete
          </span>
          <div className="h-px flex-1 bg-outline-variant/15" />
        </div>
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-surface leading-tight">
          {dream.title || 'Untitled Dream'}
        </h2>
      </section>

      {/* AI Analysis Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-high rounded-lg p-8 relative overflow-hidden bloom-glow border border-primary/10"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Brain size={96} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-primary" size={24} />
            <h3 className="text-xl font-serif italic text-primary/80">The Collective Whisper</h3>
          </div>
          <p className="serif-text text-xl md:text-2xl leading-relaxed text-on-surface/90 italic">
            "{dream.analysis}"
          </p>
        </div>
      </motion.section>

      {/* Cleaned Transcript Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-container/40 to-transparent rounded-full" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif italic text-primary/80">Cleaned Narrative</h3>
            <PenTool size={20} className="text-outline-variant/40" />
          </div>
          <div className="font-serif text-lg md:text-xl leading-relaxed text-on-surface/80 space-y-6">
            {dream.cleanedContent?.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Emotion Tag */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-xs font-sans uppercase tracking-widest text-on-surface/40 ml-1">How did this dream feel?</h3>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {EMOTION_TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => setEmotionTag(prev => prev === tag.id ? undefined : tag.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all border ${
                emotionTag === tag.id
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-surface-container-low border-outline-variant/10 text-on-surface/60 hover:border-outline-variant/30'
              }`}
            >
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Lucid marker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        onClick={() => setIsLucid(v => !v)}
        className={`flex items-center justify-between px-5 py-4 rounded-xl border cursor-pointer transition-all ${
          isLucid
            ? 'bg-primary/10 border-primary/30'
            : 'bg-surface-container-low border-outline-variant/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <Moon size={18} className={isLucid ? 'text-primary' : 'text-on-surface/40'} />
          <div>
            <p className={`text-sm font-medium ${isLucid ? 'text-primary' : 'text-on-surface'}`}>Lucid Dream</p>
            <p className="text-xs text-on-surface-variant/50 mt-0.5">I was aware I was dreaming</p>
          </div>
        </div>
        <div className={`w-12 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${isLucid ? 'bg-primary' : 'bg-surface-container-highest'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${isLucid ? 'left-7' : 'left-1'}`} />
        </div>
      </motion.div>

      {/* Bottom Actions Bar */}
      <div className="flex justify-around items-center pt-4">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high group-active:scale-95 transition-transform">
            <Share2 size={20} className="text-on-surface-variant" />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">
            Share
          </span>
        </button>

        <button
          onClick={() => onSave(emotionTag, isLucid, isFavourite)}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-[#D3BBFF] to-[#A885EE] text-[#161212] rounded-full w-16 h-16 shadow-[0_0_20px_rgba(168,133,238,0.6)] active:ring-2 active:ring-[#A885EE] active:ring-offset-2 active:ring-offset-[#161212] transition-all"
        >
          <CheckCircle2 size={26} />
        </button>

        <button
          onClick={() => setIsFavourite(v => !v)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-active:scale-95 ${isFavourite ? 'bg-pink-500/20' : 'bg-surface-container-high'}`}>
            <Heart size={20} className={isFavourite ? 'text-pink-400 fill-pink-400' : 'text-on-surface-variant'} />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">
            Favourite
          </span>
        </button>
      </div>
    </div>
  );
}
