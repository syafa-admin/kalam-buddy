import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CURRICULUM_UNITS } from '../data/learningContent';
import { TrendingUp, Award, Clock, BookOpen, BookmarkCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const ProgressView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { sessions, vocabulary, completedUnitIds, totalPracticeSeconds } = useData();

  const totalMinutes = Math.round(totalPracticeSeconds / 60);
  const totalUnits = CURRICULUM_UNITS.length;
  const overallUnitPercent = Math.round((completedUnitIds.length / totalUnits) * 100);

  // Group units by level
  const level1Units = CURRICULUM_UNITS.filter((u) => u.level === 'beginner');
  const level2Units = CURRICULUM_UNITS.filter((u) => u.level === 'elementary');
  const level3Units = CURRICULUM_UNITS.filter((u) => u.level === 'intermediate');

  const l1Completed = level1Units.filter((u) => completedUnitIds.includes(u.id)).length;
  const l2Completed = level2Units.filter((u) => completedUnitIds.includes(u.id)).length;
  const l3Completed = level3Units.filter((u) => completedUnitIds.includes(u.id)).length;

  return (
    <div className="space-y-6 pb-24 pt-2">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Progres Belajar Berbicara</h1>
        <p className="text-xs text-stone-500">
          Statistik komprehensif perkembangan kemahiran bahasa Arab (Maharah Kalam)
        </p>
      </div>

      {/* Main Progress Summary Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              Mahasiswa: {user?.displayName}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-2">
              Kemajuan Kurikulum: {overallUnitPercent}%
            </h2>
            <p className="text-xs text-emerald-100/80 mt-1">
              {completedUnitIds.length} dari {totalUnits} unit pembelajaran telah berhasil dipraktikkan.
            </p>
          </div>

          <div className="w-20 h-20 rounded-full border-4 border-emerald-400/40 border-t-white flex items-center justify-center font-bold text-xl shrink-0 self-center">
            {overallUnitPercent}%
          </div>
        </div>

        {/* Level Breakdown Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-emerald-200 font-semibold block">Level 1 — مبتدئ</span>
            <span className="text-base font-bold">{l1Completed} / {level1Units.length} Unit</span>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-300 h-full rounded-full"
                style={{ width: `${Math.round((l1Completed / level1Units.length) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-emerald-200 font-semibold block">Level 2 — أساسي</span>
            <span className="text-base font-bold">{l2Completed} / {level2Units.length} Unit</span>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-300 h-full rounded-full"
                style={{ width: `${Math.round((l2Completed / level2Units.length) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-emerald-200 font-semibold block">Level 3 — متوسط</span>
            <span className="text-base font-bold">{l3Completed} / {level3Units.length} Unit</span>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-teal-300 h-full rounded-full"
                style={{ width: `${Math.round((l3Completed / level3Units.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Milestones */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Lencana Pencapaian Belajar</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-4 rounded-2xl border text-center ${
            sessions.length >= 1 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold">Langkah Awal</h4>
            <p className="text-[10px] mt-0.5">Selesaikan sesi 1</p>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            totalMinutes >= 15 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold">Konsisten Bicara</h4>
            <p className="text-[10px] mt-0.5">Capai 15 menit</p>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            vocabulary.length >= 5 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold">Kolektor Kata</h4>
            <p className="text-[10px] mt-0.5">Simpan 5 kata</p>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            completedUnitIds.length >= 3 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold">Khatam Unit</h4>
            <p className="text-[10px] mt-0.5">Selesaikan 3 unit</p>
          </div>
        </div>
      </div>

      {/* Direct Curriculum Link CTA */}
      <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between">
        <div className="text-xs text-stone-700">
          <strong className="block text-stone-900">Ingin melanjutkan unit kurikulum berikutnya?</strong>
          Setiap unit dirancang untuk mengasah maharah kalam secara terstruktur.
        </div>
        <button
          onClick={() => onNavigate('curriculum')}
          className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 ml-3"
        >
          Buka Kurikulum
        </button>
      </div>
    </div>
  );
};
