import React, { useState } from 'react';
import { BOARD_PLAN_LAYOUT } from '../constants';
import { ArrowRight, Check, X, MousePointerClick, Eye, Info } from 'lucide-react';
import { playSound } from '../services/audioService';

interface GrammarBoardProps {
    addXp: (amount: number) => void;
}

export const GrammarBoard: React.FC<GrammarBoardProps> = ({ addXp }) => {
  const [revealed, setRevealed] = useState<number>(0);

  const steps = [
    { type: 'subject', rule: 'Subject Questions', ex: 'Who said that?', note: 'NO do/does/did' },
    { type: 'indirect', rule: 'Indirect Questions', ex: 'Do you know where he is?', note: 'Statement Order' },
    { type: 'preposition', rule: 'Prepositions', ex: 'What are you talking about?', note: 'Usually at the END' }
  ];

  const handleReveal = (idx: number) => {
      if (idx >= revealed) {
          setRevealed(idx + 1);
          playSound('success');
          addXp(25);
          if (idx === steps.length - 1) {
             (window as any).confetti({
                particleCount: 50,
                origin: { x: 0.5, y: 0.5 }
            }); 
          }
      }
  };

  return (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-3xl p-4 md:p-8 shadow-inner border-4 border-slate-300 dark:border-slate-700 flex flex-col relative overflow-hidden">
        {/* Board Frame Details */}
        <div className="absolute top-0 left-0 w-full h-4 bg-slate-300 dark:bg-slate-700"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
            <div className="w-1/3 h-2 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full z-10 relative">
            {/* Left: Lexis (Static for this view) */}
            <div className="hidden lg:block border-r-2 border-slate-300 dark:border-slate-600 pr-4 opacity-50 blur-[1px] select-none pointer-events-none">
                <h3 className={`text-xl font-bold font-display uppercase mb-4 ${BOARD_PLAN_LAYOUT.left.color}`}>
                    {BOARD_PLAN_LAYOUT.left.title}
                </h3>
                <div className="space-y-4 font-handwriting text-2xl text-slate-400 -rotate-1">
                    <p>put sb at ease</p>
                    <p>listen enthusiastically</p>
                    <p>ask appropriate questions</p>
                </div>
            </div>

            {/* Middle: Grammar (Active) */}
            <div className="col-span-1 flex flex-col items-center">
                <h3 className={`text-2xl font-bold font-display uppercase mb-8 ${BOARD_PLAN_LAYOUT.middle.color} flex items-center gap-2`}>
                    {BOARD_PLAN_LAYOUT.middle.title}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Interactive</span>
                </h3>

                <div className="space-y-6 w-full">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx}
                            onClick={() => handleReveal(idx)}
                            className={`
                                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform group
                                ${idx < revealed 
                                    ? 'bg-white dark:bg-slate-900 border-brand-500 opacity-100 shadow-xl scale-100' 
                                    : 'bg-slate-200 dark:bg-slate-800 border-dashed border-slate-400 opacity-60 hover:opacity-80 hover:scale-[1.02]'}
                            `}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg md:text-xl">{step.rule}</span>
                                {idx < revealed ? (
                                    <div className="bg-green-100 p-1 rounded-full">
                                        <Check className="text-green-600 w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="bg-slate-300 dark:bg-slate-700 p-1 rounded-full animate-pulse">
                                        <Eye className="text-slate-500 w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            
                            {idx < revealed ? (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                    <p className="text-brand-600 dark:text-brand-400 font-mono text-lg md:text-xl font-bold border-l-4 border-brand-500 pl-3 my-3">
                                        "{step.ex}"
                                    </p>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold flex items-center gap-1">
                                        <Info className="w-3 h-3"/> {step.note}
                                    </p>
                                </div>
                            ) : (
                                <div className="h-16 flex items-center justify-center text-slate-500 font-medium">
                                    <MousePointerClick className="w-4 h-4 mr-2" /> Click to Reveal (+25 XP)
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Upgrade Zone (Interactive) */}
            <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-slate-300 dark:border-slate-600 pt-8 lg:pt-0 lg:pl-4">
                <h3 className={`text-xl font-bold font-display uppercase mb-4 ${BOARD_PLAN_LAYOUT.right.color}`}>
                    {BOARD_PLAN_LAYOUT.right.title}
                </h3>
                <div 
                    className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800/30 hover:shadow-lg transition-all cursor-pointer interactive-hover"
                    onClick={() => { playSound('pop'); addXp(5); }}
                >
                    <p className="text-xs font-bold text-yellow-600 mb-4 uppercase flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Heard in class
                    </p>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="group bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 text-red-500 line-through decoration-2 opacity-70">
                                <X className="w-4 h-4" /> Who did say that?
                            </div>
                            <div className="flex items-center gap-2 text-green-600 font-bold mt-1">
                                <ArrowRight className="w-4 h-4" /> Who said that?
                            </div>
                        </div>
                        <div className="group bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 text-red-500 line-through decoration-2 opacity-70">
                                <X className="w-4 h-4" /> About what are you...
                            </div>
                            <div className="flex items-center gap-2 text-green-600 font-bold mt-1">
                                <ArrowRight className="w-4 h-4" /> What are you... about?
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs text-yellow-600/50 mt-2 font-bold uppercase">Tap for bonus XP</p>
                </div>
            </div>
        </div>
    </div>
  );
};