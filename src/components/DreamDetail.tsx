import React from 'react';
import { motion } from 'motion/react';
import { Sun, PenTool, Share2, Heart, Waves, Stars, Eye, Cloud, Sparkles, Moon } from 'lucide-react';
import { Dream, EmotionTag } from '../types';

const EMOTION_EMOJIS: Partial<Record<EmotionTag, string>> = {
  anxious:'😰', peaceful:'😌', confused:'😕', joyful:'😄', afraid:'😨', nostalgic:'🌙',
  melancholic:'🌧️', hopeful:'🌅', lonely:'🫥', loved:'💜', angry:'🔥', excited:'✨',
  overwhelmed:'🌊', grief:'🖤', curious:'🔍', free:'🕊️', lost:'🌫️', safe:'🛡️',
  euphoric:'💫', serene:'🌊', wonder:'🔭',
};

interface DreamDetailProps {
  dream: Dream;
  onAskOracle?: (dream: Dream) => void;
}

export default function DreamDetail({ dream, onAskOracle }: DreamDetailProps) {
  return (
    <div className="pt-8 pb-32 px-6 max-w-3xl mx-auto space-y-12">
      {/* Hero Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans uppercase tracking-widest text-primary/60">
            {dream.date}
          </span>
          <div className="h-px flex-1 bg-outline-variant/15" />
        </div>
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-surface leading-tight">
          {dream.title}
        </h2>
        <div className="flex items-center gap-3 py-1 flex-wrap">
          <span className="flex items-center gap-1 text-tertiary">
            <Sun size={14} />
            <span className="text-sm font-sans font-medium uppercase tracking-tighter">
              {dream.lucidity} Lucidity
            </span>
          </span>
          {dream.isLucid && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary border border-primary/20 uppercase tracking-wider">
              ✦ Lucid
            </span>
          )}
          {dream.emotionTag && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container-high text-on-surface/60 border border-outline-variant/10 uppercase tracking-wider">
              {EMOTION_EMOJIS[dream.emotionTag]} {dream.emotionTag}
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
            <PenTool size={20} className="text-outline-variant/40" />
          </div>
          <div className="font-serif text-xl md:text-2xl leading-relaxed text-on-surface/90 space-y-6">
            {dream.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Key Symbols Grid */}
      <section className="space-y-6">
        <h3 className="text-sm font-sans uppercase tracking-widest text-on-surface/50">Key Symbols</h3>
        <div className="flex flex-wrap gap-3">
          {dream.symbols.map((symbol) => (
            <div
              key={symbol}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-default"
            >
              {symbol === 'Flying' && <Cloud size={18} className="text-primary" />}
              {symbol === 'Water' && <Waves size={18} className="text-primary" />}
              {symbol === 'Stars' && <Stars size={18} className="text-primary" />}
              {symbol === 'Observatory' && <Eye size={18} className="text-primary" />}
              <span className="text-sm font-medium">{symbol}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Emotional Resonance Chart */}
      <section className="bg-surface-container-low rounded-lg p-8 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <Sun size={96} />
          </motion.div>
        </div>
        <h3 className="text-sm font-sans uppercase tracking-widest text-on-surface/50">
          Emotional Resonance
        </h3>
        <div className="space-y-6">
          {Object.entries(dream.resonance).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-serif text-lg italic capitalize">{key}</span>
                <span className="text-xs font-sans text-primary">{value}%</span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  className={`h-full rounded-full shadow-[0_0_10px_rgba(168,133,238,0.5)] ${
                    key === 'awe' ? 'bg-tertiary' : key === 'fear' ? 'bg-outline-variant' : 'bg-primary-container'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Anchor: Abstract Image */}
      {dream.imageUrl && (
        <div className="w-full h-64 rounded-xl overflow-hidden grayscale contrast-125 opacity-40 mix-blend-screen">
          <img
            src={dream.imageUrl}
            alt={dream.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Ask Oracle CTA */}
      {onAskOracle && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onAskOracle(dream)}
          className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Moon size={18} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-primary">Ask The Mirror about this dream</p>
            <p className="text-xs text-on-surface/40 mt-0.5">Get a personal interpretation grounded in your history</p>
          </div>
          <Sparkles size={16} className="text-primary/40 ml-auto group-hover:text-primary transition-colors" />
        </motion.button>
      )}

      {/* Bottom Actions Bar */}
      <div className="flex justify-around items-center pt-4">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high group-active:scale-95 transition-transform">
            <Share2 size={20} className="text-on-surface-variant" />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">Share</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-active:scale-95 ${dream.isFavourite ? 'bg-pink-500/20' : 'bg-surface-container-high'}`}>
            <Heart size={20} className={dream.isFavourite ? 'text-pink-400 fill-pink-400' : 'text-on-surface-variant'} />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">Favourite</span>
        </button>
      </div>
    </div>
  );
}
