import React from 'react';
import { Home, Mic, BookmarkCheck, TrendingUp, User, Sparkles } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'practice_modes', label: 'Latihan', icon: Mic, highlight: true },
    { id: 'vocabulary', label: 'Kosakata', icon: BookmarkCheck },
    { id: 'progress', label: 'Progres', icon: TrendingUp },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2 px-3 shadow-lg max-w-lg mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-5xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="relative -top-4 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-emerald-700/30'
                      : 'bg-emerald-700 text-white shadow-emerald-800/25'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 mt-1">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all focus:outline-none ${
                isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] leading-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
