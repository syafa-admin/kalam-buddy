import React from 'react';
import { Volume2, ShieldCheck, LogOut, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAdmin, isDemo, logout } = useAuth();

  const getLevelBadge = (level?: string) => {
    switch (level) {
      case 'beginner':
        return { label: 'مبتدئ (Pemula)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'elementary':
        return { label: 'أساسي (Dasar)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'intermediate':
        return { label: 'متوسط (Menengah)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: 'مبتدئ (Pemula)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
  };

  const badge = getLevelBadge(user?.selectedLevel);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <span className="font-serif font-bold text-lg leading-none" dir="rtl">
              ك
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-emerald-950 tracking-tight">Kalām Buddy</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                AI
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">AI Arabic Speaking Partner</p>
          </div>
        </button>

        {/* Right side controls */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level badge */}
            <button
              onClick={() => onNavigate('profile')}
              className={`hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.color} transition-all hover:opacity-90`}
              title="Ganti Level Belajar"
            >
              {badge.label}
            </button>

            {/* Admin Badge */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 hover:bg-purple-200 transition-colors"
                title="Buka Panel Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>Admin</span>
              </button>
            )}

            {/* Demo indicator */}
            {isDemo && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                MODE DEMO
              </span>
            )}

            {/* User Avatar / Profile link */}
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-all text-xs font-medium text-stone-700"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                {user.displayName.charAt(0) || 'U'}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">{user.displayName}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Keluar (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
