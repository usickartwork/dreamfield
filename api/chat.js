/**
 * Vercel Serverless Function: /api/chat
 * Integrates Google Gemini API with Dreamfield Tactical Official Knowledge Base
 * Features Smart Fallback Knowledge Engine when API Key is not yet configured.
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

// Smart Fallback Matcher: Answers dynamically based on Google Docs knowledge even if Gemini API Key is not yet configured
function getKnowledgeResponse(msg) {
    const q = msg.toLowerCase();

    // Jam buka & Jadwal operasional
    if (q.includes('jam') || q.includes('buka') || q.includes('tutup') || q.includes('jadwal') || q.includes('operasional') || q.includes('selasa') || q.includes('hari apa')) {
        return `**Jam Operasional Dreamfield Tactical Surabaya:**\n\n* **Jam Buka:** Pukul 12:00 – 21:00 WIB\n* **Hari Operasional:** Buka setiap **Senin, Rabu, Kamis, Jumat, Sabtu, dan Minggu**\n* ⚠️ **PENTING:** Hari **SELASA LIBUR / TUTUP** (kecuali hari libur nasional atau reservasi khusus).\n\nAda rencana datang di hari apa nih, Operator?`;
    }

    // Lokasi & Alamat
    if (q.includes('lokasi') || q.includes('alamat') || q.includes('di mana') || q.includes('dimana') || q.includes('mall') || q.includes('tidar') || q.includes('tempat') || q.includes('surabaya')) {
        return `**Lokasi Dreamfield Tactical Surabaya:**\n\n📍 **Alamat:** Jl. Tidar No.350, Tembok Dukuh, Kec. Bubutan, Kota Surabaya, Jawa Timur 60173\n🏢 **Gedung:** Berada di dalam **The Central Mall – Gunawangsa Tidar**.\n🎯 **Landmark:** Sekitar 2,8 km dari Tunjungan Plaza (TP) & dekat Marvell City.\n❄️ **Kondisi Arena:** Indoor ber-AC seluas 1.200 m², nyaman dan sejuk tanpa terganggu hujan atau terik matahari!\n\nPerlu petunjuk arah atau mau langsung reservasi jadwal?`;
    }

    // Harga / Pricelist / Biaya / Paket
    if (q.includes('harga') || q.includes('biaya') || q.includes('paket') || q.includes('bayar') || q.includes('tarif') || q.includes('berapa') || q.includes('pricelist')) {
        return `**Daftar Harga & Paket di Dreamfield Tactical:**\n\n* **Kisaran Harga:** Mulai dari **Rp50.000 s/d Rp225.000** per sesi tergantung arena dan kelengkapan unit.\n* **Durasi Main:** Minimal 1 jam per sesi permainan (tersedia paket 1 jam & 2 jam).\n* **Pilihan Arena:**\n  1. **War Game CQB** (Skirmish taktis di arena bertingkat 1.200 m²)\n  2. **Target Range** (Lane tembak presisi & reaksi 10–25m)\n  3. **Coaching CQB & Unit Drill** (Masterclass taktis)\n  4. **Gear Rental** (Sewa unit AEG/GBB + Full Body Armor)\n\n👉 Anda bisa cek rincian harga lengkap di halaman [Pricelist Resmi](https://dreamfield.vercel.app/pricelist.html) atau langsung pilih slot di [Formulir Booking Online](https://dreamfield.vercel.app/booking.html)!`;
    }

    // Cara Booking / Reservasi
    if (q.includes('booking') || q.includes('pesan') || q.includes('reservasi') || q.includes('daftar') || q.includes('cara main') || q.includes('alur')) {
        return `**Cara Mudah Booking Main di Dreamfield Tactical:**\n\n1. **Booking Online via Website:**\n   * Masuk ke halaman [Booking Online](https://dreamfield.vercel.app/booking.html)\n   * Pilih arena (War Game CQB / Target Range)\n   * Pilih paket unit & durasi (1 jam / 2 jam)\n   * Tentukan tanggal main & jam slot kedatangan (12:00–21:00 WIB)\n   * Isi nama/callsign & jumlah personel, lalu konfirmasi instan ke WhatsApp Admin.\n\n2. **Chat Langsung WhatsApp Admin:**\n   * Bisa langsung chat admin di [0851-9656-1811](https://wa.me/6285196561811) untuk bantuan jadwal cepat.\n\nMau booking untuk berapa orang, Operator?`;
    }

    // Keamanan / Safety / Senjata / Peluru / Pemula
    if (q.includes('aman') || q.includes('safety') || q.includes('senjata') || q.includes('peluru') || q.includes('sakit') || q.includes('replika') || q.includes('airsoft') || q.includes('helm') || q.includes('rompi') || q.includes('pemula')) {
        return `**Standar Keamanan & Perlengkapan di Dreamfield Tactical:**\n\n* **Unit Olahraga:** Menggunakan replika airsoft bersertifikasi (AEG & GBB), **BUKAN senjata api sungguhan**, dengan peluru BB plastik aman.\n* **Chrono Test:** Seluruh unit diuji batas kecepatan tembak (FPS) di stasiun chrono sebelum bermain.\n* **Safety Gear Lengkap (Wajib):** Rompi taktis (body armor), helm pelindung wajah penuh (full-face), dan kacamata goggle wajib dipakai.\n* **Pendampingan:** Selalu didampingi Game Marshal resmi dan Range Safety Officer (sangat ramah untuk pemula pertama kali main)!\n\nBagi pemula, kami juga sediakan ruang briefing taktis ber-AC sebelum turun ke medan laga. Siap uji ketangkasan?`;
    }

    // Kontak / Admin / WhatsApp / Telepon / Medsos
    if (q.includes('kontak') || q.includes('whatsapp') || q.includes('wa') || q.includes('admin') || q.includes('nomor') || q.includes('no') || q.includes('ig') || q.includes('instagram') || q.includes('tiktok')) {
        return `**Kontak Resmi & Media Sosial Dreamfield Tactical:**\n\n* **WhatsApp Admin (Utama):** [0851-9656-1811](https://wa.me/6285196561811)\n* **Website:** [dreamfield.vercel.app](https://dreamfield.vercel.app/)\n* **Instagram:** [@dreamfieldtacticalsurabaya](https://instagram.com/dreamfieldtacticalsurabaya)\n* **TikTok:** [@dreamfieldtactical](https://tiktok.com/@dreamfieldtactical)\n* **YouTube:** @DreamFieldTactical\n\nSilakan klik link nomor WhatsApp di atas untuk langsung terhubung dengan Admin kami!`;
    }

    // Rombongan / Corporate / Event / Gathering
    if (q.includes('rombongan') || q.includes('event') || q.includes('corporate') || q.includes('gathering') || q.includes('kantor') || q.includes('banyak') || q.includes('komunitas')) {
        return `**Program Corporate Gathering & Community Skirmish:**\n\n* Arena Dreamfield Tactical mampu menampung hingga **50 personel** per periode/sesi!\n* Kami menyediakan skenario seru bertema tim taktis, perlombaan skor akurasi digital, dan paket *Family & Corporate Gathering*.\n\nUntuk paket khusus rombongan kantor atau komunitas, silakan langsung hubungi WhatsApp Admin kami di [0851-9656-1811](https://wa.me/6285196561811) agar kami siapkan penawaran terbaik!`;
    }

    // Sapaan umum (Halo, Hai, Pagi, Siang, Malam, Siap)
    if (q === 'halo' || q === 'hai' || q === 'hi' || q === 'pagi' || q === 'siang' || q === 'sore' || q === 'malam' || q === 'tes' || q === 'test') {
        return `Halo Operator! Selamat datang di **Dreamfield Tactical Surabaya**.\n\nSaya CS AI resmi siap membantu Anda. Ada yang bisa saya informasikan seputar:\n* 📍 **Lokasi & Jam Buka**\n* 💰 **Daftar Harga & Paket**\n* 🛡️ **Aturan Safety & Perlengkapan**\n* 📅 **Cara Reservasi / Booking Slot**\n\nSilakan tanyakan apa saja, Operator!`;
    }

    // Default fallback yang tetap mengarahkan
    return `Siap Operator! Pertanyaan Anda tercatat di pusat kendali Dreamfield Tactical.\n\nUntuk informasi detail atau kebutuhan khusus yang belum terjawab, Anda bisa langsung berkonsultasi secara cepat dengan Admin kami via WhatsApp resmi di **0851-9656-1811** (https://wa.me/6285196561811).\n\nAda hal lain seputar jadwal, lokasi, atau paket bermain yang ingin ditanyakan?`;
}

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

        // SMART KNOWLEDGE ENGINE:
        // If API key is not yet configured, provide dynamic answers directly from the Google Docs knowledge base!
        if (!apiKey) {
            const smartReply = getKnowledgeResponse(userMessage);
            return res.status(200).json({
                reply: smartReply,
                source: 'knowledge_base'
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

        // Request Gemini API (Using gemini-1.5-flash for ultra fast response)
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

            // Fallback to Smart Knowledge Engine if Gemini API has temporary rate limit/issue
            const smartReply = getKnowledgeResponse(userMessage);
            return res.status(200).json({
                reply: smartReply,
                source: 'knowledge_base_fallback'
            });
        }

        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!replyText) {
            const smartReply = getKnowledgeResponse(userMessage);
            return res.status(200).json({
                reply: smartReply
            });
        }

        return res.status(200).json({
            reply: replyText,
            source: 'gemini_ai'
        });

    } catch (err) {
        console.error('Serverless function error:', err);
        const fallbackAnswer = getKnowledgeResponse(req.body?.message || '');
        return res.status(200).json({
            reply: fallbackAnswer,
            source: 'offline_fallback'
        });
    }
};
