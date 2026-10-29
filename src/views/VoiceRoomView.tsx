import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useVoiceChat } from '../hooks/useVoiceChat';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { Scenario, CurriculumUnit, PracticeMode, ChatMessage } from '../types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  PhoneOff, 
  RotateCcw, 
  Send, 
  BookmarkPlus, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Info,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface VoiceRoomViewProps {
  mode: PracticeMode;
  scenario?: Scenario;
  curriculumUnit?: CurriculumUnit;
  onEndSession: (sessionSummary: {
    durationSeconds: number;
    turnsCount: number;
    history: ChatMessage[];
    mode: PracticeMode;
    scenario?: Scenario;
    curriculumUnit?: CurriculumUnit;
  }) => void;
  onCancel: () => void;
}

export const VoiceRoomView: React.FC<VoiceRoomViewProps> = ({
  mode,
  scenario,
  curriculumUnit,
  onEndSession,
  onCancel
}) => {
  const { user } = useAuth();
  const { saveVocabularyWord, speakArabic } = useData();
  const [manualInput, setManualInput] = useState<string>('');
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    voiceState,
    messages,
    errorMsg,
    isMuted,
    audioLevel,
    durationSeconds,
    interimTranscript,
    startSession,
    toggleMute,
    endSession,
    submitManualSpeech,
    repeatAiSpeech,
    resetSession
  } = useVoiceChat({
    user: user!,
    mode,
    scenario,
    curriculumUnit,
    onSessionComplete: (data) => {
      onEndSession({
        ...data,
        mode,
        scenario,
        curriculumUnit
      });
    }
  });

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setHasStarted(true);
    startSession();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    submitManualSpeech(manualInput.trim());
    setManualInput('');
  };

  const handleSaveVocab = async (item: { arabic: string; translation: string }, msgId: string) => {
    const key = `${msgId}_${item.arabic}`;
    if (savedWordIds.has(key)) return;

    await saveVocabularyWord({
      arabic: item.arabic,
      transliteration: '',
      translation: item.translation,
      category: mode === 'scenario' ? scenario?.title || 'Skenario' : 'Percakapan',
      masteryLevel: 1,
      isFavorite: false
    });

    setSavedWordIds((prev) => new Set(prev).add(key));
  };

  const getSessionTitle = () => {
    if (mode === 'scenario' && scenario) return scenario.title;
    if (mode === 'curriculum' && curriculumUnit) return curriculumUnit.title;
    return 'Free Talk (Percakapan Bebas)';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-4xl mx-auto pb-4 pt-1">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-white rounded-2xl border border-stone-200 shadow-xs mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-bold text-stone-900 truncate max-w-[200px] sm:max-w-xs">
                {getSessionTitle()}
              </h2>
            </div>
            <p className="text-[11px] text-stone-500">
              {mode === 'scenario' ? `Peran: ${scenario?.userRole}` : 'Latihan Percakapan Bahasa Arab'}
            </p>
          </div>
        </div>

        {/* Timer & Level */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full font-mono text-xs font-bold text-stone-700">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>{formatTimer(durationSeconds)}</span>
          </div>

          {hasStarted && (
            <button
              onClick={endSession}
              className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Akhiri Sesi</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Call Area */}
      {!hasStarted ? (
        /* Pre-Call Setup Card */
        <div className="my-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Mic className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-stone-900">Mulai Percakapan Suara Real-Time</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Kalām Buddy akan berbicara kepadamu dalam bahasa Arab fusha. Siapkan suaramu dan jangan takut melakukan kesalahan!
          </p>

          {/* Scenario info if active */}
          {mode === 'scenario' && scenario && (
            <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1">
              <p className="font-bold text-stone-800">Peran Anda: <span className="text-emerald-800">{scenario.userRole}</span></p>
              <p className="font-bold text-stone-800">Peran AI: <span className="text-teal-800">{scenario.aiRole}</span></p>
              <p className="text-stone-600">Target: {scenario.target}</p>
            </div>
          )}

          {/* Microphone permission notice */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900 text-left flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <p>
              Aplikasi ini membutuhkan izin mikrofon agar kamu dapat berbicara langsung. Suara percakapan diolah secara real-time demi kelancaran latihanmu.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={onCancel}
              className="py-3 px-5 rounded-2xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50"
            >
              Batal
            </button>
            <button
              onClick={handleStartCall}
              className="py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Izinkan Mic & Mulai Berbicara</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Call Interface */
        <div className="flex-1 flex flex-col bg-stone-100 rounded-3xl border border-stone-200 overflow-hidden shadow-inner">
          {/* Visualizer Header */}
          <div className="bg-white border-b border-stone-200 py-2 px-4 shrink-0 shadow-xs">
            <AudioVisualizer state={voiceState} audioLevel={audioLevel} isMuted={isMuted} />
          </div>

          {/* Conversation Transcript Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.role === 'model';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] font-semibold text-stone-400 mb-1 px-1">
                    {isAi ? 'Kalām Buddy (AI Partner)' : user?.displayName || 'Kamu'}
                  </span>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-sm transition-all ${
                      isAi
                        ? 'bg-white text-stone-900 border border-stone-200/80 rounded-tl-sm'
                        : 'bg-emerald-700 text-white rounded-tr-sm'
                    }`}
                  >
                    {/* Arabic Text */}
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`font-serif text-lg sm:text-xl font-bold leading-relaxed tracking-wide ${
                          isAi ? 'text-emerald-950' : 'text-white'
                        }`}
                        dir="rtl"
                      >
                        {msg.text}
                      </p>

                      {isAi && (
                        <button
                          onClick={() => repeatAiSpeech(msg.text)}
                          className="p-1 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-stone-100 transition-colors shrink-0"
                          title="Dengarkan Ulang Pelafalan"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Transliteration if available */}
                    {isAi && msg.transliteration && (
                      <p className="text-[11px] text-stone-500 italic mt-1 font-mono">
                        {msg.transliteration}
                      </p>
                    )}

                    {/* Indonesian Translation if user enabled */}
                    {isAi && msg.translation && (
                      <p className="text-xs text-stone-600 mt-1.5 pt-1.5 border-t border-stone-100">
                        {msg.translation}
                      </p>
                    )}

                    {/* Friendly Polite Correction Box */}
                    {isAi && msg.correction?.hasCorrection && (
                      <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Saran Ungkapan Alami:</span>
                        </div>
                        {msg.correction.userMistake && (
                          <p className="text-[11px] text-stone-600">
                            Terdengar: <span className="line-through">{msg.correction.userMistake}</span>
                          </p>
                        )}
                        <p className="font-bold text-emerald-900 font-serif text-sm" dir="rtl">
                          {msg.correction.betterPhrasing}
                        </p>
                        <p className="text-[11px] text-stone-600 leading-normal">
                          {msg.correction.explanation}
                        </p>
                      </div>
                    )}

                    {/* Vocabulary help pill inside bubble */}
                    {isAi && msg.vocabularyHelps && msg.vocabularyHelps.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                        {msg.vocabularyHelps.map((vh, vIdx) => {
                          const isSaved = savedWordIds.has(`${msg.id}_${vh.arabic}`);
                          return (
                            <button
                              key={vIdx}
                              onClick={() => handleSaveVocab(vh, msg.id)}
                              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                                isSaved
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 border-stone-200'
                              }`}
                              title="Simpan ke Bank Kosakata"
                            >
                              <span className="font-serif font-bold" dir="rtl">
                                {vh.arabic}
                              </span>
                              <span className="text-[10px] text-stone-500">({vh.translation})</span>
                              {isSaved ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <BookmarkPlus className="w-3 h-3 text-stone-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Suggested quick reply chips for the latest AI message */}
                  {isAi &&
                    msg.suggestedResponses &&
                    msg.suggestedResponses.length > 0 &&
                    msg.id === messages[messages.length - 1]?.id && (
                      <div className="mt-2 flex flex-wrap gap-2 max-w-[85%]">
                        <span className="text-[10px] text-stone-500 w-full font-medium">
                          💡 Ide balasan untukmu:
                        </span>
                        {msg.suggestedResponses.map((sr, rIdx) => (
                          <button
                            key={rIdx}
                            onClick={() => submitManualSpeech(sr.arabic)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-800 text-xs shadow-xs text-left transition-all active:scale-95"
                          >
                            <span className="font-serif font-bold text-emerald-950 block" dir="rtl">
                              {sr.arabic}
                            </span>
                            <span className="text-[10px] text-stone-500 block">{sr.indonesian}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}

            {/* Interim live speech transcript preview */}
            {interimTranscript && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-semibold text-emerald-600 mb-1 px-1">
                  Mendengarkan...
                </span>
                <div className="max-w-[85%] rounded-3xl p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-950 shadow-xs animate-pulse">
                  <p className="font-serif text-lg font-bold" dir="rtl">
                    {interimTranscript}
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Audio & Input Control Bar */}
          <div className="bg-white border-t border-stone-200 p-3 shrink-0">
            {errorMsg && (
              <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                <span>{errorMsg}</span>
                <button
                  onClick={resetSession}
                  className="font-bold text-rose-800 underline text-[11px]"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Mute Mic Button */}
              <button
                onClick={toggleMute}
                className={`p-3 rounded-2xl border transition-all ${
                  isMuted
                    ? 'bg-rose-100 text-rose-700 border-rose-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
                title={isMuted ? 'Buka Mic' : 'Bisukan Mic'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Fallback Manual Text Input */}
              <form onSubmit={handleManualSubmit} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Ketik teks Arab atau terjemahan (opsional)..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 transition-all"
                  title="Kirim pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* End Session Button */}
              <button
                onClick={endSession}
                className="p-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200 transition-colors"
                title="Selesaikan & Evaluasi Latihan"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
