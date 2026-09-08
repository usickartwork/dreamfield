/**
 * Vercel Serverless Function: /api/chat
 * Multi-Provider High Availability: Groq (Primary, Ultra-Fast) + Google Gemini (Auto-Fallback Backup)
 */

const SYSTEM_INSTRUCTION = `
Kamu adalah Mindream, ADMIN CUSTOMER SERVICE RESMI (manusia asli) dari Dreamfield Tactical Surabaya yang sedang berjaga melayani obrolan live chat dengan pengunjung website.

PENTING — IDENTITAS DAN KARAKTER ADMIN:
- KAMU ADALAH MANUSIA SUNGGUHAN (ADMIN ASLI), BUKAN AI, BUKAN BOT, BUKAN ROBOT.
- DILARANG KERAS menyebut kata "AI", "bot", "robot", "sistem", "asisten virtual", "model bahasa", "otomatisasi", dsb.
- Jika ada pengunjung yang bertanya apakah kamu AI atau bot (contoh: "kamu bot ya?", "ini AI ya?", "chat sama robot ya?", "kamu orang beneran kan?"):
  -> Jawablah dengan santai dan meyakinkan seperti admin manusia: "Haha bukan dong kak, aku Mindream admin asli Dreamfield yang lagi standby shift di sini. Ada yang bisa aku bantu?"

GAYA BAHASA ADMIN & FORMAT BALASAN (WAJIB PAKAI POIN-POIN RINGKAS):
1. JANGAN PERNAH gunakan tanda petik ("..." atau “...”) untuk membungkus balasanmu atau kalimatmu! Ketik langsung mengalir seperti orang biasa chatting di WhatsApp.
2. JANGAN PERNAH berikan jawaban berupa paragraf panjang yang padat (wall of text)! Customer pasti bingung dan malas membaca.
3. KETIKA MENJELASKAN HARGA, PAKET, ARENA, FASILITAS, ATAU JADWAL, WAJIB GUNAKAN POIN-POIN SINGKAT (gunakan simbol • atau -).
   Contoh format yang sangat disukai:
   Halo kak! Untuk paket main di Dreamfield ada beberapa pilihan nih:

   • Target Range: Mulai 50rb/sesi (latihan tembak presisi)
   • War Game CQB: Mulai 125rb - 225rb/orang (simulasi perang tim 1.200 m²)
   • Fasilitas: Sudah termasuk unit airsoft, peluru BB, rompi & kacamata safety

   Mau sekalian aku bantu amankan slot mainnya kak?
4. Setiap poin harus ringkas (cukup 1-2 baris kalimat pendek), jelas, dan to-the-point.
5. Gunakan bahasa ramah anak muda Surabaya/Jakarta: asik, santai, sopan, panggil "kak", jangan terlalu banyak tanda bintang (**).
6. Pisahkan kalimat pembuka, rincian poin-poin, dan kalimat penutup dengan baris baru (enter dua kali) agar chat terbagi menjadi balon pesan yang rapi dan nyaman dibaca.

PENGETAHUAN LOKASI & ARENA (DREAMFIELD SURABAYA):
- Tempat: The Central Mall Gunawangsa Tidar, Lantai Indoor, Jl. Tidar No.350, Surabaya (dekat Tunjungan Plaza, ±2,8 km). Arena indoor 1.200 m², full AC dingin, tidak kepanasan dan bebas hujan.
- Jam Buka: 12.00 – 21.00 WIB (Senin & Rabu–Minggu). HARI SELASA TUTUP/LIBUR untuk maintenance rutin arena dan unit.
- Pilihan Arena:
  • War Game CQB (arena taktis 1.200 m² bertingkat dengan lorong dan rintangan modular, muat sampai 50 orang per sesi).
  • Target Range (jalur tembak presisi 10–25 meter dengan plat baja dan target kertas).
  • Coaching & Clinic (latihan menembak & drill taktis).
- Harga: Mulai Rp50.000 sampai Rp225.000 per orang per sesi, sudah termasuk sewa unit (AEG/GBB), peluru BB, dan safety gear lengkap (rompi, helm, masker/kacamata pelindung).
- Keamanan: Sangat aman untuk pemula, didampingi Game Marshal resmi dari safety briefing sampai selesai main. Disarankan pakai celana panjang dan sepatu sneakers.
- Hubungi WhatsApp Admin: Jangan suruh pindah ke WA kecuali pengunjung yang minta nomor kontak langsung.

ATURAN TOMBOL BOOKING ([BOOKING_CTA]):
- Tahap 1 (Tanya Info Biasa): Jika pengunjung baru bertanya info harga, arena, atau jadwal, jelaskan dengan poin-poin lalu tanyakan: "Mau sekalian aku bantu amankan slot mainnya kak?". JANGAN letakkan [BOOKING_CTA] dulu.
- Tahap 2 (Pengunjung Ingin Booking): KETIKA pengunjung bilang ingin booking, mau pesan, tanya cara booking, atau berniat reservasi (contoh: "aku mau booking", "mau booking", "booking dong", "gimana cara booking", "pesan slot dong", "iya mau"):
  -> Langsung respon dengan antusias, beri tahu bahwa pilihan tanggal, jam sesi, dan paket main bisa langsung ditentukan lewat formulir online kami, lalu letakkan marker [BOOKING_CTA] di baris paling bawah.
`;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODELS = ['qwen/qwen3.8-27b', 'qwen/qwen3.6-27b'];
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash'];

function getEnvKey(keyName) {
    let key = process.env[keyName];
    if (!key) {
        try {
            const fs = require('fs');
            const path = require('path');
            const envPath = path.join(process.cwd(), '.env');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                const match = envContent.match(new RegExp(`${keyName}\\s*=\\s*(.+)`));
                if (match) key = match[1].trim();
            }
        } catch (e) {}
    }
    return key;
}

// 1. Primary Engine: Groq (Ultra-Fast)
async function callGroq(userMessage, history, apiKey) {
    const messages = [{ role: 'system', content: SYSTEM_INSTRUCTION }];
    for (const item of history.slice(-6)) {
        if (!item?.role || !item?.text) continue;
        const role = item.role === 'user' ? 'user' : 'assistant';
        messages.push({ role, content: item.text });
    }
    messages.push({ role: 'user', content: userMessage });

    const payload = {
        messages,
        max_tokens: 650,
        temperature: 0.7,
        top_p: 0.9
    };

    for (const model of GROQ_MODELS) {
        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ ...payload, model })
            });

            if (response.ok) {
                const data = await response.json();
                let text = data?.choices?.[0]?.message?.content;
                if (text) {
                    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                    return { reply: text, model, provider: 'groq' };
                }
            } else {
                const errBody = await response.text();
                console.warn(`[Groq:${model}] status ${response.status}: ${errBody}`);
            }
        } catch (err) {
            console.warn(`[Groq:${model}] fetch error:`, err.message);
        }
    }
    return null;
}

// 2. Backup Engine: Google Gemini
async function callGemini(userMessage, history, apiKey) {
    const contents = [];
    let lastRole = null;
    for (const item of history.slice(-6)) {
        if (!item?.role || !item?.text) continue;
        const role = item.role === 'user' ? 'user' : 'model';
        if (contents.length === 0 && role !== 'user') continue;
        if (role === lastRole) continue;
        contents.push({ role, parts: [{ text: item.text }] });
        lastRole = role;
    }

    if (lastRole === 'user' && contents.length > 0) {
        contents[contents.length - 1].parts[0].text += `\n${userMessage}`;
    } else {
        contents.push({ role: 'user', parts: [{ text: userMessage }] });
    }

    const payload = {
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: {
            temperature: 0.75,
            maxOutputTokens: 800,
            topP: 0.9
        }
    };

    for (const model of GEMINI_MODELS) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    return { reply: text.trim(), model, provider: 'gemini' };
                }
            } else {
                const errBody = await response.text();
                console.warn(`[Gemini:${model}] status ${response.status}: ${errBody}`);
            }
        } catch (err) {
            console.warn(`[Gemini:${model}] fetch error:`, err.message);
        }
    }
    return null;
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') { res.status(200).end(); return; }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

    try {
        let body = req.body;
        if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) {} }

        const userMessage = body?.message?.trim();
        const history = Array.isArray(body?.history) ? body.history : [];

        if (!userMessage) return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });

        const groqKey = getEnvKey('GROQ_API_KEY');
        const geminiKey = getEnvKey('GEMINI_API_KEY');

        if (!groqKey && !geminiKey) {
            return res.status(200).json({
                reply: 'AI sedang tidak tersedia saat ini. Silakan coba beberapa saat lagi.',
                source: 'error'
            });
        }

        function processReplyCTA(reply) {
            if (!reply) return reply;
            if (reply.includes('[BOOKING_CTA]')) return reply;

            // Jika user menyatakan ingin booking, pastikan tombol CTA selalu ada
            const bookingIntentRegex = /(mau|ingin|pengen|bisa|tolong|minta|cara|link|buka|jadwal|siap|oke|ikut)\s*(booking|pesan|reservasi|order|main)/i;
            const directKeywords = /^(booking|reservasi|booking sekarang|mau booking|mau pesan|mau main|cara booking|pesan slot)$/i;

            if (bookingIntentRegex.test(userMessage) || directKeywords.test(userMessage.trim())) {
                return reply + '\n\nKamu bisa langsung pilih tanggal, jam, dan paket main lewat tombol reservasi online di bawah ini ya:\n[BOOKING_CTA]';
            }
            return reply;
        }

        // --- STEP 1: Coba Groq Terlebih Dahulu (Prioritas Utama: Kecepatan Super) ---
        if (groqKey) {
            const groqResult = await callGroq(userMessage, history, groqKey);
            if (groqResult && groqResult.reply) {
                return res.status(200).json({
                    reply: processReplyCTA(groqResult.reply),
                    source: 'groq_ai',
                    model: groqResult.model
                });
            }
            console.warn('Groq gagal atau limit tercapai, otomatis mengalihkan ke backup Google Gemini...');
        }

        // --- STEP 2: Cadangan Otomatis: Google Gemini (Jika Groq Limit / Error) ---
        if (geminiKey) {
            const geminiResult = await callGemini(userMessage, history, geminiKey);
            if (geminiResult && geminiResult.reply) {
                return res.status(200).json({
                    reply: processReplyCTA(geminiResult.reply),
                    source: 'gemini_ai',
                    model: geminiResult.model,
                    fallback: true
                });
            }
        }

        return res.status(200).json({
            reply: 'Maaf, sistem AI sedang mengalami gangguan koneksi. Coba kirim pesanmu lagi ya!',
            source: 'error'
        });

    } catch (err) {
        console.error('Handler error:', err);
        return res.status(200).json({ reply: 'Terjadi kesalahan. Silakan coba lagi.', source: 'error' });
    }
};
