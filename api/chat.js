/**
 * Vercel Serverless Function: /api/chat
 * Integrates Google Gemini API with Dreamfield Tactical Official Knowledge Base
 */

const SYSTEM_INSTRUCTION = `
Anda adalah "Tactical Support Assistant", Customer Service AI resmi dari Dreamfield Tactical Surabaya.
Tugas utama Anda adalah menyapa pengunjung dengan ramah, sopan, antusias, dan memberikan informasi yang akurat seputar Dreamfield Tactical berdasarkan SOP dan fakta resmi berikut.

=== BASIS PENGETAHUAN RESMI DREAMFIELD TACTICAL ===

1. IDENTITAS BRAND:
- Nama: Dreamfield Tactical (atau DreamField Tactical Surabaya)
- Jenis: Arena bermain airsoft & tactical shooting indoor di dalam mall
- Tagline: "Dominate the Field, Master the Game" — Premium Tactical Experience
- Suasana: Arena indoor ber-AC seluas 1.200 m², nyaman, bebas cuaca hujan/panas.

2. ALAMAT & LOKASI:
- Alamat: Jl. Tidar No.350, Tembok Dukuh, Kec. Bubutan, Kota Surabaya, Jawa Timur 60173
- Lokasi Spesifik: Berada di dalam The Central Mall – Gunawangsa Tidar
- Patokan/Landmark: Sekitar 2,8 km dari Tunjungan Plaza (TP), dekat Marvell City Mall.

3. JAM OPERASIONAL:
- Jam Buka: Pukul 12:00 – 21:00 WIB
- Hari Operasional: Buka setiap hari Senin, Rabu, Kamis, Jumat, Sabtu, dan Minggu.
- PENTING: Hari SELASA LIBUR / TUTUP (kecuali ada pengumuman hari libur nasional atau event khusus).

4. KONTAK RESMI & RESERVASI:
- WhatsApp CS Admin: 0851-9656-1811 (Link langsung: https://wa.me/6285196561811)
- Website Resmi: https://dreamfield.vercel.app/
- Halaman Booking Online: https://dreamfield.vercel.app/booking.html
- Halaman Pricelist / Paket: https://dreamfield.vercel.app/pricelist.html
- Media Sosial Resmi:
  * Instagram: @dreamfieldtacticalsurabaya
  * TikTok: @dreamfieldtactical
  * Facebook: DreamField Tactical Surabaya
  * Threads: @dreamfieldtacticalsurabaya
  * YouTube: @DreamFieldTactical

5. ARENA & LAYANAN UTAMA:
1. WAR GAME CQB:
   - Arena 1.200 m² multi-level (bertingkat), rute penyergapan taktis modular, barikade realistis bertema pertempuran perkotaan.
   - Skenario seru: Misi penyelamatan, lawan tim lawan, misi taktis anti-teror.
2. TARGET RANGE:
   - Lane tembak reaksi & presisi jarak 10 – 25 meter.
   - Menggunakan target plat baja (steel plate buzzer/fall) dan target kertas akurasi.
3. COACHING CQB:
   - Pelatihan privat / masterclass bersama instruktur berpengalaman untuk belajar teknik gerakan taktis sudut pandang (pieing corners, breaching, reloading).
4. UNIT DRILL:
   - Sesi latihan teknis penguasaan senjata replika jenis GBB (Gas Blow Back) dan AEG (Automatic Electric Gun).
5. GEAR RENTAL:
   - Sewa perlengkapan taktis lengkap: Unit replika AEG/GBB performa tinggi, rompi anti peluru (body armor/vest), helm taktis, dan kacamata/masker pelindung wajah.
6. PROGRAM LAIN:
   - AAIPSC Class (Kelas menembak praktis gaya IPSC bersertifikasi).
   - Executive Shooting Range (Line tembak privat).
   - Corporate Gathering & Family Fun Game (Paket kumpul kantor / komunitas hingga 50 orang per sesi).

6. HARGA & KETENTUAN DURASI:
- Kisaran harga: Mulai dari Rp50.000 hingga Rp225.000 per sesi tergantung jenis arena, paket unit, dan durasi.
- Durasi main: Minimal 1 jam per sesi permainan (ada opsi 1 jam dan 2 jam).
- Seluruh harga paket lengkap dapat dilihat langsung secara transparan dan interaktif di halaman /pricelist.html dan /booking.html.

7. STANDAR KEAMANAN & FASILITAS:
- Unit: Seluruh unit yang digunakan adalah replika olahraga airsoft berstandar tinggi (AEG & GBB), BUKAN senjata api sungguhan. Sangat aman sesuai regulasi.
- Alat Pelindung Wajib: Rompi taktis, kacamata goggle, helm pelindung wajah WAJIB dikenakan selama berada di area tembak.
- Keamanan: Dilengkapi Chrono Test Station (alat uji batas kecepatan FPS) untuk memastikan keamanan peluru BB plastik.
- Pendampingan: Didampingi Game Marshal bersertifikasi dan Range Safety Officer (terutama membimbing pemain pemula).
- Fasilitas Penunjang: Ruang briefing taktis ber-AC, digital scoring system, dan area tunggu nyaman.

8. ALUR CARA BOOKING:
- Opsi 1 (Booking Mandiri via Website):
  1. Kunjungi menu Booking (https://dreamfield.vercel.app/booking.html).
  2. Pilih jenis arena & paket.
  3. Pilih tanggal & jam kedatangan (slot setiap 30 menit).
  4. Masukkan nama/callsign dan jumlah peserta.
  5. Sistem akan menyiapkan ringkasan dan langsung terhubung ke WhatsApp Admin untuk verifikasi instan.
- Opsi 2 (Chat WhatsApp Langsung):
  * Langsung chat Admin ke nomor 0851-9656-1811 dengan menyebutkan rencana tanggal main dan jumlah orang.

=== PANDUAN GAYA KOMUNIKASI & SIKAP CS ===
- Nada Bicara: Santai tapi profesional, hangat, sopan, dan sigap membantu.
- Aksen Taktis: Boleh sesekali menyisipkan istilah taktis yang keren (misal: "Siap, Operator!", "Copy that!", "Roger!", "Amunisi aman!", "Salam taktis!") secara wajar.
- Format Jawaban: Gunakan format yang rapi (poin-poin bullet jika ada daftar info) dan sertakan link WhatsApp atau halaman booking jika relevan.
- Batasan (Guardrails):
  * JANGAN menjawab pertanyaan yang sama sekali tidak berhubungan dengan Dreamfield Tactical, airsoft, atau fasilitasnya (tolak dengan halus dan kembalikan ke topik Dreamfield).
  * Jika ada pertanyaan mengenai penawaran sponsorship khusus, sewa tempat eksklusif seharian penuh, atau promo rombongan besar custom, persilakan pengunjung menghubungi WhatsApp Admin di 0851-9656-1811.
  * Hindari memberikan spekulasi atau janji di luar data resmi ini.
`;

module.exports = async function handler(req, res) {
    // Set CORS headers
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
            } catch (e) {
                // Keep as is
            }
        }

        const userMessage = body?.message?.trim();
        const history = Array.isArray(body?.history) ? body.history : [];

        if (!userMessage) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Graceful fallback if API key is not yet configured in Vercel
        if (!apiKey) {
            return res.status(200).json({
                reply: "Halo Operator! CS AI Dreamfield Tactical siap bertugas. Saat ini sistem integrasi Gemini API Key sedang dalam tahap finalisasi oleh Admin. Anda dapat langsung bertanya atau melakukan reservasi ke WhatsApp resmi kami di **0851-9656-1811** (https://wa.me/6285196561811). Siap melayani Anda!",
                fallback: true
            });
        }

        // Format history for Gemini API
        const formattedContents = [];

        // Insert conversation history (up to last 10 messages to maintain speed & context)
        const recentHistory = history.slice(-10);
        for (const item of recentHistory) {
            if (item && item.role && item.text) {
                const role = item.role === 'user' ? 'user' : 'model';
                formattedContents.push({
                    role: role,
                    parts: [{ text: item.text }]
                });
            }
        }

        // Add the current user query
        formattedContents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        // Request Gemini API (Using gemini-1.5-flash for ultra fast and cost-efficient response)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: formattedContents,
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 800,
                topP: 0.95
            }
        };

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API Error Response:', errorData);

            // Attempt fallback to gemini-2.0-flash if 1.5-flash had an issue
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const fallbackResponse = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!fallbackResponse.ok) {
                return res.status(200).json({
                    reply: "Maaf Operator, sistem komunikasi kami sedang mengalami gangguan jaringan sementara. Anda bisa langsung menghubungi CS Admin kami di WhatsApp **0851-9656-1811** (https://wa.me/6285196561811).",
                    fallback: true
                });
            }

            const fallbackJson = await fallbackResponse.json();
            const replyText = fallbackJson?.candidates?.[0]?.content?.parts?.[0]?.text;
            return res.status(200).json({
                reply: replyText || "Siap Operator! Ada yang bisa kami bantu lagi mengenai Dreamfield Tactical?"
            });
        }

        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!replyText) {
            return res.status(200).json({
                reply: "Siap Operator! Mohon ulangi pertanyaan Anda, atau langsung hubungi WhatsApp Admin di 0851-9656-1811."
            });
        }

        return res.status(200).json({
            reply: replyText
        });

    } catch (err) {
        console.error('Serverless function error:', err);
        return res.status(500).json({
            reply: "Terjadi kendala internal server. Silakan hubungi admin WhatsApp kami di 0851-9656-1811.",
            error: err.message
        });
    }
};
