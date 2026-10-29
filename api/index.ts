import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Kalām Buddy API',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Admin Authentication endpoint
app.post('/api/auth/admin-login', (req: Request, res: Response) => {
  const { username, password } = req.body || {};

  if (username === 'syafaadmin' && password === 'syafa123') {
    return res.json({
      success: true,
      user: {
        uid: 'admin_syafaadmin',
        displayName: 'Syafa (Admin Kalām Buddy)',
        email: 'syafaadmin@kalambuddy.edu',
        role: 'admin',
        selectedLevel: 'intermediate',
        dailyGoalMinutes: 30,
        correctionLevel: 'moderate',
        showTranslation: true,
        showTashkeel: true,
        autoTts: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token: 'admin-session-token-' + Date.now()
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau password admin salah. Silakan periksa kembali kredensial.'
  });
});

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di environment server.');
  }
  return new GoogleGenAI({ apiKey });
}

// AI Conversation Partner
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      userMessage = '',
      mode = 'free_talk',
      scenario,
      curriculumUnit,
      userLevel = 'beginner',
      correctionLevel = 'moderate'
    } = req.body;

    const ai = getGeminiClient();

    let contextInstructions = '';
    if (mode === 'scenario' && scenario) {
      contextInstructions = `
SKENARIO LATIHAN AKTIF:
- Judul Skenario: ${scenario.title} (${scenario.arabicTitle || ''})
- Situasi: ${scenario.description}
- Peran Pengguna: ${scenario.userRole}
- Peran AI: ${scenario.aiRole}
- Target Komunikasi: ${scenario.target}
- Kosakata Kunci: ${scenario.keyVocabulary?.join(', ') || ''}

PANDUAN PERAN:
Bertindaklah konsisten sebagai ${scenario.aiRole}. Tanggapi sesuai konteks peranmu. Tetaplah suportif dan ramah mahasiswa.
`;
    } else if (mode === 'curriculum' && curriculumUnit) {
      contextInstructions = `
UNIT KURIKULUM AKTIF:
- Unit: ${curriculumUnit.title} (Level: ${curriculumUnit.level})
- Tujuan Pembelajaran: ${curriculumUnit.objective}
- Fokus Kosakata & Ungkapan: ${curriculumUnit.targetExpressions?.join(', ') || ''}
- Misi Berbicara: ${curriculumUnit.speakingMission || ''}

PANDUAN KURIKULUM:
Bimbing pengguna mempraktikkan ungkapan dan kosakata di unit ini. Dorong pengguna menjawab dan mempraktikkan misi berbicara.
`;
    } else {
      contextInstructions = `
MODE: FREE TALK (Obrolan Santai & Terbuka)
Jadilah teman bicara bahasa Arab (Arab speaking partner) yang ramah, hangat, dan interaktif. Topik bisa perkenalan, kampus, hobi, makanan, rencana masa depan, atau aktivitas harian. Sesuaikan dengan level pengguna.
`;
    }

    const systemInstruction = `
Kamu adalah "Kalām Buddy", AI Arabic Speaking Partner yang sabar, suportif, komunikatif, dan ramah mahasiswa Pendidikan Bahasa Arab.

ATURAN UTAMA:
1. Berbicaralah menggunakan Bahasa Arab Fusha Modern (الفصحى الحديثة) yang fasih, alami, dan berharakat lengkap (تَشْكِيل).
2. Level Pengguna saat ini: ${userLevel} (beginner = مبتدئ, elementary = أساسي, intermediate = متوسط).
   - Pada level "beginner": Gunakan kalimat pendek, kosakata mudah dipahami, ajukan SATU pertanyaan sederhana dalam satu giliran.
   - Pada level "elementary": Gunakan variasi kata kerja, kalimat majemuk sederhana, dan pertanyaan yang merangsang jawaban 1-2 kalimat.
   - Pada level "intermediate": Percakapan lebih mengalir, kosakata lebih kaya, dorong pengguna menyampaikan opini atau alasan.
3. SISTEM KOREKSI (Tingkat koreksi saat ini: ${correctionLevel}):
   - Jangan menyela atau memarahi. Berikan koreksi yang sopan, bersahabat, dan membangun keberanian.
   - Jika pengguna salah tata bahasa (nahwu/sharaf) atau pilihan kata yang kurang tepat:
     Berikan field "correction" dengan format yang jelas (apa yang dikatakan vs alternatif yang lebih alami + penjelasan singkat dalam Bahasa Indonesia).
   - JANGAN mengarang kesalahan pelafalan huruf jika teks terlihat wajar.
   - Jika kalimat pengguna sudah benar atau cukup baik, set "correction.hasCorrection" = false.
4. Jangan langsung memberi jawaban panjang yang membuat pengguna kewalahan. Selalu akhiri responmu dengan SATU pertanyaan pemantik yang mengundang pengguna untuk membalas berbicara!
5. Sediakan terjemahan Bahasa Indonesia yang akurat untuk responmu, serta 2 ide balasan singkat (suggestedResponses) dalam bahasa Arab untuk membantu pengguna yang bingung ingin menjawab apa.

${contextInstructions}
`;

    // Format chat contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add prior conversation turns
    for (const msg of messages.slice(-10)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || '' }]
      });
    }

    // Add latest user message if not already in messages
    if (userMessage && (!messages.length || messages[messages.length - 1].text !== userMessage)) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
    }

    // If starting a new session with no user message yet, prompt AI to open the dialogue
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Mari mulai latihan berbicara bahasa Arab! Silakan buka percakapan sesuai peran/skenario ini dengan salam dan sapaan yang hangat.' }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabicResponse: {
              type: Type.STRING,
              description: 'Respon AI dalam bahasa Arab fusha lengkap dengan harakat/tashkeel'
            },
            transliteration: {
              type: Type.STRING,
              description: 'Panduan membaca latin untuk respon bahasa Arab tersebut'
            },
            indonesianTranslation: {
              type: Type.STRING,
              description: 'Terjemahan respon AI ke dalam Bahasa Indonesia'
            },
            correction: {
              type: Type.OBJECT,
              properties: {
                hasCorrection: { type: Type.BOOLEAN },
                userMistake: { type: Type.STRING, description: 'Frasa yang diucapkan pengguna' },
                betterPhrasing: { type: Type.STRING, description: 'Frasa alternatif yang lebih tepat dan alami' },
                explanation: { type: Type.STRING, description: 'Penjelasan tata bahasa/kosakata dalam bahasa Indonesia secara ramah' }
              },
              required: ['hasCorrection']
            },
            vocabularyHelps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  arabic: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  context: { type: Type.STRING }
                },
                required: ['arabic', 'translation']
              },
              description: '1-3 kosakata penting dari percakapan ini yang bermanfaat untuk disimpan'
            },
            suggestedResponses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  arabic: { type: Type.STRING },
                  indonesian: { type: Type.STRING }
                },
                required: ['arabic', 'indonesian']
              },
              description: '2 contoh balasan singkat yang bisa diucapkan pengguna untuk melanjutkan percakapan'
            }
          },
          required: ['arabicResponse', 'indonesianTranslation', 'correction', 'suggestedResponses']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Gagal memproses percakapan dengan AI tutor.'
    });
  }
});

// Voice Audio Transcription endpoint
app.post('/api/ai/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ success: false, message: 'Data audio base64 diperlukan.' });
    }

    const ai = getGeminiClient();

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64
              }
            },
            {
              text: `Tolong transkripsikan rekaman suara percakapan bahasa Arab ini.
Fokus pada apa yang diucapkan pembicara dalam bahasa Arab (atau campuran bahasa Arab/Indonesia).
Keluarkan HANYA teks transkripsi asli dalam aksara Arab (dengan harakat jika terdengar jelas). Jangan tambahkan komentar pengantar.`
            }
          ]
        }
      ]
    });

    const transcript = (response.text || '').trim();

    return res.json({
      success: true,
      transcript
    });
  } catch (error: any) {
    console.error('Error in /api/ai/transcribe:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Gagal mentranskripsi audio.'
    });
  }
});

// Session Evaluation
app.post('/api/ai/evaluate-session', async (req: Request, res: Response) => {
  try {
    const { history = [], durationSeconds = 0, mode = 'free_talk', contextTitle = '' } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Evaluasi sesi latihan berbicara bahasa Arab mahasiswa berikut ini:
- Mode Latihan: ${mode}
- Judul/Topik: ${contextTitle}
- Durasi: ${durationSeconds} detik
- Riwayat Percakapan:
${history.map((h: any) => `${h.role === 'user' ? 'Mahasiswa' : 'Kalam Buddy'}: ${h.text}`).join('\n')}

Berikan evaluasi pedagogis yang objektif, menyemangati, dan konstruktif:
1. Skor Kelancaran (1-100) - perkiraan pedagogis untuk motivasi belajar.
2. Ringkasan performa mahasiswa.
3. Kelebihan yang sudah bagus (kosa kata, keberanian menjawab, respons).
4. Catatan perbaikan tata bahasa / ungkapan yang lebih alami.
5. 3-5 Kosakata baru yang dipraktikkan atau direkomendasikan untuk diingat.
6. Rekomendasi latihan berikutnya.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fluencyScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
            usefulPhrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  arabic: { type: Type.STRING },
                  translation: { type: Type.STRING }
                },
                required: ['arabic', 'translation']
              }
            },
            nextPracticeAdvice: { type: Type.STRING }
          },
          required: ['fluencyScore', 'summary', 'strengths', 'areasToImprove', 'usefulPhrases', 'nextPracticeAdvice']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, evaluation: result });
  } catch (error: any) {
    console.error('Error in /api/ai/evaluate-session:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Gagal membuat evaluasi sesi.'
    });
  }
});

export default app;
