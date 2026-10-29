import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SCENARIOS, CURRICULUM_UNITS } from '../data/learningContent';
import { 
  Mic, 
  Sparkles, 
  Clock, 
  Award, 
  Target, 
  BookOpen, 
  ChevronRight, 
  Volume2, 
  Bookmark, 
  History,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Scenario } from '../types';

interface DashboardViewProps {
  onNavigate: (view: string, params?: any) => void;
  onStartPractice: (mode: 'free_talk' | 'scenario' | 'curriculum', item?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onStartPractice }) => {
  const { user } = useAuth();
  const { 
    sessions, 
    vocabulary, 
    completedUnitIds, 
    totalPracticeSeconds, 
    todayPracticeMinutes, 
    dailyGoalProgressPct,
    speakArabic 
  } = useData();

  const totalMinutes = Math.round(totalPracticeSeconds / 60);
  const goalMinutes = user?.dailyGoalMinutes || 15;

  // Filter recommended scenarios (pick first 3 or based on level)
  const recommendedScenarios = SCENARIOS.slice(0, 3);
  const recentVocab = vocabulary.slice(0, 4);
  const recentSessions = sessions.slice(0, 3);

  const getLevelLabel = () => {
    switch (user?.selectedLevel) {
      case 'beginner':
        return 'Level 1 — مبتدئ (Pemula)';
      case 'elementary':
        return 'Level 2 — أساسي (Dasar)';
      case 'intermediate':
        return 'Level 3 — متوسط (Menengah)';
      default:
        return 'Level 1 — مبتdئ (Pemula)';
    }
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl">
        {/* Background Decorative Arabic Typography */}
        <div 
          className="absolute right-2 -bottom-4 text-emerald-700/20 text-8xl sm:text-9xl font-serif font-black select-none pointer-events-none"
          dir="rtl"
        >
          كَلَام
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-semibold backdrop-blur-md">
              {getLevelLabel()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            أَهْلًا وَسَهْلًا، {user?.displayName?.split(' ')[0] || 'Teman Belajar'}!
          </h1>
          <p className="text-sm text-emerald-100/80 mt-1 leading-relaxed">
            Siap berlatih berbicara bahasa Arab hari ini? Satu percakapan kecil setiap hari membangun kelancaran seumur hidup.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onStartPractice('free_talk')}
              className="inline-flex items-center gap-2.5 bg-white text-emerald-900 font-bold px-5 py-3 rounded-2xl shadow-lg hover:bg-stone-100 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <span>Mulai Berbicara Sekarang</span>
            </button>

            <button
              onClick={() => onNavigate('practice_modes')}
              className="inline-flex items-center gap-2 bg-emerald-900/60 hover:bg-emerald-900 text-white font-medium px-4 py-3 rounded-2xl border border-white/20 text-sm transition-all"
            >
              <span>Pilih Mode / Skenario</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Progress & Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Target */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Target Hari Ini</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {todayPracticeMinutes} <span className="text-xs font-normal text-stone-500">/ {goalMinutes} mnt</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-stone-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${dailyGoalProgressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">{dailyGoalProgressPct}% tercapai</span>
          </div>
        </div>

        {/* Total Practice Time */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Total Bicara</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {totalMinutes} <span className="text-xs font-normal text-stone-500">menit</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">Akumulasi seluruh sesi</p>
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Sesi Latihan</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {sessions.length} <span className="text-xs font-normal text-stone-500">kali</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">Percakapan dua arah</p>
          </div>
        </div>

        {/* Completed Units */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Unit Kurikulum</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {completedUnitIds.length} <span className="text-xs font-normal text-stone-500">/ 15</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">Unit kurikulum PBA</p>
          </div>
        </div>
      </div>

      {/* Recommended Scenarios Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base font-bold text-stone-900">Skenario Rekomendasi</h2>
            <p className="text-xs text-stone-500">Simulasi percakapan nyata sesuai situasi mahasiswa</p>
          </div>
          <button
            onClick={() => onNavigate('scenarios')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommendedScenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 font-medium text-[11px] text-stone-600">
                    {sc.category}
                  </span>
                  <span className="font-serif text-sm font-bold text-emerald-800" dir="rtl">
                    {sc.arabicTitle}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors mt-2">
                  {sc.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {sc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  Peran AI: <strong className="text-stone-700">{sc.aiRole}</strong>
                </span>
                <button
                  onClick={() => onStartPractice('scenario', sc)}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white transition-colors"
                  title="Mulai Skenario Ini"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary Snippet & Recent Practice History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recently Saved Vocabulary */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Kosakata Baru</h3>
                <p className="text-[11px] text-stone-500">Koleksi kata yang baru dipelajari</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('vocabulary')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Koleksi Lengkap ({vocabulary.length})
            </button>
          </div>

          {recentVocab.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400">
              Belum ada kosakata tersimpan. Kosakata dari percakapan akan muncul di sini.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentVocab.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 hover:bg-emerald-50/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-emerald-950" dir="rtl">
                        {word.arabic}
                      </span>
                      <button
                        onClick={() => speakArabic(word.arabic)}
                        className="text-stone-400 hover:text-emerald-700 p-0.5"
                        title="Dengarkan pelafalan"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">{word.translation}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                    {word.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Practice Sessions */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Riwayat Latihan</h3>
                <p className="text-[11px] text-stone-500">Catatan sesi berbicara terakhir</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Semua Riwayat
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400">
              Belum ada riwayat latihan. Klik tombol Mulai Berbicara untuk memulai sesi pertamamu!
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between"
                >
                  <div className="max-w-[70%]">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {session.title || 'Percakapan Bebas (Free Talk)'}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {session.summary || 'Latihan kelancaran berbahasa Arab.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>{session.fluencyScore || 80}%</span>
                    </div>
                    <span className="block text-[10px] text-stone-400 mt-1">
                      {Math.round(session.durationSeconds / 60)} menit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
