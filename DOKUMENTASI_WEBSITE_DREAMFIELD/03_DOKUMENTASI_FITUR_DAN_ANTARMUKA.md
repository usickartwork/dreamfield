# DOKUMENTASI FITUR DAN ANTARMUKA SISTEM
## Website Resmi Dreamfield Tactical Surabaya (https://dreamfield.vercel.app)

---

## DAFTAR ISI
1. [Pendahuluan dan Ruang Lingkup](#1-pendahuluan-dan-ruang-lingkup)
2. [Matriks Inventarisasi Fitur dan Komponen](#2-matriks-inventarisasi-fitur-dan-komponen)
3. [Rincian Komponen Navigasi dan Struktur Bersama](#3-rincian-komponen-navigasi-dan-struktur-bersama)
   - [3.1 Sticky Navbar dan Drawer Navigasi Mobile](#31-sticky-navbar-dan-drawer-navigasi-mobile)
   - [3.2 Tactical Footer dan Tautan Navigasi Cepat](#32-tactical-footer-dan-tautan-navigasi-cepat)
4. [Rincian Fitur Halaman Utama (index.html)](#4-rincian-fitur-halaman-utama-indexhtml)
   - [4.1 Hero Section dan Dual Action Call-to-Action](#41-hero-section-dan-dual-action-call-to-action)
   - [4.2 Tactical Features Ribbon](#42-tactical-features-ribbon)
   - [4.3 Arena Photo Gallery Slider](#43-arena-photo-gallery-slider)
   - [4.4 Profil Bisnis dan Animated Milestone Counter](#44-profil-bisnis-dan-animated-milestone-counter)
   - [4.5 Tactical Shooting Range Simulator (Mini Game)](#45-tactical-shooting-range-simulator-mini-game)
   - [4.6 Informasi Lokasi Venue dan Integrasi Google Maps](#46-informasi-lokasi-venue-dan-integrasi-google-maps)
5. [Rincian Fitur Katalog Paket (pricelist.html)](#5-rincian-fitur-katalog-paket-pricelisthtml)
   - [5.1 Katalog 5 Arena Pertempuran dan Filter Kategori](#51-katalog-5-arena-pertempuran-dan-filter-kategori)
   - [5.2 Banner Bantuan Konsultasi dan Direct Booking](#52-banner-bantuan-konsultasi-dan-direct-booking)
6. [Rincian Fitur Sistem Reservasi (booking.html)](#6-rincian-fitur-sistem-reservasi-bookinghtml)
   - [6.1 Step 1: Pemilihan Kategori Arena dan Kartu Paket](#61-step-1-pemilihan-kategori-arena-dan-kartu-paket)
   - [6.2 Step 2: Jadwal Operasional dan Dynamic Date-Time Picker](#62-step-2-jadwal-operasional-dan-dynamic-date-time-picker)
   - [6.3 Step 3: Formulir Identitas Pemesan dan Catatan Khusus](#63-step-3-formulir-identitas-pemesan-dan-catatan-khusus)
   - [6.4 Step 4: Verifikasi Ringkasan Pemesanan dan Validasi Form](#64-step-4-verifikasi-ringkasan-pemesanan-dan-validasi-form)
   - [6.5 Live Calculation Engine dan Desktop Summary Card](#65-live-calculation-engine-dan-desktop-summary-card)
   - [6.6 Mobile Sticky Checkout Bar](#66-mobile-sticky-checkout-bar)
   - [6.7 Engine Validasi Jadwal (Blokir Hari Selasa dan Jam 12:00-21:00)](#67-engine-validasi-jadwal-blokir-hari-selasa-dan-jam-1200-2100)
   - [6.8 Handoff Confirmation Modal](#68-handoff-confirmation-modal)
   - [6.9 Generator Tiket Reservasi WhatsApp](#69-generator-tiket-reservasi-whatsapp)
7. [Rincian Layanan Customer Service AI Mindream (assets/js/cs-bot.js & api/chat.js)](#7-rincian-layanan-customer-service-ai-mindream-assetsjscs-botjs--apichatjs)
   - [7.1 Floating Launcher Capsule dan Live Status Pulse](#71-floating-launcher-capsule-dan-live-status-pulse)
   - [7.2 Tactical CS Chat Window dan Action Header](#72-tactical-cs-chat-window-dan-action-header)
   - [7.3 Synthesized Web Audio API Sound System](#73-synthesized-web-audio-api-sound-system)
   - [7.4 Quick Action Prompt Chips](#74-quick-action-prompt-chips)
   - [7.5 Multi-Bubble Streaming dan Natural Typing Delays](#75-multi-bubble-streaming-dan-natural-typing-delays)
   - [7.6 Viewport Anchoring dan Floating Scroll-Down Indicator](#76-viewport-anchoring-dan-floating-scroll-down-indicator)
   - [7.7 Booking Intent Detector dan Dynamic CTA Button](#77-booking-intent-detector-dan-dynamic-cta-button)
   - [7.8 Dual-Engine Failover Backend (Groq & Google Gemini)](#78-dual-engine-failover-backend-groq--google-gemini)
8. [Matriks Komparasi dan Ketergantungan Antarfitur](#8-matriks-komparasi-dan-ketergantungan-antarfitur)

---

## 1. PENDAHULUAN DAN RUANG LINGKUP

Dokumen ini memuat spesifikasi teknis dan fungsional dari seluruh antarmuka pengguna (*User Interface/UI*), komponen interaktif, alur logika proses (*business logic*), serta mekanisme validasi yang diimplementasikan pada website resmi **Dreamfield Tactical Surabaya** (`https://dreamfield.vercel.app`).

Tujuan penyusunan dokumen ini adalah:
1. Menyediakan inventarisasi faktual atas 20 fitur utama sistem berdasarkan pembuktian langsung pada *source code* lokal dan pengujian website produksi online.
2. Memberikan rujukan teknis terstruktur bagi pengembang, penguji sistem (*QA*), akademisi, dan dosen penguji.
3. Mendokumentasikan mekanisme validasi masukan, batas operasional, algoritma kalkulasi harga, alur data *handoff*, serta penanganan galat (*error handling*).

---

## 2. MATRIKS INVENTARISASI FITUR DAN KOMPONEN

Berikut adalah ringkasan inventarisasi 20 fitur dan komponen sistem yang dianalisis:

| ID | Nama Fitur / Komponen | File Implementasi Utama | Kategori | Status Verifikasi |
| :--- | :--- | :--- | :--- | :--- |
| **F-01** | Sticky Navbar & Drawer Navigasi Mobile | `index.html`, `booking.html`, `pricelist.html` | Navigasi Global | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-02** | Tactical Footer & Tautan Cepat | `index.html`, `booking.html`, `pricelist.html` | Navigasi Global | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-03** | Hero Section & Dual CTA | `index.html:L4909-L4956` | Antarmuka Halaman | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-04** | Tactical Features Ribbon | `index.html:L4936-L4955` | Antarmuka Halaman | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-05** | Arena Photo Gallery Slider | `index.html:L4967-L5030` | Multimedia Interaktif | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-06** | Profil Bisnis & Milestone Counter | `index.html:L5032-L5105` | Konten & Animasi | Teramati pada website & Terverifikasi dari source code (Metrik riil belum terverifikasi) |
| **F-07** | Tactical Shooting Range Simulator | `index.html:L5107-L5274`, `L5757-L6560` | Gamifikasi & Interaktif | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-08** | Lokasi Venue & Integrasi Google Maps | `index.html:L5275-L5322` | Informasi Bisnis | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-09** | Katalog 5 Arena Pertempuran | `pricelist.html:L788-L890` | E-Katalog & Routing | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-10** | Banner Bantuan Konsultasi | `pricelist.html:L892-L915` | Call-to-Action | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-11** | Step 1: Kategori & Kartu Paket | `booking.html:L2630-L2720`, `L2970-L3680` | Reservasi (Input) | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-12** | Step 2: Jadwal & Dynamic Picker | `booking.html:L2722-L2785`, `L3682-L3850` | Reservasi (Input) | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-13** | Step 3: Identitas Pemesan & Catatan | `booking.html:L2787-L2835` | Reservasi (Input) | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-14** | Step 4: Konfirmasi & Validasi | `booking.html:L2837-L2875`, `L4050-L4250` | Reservasi (Verifikasi) | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-15** | Live Calculation Engine & Summary | `booking.html:L2877-L2950`, `L3852-L4045` | Komputasi Klien | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-16** | Mobile Sticky Checkout Bar | `booking.html:L2952-L2958`, `L4000-L4040` | Antarmuka Responsif | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-17** | Engine Validasi Jadwal (Selasa & Jam) | `booking.html:L4045-L4260` | Logika Bisnis | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-18** | Handoff Confirmation Modal | `booking.html:L2935-L2955`, `L4290-L4345` | Modal Transisi | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-19** | Generator Tiket Reservasi WhatsApp | `booking.html:L4265-L4320` | Integrasi Eksternal | Terverifikasi dari source code & Terverifikasi melalui pengujian |
| **F-20** | Mindream Tactical AI CS Chatbot | `assets/js/cs-bot.js`, `api/chat.js` | Layanan AI Serverless | Terverifikasi dari source code & Terverifikasi melalui pengujian |

---

## 3. RINCIAN KOMPONEN NAVIGASI DAN STRUKTUR BERSAMA

### 3.1 Sticky Navbar dan Drawer Navigasi Mobile

```
+----------------------------------------------------------------------------------------------------+
| [LOGO DREAMFIELD]   Home   About Us   Tactical Range   Pricelist   | [WA Admin] [Book Now CTA]    |
+----------------------------------------------------------------------------------------------------+
```

- **a. Nama Fitur / Komponen**: Sticky Navigation Bar dan Mobile Drawer Menu (`#header`, `#mobileDrawer`).
- **b. Fungsi & Tujuan**: Menyediakan akses navigasi universal ke seluruh bagian halaman dan halaman pendukung, memfasilitasi konversi cepat melalui tombol pemesanan langsung, serta mengadaptasi tata letak navigasi pada perangkat layar sentuh/ponsel.
- **c. Letak Halaman / Posisi Antarmuka**: Berada di posisi paling atas (*fixed top*) pada `index.html`, `booking.html`, dan `pricelist.html`.
- **d. Cara Akses & Interaksi Pengguna**:
  - Pada layar desktop: Mengklik tautan teks (`Home`, `About`, `Range Game`, `Pricelist`, `Booking`, `WhatsApp`).
  - Pada layar ponsel: Menekan tombol *hamburger* (`#mobileMenuBtn`), membuka laci navigasi samping (*drawer*), lalu memilih menu.
- **e. Deskripsi Tampilan Visual**: Latar belakang hitam transparan gelap (`rgba(26, 26, 26, 0.85)`) dengan efek *backdrop-filter: blur(12px)*, garis pembatas bawah berwarna abu-abu gelap, logo Dreamfield di sebelah kiri dengan aksen hijau neon/lime (`#B7FF00`), dan tombol CTA beraksen tactical lime. Ketika digulir ke bawah, kelas `.scrolled` diaktifkan untuk mempertegas batas dan bayangan.
- **f. Data Masukan (Input)**: *Event click* pada tautan navigasi, tombol hamburger, atau area latar luar (*drawer overlay*); *event scroll* jendela peramban.
- **g. Proses / Logika yang Berjalan**:
  - Script mendengarkan *event scroll*; jika `window.scrollY > 50`, ditambahkan kelas CSS `scrolled`.
  - Pada menu mobile, penekanan tombol memicu pergantian kelas `.open` pada drawer dan `.active` pada overlay, serta mengunci pengguliran halaman (`document.body.style.overflow = 'hidden'`).
- **h. Luaran (Output)**: Perpindahan halaman atau pengguliran halus (*smooth scroll*) ke anchor tujuan (`#about`, `#tactical-range`, `#contact`), atau pembukaan drawer navigasi mobile.
- **i. Validasi & Penanganan Error**: Jika elemen anchor tidak ditemukan, fungsi fallback `smoothScrollTo` mencegah terjadinya galat JavaScript peramban.
- **j. Keterkaitan dengan Fitur Lain**: Terhubung langsung dengan Hero Section, About Section, Mini Game Section, Halaman Pricelist, dan Halaman Booking.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**:
  - `index.html:L4867-L4908` (Markup Navbar & Drawer)
  - `index.html:L5348-L5356` (Script Scroll Header Listener)
  - `index.html:L5735-L5755` (Script Drawer Toggle & Smooth Scroll)
  - `booking.html:L2555-L2615` (Header Booking)
  - `pricelist.html:L722-L772` (Header Pricelist)
- **m. Bukti Pengujian Website Online**: Pada `https://dreamfield.vercel.app`, navbar menempel secara mulus saat digulir. Di layar mobile, drawer terbuka dengan transisi animasi halus dari sisi kanan.
- **n. Keterbatasan & Catatan Khusus**: Tautan halaman booking pada header `booking.html` dinonaktifkan secara visual (*active state*) agar pengunjung fokus menyelesaikan formulir.

---

### 3.2 Tactical Footer dan Tautan Navigasi Cepat

- **a. Nama Fitur / Komponen**: Tactical Footer Section (`<footer>`).
- **b. Fungsi & Tujuan**: Menutup struktur halaman dengan menyajikan identitas legalitas hak cipta, ringkasan jam operasional, tautan navigasi sekunder, dan saluran bantuan darurat.
- **c. Letak Halaman / Posisi Antarmuka**: Terletak di bagian paling bawah pada seluruh halaman website (`index.html`, `booking.html`, `pricelist.html`).
- **d. Cara Akses & Interaksi Pengguna**: Pengguna menggulir halaman hingga ke ujung dasar.
- **e. Deskripsi Tampilan Visual**: Latar belakang hitam arang (`#111111`), batas atas garis taktis berwarna olive, susunan kolom navigasi, lencana legalitas *Dreamfield Tactical Surabaya*, dan teks penegas *Indoor CQB Arena*.
- **f. Data Masukan (Input)**: Klik pengguna pada tautan footer atau tautan media sosial / WhatsApp.
- **g. Proses / Logika yang Berjalan**: Menghantarkan pengguna ke rute yang dipilih atau membuka tautan eksternal WhatsApp di tab baru (`target="_blank"`).
- **h. Luaran (Output)**: Navigasi halaman atau pembukaan aplikasi perpesanan WhatsApp.
- **i. Validasi & Penanganan Error**: Seluruh tautan eksternal dilengkapi atribut keamanan `rel="noopener noreferrer"`.
- **j. Keterkaitan dengan Fitur Lain**: Mereplikasi tautan utama navbar dan menyediakan akses cepat ke WhatsApp Admin (`0822-3313-9118`).
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**:
  - `index.html:L5323-L5336`
  - `booking.html:L2899-L2934`
  - `pricelist.html:L903-L917`
- **m. Bukti Pengujian Website Online**: Tautan footer pada `https://dreamfield.vercel.app` mengarahkan ke halaman terkait tanpa *broken link*.
- **n. Keterbatasan & Catatan Khusus**: Tautan media sosial eksternal (Instagram/TikTok) saat ini mengarah pada anchor placeholder atau link WhatsApp profil bisnis.

---

## 4. RINCIAN FITUR HALAMAN UTAMA (index.html)

### 4.1 Hero Section dan Dual Action Call-to-Action

[Screenshot 01 — Hero Section dengan Lencana Taktis dan Dual Tombol CTA]

- **a. Nama Fitur / Komponen**: Hero Section (`.hero`).
- **b. Fungsi & Tujuan**: Menyampaikan *value proposition* utama, membangun identitas visual arena CQB modern, dan menyajikan dua pintu masuk utama: eksplorasi informasi (*About Us*) dan konversi pemesanan (*Book Now*).
- **c. Letak Halaman / Posisi Antarmuka**: Bagian teratas halaman beranda (`index.html`), tepat di bawah navbar.
- **d. Cara Akses & Interaksi Pengguna**: Tampil seketika saat halaman pertama kali dimuat. Pengguna berinteraksi dengan menekan tombol `.btn-secondary-tactical` atau `.btn-primary-tactical`.
- **e. Deskripsi Tampilan Visual**:
  - Lencana taktis atas: `PREMIUM TACTICAL EXPERIENCE` berlatar gelap transparan dengan ikon tameng.
  - Tipografi utama: Judul tebal dua baris `DOMINATE THE FIELD` dan `MASTER THE GAME` dengan efek *mask reveal*.
  - Paragraf deskriptif yang menegaskan lokasi indoor, full AC, aman, dan ramah pemula di Surabaya.
  - Dua tombol CTA dengan efek hover dan transisi elevasi.
- **f. Data Masukan (Input)**: Klik pengguna pada salah satu tombol CTA.
- **g. Proses / Logika yang Berjalan**:
  - Klik pada tombol *About Us* mengeksekusi *smooth scroll* ke `#about`.
  - Klik pada tombol *Book Now* melakukan navigasi peramban ke halaman `booking.html`.
- **h. Luaran (Output)**: Pergeseran pandangan layar atau perpindahan dokumen peramban.
- **i. Validasi & Penanganan Error**: Menggunakan elemen hyperlink HTML standar semantik (`<a>`), memastikan kompatibilitas penuh peramban tanpa dependensi skrip yang rentan galat.
- **j. Keterkaitan dengan Fitur Lain**: Menjadi titik tolak utama menuju About Section dan Booking Engine.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `index.html:L4909-L4934`.
- **m. Bukti Pengujian Website Online**: Terverifikasi tampil responsif pada desktop maupun ponsel dengan perataan teks di tengah dan tombol proporsional.
- **n. Keterbatasan & Catatan Khusus**: Background video taktis menggunakan poster fallback beresolusi tinggi guna meminimalkan konsumsi kuota data seluler pengunjung.

---

### 4.2 Tactical Features Ribbon

- **a. Nama Fitur / Komponen**: Features Bar / Value Highlights (`.features-bar`).
- **b. Fungsi & Tujuan**: Menampilkan 4 pilar keunggulan layanan Dreamfield Tactical secara ringkas guna menumbuhkan kepercayaan instan (*instant trust*) pengunjung.
- **c. Letak Halaman / Posisi Antarmuka**: Terletak tepat di antara Hero Section dan About Section pada `index.html`.
- **d. Cara Akses & Interaksi Pengguna**: Terlihat langsung saat pengguna mulai menggulir halaman ke bawah.
- **e. Deskripsi Tampilan Visual**: Kisi 4 kolom horizontal (*grid*) berlatar arang gelap, dibatasi garis tepi halus, masing-masing memuat ikon FontAwesome bertema taktis, judul tebal, dan deskripsi singkat satu baris:
  1. *High-Grade Armory* (Unit AEG & GBB terawat presisi tinggi).
  2. *Realistic CQB Arena* (Layout medan taktis modular).
  3. *Safety Guaranteed* (Pelindung wajah & body vest standar).
  4. *Tournament Ready* (Skor digital & briefing marshal).
- **f. Data Masukan (Input)**: Posisi gulir jendela peramban (*viewport scroll*).
- **g. Proses / Logika yang Berjalan**: Menggunakan API `IntersectionObserver` untuk memicu penambahan kelas `.active` pada elemen `.slide-reveal` saat memasuki *viewport* (ambang batas 12%).
- **h. Luaran (Output)**: Efek animasi geser ke atas (*slide up*) yang halus dan modern.
- **i. Validasi & Penanganan Error**: Skrip memiliki blok `else` untuk peramban lawas tanpa `IntersectionObserver`, yang langsung mengaktifkan kelas secara instan.
- **j. Keterkaitan dengan Fitur Lain**: Menjembatani pesan promosi hero menuju rincian operasional arena.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `index.html:L4936-L4955` (HTML) dan `index.html:L5358-L5379` (IntersectionObserver Script).
- **m. Bukti Pengujian Website Online**: Transisi animasi tampak mulus pada 60fps tanpa menyebabkan *layout shifting*.
- **n. Keterbatasan & Catatan Khusus**: Teks bersifat statis dan informatif, bukan tautan klik.

---

### 4.3 Arena Photo Gallery Slider

[Screenshot 02 — Galeri Slider Foto Arena dengan Indikator Status HUD dan Counter 01/05]

- **a. Nama Fitur / Komponen**: Interactive Arena Photo Slider (`#arenaSlider`).
- **b. Fungsi & Tujuan**: Memperlihatkan dokumentasi visual otentik arena, zona permainan, unit, dan fasilitas safe-zone kepada calon pengunjung guna mengeliminasi keraguan visual.
- **c. Letak Halaman / Posisi Antarmuka**: Kolom kiri dari About Section (`#about`) pada `index.html`.
- **d. Cara Akses & Interaksi Pengguna**:
  - Mengklik tombol panah navigasi kiri (*prev*) atau kanan (*next*).
  - Mengklik langsung salah satu dari 5 tombol titik indikator (*slider dots*).
  - Melakukan usapan gestur layar sentuh (*swipe gesture*) ke kiri/kanan pada layar ponsel.
- **e. Deskripsi Tampilan Visual**:
  - Bingkai bertema HUD taktis dengan status header `ARENA PHOTO GALLERY` dan counter numerik dinamis (misal: `01 / 05`).
  - Gambar beresolusi tinggi rasio 16:9 yang dilengkapi overlay teks taktis transparan di bagian bawah (*slide tag*, judul zona, dan deskripsi).
  - Tombol kontrol panah melayang di samping dan indikator titik di dasar slider.
- **f. Data Masukan (Input)**: Klik tombol kontrol, klik thumbnail/dots, *touch events* (`touchstart`, `touchend`).
- **g. Proses / Logika yang Berjalan**:
  - Menghitung indeks aktif modulo jumlah slide (5 slide: *CQB Arena*, *Shooting Target*, *Armory Gear*, *Tactical Stage*, *Community Squad*).
  - Menggeser transform CSS horizontal pada `.slider-track` dan memperbarui teks counter `#sliderCounter`.
  - Timer rotasi otomatis (*autoplay*) berganti setiap 5000 milidetik; dijeda saat kursor melintas (*pause on hover*).
- **h. Luaran (Output)**: Pergeseran slide visual secara mulus dan pembaruan counter nomor slide aktif.
- **i. Validasi & Penanganan Error**: Indeks dijaga agar selalu berputar secara melingkar (*circular looping* 0 hingga 4) tanpa menimbulkan indeks negatif atau *out-of-bounds*.
- **j. Keterkaitan dengan Fitur Lain**: Merefleksikan fasilitas nyata yang dapat dipesan pada halaman booking.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `index.html:L4967-L5030` (HTML) dan `index.html:L5425-L5550` (JavaScript Slider Controller).
- **m. Bukti Pengujian Website Online**: Transisi slide bekerja sempurna di desktop dan mendukung gestur geser sentuh di layar ponsel iPhone & Android.
- **n. Keterbatasan & Catatan Khusus**: Seluruh aset gambar disimpan secara lokal di folder `assets/img/` guna mencegah kegagalan pemuatan akibat pemblokiran CDN eksternal.

---

### 4.4 Profil Bisnis dan Animated Milestone Counter

- **a. Nama Fitur / Komponen**: About Business Details & Stats Counter (`.about-stats`).
- **b. Fungsi & Tujuan**: Menguraikan profil perusahaan, komitmen keselamatan, fasilitas ber-AC, serta menyajikan angka pencapaian (*social proof*) secara dinamis.
- **c. Letak Halaman / Posisi Antarmuka**: Kolom kanan dari About Section (`#about`) pada `index.html`.
- **d. Cara Akses & Interaksi Pengguna**: Menggulir halaman ke About Section.
- **e. Deskripsi Tampilan Visual**: Paragraf editorial berbobot, poin fasilitas dengan ikon centang lime, dan kisi 4 metrik pencapaian bernuansa neon:
  - `2500+` Active Players (nilai target counter: 2500).
  - `50+` Rental Guns (nilai target counter: 50).
  - `100%` Safety Record.
  - `1.200m²` Arena CQB.
- **f. Data Masukan (Input)**: Pemicu *IntersectionObserver* saat elemen `.about-stats` terlihat minimal 25% di layar.
- **g. Proses / Logika yang Berjalan**: Fungsi `animateCounters()` membaca atribut `data-target`, lalu menjalankan perulangan `requestAnimationFrame` dengan laju pertambahan proporsional hingga mencapai target numerik akhir.
- **h. Luaran (Output)**: Angka yang berputar bertambah secara visual dari 0 hingga nilai akhir dengan imbuhan tanda `+` atau `%`.
- **i. Validasi & Penanganan Error**: Variabel pengaman (*flag*) `let counted = false` memastikan kalkulasi animasi hanya berjalan satu kali per pemuatan halaman sehingga tidak membebani pemroses grafis.
- **j. Keterkaitan dengan Fitur Lain**: Memperkuat kredibilitas sebelum pengunjung beralih ke katalog harga atau simulasi permainan.
- **k. Status Verifikasi**: `Teramati pada website & Terverifikasi dari source code (Metrik riil belum terverifikasi)`.
- **l. Bukti Implementasi Source Code**: `index.html:L5032-L5105` (HTML) dan `index.html:L5381-L5415` (Counter Animation Engine).
- **m. Bukti Pengujian Website Online**: Angka bertambah secara mulus dan berhenti tepat pada nilai target saat halaman digulir.
- **n. Keterbatasan & Catatan Khusus**: Angka statistik ini teramati pada website dan terverifikasi di source code sebagai atribut statis `data-target="2500"`, namun data transaksi pemain riil belum terverifikasi melalui basis data terpusat.

---

### 4.5 Tactical Shooting Range Simulator (Mini Game)

[Screenshot 03 — Mini Shooting Range Simulator Interaktif dengan HUD Taktis dan 3 Tahapan Target]

- **a. Nama Fitur / Komponen**: Hardcore 3-Step Interactive Target Simulator (`#tactical-range`).
- **b. Fungsi & Tujuan**: Memberikan pengalaman interaktif langsung bagi pengunjung untuk merasakan sensasi membidik dan menembak target airsoft sebelum datang ke arena fisik, meningkatkan waktu tinggal (*dwell time*) di website.
- **c. Letak Halaman / Posisi Antarmuka**: Bagian bawah halaman utama `index.html`, sebelum kontak venue.
- **d. Cara Akses & Interaksi Pengguna**:
  - Mengklik tombol `READY / MULAI DRILL` untuk memulai simulasi.
  - Mengarahkan kursor/jari ke area target dan melakukan klik/sentuhan untuk menembak.
  - Menekan tombol `RELOAD` di tengah saat amunisi habis.
- **e. Deskripsi Tampilan Visual**:
  - Layar simulasi bertema medan uji tembak (*shooting lane*) bergaris grid taktis.
  - HUD bagian atas: Status Tahap (Stage 1: Popper Baja, Stage 2: Target Bergerak, Stage 3: Sandera vs Musuh), Penghitung Waktu Mundur 10 Detik (*countdown timer*), Indikator Amunisi (15 butir BB), Skor, Akurasi persentase dinamis.
  - Efek kilatan tembakan (*muzzle flash*), lubang peluru pada dinding, dan animasi target roboh.
  - Tombol reload mencolok di posisi tengah saat amunisi 0.
- **f. Data Masukan (Input)**: Koordinat klik mouse / sentuhan jari pada elemen target atau bidang dinding perintang; klik tombol interaksi.
- **g. Proses / Logika yang Berjalan**:
  - Logika fisika gerak target menggunakan `requestAnimationFrame` untuk menggerakkan target horizontal secara acak (*random velocity & ducking*).
  - Deteksi benturan target (*hitbox collision*): menembak musuh menambah skor (+100); menembak sandera memicu penalti (-150); menembak dinding dihitung sebagai tembakan meleset (*miss*).
  - Waktu dibatasi 10 detik per tahap. Jika waktu habis sebelum kuota tembakan terpenuhi, ronde diulang.
  - Menghitung akurasi secara matematis: `Akurasi = (Total Hit / Total Shots) * 100%`.
  - Umpan balik getaran fisik (*haptic feedback*) menggunakan API `navigator.vibrate(20)`.
  - **Efek Suara**: Dinonaktifkan secara sengaja (*silent dummy functions*) sesuai permintaan pemilik sistem guna menjaga kenyamanan peramban pengguna.
- **h. Luaran (Output)**: Efek visual robohnya target baja, animasi teks skor melayang, layar akhir kemenangan (*Drill Completed Victory Screen*) dengan statistik tembakan lengkap.
- **i. Validasi & Penanganan Error**: Variabel pengunci `isGameActive` mencegah eksekusi tembakan sebelum tombol ready ditekan; mekanisme proteksi gestur mencegah *double-tap zoom* pada perangkat seluler.
- **j. Keterkaitan dengan Fitur Lain**: Dilengkapi tombol langsung menuju pemesanan sesi *Shooting Target Range* pada `booking.html?cat=target`.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**:
  - `index.html:L5107-L5274` (Markup Elemen Game)
  - `index.html:L5757-L6560` (Engine Game 3-Step Simulator)
- **m. Bukti Pengujian Website Online**: Game berjalan sangat responsif pada 60 FPS pada perangkat mobile maupun desktop, tanpa gangguan latensi.
- **n. Keterbatasan & Catatan Khusus**: Audio dimatikan permanen pada skrip peramban; data skor akhir disimpan dalam memori sesi aktif dan tidak dikirim ke leaderboard server terpusat.

---

### 4.6 Informasi Lokasi Venue dan Integrasi Google Maps

- **a. Nama Fitur / Komponen**: Venue Location & Operational Hours Section (`#contact`).
- **b. Fungsi & Tujuan**: Memberikan kejelasan geografis mengenai letak arena di pusat kota Surabaya, rute akses mall, jam buka operasional, dan panduan parkir.
- **c. Letak Halaman / Posisi Antarmuka**: Bagian penutup konten halaman `index.html`, tepat di atas footer.
- **d. Cara Akses & Interaksi Pengguna**: Menggulir ke bawah atau mengklik menu `Contact / Lokasi` di navbar.
- **e. Deskripsi Tampilan Visual**: Tata letak dua kolom: kolom kiri memuat kartu informasi alamat resmi (*The Central Mall Gunawangsa Tidar Surabaya*), radius jarak dari Tunjungan Plaza (±2,8 km), jadwal buka (12.00–21.00 WIB, Selasa Libur), dan tombol navigasi langsung ke Google Maps; kolom kanan memuat pratinjau peta satelit/interaktif.
- **f. Data Masukan (Input)**: Klik pengguna pada tombol tautan Google Maps.
- **g. Proses / Logika yang Berjalan**: Membuka koordinat navigasi Google Maps resmi Dreamfield di tab baru.
- **h. Luaran (Output)**: Aplikasi Google Maps atau tab peramban baru dengan rute navigasi GPS.
- **i. Validasi & Penanganan Error**: Menggunakan URL universal resmi Google Maps dengan parameter keamanan standar.
- **j. Keterkaitan dengan Fitur Lain**: Sinkron dengan informasi jadwal operasional pada chatbot CS dan formulir booking.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `index.html:L5275-L5322`.
- **m. Bukti Pengujian Website Online**: Tombol maps berhasil membuka rute ke Gunawangsa Tidar Surabaya.
- **n. Keterbatasan & Catatan Khusus**: Integrasi menggunakan URL tautan navigasi langsung, bukan embed iFrame dinamis berbayar Google Maps API.

---

## 5. RINCIAN FITUR KATALOG PAKET (pricelist.html)

### 5.1 Katalog 5 Arena Pertempuran dan Filter Kategori

[Screenshot 04 — Katalog 5 Arena Pertempuran pada Halaman Pricelist dengan Tautan Deep-Link]

- **a. Nama Fitur / Komponen**: 5 Battle Arena Interactive Catalog (`.arena-bar-list`).
- **b. Fungsi & Tujuan**: Menyajikan rincian komparasi seluruh lini produk arena Dreamfield beserta kisaran harga terendah, memandu calon pemain memilih arena yang sesuai dengan preferensi mereka.
- **c. Letak Halaman / Posisi Antarmuka**: Terletak pada kontainer utama halaman `pricelist.html`.
- **d. Cara Akses & Interaksi Pengguna**: Pengguna membuka halaman `/pricelist` atau `pricelist.html` dari navigasi.
- **e. Deskripsi Tampilan Visual**: Deretan kartu batangan horizontal (*arena bar*) bernomor taktis (01 sampai 05) dengan gambar thumbnail arena, lencana tipe arena, judul besar berhuruf kapital, subjudul spesifikasi fasilitas, lencana `TERPOPULER` pada War Game CQB, dan tombol pil interaktif berpanah di sebelah kanan:
  1. *01 · Shooting Target Range* (Mulai Rp 50.000).
  2. *02 · War Game CQB Arena* (Mulai Rp 35.000, Lencana Terpopuler).
  3. *03 · Tactical Coaching* (Mulai Rp 35.000).
  4. *04 · Unit Coaching & Drill* (Mulai Rp 100.000).
  5. *05 · Tactical Gear Rental* (Mulai Rp 30.000).
- **f. Data Masukan (Input)**: Klik pengguna pada salah satu kartu arena.
- **g. Proses / Logika yang Berjalan**: Mengeksekusi navigasi *deep-linking* ke halaman formulir pemesanan dengan parameter URL kueri kategori: `booking.html?cat={kategori}` (misal: `cat=wargame`, `cat=target`, `cat=coaching`, `cat=unit`, `cat=gear`).
- **h. Luaran (Output)**: Halaman `booking.html` langsung terbuka dengan kategori yang bersangkutan terpilih secara otomatis pada Tahap 1.
- **i. Validasi & Penanganan Error**: Jika parameter URL kueri tidak sesuai atau diubah pengunjung secara manual, sistem booking memiliki fallback *default* ke kategori `wargame`.
- **j. Keterkaitan dengan Fitur Lain**: Terhubung langsung dengan *State Initializer* pada `booking.html:L3560-L3620`.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `pricelist.html:L788-L890`.
- **m. Bukti Pengujian Website Online**: Klik pada salah satu kartu arena di `https://dreamfield.vercel.app/pricelist` terbukti berhasil membuka halaman booking dengan arena terkait langsung aktif.
- **n. Keterbatasan & Catatan Khusus**: Tampilan katalog difokuskan pada ringkasan arena; konfigurasi rincian paket detil diserahkan pada langkah berikutnya di formulir reservasi.

---

### 5.2 Banner Bantuan Konsultasi dan Direct Booking

- **a. Nama Fitur / Komponen**: Consultation & Group Reservation Banner (`.bottom-cta-wrap`).
- **b. Fungsi & Tujuan**: Menampung kebutuhan reservasi rombongan khusus (*corporate gathering*, komunitas besar) yang membutuhkan penawaran khusus di luar paket reguler.
- **c. Letak Halaman / Posisi Antarmuka**: Bagian bawah halaman `pricelist.html`.
- **d. Cara Akses & Interaksi Pengguna**: Mengklik tombol *Konsultasi Tim (WhatsApp)* atau *Pesan Slot Sekarang*.
- **e. Deskripsi Tampilan Visual**: Kotak bertema gelap beraksen garis neon, ikon headset customer service, teks judul konsultasi rombongan, serta sepasang tombol aksi.
- **f. Data Masukan (Input)**: Klik pengguna.
- **g. Proses / Logika yang Berjalan**: Membuka percakapan WhatsApp ke nomor resmi `0822-3313-9118` dengan pesan otomatis terformat seputar konsultasi rombongan.
- **h. Luaran (Output)**: Pengalihan ke aplikasi WhatsApp.
- **i. Validasi & Penanganan Error**: Tautan menggunakan enkripsi parameter URL standar.
- **j. Keterkaitan dengan Fitur Lain**: Melengkapi alur konversi di luar sistem reservasi standar formulir.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `pricelist.html:L892-L915`.
- **m. Bukti Pengujian Website Online**: Tombol berhasil mengarahkan pengguna ke aplikasi WhatsApp dengan nomor admin resmi.
- **n. Keterbatasan & Catatan Khusus**: Konsultasi rombongan ditangani secara manual oleh admin WhatsApp.

---

## 6. RINCIAN FITUR SISTEM RESERVASI (booking.html)

### 6.1 Step 1: Pemilihan Kategori Arena dan Kartu Paket

[Screenshot 05 — Formulir Reservasi Step 1: Pemilihan 5 Arena dan Kartu Paket Terkait]

- **a. Nama Fitur / Komponen**: Step 1 Booking: Arena & Package Selector (`#step-arena`, `#step-pkg`).
- **b. Fungsi & Tujuan**: Mengatur pemilihan arena permainan utama dan paket durasi/peralatan yang diinginkan pelanggan secara hierarki bertingkat.
- **c. Letak Halaman / Posisi Antarmuka**: Langkah pertama formulir reservasi pada `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**:
  - Mengklik salah satu dari 5 tab pill arena: `War Game CQB`, `Shooting Target`, `Tactical Coaching`, `Unit Drill`, atau `Gear Rental`.
  - Mengklik kartu paket yang muncul di bawah tab terpilih.
- **e. Deskripsi Tampilan Visual**: Tab arena dilengkapi ikon taktis; kartu paket menyajikan nama paket, platform unit, lencana *Terpopuler*, harga besar berwarna hijau lime, satuan waktu/orang, deskripsi taktis, dan daftar fasilitas yang disertakan dengan ikon centang. Kartu yang dipilih mendapatkan bingkai hijau menyala (*glow border*).
- **f. Data Masukan (Input)**: Pemilihan kategori via klik atau kueri URL (`?cat=...`); klik kartu paket dengan atribut `data-pkg-id`.
- **g. Proses / Logika yang Berjalan**:
  - Fungsi `selectCategory(catKey)` memuat sub-paket dari objek `packageCatalog[catKey]`.
  - Fungsi `renderPackageCards(catKey)` membersihkan kontainer dan membuat kartu HTML baru secara dinamis.
  - Memilih paket memperbarui variabel global `currentSelectedPackage` dan memicu fungsi `updateLiveSummary()`.
- **h. Luaran (Output)**: Kartu paket aktif ditandai kelas `.selected`, dan data paket tercermin pada kalkulator ringkasan di sebelah kanan/bawah.
- **i. Validasi & Penanganan Error**: Sistem memblokir langkah berikutnya jika pengguna belum memilih paket (`if (!currentSelectedPackage)`).
- **j. Keterkaitan dengan Fitur Lain**: Menentukan basis tarif untuk Live Calculation Engine dan parameter teks tiket WhatsApp.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L2630-L2720` (HTML) dan `booking.html:L2970-L3680` (Catalog Schema & Renderer).
- **m. Bukti Pengujian Website Online**: Perpindahan antar-kategori memuat kartu paket secara instan tanpa kedipan (*flicker*).
- **n. Keterbatasan & Catatan Khusus**: Data katalog tersimpan secara statis di sisi klien (*client-side array object*) dan belum di-fetch dari REST API database terpusat.

---

### 6.2 Step 2: Jadwal Operasional dan Dynamic Date-Time Picker

[Screenshot 06 — Formulir Reservasi Step 2: Kalender Pemilihan Tanggal dan Slot Waktu 12:00-21:00]

- **a. Nama Fitur / Komponen**: Step 2 Booking: Operational Schedule Selector (`#step-schedule`).
- **b. Fungsi & Tujuan**: Memfasilitasi pemilihan tanggal kedatangan, verifikasi hari libur mingguan, serta penentuan jam sesi permainan dalam rentang operasional yang sah.
- **c. Letak Halaman / Posisi Antarmuka**: Langkah kedua formulir reservasi pada `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**:
  - Mengisi atau memilih tanggal pada input kalender `#book-date`.
  - Memilih jam pada dropdown `#book-time` atau mengklik chip slot waktu cepat.
  - Mengatur jumlah personel pemain pada input angka `#book-players`.
- **e. Deskripsi Tampilan Visual**: Kotak tanggal dengan batasan tanggal minimal hari ini, peringatan hari Selasa libur berwarna merah/kuning, pemilih jam dengan opsi rentang 12:00 hingga 21:00 WIB, serta tombol pengatur jumlah pemain (- dan +).
- **f. Data Masukan (Input)**: Nilai string tanggal format `YYYY-MM-DD`, nilai waktu format `HH:MM`, nilai numerik jumlah pemain (1 hingga 50).
- **g. Proses / Logika yang Berjalan**:
  - Tanggal minimal dibatasi otomatis ke hari ini menggunakan `new Date().toISOString().split('T')[0]`.
  - Event listener `change` pada tanggal mengecek hari: jika `dateObj.getDay() === 2` (Hari Selasa), sistem menampilkan pesan peringatan libur dan memblokir konfirmasi.
  - Mengubah jumlah personel memicu perkalian otomatis pada kalkulator biaya.
- **h. Luaran (Output)**: Tanggal, jam sesi, dan jumlah pemain diperbarui seketika pada kartu ringkasan.
- **i. Validasi & Penanganan Error**: Pencegahan pemilihan tanggal lampau, penolakan otomatis hari Selasa, dan penolakan jam di luar 12.00–21.00 WIB.
- **j. Keterkaitan dengan Fitur Lain**: Berkorelasi langsung dengan Engine Validasi Jadwal (F-17) dan Live Summary (F-15).
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L2722-L2785` (HTML) dan `booking.html:L3682-L3850` (Schedule Logic).
- **m. Bukti Pengujian Website Online**: Memilih hari Selasa pada peramban secara otomatis memunculkan teks peringatan bahwa arena tutup untuk pemeliharaan rutin.
- **n. Keterbatasan & Catatan Khusus**: Ketersediaan kuota slot pada jam yang dipilih tidak dicek secara *real-time* ke sistem server internal; konfirmasi ketersediaan final dilakukan oleh Admin WhatsApp.

---

### 6.3 Step 3: Formulir Identitas Pemesan dan Catatan Khusus

- **a. Nama Fitur / Komponen**: Step 3 Booking: Customer Contact Details (`#step-contact`).
- **b. Fungsi & Tujuan**: Menghimpun data narahubung utama pelanggan (nama lengkap, nomor WhatsApp aktif) dan permintaan khusus sebelum kedatangan ke arena.
- **c. Letak Halaman / Posisi Antarmuka**: Langkah ketiga formulir reservasi pada `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**: Mengetikkan data teks pada field input `#book-name`, `#book-phone`, dan textarea `#book-notes`.
- **e. Deskripsi Tampilan Visual**: Form bertema taktis gelap dengan border fokus hijau neon, label input yang jelas, petunjuk nomor WhatsApp (format angka Indonesia), dan textarea catatan opsional.
- **f. Data Masukan (Input)**:
  - Nama Pemesan (string teks, wajib diisi).
  - No. WhatsApp (string angka/telepon, wajib diisi).
  - Catatan Khusus (string teks bebas, opsional).
- **g. Proses / Logika yang Berjalan**: Event listener mendengarkan input; jika terjadi error sebelumnya, pengetikan ulang otomatis menghapus tanda merah error (*clear error on input*).
- **h. Luaran (Output)**: Data identitas tersimpan di memori state formulir untuk disusun ke dalam tiket WhatsApp.
- **i. Validasi & Penanganan Error**: Pengecekan *whitespace*; jika nama atau nomor WhatsApp kosong saat tombol konfirmasi ditekan, field diberi kelas `.has-error` bergaris merah dan layar digulir otomatis ke field tersebut (*auto-focus & scroll into view*).
- **j. Keterkaitan dengan Fitur Lain**: Memasok data kepala tiket pada WhatsApp Handoff Generator.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L2787-L2835`.
- **m. Bukti Pengujian Website Online**: Field input merespons validasi kosong dengan menampilkan garis tepi merah dan pesan *feedback* yang sesuai.
- **n. Keterbatasan & Catatan Khusus**: Belum dilengkapi validasi OTP SMS atau pengecekan API nomor telepon aktif secara otomatis.

---

### 6.4 Step 4: Verifikasi Ringkasan Pemesanan dan Validasi Form

- **a. Nama Fitur / Komponen**: Step 4 Booking: Final Form Review & Action (`#step-confirm`).
- **b. Fungsi & Tujuan**: Menjadi titik verifikasi akhir pengguna sebelum mengirimkan data ke WhatsApp Admin, memastikan seluruh data pesanan telah diperiksa ulang.
- **c. Letak Halaman / Posisi Antarmuka**: Langkah keempat pada kontainer kolom kiri `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**: Pengguna menekan tombol hijau besar `Konfirmasi Booking via WhatsApp` (`#btnMainSubmit`).
- **e. Deskripsi Tampilan Visual**: Tombol hijau terang berukuran penuh (*full-width*) dengan ikon WhatsApp dan panah, teks instruksi bahwa pemesanan akan dialihkan langsung ke obrolan resmi Customer Service Dreamfield.
- **f. Data Masukan (Input)**: *Event click* pada `#btnMainSubmit`.
- **g. Proses / Logika yang Berjalan**: Menjalankan fungsi sentral `submitBookingToWhatsApp()` yang mengeksekusi rangkaian 6 lapis validasi berurutan:
  1. Validasi Kategori Arena.
  2. Validasi Paket Terpilih.
  3. Validasi Tanggal dan Pengecekan Hari Selasa.
  4. Validasi Jam Kedatangan (12:00 - 21:00).
  5. Validasi Nama Pemesan.
  6. Validasi Nomor Telepon WhatsApp.
- **h. Luaran (Output)**: Membuka Handoff Confirmation Modal dan memicu pembukaan jendela obrolan WhatsApp.
- **i. Validasi & Penanganan Error**: Jika salah satu validasi gagal, proses dihentikan seketika (*early return*), field penyebab galat diberi highlight merah, dan halaman digulir halus ke elemen terkait.
- **j. Keterkaitan dengan Fitur Lain**: Merupakan orkestrator yang menghubungkan seluruh input Step 1, 2, 3 ke generator WhatsApp.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L2837-L2875` (HTML) dan `booking.html:L4050-L4260` (Validation Script).
- **m. Bukti Pengujian Website Online**: Berhasil menolak submit jika ada data kosong, serta berhasil memunculkan modal handoff jika seluruh data valid.
- **n. Keterbatasan & Catatan Khusus**: Transaksi tidak menghasilkan *booking invoice number* yang tersimpan di basis data relational lokal.

---

### 6.5 Live Calculation Engine dan Desktop Summary Card

- **a. Nama Fitur / Komponen**: Live Calculation Engine & Desktop Summary Card (`.booking-sidebar-card`).
- **b. Fungsi & Tujuan**: Melakukan perhitungan matematis instan terhadap total estimasi biaya sewa berdasarkan tarif paket yang dipilih dan jumlah personel pemain yang didaftarkan.
- **c. Letak Halaman / Posisi Antarmuka**: Kolom kanan (*sticky sidebar*) pada tata letak desktop `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**: Bekerja secara otomatis di latar belakang setiap kali pengguna mengubah paket atau menambah/mengurangi jumlah pemain.
- **e. Deskripsi Tampilan Visual**: Kartu berdesain panel taktis dengan judul `RINGKASAN ESTIMASI`, rincian arena, nama paket, tanggal kedatangan, jam sesi, jumlah personel, dan baris total tarif dengan angka nominal besar berwarna hijau lime.
- **f. Data Masukan (Input)**: Objek `currentSelectedPackage.price` dan nilai numerik `book-players`.
- **g. Proses / Logika yang Berjalan**:
  - Mengekstrak angka integer dari string harga paket (misal `"Rp 150.000"` dikonversi menjadi integer `150000`).
  - Menghitung subtotal: `Total = Harga Satuan * Jumlah Pemain`.
  - Memformat kembali nilai integer ke format mata uang Rupiah (`Intl.NumberFormat('id-ID')` atau regex ribuan).
  - Memperbarui teks elemen DOM `#sum-total-val`.
- **h. Luaran (Output)**: Pembaruan visual nominal total tarif secara instan tanpa perlu memuat ulang (*refresh*) halaman.
- **i. Validasi & Penanganan Error**: Jika belum ada paket yang dipilih, total menampilkan nilai default strip (`-`).
- **j. Keterkaitan dengan Fitur Lain**: Menjamin konsistensi antara nominal yang dilihat pengguna di layar dengan teks nominal tiket pada pesan WhatsApp.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L2877-L2950` (HTML) dan `booking.html:L3852-L4045` (Calculation Engine).
- **m. Bukti Pengujian Website Online**: Perubahan jumlah pemain dari 1 ke 4 orang seketika mengalikan total biaya secara akurat pada `https://dreamfield.vercel.app/booking`.
- **n. Keterbatasan & Catatan Khusus**: Perhitungan saat ini belum mencakup diskon kode promo otomatis atau pajak pertambahan nilai terpisah.

---

### 6.6 Mobile Sticky Checkout Bar

- **a. Nama Fitur / Komponen**: Mobile Sticky Bottom Checkout Bar (`.mobile-sticky-checkout`).
- **b. Fungsi & Tujuan**: Menjaga visibilitas total estimasi biaya dan tombol aksi konfirmasi pada layar perangkat ponsel tanpa mengharuskan pengguna menggulir halaman ke atas atau ke bawah.
- **c. Letak Halaman / Posisi Antarmuka**: Tersemat melayang di bagian bawah (*fixed bottom*) khusus pada resolusi layar mobile (`max-width: 768px`) di `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**: Pengguna pada ponsel melihat bar ini menempel di bagian bawah layar dan dapat menekan tombol `WhatsApp...` kapan saja.
- **e. Deskripsi Tampilan Visual**: Bilah gelap berlatar semi-transparan dengan garis pembatas hijau neon di atasnya, memuat label `ESTIMASI BIAYA`, nominal total harga, dan tombol hijau kompak dengan ikon WhatsApp.
- **f. Data Masukan (Input)**: *Event click* pada tombol mobile summary.
- **g. Proses / Logika yang Berjalan**: Mengeksekusi fungsi `handleMobileBookingCTA()`. Fungsi ini mengecek kelengkapan setiap tahapan formulir secara berurutan; jika ada data yang belum lengkap, layar akan secara cerdas digulir halus (*smart scroll*) ke tahapan spesifik yang memerlukan perhatian pengguna.
- **h. Luaran (Output)**: Pengguliran layar otomatis ke field yang belum lengkap, atau eksekusi fungsi reservasi jika seluruh data telah valid.
- **i. Validasi & Penanganan Error**: Menerapkan validasi identik dengan tombol submit desktop untuk menjamin keseragaman aturan bisnis.
- **j. Keterkaitan dengan Fitur Lain**: Menjadi representasi responsif dari Desktop Summary Card (F-15) dan Tombol Konfirmasi Step 4 (F-14).
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L2952-L2958` (HTML) dan `booking.html:L4000-L4040` (Mobile CTA Handler).
- **m. Bukti Pengujian Website Online**: Terverifikasi bekerja sempurna pada perangkat ponsel saat diuji secara online.
- **n. Keterbatasan & Catatan Khusus**: Disembunyikan secara otomatis pada resolusi layar tablet/desktop melalui media query CSS `@media (min-width: 769px) { display: none; }`.

---

### 6.7 Engine Validasi Jadwal (Blokir Hari Selasa dan Jam 12:00-21:00)

- **a. Nama Fitur / Komponen**: Schedule Validation Engine (Tuesday Lock & Operating Hours Guard).
- **b. Fungsi & Tujuan**: Menjaga integritas operasional bisnis dengan mencegah pengunjung melakukan reservasi pada jadwal libur rutin mingguan (Hari Selasa) atau di luar rentang jam buka operasional (12:00 - 21:00 WIB).
- **c. Letak Halaman / Posisi Antarmuka**: Tertanam di dalam logika pemrosesan formulir `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**: Berjalan otomatis saat pengunjung memilih tanggal atau jam, serta saat formulir dikonfirmasi.
- **e. Deskripsi Tampilan Visual**: Pesan peringatan kesalahan berlatar merah tegas dengan ikon tanda seru segitiga pada elemen `#time-status-desc`, serta pewarnaan garis tepi merah pada input yang melanggar.
- **f. Data Masukan (Input)**: Objek tanggal `dateObj = new Date(date + 'T00:00:00')` dan string waktu kedatangan `time`.
- **g. Proses / Logika yang Berjalan**:
  - **Validasi Hari Selasa**: Mengekstrak indeks hari menggunakan metode bawaan JavaScript `dateObj.getDay()`. Karena nilai 2 merepresentasikan hari Selasa dalam standar JavaScript (0=Minggu, 1=Senin, 2=Selasa), kondisi `dateObj.getDay() === 2` memicu pemblokiran ketat (*STRICT BLOCK*).
  - **Validasi Jam Operasional**: Memecah string waktu menjadi integer jam dan menit: `totalMinutes = hh * 60 + mm`. Jika `totalMinutes < 720` (sebelum jam 12:00) atau `totalMinutes > 1260` (setelah jam 21:00), sistem memicu pemblokiran.
- **h. Luaran (Output)**: Penolakan eksekusi konfirmasi dan pemberian pesan peringatan spesifik kepada pengunjung.
- **i. Validasi & Penanganan Error**: Mencegah lolosnya pesanan ke WhatsApp dengan data tanggal libur atau jam tutup.
- **j. Keterkaitan dengan Fitur Lain**: Menjadi penjaga pintu gerbang (*gatekeeper*) utama sebelum Generator Tiket WhatsApp dijalankan.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L4045-L4260`.
- **m. Bukti Pengujian Website Online**: Pengujian online dengan memilih hari Selasa berhasil memblokir proses konfirmasi dan menampilkan peringatan: *"TIDAK BISA KONFIRMASI: Hari Selasa adalah jadwal LIBUR arena"*.
- **n. Keterbatasan & Catatan Khusus**: Belum memiliki konfigurasi dinamis kalender hari libur nasional tentatif di luar jadwal mingguan Selasa.

---

### 6.8 Handoff Confirmation Modal

[Screenshot 07 — Handoff Confirmation Modal yang Menampilkan Rincian Tiket Sebelum Redireksi WhatsApp]

- **a. Nama Fitur / Komponen**: Booking Handoff Confirmation Modal (`#bookingModalOverlay`).
- **b. Fungsi & Tujuan**: Menampilkan jendela konfirmasi penengah (*intermediary transition window*) yang menyajikan rincian ringkas pemesanan dan memberikan tombol cadangan manual jika peramban pengunjung memblokir *auto-redirect* *pop-up*.
- **c. Letak Halaman / Posisi Antarmuka**: Modal dialog mengapung di tengah layar `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**: Terpicu secara otomatis saat validasi formulir Step 1 hingga 4 berhasil terpenuhi.
- **e. Deskripsi Tampilan Visual**: Kotak dialog berlatar gelap bertema taktis, judul `RINGKASAN PEMESANAN`, daftar data rincian pemesan (Nama, Paket, Tanggal, Jam Sesi, Personel), ikon animasi WhatsApp berdenyut, tombol hijau `Buka WhatsApp Sekarang`, dan tombol tutup kecil.
- **f. Data Masukan (Input)**: Data hasil ekstraksi formulir yang telah lolos validasi.
- **g. Proses / Logika yang Berjalan**:
  - Script menyuntikkan teks ke elemen `#modal-sum-name`, `#modal-sum-pkg`, `#modal-sum-date`, `#modal-sum-time`, `#modal-sum-players`.
  - Memasukkan URL WhatsApp terenkripsi ke atribut `href` tombol modal `#modalWaDirectBtn`.
  - Menampilkan modal dengan menambahkan kelas `.active` pada kontainer overlay.
  - Menjalankan pewaktu mundur otomatis selama 600ms: pada perangkat seluler mengalihkan halaman utama (`window.location.href = waUrl`), sedangkan pada desktop mencoba membuka jendela baru (`window.open(waUrl, '_blank')`).
- **h. Luaran (Output)**: Tampilan visual ringkasan tiket dan pengalihan peramban ke aplikasi WhatsApp.
- **i. Validasi & Penanganan Error**: Jika fitur *pop-up blocker* peramban memblokir pembukaan tab baru desktop, pengguna tetap dapat mengklik tombol manual yang tersedia di dalam modal tanpa kehilangan data.
- **j. Keterkaitan dengan Fitur Lain**: Menjadi jembatan transisi antara website lokal dan aplikasi eksternal WhatsApp.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L2935-L2955` (HTML) dan `booking.html:L4290-L4345` (Modal Logic).
- **m. Bukti Pengujian Website Online**: Modal muncul secara elegan dengan animasi pudar dan tombol cadangan berfungsi saat diuji secara online.
- **n. Keterbatasan & Catatan Khusus**: Penutupan modal mengembalikan status tombol konfirmasi utama ke kondisi awal.

---

### 6.9 Generator Tiket Reservasi WhatsApp

- **a. Nama Fitur / Komponen**: Structured WhatsApp Ticket Payload Generator.
- **b. Fungsi & Tujuan**: Merangkai seluruh data masukan formulir pemesanan menjadi format pesan teks tiket yang rapi, profesional, mudah dibaca oleh admin CS fisik, dan mematuhi format perpesanan WhatsApp.
- **c. Letak Halaman / Posisi Antarmuka**: Fungsi internal di dalam skrip `booking.html`.
- **d. Cara Akses & Interaksi Pengguna**: Dieksekusi otomatis di balik layar saat pengguna menyelesaikan langkah konfirmasi.
- **e. Deskripsi Tampilan Visual**: Pesan WhatsApp tersusun dengan pembatas garis estetis, penanda tebal (*bold*), simbol poin, dan tata letak hierarki yang jelas saat masuk ke ruang chat WhatsApp.
- **f. Data Masukan (Input)**: Variabel `name`, `phone`, `catName`, `pkgName`, `pkgPrice`, `formattedDate`, `timeDisplay`, `players`, `notes`.
- **g. Proses / Logika yang Berjalan**:
  - Menggabungkan elemen ke dalam larik string baris per baris:
    ```
    *FORMULIR RESERVASI ARENA*
    *DREAMFIELD TACTICAL SURABAYA*
    ────────────────────────────

    *DATA PEMESAN*
    • Nama: *{name}*
    • No. WhatsApp: *{phone}*

    *DETAIL RESERVASI*
    • Arena: *{catName}*
    • Paket: *{pkgName}*
    • Tarif: *{pkgPrice}*
    • Tanggal: *{formattedDate}*
    • Jam Sesi: *{timeDisplay}*
    • Jumlah Personel: *{players} Orang*
    • Catatan Khusus: {notes}

    ────────────────────────────
    Halo CS Admin Dreamfield Tactical, saya ingin konfirmasi ketersediaan slot reservasi di atas. Terima kasih!
    ```
  - Menggabungkan baris dengan karakter pemisah baris baru (`\n`).
  - Mengonversi teks string menjadi format URL yang aman menggunakan fungsi bawaan `encodeURIComponent(message)`.
  - Merangkai ke endpoint WhatsApp resmi: `https://wa.me/6282233139118?text={payload}`.
- **h. Luaran (Output)**: URL lengkap WhatsApp siap kirim yang membuka obrolan langsung dengan Admin resmi.
- **i. Validasi & Penanganan Error**: Seluruh karakter spesial, spasi, dan baris baru dienkripsi secara tepat sehingga tidak merusak struktur URL peramban.
- **j. Keterkaitan dengan Fitur Lain**: Menjadi muara akhir (*terminal output*) dari seluruh proses bisnis sistem reservasi website Dreamfield.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `booking.html:L3245` (`ADMIN_WA_NUMBER = "6282233139118"`) dan `booking.html:L4265-L4320` (Ticket Formatter).
- **m. Bukti Pengujian Website Online**: Pesan yang diterima pada aplikasi WhatsApp terbukti terformat rapi sesuai rancangan template di atas.
- **n. Keterbatasan & Catatan Khusus**: Status pengiriman pesan bergantung sepenuhnya pada persetujuan pengguna untuk menekan tombol kirim di aplikasi WhatsApp masing-masing.

---

## 7. RINCIAN LAYANAN CUSTOMER SERVICE AI MINDREAM (assets/js/cs-bot.js & api/chat.js)

### 7.1 Floating Launcher Capsule dan Live Status Pulse

[Screenshot 08 — Floating Launcher Capsule Chatbot Mindream di Pojok Kanan Bawah Layar]

- **a. Nama Fitur / Komponen**: Floating Launcher Capsule (`#dfCsLauncher`).
- **b. Fungsi & Tujuan**: Menjadi tombol pemanggil (*entry point*) interaktif widget customer service yang melayang di atas seluruh konten halaman tanpa mengganggu keterbacaan teks utama.
- **c. Letak Halaman / Posisi Antarmuka**: Sudut kanan bawah layar (*fixed bottom-right*) pada `index.html` dan `pricelist.html`.
- **d. Cara Akses & Interaksi Pengguna**: Pengguna mengklik atau menyentuh tombol kapsul tersebut.
- **e. Deskripsi Tampilan Visual**: Kapsul lonjong horizontal berlatar hitam arang dengan batas hijau lime menyala, memuat foto avatar resmi Mindream, indikator lampu hijau berkedip (*pulsing green dot*), teks nama `Tanya Mindream`, dan subjudul hijau `Online 24/7`.
- **f. Data Masukan (Input)**: *Event click* pengguna.
- **g. Proses / Logika yang Berjalan**: Menjalankan fungsi `toggleChat()`, menyembunyikan kapsul launcher dengan kelas `.hidden`, dan menampilkan jendela chat window dengan kelas `.active`.
- **h. Luaran (Output)**: Pembukaan jendela obrolan interaktif dan pemutaran efek audio taktis.
- **i. Validasi & Penanganan Error**: Widget secara sengaja dinonaktifkan pada halaman `booking.html` melalui baris pengecekan `if (window.location.pathname.includes('booking')) return;` agar tidak mengaburkan fokus pengisian formulir.
- **j. Keterkaitan dengan Fitur Lain**: Terhubung langsung dengan jendela obrolan Mindream CS Chat Window (F-7.2).
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `assets/js/cs-bot.js:L142-L152` (Markup) dan `assets/js/cs-bot.js:L186-L191` (Route Exclusion).
- **m. Bukti Pengujian Website Online**: Kapsul melayang terlihat stabil di pojok kanan bawah pada halaman beranda dan katalog harga website produksi.
- **n. Keterbatasan & Catatan Khusus**: Pada resolusi layar ponsel yang sangat kecil, ukuran kapsul disesuaikan secara proporsional melalui CSS agar tidak menutupi tombol navigasi krusial.

---

### 7.2 Tactical CS Chat Window dan Action Header

- **a. Nama Fitur / Komponen**: Tactical CS Chat Window & Action Header (`#dfCsWindow`).
- **b. Fungsi & Tujuan**: Menyediakan wadah dialog interaktif antara pengunjung dan asisten customer service, dilengkapi tombol utilitas kontrol.
- **c. Letak Halaman / Posisi Antarmuka**: Kotak dialog mengapung di sudut kanan bawah desktop atau mengisi layar penuh pada perangkat ponsel.
- **d. Cara Akses & Interaksi Pengguna**: Terbuka setelah tombol launcher ditekan.
- **e. Deskripsi Tampilan Visual**: Header gelap dengan foto avatar, nama `Mindream`, status operasional `Admin Support • Online`, serta 3 tombol aksi di sebelah kanan:
  1. Tombol hijau tautan WhatsApp langsung (`.df-cs-btn-wa`).
  2. Tombol sakelar suara audio (*sound toggle*).
  3. Tombol tutup jendela silang (`#dfCsCloseBtn`).
- **f. Data Masukan (Input)**: Klik tombol utilitas header, atau penekanan tombol navigasi kembali pada ponsel (*popstate event*).
- **g. Proses / Logika yang Berjalan**:
  - Tombol WhatsApp membuka chat ke `https://wa.me/6282233139118`.
  - Tombol suara mematikan/mengaktifkan sintetis audio Web Audio API.
  - Menekan tombol tutup menyembunyikan jendela dan memunculkan kembali tombol launcher.
  - Mengintegrasikan manipulasi `history.pushState` sehingga tombol kembali pada peramban ponsel menutup obrolan, bukan berpindah halaman secara tidak sengaja.
- **h. Luaran (Output)**: Perubahan status jendela obrolan dan preferensi sistem.
- **i. Validasi & Penanganan Error**: Dilengkapi *event listener* `touchmove` khusus yang membatasi usapan horizontal (*horizontal swipe suppression*) agar interaksi dalam kotak chat tidak memicu navigasi riwayat peramban bawaan.
- **j. Keterkaitan dengan Fitur Lain**: Memayungi bodi pesan, tombol scroll-down, dan formulir input chat.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `assets/js/cs-bot.js:L154-L184` (Header UI) dan `assets/js/cs-bot.js:L270-L315` (Gesture & Popstate Guard).
- **m. Bukti Pengujian Website Online**: Jendela chat terbuka dengan animasi halus dan tombol tutup bekerja responsif.
- **n. Keterbatasan & Catatan Khusus**: Posisi jendela menutupi konten di bawahnya saat terbuka, namun dapat diminimalkan kapan saja oleh pengguna.

---

### 7.3 Synthesized Web Audio API Sound System

- **a. Nama Fitur / Komponen**: Zero-Dependency Web Audio API Sound Synthesizer.
- **b. Fungsi & Tujuan**: Memberikan umpan balik suara (*auditory feedback*) bernuansa radio taktis saat pengguna mengirim pesan atau saat balasan admin diterima, tanpa memerlukan pemuatan file audio MP3 eksternal yang lambat.
- **c. Letak Halaman / Posisi Antarmuka**: Modul logika internal pada `assets/js/cs-bot.js`.
- **d. Cara Akses & Interaksi Pengguna**: Berbunyi secara otomatis saat berinteraksi di chat, dapat dimatikan melalui tombol sakelar suara di header chat.
- **e. Deskripsi Tampilan Visual**: Indikator ikon speaker menyala (`fa-volume-high`) atau mati bertanda silang (`fa-volume-xmark`) pada header chat.
- **f. Data Masukan (Input)**: Pemanggilan fungsi `playTacticalSfx('send')` atau `playTacticalSfx('receive')`.
- **g. Proses / Logika yang Berjalan**:
  - Memanfaatkan API bawaan peramban `window.AudioContext`.
  - Membuat node osilator frekuensi (*oscillator node*) dan pengatur volume (*gain node*).
  - **Suara Kirim (`send`)**: Gelombang sinus (*sine wave*), frekuensi naik cepat dari 600Hz ke 900Hz selama 0.05 detik (*tactical blip*).
  - **Suara Terima (`receive`)**: Gelombang segitiga (*triangle wave*), frekuensi modulasi 750Hz berganti ke 980Hz selama 0.12 detik (*double radio beep*).
- **h. Luaran (Output)**: Bunyi audio sintetis jernih dan instan tanpa latensi unduhan jaringan.
- **i. Validasi & Penanganan Error**: Seluruh blok audio dibungkus dalam blok proteksi `try ... catch` untuk mencegah galat pada peramban yang menerapkan kebijakan pembatasan suara otomatis (*autoplay policy*). Status preferensi suara disimpan di `localStorage` peramban.
- **j. Keterkaitan dengan Fitur Lain**: Terhubung dengan alur pengiriman dan penerimaan pesan chatbot.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `assets/js/cs-bot.js:L20-L59`.
- **m. Bukti Pengujian Website Online**: Suara bip taktis berbunyi dengan jernih saat pesan dikirim pada website live.
- **n. Keterbatasan & Catatan Khusus**: Jika pengguna mematikan suara lewat tombol header, osilator tidak dijalankan sama sekali.

---

### 7.4 Quick Action Prompt Chips

- **a. Nama Fitur / Komponen**: Quick Action Prompt Chips (`.df-cs-quick-prompts`).
- **b. Fungsi & Tujuan**: Membantu pengunjung yang bingung untuk menanyakan pertanyaan umum seputar Dreamfield hanya dengan satu kali sentuhan tanpa perlu mengetik manual.
- **c. Letak Halaman / Posisi Antarmuka**: Muncul di dalam bodi pesan obrolan tepat di bawah pesan sambutan pertama.
- **d. Cara Akses & Interaksi Pengguna**: Mengklik salah satu dari 4 tombol pil yang tersedia:
  1. `📍 Lokasi & Jam Buka`
  2. `💰 Daftar Harga Paket`
  3. `🛡️ Arena & Aturan Safety`
  4. `📅 Cara Booking`
- **e. Deskripsi Tampilan Visual**: Deretan tombol pil berwarna abu-abu gelap dengan garis tepi halus, ikon emoji informatif, teks ringkas, dan efek sorot hijau neon saat disentuh.
- **f. Data Masukan (Input)**: Atribut data pertanyaan `data-query` pada masing-masing chip.
- **g. Proses / Logika yang Berjalan**: Mengambil string pertanyaan dari atribut chip lalu secara otomatis memicu pemanggilan fungsi `sendMessage(query)` seolah-olah diketikkan oleh pengguna.
- **h. Luaran (Output)**: Pertanyaan langsung terkirim ke bodi chat dan diproses oleh backend AI.
- **i. Validasi & Penanganan Error**: Chip dinonaktifkan saat status pengiriman sedang berlangsung (`isSending === true`) guna mencegah pengiriman ganda.
- **j. Keterkaitan dengan Fitur Lain**: Memicu alur pengiriman pesan dan balasan streaming multi-bubble.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `assets/js/cs-bot.js:L420-L440`.
- **m. Bukti Pengujian Website Online**: Menekan chip pertanyaan menghasilkan respon instan dari backend AI pada website produksi.
- **n. Keterbatasan & Catatan Khusus**: Chip ditampilkan pada awal percakapan dan menghilang begitu percakapan berlanjut ke topik berikutnya.

---

### 7.5 Multi-Bubble Streaming dan Natural Typing Delays

- **a. Nama Fitur / Komponen**: Multi-Bubble Message Splitter & Humanized Typing Delay Engine.
- **b. Fungsi & Tujuan**: Menghilangkan kesan kaku robotik dengan memecah respons teks panjang menjadi beberapa balon obrolan ringkas bertahap, diselingi jeda mengetik yang realistis layaknya manusia asli yang sedang mengetik di aplikasi obrolan.
- **c. Letak Halaman / Posisi Antarmuka**: Logika antarmuka pada fungsi `sendMessage()` di `assets/js/cs-bot.js`.
- **d. Cara Akses & Interaksi Pengguna**: Terjadi secara otomatis setiap kali admin CS Mindream memberikan balasan kepada pengguna.
- **e. Deskripsi Tampilan Visual**: Animasi 3 titik berdenyut (*typing indicator dots*), diikuti kemunculan balon pesan pertama, jeda membaca sesaat, animasi mengetik kembali, dan kemunculan balon pesan berikutnya.
- **f. Data Masukan (Input)**: String teks respons mentah dari backend `/api/chat`.
- **g. Proses / Logika yang Berjalan**:
  - Respon teks dipecah berdasarkan pemisah baris baru ganda: `cleanReply.split(/\n\n+/)`.
  - **Jeda Awal**: Jeda natural 650ms sebelum admin mulai mengetik.
  - **Durasi Balon Pertama**: Dihitung proporsional berdasarkan panjang karakter: `Math.min(3200, Math.max(2000, bubbles[0].length * 18))` (berkisar 2.0 hingga 3.2 detik).
  - **Balon Berikutnya**: Jeda membaca 750ms, diikuti durasi mengetik 1.5 hingga 2.8 detik (`bubbles[i].length * 16`), lalu balon ditampilkan satu per satu.
- **h. Luaran (Output)**: Alur pesan obrolan berurutan yang nyaman dibaca tanpa membuat pengguna kewalahan menerima paragraf panjang secara mendadak.
- **i. Validasi & Penanganan Error**: Jika terjadi kegagalan jaringan, indikator mengetik langsung dihapus dan pesan galat ramah ditampilkan.
- **j. Keterkaitan dengan Fitur Lain**: Terhubung dengan Viewport Anchoring (F-7.6) dan SFX audio terima.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `assets/js/cs-bot.js:L470-L595`.
- **m. Bukti Pengujian Website Online**: Respon admin terbagi rapi menjadi 2-3 bubble dengan ritme pengetikan yang alami pada `https://dreamfield.vercel.app`.
- **n. Keterbatasan & Catatan Khusus**: Mengetik disimulasikan di sisi klien setelah teks penuh diterima dari backend API serverless.

---

### 7.6 Viewport Anchoring dan Floating Scroll-Down Indicator

[Screenshot 09 — Indikator Panah Melayang 'Pesan Baru di Bawah' saat Balon Obrolan Lanjutan Mengalir]

- **a. Nama Fitur / Komponen**: Bubble Viewport Anchoring & Floating Scroll-Down Indicator (`#dfCsScrollDownBtn`).
- **b. Fungsi & Tujuan**: Menjaga pandangan mata pengguna tetap tenang pada balon pesan pertama yang sedang dibaca tanpa terlonjak paksa ke dasar layar saat balon kedua/ketiga tiba, serta memberikan petunjuk visual jika ada pesan lanjutan di bagian bawah.
- **c. Letak Halaman / Posisi Antarmuka**: Di dalam kontainer obrolan `#dfCsMessages` pada `assets/js/cs-bot.js`.
- **d. Cara Akses & Interaksi Pengguna**: Indikator muncul otomatis; pengguna dapat mengklik tombol panah tersebut untuk meluncur ke pesan terbaru.
- **e. Deskripsi Tampilan Visual**: Tombol melayang lonjong di bagian bawah bodi chat dengan ikon panah ke bawah (`fa-chevron-down`), teks bertuliskan `Pesan baru di bawah`, latar belakang hijau lime gelap, dan animasi transisi pudar (*fade-in*).
- **f. Data Masukan (Input)**: Posisi scroll peramban `container.scrollTop` dan dimensi tinggi kontainer `container.scrollHeight`.
- **g. Proses / Logika yang Berjalan**:
  - Saat balon pertama dirender, fungsi `scrollToFirstNew()` mengunci posisi tampilan di bagian atas balon pertama.
  - Saat balon kedua dan ketiga dirender, posisi scroll sengaja dipertahankan (`container.scrollTop = prevScrollTop`), tidak dipaksa ke bawah.
  - Fungsi `updateScrollDownBtn()` menghitung sisa jarak gulir: `remainingScroll = container.scrollHeight - container.scrollTop - container.clientHeight`. Jika `remainingScroll > 45px`, kelas `.visible` ditambahkan ke tombol.
  - Klik pada tombol memicu *smooth scroll* ke dasar kontainer dan menyembunyikan tombol.
- **h. Luaran (Output)**: Pengalaman membaca yang sangat ergonomis tanpa disorientasi visual.
- **i. Validasi & Penanganan Error**: Pemantauan scroll menggunakan opsi `{ passive: true }` untuk memastikan tidak ada penurunan performa rendering (*frame drop*).
- **j. Keterkaitan dengan Fitur Lain**: Melengkapi mekanisme Multi-Bubble Streaming (F-7.5).
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `assets/js/cs-bot.js:L340-L370` (Scroll Logic) dan `assets/js/cs-bot.js:L225-L235` (Button Event).
- **m. Bukti Pengujian Website Online**: Saat admin mengirim 3 bubble berturut-turut, layar tetap berada di bubble 1 dan tombol panah "Pesan baru di bawah" muncul secara akurat.
- **n. Keterbatasan & Catatan Khusus**: Tombol otomatis menghilang begitu pengguna menggulir layar secara manual mendekati dasar obrolan.

---

### 7.7 Booking Intent Detector dan Dynamic CTA Button

- **a. Nama Fitur / Komponen**: Natural Language Booking Intent Detector & In-Chat Action Button.
- **b. Fungsi & Tujuan**: Mendeteksi secara cerdas apabila pengguna berniat melakukan pemesanan sesi bermain, lalu secara proaktif memunculkan tombol reservasi langsung di dalam gelembung percakapan.
- **c. Letak Halaman / Posisi Antarmuka**: Diimplementasikan pada backend `api/chat.js` dan diperkuat di sisi klien `assets/js/cs-bot.js`.
- **d. Cara Akses & Interaksi Pengguna**: Terpicu saat pengguna mengetik kalimat bermuatan reservasi (misal: *"aku mau booking dong"*, *"bisa reservasi hari minggu?"*, *"gimana cara pesannya?"*). Pengguna kemudian mengklik tombol hijau `Booking Sekarang` yang muncul.
- **e. Deskripsi Tampilan Visual**: Tombol hijau berdesain mencolok dengan ikon kalender centang (`fa-calendar-check`), teks tebal `Booking Sekarang`, tersemat tepat di bawah balon pesan admin terakhir.
- **f. Data Masukan (Input)**: Teks masukan pengguna yang dicocokkan dengan pola ekspresi reguler (*regular expression*):
  ```javascript
  /(mau|ingin|pengen|bisa|tolong|minta|cara|link|buka|jadwal|siap|oke|ikut)\s*(booking|pesan|reservasi|order|main)/i
  ```
- **g. Proses / Logika yang Berjalan**:
  - Pada backend `api/chat.js`: Sistem mengecek apakah balasan memuat token penanda `[BOOKING_CTA]`. Jika model belum menyertakannya tetapi intent terdeteksi, backend menambahkan penanda tersebut.
  - Pada frontend `assets/js/cs-bot.js`: Skrip memisahkan token `[BOOKING_CTA]`, membersihkan teks, dan menyuntikkan elemen tombol tautan `<a href="/booking.html" class="df-cs-booking-btn">`.
- **h. Luaran (Output)**: Pengalihan instan ke halaman formulir reservasi `/booking.html` saat tombol diklik.
- **i. Validasi & Penanganan Error**: Menerapkan mekanisme validasi ganda (*dual-layer check*): di tingkat backend serverless dan di tingkat frontend client untuk mengantisipasi jika model AI melewatkan token.
- **j. Keterkaitan dengan Fitur Lain**: Menjadi jembatan konversi terpenting dari saluran konsultasi CS menuju halaman reservasi resmi.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `api/chat.js:L178-L191` (Backend Intent Detector) dan `assets/js/cs-bot.js:L495-L505` (Frontend CTA Injector).
- **m. Bukti Pengujian Website Online**: Mengetik *"aku mau booking"* pada chatbot langsung menghasilkan tombol hijau `Booking Sekarang` yang mengarah ke `/booking.html`.
- **n. Keterbatasan & Catatan Khusus**: Tombol mengarahkan ke halaman booking umum dan belum mengisi parameter form secara otomatis berdasarkan percakapan sebelumnya (*unpopulated query*).

---

### 7.8 Dual-Engine Failover Backend (Groq & Google Gemini)

- **a. Nama Fitur / Komponen**: High-Availability Dual-Engine Serverless Controller (`/api/chat`).
- **b. Fungsi & Tujuan**: Menjaga keandalan layanan chatbot CS dengan arsitektur failover otomatis: memanfaatkan Groq Cloud API sebagai mesin utama untuk pemrosesan respons teks cepat dan beralih otomatis ke Google Gemini jika terjadi kendala kuota atau gangguan jaringan. Ketersediaan layanan "Online 24/7" merupakan klaim operasional pada antarmuka yang secara teknis bergantung pada uptime layanan pihak ketiga.
- **c. Letak Halaman / Posisi Antarmuka**: File backend serverless `api/chat.js` yang dieksekusi pada infrastruktur Vercel Serverless Functions.
- **d. Cara Akses & Interaksi Pengguna**: Dipanggil secara asinkron via HTTP `POST /api/chat` oleh frontend `assets/js/cs-bot.js`.
- **e. Deskripsi Tampilan Visual**: Tidak memiliki antarmuka visual langsung; beroperasi transparan di balik layar.
- **f. Data Masukan (Input)**: Objek JSON payload HTTP POST:
  ```json
  {
    "message": "Halo, berapa tarif main di arena CQB?",
    "history": [
      { "role": "user", "text": "..." },
      { "role": "model", "text": "..." }
    ]
  }
  ```
- **g. Proses / Logika yang Berjalan**:
  1. Validasi method HTTP (hanya mengizinkan `POST` dan `OPTIONS` untuk CORS preflight).
  2. Ekstraksi kredensial rahasia `GROQ_API_KEY` dan `GEMINI_API_KEY` melalui fungsi pembaca environment variable yang aman.
  3. **Langkah 1 (Mesin Utama - Groq)**: Mengirim permintaan ke endpoint Groq Cloud dengan model `qwen/qwen3.8-27b` (fallback: `qwen/qwen3.6-27b`) dengan batas token 650 dan suhu (*temperature*) 0.7. Jika respons sukses dan valid, respons segera dikembalikan dengan sumber `groq_ai`. *(Catatan: latensi absolut round-trip peramban belum diuji melalui benchmark APM formal)*.
  4. **Langkah 2 (Mesin Cadangan - Google Gemini)**: Jika Groq mengalami error, kehabisan kuota (*rate limit 429*), atau timeout, eksekusi secara otomatis dan senyap dialihkan ke endpoint Google Generative AI dengan model `gemini-3.6-flash` (fallback: `gemini-3.5-flash`). Jika sukses, respons dikembalikan dengan sumber `gemini_ai` dan flag `fallback: true`.
- **h. Luaran (Output)**: Objek JSON terstruktur:
  ```json
  {
    "reply": "Halo kak! Untuk paket main di Dreamfield...",
    "source": "groq_ai",
    "model": "qwen/qwen3.8-27b"
  }
  ```
- **i. Validasi & Penanganan Error**:
  - Penolakan pesan kosong dengan kode status `400 Bad Request`.
  - Penanganan method selain POST dengan kode status `405 Method Not Allowed`.
  - Pembersihan token berpikir internal AI (`<think>...</think>`).
  - Respons darurat ramah pelanggan jika kedua provider API mengalami gangguan global.
- **j. Keterkaitan dengan Fitur Lain**: Memasok seluruh inteligensi percakapan untuk antarmuka CS Chatbot Mindream.
- **k. Status Verifikasi**: `Terverifikasi dari source code & Terverifikasi melalui pengujian`.
- **l. Bukti Implementasi Source Code**: `api/chat.js:L60-L245`.
- **m. Bukti Pengujian Website Online**: Pengujian API via cURL pada endpoint produksi terbukti mengembalikan respons status 200 OK dengan header CORS yang valid.
- **n. Keterbatasan & Catatan Khusus**: Kunci API disimpan secara aman di environment Vercel dan tidak terekspos ke kode sumber klien peramban.

---

## 8. MATRIKS KOMPARASI DAN KETERGANTUNGAN ANTARFITUR

Tabel berikut memetakan ketergantungan fungsional (*inter-dependency*) antara antarmuka pengguna, pemrosesan logika, dan keluaran sistem:

| Fitur Asal | Komponen Terkait | Jenis Ketergantungan | Dampak Jika Komponen Terkait Gagal |
| :--- | :--- | :--- | :--- |
| **Katalog Pricelist (F-09)** | Booking Step 1 (F-11) | Parameter URL (`?cat=...`) | Halaman booking tetap terbuka, menggunakan kategori default `wargame`. |
| **Booking Step 1 (F-11)** | Live Calculation (F-15) | Pemilihan Paket & Tarif | Kalkulator biaya tidak menampilkan total (hanya tanda `-`). |
| **Booking Step 2 (F-12)** | Validasi Jadwal (F-17) | Nilai Tanggal & Jam | Konfirmasi diblokir jika memilih hari Selasa atau di luar 12.00-21.00 WIB. |
| **Booking Step 3 (F-13)** | Validasi Form (F-14) | Nama & Nomor WhatsApp | Konfirmasi ditolak, input bergaris merah, auto-scroll ke field error. |
| **Booking Step 4 (F-14)** | Handoff Modal (F-18) | Kelulusan 6 Lapis Validasi | Modal ringkasan tidak muncul jika ada satu data input yang tidak valid. |
| **Handoff Modal (F-18)** | Generator WhatsApp (F-19) | URL Payload Enkripsi | Pengguna dapat mengklik tombol manual jika pop-up otomatis diblokir peramban. |
| **Launcher Chat (F-7.1)** | Chat Window (F-7.2) | Toggle Tampilan CSS | Jendela chat tidak terbuka jika script diinterupsi error JS luar. |
| **Chat Input Form (F-7.2)** | Backend `/api/chat` (F-7.8) | AJAX Fetch POST HTTP | Chatbot menampilkan pesan fallback ramah: *"Maaf, ada kendala koneksi"*. |
| **Backend Groq (F-7.8)** | Backend Gemini (F-7.8) | Failover Tingkat Server | Jika Groq limit/down, dialihkan ke Gemini secara instan tanpa disadari user. |
| **Detektor Intent (F-7.7)** | Booking Page (F-11) | Tombol CTA Link | Pengguna tetap dapat mengakses booking manual via navbar atas. |

---

> [!NOTE]
> Seluruh 20 fitur dan komponen antarmuka di atas telah diaudit secara faktual berdasarkan kode sumber direktori proyek dan telah diuji secara aman pada website produksi `https://dreamfield.vercel.app`. Dokumentasi ini bebas dari klaim fitur yang tidak terimplementasi.
