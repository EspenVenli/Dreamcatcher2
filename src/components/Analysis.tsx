import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, PenTool, Share2, Heart, CheckCircle2 } from 'lucide-react';
import { Dream } from '../types';

interface AnalysisProps {
  dream: Dream;
  onSave: () => void;
}

export default function Analysis({ dream, onSave }: AnalysisProps) {
  return (
    <div className="pt-8 pb-32 px-6 max-w-3xl mx-auto space-y-12">
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

      {/* Bottom Actions Bar */}
      <div className="flex justify-around items-center pt-8">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high group-active:scale-95 transition-transform">
            <Share2 size={20} className="text-on-surface-variant" />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">
            Share
          </span>
        </button>

        <button
          onClick={onSave}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-[#D3BBFF] to-[#A885EE] text-[#161212] rounded-full w-14 h-14 shadow-[0_0_20px_rgba(168,133,238,0.6)] active:ring-2 active:ring-[#A885EE] active:ring-offset-2 active:ring-offset-[#161212] transition-all"
        >
          <CheckCircle2 size={24} />
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high group-active:scale-95 transition-transform">
            <Heart size={20} className="text-on-surface-variant" />
          </div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-on-surface/60">
            Save
          </span>
        </button>
      </div>
    </div>
  );
}
