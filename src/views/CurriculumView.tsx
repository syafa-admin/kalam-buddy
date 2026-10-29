import React, { useState } from 'react';
import { CURRICULUM_UNITS } from '../data/learningContent';
import { CurriculumUnit, UserLevel } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, Circle, Mic, BookOpen, Sparkles, Volume2, Award } from 'lucide-react';

interface CurriculumViewProps {
  onBack: () => void;
  onSelectUnit: (unit: CurriculumUnit) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onBack, onSelectUnit }) => {
  const { user } = useAuth();
  const { completedUnitIds, speakArabic } = useData();
  const [selectedLevelTab, setSelectedLevelTab] = useState<UserLevel>(user?.selectedLevel || 'beginner');

  const levelUnits = CURRICULUM_UNITS.filter((u) => u.level === selectedLevelTab);

  const completedInLevel = levelUnits.filter((u) => completedUnitIds.includes(u.id)).length;
  const progressPercent = Math.round((completedInLevel / levelUnits.length) * 100);

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Kurikulum PBA</h1>
          <p className="text-xs text-stone-500">Jalur belajar berbicara bertahap 15 Unit</p>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-stone-200/70 rounded-2xl">
        <button
          onClick={() => setSelectedLevelTab('beginner')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedLevelTab === 'beginner'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Level 1 — مبتدئ
        </button>
        <button
          onClick={() => setSelectedLevelTab('elementary')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedLevelTab === 'elementary'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Level 2 — أساسي
        </button>
        <button
          onClick={() => setSelectedLevelTab('intermediate')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedLevelTab === 'intermediate'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Level 3 — متوسط
        </button>
      </div>

      {/* Progress banner for active level */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-stone-800">
            Progres {selectedLevelTab === 'beginner' ? 'Level 1' : selectedLevelTab === 'elementary' ? 'Level 2' : 'Level 3'}
          </h3>
          <p className="text-[11px] text-stone-500">
            {completedInLevel} dari {levelUnits.length} unit selesai dipraktikkan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 sm:w-28 bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-800">{progressPercent}%</span>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {levelUnits.map((unit) => {
          const isCompleted = completedUnitIds.includes(unit.id);

          return (
            <div
              key={unit.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-stone-200/80 hover:border-emerald-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `U${unit.unitNumber}`}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Unit {unit.unitNumber}
                    </span>
                    <h3 className="font-bold text-base text-stone-900">{unit.title}</h3>
                  </div>
                </div>

                <span className="font-serif text-lg font-bold text-emerald-900" dir="rtl">
                  {unit.arabicTitle}
                </span>
              </div>

              {/* Objective */}
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                <strong>Tujuan:</strong> {unit.objective}
              </p>

              {/* Speaking Mission Box */}
              <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Misi Berbicara (Speaking Mission):</span>
                </div>
                <p className="text-stone-700">{unit.speakingMission}</p>
              </div>

              {/* Key Vocab pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                {unit.keyVocab.map((kv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  >
                    <span className="font-serif font-bold text-emerald-950" dir="rtl">
                      {kv.arabic}
                    </span>
                    <span className="text-stone-400 text-[10px]">({kv.translation})</span>
                    <button
                      onClick={() => speakArabic(kv.arabic)}
                      className="text-stone-400 hover:text-emerald-700 p-0.5 ml-0.5"
                      title="Dengar pelafalan"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  {isCompleted ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unit Selesai Dipraktikkan
                    </span>
                  ) : (
                    'Belum selesai'
                  )}
                </span>

                <button
                  onClick={() => onSelectUnit(unit)}
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Latihan Ulang' : 'Mulai Latihan Unit'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
