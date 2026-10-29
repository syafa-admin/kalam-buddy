import React from 'react';
import { Mic, MessageSquare, Layers, BookOpen, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface PracticeModesViewProps {
  onSelectMode: (mode: 'free_talk' | 'scenario' | 'curriculum') => void;
  onNavigate: (view: string) => void;
}

export const PracticeModesView: React.FC<PracticeModesViewProps> = ({ onSelectMode, onNavigate }) => {
  const { user } = useAuth();
  const { completedUnitIds } = useData();

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Pilih Mode Latihan</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Pilih metode interaksi yang sesuai dengan target belajar bahasa Arabmu hari ini.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mode 1: Free Talk */}
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200/80 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Spontan & Santai
              </span>
              <span className="font-serif text-lg font-bold text-emerald-950" dir="rtl">
                الْحِوَارُ الْحُرُّ
              </span>
            </div>

            <h2 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
              1. Free Talk
            </h2>

            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Bicara bebas tentang apa saja: perkenalan, kegiatan kampus, hobi, makanan kesukaan, atau rencana masa depan.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tanpa batasan skenario peran</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Menyesuaikan level ({user?.selectedLevel})</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Membangun keberanian berbicara spontan</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectMode('free_talk')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Mulai Free Talk</span>
          </button>
        </div>

        {/* Mode 2: Scenario Practice */}
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200/80 hover:border-teal-500 hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                8 Skenario Nyata
              </span>
              <span className="font-serif text-lg font-bold text-teal-950" dir="rtl">
                سِينِارِيُو الْمُحَاكَاةِ
              </span>
            </div>

            <h2 className="text-lg font-bold text-stone-900 group-hover:text-teal-800 transition-colors">
              2. Scenario Practice
            </h2>

            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Roleplay percakapan dengan peran tertentu: memesan makanan di restoran, belanja di pasar, bertanya arah, atau mencari buku di perpustakaan.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Peran pengguna & AI yang spesifik</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Target komunikasi & kosakata kunci</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Konteks peran terjaga selama percakapan</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('scenarios')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Pilih Kartu Skenario</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mode 3: Structured Curriculum */}
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200/80 hover:border-purple-500 hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                15 Unit Pembelajaran
              </span>
              <span className="font-serif text-lg font-bold text-purple-950" dir="rtl">
                الْمَنْهَجُ التَّدْرِيجِيُّ
              </span>
            </div>

            <h2 className="text-lg font-bold text-stone-900 group-hover:text-purple-800 transition-colors">
              3. Kurikulum PBA
            </h2>

            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Jalur belajar terstruktur dari Level 1 (Pemula), Level 2 (Dasar), hingga Level 3 (Menengah) dengan misi berbicara dan evaluasi.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-stone-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Materi ungkapan dan kosakata fokus</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Misi berbicara (Speaking Mission)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Terselesaikan: {completedUnitIds.length} / 15 unit</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('curriculum')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Buka Jalur Kurikulum</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
