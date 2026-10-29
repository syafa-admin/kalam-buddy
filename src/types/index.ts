export type UserLevel = 'beginner' | 'elementary' | 'intermediate';
export type CorrectionLevel = 'gentle' | 'moderate' | 'strict';
export type PracticeMode = 'free_talk' | 'scenario' | 'curriculum';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'student' | 'admin';
  selectedLevel: UserLevel;
  dailyGoalMinutes: number;
  correctionLevel: CorrectionLevel;
  showTranslation: boolean;
  showTashkeel: boolean;
  autoTts: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Scenario {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  category: string;
  userRole: string;
  aiRole: string;
  target: string;
  keyVocabulary: string[];
  helpfulPhrases: Array<{ arabic: string; indonesian: string }>;
  starterMessage: string;
}

export interface CurriculumUnit {
  id: string;
  level: UserLevel;
  levelLabel: string;
  unitNumber: number;
  title: string;
  arabicTitle: string;
  objective: string;
  targetExpressions: string[];
  speakingMission: string;
  keyVocab: Array<{ arabic: string; translation: string }>;
  dialogueStarter: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  transliteration?: string;
  translation?: string;
  correction?: {
    hasCorrection: boolean;
    userMistake?: string;
    betterPhrasing?: string;
    explanation?: string;
  };
  vocabularyHelps?: Array<{
    arabic: string;
    translation: string;
    context?: string;
  }>;
  suggestedResponses?: Array<{
    arabic: string;
    indonesian: string;
  }>;
  timestamp: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  mode: PracticeMode;
  title: string;
  scenarioId?: string;
  unitId?: string;
  durationSeconds: number;
  turnsCount: number;
  summary: string;
  fluencyScore: number;
  feedback: string;
  completedAt: string;
  createdAt: string;
}

export interface VocabularyWord {
  id: string;
  userId: string;
  arabic: string;
  transliteration: string;
  translation: string;
  exampleSentence?: string;
  category: string;
  masteryLevel: number; // 1 to 5
  isFavorite: boolean;
  createdAt: string;
}

export interface CurriculumProgress {
  userId: string;
  unitId: string;
  levelId: string;
  completed: boolean;
  score: number;
  completedAt: string;
  updatedAt: string;
}

export interface SessionEvaluation {
  fluencyScore: number;
  summary: string;
  strengths: string[];
  areasToImprove: string[];
  usefulPhrases: Array<{
    arabic: string;
    translation: string;
  }>;
  nextPracticeAdvice: string;
}
