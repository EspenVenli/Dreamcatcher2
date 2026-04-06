import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles } from 'lucide-react';
import { Screen, Dream, UserProfile, WeeklySynthesis } from './types';
import Layout from './components/Layout';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Whisper from './components/Whisper';
import Insights from './components/Insights';
import DreamDetail from './components/DreamDetail';
import DreamsList from './components/DreamsList';
import Analysis from './components/Analysis';
import You from './components/You';
import Transcription from './components/Transcription';

const MOCK_DREAM: Dream = {
  id: '1',
  title: 'The Glass Observatory',
  date: 'November 12, 2023',
  content: `I was standing in a structure made entirely of curved glass panels, suspended high above a sea of violet clouds. The air felt thin and smelled of ozone. Every step I took resonated like a low-frequency hum through the floor. I looked down, and instead of my reflection, I saw constellations shifting beneath my feet.\n\nA figure was sitting at a telescope that didn't point at the sky, but deep into the water below. They didn't speak, but I could hear their thoughts like a distant radio frequency. "The stars are just holes in the surface of everything else," they whispered. I felt a sudden weightlessness, and the glass began to dissolve into liquid light.`,
  lucidity: 'High',
  symbols: ['Flying', 'Water', 'Stars', 'Observatory'],
  resonance: {
    calm: 85,
    awe: 92,
    fear: 12,
  },
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd00-uHzDDBP4W2Z5GLAwvTf2MD-944N-qNT4M0dM1LFe0Dc9qifYw8ZDynS3KhViDBHUyfYuyVbQapGRW30vfSW6XH04QbFezmr-6fFdz-ja335Tx9sQUx8LfUzSCSYufl4d5zTWJCENqGpzVvj9zyC1WpIuFXEeiyHZgWtveGzGYNdRtJ3QF-bh1ZUK2mFN0mNnWYIIpaeAiqFgU59FtWxcLMLt7kTtQVHYHjH_PXD276Mm42J-_jvvZ8kT8nt25BIOA2scEDK-s'
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentDream, setCurrentDream] = useState<Dream | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [currentDuration, setCurrentDuration] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [weeklySynthesis, setWeeklySynthesis] = useState<WeeklySynthesis | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  useEffect(() => {
    const fetchSynthesis = async () => {
      try {
        const res = await fetch('/api/synthesis');
        const data = await res.json();
        if (data) setWeeklySynthesis(data);
      } catch (e) {
        console.error("Failed to fetch synthesis", e);
      }
    };
    fetchSynthesis();
  }, []);

  const handleGenerateSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const dreamsRes = await fetch('/api/dreams');
      const dreams: Dream[] = await dreamsRes.json();
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a weekly dream synthesis for a user with the following profile and recent dreams.
        User Profile: ${JSON.stringify(user)}
        Recent Dreams: ${JSON.stringify(dreams.slice(0, 10))}
        
        Provide a headline, patterns (with icons like Waves, Key, Sparkles, Moon, Sun, Wind), celestial alignment, shadow work, a collective whisper message, and a moodscape (title, image description, and 3 hex colors).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              patterns: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    frequency: { type: Type.NUMBER },
                    icon: { type: Type.STRING }
                  }
                }
              },
              celestialAlignment: { type: Type.STRING },
              shadowWork: { type: Type.STRING },
              collectiveWhisper: { type: Type.STRING },
              moodscape: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                  colors: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            required: ["headline", "patterns", "celestialAlignment", "shadowWork", "collectiveWhisper", "moodscape"]
          }
        }
      });

      const result = JSON.parse(response.text);
      // Ensure we have a valid image URL if the AI didn't provide a real one
      if (!result.moodscape.imageUrl || !result.moodscape.imageUrl.startsWith('http')) {
        result.moodscape.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(result.moodscape.title)}/800/600?blur=2`;
      }

      const res = await fetch('/api/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const savedSynthesis = await res.json();
      setWeeklySynthesis(savedSynthesis);
    } catch (error) {
      console.error("Synthesis generation failed:", error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleLogin = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = (data: { age: number; starSign: string }) => {
    setUser(data);
    setCurrentScreen('whisper');
  };

  const handleSendVoiceNote = async (duration: number, transcript: string) => {
    setCurrentTranscript(transcript);
    setCurrentDuration(duration);
    setCurrentScreen('transcription');
  };

  const handleAnalyzeTranscript = async () => {
    setIsAnalyzing(true);
    setCurrentScreen('analysis');

    try {
      // 2. Call Gemini for Analysis and Cleaning
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this dream transcript. Provide a title, a cleaned-up narrative version, and a psychological analysis.
        Transcript: ${currentTranscript}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              cleanedContent: { type: Type.STRING },
              analysis: { type: Type.STRING },
              lucidity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              symbols: { type: Type.ARRAY, items: { type: Type.STRING } },
              resonance: {
                type: Type.OBJECT,
                properties: {
                  calm: { type: Type.NUMBER },
                  awe: { type: Type.NUMBER },
                  fear: { type: Type.NUMBER }
                }
              }
            },
            required: ["title", "cleanedContent", "analysis", "lucidity", "symbols", "resonance"]
          }
        }
      });

      const result = JSON.parse(response.text);
      const newDream: Dream = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        content: currentTranscript,
        duration: currentDuration,
        ...result
      };

      setCurrentDream(newDream);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback to mock if API fails
      setCurrentDream({
        ...MOCK_DREAM,
        id: Date.now().toString(),
        duration: currentDuration
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveDream = async () => {
    if (!currentDream) return;
    
    try {
      await fetch('/api/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentDream)
      });
      setCurrentScreen('dreams-list');
    } catch (error) {
      console.error("Failed to save dream:", error);
      setCurrentScreen('dreams-list');
    }
  };

  const renderScreen = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-primary"
          >
            <Sparkles size={64} />
          </motion.div>
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl text-primary italic">Deepening Analysis</h2>
            <p className="text-on-surface-variant text-sm animate-pulse">Consulting the collective whisper...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'whisper':
        return <Whisper onSend={handleSendVoiceNote} />;
      case 'insights':
        return <Insights synthesis={weeklySynthesis} onGenerate={handleGenerateSynthesis} isGenerating={isSynthesizing} />;
      case 'dream-detail':
        return <DreamDetail dream={currentDream || MOCK_DREAM} />;
      case 'dreams-list':
        return <DreamsList onSelectDream={(dream) => {
          setCurrentDream(dream);
          setCurrentScreen('dream-detail');
        }} />;
      case 'analysis':
        return currentDream ? <Analysis dream={currentDream} onSave={handleSaveDream} /> : null;
      case 'transcription':
        return <Transcription transcript={currentTranscript} onAnalyze={handleAnalyzeTranscript} />;
      case 'you':
        return <You user={user} onLogout={() => setCurrentScreen('login')} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  const getLayoutProps = () => {
    if (currentScreen === 'login') {
      return { showTopNav: false, showBottomNav: false };
    }
    if (currentScreen === 'onboarding') {
      return { showTopNav: true, showBottomNav: false, title: 'Lucid Journey' };
    }
    if (currentScreen === 'dream-detail' || currentScreen === 'analysis' || currentScreen === 'you' || currentScreen === 'transcription') {
      return { 
        showTopNav: true, 
        showBottomNav: currentScreen === 'you', 
        title: currentScreen === 'you' ? 'Profile' : currentScreen === 'transcription' ? 'Transcription' : 'Lucid Journey', 
        onClose: currentScreen === 'you' ? undefined : () => setCurrentScreen(currentScreen === 'analysis' ? 'whisper' : currentScreen === 'transcription' ? 'whisper' : 'dreams-list') 
      };
    }
    return { showTopNav: true, showBottomNav: true };
  };

  return (
    <Layout
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
      {...getLayoutProps()}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen + (isAnalyzing ? '-analyzing' : '')}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
