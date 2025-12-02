

import React, { useState, useEffect } from 'react';
import { PersonalityType, DeviceView, PlayerStats, Badge } from './types';
import { Dashboard } from './components/Dashboard';
import { GamificationUI } from './components/GamificationUI';
import { MiniGameArcade } from './components/MiniGameArcade';
import { LESSON_PLAN } from './constants';
import { playSound } from './services/audioService';
import { 
  Monitor, Smartphone, Tablet, Projector, 
  Moon, Sun, GraduationCap, User, 
  BookOpen, MessageCircle, Mic, BrainCircuit, CheckCircle, Gamepad2
} from 'lucide-react';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [device, setDevice] = useState<DeviceView>(DeviceView.Desktop);
  
  // Navigation State
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'lesson' | 'tool' | 'arcade'>('lesson');
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [personality, setPersonality] = useState<PersonalityType>(PersonalityType.Ambivert);

  // Gamification State
  const [stats, setStats] = useState<PlayerStats>({
      xp: 0,
      level: 1,
      streak: 1,
      badges: []
  });
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addXp = (amount: number) => {
      setStats(prev => {
          const newXp = prev.xp + amount;
          const currentLevel = Math.floor(newXp / 100) + 1;
          
          if (currentLevel > prev.level) {
              playSound('levelUp');
              // Trigger Confetti for Level Up
              (window as any).confetti && (window as any).confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.5 }
              });
          }

          return {
              ...prev,
              xp: newXp,
              level: currentLevel
          };
      });

      // Simple Badge Logic
      if (stats.xp + amount >= 50 && !stats.badges.find(b => b.id === 'novice')) {
          unlockBadge({ id: 'novice', name: 'Rookie Talker', icon: '🐣', description: 'Earned 50 XP', unlocked: true });
      }
      if (stats.xp + amount >= 200 && !stats.badges.find(b => b.id === 'pro')) {
          unlockBadge({ id: 'pro', name: 'Chat Master', icon: '🎤', description: 'Earned 200 XP', unlocked: true });
      }
      if (stats.xp + amount >= 500 && !stats.badges.find(b => b.id === 'arcade')) {
          unlockBadge({ id: 'arcade', name: 'Arcade Legend', icon: '🕹️', description: 'Earned 500 XP', unlocked: true });
      }
  };

  const unlockBadge = (badge: Badge) => {
      setStats(prev => ({ ...prev, badges: [...prev.badges, badge] }));
      setNewBadge(badge);
      playSound('success');
  };

  const getContainerWidth = () => {
    switch (device) {
      case DeviceView.Mobile: return 'max-w-[375px] border-x-8 border-y-[40px] rounded-[3rem]';
      case DeviceView.Tablet: return 'max-w-[768px] border-x-[12px] border-y-[12px] rounded-[2rem]';
      case DeviceView.Desktop: return 'max-w-full';
      case DeviceView.SmartBoard: return 'max-w-full text-xl';
      default: return 'max-w-full';
    }
  };

  const handleStageClick = (index: number) => {
    setCurrentStageIndex(index);
    setViewMode('lesson');
    playSound('click');
  };

  const handleToolClick = () => {
    setViewMode('tool');
    playSound('click');
  };
  
  const handleArcadeClick = () => {
    setViewMode('arcade');
    playSound('click');
  };

  return (
    <div className={`h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-100'} overflow-hidden flex flex-col`}>
      
      {/* Gamification HUD */}
      <GamificationUI stats={stats} newBadge={newBadge} clearNewBadge={() => setNewBadge(null)} />

      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-brand-600 text-white font-black font-display text-xl p-2 rounded-lg tracking-tighter shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform cursor-pointer" onClick={() => playSound('pop')}>
            TBL
          </div>
          <h1 className="hidden md:block font-bold text-slate-700 dark:text-slate-200">Unit 1.1 Conversation</h1>
        </div>

        {/* Device Toggles (Hidden on small screens) */}
        <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            {[
                { type: DeviceView.Mobile, icon: Smartphone },
                { type: DeviceView.Tablet, icon: Tablet },
                { type: DeviceView.Desktop, icon: Monitor },
                { type: DeviceView.SmartBoard, icon: Projector },
            ].map((d) => (
                <button
                    key={d.type}
                    onClick={() => { setDevice(d.type); playSound('click'); }}
                    className={`p-2 rounded-md transition-all ${device === d.type ? 'bg-white dark:bg-slate-700 shadow text-brand-500' : 'text-slate-400 hover:text-slate-600'}`}
                    title={d.type}
                >
                    <d.icon className="w-5 h-5" />
                </button>
            ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
            {/* Personality Selector */}
            <select 
                value={personality}
                onChange={(e) => { setPersonality(e.target.value as PersonalityType); playSound('click'); }}
                className="bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 outline-none focus:border-brand-500 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
            >
                <option value={PersonalityType.Extrovert}>Extrovert</option>
                <option value={PersonalityType.Introvert}>Introvert</option>
                <option value={PersonalityType.Ambivert}>Ambivert</option>
            </select>

            {/* Role Toggle */}
            <button
                onClick={() => { setIsTeacherMode(!isTeacherMode); playSound('pop'); }}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold transition-all border hover:scale-105 active:scale-95 ${
                    isTeacherMode 
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700' 
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}
            >
                {isTeacherMode ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span className="hidden sm:inline">{isTeacherMode ? 'Teacher' : 'Student'}</span>
            </button>

            {/* Dark Mode */}
            <button 
                onClick={() => { setDarkMode(!darkMode); playSound('click'); }}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors transform hover:rotate-12"
            >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
        </div>
      </nav>

      {/* Main Navigation Menu (Direct Links) */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide shadow-sm sticky top-0 z-30 flex-shrink-0">
        {LESSON_PLAN.map((stage, index) => {
            const isActive = viewMode === 'lesson' && currentStageIndex === index;
            const icons = [BrainCircuit, BookOpen, MessageCircle, User, CheckCircle];
            const Icon = icons[index % icons.length];

            return (
                <button
                    key={stage.id}
                    onClick={() => handleStageClick(index)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0
                        ${isActive 
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 transform scale-105 ring-2 ring-brand-300 dark:ring-brand-900' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600'
                        }`}
                >
                    <Icon className="w-4 h-4" />
                    {index + 1}. {stage.title.split(':')[0]}
                </button>
            )
        })}

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2 flex-shrink-0"></div>

        <button
            onClick={handleToolClick}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 group
                ${viewMode === 'tool'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20 transform scale-105 ring-2 ring-rose-300 dark:ring-rose-900' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600'
                }`}
        >
            <Mic className="w-4 h-4 group-hover:animate-pulse" />
            Speaking Tool
        </button>

        <button
            onClick={handleArcadeClick}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 group
                ${viewMode === 'arcade'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 transform scale-105 ring-2 ring-purple-300 dark:ring-purple-900' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600'
                }`}
        >
            <Gamepad2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Games
        </button>
      </div>

      {/* Main App Container */}
      <main className="flex-grow flex justify-center p-4 md:p-8 overflow-hidden bg-slate-50 dark:bg-black/20">
        <div 
            className={`bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border-slate-300 dark:border-slate-800 relative flex flex-col transition-all duration-500 ease-in-out ${getContainerWidth()} w-full flex-shrink-0`}
            style={{ 
                height: device === DeviceView.Mobile ? '812px' : device === DeviceView.Tablet ? '1024px' : '100%' 
            }}
        >
            {/* Device Frame Decorations */}
            {(device === DeviceView.Mobile || device === DeviceView.Tablet) && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-50 pointer-events-none"></div>
            )}

            <div className={`flex-grow ${viewMode === 'arcade' ? 'p-0' : 'p-6 md:p-10'} h-full overflow-hidden`}>
                {viewMode === 'lesson' && (
                    <Dashboard 
                        role={isTeacherMode ? 'teacher' : 'student'} 
                        personality={personality} 
                        currentStageIndex={currentStageIndex}
                        setCurrentStageIndex={(idx) => { setCurrentStageIndex(idx); playSound('click'); }}
                        viewMode='lesson'
                        addXp={addXp}
                    />
                )}
                {viewMode === 'tool' && (
                    <Dashboard 
                        role={isTeacherMode ? 'teacher' : 'student'} 
                        personality={personality} 
                        currentStageIndex={currentStageIndex}
                        setCurrentStageIndex={(idx) => { setCurrentStageIndex(idx); playSound('click'); }}
                        viewMode='tool'
                        addXp={addXp}
                    />
                )}
                {viewMode === 'arcade' && (
                    <MiniGameArcade addXp={addXp} onExit={() => setViewMode('lesson')} />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
