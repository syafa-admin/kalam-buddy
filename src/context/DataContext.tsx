import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from './AuthContext';
import { 
  PracticeSession, 
  VocabularyWord, 
  CurriculumProgress, 
  SessionEvaluation 
} from '../types';
import { INITIAL_VOCABULARY_LIST } from '../data/learningContent';

interface DataContextType {
  sessions: PracticeSession[];
  vocabulary: VocabularyWord[];
  completedUnitIds: string[];
  totalPracticeSeconds: number;
  todayPracticeMinutes: number;
  dailyGoalProgressPct: number;
  loadingData: boolean;
  saveCompletedSession: (
    sessionData: Omit<PracticeSession, 'id' | 'userId' | 'createdAt'>
  ) => Promise<PracticeSession>;
  saveVocabularyWord: (
    word: Omit<VocabularyWord, 'id' | 'userId' | 'createdAt'>
  ) => Promise<void>;
  deleteVocabularyWord: (wordId: string) => Promise<void>;
  toggleFavoriteWord: (wordId: string) => Promise<void>;
  markUnitCompleted: (unitId: string, levelId: string, score: number) => Promise<void>;
  speakArabic: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemo } = useAuth();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [completedUnitIds, setCompletedUnitIds] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Load user data on auth change
  useEffect(() => {
    if (!user) {
      setSessions([]);
      setVocabulary([]);
      setCompletedUnitIds([]);
      setLoadingData(false);
      return;
    }

    const loadData = async () => {
      setLoadingData(true);
      if (isDemo || user.role === 'admin') {
        // Load demo/admin local state or defaults
        const storedSessions = localStorage.getItem(`kalam_sessions_${user.uid}`);
        const storedVocab = localStorage.getItem(`kalam_vocab_${user.uid}`);
        const storedUnits = localStorage.getItem(`kalam_units_${user.uid}`);

        if (storedSessions) {
          try { setSessions(JSON.parse(storedSessions)); } catch (e) {}
        } else {
          // Starter session for demonstration
          setSessions([
            {
              id: 'demo-session-1',
              userId: user.uid,
              mode: 'scenario',
              title: 'Latihan di Kampus (فِي الْجَامِعَةِ)',
              scenarioId: 'university',
              durationSeconds: 240,
              turnsCount: 6,
              summary: 'Latihan menanyakan ruang kuliah dan jadwal ujian dengan baik.',
              fluencyScore: 85,
              feedback: 'Penggunaan kosakata perkuliahan sangat baik. Lanjutkan memperluas bentuk kata kerja.',
              completedAt: new Date(Date.now() - 86400000).toISOString(),
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ]);
        }

        if (storedVocab) {
          try { setVocabulary(JSON.parse(storedVocab)); } catch (e) {}
        } else {
          const initialWords: VocabularyWord[] = INITIAL_VOCABULARY_LIST.map((item, idx) => ({
            ...item,
            id: `init-vocab-${idx}`,
            userId: user.uid,
            createdAt: new Date().toISOString()
          }));
          setVocabulary(initialWords);
        }

        if (storedUnits) {
          try { setCompletedUnitIds(JSON.parse(storedUnits)); } catch (e) {}
        } else {
          setCompletedUnitIds(['l1-u1']);
        }
        setLoadingData(false);
        return;
      }

      // Live Firestore loading
      try {
        // 1. Load Sessions
        const sessionsRef = collection(db, 'users', user.uid, 'sessions');
        const sessionSnap = await getDocs(query(sessionsRef, orderBy('createdAt', 'desc')));
        const loadedSessions: PracticeSession[] = sessionSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any)
        }));
        setSessions(loadedSessions);

        // 2. Load Vocabulary
        const vocabRef = collection(db, 'users', user.uid, 'vocabulary');
        const vocabSnap = await getDocs(vocabRef);
        let loadedVocab: VocabularyWord[] = vocabSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any)
        }));

        // If newly registered, seed initial starter vocab
        if (loadedVocab.length === 0) {
          for (let i = 0; i < INITIAL_VOCABULARY_LIST.length; i++) {
            const item = INITIAL_VOCABULARY_LIST[i];
            const wordDocRef = doc(collection(db, 'users', user.uid, 'vocabulary'));
            const initialWord: VocabularyWord = {
              ...item,
              id: wordDocRef.id,
              userId: user.uid,
              createdAt: new Date().toISOString()
            };
            await setDoc(wordDocRef, initialWord);
            loadedVocab.push(initialWord);
          }
        }
        setVocabulary(loadedVocab);

        // 3. Load Completed Units
        const progressRef = collection(db, 'users', user.uid, 'progress');
        const progSnap = await getDocs(progressRef);
        const completed = progSnap.docs
          .map((d) => d.data() as CurriculumProgress)
          .filter((p) => p.completed)
          .map((p) => p.unitId);
        setCompletedUnitIds(completed);
      } catch (err) {
        console.error('Error fetching Firestore user data:', err);
        handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/sessions`);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [user, isDemo]);

  // Statistics calculations
  const totalPracticeSeconds = sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
  
  // Calculate today's practice minutes
  const todayStr = new Date().toDateString();
  const todaySeconds = sessions
    .filter((s) => new Date(s.completedAt || s.createdAt).toDateString() === todayStr)
    .reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
  const todayPracticeMinutes = Math.round(todaySeconds / 60);

  const goalMinutes = user?.dailyGoalMinutes || 15;
  const dailyGoalProgressPct = Math.min(100, Math.round((todayPracticeMinutes / goalMinutes) * 100));

  const saveCompletedSession = async (
    sessionData: Omit<PracticeSession, 'id' | 'userId' | 'createdAt'>
  ): Promise<PracticeSession> => {
    if (!user) throw new Error('Pengguna belum login.');

    const newId = 'session_' + Date.now();
    const newSession: PracticeSession = {
      ...sessionData,
      id: newId,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    setSessions((prev) => [newSession, ...prev]);

    if (isDemo || user.role === 'admin') {
      const updated = [newSession, ...sessions];
      localStorage.setItem(`kalam_sessions_${user.uid}`, JSON.stringify(updated));
      return newSession;
    }

    try {
      const sessionDocRef = doc(db, 'users', user.uid, 'sessions', newId);
      await setDoc(sessionDocRef, newSession);
    } catch (err) {
      console.error('Error saving session to Firestore:', err);
    }

    return newSession;
  };

  const saveVocabularyWord = async (
    word: Omit<VocabularyWord, 'id' | 'userId' | 'createdAt'>
  ) => {
    if (!user) return;
    const newId = 'vocab_' + Date.now();
    const newWord: VocabularyWord = {
      ...word,
      id: newId,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    setVocabulary((prev) => [newWord, ...prev]);

    if (isDemo || user.role === 'admin') {
      const updated = [newWord, ...vocabulary];
      localStorage.setItem(`kalam_vocab_${user.uid}`, JSON.stringify(updated));
      return;
    }

    try {
      const vocabDocRef = doc(db, 'users', user.uid, 'vocabulary', newId);
      await setDoc(vocabDocRef, newWord);
    } catch (err) {
      console.error('Error saving vocab to Firestore:', err);
    }
  };

  const deleteVocabularyWord = async (wordId: string) => {
    if (!user) return;
    setVocabulary((prev) => prev.filter((w) => w.id !== wordId));

    if (isDemo || user.role === 'admin') {
      const updated = vocabulary.filter((w) => w.id !== wordId);
      localStorage.setItem(`kalam_vocab_${user.uid}`, JSON.stringify(updated));
      return;
    }

    try {
      const vocabDocRef = doc(db, 'users', user.uid, 'vocabulary', wordId);
      await deleteDoc(vocabDocRef);
    } catch (err) {
      console.error('Error deleting vocab from Firestore:', err);
    }
  };

  const toggleFavoriteWord = async (wordId: string) => {
    if (!user) return;
    let newFavState = false;
    setVocabulary((prev) =>
      prev.map((w) => {
        if (w.id === wordId) {
          newFavState = !w.isFavorite;
          return { ...w, isFavorite: newFavState };
        }
        return w;
      })
    );

    if (isDemo || user.role === 'admin') {
      const updated = vocabulary.map((w) => (w.id === wordId ? { ...w, isFavorite: !w.isFavorite } : w));
      localStorage.setItem(`kalam_vocab_${user.uid}`, JSON.stringify(updated));
      return;
    }

    try {
      const vocabDocRef = doc(db, 'users', user.uid, 'vocabulary', wordId);
      await updateDoc(vocabDocRef, { isFavorite: newFavState });
    } catch (err) {
      console.error('Error toggling favorite in Firestore:', err);
    }
  };

  const markUnitCompleted = async (unitId: string, levelId: string, score: number) => {
    if (!user) return;
    if (!completedUnitIds.includes(unitId)) {
      const updated = [...completedUnitIds, unitId];
      setCompletedUnitIds(updated);

      if (isDemo || user.role === 'admin') {
        localStorage.setItem(`kalam_units_${user.uid}`, JSON.stringify(updated));
        return;
      }

      try {
        const progDocRef = doc(db, 'users', user.uid, 'progress', unitId);
        const progData: CurriculumProgress = {
          userId: user.uid,
          unitId,
          levelId,
          completed: true,
          score,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(progDocRef, progData);
      } catch (err) {
        console.error('Error saving progress to Firestore:', err);
      }
    }
  };

  // Arabic Speech Synthesis
  const speakArabic = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text of non-pronounceable brackets
    const cleanText = text.replace(/\[.*?\]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9; // Slightly slower for clear Arabic pronunciation

    // Try finding Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('SA') || v.lang.includes('EG'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        sessions,
        vocabulary,
        completedUnitIds,
        totalPracticeSeconds,
        todayPracticeMinutes,
        dailyGoalProgressPct,
        loadingData,
        saveCompletedSession,
        saveVocabularyWord,
        deleteVocabularyWord,
        toggleFavoriteWord,
        markUnitCompleted,
        speakArabic,
        isSpeaking,
        stopSpeaking
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
