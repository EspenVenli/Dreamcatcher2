import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Screen, Dream, UserProfile, WeeklySynthesis, AstrologyProfile, EmotionTag } from './types';
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
import Mirror from './components/Mirror';
import Sleep from './components/Sleep';
import { apiUrl } from './api';

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
  const [mirrorInitialDream, setMirrorInitialDream] = useState<Dream | null>(null);

  useEffect(() => {
    const fetchSynthesis = async () => {
      try {
        const res = await fetch(apiUrl('/api/synthesis'));
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
      const res = await fetch(apiUrl('/api/synthesis/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: user }),
      });
      const savedSynthesis = await res.json();
      setWeeklySynthesis(savedSynthesis);
    } catch (error) {
      console.error('Synthesis generation failed:', error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleLogin = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = async (data: UserProfile) => {
    setUser(data);
    // Persist profile to backend
    try {
      await fetch(apiUrl('/api/user/profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error("Failed to save user profile", e);
    }
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
      const res = await fetch(apiUrl('/api/dreams/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: currentTranscript, userProfile: user }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const result = await res.json();
      const newDream: Dream = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        content: currentTranscript,
        duration: currentDuration,
        ...result,
      };
      try {
        const saved = await fetch(apiUrl('/api/dreams'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDream),
        });
        const savedDream = await saved.json();
        setCurrentDream(savedDream);
      } catch {
        setCurrentDream(newDream);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback: save the raw transcript — never show someone else's mock dream
      const fallback: Dream = {
        id: Date.now().toString(),
        title: 'Untitled Dream',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        content: currentTranscript || 'No transcript available.',
        lucidity: 'Medium',
        symbols: [],
        resonance: { calm: 50, awe: 50, fear: 20 },
        duration: currentDuration,
      };
      try {
        const saved = await fetch(apiUrl('/api/dreams'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fallback) });
        const savedDream = await saved.json();
        setCurrentDream(savedDream);
      } catch {
        setCurrentDream(fallback);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateAstrology = async (astrologyProfile: AstrologyProfile) => {
    const updated = { ...user, astrologyProfile };
    setUser(updated);
    try {
      await fetch(apiUrl('/api/user/profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error("Failed to save astrology profile", e);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      await fetch(apiUrl('/api/user/profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error("Failed to update user profile", e);
    }
  };

  const handleSaveDream = async (emotionTag?: EmotionTag, isLucid?: boolean, isFavourite?: boolean) => {
    if (!currentDream) return;
    // Dream was already auto-saved on analysis — just patch the tags
    try {
      await fetch(apiUrl(`/api/dreams/${currentDream.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotionTag, isLucid, isFavourite })
      });
    } catch (error) {
      console.error("Failed to update dream tags:", error);
    }
    setCurrentScreen('dreams-list');
  };

  const renderScreen = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-primary"
          >
            <Sparkles size={56} />
          </motion.div>
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl text-primary italic">Deepening Analysis</h2>
            <p className="text-on-surface-variant text-sm animate-pulse opacity-70">Consulting the collective whisper...</p>
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
        return <Insights synthesis={weeklySynthesis} onGenerate={handleGenerateSynthesis} isGenerating={isSynthesizing} user={user} />;
      case 'dream-detail':
        return <DreamDetail dream={currentDream || MOCK_DREAM} onAskOracle={dream => {
          setMirrorInitialDream(dream);
          setCurrentScreen('mirror');
        }} />;
      case 'dreams-list':
        return (
          <DreamsList
            onSelectDream={dream => {
              setCurrentDream(dream);
              setCurrentScreen('dream-detail');
            }}
            onGoToWhisper={() => setCurrentScreen('whisper')}
          />
        );
      case 'analysis':
        return currentDream ? <Analysis dream={currentDream} onSave={handleSaveDream} /> : null;
      case 'mirror':
        return <Mirror user={user} initialDream={mirrorInitialDream} onReady={() => setMirrorInitialDream(null)} />;
      case 'transcription':
        return <Transcription transcript={currentTranscript} onAnalyze={handleAnalyzeTranscript} />;
      case 'you':
        return <You user={user} onLogout={() => setCurrentScreen('login')} onUpdateAstrology={handleUpdateAstrology} onUpdateProfile={handleUpdateProfile} />;
      case 'sleep':
        return <Sleep user={user} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  const getLayoutProps = () => {
    if (currentScreen === 'login') {
      return { showTopNav: false, showBottomNav: false };
    }
    if (currentScreen === 'onboarding') {
      return { showTopNav: true, showBottomNav: false, title: 'Getting Started' };
    }
    if (
      currentScreen === 'dream-detail' ||
      currentScreen === 'analysis' ||
      currentScreen === 'you' ||
      currentScreen === 'transcription'
    ) {
      return {
        showTopNav: true,
        showBottomNav: currentScreen === 'you',
        title:
          currentScreen === 'you'         ? 'Profile'
          : currentScreen === 'transcription' ? 'Review Dream'
          : 'Dream Analysis',
        onClose:
          currentScreen === 'you' ? undefined
          : () => setCurrentScreen(
              currentScreen === 'analysis' || currentScreen === 'transcription'
                ? 'whisper'
                : 'dreams-list'
            )
      };
    }
    if (currentScreen === 'mirror') {
      return { showTopNav: true, showBottomNav: true, title: 'The Mirror' };
    }
    if (currentScreen === 'sleep') {
      return { showTopNav: true, showBottomNav: true };
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
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
