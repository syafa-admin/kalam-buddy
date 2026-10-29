import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserLevel, CorrectionLevel } from '../types';
import { 
  User, 
  Settings, 
  Target, 
  Sparkles, 
  Volume2, 
  Shield, 
  LogOut, 
  Check, 
  HelpCircle,
  FileText,
  Sliders
} from 'lucide-react';

export const ProfileSettingsView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { user, updatePreferences, logout, isAdmin, isDemo } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(user?.selectedLevel || 'beginner');
  const [dailyGoal, setDailyGoal] = useState<number>(user?.dailyGoalMinutes || 15);
  const [correctionLevel, setCorrectionLevel] = useState<CorrectionLevel>(user?.correctionLevel || 'moderate');
  const [showTranslation, setShowTranslation] = useState<boolean>(user?.showTranslation ?? true);
  const [showTashkeel, setShowTashkeel] = useState<boolean>(user?.showTashkeel ?? true);
  const [autoTts, setAutoTts] = useState<boolean>(user?.autoTts ?? true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    await updatePreferences({
      selectedLevel,
      dailyGoalMinutes: dailyGoal,
      correctionLevel,
      showTranslation,
      showTashkeel,
      autoTts
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Profil & Pengaturan</h1>
        <p className="text-xs text-stone-500">
          Sesuaikan preferensi belajar dan interaksi suara AI tutor
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-emerald-800/20">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">{user?.displayName}</h2>
              {isAdmin && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  ADMIN
                </span>
              )}
              {isDemo && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  DEMO
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Pendidikan Bahasa Arab
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Keluar dari Akun"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Sliders className="w-4 h-4 text-emerald-700" />
          <h3 className="font-bold text-sm text-stone-900">Preferensi Latihan Percakapan</h3>
        </div>

        {/* Level Bahasa Arab */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Tingkat Kemampuan Bahasa Arab (Level)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'beginner', label: 'مبتدئ (Pemula)', desc: 'Kalimat pendek & kosakata dasar' },
              { id: 'elementary', label: 'أساسي (Dasar)', desc: 'Percakapan sehari-hari & kampus' },
              { id: 'intermediate', label: 'متوسط (Menengah)', desc: 'Diskusi & penyampaian opini' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id as UserLevel)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedLevel === lvl.id
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-xs block">{lvl.label}</span>
                <span className="text-[10px] text-stone-400 font-normal block mt-0.5">
                  {lvl.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Latihan Harian */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Target Latihan Harian
          </label>
          <div className="flex gap-2">
            {[10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyGoal(mins)}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                  dailyGoal === mins
                    ? 'border-emerald-600 bg-emerald-700 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {mins} Menit
              </button>
            ))}
          </div>
        </div>

        {/* Tingkat Koreksi AI */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Tingkat Ketelitian Koreksi Tutor
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'gentle', label: 'Ringan', desc: 'Hanya jika arti ambigu' },
              { id: 'moderate', label: 'Sedang (Ideal)', desc: 'Koreksi tata bahasa & pilihan kata' },
              { id: 'strict', label: 'Intensif', desc: 'Koreksi mendalam pola i\'rab' }
            ].map((cl) => (
              <button
                key={cl.id}
                type="button"
                onClick={() => setCorrectionLevel(cl.id as CorrectionLevel)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  correctionLevel === cl.id
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-xs block">{cl.label}</span>
                <span className="text-[10px] text-stone-400 font-normal block">{cl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          {/* Tampilkan Terjemahan */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                Tampilkan Terjemahan Indonesia
              </span>
              <span className="text-[11px] text-stone-500">
                Membantu memahami respon AI bagi pembelajar pemula
              </span>
            </div>
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
            />
          </div>

          {/* Tampilkan Harakat */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                Tampilkan Tanda Baca (Harakat / Tashkeel)
              </span>
              <span className="text-[11px] text-stone-500">
                Memudahkan pelafalan fonetik huruf Arab yang akurat
              </span>
            </div>
            <input
              type="checkbox"
              checked={showTashkeel}
              onChange={(e) => setShowTashkeel(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
            />
          </div>

          {/* Auto-TTS */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                Suara Pelafalan Otomatis (Auto Voice)
              </span>
              <span className="text-[11px] text-stone-500">
                AI langsung melafalkan jawabannya setiap menerima ucapanmu
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoTts}
              onChange={(e) => setAutoTts(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Pengaturan Tersimpan!</span>
              </>
            ) : (
              <span>Simpan Perubahan Pengaturan</span>
            )}
          </button>
        </div>
      </div>

      {/* Helpful Links */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-2">
        <button
          onClick={() => onNavigate('privacy_about')}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-stone-50 text-stone-700 transition-colors text-xs font-medium"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-stone-400" />
            <span>Kebijakan Privasi & Tentang Kalām Buddy</span>
          </div>
          <span className="text-stone-400">›</span>
        </button>
      </div>
    </div>
  );
};
