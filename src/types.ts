export interface WeeklySynthesis {
  date: string;
  headline: string;
  patterns: { name: string; frequency: number; icon: string }[];
  celestialAlignment: string;
  shadowWork: string;
  collectiveWhisper: string;
  moodscape: { title: string; imageUrl: string; colors: string[] };
}

export type Screen =
  | 'login'
  | 'onboarding'
  | 'whisper'
  | 'insights'
  | 'dream-detail'
  | 'dreams-list'
  | 'analysis'
  | 'you'
  | 'transcription'
  | 'stats'
  | 'lucid'
  | 'sleep';

export type DreamType = 'normal' | 'lucid' | 'nightmare' | 'vivid' | 'fragment';

export interface Dream {
  id: string;
  title: string;
  date: string;
  content: string;
  cleanedContent?: string;
  analysis?: string;
  lucidity: 'Low' | 'Medium' | 'High';
  symbols: string[];
  resonance: {
    calm: number;
    awe: number;
    fear: number;
  };
  imageUrl?: string;
  duration?: number;
  isFavorite?: boolean;
  tags?: string[];
  notes?: string;
  dreamType?: DreamType;
  createdAt?: string;
  updatedAt?: string;
}

export type DreamGoal =
  | 'track-recurring'
  | 'explore-symbols'
  | 'process-emotions'
  | 'improve-lucidity'
  | 'understand-patterns'
  | 'just-curious';

export type DreamRecallFrequency = 'rarely' | 'sometimes' | 'often' | 'almost-always';

export type EmotionalTone =
  | 'peaceful'
  | 'anxious'
  | 'adventurous'
  | 'melancholic'
  | 'surreal'
  | 'vivid';

export interface UserProfile {
  age?: number;
  starSign?: string;
  email?: string;
  goals?: DreamGoal[];
  recurringDreams?: string;
  typicalMoods?: EmotionalTone[];
  bedtime?: string;
  wakeTime?: string;
  dreamRecall?: DreamRecallFrequency;
}

export interface DreamStats {
  total: number;
  streak: number;
  lucidity: { Low: number; Medium: number; High: number };
  lucidPct: number;
  topSymbols: { name: string; count: number }[];
  timeline: { date: string; count: number }[];
  recentResonance: { date: string; calm: number; awe: number; fear: number }[];
  avgResonance: { calm: number; awe: number; fear: number };
  sleepEntries: number;
}

export interface SleepEntry {
  id: string;
  date: string;
  quality: number;
  bedtime?: string;
  wakeTime?: string;
  moodOnWake?: string;
  notes?: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  tone?: 'info' | 'success' | 'error';
}
