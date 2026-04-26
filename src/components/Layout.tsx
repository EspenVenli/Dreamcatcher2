import React from 'react';
import { Sparkles, Mic, BarChart3, MoreVertical, X, BookOpen, User, Eye, Compass } from 'lucide-react';
import { Screen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  showTopNav?: boolean;
  showBottomNav?: boolean;
  title?: string;
  onClose?: () => void;
}

const NAV_ITEMS: { screen: Screen; label: string; icon: React.ElementType }[] = [
  { screen: 'whisper',     label: 'Whisper', icon: Mic },
  { screen: 'dreams-list', label: 'Dreams',  icon: BookOpen },
  { screen: 'stats',       label: 'Stats',   icon: BarChart3 },
  { screen: 'lucid',       label: 'Lucid',   icon: Eye },
  { screen: 'you',         label: 'You',     icon: User },
];

export default function Layout({
  children,
  currentScreen,
  onNavigate,
  showTopNav = true,
  showBottomNav = true,
  title = 'Dreamcatcher',
  onClose,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient Background Decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/5 rounded-full blur-[100px]" />
      </div>

      {/* Top App Bar */}
      {showTopNav && (
        <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 shadow-[0_0_20px_rgba(168,133,238,0.06)]">
          <div className="flex items-center gap-2 text-primary">
            {onClose ? (
              <button onClick={onClose} className="hover:opacity-80 transition-opacity active:scale-95">
                <X size={24} />
              </button>
            ) : (
              <Sparkles size={24} />
            )}
            <span className="font-serif text-2xl tracking-tight italic ml-2">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            {onClose && (
              <button className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95">
                <MoreVertical size={24} />
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-grow ${showTopNav ? 'pt-16' : ''} ${showBottomNav ? 'pb-32' : ''}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 w-full z-50 rounded-t-[2rem] bg-surface/80 backdrop-blur-xl flex justify-around items-center px-2 pb-8 pt-4 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`flex flex-col items-center justify-center transition-all min-w-[56px] ${
                  active
                    ? 'text-primary'
                    : 'text-on-surface/40 hover:text-primary/80'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-colors ${active ? 'bg-primary/15' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="font-sans text-[9px] font-medium tracking-wider uppercase mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
