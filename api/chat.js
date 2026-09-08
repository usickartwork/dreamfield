/**
 * Vercel Serverless Function: /api/chat
 * Integrates Google Gemini API with Dreamfield Tactical Official Knowledge Base
 * System Instruction fully aligned with Dreamfield AI Customer Service Persona & Guidelines.
 */

const SYSTEM_INSTRUCTION = `Kamu adalah asisten AI yang ramah, santai, cerdas, dan luwes. Jawablah setiap pertanyaan, topik diskusi, atau obrolan pengguna dengan pengetahuanmu secara natural, mengalir, dan mudah dipahami dalam bahasa Indonesia yang luwes. Jangan kaku dan jangan gunakan bahasa template birokratis.`;


// Context-Aware Smart Fallback Engine
function getSmartFallbackResponse(userMessage, history = []) {
    const q = userMessage.toLowerCase().trim();
    
    // Get last bot and user context from history
    const lastExchange = history.slice(-2);
    const prevContext = lastExchange.map(m => m.text).join(' ').toLowerCase();

    // Sapaan
    if (['halo', 'hai', 'hi', 'pagi', 'siang', 'sore', 'malam', 'tes', 'test', 'halo min', 'min'].includes(q)) {
        return "Halo! Ada yang bisa aku bantu seputar arena, jadwal, atau paket main di Dreamfield?";
    }

    // Jam operasional & hari
    if (q.includes('jam') || q.includes('buka') || q.includes('tutup') || q.includes('jadwal') || q.includes('operasional') || q.includes('selasa') || (prevContext.includes('jam') && (q.includes('besok') || q.includes('hari')))) {
        if (q.includes('selasa')) {
            return "Khusus hari Selasa Dreamfield libur ya untuk maintenance arena. Di hari lain (Senin, dan Rabu sampai Minggu) buka normal jam 12.00–21.00 WIB.";
        }
        return "Dreamfield buka jam 12.00 sampai 21.00 WIB ya, dari Senin dan Rabu sampai Minggu. Khusus hari Selasa kita libur.";
    }

    // Lokasi & Alamat
    if (q.includes('lokasi') || q.includes('alamat') || q.includes('di mana') || q.includes('dimana') || q.includes('tidar') || q.includes('mall') || q.includes('surabaya')) {
        return "Lokasi kita ada di The Central Mall Gunawangsa Tidar lantai indoor, Jl. Tidar No.350 Surabaya (dekat Tunjungan Plaza). Arenanya full AC seluas 1.200 m², jadi nyaman dan sejuk.";
    }

    // Harga & Biaya
    if (q.includes('harga') || q.includes('biaya') || q.includes('paket') || q.includes('tarif') || q.includes('berapa') || q.includes('pricelist')) {
        return "Untuk main di Dreamfield mulai dari Rp50.000 sampai Rp225.000 per sesi tergantung arena dan paket senjata yang dipilih. Semuanya sudah lengkap dipinjamkan safety gear (rompi, helm, pelindung wajah, dan peluru). Rincian paket lengkap bisa kamu cek di menu Pricelist web ini ya.";
    }

    // Perbedaan War Game vs Target Range
    if (q.includes('beda') || q.includes('perbedaan') || q.includes('wargame') || q.includes('target range') || q.includes('mode')) {
        return "Bedanya: War Game CQB itu pertempuran taktis tim lawan tim di arena bertingkat 1.200 m² buat selesaikan misi. Kalau Target Range itu jalur tembak presisi 10–25 meter untuk melatih akurasi ke plat baja dan target kertas.";
    }

    // Keamanan / Pemula / Sakit
    if (q.includes('aman') || q.includes('safety') || q.includes('sakit') || q.includes('pemula') || q.includes('pertama kali') || q.includes('takut')) {
        return "Aman banget kok, pemula tanpa pengalaman pun bisa langsung main! Setiap pemain wajib pakai rompi tebal, helm pelindung wajah penuh, dan didampingi Game Marshal yang ngasih briefing taktis sebelum main. Pelurunya juga BB plastik standar olahraga.";
    }

    // Pakaian yang disarankan
    if (q.includes('baju') || q.includes('pakaian') || q.includes('celana') || q.includes('sepatu') || q.includes('kostum')) {
        return "Disarankan pakai celana panjang yang nyaman bergerak dan sepatu tertutup bertali (sneakers). Hindari pakai sandal ya. Kalau rompi, helm, dan kacamata pelindung sudah kami sediakan lengkap.";
    }

    // Jumlah orang / Sendiri
    if (q.includes('sendiri') || q.includes('minimal') || q.includes('berapa orang') || q.includes('rombongan') || q.includes('kapasitas')) {
        return "Untuk Target Range bisa main sendiri atau berdua. Kalau War Game CQB paling seru minimal 4–6 orang. Kalau kamu datang sendiri atau berdua mau main War Game, nanti bisa digabung dengan sesi pemain lain yang lagi main kok.";
    }

    // Booking
    if (q.includes('booking') || q.includes('pesan') || q.includes('reservasi') || q.includes('daftar') || q.includes('cara main')) {
        return "Kamu bisa langsung reservasi lewat menu Booking Online di website ini. Tinggal pilih arena, paket, tentukan tanggal serta jam slotnya, dan isi nama pemain.";
    }

    // Default conversational response (Helpful, no deflection)
    return "Siap! Untuk info di Dreamfield, kita ada arena pertempuran War Game CQB indoor 1.200 m² dan Target Range latihan tembak presisi. Ada hal tertentu yang mau kamu tanyakan seputar harga, jadwal, atau aturan mainnya?";
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

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
            try {
                body = JSON.parse(body);
            } catch (e) {}
        }

        const userMessage = body?.message?.trim();
        const history = Array.isArray(body?.history) ? body.history : [];

        if (!userMessage) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        let apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            try {
                const fs = require('fs');
                const path = require('path');
                const envPath = path.join(process.cwd(), '.env');
                if (fs.existsSync(envPath)) {
                    const envContent = fs.readFileSync(envPath, 'utf8');
                    const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.+)/);
                    if (match) apiKey = match[1].trim();
                }
            } catch (e) {}
        }

        // When API key is not available at all, use the natural context-aware fallback engine
        if (!apiKey) {
            const reply = getSmartFallbackResponse(userMessage, history);
            return res.status(200).json({
                reply: reply,
                source: 'knowledge_engine'
            });
        }

        // Prepare properly alternating contents for Gemini API
        const formattedContents = [];
        const recentHistory = history.slice(-8);

        let lastRole = null;
        for (const item of recentHistory) {
            if (item && item.role && item.text) {
                let role = item.role === 'user' ? 'user' : 'model';
                // Gemini requires conversation to start with 'user'
                if (formattedContents.length === 0 && role !== 'user') {
                    continue;
                }
                // Gemini requires alternating roles
                if (role === lastRole) {
                    continue;
                }
                formattedContents.push({
                    role: role,
                    parts: [{ text: item.text }]
                });
                lastRole = role;
            }
        }

        // Ensure user message is added
        if (lastRole === 'user' && formattedContents.length > 0) {
            formattedContents[formattedContents.length - 1].parts[0].text += `\n${userMessage}`;
        } else {
            formattedContents.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });
        }

        const payload = {
            systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: formattedContents,
            generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 1000,
                topP: 0.95
            }
        };

        // Try primary model (gemini-3.6-flash), then fallback to gemini-3.5-flash
        const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash'];
        let replyText = null;

        for (const model of modelsToTry) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const response = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (replyText) {
                        break;
                    }
                } else {
                    const errBody = await response.text();
                    console.error(`Gemini (${model}) error status:`, response.status, errBody);
                }
            } catch (callErr) {
                console.error(`Error calling ${model}:`, callErr);
            }
        }

        if (!replyText) {
            const reply = getSmartFallbackResponse(userMessage, history);
            return res.status(200).json({ reply, source: 'fallback' });
        }

        return res.status(200).json({
            reply: replyText.trim(),
            source: 'gemini_ai'
        });

    } catch (err) {
        console.error('Serverless error:', err);
        const reply = getSmartFallbackResponse(req.body?.message || '', req.body?.history || []);
        return res.status(200).json({ reply });
    }
};
