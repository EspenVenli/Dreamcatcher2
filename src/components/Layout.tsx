import React from 'react';
import { Sparkles, Moon, Mic, BarChart2, MoreVertical, X, BookOpen, User } from 'lucide-react';
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

export default function Layout({
  children,
  currentScreen,
  onNavigate,
  showTopNav = true,
  showBottomNav = true,
  title = 'Dreamcatcher',
  onClose
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
            {currentScreen !== 'login' && currentScreen !== 'onboarding' && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgTwOwZzYlw-RQnn4ffjAsh8pE-Qyko7dPD7wlQzbZrNw-6THndMw5gwjvrh9_qyZylsu4RtLB80dlWHD8UTEMFmY1d3xjkt_NcGuDpNB6Zyv2x4GQ5Im4Wi8HEL8dYDjINUrsogILR6f5SN8wV3bJd1EFq_xvlc0e8DG1mO4zcoouUalWKRj-3dD9BZmKkVpFEVc2w-DbZCctm7l_VGjrDNy8ZylePXs1z4sZVz24OHQ8BTJ79dLy3lweZmWA0q40hVMNobsaMW39"
                  alt="User profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
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
        <nav className="fixed bottom-0 w-full z-50 rounded-t-[2rem] bg-surface/80 backdrop-blur-xl flex justify-around items-center px-4 pb-8 pt-4 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => onNavigate('whisper')}
            className={`flex flex-col items-center justify-center transition-colors ${
              currentScreen === 'whisper' ? 'text-primary bg-primary/10 rounded-full px-4 py-1' : 'text-on-surface/40 hover:text-primary/80'
            }`}
          >
            <Mic size={24} className="mb-1" />
            <span className="font-sans text-[10px] font-medium tracking-wider uppercase">Whisper</span>
          </button>

          <button
            onClick={() => onNavigate('dreams-list')}
            className={`flex flex-col items-center justify-center transition-colors ${
              currentScreen === 'dreams-list' ? 'text-primary bg-primary/10 rounded-full px-4 py-1' : 'text-on-surface/40 hover:text-primary/80'
            }`}
          >
            <BookOpen size={24} className="mb-1" />
            <span className="font-sans text-[10px] font-medium tracking-wider uppercase">Dreams</span>
          </button>

          <button
            onClick={() => onNavigate('insights')}
            className={`flex flex-col items-center justify-center transition-colors ${
              currentScreen === 'insights' ? 'text-primary bg-primary/10 rounded-full px-4 py-1' : 'text-on-surface/40 hover:text-primary/80'
            }`}
          >
            <BarChart2 size={24} className="mb-1" />
            <span className="font-sans text-[10px] font-medium tracking-wider uppercase">Insights</span>
          </button>

          <button
            onClick={() => onNavigate('you')}
            className={`flex flex-col items-center justify-center transition-colors ${
              currentScreen === 'you' ? 'text-primary bg-primary/10 rounded-full px-4 py-1' : 'text-on-surface/40 hover:text-primary/80'
            }`}
          >
            <User size={24} className="mb-1" />
            <span className="font-sans text-[10px] font-medium tracking-wider uppercase">You</span>
          </button>
        </nav>
      )}
    </div>
  );
}
