import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, RotateCcw, MicOff, Moon } from 'lucide-react';

interface WhisperProps {
  onSend: (duration: number, transcript: string) => void;
}

type State = 'idle' | 'recording' | 'done';

export default function Whisper({ onSend }: WhisperProps) {
  const [state, setState] = useState<State>('idle');
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSpeechSupported(false);
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
        // Auto-restart if still meant to be recording
        try { rec.start(); } catch {}
      }
    };

    recognitionRef.current = rec;

    return () => {
      rec.abort();
    };
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
    setTimer(0);
    setState('idle');
  };

  const handleSend = () => {
    const finalText = transcript.trim() || "The dream slipped away before I could catch it...";
    onSend(timer, finalText);
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
        className="text-center mb-10 mt-4"
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
          {state === 'idle'
            ? 'Speak freely — describe everything you remember'
            : state === 'recording'
            ? 'Recording... speak at your own pace'
            : 'Review your dream before sending for analysis'}
        </p>
      </motion.div>

      {/* Waveform visualizer */}
      <div className="w-full flex justify-center mb-8">
        <div className="flex items-end gap-[3px] h-16">
          {[...Array(36)].map((_, i) => (
            <motion.div
              key={i}
              animate={state === 'recording' ? {
                height: [8, Math.random() * 52 + 8, 8],
              } : {
                height: [4, 8, 4],
              }}
              transition={state === 'recording' ? {
                duration: 0.4 + (i % 5) * 0.08,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.02,
              } : {
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.06,
                ease: 'easeInOut',
              }}
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
            className="mb-8 mx-auto w-full max-w-md"
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
      <div className="flex flex-col items-center gap-6 mb-10">

        {/* Ripples + Button */}
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
            onClick={state === 'recording' ? stopRecording : state === 'idle' ? startRecording : undefined}
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

        {/* Timer */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-2xl text-primary font-bold tracking-widest tabular-nums">
            {formatTime(timer)}
          </span>
          <span className="text-on-surface-variant/50 text-xs uppercase tracking-wider">
            {state === 'idle' ? 'Tap to begin' : state === 'recording' ? 'Tap to stop' : 'Recording complete'}
          </span>
        </div>

        {/* Action buttons after recording */}
        <AnimatePresence>
          {state === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-4 w-full max-w-xs"
            >
              <button
                onClick={handleReset}
                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all text-xs uppercase tracking-wider font-medium"
              >
                <RotateCcw size={15} />
                <span>Redo</span>
              </button>
              <button
                onClick={handleSend}
                className="flex-[2] h-12 flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container text-surface font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send size={15} />
                <span>Analyse Dream</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No speech API warning */}
        {!speechSupported && (
          <div className="text-center text-on-surface-variant/60 text-xs max-w-xs">
            <MicOff size={14} className="inline mr-1" />
            Voice recording isn't supported in this browser. Try Chrome or Edge.
          </div>
        )}
      </div>

      {/* Bottom info cards */}
      <div className="mt-auto grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex flex-col gap-2">
          <Moon size={18} className="text-primary opacity-70" />
          <div>
            <h3 className="text-xs font-semibold text-on-surface">REM Capture</h3>
            <p className="text-[11px] text-on-surface-variant/60 mt-0.5 leading-snug">Best recorded within 5 minutes of waking</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex flex-col gap-2">
          <Mic size={18} className="text-secondary opacity-70" />
          <div>
            <h3 className="text-xs font-semibold text-on-surface">No Editing Needed</h3>
            <p className="text-[11px] text-on-surface-variant/60 mt-0.5 leading-snug">Speak naturally — AI will clean up the narrative</p>
          </div>
        </div>
      </div>
    </div>
  );
}
