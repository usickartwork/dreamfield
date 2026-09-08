/**
 * Vercel Serverless Function: /api/chat
 * Powered by Groq Ultra-Fast LPU Inference (OpenAI-compatible)
 */

const SYSTEM_INSTRUCTION = `
Kamu adalah AI companion resmi dari Dreamfield Tactical Surabaya — ramah, santai, cerdas, dan luwes seperti teman ngobrol.

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

CLOSING & BOOKING CTA:
- Kamu bertugas melakukan closing secara natural. Jika pelanggan menunjukkan sinyal ketertarikan atau niat booking (seperti: "mau main", "kapan bisa kesana", "gimana cara booking", "bisa pesan sekarang?", "oke aku mau coba", "berapa harganya", "mau bawa temen", dsb.) — dorong mereka untuk langsung booking dengan kalimat yang hangat dan antusias.
- PENTING: Jika dalam respons kamu ada ajakan atau dorongan untuk booking, tambahkan teks [BOOKING_CTA] di akhir responsmu. Sistem akan otomatis mengubah marker ini menjadi tombol booking di chat. Gunakan [BOOKING_CTA] hanya saat relevan.
`;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODELS = ['qwen/qwen3.8-27b', 'qwen/qwen3.6-27b'];

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

        let apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            try {
                const fs = require('fs');
                const path = require('path');
                const envPath = path.join(process.cwd(), '.env');
                if (fs.existsSync(envPath)) {
                    const envContent = fs.readFileSync(envPath, 'utf8');
                    const match = envContent.match(/GROQ_API_KEY\s*=\s*(.+)/);
                    if (match) apiKey = match[1].trim();
                }
            } catch (e) {}
        }

        if (!apiKey) {
            return res.status(200).json({
                reply: 'AI sedang tidak tersedia saat ini. Silakan coba beberapa saat lagi.',
                source: 'error'
            });
        }

        // Build messages array (OpenAI-compatible format)
        const messages = [{ role: 'system', content: SYSTEM_INSTRUCTION }];

        // Add recent conversation history (last 6 turns)
        for (const item of history.slice(-6)) {
            if (!item?.role || !item?.text) continue;
            const role = item.role === 'user' ? 'user' : 'assistant';
            messages.push({ role, content: item.text });
        }

        // Add current user message
        messages.push({ role: 'user', content: userMessage });

        const payload = {
            messages,
            max_tokens: 600,
            temperature: 0.7,
            top_p: 0.9
        };

        // Try each model in order
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
                        // Strip any internal reasoning tags if model includes them
                        text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                        return res.status(200).json({ reply: text, source: 'groq_ai', model });
                    }
                } else {
                    const err = await response.text();
                    console.error(`[Groq:${model}] ${response.status}:`, err);
                }
            } catch (e) {
                console.error(`[Groq:${model}] fetch error:`, e.message);
            }
        }

        return res.status(200).json({
            reply: 'Maaf, lagi ada gangguan koneksi sebentar. Coba kirim pesanmu lagi ya!',
            source: 'error'
        });

    } catch (err) {
        console.error('Handler error:', err);
        return res.status(200).json({ reply: 'Terjadi kesalahan. Silakan coba lagi.', source: 'error' });
    }
};
