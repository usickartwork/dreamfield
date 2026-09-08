/**
 * Vercel Serverless Function: /api/chat
 * Integrates Google Gemini API with Dreamfield Tactical Official Knowledge Base
 * Features Deep Knowledge Engine (No WhatsApp redirection unless explicitly requested).
 */

const SYSTEM_INSTRUCTION = `
Anda adalah Customer Service AI resmi dari Dreamfield Tactical Surabaya.
Karakter Anda: Ramah, santun, solutif, berwawasan taktis militer/airsoft yang luas, dan sangat senang membantu pengunjung.

ATURAN PALING PENTING (STRICT GUARDRAILS):
1. JANGAN PERNAH MENYURUH ATAU MENGARAHKAN PENGUNJUNG KE WHATSAPP kecuali jika pengunjung SECARA EKSPLISIT menanyakan nomor kontak atau meminta nomor WhatsApp admin.
2. Anda adalah CS mandiri. Jawab semua pertanyaan pengunjung secara lengkap, mendalam, dan tuntas langsung di dalam chat ini!
3. Pengunjung ingin mendapatkan informasi langsung dari Anda di sini (lokasi, jam buka, harga, perbedaan arena, aturan perlengkapan, tips pemula, dll.).
4. Gunakan Bahasa Indonesia yang luwes, santai tapi profesional. Boleh gunakan sapaan ramah seperti "Halo Operator!", "Siap!", dll.
5. Jaga fokus hanya pada seputar Dreamfield Tactical, airsoft, rekreasi menembak, dan hal terkait.

=== BASIS PENGETAHUAN RESMI DREAMFIELD TACTICAL ===

1. IDENTITAS BRAND & FASILITAS:
- Nama: Dreamfield Tactical (Dreamfield Surabaya).
- Jenis: Arena pertempuran airsoft & tactical shooting indoor di dalam mall.
- Tagline: "Dominate the Field, Master the Game" — Premium Tactical Experience.
- Luas & Suasana: 1.200 m², arena bertingkat (multi-level), ber-AC dingin, bebas panas/hujan, berdekorasi pertempuran kota taktis (CQB urban modular).

2. ALAMAT & LOKASI DETAIL:
- Alamat: Jl. Tidar No.350, Tembok Dukuh, Kec. Bubutan, Surabaya, Jawa Timur 60173.
- Lokasi Spesifik: Lantai The Central Mall – Gunawangsa Tidar.
- Patokan: Hanya sekitar 2,8 km dari Tunjungan Plaza (TP), dekat Marvell City Mall. Akses mudah dan parkir luas di dalam mall.

3. JAM OPERASIONAL:
- Jam Buka: 12:00 – 21:00 WIB.
- Hari Buka: Senin, Rabu, Kamis, Jumat, Sabtu, dan Minggu.
- PENTING: Hari SELASA LIBUR / TUTUP untuk maintenance arena.

4. PILIHAN ARENA & MODE PERMAINAN:
a. WAR GAME CQB (Close Quarters Battle):
   - Arena bertingkat 1.200 m² dengan barikade, lorong, dan rute penyergapan taktis.
   - Skenario seru: Team Deathmatch, Bomb Defusal / Anti-Teror, Rescue Mission.
   - Cocok untuk mabar bareng teman, komunitas, maupun gathering kantor.
b. TARGET RANGE (Shooting Range):
   - Jalur tembak reaksi & akurasi presisi jarak 10 s/d 25 meter.
   - Menggunakan target plat baja (steel plate yang berdenting/jatuh saat kena) dan target kertas skor.
   - Sangat cocok untuk melatih fokus, refleks, dan akurasi menembak.
c. COACHING CQB & UNIT DRILL:
   - Privat masterclass teknik gerak taktis, breaching, pieing corners, reloading cepat.
d. AAIPSC CLASS & EXECUTIVE RANGE:
   - Pelatihan menembak praktis gaya IPSC bersertifikasi dan jalur VIP eksekutif.

5. HARGA, DURASI & PERLENGKAPAN:
- Kisaran harga: Mulai dari Rp50.000 hingga Rp225.000 per sesi tergantung arena dan paket senjata yang dipilih.
- Durasi: Minimal 1 jam per sesi (tersedia opsi 1 jam dan 2 jam).
- Seluruh paket sewa sudah termasuk perlengkapan keamanan (Safety Gear) lengkap: Unit replika, magazine, peluru BB, rompi taktis pelindung dada, helm taktis, dan goggle/masker pelindung wajah penuh.

6. KEAMANAN & TIPS PEMULA:
- Apakah sakit? Peluru yang digunakan adalah BB plastik ringan olahraga airsoft. Karena seluruh pemain WAJIB mengenakan rompi pelindung tebal dan helm full-face, permainan ini sangat aman!
- Chrono Test: Seluruh unit diuji batas kecepatan FPS-nya agar tidak membahayakan.
- Pendampingan: Setiap sesi selalu dipandu oleh Game Marshal resmi dan Range Safety Officer yang mengajarkan cara memegang unit dan aturan kokang/tembak sejak awal. Pemula tanpa pengalaman sama sekali pun dijamin langsung bisa main dengan seru!
- Pakaian yang disarankan: Celana panjang yang nyaman bergerak dan sepatu kets/sneakers bertali (hindari sandal/high heels).

7. CARA BOOKING:
- Pengunjung bisa langsung booking melalui menu Booking di website ini (/booking.html).
- Langkahnya: Pilih arena -> Pilih paket -> Pilih tanggal dan jam slot -> Masukkan nama/callsign & jumlah orang -> Reservasi langsung terdaftar!
`;

// Deep Fallback Knowledge Engine (Answers directly and conversationally without deflecting to WhatsApp)
function getDeepKnowledgeResponse(msg) {
    const q = msg.toLowerCase();

    // 1. Jam buka & Jadwal
    if (q.includes('jam') || q.includes('buka') || q.includes('tutup') || q.includes('jadwal') || q.includes('operasional') || q.includes('selasa') || q.includes('kapan')) {
        return `Dreamfield Tactical buka setiap hari **Senin, serta Rabu sampai Minggu dari pukul 12:00 siang hingga 21:00 malam WIB**.\n\n⚠️ **Catatan penting:** Khusus hari **SELASA kami LIBUR** untuk pemeliharaan rutin arena dan unit.\n\nAnda ada rencana datang di hari apa dan jam berapa nih?`;
    }

    // 2. Lokasi & Alamat
    if (q.includes('lokasi') || q.includes('alamat') || q.includes('di mana') || q.includes('dimana') || q.includes('mall') || q.includes('tidar') || q.includes('tempat') || q.includes('surabaya')) {
        return `Lokasi kami berada di **The Central Mall – Gunawangsa Tidar**, Jl. Tidar No.350, Tembok Dukuh, Kec. Bubutan, Surabaya (sekitar 2,8 km dari Tunjungan Plaza).\n\nArenanya berada di dalam ruangan (indoor) ber-AC seluas 1.200 m², jadi suasana bermain sangat sejuk, nyaman, dan tidak perlu khawatir kepanasan atau kehujanan.`;
    }

    // 3. Harga & Biaya
    if (q.includes('harga') || q.includes('biaya') || q.includes('paket') || q.includes('bayar') || q.includes('tarif') || q.includes('berapa') || q.includes('pricelist')) {
        return `Untuk biaya bermain di Dreamfield Tactical mulai dari **Rp50.000 hingga Rp225.000 per sesi**, tergantung jenis arena dan unit yang Anda pilih:\n\n* **Target Range (Shooting Range):** Mulai Rp50.000-an untuk latihan akurasi menembak target plat baja & kertas.\n* **War Game CQB (Pertempuran Tim):** Arena pertempuran taktis perkotaan 1.200 m² (durasi 1 jam / 2 jam) lengkap dengan sewa unit senjata, rompi taktis, helm, dan peluru BB.\n\nSemua rincian paket dan pilihan senjata bisa langsung Anda lihat dan pilih di menu [Pricelist](https://dreamfield.vercel.app/pricelist.html) atau [Booking Online](https://dreamfield.vercel.app/booking.html) kami!`;
    }

    // 4. Perbedaan War Game vs Target Range
    if (q.includes('beda') || q.includes('perbedaan') || q.includes('wargame') || q.includes('target range') || q.includes('jenis game') || q.includes('mode')) {
        return `Kami memiliki 2 pilihan utama arena bermain:\n\n1. **War Game CQB:** Pertempuran taktis antartim di dalam arena bertingkat seluas 1.200 m² dengan lorong-lorong dan barikade modular. Tujuannya menyelesaikan misi militer seperti lawan teroris atau eliminasi tim lawan.\n2. **Target Range:** Jalur tembak presisi 10–25 meter khusus untuk menguji akurasi, kecepatan reaksi, dan fokus dengan sasaran plat baja dan target kertas.\n\nKira-kira Anda lebih tertarik untuk duel taktis tim (War Game) atau melatih tembakan jitu (Target Range)?`;
    }

    // 5. Apakah Aman / Sakit / Pemula
    if (q.includes('aman') || q.includes('safety') || q.includes('sakit') || q.includes('pemula') || q.includes('pertama kali') || q.includes('takut') || q.includes('aturan')) {
        return `Tenang saja, bermain di Dreamfield Tactical **sangat aman, bahkan untuk yang baru pertama kali main!**\n\nBerikut alasannya:\n* Unit yang digunakan adalah replika olahraga airsoft berstandar resmi (menggunakan peluru BB plastik ringan, bukan senjata api).\n* Semua unit telah melalui **Chrono Test** untuk memastikan batas kecepatan tembak (FPS) aman.\n* Seluruh pemain **wajib mengenakan rompi pelindung tubuh tebal (body vest), helm pelindung kepala, dan kacamata goggle/masker wajah penuh**.\n* Anda akan didampingi oleh **Game Marshal & Safety Officer** bersertifikasi yang akan memberikan briefing taktis dan memandu cara bermain step-by-step.\n\nJadi tidak perlu takut sakit, yang ada justru memacu adrenalin dan seru sekali!`;
    }

    // 6. Jenis Senjata / Unit / Peluru
    if (q.includes('senjata') || q.includes('unit') || q.includes('aeg') || q.includes('gbb') || q.includes('peluru') || q.includes('fps') || q.includes('replika')) {
        return `Di Dreamfield Tactical, kami menyediakan unit replika airsoft tipe **AEG (Automatic Electric Gun)** dan **GBB (Gas Blow Back)** berkualitas tinggi:\n\n* **AEG:** Menggunakan baterai elektrik dengan laju tembakan cepat dan stabil, sangat ramah untuk pemain pemula.\n* **GBB:** Menggunakan tenaga gas dengan sensasi hentakan (recoil) realistis seperti menembak sungguhan!\n* **Peluru:** Menggunakan BB plastik bulat standar olahraga 6mm yang aman dan teruji.\n\nSemua unit selalu dirawat berkala agar akurasi dan performanya tetap prima saat digunakan di arena.`;
    }

    // 7. Pakaian yang disarankan
    if (q.includes('baju') || q.includes('pakaian') || q.includes('celana') || q.includes('sepatu') || q.includes('dresscode') || q.includes('kostum')) {
        return `Untuk kenyamanan dan keselamatan saat bermain di arena, kami sangat menyarankan:\n\n* **Pakaian:** Celana panjang (jeans, kargo, atau training) dan kaus/baju lengan panjang yang nyaman menyerap keringat.\n* **Sepatu:** Wajib memakai sepatu tertutup bertali seperti sneakers atau sepatu olahraga (hindari sandal, selop, atau sepatu hak tinggi).\n\nUntuk rompi tempur, helm taktis, dan kacamata goggle sudah kami sediakan lengkap di lokasi!`;
    }

    // 8. Jumlah Orang / Bisa Sendiri?
    if (q.includes('sendiri') || q.includes('minimal') || q.includes('berapa orang') || q.includes('kapasitas') || q.includes('rombongan') || q.includes('jumlah')) {
        return `Untuk bermain di Dreamfield:\n\n* **Target Range:** Bisa dimainkan sendiri (individu) maupun berdua/kelompok.\n* **War Game CQB:** Paling seru jika dimainkan minimal 4–6 orang (bisa dibagi 2 tim). Kapasitas arena kami sangat besar, mampu menampung hingga **50 orang** per sesi untuk gathering kantor atau komunitas.\n\nJika Anda datang sendiri atau berdua untuk War Game, biasanya bisa digabungkan dengan pemain/tim lain yang sedang berada di sesi yang sama!`;
    }

    // 9. Cara Booking
    if (q.includes('booking') || q.includes('pesan') || q.includes('reservasi') || q.includes('daftar') || q.includes('jadwal main')) {
        return `Cara reservasi di Dreamfield Tactical sangat praktis:\n\n1. Kunjungi menu [Formulir Booking Online](https://dreamfield.vercel.app/booking.html).\n2. Pilih arena yang ingin Anda mainkan (War Game CQB atau Target Range).\n3. Tentukan tanggal bermain dan jam kedatangan Anda (slot tersedia setiap 30 menit dari jam 12:00 s/d 21:00 WIB).\n4. Masukkan nama/callsign dan jumlah pemain yang akan hadir.\n5. Jadwal Anda akan langsung tercatat di sistem kami!\n\nApakah ada tanggal tertentu yang sedang Anda rencanakan untuk main?`;
    }

    // 10. Usia & Anak-anak
    if (q.includes('anak') || q.includes('umur') || q.includes('usia') || q.includes('bocah') || q.includes('keluarga')) {
        return `Permainan airsoft di Dreamfield Tactical ramah untuk remaja hingga dewasa. Untuk anak-anak dan remaja diperbolehkan bermain selama mampu mengenakan perlengkapan pelindung kepala & rompi dengan pas serta didampingi oleh orang tua/wali.\n\nBagi anak-anak yang ingin merasakan sensasi menembak aman, arena **Target Range** adalah pilihan paling tepat karena menembak ke sasaran diam dengan panduan instruktur profesional.`;
    }

    // 11. Sapaan Ramah
    if (q === 'halo' || q === 'hai' || q === 'hi' || q === 'pagi' || q === 'siang' || q === 'sore' || q === 'malam' || q === 'tes' || q === 'test' || q === 'halo min') {
        return `Halo Operator! Selamat datang di **Dreamfield Tactical Surabaya**.\n\nSaya CS AI resmi siap membantu Anda. Silakan tanyakan apa saja seputar arena, misalnya:\n* 📍 **Lokasi & Jam Operasional**\n* 💰 **Harga Tiket & Pilihan Paket**\n* 🛡️ **Apakah Aman untuk Pemula?**\n* 🎯 **Pilihan Mode Game & Senjata**\n* 📅 **Cara Melakukan Reservasi**\n\nAda yang ingin Anda ketahui lebih dulu?`;
    }

    // 12. Default Jawaban Cerdas & Edukatif (Tidak mengarahkan ke WhatsApp!)
    return `Siap Operator! Dreamfield Tactical Surabaya adalah arena indoor airsoft & tactical shooting ber-AC seluas 1.200 m² yang berlokasi di The Central Mall Gunawangsa Tidar Surabaya.\n\nKami menyediakan arena pertempuran taktis **War Game CQB** untuk perang tim yang seru, serta **Target Range** untuk latihan tembak akurasi jarak 10–25 meter (harga mulai Rp50k–225k).\n\nAda detail khusus yang ingin Anda tanyakan lebih lanjut, misalnya tentang harga paket, jadwal buka, jenis senjata replika, atau panduan untuk pemula?`;
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

        // If Gemini API Key is not set yet, use the Deep Knowledge Engine (No WhatsApp redirection!)
        if (!apiKey) {
            const dynamicReply = getDeepKnowledgeResponse(userMessage);
            return res.status(200).json({
                reply: dynamicReply,
                source: 'knowledge_engine'
            });
        }

        // Gemini AI Generative mode when API key is provided
        const formattedContents = [];
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

        formattedContents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: formattedContents,
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 800,
                topP: 0.95
            }
        };

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const dynamicReply = getDeepKnowledgeResponse(userMessage);
            return res.status(200).json({
                reply: dynamicReply,
                source: 'knowledge_engine_fallback'
            });
        }

        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!replyText) {
            const dynamicReply = getDeepKnowledgeResponse(userMessage);
            return res.status(200).json({
                reply: dynamicReply
            });
        }

        return res.status(200).json({
            reply: replyText,
            source: 'gemini_ai'
        });

    } catch (err) {
        console.error('Serverless function error:', err);
        const fallbackAnswer = getDeepKnowledgeResponse(req.body?.message || '');
        return res.status(200).json({
            reply: fallbackAnswer,
            source: 'knowledge_engine_error'
        });
    }
};
