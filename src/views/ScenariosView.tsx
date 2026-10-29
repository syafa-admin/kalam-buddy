import React, { useState } from 'react';
import { SCENARIOS } from '../data/learningContent';
import { Scenario } from '../types';
import { Mic, ArrowLeft, ChevronDown, ChevronUp, Sparkles, User, Bot, Target, BookOpen, Volume2 } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ScenariosViewProps {
  onBack: () => void;
  onSelectScenario: (scenario: Scenario) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({ onBack, onSelectScenario }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { speakArabic } = useData();

  const categories = ['Semua', 'Sosial & Kampus', 'Akademik', 'Kehidupan Sehari-hari', 'Perjalanan', 'Kesehatan'];

  const filteredScenarios = selectedCategory === 'Semua'
    ? SCENARIOS
    : SCENARIOS.filter((s) => s.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Katalog Skenario Latihan</h1>
          <p className="text-xs text-stone-500">Pilih simulasi situasi percakapan nyata</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScenarios.map((sc) => {
          const isExpanded = expandedId === sc.id;

          return (
            <div
              key={sc.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {sc.category}
                  </span>
                  <span className="font-serif text-lg font-bold text-emerald-900" dir="rtl">
                    {sc.arabicTitle}
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900">{sc.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{sc.description}</p>

                {/* Role badges */}
                <div className="grid grid-cols-2 gap-2 mt-3.5 bg-stone-50 p-2.5 rounded-2xl border border-stone-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span><strong>Peranmu:</strong> {sc.userRole}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Bot className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span><strong>Peran AI:</strong> {sc.aiRole}</span>
                  </div>
                </div>

                {/* Target */}
                <div className="mt-3 flex items-start gap-1.5 text-xs text-stone-600">
                  <Target className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span><strong>Target:</strong> {sc.target}</span>
                </div>

                {/* Key vocabulary pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sc.keyVocabulary.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-100 font-serif text-xs font-semibold"
                      dir="rtl"
                    >
                      {word}
                    </span>
                  ))}
                </div>

                {/* Accordion for Helpful Phrases */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Kalimat Bantuan / Contoh Ungkapan
                    </h4>
                    {sc.helpfulPhrases.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-serif font-bold text-sm text-stone-900" dir="rtl">
                            {phrase.arabic}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">{phrase.indonesian}</p>
                        </div>
                        <button
                          onClick={() => speakArabic(phrase.arabic)}
                          className="p-1 rounded-lg text-stone-400 hover:text-emerald-700"
                          title="Dengarkan pelafalan"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleExpand(sc.id)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1"
                >
                  <span>{isExpanded ? 'Sembunyikan Bantuan' : 'Lihat Bantuan'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onSelectScenario(sc)}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Mulai Skenario</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
