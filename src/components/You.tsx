import React from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Stars, Settings, LogOut, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface YouProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export default function You({ user, onLogout }: YouProps) {
  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
          Your Profile
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          The <span className="italic text-primary text-glow">Dreamer</span>
        </h1>
      </header>

      {/* Profile Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-high rounded-lg p-8 relative overflow-hidden bloom-glow border border-primary/10"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <User size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 p-1">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgTwOwZzYlw-RQnn4ffjAsh8pE-Qyko7dPD7wlQzbZrNw-6THndMw5gwjvrh9_qyZylsu4RtLB80dlWHD8UTEMFmY1d3xjkt_NcGuDpNB6Zyv2x4GQ5Im4Wi8HEL8dYDjINUrsogILR6f5SN8wV3bJd1EFq_xvlc0e8DG1mO4zcoouUalWKRj-3dD9BZmKkVpFEVc2w-DbZCctm7l_VGjrDNy8ZylePXs1z4sZVz24OHQ8BTJ79dLy3lweZmWA0q40hVMNobsaMW39"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="text-center">
            <h2 className="font-serif text-2xl text-on-surface">Dreamer #4209</h2>
            <p className="text-on-surface-variant text-sm opacity-60 italic">Sanctuary Member since 2026</p>
          </div>
        </div>
      </motion.section>

      {/* Preferences Section */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 flex flex-col gap-4"
        >
          <Calendar className="text-tertiary" size={24} />
          <div>
            <h3 className="text-xs font-sans uppercase tracking-widest text-on-surface/50 mb-1">Age</h3>
            <p className="text-xl font-serif text-on-surface">{user?.age || '24'}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 flex flex-col gap-4"
        >
          <Stars className="text-primary" size={24} />
          <div>
            <h3 className="text-xs font-sans uppercase tracking-widest text-on-surface/50 mb-1">Star Sign</h3>
            <p className="text-xl font-serif text-on-surface">{user?.starSign || 'Gemini'}</p>
          </div>
        </motion.div>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        <button className="w-full bg-surface-container-low p-4 rounded-lg border border-outline-variant/5 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
          <div className="flex items-center gap-4">
            <Settings size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Preferences</span>
          </div>
          <Shield size={16} className="text-on-surface-variant/30" />
        </button>

        <button 
          onClick={onLogout}
          className="w-full bg-surface-container-low/50 p-4 rounded-lg border border-outline-variant/5 flex items-center justify-between group hover:bg-error-container/10 transition-colors"
        >
          <div className="flex items-center gap-4">
            <LogOut size={20} className="text-on-surface-variant group-hover:text-error transition-colors" />
            <span className="text-sm font-medium group-hover:text-error transition-colors">Sign Out</span>
          </div>
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-on-surface-variant/30 uppercase tracking-[0.3em]">
          Lucid Interface v1.0.4
        </p>
      </div>
    </div>
  );
}
