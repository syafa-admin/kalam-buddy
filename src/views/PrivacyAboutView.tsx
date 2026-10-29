import React from 'react';
import { ArrowLeft, Shield, Lock, Mic, CheckCircle2, Heart, Sparkles, Terminal } from 'lucide-react';

export const PrivacyAboutView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-24 pt-2 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Kebijakan Privasi & Tentang</h1>
          <p className="text-xs text-stone-500">Transparansi sistem dan komitmen keamanan data pengguna</p>
        </div>
      </div>

      {/* Privacy Policy Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Shield className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-bold text-stone-900">Kebijakan Privasi Audio Percakapan</h2>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Suara dan audio percakapan merupakan data pribadi yang sangat berharga. Kalām Buddy memegang teguh prinsip keamanan dan privasi berikut:
        </p>

        <div className="space-y-3 text-xs text-stone-700">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <Mic className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <strong className="block text-stone-900">Transparansi Mikrofon:</strong>
              Mikrofon hanya aktif ketika kamu secara sadar menekan tombol "Mulai Berbicara". Mikrofon langsung nonaktif ketika kamu menekan tombol "Akhiri Sesi" atau tombol mute.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <Lock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <strong className="block text-stone-900">Tanpa Penyimpanan Audio Mentah:</strong>
              Aplikasi tidak menyimpan rekaman file audio mentah di cloud Firestore. Audio hanya diproses secara ephemeral untuk transkripsi dan sintesis respon tutor bahasa Arab.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <strong className="block text-stone-900">Hak Kendali Data:</strong>
              Riwayat sesi dan koleksi kosakata kamu tersimpan secara terisolasi berdasarkan UID akun Firebase Firestore milikmu. Kamu berhak menghapus kata atau riwayat latihan kapan pun.
            </div>
          </div>
        </div>
      </div>

      {/* About Application Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-stone-900">Tentang Kalām Buddy</h2>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          <strong>Kalām Buddy</strong> (<em>كَلَام بَدِي</em>) adalah platform AI Arabic Speaking Partner yang dirancang khusus untuk memfasilitasi mahasiswa <strong>Pendidikan Bahasa Arab (PBA)</strong> dan pembelajar pemula agar memiliki teman bicara interaktif dua arah tanpa rasa takut atau cemas akan kesalahan tata bahasa.
        </p>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1.5">
          <p className="font-bold text-emerald-900">Spesifikasi Arsitektur Sistem:</p>
          <ul className="list-disc pl-4 space-y-1 text-emerald-900/80">
            <li><strong>Frontend:</strong> React 19 + TypeScript + Tailwind CSS (Mobile-First Responsive)</li>
            <li><strong>Backend:</strong> Express.js di <code className="font-mono bg-white/60 px-1 py-0.5 rounded-sm">api/index.ts</code> (Vercel Serverless Ready)</li>
            <li><strong>Database:</strong> Google Cloud Firestore Enterprise Edition dengan Security Rules berbasis UID</li>
            <li><strong>Autentikasi:</strong> Firebase Google Auth + Akun Administrator (<code className="font-mono bg-white/60 px-1 py-0.5 rounded-sm">syafaadmin</code>)</li>
            <li><strong>AI Model:</strong> Gemini 3.8 Flash Server-Side Proxy (Keamanan API Key terjamin)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
