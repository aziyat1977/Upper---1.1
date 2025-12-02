import React, { useState, useEffect } from 'react';
import { CONVERSATION_PHRASES } from '../constants';
import { Phrase } from '../types';
import { playSound } from '../services/audioService';
import { Check, Info } from 'lucide-react';

interface VibeCardsProps {
    addXp: (amount: number) => void;
}

export const VibeCards: React.FC<VibeCardsProps> = ({ addXp }) => {
  const [phrases, setPhrases] = useState<Phrase[]>(CONVERSATION_PHRASES);
  const [assignments, setAssignments] = useState<Record<string, 'neutral' | 'green' | 'yellow' | 'red'>>({});
  const [completed, setCompleted] = useState(false);

  const cycleColor = (id: string) => {
    // Determine next state
    const current = assignments[id] || 'neutral';
    const map: Record<string, 'neutral' | 'green' | 'yellow' | 'red'> = {
        'neutral': 'green',
        'green': 'yellow',
        'yellow': 'red',
        'red': 'neutral'
    };
    const next = map[current];

    // Sound effect based on choice
    if (next === 'green') playSound('success');
    else if (next === 'red') playSound('error'); // distinct sound for bad vibes
    else playSound('pop');

    // Update state
    setAssignments(prev => ({ ...prev, [id]: next }));

    // XP Reward for first time interaction per card (simple logic)
    // In a real app we'd track "interactedIds" separately to prevent spamming XP
    addXp(5);
  };

  const getColorClass = (status: string) => {
    switch (status) {
      case 'green': return 'bg-accent-green text-white border-accent-green shadow-accent-green/30';
      case 'yellow': return 'bg-accent-yellow text-slate-900 border-accent-yellow shadow-accent-yellow/30';
      case 'red': return 'bg-accent-red text-white border-accent-red shadow-accent-red/30';
      default: return 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-500 hover:shadow-brand-500/20';
    }
  };

  const checkAnswers = () => {
      let correct = 0;
      let total = phrases.length;
      
      // Calculate score (simple simulation, assuming user should match the 'category' prop)
      phrases.forEach(p => {
          if (assignments[p.id] === p.category) correct++;
      });

      if (correct > 0) {
          addXp(correct * 10);
          playSound('levelUp');
          (window as any).confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
          });
          setCompleted(true);
      } else {
          playSound('error');
          alert("Try categorizing a few cards first!");
      }
  };

  return (
    <div className="w-full h-full p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h3 className="text-3xl font-display font-bold text-slate-800 dark:text-white">Vibe Check <span className="text-2xl">😎</span></h3>
            <p className="text-slate-500">Tap cards to categorize them. <span className="text-brand-500 font-bold">+5 XP per tap</span></p>
        </div>
        
        <div className="flex gap-2 text-sm font-bold bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="px-3 py-1.5 bg-accent-green text-white rounded-lg flex items-center gap-1"><Check className="w-3 h-3"/> Do it</span>
            <span className="px-3 py-1.5 bg-accent-yellow text-slate-900 rounded-lg">Careful</span>
            <span className="px-3 py-1.5 bg-accent-red text-white rounded-lg">Avoid</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-20">
        {phrases.map((phrase, idx) => {
          const status = assignments[phrase.id] || 'neutral';
          return (
            <button
              key={phrase.id}
              onClick={() => cycleColor(phrase.id)}
              className={`
                group relative p-6 rounded-2xl border-2 text-lg font-bold transition-all duration-200 
                transform hover:-translate-y-1 hover:shadow-xl active:scale-95 flex flex-col items-start text-left min-h-[140px] justify-between
                ${getColorClass(status)}
              `}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span className="leading-tight">{phrase.text}</span>
              
              <div className="w-full flex justify-between items-end mt-4">
                  {status !== 'neutral' ? (
                    <span className="text-xs font-mono uppercase tracking-wider opacity-90 font-bold bg-black/10 px-2 py-1 rounded">
                      {status === 'green' ? 'GOOD VIBE' : status === 'yellow' ? 'RISKY' : 'BAD VIBE'}
                    </span>
                  ) : (
                      <span className="text-xs text-slate-400 font-normal">Tap to sort</span>
                  )}
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Info className="w-5 h-5 opacity-50" />
                  </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Action Button for Checking */}
      <div className="fixed bottom-24 md:bottom-10 right-10 z-30">
        <button
            onClick={checkAnswers}
            className="bg-brand-600 text-white px-8 py-4 rounded-full font-black text-xl shadow-2xl hover:bg-brand-500 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 animate-bounce-short"
        >
            {completed ? 'Vibe Checked! 🎉' : 'Check Vibes ✨'}
        </button>
      </div>
    </div>
  );
};