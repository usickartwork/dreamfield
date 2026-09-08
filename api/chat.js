/**
 * Vercel Serverless Function: /api/chat
 * Pure Google Gemini AI with Dreamfield knowledge context.
 */

const SYSTEM_INSTRUCTION = `
Kamu adalah AI companion dari Dreamfield Surabaya — ramah, santai, cerdas, dan luwes seperti teman ngobrol.

Jawablah setiap topik secara natural dan mengalir menggunakan pengetahuanmu sendiri. Jangan kaku, jangan pakai bahasa birokratis, dan jangan tolak topik apapun.

Kamu punya pengetahuan latar tentang Dreamfield berikut ini. Gunakan informasi ini hanya saat relevan dengan pertanyaan — jangan dipaksakan jika tidak nyambung:

---
DREAMFIELD — ARENA AIRSOFT & TACTICAL SHOOTING SURABAYA

Tempat: The Central Mall Gunawangsa Tidar, Jl. Tidar No.350, Surabaya (±2,8 km dari Tunjungan Plaza). Arena indoor 1.200 m², full AC, tidak terganggu cuaca.

Jam buka: 12.00–21.00 WIB. Buka Senin & Rabu–Minggu. SELASA TUTUP (maintenance rutin).

Arena yang tersedia:
- War Game CQB: Arena taktis bertingkat 1.200 m² dengan lorong, barikade, dan obstacle modular. Muat sampai 50 orang per sesi. Mode: Team Deathmatch, Search & Destroy, VIP Escort, Domination.
- Target Range: Jalur tembak presisi 10–25 meter dengan plat baja berdenting dan target kertas skor.
- Coaching & Clinic: Latihan teknik menembak, grip, stance, safety handling.
- Gathering: Paket family & corporate untuk grup besar.

Harga: Mulai Rp50.000 – Rp225.000 per sesi, sudah termasuk semua safety gear (unit replika AEG/GBB, peluru BB, rompi taktis, helm, kacamata/masker pelindung wajah).

Unit yang digunakan: Replika airsoft standar olahraga (AEG elektrik & GBB gas blowback). Bukan senjata api. Semua unit wajib lulus chrono test batas FPS sebelum dipakai.

Keamanan pemula: 100% aman. Setiap pemain didampingi Game Marshal resmi sejak safety briefing hingga game selesai. Disarankan pakai celana panjang dan sepatu tertutup/sneakers.

Booking: Melalui menu Booking Online di website (halaman /booking.html).
---

Aturan penting:
- Jangan pernah suruh pelanggan pindah ke WhatsApp kecuali mereka yang duluan minta nomor kontak.
- Kalau diajak ngobrol santai, bercanda, atau tanya hal di luar Dreamfield — tetap jawab dengan luwes dan menyenangkan layaknya Gemini biasa.
`;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) {}
        }

        const userMessage = body?.message?.trim();
        const history = Array.isArray(body?.history) ? body.history : [];

        if (!userMessage) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(200).json({
                reply: 'AI sedang tidak tersedia saat ini. Silakan coba beberapa saat lagi.',
                source: 'error'
            });
        }

        // Build alternating conversation history for Gemini
        const contents = [];
        let lastRole = null;
        for (const item of history.slice(-10)) {
            if (!item?.role || !item?.text) continue;
            const role = item.role === 'user' ? 'user' : 'model';
            if (contents.length === 0 && role !== 'user') continue;
            if (role === lastRole) continue;
            contents.push({ role, parts: [{ text: item.text }] });
            lastRole = role;
        }

        // Add current user message
        if (lastRole === 'user' && contents.length > 0) {
            contents[contents.length - 1].parts[0].text += `\n${userMessage}`;
        } else {
            contents.push({ role: 'user', parts: [{ text: userMessage }] });
        }

        const payload = {
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1000,
                topP: 0.95
            }
        };

        // Try models in order: gemini-3.6-flash → gemini-3.5-flash
        for (const model of ['gemini-3.6-flash', 'gemini-3.5-flash']) {
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
                        return res.status(200).json({ reply: text.trim(), source: 'gemini_ai' });
                    }
                } else {
                    const err = await response.text();
                    console.error(`[${model}] ${response.status}:`, err);
                }
            } catch (e) {
                console.error(`[${model}] fetch error:`, e.message);
            }
        }

        return res.status(200).json({
            reply: 'Maaf, lagi ada gangguan sebentar. Coba kirim pesanmu lagi ya!',
            source: 'error'
        });

    } catch (err) {
        console.error('Handler error:', err);
        return res.status(200).json({
            reply: 'Terjadi kesalahan. Silakan coba lagi.',
            source: 'error'
        });
    }
};
