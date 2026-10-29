import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PracticeSession } from '../types';
import { History, Clock, Sparkles, MessageSquare, Calendar, ChevronDown, ChevronUp, Layers, BookOpen } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { sessions } = useData();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'scenario':
        return <Layers className="w-4 h-4 text-teal-600" />;
      case 'curriculum':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Riwayat Sesi Latihan</h1>
        <p className="text-xs text-stone-500">
          Daftar seluruh percakapan bahasa Arab yang telah kamu selesaikan
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80">
          <History className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-bold text-stone-800 text-sm">Belum Ada Riwayat Sesi</h3>
          <p className="text-xs text-stone-500 mt-1">
            Mulailah berbicara di menu Latihan untuk merekam perkembangan bicaramu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-all"
              >
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getModeIcon(session.mode)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{session.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {formatDate(session.completedAt || session.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {Math.round(session.durationSeconds / 60)} menit
                        </span>
                        <span>{session.turnsCount} giliran dialog</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>{session.fluencyScore || 80}%</span>
                      </span>
                    </div>
                    <div className="text-stone-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-2">
                    {session.summary && (
                      <div>
                        <span className="font-bold text-stone-700 block mb-0.5">Ringkasan AI:</span>
                        <p className="text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                          {session.summary}
                        </p>
                      </div>
                    )}
                    {session.feedback && (
                      <div>
                        <span className="font-bold text-stone-700 block mb-0.5">Catatan Perbaikan:</span>
                        <p className="text-stone-600 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-amber-950">
                          {session.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
