import React from 'react';
import { motion } from 'motion/react';
import { Sun, PenTool, Share2, Heart, Waves, Stars, Eye, Cloud, Sparkles } from 'lucide-react';
import { Dream } from '../types';

interface DreamDetailProps {
  dream: Dream;
}

export default function DreamDetail({ dream }: DreamDetailProps) {
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
        <div className="flex items-center gap-4 py-2">
          <span className="flex items-center gap-1 text-tertiary">
            <Sun size={14} />
            <span className="text-sm font-sans font-medium uppercase tracking-tighter">
              {dream.lucidity} Lucidity
            </span>
          </span>
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

      {/* Bottom Actions Bar */}
      <div className="flex justify-around items-center pt-8">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high group-active:scale-95 transition-transform">
            <Sparkles size={20} className="text-on-surface-variant" />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">
            Re-analyze
          </span>
        </button>

        <button className="flex flex-col items-center justify-center bg-gradient-to-br from-[#D3BBFF] to-[#A885EE] text-[#161212] rounded-full w-14 h-14 shadow-[0_0_20px_rgba(168,133,238,0.6)] active:ring-2 active:ring-[#A885EE] active:ring-offset-2 active:ring-offset-[#161212] transition-all">
          <Share2 size={24} fill="currentColor" />
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high group-active:scale-95 transition-transform">
            <Heart size={20} className="text-on-surface-variant" />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">
            Add to Favorites
          </span>
        </button>
      </div>
    </div>
  );
}
