export interface WeeklySynthesis {
  date: string;
  headline: string;
  patterns: { name: string; frequency: number; icon: string }[];
  celestialAlignment: string;
  shadowWork: string;
  collectiveWhisper: string;
  moodscape: { title: string; imageUrl: string; colors: string[] };
}

export type Screen = 'login' | 'onboarding' | 'whisper' | 'insights' | 'dream-detail' | 'dreams-list' | 'analysis' | 'you' | 'transcription';

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
}

export interface UserProfile {
  age?: number;
  starSign?: string;
  email?: string;
}
