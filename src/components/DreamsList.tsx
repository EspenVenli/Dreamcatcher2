import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Calendar, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { Dream } from '../types';

interface DreamsListProps {
  onSelectDream: (dream: Dream) => void;
}

export default function DreamsList({ onSelectDream }: DreamsListProps) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dreams')
      .then(res => res.json())
      .then(data => {
        setDreams(data);
        setLoading(false);
      });
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-primary"
        >
          <Moon size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-32 px-6 max-w-md mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-primary font-sans text-xs uppercase tracking-widest opacity-80">
          Your Sanctuary
        </span>
        <h1 className="font-serif text-4xl text-on-surface leading-tight">
          Archived <span className="italic text-primary text-glow">Journeys</span>
        </h1>
      </header>

      <div className="space-y-4">
        {dreams.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Moon size={48} className="mx-auto mb-4" />
            <p className="font-serif italic">No dreams captured yet...</p>
          </div>
        ) : (
          dreams.map((dream) => (
            <motion.div
              key={dream.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDream(dream)}
              className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/10 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Moon size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-on-surface group-hover:text-primary transition-colors">
                    {dream.title || 'Untitled Dream'}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-on-surface-variant uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {dream.date}
                    </span>
                    {dream.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatDuration(dream.duration)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-on-surface-variant/40 group-hover:text-primary transition-colors" size={20} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
