import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, RotateCcw, MicOff, Moon, Type, Eye, Cloud, Zap, Skull, Sparkles } from 'lucide-react';
import { DreamType } from '../types';

interface WhisperProps {
  onSend: (duration: number, transcript: string, dreamType: DreamType) => void;
}

type State = 'idle' | 'recording' | 'done';
type Mode = 'voice' | 'type';

const DREAM_TYPES: { id: DreamType; label: string; icon: React.ElementType; tint: string }[] = [
  { id: 'normal',    label: 'Normal',    icon: Moon,     tint: 'bg-primary/10 text-primary border-primary/20' },
  { id: 'lucid',     label: 'Lucid',     icon: Eye,      tint: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
  { id: 'vivid',     label: 'Vivid',     icon: Sparkles, tint: 'bg-secondary/15 text-secondary border-secondary/25' },
  { id: 'nightmare', label: 'Nightmare', icon: Skull,    tint: 'bg-outline-variant/15 text-on-surface-variant border-outline-variant/25' },
  { id: 'fragment',  label: 'Fragment',  icon: Cloud,    tint: 'bg-primary-container/10 text-primary-container border-primary-container/20' },
];

export default function Whisper({ onSend }: WhisperProps) {
  const [mode, setMode] = useState<Mode>('voice');
  const [state, setState] = useState<State>('idle');
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [typedText, setTypedText] = useState('');
  const [dreamType, setDreamType] = useState<DreamType>('normal');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSpeechSupported(false);
      setMode('type');
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscriptRef.current + interim);
    };

    rec.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      }
    };

    rec.onend = () => {
      if (state === 'recording') {
        try { rec.start(); } catch {}
      }
    };

    recognitionRef.current = rec;
    return () => { rec.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = () => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setTimer(0);
    setState('recording');
    try { recognitionRef.current?.start(); } catch {}
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setState('done');
  };

  const handleReset = () => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setTypedText('');
    setTimer(0);
    setState('idle');
  };

  const handleSend = () => {
    const text = mode === 'voice'
      ? (transcript.trim() || 'The dream slipped away before I could catch it...')
      : (typedText.trim() || 'The dream slipped away before I could catch it...');
    const dur = mode === 'voice' ? timer : Math.max(15, Math.round(text.split(/\s+/).length * 0.4));
    onSend(dur, text, dreamType);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-full flex flex-col px-6 py-10 relative overflow-hidden">
      {/* Header */}
      <motion.div
        className="text-center mb-8 mt-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] text-on-surface-variant font-medium tracking-[0.25em] uppercase mb-3 opacity-50">
          Dream Capture
        </p>
        <h2 className="font-serif text-4xl text-on-surface leading-tight">
          Whisper your<br />night landscape
        </h2>
        <p className="text-on-surface-variant/60 text-sm font-sans mt-3 max-w-xs mx-auto">
          {mode === 'type'
            ? 'Type freely — the AI will shape it into a narrative'
            : state === 'idle'
            ? 'Speak freely — describe everything you remember'
            : state === 'recording'
            ? 'Recording... speak at your own pace'
            : 'Review your dream before sending for analysis'}
        </p>
      </motion.div>

      {/* Mode toggle */}
      {speechSupported && (
        <div className="flex justify-center mb-6">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-full p-1 flex gap-1">
            <button
              onClick={() => { setMode('voice'); handleReset(); }}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all flex items-center gap-2 ${
                mode === 'voice'
                  ? 'bg-primary text-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <Mic size={12} /> Voice
            </button>
            <button
              onClick={() => { setMode('type'); handleReset(); }}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all flex items-center gap-2 ${
                mode === 'type'
                  ? 'bg-primary text-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <Type size={12} /> Type
            </button>
          </div>
        </div>
      )}

      {/* Dream type chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-md mx-auto w-full">
        {DREAM_TYPES.map(t => {
          const Icon = t.icon;
          const selected = dreamType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setDreamType(t.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-medium border transition-all flex items-center gap-1.5 ${
                selected ? t.tint + ' shadow-[0_0_10px_rgba(168,133,238,0.15)]' : 'border-outline-variant/15 text-on-surface-variant/60 hover:text-primary'
              }`}
            >
              <Icon size={11} />
              {t.label}
            </button>
          );
        })}
      </div>

      {mode === 'voice' ? (
        <VoiceUI
          state={state}
          transcript={transcript}
          timer={timer}
          formatTime={formatTime}
          onStart={startRecording}
          onStop={stopRecording}
          onReset={handleReset}
          onSend={handleSend}
          speechSupported={speechSupported}
        />
      ) : (
        <TypeUI
          value={typedText}
          onChange={setTypedText}
          onSend={handleSend}
        />
      )}

      {/* Bottom info cards */}
      <div className="mt-auto grid grid-cols-2 gap-3 w-full max-w-md mx-auto pt-6">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex flex-col gap-2">
          <Moon size={18} className="text-primary opacity-70" />
          <div>
            <h3 className="text-xs font-semibold text-on-surface">REM Capture</h3>
            <p className="text-[11px] text-on-surface-variant/60 mt-0.5 leading-snug">Best within 5 minutes of waking</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex flex-col gap-2">
          <Zap size={18} className="text-tertiary opacity-70" />
          <div>
            <h3 className="text-xs font-semibold text-on-surface">No Editing Needed</h3>
            <p className="text-[11px] text-on-surface-variant/60 mt-0.5 leading-snug">AI cleans the narrative for you</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceUI(props: {
  state: State;
  transcript: string;
  timer: number;
  formatTime: (s: number) => string;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onSend: () => void;
  speechSupported: boolean;
}) {
  const { state, transcript, timer, formatTime, onStart, onStop, onReset, onSend, speechSupported } = props;
  return (
    <>
      {/* Waveform visualizer */}
      <div className="w-full flex justify-center mb-6">
        <div className="flex items-end gap-[3px] h-16">
          {[...Array(36)].map((_, i) => (
            <motion.div
              key={i}
              animate={state === 'recording' ? {
                height: [8, Math.random() * 52 + 8, 8],
              } : { height: [4, 8, 4] }}
              transition={state === 'recording' ? {
                duration: 0.4 + (i % 5) * 0.08,
                repeat: Infinity, ease: 'easeInOut', delay: i * 0.02,
              } : { duration: 2.5, repeat: Infinity, delay: i * 0.06, ease: 'easeInOut' }}
              className={`w-1 rounded-full transition-colors duration-500 ${
                state === 'recording'
                  ? 'bg-primary shadow-[0_0_6px_rgba(168,133,238,0.6)]'
                  : 'bg-on-surface-variant/15'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Live transcript */}
      <AnimatePresence>
        {(state === 'recording' || state === 'done') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 mx-auto w-full max-w-md"
          >
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-5 relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {state === 'recording' && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                )}
                <span className="text-[9px] uppercase tracking-wider text-on-surface-variant/40">
                  {state === 'recording' ? 'Live' : 'Captured'}
                </span>
              </div>
              <p className="font-serif text-sm text-on-surface/80 leading-relaxed italic pr-16 min-h-[3rem]">
                {transcript || (
                  <span className="text-on-surface-variant/30">Your words will appear here...</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Record controls */}
      <div className="flex flex-col items-center gap-6 mb-2">
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {state === 'recording' && (
              <>
                <motion.div
                  key="ripple1"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1.6, opacity: 0.08 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute w-36 h-36 bg-primary rounded-full"
                />
                <motion.div
                  key="ripple2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 2.2, opacity: 0.04 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
                  className="absolute w-36 h-36 bg-primary rounded-full"
                />
              </>
            )}
          </AnimatePresence>

          <motion.button
            onClick={state === 'recording' ? onStop : state === 'idle' ? onStart : undefined}
            whileTap={{ scale: 0.93 }}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              state === 'recording'
                ? 'bg-primary scale-110 shadow-[0_0_32px_rgba(168,133,238,0.4)]'
                : state === 'done'
                ? 'bg-surface-container-highest opacity-50 cursor-default'
                : 'bg-gradient-to-br from-primary to-primary-container hover:scale-105'
            }`}
          >
            {state === 'recording'
              ? <MicOff size={36} className="text-surface animate-pulse" />
              : <Mic size={36} className="text-surface" />
            }
          </motion.button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-2xl text-primary font-bold tracking-widest tabular-nums">
            {formatTime(timer)}
          </span>
          <span className="text-on-surface-variant/50 text-xs uppercase tracking-wider">
            {state === 'idle' ? 'Tap to begin' : state === 'recording' ? 'Tap to stop' : 'Recording complete'}
          </span>
        </div>

        <AnimatePresence>
          {state === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-4 w-full max-w-xs"
            >
              <button
                onClick={onReset}
                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all text-xs uppercase tracking-wider font-medium"
              >
                <RotateCcw size={15} />
                <span>Redo</span>
              </button>
              <button
                onClick={onSend}
                className="flex-[2] h-12 flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container text-surface font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send size={15} />
                <span>Analyse Dream</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!speechSupported && (
          <div className="text-center text-on-surface-variant/60 text-xs max-w-xs">
            <MicOff size={14} className="inline mr-1" />
            Voice recording isn't supported in this browser. Try typing instead.
          </div>
        )}
      </div>
    </>
  );
}

function TypeUI({ value, onChange, onSend }: { value: string; onChange: (v: string) => void; onSend: () => void }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto mb-6">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={10}
        autoFocus
        placeholder="Begin where the dream began. Don't worry about order — just let it spill out..."
        className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 rounded-2xl py-4 px-5 text-base font-serif italic text-on-surface placeholder-on-surface-variant/30 focus:ring-1 focus:ring-primary/20 outline-none resize-none transition-all leading-relaxed"
      />
      <div className="w-full flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <button
          onClick={onSend}
          disabled={wordCount < 3}
          className="h-12 px-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container text-surface font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={14} />
          <span>Analyse Dream</span>
        </button>
      </div>
    </div>
  );
}
