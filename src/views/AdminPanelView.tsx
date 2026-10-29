import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SCENARIOS, CURRICULUM_UNITS } from '../data/learningContent';
import { 
  ShieldCheck, 
  Server, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Users,
  Layers,
  BookOpen,
  Activity
} from 'lucide-react';

export const AdminPanelView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAuth();
  const { sessions, vocabulary } = useData();
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealthStatus(data);
        setLoadingHealth(false);
      })
      .catch((err) => {
        setHealthStatus({ status: 'offline', error: err.message });
        setLoadingHealth(false);
      });
  }, []);

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Panel Administrator</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              syafaadmin
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Pusat kendali instruktur & status integrasi server Kalām Buddy
          </p>
        </div>
      </div>

      {/* Server & Integration Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Backend API */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">Express Backend</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${healthStatus?.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-xs font-bold text-stone-800">
                {loadingHealth ? 'Memeriksa...' : healthStatus?.status === 'ok' ? 'Aktif (/api)' : 'Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Gemini AI */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">Gemini 3.8 Flash</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-stone-800">
                {healthStatus?.geminiConfigured ? 'Terkonfigurasi' : 'Aktif (Server-Side)'}
              </span>
            </div>
          </div>
        </div>

        {/* Cloud Firestore */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">Cloud Firestore</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-stone-800">Enterprise Edition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skenario dan Kurikulum Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenarios Management */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Daftar Skenario Aktif ({SCENARIOS.length})</span>
            </h3>
            <span className="text-[11px] text-stone-400">Siap Latihan</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {SCENARIOS.map((sc) => (
              <div key={sc.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800">{sc.title}</span>
                  <p className="text-[10px] text-stone-500">Peran AI: {sc.aiRole}</p>
                </div>
                <span className="font-serif font-bold text-emerald-900 text-sm" dir="rtl">{sc.arabicTitle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum Units Overview */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-700" />
              <span>Struktur Unit Kurikulum ({CURRICULUM_UNITS.length})</span>
            </h3>
            <span className="text-[11px] text-stone-400">Level 1 - 3</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {CURRICULUM_UNITS.map((u) => (
              <div key={u.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-500 mr-1.5">U{u.unitNumber}</span>
                  <span className="font-bold text-stone-800">{u.title}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700">
                  {u.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-purple-50/60 rounded-3xl p-5 border border-purple-200 text-xs text-purple-950 space-y-2">
        <h4 className="font-bold text-purple-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>Panduan Deployment & Kredensial Admin</span>
        </h4>
        <p>
          Akun admin <code className="font-mono bg-white px-1.5 py-0.5 rounded-sm border border-purple-200">syafaadmin</code> terverifikasi melalui endpoint backend aman di <code className="font-mono bg-white px-1.5 py-0.5 rounded-sm border border-purple-200">/api/auth/admin-login</code>. Seluruh panggilan API ke model AI dilakukan dari server-side tanpa mengekspos API key ke client browser.
        </p>
      </div>
    </div>
  );
};
