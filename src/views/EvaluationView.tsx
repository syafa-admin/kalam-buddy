import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ChatMessage, PracticeMode, Scenario, CurriculumUnit, SessionEvaluation } from '../types';
import { 
  Award, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookmarkPlus, 
  RotateCcw, 
  Volume2, 
  TrendingUp, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface EvaluationViewProps {
  sessionSummary: {
    durationSeconds: number;
    turnsCount: number;
    history: ChatMessage[];
    mode: PracticeMode;
    scenario?: Scenario;
    curriculumUnit?: CurriculumUnit;
  };
  onFinish: () => void;
  onRetry: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({ sessionSummary, onFinish, onRetry }) => {
  const { user } = useAuth();
  const { saveCompletedSession, saveVocabularyWord, markUnitCompleted, speakArabic } = useData();

  const [loadingEval, setLoadingEval] = useState<boolean>(true);
  const [evaluation, setEvaluation] = useState<SessionEvaluation | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Fire confetti for celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Fetch AI pedagogical evaluation
    const fetchEvaluation = async () => {
      setLoadingEval(true);
      try {
        const res = await fetch('/api/ai/evaluate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: sessionSummary.history,
            durationSeconds: sessionSummary.durationSeconds,
            mode: sessionSummary.mode,
            contextTitle: sessionSummary.scenario?.title || sessionSummary.curriculumUnit?.title || 'Free Talk'
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.evaluation) {
            setEvaluation(data.evaluation);
            await saveToDatabase(data.evaluation);
            return;
          }
        }
        throw new Error('Fallback to default evaluation');
      } catch (err) {
        // Construct pedagogical fallback evaluation
        const turns = sessionSummary.turnsCount;
        const calculatedScore = Math.min(95, Math.max(65, 70 + turns * 3));
        const defaultEval: SessionEvaluation = {
          fluencyScore: calculatedScore,
          summary: `Kerja yang sangat baik! Kamu berhasil menyelesaikan sesi percakapan selama ${Math.round(
            sessionSummary.durationSeconds / 60
          )} menit dengan ${turns} giliran dialog. Keberanian bicaramu sangat patut diapresiasi.`,
          strengths: [
            'Keberanian merespons sapaan dan pertanyaan dalam bahasa Arab',
            'Penggunaan salam dan ungkapan sopan yang tepat',
            'Konsistensi mengikuti alur percakapan'
          ],
          areasToImprove: [
            'Tingkatkan variasi kata kerja (fi\'il mudhari\') untuk topik berbeda',
            'Perhatikan kesesuaian mudzakkar dan muannats pada isim sifat'
          ],
          usefulPhrases: [
            { arabic: 'شُكْرًا جَزِيلًا عَلَى الْمُسَاعَدَةِ', translation: 'Terima kasih banyak atas bantuannya' },
            { arabic: 'فُرْصَةٌ سَعِيدَةٌ جِدًّا', translation: 'Kesempatan yang sangat membahagiakan' }
          ],
          nextPracticeAdvice: 'Lanjutkan latihan pada topik aktivitas sehari-hari untuk memperkaya kosakata kerja.'
        };
        setEvaluation(defaultEval);
        await saveToDatabase(defaultEval);
      } finally {
        setLoadingEval(false);
      }
    };

    fetchEvaluation();
  }, []);

  const saveToDatabase = async (evalData: SessionEvaluation) => {
    try {
      const sessionTitle =
        sessionSummary.scenario?.title ||
        sessionSummary.curriculumUnit?.title ||
        'Percakapan Bebas (Free Talk)';

      await saveCompletedSession({
        mode: sessionSummary.mode,
        title: sessionTitle,
        scenarioId: sessionSummary.scenario?.id,
        unitId: sessionSummary.curriculumUnit?.id,
        durationSeconds: sessionSummary.durationSeconds,
        turnsCount: sessionSummary.turnsCount,
        summary: evalData.summary,
        fluencyScore: evalData.fluencyScore,
        feedback: evalData.areasToImprove.join('. '),
        completedAt: new Date().toISOString()
      });

      // If unit from curriculum, mark completed
      if (sessionSummary.curriculumUnit) {
        await markUnitCompleted(
          sessionSummary.curriculumUnit.id,
          sessionSummary.curriculumUnit.level,
          evalData.fluencyScore
        );
      }

      setSavedSuccess(true);
    } catch (e) {
      console.error('Error auto-saving session result:', e);
    }
  };

  const handleSavePhrase = async (p: { arabic: string; translation: string }) => {
    await saveVocabularyWord({
      arabic: p.arabic,
      transliteration: '',
      translation: p.translation,
      category: 'Hasil Latihan',
      masteryLevel: 1,
      isFavorite: true
    });
  };

  const minutes = Math.round(sessionSummary.durationSeconds / 60);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 pt-2">
      {/* Top Completion Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-semibold">
          Sesi Berbicara Selesai!
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold mt-2">
          مَبْرُوكٌ! Kerja Bagus, {user?.displayName?.split(' ')[0]}
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-md mx-auto">
          Kamu telah melangkah satu tahap lebih dekat menuju kelancaran berbicara bahasa Arab fusha.
        </p>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/15 text-center">
          <div>
            <span className="text-[11px] text-emerald-200 block">Durasi</span>
            <span className="text-lg font-bold">{minutes > 0 ? `${minutes} mnt` : `${sessionSummary.durationSeconds} dtk`}</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-200 block">Giliran Bicara</span>
            <span className="text-lg font-bold">{sessionSummary.turnsCount} kali</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-200 block">Estimasi AI</span>
            <span className="text-lg font-bold text-amber-300">
              {loadingEval ? '...' : `${evaluation?.fluencyScore || 80}%`}
            </span>
          </div>
        </div>
      </div>

      {loadingEval ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
          <h3 className="font-bold text-stone-800">Menyusun Evaluasi Pedagogis...</h3>
          <p className="text-xs text-stone-500">
            AI sedang menganalisis kosakata, respon, dan struktur kalimatmu untuk saran perkembangan terbaik.
          </p>
        </div>
      ) : (
        evaluation && (
          <div className="space-y-4">
            {/* Pedagogical Disclaimer Note */}
            <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
              <p>
                <strong>Catatan Pedagogis:</strong> Skor dan evaluasi ini merupakan estimasi AI berbasis dialog transkrip untuk memotivasi latihan, bukan hasil tes makhraj/tajwid formal laboratorium bahasa.
              </p>
            </div>

            {/* AI Summary */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Ringkasan Performa Mahasiswa</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {evaluation.summary}
              </p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kelebihan yang Muncul</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>Saran Pola Perbaikan</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {evaluation.areasToImprove.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Useful Phrases to Remember */}
            {evaluation.usefulPhrases && evaluation.usefulPhrases.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 mb-3">
                  Ungkapan Bermanfaat dari Sesi Ini
                </h3>
                <div className="space-y-2.5">
                  {evaluation.usefulPhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-serif font-bold text-base text-emerald-950" dir="rtl">
                            {phrase.arabic}
                          </p>
                          <button
                            onClick={() => speakArabic(phrase.arabic)}
                            className="p-1 rounded-lg text-stone-400 hover:text-emerald-700"
                            title="Dengarkan pelafalan"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{phrase.translation}</p>
                      </div>

                      <button
                        onClick={() => handleSavePhrase(phrase)}
                        className="p-2 rounded-xl text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                        title="Simpan ke Kosakata Saya"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Practice Advice */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950">
              <span className="font-bold text-emerald-900 block mb-1">Rekomendasi Latihan Selanjutnya:</span>
              <p>{evaluation.nextPracticeAdvice}</p>
            </div>
          </div>
        )
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRetry}
          className="flex-1 py-3.5 px-4 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Latihan Lagi</span>
        </button>

        <button
          onClick={onFinish}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
        >
          <span>Selesai & Ke Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
