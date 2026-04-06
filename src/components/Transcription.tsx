import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, PenTool, ArrowRight } from 'lucide-react';

interface TranscriptionProps {
  transcript: string;
  onAnalyze: () => void;
}

export default function Transcription({ transcript, onAnalyze }: TranscriptionProps) {
  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-12">
      <header className="space-y-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
          Voice to Narrative
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          Your <span className="italic text-primary text-glow">Transcript</span>
        </h1>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low p-8 rounded-lg border border-outline-variant/10 relative"
      >
        <div className="absolute -top-3 -left-3 w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-primary border border-primary/20">
          <PenTool size={20} />
        </div>
        
        <p className="font-serif text-xl leading-relaxed text-on-surface/80 italic">
          "{transcript}"
        </p>
      </motion.section>

      <div className="flex flex-col items-center gap-6">
        <p className="text-on-surface-variant text-sm text-center opacity-60">
          The collective whisper is ready to interpret your journey.
        </p>
        
        <button
          onClick={onAnalyze}
          className="w-full bg-primary text-on-primary-container py-5 rounded-full font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Sparkles size={20} />
          Analyze with AI
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
