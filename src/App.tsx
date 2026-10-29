import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { PracticeModesView } from './views/PracticeModesView';
import { ScenariosView } from './views/ScenariosView';
import { CurriculumView } from './views/CurriculumView';
import { VoiceRoomView } from './views/VoiceRoomView';
import { EvaluationView } from './views/EvaluationView';
import { VocabularyView } from './views/VocabularyView';
import { HistoryView } from './views/HistoryView';
import { ProgressView } from './views/ProgressView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { PrivacyAboutView } from './views/PrivacyAboutView';
import { AdminPanelView } from './views/AdminPanelView';
import { PracticeMode, Scenario, CurriculumUnit, ChatMessage } from './types';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Practice session state
  const [activeMode, setActiveMode] = useState<PracticeMode>('free_talk');
  const [activeScenario, setActiveScenario] = useState<Scenario | undefined>(undefined);
  const [activeUnit, setActiveUnit] = useState<CurriculumUnit | undefined>(undefined);
  const [lastSessionSummary, setLastSessionSummary] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-medium text-emerald-200">Memuat Kalām Buddy...</p>
      </div>
    );
  }

  // Wajib Login Guard
  if (!user) {
    return <LoginView onLoginSuccess={() => setCurrentView('dashboard')} />;
  }

  const handleStartPractice = (mode: PracticeMode, item?: any) => {
    setActiveMode(mode);
    if (mode === 'scenario') {
      setActiveScenario(item);
      setActiveUnit(undefined);
    } else if (mode === 'curriculum') {
      setActiveUnit(item);
      setActiveScenario(undefined);
    } else {
      setActiveScenario(undefined);
      setActiveUnit(undefined);
    }
    setCurrentView('voice_room');
  };

  const handleSessionEnded = (summary: {
    durationSeconds: number;
    turnsCount: number;
    history: ChatMessage[];
    mode: PracticeMode;
    scenario?: Scenario;
    curriculumUnit?: CurriculumUnit;
  }) => {
    setLastSessionSummary(summary);
    setCurrentView('evaluation');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(view) => setCurrentView(view)}
            onStartPractice={handleStartPractice}
          />
        );

      case 'practice_modes':
        return (
          <PracticeModesView
            onSelectMode={(mode) => {
              if (mode === 'free_talk') {
                handleStartPractice('free_talk');
              } else if (mode === 'scenario') {
                setCurrentView('scenarios');
              } else if (mode === 'curriculum') {
                setCurrentView('curriculum');
              }
            }}
            onNavigate={(view) => setCurrentView(view)}
          />
        );

      case 'scenarios':
        return (
          <ScenariosView
            onBack={() => setCurrentView('practice_modes')}
            onSelectScenario={(sc) => handleStartPractice('scenario', sc)}
          />
        );

      case 'curriculum':
        return (
          <CurriculumView
            onBack={() => setCurrentView('practice_modes')}
            onSelectUnit={(unit) => handleStartPractice('curriculum', unit)}
          />
        );

      case 'voice_room':
        return (
          <VoiceRoomView
            mode={activeMode}
            scenario={activeScenario}
            curriculumUnit={activeUnit}
            onEndSession={handleSessionEnded}
            onCancel={() => setCurrentView('dashboard')}
          />
        );

      case 'evaluation':
        return lastSessionSummary ? (
          <EvaluationView
            sessionSummary={lastSessionSummary}
            onFinish={() => setCurrentView('dashboard')}
            onRetry={() => {
              handleStartPractice(lastSessionSummary.mode, lastSessionSummary.scenario || lastSessionSummary.curriculumUnit);
            }}
          />
        ) : (
          <DashboardView
            onNavigate={(view) => setCurrentView(view)}
            onStartPractice={handleStartPractice}
          />
        );

      case 'vocabulary':
        return <VocabularyView />;

      case 'history':
        return <HistoryView />;

      case 'progress':
        return <ProgressView onNavigate={(view) => setCurrentView(view)} />;

      case 'profile':
        return <ProfileSettingsView onNavigate={(view) => setCurrentView(view)} />;

      case 'privacy_about':
        return <PrivacyAboutView onBack={() => setCurrentView('profile')} />;

      case 'admin':
        return <AdminPanelView onBack={() => setCurrentView('dashboard')} />;

      default:
        return (
          <DashboardView
            onNavigate={(view) => setCurrentView(view)}
            onStartPractice={handleStartPractice}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navbar (hidden in voice room for focused full immersion) */}
      {currentView !== 'voice_room' && (
        <Navbar currentView={currentView} onNavigate={(v) => setCurrentView(v)} />
      )}

      {/* Main Content View Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4">
        {renderCurrentView()}
      </main>

      {/* Mobile-First Bottom Nav (hidden in voice room) */}
      {currentView !== 'voice_room' && (
        <BottomNav currentView={currentView} onNavigate={(v) => setCurrentView(v)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
