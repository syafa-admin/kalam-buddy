import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, PracticeMode, Scenario, CurriculumUnit, UserProfile } from '../types';

export type VoiceState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking' | 'ended' | 'error';

interface UseVoiceChatProps {
  user: UserProfile;
  mode: PracticeMode;
  scenario?: Scenario;
  curriculumUnit?: CurriculumUnit;
  onSessionComplete?: (sessionData: {
    durationSeconds: number;
    turnsCount: number;
    history: ChatMessage[];
  }) => void;
}

export function useVoiceChat({
  user,
  mode,
  scenario,
  curriculumUnit,
  onSessionComplete
}: UseVoiceChatProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  // Audio Context & Analyser
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Speech Recognition & MediaRecorder
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Timer
  const timerRef = useRef<any>(null);
  const isSessionActiveRef = useRef<boolean>(false);

  // Clean up
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setAudioLevel(0);
    setInterimTranscript('');
  }, []);

  // Text-to-speech for AI response
  const speakText = useCallback((arabicText: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;

      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arVoice) {
        utterance.voice = arVoice;
      }

      utterance.onstart = () => {
        setVoiceState('speaking');
      };
      utterance.onend = () => {
        if (isSessionActiveRef.current) {
          setVoiceState('listening');
        }
        resolve();
      };
      utterance.onerror = () => {
        if (isSessionActiveRef.current) {
          setVoiceState('listening');
        }
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Send message to AI backend
  const sendToAI = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const userMsgObj: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setVoiceState('processing');

    try {
      const payload = {
        messages: [...messages, userMsgObj],
        userMessage: userText,
        mode,
        scenario,
        curriculumUnit,
        userLevel: user.selectedLevel,
        correctionLevel: user.correctionLevel
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi AI tutor.');
      }

      const resData = await res.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.message || 'Respon AI tidak valid.');
      }

      const data = resData.data;
      const aiMsgObj: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'model',
        text: data.arabicResponse,
        transliteration: data.transliteration,
        translation: data.indonesianTranslation,
        correction: data.correction,
        vocabularyHelps: data.vocabularyHelps,
        suggestedResponses: data.suggestedResponses,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsgObj]);

      // Speak response if autoTts is enabled
      if (user.autoTts) {
        await speakText(data.arabicResponse);
      } else {
        setVoiceState('listening');
      }
    } catch (err: any) {
      console.error('sendToAI error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat meminta respon AI.');
      setVoiceState('listening');
    }
  }, [messages, mode, scenario, curriculumUnit, user, speakText]);

  // Audio level analyzer loop
  const startAudioAnalyzer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize 0 to 1
        setAudioLevel(Math.min(1, average / 100));

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn('Audio analyser could not start:', e);
    }
  };

  // Start Voice Session
  const startSession = async () => {
    setErrorMsg(null);
    setVoiceState('connecting');

    try {
      // 1. Request microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;
      startAudioAnalyzer(stream);

      isSessionActiveRef.current = true;
      setDurationSeconds(0);

      // Start duration counter
      timerRef.current = setInterval(() => {
        setDurationSeconds((d) => d + 1);
      }, 1000);

      // 2. Setup Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setInterimTranscript('');
              if (transcript.trim().length > 0) {
                sendToAI(transcript.trim());
              }
            } else {
              currentInterim += transcript;
            }
          }
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition status:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMsg('Izin mikrofon tidak diberikan. Silakan izinkan akses mikrofon di browser.');
            setVoiceState('error');
          }
        };

        recognition.onend = () => {
          // Restart if session still active and not ended
          if (isSessionActiveRef.current && voiceState !== 'speaking' && voiceState !== 'ended') {
            try {
              recognition.start();
            } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      // 3. Initiate first AI prompt (starter greeting)
      const initialGreeting =
        scenario?.starterMessage ||
        curriculumUnit?.dialogueStarter ||
        'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ! أَهْلًا بِكَ فِي كَلَام بَدِي. كَيْفَ حَالُكَ الْيَوْمَ؟';

      const initialAiMsg: ChatMessage = {
        id: 'msg_init_' + Date.now(),
        role: 'model',
        text: initialGreeting,
        translation: 'Assalamu alaikum wa rahmatullah! Selamat datang di Kalām Buddy. Bagaimana kabarmu hari ini?',
        timestamp: new Date().toISOString()
      };

      setMessages([initialAiMsg]);

      // Speak greeting
      if (user.autoTts) {
        await speakText(initialGreeting);
      } else {
        setVoiceState('listening');
      }
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      let message = 'Tidak dapat mengakses mikrofon.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Akses mikrofon ditolak. Klik ikon gembok di bilah alamat browser untuk mengizinkan mikrofon.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Perangkat mikrofon tidak ditemukan di sistem ini.';
      }
      setErrorMsg(message);
      setVoiceState('error');
      cleanupAudio();
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // End Session
  const endSession = () => {
    isSessionActiveRef.current = false;
    setVoiceState('ended');
    const finalSeconds = durationSeconds;
    const finalMessages = [...messages];
    cleanupAudio();

    if (onSessionComplete) {
      onSessionComplete({
        durationSeconds: finalSeconds,
        turnsCount: finalMessages.filter((m) => m.role === 'user').length,
        history: finalMessages
      });
    }
  };

  // Manual fallback speech submission (or user typing)
  const submitManualSpeech = (text: string) => {
    if (voiceState === 'ended' || !text.trim()) return;
    sendToAI(text.trim());
  };

  // Repeat AI Speech
  const repeatAiSpeech = (text: string) => {
    speakText(text);
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
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
    resetSession: startSession
  };
}
