import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { VocabularyWord } from '../types';
import { 
  Search, 
  Bookmark, 
  Star, 
  Volume2, 
  Trash2, 
  Plus, 
  Layers, 
  HelpCircle, 
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export const VocabularyView: React.FC = () => {
  const { 
    vocabulary, 
    saveVocabularyWord, 
    deleteVocabularyWord, 
    toggleFavoriteWord, 
    speakArabic 
  } = useData();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFavorite, setFilterFavorite] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);

  // New Word Form State
  const [newArabic, setNewArabic] = useState<string>('');
  const [newTranslation, setNewTranslation] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Koleksi Pribadi');
  const [newExample, setNewExample] = useState<string>('');

  // Flashcard State
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Categories list
  const categories = ['Semua', ...Array.from(new Set(vocabulary.map((v) => v.category || 'Dasar')))];

  // Filtered Vocabulary
  const filteredWords = vocabulary.filter((word) => {
    const matchesSearch =
      word.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = filterFavorite ? word.isFavorite : true;
    const matchesCat = selectedCategory === 'Semua' ? true : word.category === selectedCategory;
    return matchesSearch && matchesFav && matchesCat;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArabic.trim() || !newTranslation.trim()) return;

    await saveVocabularyWord({
      arabic: newArabic.trim(),
      transliteration: '',
      translation: newTranslation.trim(),
      category: newCategory.trim() || 'Koleksi Pribadi',
      exampleSentence: newExample.trim(),
      masteryLevel: 1,
      isFavorite: false
    });

    setNewArabic('');
    setNewTranslation('');
    setNewExample('');
    setShowAddModal(false);
  };

  // Quiz questions generation
  const activeQuizWord = filteredWords[quizIndex] || vocabulary[quizIndex];
  const generateQuizOptions = () => {
    if (!activeQuizWord) return [];
    const correct = activeQuizWord.translation;
    const others = vocabulary
      .filter((w) => w.translation !== correct)
      .map((w) => w.translation);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return options;
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === activeQuizWord?.translation) {
      setQuizScore((s) => s + 1);
    }
    setTimeout(() => {
      if (quizIndex + 1 < Math.min(5, vocabulary.length)) {
        setQuizIndex((i) => i + 1);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Bank Kosakata (Mufradāt)</h1>
          <p className="text-xs text-stone-500">
            Total {vocabulary.length} kata berharakat dengan audio dan terjemahan
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Flashcard Button */}
          <button
            onClick={() => {
              setCardIndex(0);
              setIsFlipped(false);
              setShowFlashcardModal(true);
            }}
            disabled={vocabulary.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-all disabled:opacity-50"
          >
            <Layers className="w-4 h-4" />
            <span>Flashcard</span>
          </button>

          {/* Quiz Button */}
          <button
            onClick={() => {
              resetQuiz();
              setShowQuizModal(true);
            }}
            disabled={vocabulary.length < 3}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-all disabled:opacity-50"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Kuis Kosakata</span>
          </button>

          {/* Add Word Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Kata</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata bahasa Arab atau arti bahasa Indonesia..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories & Favorite Toggle */}
        <div className="flex items-center justify-between gap-2 pt-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFilterFavorite(!filterFavorite)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
              filterFavorite
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Favorit</span>
          </button>
        </div>
      </div>

      {/* Vocabulary List Grid */}
      {filteredWords.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80">
          <Bookmark className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-bold text-stone-800 text-sm">Tidak Ada Kosakata Ditemukan</h3>
          <p className="text-xs text-stone-500 mt-1">
            Kosakata yang disimpan dari sesi berbicara akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row with category & favorite */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                    {word.category || 'Dasar'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavoriteWord(word.id)}
                      className="p-1 text-stone-300 hover:text-amber-500 transition-colors"
                      title={word.isFavorite ? 'Hapus dari favorit' : 'Tandai favorit'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          word.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => deleteVocabularyWord(word.id)}
                      className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                      title="Hapus kata"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Script & Audio */}
                <div className="flex items-start justify-between gap-2 mt-1">
                  <h3
                    className="font-serif text-2xl font-bold text-emerald-950 tracking-wide"
                    dir="rtl"
                  >
                    {word.arabic}
                  </h3>
                  <button
                    onClick={() => speakArabic(word.arabic)}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors shrink-0"
                    title="Dengarkan pelafalan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Translation */}
                <p className="text-xs font-semibold text-stone-700 mt-2">
                  {word.translation}
                </p>

                {/* Example Sentence */}
                {word.exampleSentence && (
                  <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                    <p className="font-serif text-stone-800 font-medium" dir="rtl">
                      {word.exampleSentence}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-stone-900">Tambah Kosakata Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kata Bahasa Arab (Berharakat)
                </label>
                <input
                  type="text"
                  value={newArabic}
                  onChange={(e) => setNewArabic(e.target.value)}
                  placeholder="مِثَالٌ: قَلَمٌ ، جَامِعَةٌ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-serif text-lg text-emerald-950 focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Arti Bahasa Indonesia
                </label>
                <input
                  type="text"
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="Contoh: Pena, Universitas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Dasar / Kampus / Akademik"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contoh Kalimat (Opsional)
                </label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="هَذَا قَلَمٌ جَدِيدٌ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-serif text-base text-stone-800 focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                  dir="rtl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                >
                  Simpan Kata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Flashcard Modal */}
      {showFlashcardModal && vocabulary.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500">
                Kartu {cardIndex + 1} dari {vocabulary.length}
              </span>
              <button
                onClick={() => setShowFlashcardModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flashcard Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-64 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-800 text-white p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl relative transition-all select-none hover:scale-[1.01]"
            >
              <span className="absolute top-4 left-4 text-[11px] text-emerald-200 font-medium">
                {isFlipped ? 'Arti Bahasa Indonesia' : 'Kosakata Bahasa Arab'}
              </span>

              <span className="absolute top-4 right-4 text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-emerald-200">
                Klik kartu untuk membalik
              </span>

              {!isFlipped ? (
                <div>
                  <h2 className="font-serif text-4xl font-bold leading-relaxed tracking-wider mb-2" dir="rtl">
                    {vocabulary[cardIndex]?.arabic}
                  </h2>
                  <p className="text-xs text-emerald-200/80 font-mono">
                    {vocabulary[cardIndex]?.category || 'Kategori'}
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {vocabulary[cardIndex]?.translation}
                  </h2>
                  {vocabulary[cardIndex]?.exampleSentence && (
                    <p className="text-xs text-emerald-200/80 font-serif mt-2" dir="rtl">
                      {vocabulary[cardIndex]?.exampleSentence}
                    </p>
                  )}
                </div>
              )}

              {/* Audio button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakArabic(vocabulary[cardIndex]?.arabic);
                }}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Dengarkan pelafalan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3 mt-4">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((i) => Math.max(0, i - 1));
                }}
                disabled={cardIndex === 0}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 disabled:opacity-30"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((i) => Math.min(vocabulary.length - 1, i + 1));
                }}
                disabled={cardIndex === vocabulary.length - 1}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold disabled:opacity-30"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multiple-Choice Vocab Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-stone-900">Kuis Kosakata</h3>
              </div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!quizFinished ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Soal {quizIndex + 1} dari {Math.min(5, vocabulary.length)}</span>
                  <span className="font-bold text-emerald-800">Skor: {quizScore}</span>
                </div>

                {/* Prompt Word Card */}
                <div className="bg-stone-50 rounded-2xl p-6 text-center border border-stone-200">
                  <span className="text-[11px] text-stone-400 block mb-1">
                    Apa arti kata bahasa Arab ini?
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="font-serif text-3xl font-bold text-emerald-950" dir="rtl">
                      {activeQuizWord?.arabic}
                    </h2>
                    <button
                      onClick={() => speakArabic(activeQuizWord?.arabic)}
                      className="p-1 text-stone-400 hover:text-emerald-700"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {generateQuizOptions().map((opt, idx) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrect = opt === activeQuizWord?.translation;

                    let btnStyle = 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800';
                    if (selectedAnswer) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-100 border-rose-300 text-rose-800';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleQuizAnswer(opt)}
                        className={`w-full py-3 px-4 rounded-xl border text-xs sm:text-sm text-left transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Quiz Finished Summary */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Kuis Selesai!</h3>
                <p className="text-xs text-stone-600">
                  Kamu menjawab benar <strong className="text-emerald-800 text-base">{quizScore}</strong> dari {Math.min(5, vocabulary.length)} soal.
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
                  >
                    Ulangi Kuis
                  </button>
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
