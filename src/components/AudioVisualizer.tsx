import React from 'react';
import { VoiceState } from '../hooks/useVoiceChat';
import { Mic, Volume2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface AudioVisualizerProps {
  state: VoiceState;
  audioLevel: number; // 0 to 1
  isMuted?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ state, audioLevel, isMuted }) => {
  // Generate 7 sound wave bars
  const bars = [0.4, 0.7, 1.0, 0.8, 1.0, 0.7, 0.4];

  const getStatusInfo = () => {
    switch (state) {
      case 'connecting':
        return {
          title: 'Menghubungkan Sesi...',
          desc: 'Menyiapkan AI Arabic Partner dan audio stream',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500 animate-ping'
        };
      case 'listening':
        return {
          title: isMuted ? 'Mikrofon Dibisukan (Muted)' : 'Mendengarkan Kamu...',
          desc: isMuted ? 'Buka mic untuk berbicara' : 'Bicaralah dalam bahasa Arab secara wajar',
          badge: isMuted ? 'bg-stone-200 text-stone-700 border-stone-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: isMuted ? 'bg-stone-400' : 'bg-emerald-500 animate-pulse'
        };
      case 'processing':
        return {
          title: 'Kalām Buddy Sedang Berpikir...',
          desc: 'Menganalisis kalimat dan menyiapkan respon',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500 animate-spin'
        };
      case 'speaking':
        return {
          title: 'Kalām Buddy Sedang Berbicara...',
          desc: 'Dengarkan pelafalan bahasa Arab dengan seksama',
          badge: 'bg-teal-100 text-teal-800 border-teal-300',
          dot: 'bg-teal-500 animate-bounce'
        };
      case 'ended':
        return {
          title: 'Sesi Selesai',
          desc: 'Mempersiapkan evaluasi performa bicaramu',
          badge: 'bg-stone-100 text-stone-700 border-stone-300',
          dot: 'bg-stone-400'
        };
      case 'error':
        return {
          title: 'Terjadi Kendala Koneksi',
          desc: 'Periksa izin mic atau koneksi internet',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500'
        };
      default:
        return {
          title: 'Siap Latihan Berbicara',
          desc: 'Tekan tombol Mulai Percakapan',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500'
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Central Visualizer Orb */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer glowing ripple */}
        <div
          className={`absolute w-44 h-44 rounded-full transition-all duration-300 opacity-20 ${
            state === 'listening' && !isMuted
              ? 'bg-emerald-500'
              : state === 'speaking'
              ? 'bg-teal-400'
              : state === 'processing'
              ? 'bg-blue-400'
              : 'bg-stone-300'
          }`}
          style={{
            transform: `scale(${1 + (state === 'listening' ? audioLevel * 0.8 : 0.15)})`
          }}
        />

        {/* Middle ambient circle */}
        <div
          className={`absolute w-36 h-36 rounded-full transition-all duration-200 opacity-30 ${
            state === 'listening' && !isMuted
              ? 'bg-emerald-500'
              : state === 'speaking'
              ? 'bg-teal-500'
              : state === 'processing'
              ? 'bg-blue-500'
              : 'bg-stone-300'
          }`}
          style={{
            transform: `scale(${1 + (state === 'listening' ? audioLevel * 0.4 : 0.08)})`
          }}
        />

        {/* Core sphere */}
        <div
          className={`relative z-10 w-28 h-28 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
            state === 'listening' && !isMuted
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30'
              : state === 'speaking'
              ? 'bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-teal-500/30'
              : state === 'processing'
              ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-blue-500/30'
              : state === 'error'
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-stone-200 text-stone-600'
          }`}
        >
          {state === 'processing' ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : state === 'speaking' ? (
            <Volume2 className="w-10 h-10 animate-pulse" />
          ) : state === 'error' ? (
            <AlertCircle className="w-10 h-10" />
          ) : (
            <Mic className={`w-10 h-10 ${state === 'listening' && !isMuted ? 'animate-pulse' : ''}`} />
          )}
        </div>
      </div>

      {/* Dynamic Sound Wave Frequency Bars */}
      <div className="flex items-center justify-center gap-1.5 h-10 mb-4 px-4">
        {bars.map((barMultiplier, index) => {
          let heightPercent = 20;

          if (state === 'listening' && !isMuted) {
            // Reacts to real microphone volume
            heightPercent = Math.max(15, Math.min(100, (audioLevel * 100 + 10) * barMultiplier));
          } else if (state === 'speaking') {
            // Rhythmic simulated speech animation
            const dynamicScale = Math.sin(Date.now() / 200 + index) * 35 + 50;
            heightPercent = Math.max(20, Math.min(100, dynamicScale * barMultiplier));
          } else if (state === 'processing') {
            heightPercent = 30 + Math.sin(Date.now() / 300 + index) * 20;
          }

          return (
            <div
              key={index}
              className={`w-1.5 rounded-full transition-all duration-100 ${
                state === 'listening' && !isMuted
                  ? 'bg-emerald-600'
                  : state === 'speaking'
                  ? 'bg-teal-600'
                  : state === 'processing'
                  ? 'bg-blue-500'
                  : 'bg-stone-300'
              }`}
              style={{
                height: `${heightPercent}%`
              }}
            />
          );
        })}
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-1.5 ${status.badge}`}>
        <span className={`w-2 h-2 rounded-full ${status.dot}`} />
        <span>{status.title}</span>
      </div>

      {/* Descriptive subtitle */}
      <p className="text-xs text-stone-500 font-medium">{status.desc}</p>
    </div>
  );
};
