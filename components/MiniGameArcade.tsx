
import React, { useState, useEffect, useRef } from 'react';
import { GameLevel, QuizQuestion } from '../types';
import { GAME_LEVELS } from '../constants';
import { playSound } from '../services/audioService';
import { X, Crown, Timer } from 'lucide-react';

interface ArcadeProps {
    addXp: (amount: number) => void;
    onExit: () => void;
}

// --- SHAPE ICONS FOR KAHOOT STYLE ---
const TriangleIcon = ({ className }: {className?: string}) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2L2 22h20L12 2z" />
    </svg>
);

const DiamondIcon = ({ className }: {className?: string}) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2l10 10-10 10L2 12z" />
    </svg>
);

const CircleIcon = ({ className }: {className?: string}) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const SquareIcon = ({ className }: {className?: string}) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="2" />
    </svg>
);

const KAHOOT_COLORS = [
    { bg: 'bg-[#e21b3c]', shadow: 'shadow-[#a0132b]', icon: TriangleIcon }, // Red
    { bg: 'bg-[#1368ce]', shadow: 'shadow-[#0d4a92]', icon: DiamondIcon }, // Blue
    { bg: 'bg-[#d89e00]', shadow: 'shadow-[#997000]', icon: CircleIcon },  // Yellow
    { bg: 'bg-[#26890c]', shadow: 'shadow-[#1a5e08]', icon: SquareIcon }   // Green
];

// ==========================================
// GAME: KAHOOT ARENA
// ==========================================
const KahootArena = ({ level, onComplete, onExit }: { level: GameLevel, onComplete: (score: number) => void, onExit: () => void }) => {
    const [qIndex, setQIndex] = useState(0);
    const [phase, setPhase] = useState<'GET_READY' | 'QUESTION' | 'FEEDBACK' | 'RESULTS'>('GET_READY');
    const [timer, setTimer] = useState(3);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    
    // Refs for safe timer management
    const timerIntervalRef = useRef<number | null>(null);

    const question = level.data.questions && level.data.questions[qIndex];

    // Safety check
    if (!question && phase !== 'RESULTS') {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-4 z-50">
                <h2 className="text-xl font-bold">Error loading question data</h2>
                <button onClick={onExit} className="px-4 py-2 bg-slate-700 rounded-lg">Return to Menu</button>
            </div>
        );
    }

    // Main Game Loop Timer
    useEffect(() => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        if (phase === 'GET_READY') {
            setTimer(3);
            timerIntervalRef.current = window.setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setPhase('QUESTION');
                        return 0;
                    }
                    if (prev === 2) playSound('click');
                    return prev - 1;
                });
            }, 1000);
        } else if (phase === 'QUESTION') {
            setTimer(question.timeLimit);
            timerIntervalRef.current = window.setInterval(() => {
                setTimer(prev => {
                    if (prev <= 0) {
                        handleTimeOut();
                        return 0;
                    }
                    if (prev <= 5.1 && prev > 4.9) playSound('click'); 
                    return Math.max(0, prev - 0.1);
                });
            }, 100);
        }

        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [phase, qIndex]); // Rely on phase changes to reset timers

    // Separate useEffect to catch timeout transition cleanly without circular dependency
    const handleTimeOut = () => {
        if (phase === 'QUESTION') {
            setSelectedOption(-1);
            setIsCorrect(false);
            setPointsEarned(0);
            setStreak(0);
            setPhase('FEEDBACK');
            playSound('error');
        }
    };

    const handleAnswer = (optionIndex: number) => {
        if (phase !== 'QUESTION') return;
        
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        setSelectedOption(optionIndex);
        const correct = optionIndex === question.correctIndex;
        setIsCorrect(correct);
        
        let pts = 0;
        if (correct) {
            const ratio = timer / question.timeLimit;
            const base = 1000 * ratio;
            pts = Math.round(base);
            if (pts < 500) pts = 500;
            
            if (streak > 2) pts += 100;
            if (streak > 4) pts += 200;
            
            if (question.isDoublePoints) pts *= 2;
            
            setPointsEarned(pts);
            setScore(s => s + pts);
            setStreak(s => s + 1);
            playSound('success');
        } else {
            setPointsEarned(0);
            setStreak(0);
            playSound('error');
        }

        setPhase('FEEDBACK');
    };

    const nextQuestion = () => {
        if (qIndex + 1 < level.data.questions.length) {
            setQIndex(q => q + 1);
            setPhase('GET_READY');
            setSelectedOption(null);
            setPointsEarned(0);
        } else {
            setPhase('RESULTS');
            playSound('levelUp');
            (window as any).confetti && (window as any).confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
    };

    const commonOverlayClass = "absolute inset-0 flex flex-col items-center justify-center w-full h-full animate-in fade-in z-20";

    if (phase === 'GET_READY') {
        return (
            <div className={`${commonOverlayClass} bg-[#46178f]`}>
                <h2 className="text-4xl text-white font-bold mb-8">Question {qIndex + 1}</h2>
                <div className="w-40 h-40 rounded-full border-8 border-white flex items-center justify-center bg-transparent relative">
                    <span className="text-8xl font-black text-white">{Math.ceil(timer)}</span>
                    <div className="absolute inset-0 border-8 border-white rounded-full animate-ping opacity-20"></div>
                </div>
                {question.isDoublePoints && (
                    <div className="mt-12 bg-black text-white px-8 py-4 rounded-xl text-2xl font-black animate-bounce flex items-center gap-2 border-2 border-white">
                        <span className="bg-brand-500 px-2 rounded text-sm">2x</span> DOUBLE POINTS
                    </div>
                )}
            </div>
        );
    }

    if (phase === 'RESULTS') {
        return (
            <div className={`${commonOverlayClass} bg-[#46178f] p-4 text-center`}>
                <h1 className="text-5xl font-black text-white mb-8">PODIUM</h1>
                
                <div className="flex items-end justify-center gap-4 mb-12 h-64 w-full max-w-lg">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-24 duration-700 delay-100 flex-1">
                        <div className="text-slate-300 font-bold mb-2 text-sm md:text-base">My Friend</div>
                        <div className="w-full h-32 bg-slate-400 rounded-t-lg flex items-center justify-center text-4xl shadow-lg border-t-4 border-slate-300">🥈</div>
                    </div>
                    {/* 1st Place */}
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-32 duration-700 flex-1">
                        <div className="text-yellow-300 font-bold mb-2 text-xl flex items-center gap-1"><Crown className="w-5 h-5"/> YOU</div>
                        <div className="w-full h-48 bg-yellow-400 rounded-t-lg flex items-center justify-center text-6xl shadow-xl border-t-4 border-yellow-200 relative overflow-hidden">
                            🥇
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                    {/* 3rd Place */}
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-16 duration-700 delay-200 flex-1">
                        <div className="text-orange-300 font-bold mb-2 text-sm md:text-base">Random NPC</div>
                        <div className="w-full h-24 bg-orange-600 rounded-t-lg flex items-center justify-center text-4xl shadow-lg border-t-4 border-orange-500">🥉</div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 w-full max-w-md">
                    <p className="text-slate-300 uppercase tracking-widest font-bold text-sm mb-2">Total Score</p>
                    <p className="text-6xl font-black text-white mb-6">{score}</p>
                    <button 
                        onClick={() => onComplete(score)}
                        className="bg-white text-slate-900 font-bold py-4 px-12 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 text-xl w-full"
                    >
                        Finish Quiz
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'FEEDBACK') {
        const bg = isCorrect ? 'bg-green-600' : 'bg-red-600';
        return (
            <div className={`${commonOverlayClass} ${bg} p-4`}>
                <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full animate-in zoom-in-50">
                    <h2 className={`text-4xl font-black mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                    </h2>
                    
                    {isCorrect ? (
                        <div className="flex flex-col items-center gap-2 mb-6">
                             <div className="text-6xl font-black text-slate-800">+{pointsEarned}</div>
                             {streak > 2 && <div className="text-orange-500 font-bold flex items-center gap-1">🔥 {streak} Streak Bonus!</div>}
                        </div>
                    ) : (
                        <div className="mb-6">
                            <p className="text-slate-500 mb-2">The correct answer was:</p>
                            <p className="text-xl font-bold text-slate-800">{question.options[question.correctIndex]}</p>
                        </div>
                    )}
                    
                    <button 
                        onClick={nextQuestion}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg"
                    >
                        Next
                    </button>
                </div>
                
                <div className="mt-12 text-white/80 font-bold text-xl">
                    Current Score: {score}
                </div>
            </div>
        );
    }

    // --- QUESTION PHASE ---
    const circumference = 283;
    const progress = Math.max(0, timer / question.timeLimit);
    const strokeDashoffset = circumference - (progress * circumference);
    
    return (
        <div className="absolute inset-0 flex flex-col h-full w-full bg-slate-100 dark:bg-slate-900 z-10 overflow-hidden">
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 shadow-sm z-20 flex-shrink-0 h-16">
                <div className="flex items-center gap-4">
                    <div className="text-xl font-black text-slate-400 uppercase tracking-tight">
                        {qIndex + 1} of {level.data.questions.length}
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg font-bold">
                    <span className="text-slate-900 dark:text-white">{score} Pts</span>
                </div>
            </div>

            {/* Split View: Question Area & Answer Area */}
            <div className="flex-grow flex flex-col min-h-0">
                
                {/* Question Area (Flexible, ~45% space) */}
                <div className="flex-[0.45] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900 relative gap-6">
                     {/* Visual Timer */}
                     <div className={`relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 transition-all duration-300 ${timer <= 5 ? 'scale-110' : ''}`}>
                         {timer <= 5 && (
                            <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></div>
                         )}
                         <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                             <circle 
                                cx="50" cy="50" r="45" 
                                className="stroke-slate-200 dark:stroke-slate-700 fill-none" 
                                strokeWidth="8"
                             />
                             <circle 
                                cx="50" cy="50" r="45" 
                                className={`fill-none transition-all duration-200 ease-linear ${
                                    timer <= 5 ? 'stroke-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'stroke-purple-600'
                                }`}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                             />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                             <span className={`text-2xl md:text-3xl font-black ${
                                 timer <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-white'
                             }`}>
                                 {Math.ceil(timer)}
                             </span>
                         </div>
                     </div>

                     {/* Text Content */}
                     <div className="relative w-full max-w-5xl flex items-center justify-center">
                        {question.isDoublePoints && (
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-bounce whitespace-nowrap">
                                2x POINTS
                            </div>
                        )}
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white leading-tight">
                            {question.text}
                        </h2>
                     </div>
                </div>

                {/* Answer Grid (Flexible, ~55% space) */}
                <div className="flex-[0.55] grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-slate-200 dark:bg-black/20 w-full max-w-[1920px] mx-auto">
                    {question.options.map((opt, idx) => {
                        const style = KAHOOT_COLORS[idx % 4];
                        const Icon = style.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`${style.bg} hover:brightness-110 active:scale-[0.98] transition-all rounded-lg md:rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center justify-center md:justify-start md:px-8 gap-2 md:gap-4 text-white relative group overflow-hidden w-full h-full px-2 py-2`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                                    <Icon className="w-full h-full fill-white drop-shadow-md" />
                                </div>
                                <span className="text-base md:text-xl lg:text-3xl font-bold drop-shadow-sm text-center md:text-left leading-tight w-full break-words">
                                    {opt}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// MAIN ARCADE COMPONENT
// ==========================================

export const MiniGameArcade: React.FC<ArcadeProps> = ({ addXp, onExit }) => {
    const [activeLevel, setActiveLevel] = useState<GameLevel | null>(null);
    const [gameState, setGameState] = useState<'MENU' | 'PLAYING'>('MENU');

    const handleLevelSelect = (level: GameLevel) => {
        setActiveLevel(level);
        setGameState('PLAYING');
        playSound('click');
    };

    const handleComplete = (score: number) => {
        setGameState('MENU');
        setActiveLevel(null);
        addXp(Math.floor(score / 10)); // Convert game score to XP
        playSound('levelUp');
    };

    const difficultyColor = (diff: string) => {
        switch(diff) {
            case 'EASY': return 'text-green-400';
            case 'MEDIUM': return 'text-yellow-400';
            case 'HARD': return 'text-orange-400';
            case 'INSANE': return 'text-red-500';
            default: return 'text-slate-400';
        }
    }

    return (
        <div className="w-full h-full bg-slate-950 text-white overflow-hidden flex flex-col relative font-sans">
            
            {/* Header */}
            {gameState === 'MENU' && (
                <div className="bg-[#46178f] p-4 shadow-lg z-20 flex justify-between items-center border-b border-[#2d0f5e] flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white text-[#46178f] p-2 rounded-lg font-black text-xl tracking-tight shadow-[0_4px_0_rgba(0,0,0,0.2)]">
                            K!
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Kahoot Arena</h1>
                            <p className="text-xs text-purple-200 font-bold opacity-80">30 CHALLENGES</p>
                        </div>
                    </div>
                    <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* MENU VIEW */}
            {gameState === 'MENU' && (
                <div className="flex-grow p-4 md:p-6 overflow-y-auto bg-[#f2f2f2] dark:bg-[#1f1f1f]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto pb-8">
                        {GAME_LEVELS.map((level) => (
                            <button 
                                key={level.id}
                                onClick={() => handleLevelSelect(level)}
                                className="group bg-white dark:bg-[#2d2d2d] rounded-lg shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200 overflow-hidden text-left flex flex-col h-48"
                            >
                                {/* Card Image / Banner */}
                                <div className="h-24 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                                     {/* Generative Pattern */}
                                     <div className={`absolute inset-0 opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.05)_10px,rgba(0,0,0,0.05)_20px)]`}></div>
                                     <div className={`absolute inset-0 opacity-80 bg-gradient-to-br ${
                                         level.difficulty === 'EASY' ? 'from-green-400 to-emerald-600' :
                                         level.difficulty === 'MEDIUM' ? 'from-yellow-400 to-orange-500' :
                                         level.difficulty === 'HARD' ? 'from-orange-500 to-red-600' : 'from-purple-600 to-indigo-900'
                                     }`}></div>
                                     
                                     <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                         15 Qs
                                     </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Level {level.number}</span>
                                            <span className={`text-[10px] font-black uppercase ${difficultyColor(level.difficulty)}`}>{level.difficulty}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 dark:text-white leading-tight line-clamp-2">{level.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-[#2d2d2d]"></div>
                                            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white dark:border-[#2d2d2d]"></div>
                                            <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white dark:border-[#2d2d2d]"></div>
                                        </div>
                                        <span className="text-xs text-slate-500 font-bold">+1.2k Plays</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* GAME VIEW */}
            {gameState === 'PLAYING' && activeLevel && (
                <div className="absolute inset-0 z-20 bg-[#46178f]">
                    <KahootArena 
                        level={activeLevel} 
                        onComplete={handleComplete} 
                        onExit={() => { setGameState('MENU'); setActiveLevel(null); }} 
                    />
                </div>
            )}
        </div>
    );
};
