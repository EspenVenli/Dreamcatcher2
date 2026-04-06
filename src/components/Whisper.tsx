import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Sparkles, Settings2, Smile, Send, RotateCcw } from 'lucide-react';

interface WhisperProps {
  onSend: (duration: number, transcript: string) => void;
}

export default function Whisper({ onSend }: WhisperProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      recognition?.start();
    } else {
      recognition?.stop();
    }
    return () => {
      clearInterval(interval);
      recognition?.stop();
    };
  }, [isRecording, recognition]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setTimer(0);
      setTranscript('');
      setIsRecording(true);
      setHasRecorded(false);
    }
  };

  const handleReset = () => {
    setTimer(0);
    setTranscript('');
    setHasRecorded(false);
    setIsRecording(false);
  };

  const handleSend = () => {
    const finalTranscript = transcript || "I couldn't quite catch that. Maybe the dream was too elusive?";
    onSend(timer, finalTranscript);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden">
      {/* Instructional Header */}
      <div className="text-center mt-8 mb-8">
        <p className="text-[10px] text-on-surface-variant font-medium tracking-[0.2em] uppercase mb-4 opacity-60">
          Session
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-on-surface leading-tight">
          Whisper your <br />
          night landscape
        </h2>
      </div>

      {/* Visualizer / Stream Area */}
      <div className="w-full max-w-md h-48 flex flex-col items-center justify-center relative">
        <div className="flex items-end gap-[3px] h-32">
          {[...Array(32)].map((_, i) => (
            <motion.div
              key={i}
              animate={isRecording ? {
                height: [20, Math.random() * 100 + 20, 20],
              } : {
                height: [12, 16, 12],
              }}
              transition={isRecording ? {
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              } : {
                duration: 2,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
              className={`w-1 rounded-full transition-colors duration-500 ${
                isRecording ? 'bg-primary shadow-[0_0_10px_rgba(168,133,238,0.5)]' : 'bg-on-surface-variant/20'
              }`}
            />
          ))}
        </div>
        
        {!isRecording && !hasRecorded && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-[-2rem] text-[10px] font-sans uppercase tracking-[0.2em] text-on-surface-variant/40"
          >
            Ambient Silence
          </motion.p>
        )}
        
        {/* Ambient Light Source */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent blur-3xl -z-10" />
      </div>

      {/* Central Record Button Section */}
      <div className="relative flex flex-col items-center gap-8 mb-12 w-full">
        <div className="relative flex items-center justify-center w-full">
          {/* Ripple Effects */}
          <AnimatePresence>
            {isRecording && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-48 h-48 bg-primary rounded-full"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0.05 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute w-64 h-64 bg-primary rounded-full"
                />
              </>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-8 z-10">
            {hasRecorded && !isRecording && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleReset}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              >
                <RotateCcw size={24} />
              </motion.button>
            )}

            <button
              onClick={handleToggleRecording}
              className={`relative w-28 h-28 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
                isRecording
                  ? 'bg-primary text-on-primary-container scale-110'
                  : 'bg-gradient-to-br from-primary to-primary-container text-on-primary-container'
              }`}
            >
              <Mic size={48} className={isRecording ? 'animate-pulse' : ''} />
            </button>

            {hasRecorded && !isRecording && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleSend}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-on-primary-container shadow-lg hover:scale-110 transition-all"
              >
                <Send size={24} />
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-mono text-2xl text-primary font-bold tracking-widest">
            {formatTime(timer)}
          </span>
          <span className="text-on-surface-variant/60 text-sm mt-2">
            {isRecording ? 'Listening for symbols...' : hasRecorded ? 'Note captured. Send for analysis?' : 'Tap to start journey'}
          </span>
        </div>
      </div>

      {/* Meta Context Cards (Asymmetric Bento) */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/10 flex flex-col gap-3"
        >
          <Settings2 className="text-tertiary" size={24} />
          <div>
            <h3 className="text-sm font-bold text-on-surface">Lucidity Level</h3>
            <p className="text-xs text-on-surface-variant opacity-70">Deep REM phase</p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/10 flex flex-col gap-3"
        >
          <Smile className="text-secondary" size={24} />
          <div>
            <h3 className="text-sm font-bold text-on-surface">Emotional Tone</h3>
            <p className="text-xs text-on-surface-variant opacity-70">Nostalgic / Calm</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
