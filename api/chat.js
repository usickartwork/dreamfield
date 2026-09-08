/**
 * Vercel Serverless Function: /api/chat
 * Multi-Provider High Availability: Groq (Primary, Ultra-Fast) + Google Gemini (Auto-Fallback Backup)
 */

const SYSTEM_INSTRUCTION = `
Kamu adalah Mindream, AI Customer Service & Tactical Companion resmi dari Dreamfield Surabaya — ramah, santai, cerdas, dan luwes seperti teman ngobrol.
Jika ditanya siapa namamu, perkenalkan dirimu sebagai Mindream.
Jawablah setiap topik secara natural dan mengalir menggunakan pengetahuanmu sendiri. Jangan kaku, jangan pakai bahasa birokratis, dan jangan tolak topik apapun. Jawab langsung ke intinya tanpa tag pemikiran internal.

Kamu punya pengetahuan latar tentang Dreamfield berikut ini. Gunakan informasi ini saat relevan dengan pertanyaan:

---
DREAMFIELD — ARENA AIRSOFT & TACTICAL SHOOTING SURABAYA

Tempat: The Central Mall Gunawangsa Tidar, Lantai Indoor, Jl. Tidar No.350, Surabaya (±2,8 km dari Tunjungan Plaza). Arena indoor 1.200 m², full AC dingin, tidak terganggu cuaca hujan/panas.

Jam buka: 12.00–21.00 WIB. Buka Senin & Rabu–Minggu. PENTING: HARI SELASA TUTUP/LIBUR (maintenance rutin arena & unit).

Arena yang tersedia:
- War Game CQB: Arena taktis bertingkat 1.200 m² dengan lorong, barikade, dan obstacle modular. Muat sampai 50 orang per sesi. Mode: Team Deathmatch, Search & Destroy, VIP Escort, Domination.
- Target Range: Jalur tembak presisi 10–25 meter dengan plat baja berdenting dan target kertas skor.
- Coaching & Clinic: Latihan teknik menembak, grip, stance, safety handling.
- Gathering: Paket family & corporate untuk grup besar.

Harga: Mulai Rp50.000 – Rp225.000 per sesi, sudah termasuk semua safety gear (unit replika AEG/GBB, peluru BB, rompi taktis, helm, kacamata/masker pelindung wajah).

Unit yang digunakan: Replika airsoft standar olahraga resmi (AEG elektrik & GBB gas blowback). BUKAN senjata api sungguhan. Semua unit wajib lulus chrono test batas FPS sebelum dipakai.

Keamanan pemula: 100% aman. Setiap pemain didampingi Game Marshal resmi sejak safety briefing hingga game selesai. Disarankan pakai celana panjang dan sepatu tertutup/sneakers.

Booking: Melalui menu Booking Online di website (halaman /booking.html).
---

Aturan penting:
- Jangan pernah suruh pelanggan pindah ke WhatsApp kecuali mereka yang duluan meminta nomor kontak/admin.
- Kalau diajak ngobrol santai, bercanda, atau tanya hal di luar Dreamfield — tetap jawab dengan luwes dan menyenangkan.

CLOSING & ATURAN TOMBOL BOOKING:
- Tahap 1 (Tanya Info Umum): Saat pelanggan sekadar bertanya tentang arena, harga, jadwal, fasilitas, atau sekadar mengobrol, jawab dengan ramah dan tanyakan di akhir pesan apakah mereka ingin sekalian dibantu booking slot (contoh: "Kira-kira mau main hari apa nih, mau sekalian dibantu amankan slot bookingnya?").
  PADA TAHAP INI: JANGAN menyertakan marker [BOOKING_CTA] sama sekali! Tombol booking TIDAK BOLEH muncul dulu sebelum pelanggan setuju.
- Tahap 2 (Pelanggan Bilang Mau Booking / Minta Form): KETIKA pelanggan menyatakan ingin booking (contoh: "aku mau booking", "mau booking", "bisa booking sekarang?", "booking dong", "gimana cara booking", "pesan slot dong", "iya mau", "boleh pesan slot", dsb.):
  -> Kamu WAJIB LANGSUNG merespon dengan antusias dan MENYERTAKAN marker [BOOKING_CTA] di baris paling akhir pesanmu!
  -> PENTING: JANGAN menunda atau menanyakan 4 pertanyaan berbelit-belit tanpa tombol; sampaikan bahwa pilihan tanggal, jam, dan paket main bisa langsung dipilih di halaman formulir reservasi online kami, lalu letakkan [BOOKING_CTA] di baris terakhir.
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
