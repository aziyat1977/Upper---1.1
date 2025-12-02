import React, { useEffect, useState } from 'react';
import { Badge, PlayerStats } from '../types';
import { Trophy, Star, Zap, Award } from 'lucide-react';

interface GamificationUIProps {
    stats: PlayerStats;
    newBadge: Badge | null;
    clearNewBadge: () => void;
}

export const GamificationUI: React.FC<GamificationUIProps> = ({ stats, newBadge, clearNewBadge }) => {
    const [prevXp, setPrevXp] = useState(stats.xp);
    const xpForNextLevel = stats.level * 100;
    const progressPercent = Math.min(100, (stats.xp % 100) / 100 * 100); // Simplified logic: every 100 xp is a level

    useEffect(() => {
        if (newBadge) {
            const timer = setTimeout(() => {
                clearNewBadge();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [newBadge, clearNewBadge]);

    return (
        <>
            {/* Top HUD */}
            <div className="fixed top-20 right-4 z-40 flex flex-col gap-2 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3 flex items-center gap-4 animate-in slide-in-from-right">
                    
                    {/* Level Badge */}
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
                            <span className="text-white font-black text-lg">{stats.level}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-white">
                            LVL
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="flex flex-col gap-1 min-w-[120px]">
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span>{stats.xp} XP</span>
                            <span className="text-brand-500">NEXT: {(stats.level) * 100}</span>
                        </div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-1000 ease-out relative"
                                style={{ width: `${(stats.xp % 100) || 5}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Streak (Optional) */}
                    <div className="flex flex-col items-center">
                        <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-slate-500">{stats.streak}</span>
                    </div>
                </div>
            </div>

            {/* Badge Popup */}
            {newBadge && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center transform animate-level-up relative overflow-hidden max-w-sm">
                        <div className="absolute inset-0 bg-yellow-400/10 animate-pulse"></div>
                        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl border-4 border-yellow-400 shadow-inner">
                            {newBadge.icon}
                        </div>
                        <h2 className="text-3xl font-black font-display text-slate-800 dark:text-white mb-2">BADGE UNLOCKED!</h2>
                        <h3 className="text-xl font-bold text-brand-600 dark:text-brand-400 mb-2">{newBadge.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{newBadge.description}</p>
                    </div>
                </div>
            )}
        </>
    );
};