# LAPORAN GABUNGAN DAN BAHAN PRESENTASI AKADEMIK
## Proyek Website Resmi Dreamfield Tactical Surabaya (https://dreamfield.vercel.app)

---

## DAFTAR ISI
1. [Laporan Gabungan Eksekutif Proyek](#1-laporan-gabungan-eksekutif-proyek)
   - [1.1 Latar Belakang dan Konteks Bisnis](#11-latar-belakang-dan-konteks-bisnis)
   - [1.2 Solusi Digital dan Nilai Kebaruan](#12-solusi-digital-dan-nilai-kebaruan)
   - [1.3 Arsitektur dan Alur Rekayasa Sistem](#13-arsitektur-dan-alur-rekayasa-sistem)
   - [1.4 Sintesis Temuan Audit dan Verifikasi Lapangan](#14-sintesis-temuan-audit-dan-verifikasi-lapangan)
2. [Bahan Presentasi Akademik Siap Pakai (14 Slide Lengkap)](#2-bahan-presentasi-akademik-siap-pakai-14-slide-lengkap)
   - [Slide 01: Judul Proyek dan Identitas Presentasi](#slide-01-judul-proyek-dan-identitas-presentasi)
   - [Slide 02: Latar Belakang dan Masalah Operasional Arena Airsoft](#slide-02-latar-belakang-dan-masalah-operasional-arena-airsoft)
   - [Slide 03: Visi Solusi Digital Dreamfield Tactical](#slide-03-visi-solusi-digital-dreamfield-tactical)
   - [Slide 04: Arsitektur Sistem Decoupled Static-Serverless](#slide-04-arsitektur-sistem-decoupled-static-serverless)
   - [Slide 05: Antarmuka Pengguna dan Identitas Visual Taktis](#slide-05-antarmuka-pengguna-dan-identitas-visual-taktis)
   - [Slide 06: Gamifikasi Edukatif: Mini Shooting Range Simulator](#slide-06-gamifikasi-edukatif-mini-shooting-range-simulator)
   - [Slide 07: Sistem Reservasi 4 Tahap dan Live Calculation Engine](#slide-07-sistem-reservasi-4-tahap-dan-live-calculation-engine)
   - [Slide 08: Rule Engine Validasi Jadwal (Selasa dan Jam Buka)](#slide-08-rule-engine-validasi-jadwal-selasa-dan-jam-buka)
   - [Slide 09: WhatsApp Handoff Architecture dan Generator Tiket](#slide-09-whatsapp-handoff-architecture-dan-generator-tiket)
   - [Slide 10: Inovasi Customer Service AI Mindream dan Persona Admin](#slide-10-inovasi-customer-service-ai-mindream-dan-persona-admin)
   - [Slide 11: High-Availability Failover Groq dan Google Gemini](#slide-11-high-availability-failover-groq-dan-google-gemini)
   - [Slide 12: Evaluasi Kritis: Keunggulan vs Keterbatasan Sistem](#slide-12-evaluasi-kritis-keunggulan-vs-keterbatasan-sistem)
   - [Slide 13: Roadmap Pengembangan Bertingkat (Database dan Payment)](#slide-13-roadmap-pengembangan-bertingkat-database-dan-payment)
   - [Slide 14: Kesimpulan Proyek dan Penutup](#slide-14-kesimpulan-proyek-dan-penutup)
3. [Panduan Menghadapi Pertanyaan Kritis Dosen (Defense Q&A Cheatsheet)](#3-panduan-menghadapi-pertanyaan-kritis-dosen-defense-qa-cheatsheet)

---

## 1. LAPORAN GABUNGAN EKSEKUTIF PROYEK

### 1.1 Latar Belakang dan Konteks Bisnis
Dreamfield Tactical Surabaya merupakan arena olahraga rekreasi taktis (*indoor tactical airsoft & CQB arena*) yang beroperasi di The Central Mall Gunawangsa Tidar Surabaya. Arena ini memiliki fasilitas indoor bertingkat seluas 1.200 m², berpendingin udara penuh (*full AC*), didukung unit sewa berstandar kompetisi (AEG, GBB, WGG), serta diawasi oleh instruktur dan wasit resmi (*Game Marshal*).

Sebelum tersedianya platform digital terpadu, operasional pemasaran dan reservasi menghadapi tantangan klasik industri rekreasi:
1. **Friksi Pemahaman Produk**: Pelanggan awam kesulitan membedakan varian unit (perbedaan AEG bertenaga baterai, GBB berbasis gas blowback, dan WGG berbasis water gel) serta ragam paket yang tersedia.
2. **Beban Komunikasi Berulang pada Staf**: Customer Service menerima ratusan pertanyaan manual yang repetitif seputar lokasi, jadwal buka, tarif per jam, dan ketentuan keamanan.
3. **Kesalahan Pemesanan Jadwal**: Pelanggan kerap mengajukan jadwal kedatangan pada hari libur pemeliharaan rutin mingguan (Hari Selasa) atau di luar jam operasional resmi (12.00–21.00 WIB).

### 1.2 Solusi Digital dan Nilai Kebaruan
Untuk mengatasi tantangan tersebut, dirancang dan dibangun platform website modern **Dreamfield Tactical** (`https://dreamfield.vercel.app`) yang mengintegrasikan empat pilar solusi:
- **Digital Brand Presence & Gallery**: Portal informasi berestetika visual taktis militer (*tactical military HUD*) yang menyajikan dokumentasi foto asli arena dan standar keselamatan.
- **Interactive Gamification Drill**: Simulator menembak sasaran 3 tahap berbasis manipulasi DOM dan Web Audio API untuk mengenalkan sensasi latihan airsoft secara interaktif kepada pengunjung.
- **Dynamic Guided Booking Engine**: Formulir reservasi 4 langkah yang dilengkapi kalkulator estimasi biaya instan dan mesin validasi ketat.
- **AI-Powered Tactical Customer Service (Mindream)**: Asisten virtual cerdas berkarakter admin manusia asli yang beroperasi 24/7 di atas infrastruktur serverless berkeandalan tinggi dengan failover otomatis Groq dan Google Gemini.

### 1.3 Arsitektur dan Alur Rekayasa Sistem
Sistem mengadopsi pola **Decoupled Static-Serverless Architecture**:
1. Lapisan depan (*frontend*) dibangun murni menggunakan HTML5 semantik, Modern CSS3 variables, dan Vanilla JavaScript ES6+ tanpa beban kompilasi (*zero build step*), memastikan pengantaran dokumen yang ringan dan responsif melalui jaringan Vercel Edge CDN.
2. Lapisan backend dijalankan secara nirserver (*serverless function*) via Node.js pada endpoint `/api/chat` untuk memproses inferensi kecerdasan buatan dan mengisolasi API keys dari peramban publik.
3. Alur data pemesanan diproses secara *stateless* di memori peramban klien, divalidasi melalui 9 aturan bisnis deterministik, dirangkai menjadi tiket teks terenkripsi, lalu dialihkan ke WhatsApp Admin resmi (`0822-3313-9118`) melalui skema URI universal `wa.me`.

### 1.4 Sintesis Temuan Audit dan Verifikasi Lapangan
Audit menyeluruh membuktikan bahwa kode sumber repositori lokal berada dalam kondisi **100% sinkron** dengan website produksi Vercel. Seluruh 20 komponen antarmuka terverifikasi berfungsi sempurna. Kelemahan sistem yang berpusat pada ketiadaan basis data SQL/NoSQL dan payment gateway otomatis telah dipetakan secara transparan sebagai karakteristik fase awal (*MVP*), dan telah dilengkapi roadmap mitigasi risiko yang siap dieksekusi pada fase pengembangan selanjutnya.

---

## 2. BAHAN PRESENTASI AKADEMIK SIAP PAKAI (14 SLIDE LENGKAP)

---

### Slide 01: Judul Proyek dan Identitas Presentasi

```
+─────────────────────────────────────────────────────────────────────────────+
│                           DREAMFIELD TACTICAL SURABAYA                      │
│     Rancang Bangun Website Profil Bisnis, Sistem Reservasi Arena CQB,       │
│                 dan Layanan Customer Service AI Serverless                  │
│                                                                             │
│                  Produksi Live: https://dreamfield.vercel.app               │
+─────────────────────────────────────────────────────────────────────────────+
```

- **Tujuan Slide**: Memperkenalkan judul proyek, domain permasalahan rekayasa web, dan menegaskan bahwa sistem telah beroperasi secara nyata pada jaringan publik (*live on production*).
- **Poin-Poin Kunci di Layar**:
  - Judul Proyek: Implementasi Platform Digital Dreamfield Tactical Surabaya.
  - Fokus Sistem: Profil Bisnis Interaktif, Engine Reservasi Berpemandu, dan Layanan CS AI 24/7.
  - Tumpukan Teknologi: HTML5 / CSS3 / Vanilla JS / Node.js Serverless / Groq AI / Google Gemini / WhatsApp Gateway.
  - Tautan Produksi: `https://dreamfield.vercel.app` (Branch Git `main`, Commit `6d3fec2`).
- **Bukti Teknis / Kode yang Dirujuk**: File `vercel.json` dan repositori proyek lokal `LANDING PAGE DREAM FIELD`.
- **Saran Visual / Pendukung**: Mockup tampilan desktop dan mobile dari halaman utama `index.html` bersanding dengan logo resmi Dreamfield.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Selamat pagi/siang kepada Bapak/Ibu Dewan Penguji. Pada kesempatan kali ini, saya akan mempresentasikan proyek rekayasa perangkat lunak web yang berjudul 'Rancang Bangun Website Profil Bisnis, Sistem Reservasi Arena CQB, dan Layanan Customer Service AI Serverless untuk Dreamfield Tactical Surabaya'. Proyek ini bukan sekadar rancangan teoritis di lingkungan lokal, melainkan sistem yang telah teruji, lolos audit komprehensif, dan telah beroperasi aktif di domain publik https://dreamfield.vercel.app."*

---

### Slide 02: Latar Belakang dan Masalah Operasional Arena Airsoft

- **Tujuan Slide**: Menjelaskan urgensi proyek berdasarkan masalah nyata di lapangan yang dialami oleh manajemen Dreamfield Tactical.
- **Poin-Poin Kunci di Layar**:
  - **Tantangan Industri Rekreasi Taktis**: Airsoft CQB adalah olahraga spesifik dengan banyak varian peralatan dan prosedur keselamatan.
  - **Masalah 1: Friksi Informasi Pemula**: Calon pemain bingung memilih unit (AEG listrik vs GBB gas vs WGG gel) dan paket harga.
  - **Masalah 2: Pemesanan di Hari Libur & Jam Tutup**: Pelanggan kerap mengajukan jadwal main pada hari Selasa (jadwal libur perawatan) atau di luar jam 12.00–21.00 WIB.
  - **Masalah 3: Beban CS Manual Repetitif**: Admin fisik kelelahan menjawab pertanyaan dasar berulang selama 24 jam.
- **Bukti Teknis / Kode yang Dirujuk**: Analisis kebutuhan alur bisnis dan aturan validasi pada `booking.html:L4075-L4115`.
- **Saran Visual / Pendukung**: Diagram alur frustrasi pelanggan (*Customer Pain Points Diagram*) yang menggambarkan tingginya tingkat pembatalan pesanan akibat miskomunikasi manual.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Latar belakang proyek ini berakar dari masalah nyata di arena Dreamfield Gunawangsa Tidar Surabaya. Sebagai arena CQB indoor 1.200 m², banyak calon pengunjung awam yang ragu berkunjung karena tidak paham perbedaan platform senjata airsoft. Masalah semakin diperparah dengan tingginya pemesanan tidak valid yang masuk ke WhatsApp admin, seperti memesan di hari Selasa saat arena tutup perawatan, atau memesan di tengah malam. Admin fisik kelelahan melayani chat repetitif, yang berujung pada hilangnya potensi omzet bisnis."*

---

### Slide 03: Visi Solusi Digital Dreamfield Tactical

- **Tujuan Slide**: Menyajikan arsitektur konseptual solusi yang dibangun untuk menjawab seluruh titik masalah operasional.
- **Poin-Poin Kunci di Layar**:
  - **Pilar 1: Tactical Brand Hub**: Edukasi fasilitas ber-AC, zona CQB modular, dan transparansi standar keamanan.
  - **Pilar 2: Interactive Range Drill**: Gamifikasi menembak target untuk mengenalkan mekanika bidik secara langsung di web.
  - **Pilar 3: Guided Booking & Live Price Engine**: Formulir 4 langkah dengan kalkulasi biaya langsung dan validasi jadwal ketat.
  - **Pilar 4: 24/7 AI Admin Mindream**: Asisten CS cerdas berbahasa santai khas Surabaya/Jakarta dengan auto-failover cloud.
- **Bukti Teknis / Kode yang Dirujuk**: Struktur menu navbar pada `index.html:L4875-L4905` dan modul widget `assets/js/cs-bot.js`.
- **Saran Visual / Pendukung**: Diagram 4 Pilar Solusi Digital Dreamfield Tactical yang saling terhubung melingkari target konversi bisnis.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Untuk mengatasi ketiga masalah utama tersebut, kami merancang solusi digital empat pilar. Kami menghadirkan hub profil taktis yang mengedukasi pengunjung, mini-game shooting simulator untuk membangun 'engagement', formulir booking berpemandu yang mengunci jadwal operasional secara otomatis, serta asisten virtual AI bernama Mindream yang siaga 24 jam melayani calon pelanggan dan langsung mengarahkan mereka ke meja reservasi."*

---

### Slide 04: Arsitektur Sistem Decoupled Static-Serverless

- **Tujuan Slide**: Memaparkan keunggulan teknis pemilihan arsitektur perangkat lunak yang pragmatis, efisien, dan berkinerja tinggi.
- **Poin-Poin Kunci di Layar**:
  - **Decoupled Architecture**: Pemisahan tegas antara presentasi statis di Edge CDN dan logika komputasi serverless.
  - **Zero-Build Static Frontend**: Dokumen HTML5, CSS3, dan Vanilla JS murni tanpa bundler (Webpack/Vite), menghasilkan pemuatan statis yang responsif tanpa beban runtime framework.
  - **Micro-Serverless Endpoint**: Fungsi Node.js tunggal di Vercel (`/api/chat`) yang aktif secara *on-demand*.
  - **Stateless Handoff**: Pemrosesan pesanan tanpa beban database server lokal, langsung bermuara ke WhatsApp Gateway resmi.
- **Bukti Teknis / Kode yang Dirujuk**: File `api/chat.js` dan konfigurasi `vercel.json`.
- **Saran Visual / Pendukung**: Diagram alur arsitektur Mermaid (seperti pada Dokumen 04 Bab 2).
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Dari perspektif rekayasa perangkat lunak, kami sengaja memilih pola 'Decoupled Static-Serverless Architecture'. Mengapa tidak menggunakan framework monolitik yang berat? Karena untuk profil bisnis dan reservasi taktis, kecepatan muat awal adalah kunci utama konversi. Dengan meniadakan proses build kompilasi dan mendistribusikan file statis murni lewat Edge CDN Vercel, TTFB website ini sangat instan. Sementara untuk fitur kecerdasan buatan, kami memanfaatkan Vercel Serverless Functions yang hanya menyala saat ada panggilan chat, sehingga biaya operasional server menjadi nol rupiah."*

---

### Slide 05: Antarmuka Pengguna dan Identitas Visual Taktis

- **Tujuan Slide**: Mendemonstrasikan konsistensi desain grafis, sistem token warna, dan rekayasa responsivitas antarmuka.
- **Poin-Poin Kunci di Layar**:
  - **Tactical Design Tokens**: Kombinasi *Charcoal (#1A1A1A)*, *Lime (#B7FF00)*, *Sage*, dan *Olive*.
  - **Tipografi Bertema Militer HUD**: Font *Orbitron* dan *Montserrat* berhuruf kapital dengan *Inter* untuk kenyamanan membaca teks.
  - **Slider Foto Interaktif 5 Zona**: Menampilkan foto asli arena CQB, jalur target, armory, dan safe-zone ber-AC.
  - **Mobile-First Responsive Engineering**: Penyesuaian layout otomatis pada layar ponsel (< 768px) dengan menu drawer samping.
- **Bukti Teknis / Kode yang Dirujuk**: `index.html:L4967-L5030` dan variabel CSS `:root`.
- **Saran Visual / Pendukung**: [Screenshot 01] Hero Section dan [Screenshot 02] Slider Foto Galeri Arena.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Dapat Bapak/Ibu saksikan pada Slide 5, kami menolak template generik yang membosankan. Desain antarmuka Dreamfield dibangun menggunakan prinsip 'Design Engineering' modern. Palet warna taktis dipadukan dengan tipografi bergaya Heads-Up Display helm tempur. Kami juga menyematkan galeri slider interaktif 5 zona untuk membuktikan fasilitas nyata arena, mulai dari rintangan CQB bertingkat hingga ruang tunggu safe-zone ber-AC dingin yang nyaman bagi keluarga."*

---

### Slide 06: Gamifikasi Edukatif: Mini Shooting Range Simulator

- **Tujuan Slide**: Menjelaskan fitur interaktif gamifikasi menembak target dan bagaimana hal itu meningkatkan interaksi pengguna.
- **Poin-Poin Kunci di Layar**:
  - **Hardcore 3-Step Simulator**: Target Popper Baja (Stage 1), Target Bergerak Ducking (Stage 2), Target Sandera vs Musuh (Stage 3).
  - **Fisika Peramban Berbasis DOM**: Gerak dinamis menggunakan `requestAnimationFrame` tanpa dependensi library eksternal.
  - **Timer & Metrik Tembak**: Batas waktu 10 detik per tahap, kalkulasi akurasi presisi, deteksi lubang peluru pada dinding.
  - **Umpan Balik Haptic**: Pemanfaatan API `navigator.vibrate(20)` pada ponsel cerdas.
  - **Kebijakan Audio Hening**: Suara dinonaktifkan secara terprogram untuk menjaga kenyamanan peramban pengguna.
- **Bukti Teknis / Kode yang Dirujuk**: `index.html:L5107-L5274` dan `index.html:L5757-L6560`.
- **Saran Visual / Pendukung**: [Screenshot 03] Tampilan Mini Shooting Range Game saat Stage 3 Hostile vs Hostage aktif.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Salah satu fitur paling unik di halaman beranda adalah 'Mini Shooting Range Simulator'. Ini adalah modul gamifikasi interaktif 3 tahap yang dibangun murni menggunakan DOM JavaScript tanpa canvas game engine yang berat. Pengunjung dapat berlatih menembak plat baja bergerak, menghitung akurasi, dan belajar membedakan target musuh dengan sandera. Di akhir permainan, pemain langsung disajikan tombol untuk memesan sesi latihan menembak presisi yang sebenarnya di arena."*

---

### Slide 07: Sistem Reservasi 4 Tahap dan Live Calculation Engine

- **Tujuan Slide**: Menguraikan alur pengisian formulir pemesanan terpandu dan algoritma komputasi tarif di sisi peramban.
- **Poin-Poin Kunci di Layar**:
  - **Step 1**: Pemilihan Kategori dari 5 Arena dan Seleksi Kartu Paket Dinamis.
  - **Step 2**: Penentuan Tanggal Main, Jam Kedatangan, dan Jumlah Personel.
  - **Step 3**: Pengisian Identitas Kontak Pemesan (Nama, No. WhatsApp, Catatan).
  - **Step 4**: Tinjauan Ringkasan dan Eksekusi Konfirmasi.
  - **Live Calculation Engine**: Ekstraksi tarif via Regex dan perkalian instan: `Total = Tarif Satuan x Jumlah Pemain`.
  - **Mobile Sticky Bar**: Bilah ringkasan harga melayang di bagian bawah layar ponsel.
- **Bukti Teknis / Kode yang Dirujuk**: `booking.html:L2970-L3680` dan `booking.html:L3852-L4045`.
- **Saran Visual / Pendukung**: [Screenshot 05] Pemilihan Kartu Paket Step 1 dan diagram alur perkalian tarif live.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Beralih ke inti bisnis website, yaitu sistem reservasi pada booking.html. Kami membagi alur pemesanan menjadi 4 tahapan logis berurutan untuk mencegah kelelahan kognitif pengguna. Di samping itu, kami membangun 'Live Calculation Engine' di sisi klien. Setiap kali pengguna memilih paket baru atau mengubah jumlah pemain, total biaya sewa dihitung ulang seketika menggunakan regex dan pemformatan mata uang Rupiah tanpa perlu memuat ulang halaman. Pada perangkat ponsel, total estimasi ini selalu terlihat berkat Mobile Sticky Checkout Bar."*

---

### Slide 08: Rule Engine Validasi Jadwal (Selasa dan Jam Buka)

- **Tujuan Slide**: Menjelaskan bagaimana sistem secara cerdas melindungi integritas jadwal fisik bisnis melalui validasi kode.
- **Poin-Poin Kunci di Layar**:
  - **Masalah Nyata**: Pelanggan sering memesan di hari libur atau jam tutup.
  - **Aturan 1 (Blokir Hari Selasa)**: Pengecekan indeks hari `dateObj.getDay() === 2` secara deterministik menolak pemesanan hari Selasa (*maintenance day*).
  - **Aturan 2 (Batasan Jam Buka 12.00–21.00 WIB)**: Konversi jam ke total menit (`totalMins = hh * 60 + mm`); menolak nilai di bawah 720 (12:00) atau di atas 1260 (21:00).
  - **Aturan 3 (Pencegahan Tanggal Lampau)**: Atribut kalender `min` dikunci otomatis ke hari ini menggunakan ISO string.
  - **Pemberian Umpan Balik Visual**: Kolom yang melanggar diberi garis tepi merah dan pesan teks peringatan spesifik.
- **Bukti Teknis / Kode yang Dirujuk**: `booking.html:L4075-L4115`.
- **Saran Visual / Pendukung**: Tangkapan layar pesan peringatan merah: *"TIDAK BISA KONFIRMASI: Hari Selasa adalah jadwal LIBUR arena"*.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Slide 8 menunjukkan bagaimana sistem memecahkan masalah salah jadwal yang sebelumnya sangat merugikan staf fisik. Di dalam file booking.html, kami menanamkan 'Rule Engine Validasi Jadwal'. Jika pengunjung memilih hari Selasa, sistem langsung mendeteksi getDay() bernilai 2 dan memblokir proses konfirmasi dengan pesan peringatan yang tegas. Begitu pula jika pengunjung mencoba memilih jam di luar rentang 12.00 hingga 21.00 WIB. Ini menjamin hanya pesanan yang valid secara operasional yang dapat diteruskan ke meja admin."*

---

### Slide 09: WhatsApp Handoff Architecture dan Generator Tiket

- **Tujuan Slide**: Memaparkan mekanisme transisi data pemesanan dari form website ke ruang percakapan WhatsApp resmi admin.
- **Poin-Poin Kunci di Layar**:
  - **Nomor Admin Resmi**: `0822-3313-9118` (`+62 822-3313-9118`).
  - **Perakitan Tiket Teks Bergaris Pembatas**: Struktur pesan rapi memuat identitas pemesan, rincian arena, tarif, tanggal, dan jumlah pemain.
  - **Enkripsi URL Aman**: Karakter string dienkripsi melalui `encodeURIComponent()` dan dialihkan via protokol universal `https://wa.me/...`.
  - **Handoff Confirmation Modal**: Jendela transisi penengah yang menyajikan pratinjau tiket dan tombol manual cadangan jika pop-up otomatis diblokir peramban.
- **Bukti Teknis / Kode yang Dirujuk**: `booking.html:L3245` dan `booking.html:L4265-L4345`.
- **Saran Visual / Pendukung**: [Screenshot 07] Handoff Confirmation Modal bersanding dengan contoh tampilan tiket di aplikasi WhatsApp.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Setelah seluruh data divalidasi, sistem menjalankan mekanisme 'WhatsApp Handoff'. Data pemesan tidak dikirim mentah-mentah, melainkan dirangkai menjadi tiket reservasi terformat rapi dengan pembatas garis estetis. URL dienkripsi secara aman dan diarahkan ke nomor resmi admin Dreamfield 0822-3313-9118. Kami juga menyediakan 'Handoff Confirmation Modal' sebagai solusi pengaman jika peramban seluler pengguna memblokir pengalihan otomatis, sehingga calon pelanggan tidak pernah kehilangan data pesanan mereka."*

---

### Slide 10: Inovasi Customer Service AI Mindream dan Persona Admin

- **Tujuan Slide**: Memperkenalkan inovasi asisten virtual Mindream, rekayasa prompt sistem, dan teknik peredaman kesan robotik.
- **Poin-Poin Kunci di Layar**:
  - **Identitas Personal Admin**: Diprogram secara ketat sebagai admin manusia asli yang sedang berjaga shift (dilarang menyebut dirinya AI atau bot).
  - **Format Jawaban Berpoin Ringkas (*Anti-Wall-of-Text*)**: Menyampaikan harga dan arena dalam poin-poin pendek yang mudah dicerna.
  - **Simulasi Mengetik Alami**: Jeda mengetik realistis (2.0–3.2 detik) dan pemecahan balon obrolan bertahap (*multi-bubble*).
  - **Viewport Anchoring & Floating Scroll Button**: Layar tetap terkunci di balon obrolan pertama dengan indikator panah melayang *"Pesan baru di bawah"*.
  - **Sintetis Suara Radio Taktis**: Audio Web Audio API osilator murni (600–900Hz).
- **Bukti Teknis / Kode yang Dirujuk**: `assets/js/cs-bot.js:L20-L59`, `L470-L595`, dan `api/chat.js:L7-L55`.
- **Saran Visual / Pendukung**: [Screenshot 08] Widget Obrolan Mindream dan [Screenshot 09] Tombol Melayang "Pesan baru di bawah".
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Inovasi paling menarik pada aspek kecerdasan buatan adalah 'Mindream'. Melalui system prompt yang dirancang khusus pada file api/chat.js, Mindream diposisikan sebagai admin manusia asli yang ramah dengan gaya bahasa santai khas anak muda Surabaya. Kami menerapkan 'UX Chat Polish': balasan AI dipecah menjadi beberapa balon pesan ringkas, diselingi jeda mengetik alami, dan posisi pandangan mata pengguna dikunci pada balon pertama agar tidak pusing terlonjak ke bawah. Selain itu, efek suara bip taktis dihasilkan langsung oleh Web Audio API tanpa perlu mengunduh file MP3 eksternal."*

---

### Slide 11: High-Availability Failover Groq dan Google Gemini

- **Tujuan Slide**: Membedah arsitektur backend serverless yang menjamin ketersediaan layanan CS 24 jam tanpa henti.
- **Poin-Poin Kunci di Layar**:
  - **Arsitektur Failover Bertingkat (Sequential Cascade)**:
    - **Mesin Primer**: Groq Cloud API (`qwen/qwen3.8-27b`) dengan kecepatan pemrosesan inferensi teks yang gegas.
    - **Mesin Cadangan Otomatis**: Google Gemini API (`gemini-3.6-flash`) yang langsung mengambil alih jika Groq limit (429) atau error.
  - **Keamanan Kunci API**: Kredensial rahasia disimpan di *Environment Variables* Vercel (`process.env`), terisolasi total dari peramban publik.
  - **Deteksi Niat Reservasi Otomatis**: Regex cerdas mendeteksi kata kunci booking dan menyuntikkan tombol hijau `[BOOKING_CTA]` langsung ke dalam obrolan.
- **Bukti Teknis / Kode yang Dirujuk**: `api/chat.js:L60-L245`.
- **Saran Visual / Pendukung**: Sequence Diagram alur failover Groq ke Gemini (seperti pada Dokumen 04 Bab 12).
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Untuk memastikan asisten CS ini tidak mudah down, backend serverless api/chat.js menerapkan strategi 'High-Availability Failover'. Mesin utama kami adalah Groq Cloud yang menggunakan model open-weights Qwen 27B dengan kecepatan inferensi tinggi khas arsitektur LPU. Namun, jika kuota Groq tersentuh atau terjadi kendala jaringan, kode backend secara otomatis dan senyap mengalihkan permintaan ke Google Gemini Flash. Kunci API tersimpan aman di serverless Vercel sehingga tidak ada risiko kebocoran kredensial ke publik."*

---

### Slide 12: Evaluasi Kritis: Keunggulan vs Keterbatasan Sistem

- **Tujuan Slide**: Menunjukkan kedewasaan akademik melalui evaluasi diri (*self-audit*) yang jujur, objektif, dan faktual.
- **Poin-Poin Kunci di Layar**:
  - **Kekuatan Utama yang Terverifikasi**:
    - Performa pemuatan luar biasa (*load time* instan via Edge CDN).
    - Desain visual taktis yang orisinal dan responsif.
    - CS AI berkecepatan tinggi dengan keandalan failover ganda.
    - Validasi operasional yang disiplin memblokir hari libur.
  - **Keterbatasan Sistem Saat Ini (*MVP Constraints*)**:
    - *Stateless*: Tidak ada database server lokal untuk menyimpan riwayat pesanan.
    - *No Collision Detection*: Pengecekan tabrakan slot masih manual oleh admin WhatsApp.
    - *No Payment Gateway*: Pembayaran uang muka (DP) masih transfer manual.
- **Bukti Teknis / Kode yang Dirujuk**: Dokumen Laporan Audit `05_HASIL_AUDIT_DAN_REKOMENDASI.md`.
- **Saran Visual / Pendukung**: Tabel matriks komparasi Keunggulan vs Keterbatasan sistem.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Sebagai akademisi, kami wajib bersikap objektif terhadap karya kami sendiri. Audit independen yang kami jalankan menunjukkan bahwa sistem ini sangat unggul dari segi kecepatan, estetika, dan keandalan AI. Namun, kami juga mengakui secara transparan keterbatasan sistem saat ini: sistem ini belum memiliki database relasional terpusat dan belum terhubung ke payment gateway otomatis. Keterbatasan ini adalah karakteristik alami dari produk fase awal (MVP), di mana kami memprioritaskan validasi pasar dan konversi cepat tanpa menambah beban biaya server bulanan bagi pemilik bisnis."*

---

### Slide 13: Roadmap Pengembangan Bertingkat (Database dan Payment)

- **Tujuan Slide**: Menyajikan rencana strategis keberlanjutan dan penyempurnaan sistem untuk masa depan.
- **Poin-Poin Kunci di Layar**:
  - **Fase 1 (Segera - Jangka Pendek)**:
    - Integrasi Basis Data Cloud Relasional (*Supabase / PostgreSQL*) untuk persistensi data pesanan.
    - Pembangunan Endpoint Slot Checking Real-Time (`/api/slots`) guna mengeliminasi risiko *overbooking*.
  - **Fase 2 (Jangka Menengah)**:
    - Integrasi Payment Gateway Otomatis (Midtrans QRIS & Virtual Account) untuk pembayaran DP instan.
    - Pembuatan Web Admin Dashboard bagi staf kasir dan Game Marshal di lokasi.
    - Optimasi kompresi aset gambar ke format modern WebP.
  - **Fase 3 (Jangka Panjang)**:
    - Migrasi ke WhatsApp Cloud API resmi (Meta BSP) dengan interaksi tombol dua arah otomatis.
- **Bukti Teknis / Kode yang Dirujuk**: Dokumen `05_HASIL_AUDIT_DAN_REKOMENDASI.md:Bab 8`.
- **Saran Visual / Pendukung**: Diagram garis waktu roadmap bertingkat (*Phased Development Roadmap*).
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Untuk mengatasi keterbatasan tersebut, kami telah menyusun roadmap pengembangan terstruktur. Pada tahap jangka pendek, prioritas kami adalah menyematkan database cloud Supabase dan API slot checking agar sistem dapat mematikan jam yang sudah penuh secara otomatis. Pada tahap berikutnya, kami akan mengintegrasikan payment gateway QRIS Midtrans agar pelanggan dapat langsung membayar DP secara instan, serta membangun panel dashboard kasir berbasis web untuk manajemen operasional di lokasi."*

---

### Slide 14: Kesimpulan Proyek dan Penutup

- **Tujuan Slide**: Merangkum pencapaian proyek dan membuka sesi tanya jawab (*defense Q&A*) dengan dewan penguji.
- **Poin-Poin Kunci di Layar**:
  - **Pencapaian**: Berhasil membangun dan memublikasikan ekosistem website taktis interaktif yang terverifikasi stabil di `https://dreamfield.vercel.app`.
  - **Dampak Nyata**: Mengeliminasi kesalahan booking hari libur, memangkas waktu tunggu respon CS, dan memberikan pengalaman visual kelas atas bagi komunitas airsoft.
  - **Status Kode**: Bersih, terstruktur, aman, dan terdokumentasi penuh dalam 6 dokumen teknis.
  - **Ucapan Terima Kasih & Sesi Diskusi / Tanya Jawab Terbuka**.
- **Bukti Teknis / Kode yang Dirujuk**: Rangkaian 6 file dalam folder `DOKUMENTASI_WEBSITE_DREAMFIELD/`.
- **Saran Visual / Pendukung**: Foto tim Dreamfield bersanding dengan tautan kode QR menuju website produksi.
- **Catatan Pembicara Lisan (*Oral Speaker Notes*)**:
  > *"Sebagai kesimpulan, proyek website Dreamfield Tactical Surabaya berhasil membuktikan bahwa arsitektur Decoupled Static Serverless yang dipadukan dengan kecerdasan buatan mutakhir dapat menjadi solusi rekayasa web yang sangat efisien, cepat, dan berdampak nyata bagi bisnis fisik. Sistem ini siap diuji dan telah terdokumentasi secara ilmiah dalam enam bundel dokumen teknis. Terima kasih atas perhatian Bapak/Ibu Dewan Penguji, saya siap menyambut pertanyaan dan masukan konstruktif."*

---

## 3. PANDUAN MENGHADAPI PERTANYAAN KRITIS DOSEN (DEFENSE Q&A CHEATSHEET)

Bagian ini dirancang khusus untuk membekali mahasiswa/pengembang dengan argumentasi ilmiah dan pembuktian kode saat menghadapi pertanyaan mendalam dari dewan penguji:

### Q1: "Mengapa sistem ini tidak menggunakan basis data relational seperti MySQL atau PostgreSQL untuk menyimpan booking?"
- **Strategi Jawaban & Argumen Ilmiah**:
  > *"Terima kasih atas pertanyaannya, Bapak/Ibu. Keputusan ini didasarkan pada prinsip **YAGNI (You Aren't Gonna Need It)** dan efisiensi biaya arsitektur fase MVP. Dalam bisnis arena rekreasi taktis, ketersediaan slot fisik bersifat sangat dinamis karena sering terjadi perpanjangan durasi sewa spontan di arena oleh pemain yang sedang bertanding. Mengunci slot di database web tanpa integrasi fisik justru berisiko menimbulkan konflik data yang lebih rumit. Dengan mengalirkan tiket terformat langsung ke WhatsApp Admin resmi, admin fisik dapat memeriksa ketersediaan lapangan secara faktual sebelum mengonfirmasi pesanan. Selain itu, ketiadaan database server lokal mengeliminasi potensi serangan SQL Injection dan memangkas biaya pemeliharaan server menjadi nol rupiah. Rencana integrasi database Supabase telah kami formulasikan secara komprehensif pada Roadmap Prioritas Tinggi di Dokumen 05."*

### Q2: "Bagaimana sistem menjamin API Key Groq dan Gemini tidak dicuri oleh pihak luar yang melihat source code?"
- **Strategi Jawaban & Argumen Ilmiah**:
  > *"Pertanyaan keamanan yang sangat krusial, Bapak/Ibu. Sistem kami menerapkan pemisahan lingkungan eksekusi (**Environment Isolation**). Seluruh panggilan ke API Groq dan Gemini diisolasi total di dalam file backend serverless `api/chat.js` yang dieksekusi di lingkungan komputasi aman Vercel Cloud, bukan di peramban klien. Kunci otentikasi diakses melalui variabel lingkungan `process.env.GROQ_API_KEY` dan `process.env.GEMINI_API_KEY`. Jika Bapak/Ibu memeriksa source code sisi klien di peramban (Inspect Element pada `cs-bot.js`), kode klien hanya melakukan AJAX fetch HTTP POST ke endpoint internal kami `/api/chat`. Kunci API eksternal sama sekali tidak pernah dikirimkan atau terekspos ke sisi klien."*

### Q3: "Mengapa tidak menggunakan framework frontend modern populer seperti React, Next.js, atau Vue?"
- **Strategi Jawaban & Argumen Ilmiah**:
  > *"Kami memilih pendekatan **Vanilla JavaScript ES6+ dan HTML5 Semantik murni** dengan pertimbangan performa dan arsitektur pengantaran konten. Framework seperti React menyertakan beban kompilasi (*bundle size overhead*) sebesar 100-300 KB file JavaScript dasar sebelum halaman dapat dirender, yang memperlambat waktu muat pada perangkat seluler dengan jaringan terbatas. Dengan arsitektur 'Zero-Build Static', seluruh halaman kami dapat langsung diparsing oleh mesin peramban secara native seketika dokumen HTML diterima dari Vercel Edge CDN tanpa menunggu kompilasi runtime JavaScript framework yang besar. Untuk kebutuhan sistem profil bisnis dan alur reservasi terpandu, Vanilla JS terbukti jauh lebih efisien, hemat memori peramban, dan memiliki ketergantungan paket pihak ketiga bernilai nol."*

### Q4: "Bagaimana cara sistem mencegah kecerdasan buatan Mindream berhalusinasi (hallucination) memberikan tarif palsu atau jadwal yang salah?"
- **Strategi Jawaban & Argumen Ilmiah**:
  > *"Kami menerapkan teknik **Context Injection & System Prompt Hardening** yang sangat ketat pada file `api/chat.js:L7-L55`. Di dalam konstanta `SYSTEM_INSTRUCTION`, kami menyuntikkan basis pengetahuan tertutup (*closed-domain knowledge*) yang memuat daftar harga resmi persis sama dengan katalog booking, lokasi alamat fisik mall, dan jam buka operasional. Kami menambahkan aturan larangan keras (negative constraint) agar model tidak berspekulasi di luar data yang diberikan. Selain itu, parameter suhu (*temperature*) kami kunci pada angka 0.7 dengan batas token 650, menjaga agar jawaban tetap berfokus pada fakta katalog. Terlebih lagi, untuk aksi transaksi final, pengguna tidak membayar di dalam obrolan AI, melainkan diarahkan melalui tombol resmi `[BOOKING_CTA]` ke formulir reservasi yang memiliki validasi matematis deterministik."*

### Q5: "Apa yang terjadi jika ada dua pelanggan yang memilih jam sesi yang sama secara bersamaan?"
- **Strategi Jawaban & Argumen Ilmiah**:
  > *"Pada fase arsitektur saat ini, potensi tersebut kami mitigasi melalui peran **Human-in-the-Loop Validation** pada WhatsApp Admin. Status pemesanan di website adalah formulir pengajuan reservasi slot (*reservation inquiry*), bukan transaksi tiket final yang terbit otomatis. Tiket teks yang masuk ke WhatsApp admin memuat stempel jam pengajuan. Admin fisik memegang buku jadwal lapangan; jika slot jam tersebut ternyata telah terisi, admin secara langsung menawarkan pergeseran sesi 1 jam sebelumnya atau sesudahnya kepada pelanggan melalui chat personal yang ramah. Untuk mengotomatisasi hal ini di masa depan, kami telah merancang endpoint `/api/slots` pada Roadmap Pengembangan Jangka Pendek untuk memeriksa kuota sebelum tombol submit diaktifkan."*

### Q6: "Bagaimana logika validasi hari Selasa bekerja, dan mengapa hari Selasa yang dipilih untuk diliburkan?"
- **Strategi Jawaban & Argumen Ilmiah**:
  > *"Secara operasional bisnis, hari Selasa ditetapkan sebagai jadwal pembersihan mendalam arena, sterilisasi masker goggle, pengisian tabung gas Co2/Green Gas, serta pengujian kecepatan (*chrono test*) seluruh unit sewa airsoft setelah dipakai intensif pada akhir pekan. Secara teknis kode pada `booking.html:L4075-L4085`, validasi ini diimplementasikan menggunakan metode native JavaScript `Date.prototype.getDay()`. Nilai 2 pada objek tanggal JavaScript merepresentasikan hari Selasa. Ketika sistem mendeteksi `dateObj.getDay() === 2`, eksekusi konfirmasi dibatalkan seketika (*early return*), input kalender diberi sorotan garis merah, dan elemen status memunculkan pesan peringatan bahwa arena tutup pemeliharaan rutin. Validasi ini berjalan ganda: baik di tombol submit desktop maupun pada Mobile Sticky Checkout Bar."*

---

> [!TIP]
> Dokumen laporan gabungan dan presentasi ini telah memadukan seluruh dimensi teknis, analitis, dan operasional proyek Dreamfield Tactical. Bahan presentasi 14 slide di atas dapat langsung disajikan di layar proyektor atau dikonversi ke format slide akademik sesuai template perguruan tinggi masing-masing.
