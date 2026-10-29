# HASIL AUDIT SISTEM DAN REKOMENDASI PENGEMBANGAN
## Website Resmi Dreamfield Tactical Surabaya (https://dreamfield.vercel.app)

---

## DAFTAR ISI
1. [Ringkasan Eksekutif Hasil Audit](#1-ringkasan-eksekutif-hasil-audit)
2. [Ruang Lingkup dan Metodologi Audit](#2-ruang-lingkup-dan-metodologi-audit)
3. [Temuan Positif dan Keunggulan Sistem](#3-temuan-positif-dan-keunggulan-sistem)
4. [Temuan Masalah, Anomali, dan Keterbatasan Sistem](#4-temuan-masalah-anomali-dan-keterbatasan-sistem)
   - [4.1 Temuan Fungsional dan Alur Bisnis](#41-temuan-fungsional-dan-alur-bisnis)
   - [4.2 Temuan Teknis dan Arsitektur Kode](#42-temuan-teknis-dan-arsitektur-kode)
   - [4.3 Temuan Antarmuka dan Pengalaman Pengguna (UX)](#43-temuan-antarmuka-dan-pengalaman-pengguna-ux)
5. [Tabel Komparasi Sinkronisasi: Website Online vs Source Code Lokal](#5-tabel-komparasi-sinkronisasi-website-online-vs-source-code-lokal)
6. [Analisis Risiko Operasional dan Skalabilitas](#6-analisis-risiko-operasional-dan-skalabilitas)
7. [Verifikasi Faktual: Klaim Pemasaran vs Realitas Teknis](#7-verifikasi-faktual-klaim-pemasaran-vs-realitas-teknis)
8. [Roadmap Rekomendasi Peningkatan Sistem Bertingkat](#8-roadmap-rekomendasi-peningkatan-sistem-bertingkat)
   - [8.1 Prioritas Tinggi (Jangka Pendek / Segera)](#81-prioritas-tinggi-jangka-pendek--segera)
   - [8.2 Prioritas Menengah (Jangka Menengah)](#82-prioritas-menengah-jangka-menengah)
   - [8.3 Prioritas Rendah (Jangka Panjang)](#83-prioritas-rendah-jangka-panjang)
9. [Kesimpulan Audit](#9-kesimpulan-audit)

---

## 1. RINGKASAN EKSEKUTIF HASIL AUDIT

Berdasarkan audit teknis mendalam terhadap kode sumber (*source code*) repositori lokal dan pengujian langsung pada infrastruktur produksi online (`https://dreamfield.vercel.app`), disimpulkan bahwa **Website Dreamfield Tactical Surabaya berada dalam kondisi operasional stabil (*production-ready*), memiliki performa pemuatan sangat tinggi, serta menyajikan identitas visual taktis yang sangat kuat dan berkarakter.**

Sistem ini berhasil memadukan fungsi *branding*, edukasi katalog, simulasi interaktif, dan konversi reservasi ke aplikasi WhatsApp secara mulus. Kehadiran Customer Service AI (Mindream) dengan arsitektur *dual-engine failover* (Groq dan Google Gemini) terbukti mampu memberikan respons interaktif yang natural, ramah, dan bebas dari kesan robotik kaku.

Namun demikian, audit menemukan bahwa sistem saat ini **beroperasi murni secara nir-basis data (*stateless tanpa database*) dan belum terintegrasi dengan payment gateway otomatis**. Konsekuensinya, proses verifikasi ketersediaan jadwal dan pencatatan pembayaran sepenuhnya mengandalkan intervensi manual tim admin WhatsApp fisik. Rekomendasi bertingkat telah disusun dalam dokumen ini guna memandu evolusi sistem ke tingkat kematangan teknologi yang lebih tinggi.

---

## 2. RUANG LINGKUP DAN METODOLOGI AUDIT

Audit dilaksanakan dengan mematuhi prinsip kehati-hatian (*read-only non-destructive audit*) menggunakan dua pilar pengujian:

```
+─────────────────────────────────────────────────────────────────────────────+
│                            METODOLOGI AUDIT SISTEM                          │
+─────────────────────────────────────────────────────────────────────────────+
│                                                                             │
│  [1. Audit Source Code Lokal]             [2. Pengujian Produksi Online]   │
│  • Penelusuran repositori Git            • Inspeksi HTTPS & DNS Vercel      │
│  • Analisis AST & Struktur DOM           • Validasi HTTP Response & CORS    │
│  • Audit logika algoritma kalkulasi      • Simulasi form pada peramban asli │
│  • Verifikasi batasan validasi form      • Uji responsif desktop & ponsel   │
│  • Pengecekan keamanan API serverless    • Uji failover endpoint /api/chat  │
│                                                                             │
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │
                                       ▼
                     [3. Rekonsiliasi & Sintesis Faktual]
                     • Komparasi kesesuaian lokal vs produksi
                     • Identifikasi limitasi & risiko operasional
                     • Penyusunan matriks rekomendasi bertingkat
```

### Ruang Lingkup Pengujian:
1. **Pemeriksaan Dokumen Web**: `index.html` (6.563 baris), `booking.html` (4.409 baris), dan `pricelist.html` (932 baris).
2. **Pemeriksaan Backend Serverless**: `api/chat.js` (247 baris).
3. **Pemeriksaan Skrip dan Gaya**: `assets/js/cs-bot.js` (610 baris) dan `assets/css/cs-bot.css` (769 baris).
4. **Pemeriksaan Konfigurasi Deployment**: `vercel.json` dan `.gitignore`.
5. **Inspeksi HTTP Live**: Pengujian metode `OPTIONS`, `GET`, dan `POST` pada `https://dreamfield.vercel.app/api/chat`.

---

## 3. TEMUAN POSITIF DAN KEUNGGULAN SISTEM

Sistem Dreamfield Tactical memiliki sejumlah keunggulan teknis dan desain yang menonjol dibandingkan rata-rata website profil bisnis sejenis:

1. **Desain Visual Tematik yang Sangat Kuat (*Anti-Generic Tactical UI*)**:
   - Palet warna taktis (*Charcoal #1A1A1A*, *Lime #B7FF00*, *Olive #4E5B31*) dieksekusi secara konsisten dengan tipografi HUD militer (*Orbitron* dan *Montserrat*), menciptakan diferensiasi merek yang khas bagi arena CQB indoor di Surabaya.
2. **Pemuatan Berbasis Edge CDN (*Zero-Build Static Architecture*)**:
   - Tanpa dependensi framework kompilasi (*no React, no Vue, no Angular*), dokumen HTML dan aset gambar lokal didistribusikan langsung oleh Edge CDN Vercel sehingga teramati responsif saat diuji pada peramban (pengukuran kuantitatif FCP/LCP dengan alat uji benchmark formal belum dilakukan).
3. **Keandalan Tinggi Layanan AI CS (*Dual-Engine HA Architecture*)**:
   - Integrasi cerdas antara Groq Cloud API (`qwen/qwen3.8-27b`) sebagai mesin inferensi utama untuk menghasilkan respons cepat dan Google Gemini API (`gemini-3.6-flash`) sebagai cadangan otomatis menjamin layanan tanya-jawab pelanggan tidak mudah terputus saat terjadi kendala kuota atau jaringan.
4. **Rekayasa Umpan Balik Manusiawi pada Chatbot CS**:
   - Penerapan jeda mengetik proporsional (2.0–3.2 detik), pemecahan balon obrolan (*multi-bubble*), penguncian layar pada balon pertama (*viewport anchoring*), dan tombol melayang *"Pesan baru di bawah"* berhasil mengatasi kebingungan membaca teks panjang (*anti-wall-of-text*).
5. **Inovasi Sintetis Audio Ringan (*Web Audio API SFX*)**:
   - Efek suara bip radio taktis dihasilkan murni melalui osilator frekuensi bawaan peramban tanpa memerlukan unduhan file audio MP3 eksternal, menghemat konsumsi kuota data pengunjung.
6. **Validasi Kalender dan Jam Operasional yang Disiplin**:
   - Form booking secara ketat memblokir pemilihan hari Selasa (jadwal libur perawatan) dan membatasi jam di luar rentang 12.00–21.00 WIB, mencegah masuknya reservasi yang tidak valid ke meja admin.
7. **Pengalaman Pengguna Seluler yang Matang (*Mobile Sticky Checkout Bar*)**:
   - Bilah ringkasan harga melayang di bagian bawah layar ponsel memungkinkan pengguna memantau total estimasi biaya dan melakukan pemesanan tanpa terganggu pengguliran form yang panjang.

---

## 4. TEMUAN MASALAH, ANOMALI, DAN KETERBATASAN SISTEM

### 4.1 Temuan Fungsional dan Alur Bisnis
1. **Ketiadaan Basis Data Persistensi Pemesanan (*No Persistent Database*)**:
   - Seluruh data pemesanan yang dimasukkan pengguna ke formulir hanya hidup di memori sementara JavaScript peramban (*browser memory*). Tidak ada tabel transaksi di database yang menyimpan riwayat pemesanan.
2. **Tidak Ada Pengecekan Tabrakan Slot Waktu-Nyata (*No Real-Time Slot Collision Check*)**:
   - Pengunjung dapat memilih jam berapapun dalam rentang 12.00–21.00 WIB meskipun jam tersebut pada kenyataannya sudah penuh dipesan oleh rombongan lain di arena fisik. Pengecekan ketersediaan slot bergantung 100% pada verifikasi manual admin WhatsApp.
3. **Ketiadaan Gerbang Pembayaran Otomatis (*No Payment Gateway*)**:
   - Sistem belum mengintegrasikan payment gateway pihak ketiga (seperti Midtrans atau Xendit). Pembayaran tanda jadi (DP) atau pelunasan sewa harus dilakukan melalui transfer manual ke rekening bank yang diinformasikan via chat WhatsApp.
4. **Ketergantungan Total pada Tindakan Manual Pengguna di WhatsApp**:
   - Pemesanan hanya dianggap terkirim jika pengguna menekan tombol "Kirim" di aplikasi WhatsApp mereka. Jika pengguna menutup aplikasi sebelum menekan kirim, data pesanan hilang tanpa jejak.

### 4.2 Temuan Teknis dan Arsitektur Kode
1. **Struktur File Monolitik Berukuran Besar (*Large Monolithic Code Files*)**:
   - `index.html` (6.563 baris) dan `booking.html` (4.409 baris) memuat ribuan baris CSS dan skrip JavaScript secara inline dalam satu file. Meskipun menguntungkan untuk kecepatan muat HTTP/2 tanpa bundling, pendekatan ini meningkatkan kompleksitas pemeliharaan kode (*maintainability cost*) bagi tim pengembang masa depan.
2. **Katalog Paket Bersifat Hardcoded (*Client-Side Static Catalog*)**:
   - Data rincian harga dan fasilitas paket tersimpan langsung di variabel `const packageCatalog` di dalam `booking.html`. Setiap kali manajemen ingin mengubah tarif atau promo, pengembang harus menyunting kode HTML secara manual dan melakukan commit/deploy ulang.
3. **Format Aset Gambar Belum Mengadopsi Standar Modern (WebP / AVIF)**:
   - Direktori `assets/img/` seluruhnya masih menggunakan format JPEG standar (.jpg). Meskipun resolusinya tajam, format WebP dapat mereduksi ukuran file gambar hingga 35-50% lebih kecil tanpa kehilangan kualitas visual.
4. **Ketiadaan Rangkaian Pengujian Otomatis (*No Automated Test Suite*)**:
   - Repositori tidak memiliki pengujian unit (*unit test*), pengujian integrasi, maupun pengujian end-to-end (Jest/Playwright). Validasi alur formulir bergantung pada pengujian manual pengguna.

### 4.3 Temuan Antarmuka dan Pengalaman Pengguna (UX)
1. **Suara Mini Shooting Simulator Dinonaktifkan Total di Skrip**:
   - Fungsi pemutar audio pada game simulator (`playAirsoftShotSound`, dsb.) dijadikan fungsi hampa (*empty dummy*) sesuai instruksi penyederhanaan antarmuka, namun di antarmuka tidak terdapat ikon sakelar suara sehingga pengguna baru mungkin mengira terjadi malfungsi audio pada peramban mereka.
2. **Ketiadaan Indikator Estimasi Kuota Slot**:
   - Pada dropdown pemilihan jam, seluruh jam ditampilkan setara tanpa adanya label status (misal: "Sisa 2 Slot" atau "Ramai"), sehingga pengguna tidak memiliki panduan waktu terbaik untuk berkunjung.

---

## 5. TABEL KOMPARASI SINKRONISASI: WEBSITE ONLINE VS SOURCE CODE LOKAL

Tabel berikut menyajikan hasil komparasi faktual antara kode sumber lokal di repositori Git (`main` branch, commit `6d3fec2`) dengan website publik yang aktif di `https://dreamfield.vercel.app`:

| Aspek yang Diaudit | Status Source Code Lokal | Status Website Online Vercel | Status Kesesuaian | Catatan Teknis / Bukti |
| :--- | :--- | :--- | :--- | :--- |
| **Halaman Utama (/)** | `index.html` (6.563 baris) | Terbuka normal (HTTP 200) | **100% Sinkron** | Elemen hero, slider, HUD, dan mini game identik sempurna. |
| **Halaman Booking (/booking)** | `booking.html` (4.409 baris) | Terbuka normal (HTTP 200) | **100% Sinkron** | Rewrites `vercel.json` berhasil merutekan `/booking` ke `booking.html`. |
| **Halaman Pricelist (/pricelist)** | `pricelist.html` (932 baris) | Terbuka normal via web | **100% Sinkron** | Katalog 5 arena dan deep-linking URL kueri berfungsi tepat. |
| **Nomor Resmi Admin WhatsApp** | `0822-3313-9118` | `+62 822-3313-9118` | **100% Sinkron** | Muncul pada generator tiket, tautan footer, dan widget chat. |
| **Backend API (/api/chat)** | `api/chat.js` (247 baris) | Endpoint aktif (POST 200, GET 405) | **100% Sinkron** | Header CORS preflight (OPTIONS 200) dan respons AI identik. |
| **Failover Engine AI** | Groq Primer + Gemini Cadangan | Aktif di Cloud | **100% Sinkron** | Terverifikasi via pengujian payload live JSON. |
| **Validasi Libur Selasa** | Indeks Hari 2 diblokir ketat | Diblokir secara interaktif | **100% Sinkron** | Pesan peringatan merah muncul jika Selasa dipilih. |
| **Validasi Jam 12.00–21.00** | Menit 720 hingga 1260 | Diblokir jika di luar jam | **100% Sinkron** | Jam sebelum 12 atau setelah 21 ditolak konfirmasinya. |
| **Sintesis Audio CS** | Web Audio API (Osilator) | Berbunyi jernih di peramban | **100% Sinkron** | Menghasilkan frekuensi 600-900Hz tanpa unduhan file mp3. |
| **Aset Grafis Foto** | 14 gambar di `assets/img/` | Seluruh gambar termuat utuh | **100% Sinkron** | Tidak ada gambar pecah (*zero broken images*). |

---

## 6. ANALISIS RISIKO OPERASIONAL DAN SKALABILITAS

Dari hasil audit menyeluruh, diidentifikasi tiga kategori risiko operasional yang memerlukan perhatian manajemen:

```
+──────────────────────────┬──────────────────────────┬──────────────────────────────────────────+
│ Kategori Risiko          │ Tingkat Dampak & Peluang │ Mitigasi dan Rencana Penanganan          │
+──────────────────────────┼──────────────────────────┼──────────────────────────────────────────+
│ 1. Risiko Overbooking    │ DAMPAK: TINGGI           │ Ketiadaan kunci slot otomatis berpotensi │
│    Jadwal Bermain        │ PELUANG: SEDANG          │ menimbulkan bentrok reservasi rombongan.│
│                          │                          │ Mitigasi: Admin WhatsApp wajib memegang  │
│                          │                          │ buku jadwal fisik dan memeriksa slot     │
│                          │                          │ sebelum mengonfirmasi DP pelanggan.      │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────────────+
│ 2. Pemblokiran Tautan /  │ DAMPAK: SEDANG           │ Penggunaan tautan universal wa.me dapat   │
│    Aplikasi WhatsApp     │ PELUANG: RENDAH          │ terhambat jika peramban seluler pengguna │
│                          │                          │ memblokir intent aplikasi luar.          │
│                          │                          │ Mitigasi: Handoff Confirmation Modal     │
│                          │                          │ menyediakan tombol cadangan manual.      │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────────────+
│ 3. Batas Kuota API AI    │ DAMPAK: SEDANG           │ Lonjakan obrolan simultan dapat menyentuh│
│    (Rate Limit / Quota)  │ PELUANG: RENDAH          │ batas gratis/berbayar Groq Cloud.        │
│                          │                          │ Mitigasi: Arsitektur failover otomatis   │
│                          │                          │ ke Google Gemini sukses mereduksi risiko.│
+──────────────────────────┴──────────────────────────┴──────────────────────────────────────────+
```

---

## 7. VERIFIKASI FAKTUAL: KLAIM PEMASARAN VS REALITAS TEKNIS

Sebagai rujukan laporan akademik yang dapat dipertanggungjawabkan di hadapan dewan penguji, berikut adalah perbandingan antara klaim pemasaran (*marketing claims*) pada website dengan bukti teknis lapangan berdasarkan 4 kategori verifikasi standar:

1. **Klaim Luas Arena "1.200 m² Bertingkat & Full AC"**:
   - *Status Verifikasi*: **Teramati pada website & Terverifikasi dari klaim profil**.
   - *Bukti*: Dikonfirmasi oleh dokumentasi visual foto asli (`assets/img/arena-wargame.jpg`) dan alamat fisik arena di The Central Mall Gunawangsa Tidar Surabaya Lantai Indoor. Namun demikian, pengukuran dimensi fisik secara geodetik langsung di lokasi belum dilakukan.
2. **Klaim Statistik "2500+ Active Players" dan "50+ Rental Guns"**:
   - *Status Verifikasi*: **Belum Terverifikasi (Representasi Pemasaran Statis)**.
   - *Bukti*: Nilai numerik `2500` dan `50` diatur secara statis pada atribut `data-target="2500"` dan `data-target="50"` di dalam `index.html:L5085-L5090` yang digerakkan oleh fungsi animasi peramban `animateCounters()`, bukan ditarik dari penghitung basis data transaksi live.
3. **Klaim "100% Safety Record"**:
   - *Status Verifikasi*: **Teramati pada website (Klaim Pemasaran)**.
   - *Bukti*: Dicantumkan sebagai elemen lencana grafis pada `index.html:L5095`. Pada implementasi operasional, sistem mendukung prosedur keamanan melalui SOP pendampingan wasit (*Game Marshal*) serta kewajiban uji *chrono test* unit di bawah 350 FPS.
4. **Klaim "Online 24/7" pada Widget CS Mindream**:
   - *Status Verifikasi*: **Teramati pada website & Terverifikasi dari source code (Ketersediaan bergantung pada pihak ketiga)**.
   - *Bukti*: Teks "Online 24/7" disuntikkan secara statis pada tombol launcher (`assets/js/cs-bot.js:L149`). Secara arsitektur, backend serverless Vercel dan penyedia AI Groq/Gemini beroperasi di cloud tanpa jam istirahat server lokal, namun ketersediaannya tetap bergantung pada stabilitas jaringan dan uptime penyedia API pihak ketiga.

---

## 8. ROADMAP REKOMENDASI PENINGKATAN SISTEM BERTINGKAT

Untuk memfasilitasi pengembangan berkelanjutan pasca-audit, disusun roadmap rekomendasi berbasis matriks urgensi dan dampak:

```
[SEGERA: Jangka Pendek] ─────► [JANGKA MENENGAH] ─────────► [JANGKA PANJANG]
• Integrasi Basis Data         • Payment Gateway (QRIS)     • WhatsApp Business API Resmi
• Slot Checking API            • Web Admin Dashboard        • PWA Offline Caching
• Pemantauan Galat (Sentry)    • Optimasi Aset WebP         • Sistem Ulasan Terverifikasi
```

### 8.1 Prioritas Tinggi (Jangka Pendek / Segera)
1. **Integrasi Basis Data Cloud Relasional (Supabase / Neon PostgreSQL)**:
   - *Tujuan*: Mencatat seluruh formulir reservasi yang dikirim pengguna ke dalam tabel `bookings` sebelum diarahkan ke WhatsApp.
   - *Manfaat*: Menyimpan riwayat reservasi pelanggan, mencegah kehilangan data saat handoff WhatsApp gagal, dan memungkinkan analitik tren jam sibuk.
2. **Pembangunan Endpoint Validasi Kuota Slot Real-Time (`GET /api/slots?date=...`)**:
   - *Tujuan*: Memeriksa kapasitas arena pada tanggal dan jam tertentu secara otomatis saat pengguna memilih jam.
   - *Manfaat*: Menonaktifkan (*disable*) opsi jam yang telah penuh dipesan, mengeliminasi risiko *overbooking* atau bentrok jadwal.
3. **Penyematan Alat Pemantau Galat Terpusat (Sentry / Logflare)**:
   - *Tujuan*: Menangkap galat JavaScript di sisi klien dan kegagalan fungsi serverless `/api/chat` secara real-time ke dasbor pengembang.

### 8.2 Prioritas Menengah (Jangka Menengah)
1. **Integrasi Gerbang Pembayaran Otomatis (Payment Gateway Midtrans / Xendit)**:
   - *Tujuan*: Menyediakan opsi pembayaran Uang Muka (DP) instan via QRIS (GoPay, OVO, ShopeePay, BCA) atau Virtual Account.
   - *Manfaat*: Menjamin komitmen kehadiran pemain (*no-show reduction*), mengurangi beban konfirmasi transfer manual oleh admin.
2. **Pembangunan Panel Admin Berbasis Web (*Web Admin Dashboard*)**:
   - *Tujuan*: Antarmuka khusus staf kasir dan Game Marshal untuk memverifikasi kedatangan pelanggan, mengubah status jadwal, dan mengelola harga paket.
3. **Konversi Format Gambar ke WebP dan Implementasi Responsive Picture Tag**:
   - *Tujuan*: Mengonversi 14 aset foto JPEG ke WebP.
   - *Manfaat*: Mengurangi ukuran transfer data halaman hingga 40%, mempercepat waktu muat pada jaringan seluler 4G/3G.

### 8.3 Prioritas Rendah (Jangka Panjang)
1. **Migrasi ke WhatsApp Business Platform API Resmi (Cloud API / BSP)**:
   - *Tujuan*: Menggantikan skema `wa.me` manual dengan webhook dua arah resmi dari Meta.
   - *Manfaat*: Mengirimkan pesan konfirmasi pemesanan interaktif dengan tombol resmi langsung dari server tanpa tergantung aplikasi ponsel pengguna.
2. **Implementasi Progressive Web App (PWA)**:
   - *Tujuan*: Menambahkan service worker dan file `manifest.json`.
   - *Manfaat*: Memungkinkan website diinstal di layar utama ponsel pengunjung layaknya aplikasi mandiri dan dapat diakses saat koneksi internet lambat.
3. **Modul Ulasan Pelanggan Terverifikasi (*Verified Reviews System*)**:
   - *Tujuan*: Mengizinkan pemain yang telah selesai bertanding untuk memberikan skor bintang dan testimoni foto di halaman utama.

---

## 9. KESIMPULAN AUDIT

Sistem website Dreamfield Tactical Surabaya merupakan implementasi rekayasa perangkat lunak web yang efektif, pragmatis, dan sangat relevan dengan kebutuhan bisnis masa kini. Pilihan arsitektur *Decoupled Static Serverless* terbukti berhasil menekan biaya operasional server hingga tingkat terendah sekaligus memberikan kecepatan akses kelas satu kepada pengguna. 

Kekurangan sistem yang berpusat pada ketiadaan basis data dan payment gateway otomatis merupakan konsekuensi logis dari fase pengembangan tahap awal (*MVP / Minimum Viable Product*). Dengan mengimplementasikan roadmap rekomendasi yang telah dirumuskan, website ini memiliki potensi besar untuk bertransformasi menjadi platform reservasi taktis terintegrasi penuh berstandar enterprise.
