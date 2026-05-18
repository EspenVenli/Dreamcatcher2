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
  | 'login' | 'onboarding' | 'whisper' | 'insights' | 'dream-detail'
  | 'dreams-list' | 'analysis' | 'you' | 'transcription' | 'mirror' | 'sleep';

export type EmotionTag =
  | 'anxious' | 'peaceful' | 'confused' | 'joyful' | 'afraid' | 'nostalgic'
  | 'melancholic' | 'hopeful' | 'lonely' | 'loved' | 'angry' | 'ashamed'
  | 'excited' | 'overwhelmed' | 'numb' | 'grief' | 'curious' | 'trapped'
  | 'free' | 'hunted' | 'lost' | 'safe' | 'unsettled' | 'euphoric'
  | 'guilty' | 'tender' | 'powerful' | 'helpless' | 'strange' | 'serene'
  | 'desperate' | 'wonder';

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
  emotionTag?: EmotionTag;
  isLucid?: boolean;
  isFavourite?: boolean;
}

export type StressLevel = 'low' | 'moderate' | 'high';
export type LifePhase = 'transition' | 'loss' | 'new-beginning' | 'stillness' | 'prefer-not-to-say';
export type DreamRelationship = 'meaningful' | 'just-noise' | 'not-sure';
export type SleepQuality = 'poor' | 'average' | 'good';

export type DreamGoal =
  | 'track-recurring'
  | 'explore-symbols'
  | 'process-emotions'
  | 'improve-lucidity'
  | 'understand-patterns'
  | 'just-curious';

export type DreamRecallFrequency = 'rarely' | 'sometimes' | 'often' | 'almost-always';

export type EmotionalTone =
  | 'peaceful' | 'anxious' | 'adventurous' | 'melancholic' | 'surreal' | 'vivid'
  | 'joyful' | 'confused' | 'afraid' | 'hopeful' | 'curious' | 'excited'
  | 'overwhelmed' | 'lonely' | 'wonder' | 'euphoric' | 'tender' | 'strange'
  | 'safe' | 'lost';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type AstroMode = 'sun-sign' | 'full-chart';

export interface PlanetPlacement {
  sign: ZodiacSign;
  house?: number;
  degree?: number;
}

export interface FullBirthChart {
  sun?: PlanetPlacement;
  moon?: PlanetPlacement;
  rising?: PlanetPlacement;
  mercury?: PlanetPlacement;
  venus?: PlanetPlacement;
  mars?: PlanetPlacement;
  jupiter?: PlanetPlacement;
  saturn?: PlanetPlacement;
  uranus?: PlanetPlacement;
  neptune?: PlanetPlacement;
  pluto?: PlanetPlacement;
  northNode?: PlanetPlacement;
  mc?: PlanetPlacement;
  hasTime?: boolean;
}

export interface BirthData {
  date: string;
  time?: string;
  place: string;
  geocodedPlace?: string;
}

export interface AstrologyProfile {
  mode: AstroMode;
  sunSign?: ZodiacSign;
  birthData?: BirthData;
  fullChart?: FullBirthChart;
}

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
  astrologyProfile?: AstrologyProfile;
  morningReminder?: {
    enabled: boolean;
    time?: string;
  };
  stressLevel?: StressLevel;
  lifePhase?: LifePhase;
  dreamRelationship?: DreamRelationship;
  sleepQuality?: SleepQuality;
  keptJournalBefore?: boolean;
}
