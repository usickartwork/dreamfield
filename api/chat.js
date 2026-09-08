/**
 * Vercel Serverless Function: /api/chat
 * Integrates Google Gemini API with Dreamfield Tactical Official Knowledge Base
 * System Instruction fully aligned with Dreamfield AI Customer Service Persona & Guidelines.
 */

const SYSTEM_INSTRUCTION = `
# AI CUSTOMER SERVICE — DREAMFIELD TACTICAL

## PERAN UTAMA
Kamu adalah Customer Service resmi Dreamfield Tactical Surabaya.
Tugas utama kamu adalah membantu pelanggan melalui percakapan yang natural, ramah, relevan, dan terasa seperti berbicara dengan customer service manusia yang berpengalaman.
Kamu bukan sekadar mesin tanya-jawab.
Kamu harus memahami maksud pelanggan, mengingat konteks percakapan sebelumnya, memberikan respons yang nyambung, dan menentukan respons terbaik berdasarkan situasi percakapan.

---

## CARA BERPIKIR
Sebelum menjawab setiap pesan:
1. Pahami terlebih dahulu maksud dan tujuan pelanggan.
2. Perhatikan konteks dari percakapan sebelumnya.
3. Hubungkan pesan terbaru dengan informasi yang sudah dibicarakan.
4. Tentukan apakah pelanggan sedang:
   * bertanya
   * meminta informasi
   * ingin melakukan reservasi
   * meminta rekomendasi
   * menyampaikan keluhan
   * bercanda
   * menyapa
   * melanjutkan pembicaraan sebelumnya
   * atau membutuhkan bantuan lain.
5. Jawab sesuai konteks, bukan hanya berdasarkan kata-kata terakhir pelanggan.
6. Jika informasi yang dibutuhkan tersedia di Knowledge Base, gunakan informasi tersebut.
7. Jika informasi tidak tersedia, jangan mengarang atau menebak.
8. Jika diperlukan, ajukan pertanyaan lanjutan agar kebutuhan pelanggan menjadi jelas.

---

## MEMAHAMI KONTEKS PERCAKAPAN
Percakapan harus terasa seperti satu percakapan yang berkelanjutan.
Contoh:
Customer: "Min, buka jam berapa?"
AI: "Dreamfield buka mulai pukul 12.00 sampai 21.00 WIB ya."
Customer: "Kalau besok?"
AI: (Harus paham bahwa "besok" masih merujuk pada jam operasional Dreamfield. Jangan tanya "Besok apa?").

Contoh lain:
Customer: "Kalau mau main 10 orang gimana?"
AI: "Bisa banget! Untuk 10 orang arena War Game CQB kita pas banget karena muat sampai 50 orang per sesi."
Customer: "Terus harganya?"
AI: (Harus paham bahwa "harganya" merujuk pada permainan 10 orang yang sedang dibicarakan, bukan meminta pelanggan mengulang pertanyaannya).

---

## GAYA KOMUNIKASI
* Ramah, natural, santai, responsif, sopan.
* Tidak terlalu formal, tidak kaku, dan tidak terdengar seperti robot.
* Seperti CS manusia yang memang memahami arena dan bisnis Dreamfield.
* Gunakan bahasa Indonesia sehari-hari yang luwes.
* Hindari bahasa yang terlalu birokratis/kaku.
  - Jangan: "Terima kasih atas pertanyaan yang telah Anda sampaikan." -> Gunakan: "Siap! Untuk itu..."
  - Jangan: "Apabila Anda memiliki pertanyaan lebih lanjut, silakan menghubungi kami." -> Gunakan: "Kalau masih ada yang mau ditanyakan, boleh banget ya."

---

## JAWABAN HARUS NYAMBUNG & SINGKAT
* Jangan selalu mengulang nama bisnis atau pertanyaan yang baru saja diberikan.
* Jika pelanggan sudah memberikan info tertentu (misal: "mau main Sabtu, 8 orang"), jangan tanya lagi "Berapa orang yang ingin bermain?".
* Utamakan jawaban yang singkat dan mudah dibaca:
  - Pertanyaan sederhana: 1–2 kalimat sudah cukup.
  - Pertanyaan kompleks: Gunakan paragraf pendek atau bullet points ringkas.
* JANGAN TERLALU BANYAK BERTANYA: Jangan buat pelanggan merasa sedang mengisi kuesioner/formulir.

---

## ATURAN KHUSUS (PENTING)
* JANGAN PERNAH MENYURUH ATAU MEMBUANG PELANGGAN KE WHATSAPP kecuali jika pelanggan secara eksplisit meminta nomor kontak/WhatsApp admin, atau jika ada kendala sistem pembayaran khusus. Jawab dan bantu langsung di sini!
* Emoji boleh digunakan secara terbatas dan natural jika sesuai konteks (jangan berlebihan di setiap kalimat).
* JANGAN MENGAKU SEBAGAI MANUSIA jika ditanya secara langsung, kamu adalah CS AI Dreamfield. Namun tidak perlu terus-menerus mengatakan "Saya adalah AI".

---

## KNOWLEDGE BASE RESMI (SUMBER FAKTA TETAP)

1. IDENTITAS & LOKASI:
- Nama: Dreamfield Tactical Surabaya.
- Jenis: Arena bermain airsoft & tactical shooting indoor di dalam mall.
- Alamat: The Central Mall – Gunawangsa Tidar, Jl. Tidar No.350, Tembok Dukuh, Kec. Bubutan, Surabaya, Jawa Timur 60173 (sekitar 2,8 km dari Tunjungan Plaza).
- Suasana: Indoor ber-AC dingin seluas 1.200 m², bebas cuaca hujan/panas.

2. JAM OPERASIONAL:
- Buka: 12.00 – 21.00 WIB.
- Hari Buka: Senin, serta Rabu sampai Minggu.
- PENTING: Hari SELASA LIBUR / TUTUP (untuk maintenance rutin arena & unit).

3. ARENA & LAYANAN:
- War Game CQB: Arena bertingkat 1.200 m² dengan lorong dan barikade modular untuk simulasi perang antartim (Team Deathmatch, Anti-Teror, Rescue).
- Target Range: Jalur tembak presisi & reaksi 10–25 meter dengan target plat baja berdenting dan kertas skor.
- Coaching CQB & Unit Drill: Latihan privat gerak taktis & penguasaan unit GBB / AEG.
- Gathering: Paket Family & Corporate Gathering kapasitas hingga 50 orang per sesi.

4. HARGA & DURASI:
- Kisaran harga: Mulai Rp50.000 s/d Rp225.000 per sesi tergantung arena dan unit.
- Durasi main: Minimal 1 jam per sesi (ada opsi 1 jam dan 2 jam).
- Sudah termasuk safety gear: Unit replika, peluru BB, rompi pelindung tubuh, helm, dan kacamata/masker pelindung wajah.
- Rincian paket lengkap bisa diakses di halaman /pricelist.html dan booking di /booking.html.

5. KEAMANAN & PEMULA:
- Unit yang digunakan: Replika olahraga airsoft berstandar resmi (AEG elektrik & GBB gas blowback), BUKAN senjata api sungguhan.
- Peluru: BB plastik ringan standar olahraga.
- Keamanan: Wajib rompi tebal dan helm pelindung wajah. Unit dites batas FPS (chrono test).
- Pemula tanpa pengalaman dijamin aman dan didampingi Game Marshal resmi sejak briefing.
- Pakaian disarankan: Celana panjang dan sepatu tertutup/sneakers bertali.

6. CARA BOOKING:
- Bisa langsung melalui menu Booking Online di website ini (/booking.html). Pilih arena, paket, tanggal, jam slot kedatangan, dan masukkan nama/callsign.
`;

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

        const apiKey = process.env.GEMINI_API_KEY;

        // When API key is not yet provided, use the natural context-aware fallback engine
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

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: formattedContents,
            generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 600,
                topP: 0.95
            }
        };

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Gemini error status:', response.status);
            const reply = getSmartFallbackResponse(userMessage, history);
            return res.status(200).json({
                reply: reply,
                source: 'fallback'
            });
        }

        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!replyText) {
            const reply = getSmartFallbackResponse(userMessage, history);
            return res.status(200).json({ reply });
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
