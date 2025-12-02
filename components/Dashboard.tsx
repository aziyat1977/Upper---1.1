import React from 'react';
import { LESSON_PLAN } from '../constants';
import { PersonalityType } from '../types';
import { VibeCards } from './VibeCards';
import { GrammarBoard } from './GrammarBoard';
import { SpeakingCorner } from './SpeakingCorner';
import { ChevronRight, ChevronLeft, Info, BrainCircuit, CheckCircle, Pencil, ThumbsUp, Star } from 'lucide-react';
import { playSound } from '../services/audioService';

interface DashboardProps {
    role: 'teacher' | 'student';
    personality: PersonalityType;
    currentStageIndex: number;
    setCurrentStageIndex: (index: number) => void;
    viewMode: 'lesson' | 'tool';
    addXp: (amount: number) => void;
}

const ExitTicket = ({ addXp }: { addXp: (n: number) => void }) => {
    const [usage, setUsage] = React.useState('');
    const [bestType, setBestType] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        playSound('click');
        setTimeout(() => {
            setSubmitted(true);
            playSound('levelUp');
            addXp(100);
            (window as any).confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto relative group">
                    <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping"></div>
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 relative z-10" />
                </div>
                <h2 className="text-4xl font-bold font-display text-brand-600 dark:text-brand-400 mb-2">Lesson Complete!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">Great job today. +100 XP Earned</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 w-full border-t-[12px] border-brand-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-9xl">🎫</span>
                </div>
                
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-700 pb-6 relative z-10">
                    <span className="text-5xl bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl shadow-sm">🎟️</span>
                    <div>
                        <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Exit Ticket</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Reflect to earn your final badge.</p>
                    </div>
                </div>

                <div className="space-y-8 relative z-10">
                    <div className="group">
                        <label htmlFor="usage-input" className="block text-xl font-bold mb-3 text-slate-700 dark:text-slate-200 group-focus-within:text-brand-600 transition-colors flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm">1</span>
                            This week I will use:
                        </label>
                        <div className="relative">
                            <input 
                                id="usage-input"
                                type="text" 
                                value={usage}
                                onChange={(e) => setUsage(e.target.value)}
                                placeholder="e.g., 'put someone at ease'"
                                disabled={isSubmitting}
                                className="w-full text-xl p-5 pl-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm focus:shadow-xl text-slate-900 dark:text-white disabled:opacity-70"
                            />
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-brand-500 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <Pencil className="w-5 h-5 animate-bounce" />
                            </div>
                        </div>
                    </div>

                    <div>
                         <label className="block text-xl font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm">2</span>
                            My best question type today:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup">
                            {['Subject', 'Indirect', 'Preposition'].map((type) => (
                                <label
                                    key={type}
                                    onClick={() => playSound('pop')}
                                    className={`relative cursor-pointer group p-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 select-none
                                        ${bestType === type 
                                            ? 'bg-brand-50 text-brand-700 border-brand-500 shadow-lg ring-2 ring-brand-500/20 dark:bg-brand-900/30 dark:text-brand-300 scale-[1.02]' 
                                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        } ${isSubmitting ? 'pointer-events-none opacity-80' : ''}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="bestType" 
                                        value={type} 
                                        checked={bestType === type}
                                        onChange={() => setBestType(type)}
                                        className="sr-only" 
                                        disabled={isSubmitting}
                                    />
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
                                        ${bestType === type ? 'border-brand-500 bg-brand-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-brand-400'}`}>
                                        {bestType === type && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
                                    </div>
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={!usage || !bestType || isSubmitting}
                        className={`w-full font-bold text-2xl py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl mt-4 transform flex items-center justify-center gap-3
                            ${isSubmitting 
                                ? 'bg-green-500 text-white scale-[1.02] shadow-green-500/30 cursor-default' 
                                : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-500/30 active:scale-[0.99] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <CheckCircle className="w-8 h-8 animate-bounce" />
                                <span>Saved!</span>
                            </>
                        ) : (
                            'Submit & Finish'
                        )}
                    </button>
                </div>
             </div>
        </div>
    );
}

export const Dashboard: React.FC<DashboardProps> = ({ role, personality, currentStageIndex, setCurrentStageIndex, viewMode, addXp }) => {
    
    // If we are in "Tool Mode", we override the lesson plan view entirely
    if (viewMode === 'tool') {
        return (
            <div className="flex flex-col h-full items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Speaking Practice</h2>
                    <p className="text-slate-500">Independent pronunciation and grammar checker</p>
                </div>
                <SpeakingCorner addXp={addXp} />
            </div>
        );
    }

    const currentStage = LESSON_PLAN[currentStageIndex];

    const renderContent = () => {
        switch (currentStage.type) {
            case 'lead-in':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in duration-500">
                        <h1 className="text-5xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600 mb-8 animate-pulse">
                            CRINGE DETECTOR
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                             {[1, 2, 3].map(i => (
                                 <div 
                                    key={i} 
                                    onClick={() => { playSound('click'); addXp(5); }}
                                    className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg hover:rotate-2 hover:scale-105 transition-all cursor-pointer group relative overflow-hidden border-4 border-transparent hover:border-brand-500"
                                >
                                    <img src={`https://picsum.photos/400/400?random=${i + 10}`} alt="Scenario" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity p-4 backdrop-blur-sm">
                                        Click to analyze Scenario {i}
                                    </div>
                                    <div className="absolute top-2 right-2 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        +5 XP
                                    </div>
                                 </div>
                             ))}
                        </div>
                        <p className="mt-8 text-2xl font-light text-slate-700 dark:text-slate-300">Pick ONE. Identify the misunderstanding.</p>
                    </div>
                );
            case 'vocabulary':
                return <VibeCards addXp={addXp} />;
            case 'grammar':
                return <GrammarBoard addXp={addXp} />;
            case 'task':
                return (
                    <div className="flex flex-col h-full gap-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl flex-shrink-0 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold font-display mb-2 flex items-center gap-3">
                                    🗺️ Cross-Cultural Survival Quest
                                </h2>
                                <p className="text-slate-300">Rules: Use 4 Green Phrases + 1 Indirect Q + 1 Prep Q</p>
                            </div>
                            <div className="hidden md:block">
                                <span className="bg-white/10 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" /> Reward: 100 XP
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-grow overflow-y-auto">
                             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-bold mb-4 text-brand-500">Mission Brief</h3>
                                <ul className="space-y-6 text-lg">
                                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-2xl">✈️</div>
                                        <div>
                                            <strong className="block text-slate-900 dark:text-white">Airport</strong>
                                            <span className="text-slate-600 dark:text-slate-400">Lost luggage. Make a polite complaint to the staff without getting angry.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg text-2xl">🏫</div>
                                        <div>
                                            <strong className="block text-slate-900 dark:text-white">New Class</strong>
                                            <span className="text-slate-600 dark:text-slate-400">First day. Establish shared interests with a stranger next to you.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg text-2xl">☕</div>
                                        <div>
                                            <strong className="block text-slate-900 dark:text-white">Café</strong>
                                            <span className="text-slate-600 dark:text-slate-400">They brought the wrong drink. Solve the misunderstanding politely.</span>
                                        </div>
                                    </li>
                                </ul>
                             </div>
                             <div className="flex flex-col gap-4">
                                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 flex gap-3">
                                    <ThumbsUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                                            {personality === PersonalityType.Introvert ? 'Introvert Strategy 🛡️' : personality === PersonalityType.Extrovert ? 'Extrovert Strategy ⚡' : 'Ambivert Strategy ⚖️'}
                                        </h4>
                                        <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                                            {personality === PersonalityType.Introvert && "Take 30 seconds to formulate your indirect question before approaching the counter. It gives you control."}
                                            {personality === PersonalityType.Extrovert && "Remember the 'Traffic Light' rule. Don't dominate the conversation. Force yourself to ask a question after every statement."}
                                            {personality === PersonalityType.Ambivert && "Read the room. If the other person is quiet, take the lead. If they are chatty, switch to active listening."}
                                        </p>
                                    </div>
                                </div>
                                <SpeakingCorner addXp={addXp} />
                             </div>
                        </div>
                    </div>
                );
            case 'feedback':
                return <ExitTicket addXp={addXp} />;
            default:
                return <div>Stage content loading...</div>;
        }
    };

    const nextStage = () => {
        if (currentStageIndex < LESSON_PLAN.length - 1) {
            playSound('click');
            setCurrentStageIndex(currentStageIndex + 1);
        }
    };

    const prevStage = () => {
        if (currentStageIndex > 0) {
            playSound('click');
            setCurrentStageIndex(currentStageIndex - 1);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Stage Progress Bar */}
            <div className="h-2 bg-slate-200 dark:bg-slate-800 w-full mb-6 rounded-full overflow-hidden relative group">
                <div 
                    className="h-full bg-brand-500 transition-all duration-500 ease-out relative"
                    style={{ width: `${((currentStageIndex + 1) / LESSON_PLAN.length) * 100}%` }}
                >
                     <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow relative overflow-y-auto scrollbar-hide">
                {renderContent()}
            </div>

            {/* Bottom Nav */}
            <div className="h-20 flex-shrink-0 flex justify-between items-center mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                 <div className="flex flex-col">
                    <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">{currentStage.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-mono uppercase">{currentStage.type}</span>
                        <span>{currentStage.duration} mins</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    {role === 'teacher' && (
                         <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800 text-sm font-bold">
                            <Info className="w-4 h-4" /> Teacher Mode Active
                         </div>
                    )}
                    
                    <button 
                        onClick={prevStage} 
                        disabled={currentStageIndex === 0}
                        className="p-4 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-200 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextStage}
                        disabled={currentStageIndex === LESSON_PLAN.length - 1}
                        className="px-8 py-4 rounded-full bg-brand-600 text-white font-bold text-lg hover:bg-brand-700 shadow-lg hover:shadow-brand-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        {currentStageIndex === LESSON_PLAN.length - 1 ? 'Finish' : 'Next Phase'} <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
            </div>
            
            {/* Teacher Drawer (Overlay if ICQs needed) */}
            {role === 'teacher' && (
                <div className="absolute bottom-24 left-0 bg-amber-50 dark:bg-amber-900/95 backdrop-blur-md p-5 rounded-r-xl border border-amber-200 dark:border-amber-700 shadow-2xl max-w-xs transform transition-transform animate-in slide-in-from-left-4 z-20">
                    <h4 className="font-bold text-amber-800 dark:text-amber-200 text-sm uppercase mb-3 flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4" /> ICQs (Check Understanding)
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-2 text-slate-800 dark:text-slate-200 leading-relaxed">
                        {currentStage.content.icqs.map((icq, i) => (
                            <li key={i}>{icq}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};