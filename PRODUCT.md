# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Pemain umum dan komunitas airsoft—mulai dari pemula yang ingin mencoba pengalaman rekreasi menembak taktis CQB untuk pertama kali, hingga tim atau grup pertemanan yang ingin melakukan latihan atau reservasi jadwal main rutin.

## Product Purpose
Menyediakan pusat informasi fasilitas arena CQB Dreamfield Tactical, transparansi daftar harga seluruh paket aktivitas (Shooting Target, War Game, Coaching, Unit Rental, dan Gear), serta alur reservasi jadwal main yang instan, mudah, dan langsung terhubung ke WhatsApp pengelola.

## Positioning
Tempat hiburan dan rekreasi olahraga menembak taktis CQB indoor yang aman, ramah pemula, seru, dan terjangkau, didukung oleh arena pertempuran modern dan variasi paket yang fleksibel untuk segala level pemain.

## Operating Context
- Pengunjung mengakses website melalui perangkat mobile (smartphone) maupun desktop.
- Calon pemain mengevaluasi fasilitas arena melalui galeri foto, meninjau rincian biaya, lalu menentukan tanggal dan jam sesi bermain.
- Seluruh transaksi dan konfirmasi jadwal diselesaikan secara langsung melalui komunikasi chat WhatsApp dengan tim admin.

## Capabilities and Constraints
- **Landing Page (`index.html`)**: Memuat navigasi terpadu, hero banner, highlight keunggulan arena, slider galeri foto arena interaktif dengan kontrol HUD digital dan thumbnail, navigasi kategori harga terpisah (Shooting Target, War Game, Coaching, Unit Coaching, Gear), serta informasi lokasi dan kontak.
- **Booking Page (`booking.html`)**: Alur pemesanan 3 langkah dalam satu halaman (Pilih Kategori/Paket, Tentukan Tanggal/Jam/Personel, dan Ringkasan Live dengan pengiriman pesan terformat ke WhatsApp).
- **Teknologi**: Plain Static HTML5, Modern CSS3 (CSS Variables, Flexbox, Grid), dan Vanilla JavaScript yang cepat dan responsif tanpa dependensi server atau framework berat.

## Brand Commitments
- **Nama Brand**: DREAMFIELD TACTICAL (Airsoft Sports & CQB Tactical Arena).
- **Karakter Visual**: Modern sporty, clean, energik, ramah pemula, dan seru tanpa kesan kaku atau terlalu serius.
- **Tipografi Resmi**:
  - **Headings / Brand / Buttons**: **`Outfit`** (Weights: 600, 700, 800, 900) — Geometris, dinamis, sporty, dan modern.
  - **Body / Subtitles / Inputs**: **`Plus Jakarta Sans`** (Weights: 400, 500, 600, 700) — Sangat rapi, nyaman dibaca, dan bersih.
- **Palet Warna Taktikal Resmi**:
  - **LIME (`#B7FF00`)**: Aksen menyala, tombol CTA utama, status aktif, highlight harga.
  - **CHARCOAL (`#1A1A1A` / `#121212` / `#22251E`)**: Background permukaan gelap taktikal.
  - **SAGE (`#DDE5D1`)**: Tipografi judul utama dan elemen badge.
  - **MOSS (`#8A9A5B`)**: Teks keterangan sekunder dan label pendukung.
  - **OLIVE**: Dihapus atas permintaan user. Border dan pemisah menggunakan wireframe netral / translucent Sage (`rgba(221, 229, 209, 0.15)`).

## Evidence on Hand
- Kode frontend fungsional di `index.html` dan `booking.html`.
- Daftar harga resmi terstruktur (Shooting Target mulai 50K-75K, War Game 35K-225K, Coaching 35K-150K, Unit 100K-125K, Gear 30K).
- Gambar palet warna terkonfirmasi: `Color Palettes _ Цвета для дизайна.jpg`.

## Product Principles
1. **Frictionless Booking**: Memilih paket hingga mengirim konfirmasi WhatsApp harus cepat, jelas, dan tanpa hambatan teknis.
2. **Beginner-Friendly Clarity**: Penjelasan paket dan sewa perlengkapan disajikan secara transparan agar pemain pemula merasa nyaman dan percaya diri untuk mencoba.
3. **Immersive Tactical Atmosphere**: Menghadirkan atmosfer arena CQB yang autentik melalui detail HUD, kontur border, dan aksen warna taktikal yang presisi.

## Accessibility & Inclusion
- Desain sepenuhnya responsif untuk smartphone, tablet, dan desktop.
- Kontras teks dan tombol dijaga tajam agar mudah dibaca di berbagai pencahayaan layar.
- Elemen interaktif (tombol, slot jam, counter) dirancang dengan touch target yang ramah pengguna mobile.
