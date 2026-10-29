-- ==============================================================================
-- DREAMFIELD TACTICAL SURABAYA — SUPABASE INITIAL CMS SCHEMA & SEED DATA
-- Version: 1.0.0
-- Created: 2026-10-29
-- Description:
--   1. Extensions & Helper Function (is_admin SECURITY DEFINER)
--   2. Tables: admin_users, site_packages, site_content, site_media, site_faqs
--   3. Row Level Security (RLS) Policies (Non-recursive)
--   4. Storage Bucket Setup (dreamfield-assets) & Storage RLS
--   5. Verified Initial Seed Data (16 Packages, Editorial Content, Media, FAQs)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & SECURITY DEFINER FUNCTION
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: admin_users (Daftar akun yang berhak mengakses dashboard Admin CMS)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Function: public.is_admin()
-- SECURITY DEFINER dengan search_path tetap untuk mencegah rekursi RLS dan privilege escalation.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE id = auth.uid()
      AND is_active = true
  );
$$;

-- Trigger: Otomatis daftarkan akun baru dari auth.users ke public.admin_users
CREATE OR REPLACE FUNCTION public.handle_new_admin_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, full_name, role, is_active)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'Admin Dreamfield'), 'superadmin', true)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_signup();

-- ------------------------------------------------------------------------------
-- 2. CONTENT TABLES DEFINITION
-- ------------------------------------------------------------------------------

-- Table: site_packages (Single Source of Truth untuk 16 Paket & Harga Dreamfield)
CREATE TABLE IF NOT EXISTS public.site_packages (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('wargame', 'target', 'coaching', 'unit', 'gear')),
    platform TEXT NOT NULL,
    name TEXT NOT NULL,
    badge TEXT,
    price_amount INTEGER NOT NULL CHECK (price_amount >= 0),
    price_unit TEXT NOT NULL,
    duration_minutes INTEGER,
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER,
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: site_content (Teks editorial: Hero, About, Kontak, Jam Operasional, WA)
CREATE TABLE IF NOT EXISTS public.site_content (
    section_key TEXT NOT NULL,
    content_key TEXT NOT NULL,
    content_value TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'json', 'number', 'boolean')),
    label TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (section_key, content_key)
);

-- Table: site_media (Asset gambar slider galeri, arena preview, logo branding)
CREATE TABLE IF NOT EXISTS public.site_media (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('hero', 'gallery', 'arena', 'branding', 'other')),
    title TEXT,
    alt_text TEXT,
    media_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: site_faqs (FAQ untuk website publik & konteks dinamis Chatbot Mindream)
CREATE TABLE IF NOT EXISTS public.site_faqs (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'general',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- 3.1 RLS admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (public.is_admin() OR id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3.2 RLS site_packages
ALTER TABLE public.site_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active packages" ON public.site_packages;
CREATE POLICY "Public can view active packages"
    ON public.site_packages
    FOR SELECT
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert packages" ON public.site_packages;
CREATE POLICY "Admins can insert packages"
    ON public.site_packages
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update packages" ON public.site_packages;
CREATE POLICY "Admins can update packages"
    ON public.site_packages
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete packages" ON public.site_packages;
CREATE POLICY "Admins can delete packages"
    ON public.site_packages
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 3.3 RLS site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content"
    ON public.site_content
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert site content" ON public.site_content;
CREATE POLICY "Admins can insert site content"
    ON public.site_content
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update site content" ON public.site_content;
CREATE POLICY "Admins can update site content"
    ON public.site_content
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete site content" ON public.site_content;
CREATE POLICY "Admins can delete site content"
    ON public.site_content
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 3.4 RLS site_media
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active media" ON public.site_media;
CREATE POLICY "Public can view active media"
    ON public.site_media
    FOR SELECT
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert media" ON public.site_media;
CREATE POLICY "Admins can insert media"
    ON public.site_media
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update media" ON public.site_media;
CREATE POLICY "Admins can update media"
    ON public.site_media
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete media" ON public.site_media;
CREATE POLICY "Admins can delete media"
    ON public.site_media
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 3.5 RLS site_faqs
ALTER TABLE public.site_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active faqs" ON public.site_faqs;
CREATE POLICY "Public can view active faqs"
    ON public.site_faqs
    FOR SELECT
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert faqs" ON public.site_faqs;
CREATE POLICY "Admins can insert faqs"
    ON public.site_faqs
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update faqs" ON public.site_faqs;
CREATE POLICY "Admins can update faqs"
    ON public.site_faqs
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete faqs" ON public.site_faqs;
CREATE POLICY "Admins can delete faqs"
    ON public.site_faqs
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. STORAGE BUCKET & STORAGE POLICIES
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'dreamfield-assets',
    'dreamfield-assets',
    true,
    5242880, -- Batas maksimal 5 MB per file
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

DROP POLICY IF EXISTS "Public can view dreamfield-assets" ON storage.objects;
CREATE POLICY "Public can view dreamfield-assets"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'dreamfield-assets');

DROP POLICY IF EXISTS "Admins can upload to dreamfield-assets" ON storage.objects;
CREATE POLICY "Admins can upload to dreamfield-assets"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'dreamfield-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update dreamfield-assets" ON storage.objects;
CREATE POLICY "Admins can update dreamfield-assets"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'dreamfield-assets' AND public.is_admin())
    WITH CHECK (bucket_id = 'dreamfield-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete dreamfield-assets" ON storage.objects;
CREATE POLICY "Admins can delete dreamfield-assets"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'dreamfield-assets' AND public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. INITIAL SEED DATA (VERIFIED FROM CODEBASE)
-- ------------------------------------------------------------------------------

-- 5.1 SEED: 16 Paket Lengkap Dreamfield (Sesuai booking.html & pricelist.html)
INSERT INTO public.site_packages (id, category, platform, name, badge, price_amount, price_unit, duration_minutes, min_participants, description, features, sort_order, is_active)
VALUES
-- Kategori: WAR GAME CQB (8 Paket)
(
    'wg-lapangan-1h',
    'wargame',
    'Unit Bawa Sendiri',
    'Sewa Lapangan (1 Jam)',
    NULL,
    35000,
    '/ Orang / Jam',
    60,
    1,
    'Akses arena pertempuran CQB 1 jam penuh. Cocok untuk skirmisher yang memiliki unit & gear sendiri.',
    '["Akses arena CQB 1.200m² bertingkat selama 60 menit", "Chrono test unit pribadi sebelum masuk arena (Max 350 FPS)", "Briefing safety & pengawasan penuh Game Marshal", "Safe-zone ber-AC, free flow air mineral & area re-gas"]'::jsonb,
    1,
    true
),
(
    'wg-lapangan-2h',
    'wargame',
    'Unit Bawa Sendiri',
    'Sewa Lapangan (2 Jam)',
    NULL,
    50000,
    '/ Orang / 2 Jam',
    120,
    1,
    'Akses arena CQB 2 jam penuh dengan rotasi skenario pertempuran dan waktu taktis lebih panjang.',
    '["Akses arena CQB 2 jam penuh tanpa jeda terburu-buru", "Rotasi skenario: Team Deathmatch & Hostage Rescue", "Didampingi Marshal & chrono test unit", "Akses safe-zone ber-AC, charger unit & air mineral"]'::jsonb,
    2,
    true
),
(
    'wg-wgg-1h',
    'wargame',
    'Rental Water Gel Gun',
    'Lapangan + WGG (1 Jam)',
    NULL,
    100000,
    '/ Orang / Jam',
    60,
    1,
    'Sensasi kontak senjata aman minim sakit dengan Water Gel Gun elektrik. Sangat ramah pemula.',
    '["Akses arena CQB 1 jam dengan skenario terarah", "Rental 1 Unit Water Gel Gun elektrik otomatis", "Amunisi Water Gel tak terbatas / refill berkala", "Masker pelindung wajah penuh (Full Face Mask)", "Didampingi wasit & pemandu gameplay tim"]'::jsonb,
    3,
    true
),
(
    'wg-wgg-2h',
    'wargame',
    'Rental Water Gel Gun',
    'Lapangan + WGG (2 Jam)',
    NULL,
    150000,
    '/ Orang / 2 Jam',
    120,
    1,
    'Sesi WGG 2 jam penuh dengan turnamen mini antar tim dan skenario pertempuran seru.',
    '["Akses arena CQB 2 jam penuh", "Unit WGG elektrik otomatis + baterai cadangan", "Refill amunisi water gel selama durasi sesi", "Full face protective mask & safety briefing", "Variasi mode: VIP Escort & Capture the Flag"]'::jsonb,
    4,
    true
),
(
    'wg-aeg-1h',
    'wargame',
    'Airsoft AEG M4 CQB',
    'Lapangan + AEG (1 Jam)',
    'TERPOPULER',
    150000,
    '/ Orang / Jam',
    60,
    1,
    'Pengalaman airsoft sejati dengan senapan serbu elektrik M4 CQB, rompi taktis, & goggle anti-fog.',
    '["Akses arena CQB 1 jam penuh dengan skenario Search & Destroy", "Rental Unit Airsoft AEG M4 CQB High-Performance", "1 Magazine penuh (±300 butir BB competition grade)", "Tactical Vest pelindung dada & Tactical Goggle anti-fog", "Briefing taktis dasar & pengawasan penuh wasit"]'::jsonb,
    5,
    true
),
(
    'wg-aeg-2h',
    'wargame',
    'Airsoft AEG M4 CQB',
    'Lapangan + AEG (2 Jam)',
    'BEST VALUE',
    225000,
    '/ Orang / 2 Jam',
    120,
    1,
    'Puas bertempur 2 jam penuh! Ekstra amunisi dan perlengkapan proteksi komplit tanpa terburu-buru.',
    '["Akses arena CQB 2 jam penuh leluasa", "Rental Unit Airsoft AEG M4 CQB elektrik", "Amunisi ekstra: 2 Magazine BB (total ±600 butir BB)", "Rompi taktis molly, goggle anti-fog & helm ops-core", "Free flow air minum & handuk steril"]'::jsonb,
    6,
    true
),
(
    'wg-gbb-1h',
    'wargame',
    'Gas Blowback Pistol',
    'Lapangan + GBB (1 Jam)',
    NULL,
    125000,
    '/ Orang / Jam',
    60,
    1,
    'Simulasi tempur jarak dekat dengan pistol Gas Blowback yang memiliki hentakan recoil nyata.',
    '["Akses arena CQB 1 jam", "Rental Unit GBB Pistol (Glock / Hi-Capa platform)", "2 Magazine penuh + Green Gas refill", "Kacamata tactical goggle & masker pelindung", "Latihan quick draw & transition shooting"]'::jsonb,
    7,
    true
),
(
    'wg-gbb-2h',
    'wargame',
    'Gas Blowback Pistol',
    'Lapangan + GBB (2 Jam)',
    NULL,
    200000,
    '/ Orang / 2 Jam',
    120,
    1,
    '2 jam pertempuran pistol taktis CQB dengan sensasi recoil realistis dan mobilitas tinggi.',
    '["Akses arena CQB 2 jam penuh", "Rental Unit GBB Pistol + Holster Taktis", "Refill Green Gas & Amunisi BB selama 2 jam", "Tactical Belt, Goggle, & Gloves", "Skenario John Wick style handgun combat"]'::jsonb,
    8,
    true
),

-- Kategori: SHOOTING TARGET (3 Paket)
(
    'st-gbb',
    'target',
    'Gas Blowback Handgun',
    'GBB / Handgun',
    NULL,
    50000,
    '/ Sesi Latihan',
    30,
    1,
    'Latihan tembak sasaran plat baja reaktif dengan pistol gas berhentakan recoil nyata.',
    '["1 Sesi tembak sasaran plat baja & target siluet", "1 Magazine penuh peluru BB & gas bertekanan", "Kacamata safety goggle anti-fog & earmuff pelindung", "Panduan stance dasar & alignment bidikan oleh staf"]'::jsonb,
    9,
    true
),
(
    'st-sniper',
    'target',
    'Bolt-Action Precision',
    'Sniper Spring',
    NULL,
    50000,
    '/ Sesi Latihan',
    30,
    1,
    'Latihan tembak sasaran presisi akurasi jarak jauh dengan teleskop pembesar di lane 20-25 meter.',
    '["Unit Senapan Sniper Spring dengan Telescopic Scope", "15 butir BB presisi kompetisi (berat 0.28g)", "Lane jarak jauh 20-25 meter & bipod stand stabil", "Target kertas skor personal untuk dibawa pulang"]'::jsonb,
    10,
    true
),
(
    'st-aeg',
    'target',
    'Electric Assault Rifle',
    'AEG / Rifle',
    'FAVORIT',
    75000,
    '/ Sesi Latihan',
    30,
    1,
    'Latihan tembak sasaran senapan serbu otomatis elektrik berdaya tembak tinggi.',
    '["Unit Assault Rifle AEG (Automatic Electric Gun)", "1 Magazine kapasitas tinggi (±150 butir BB)", "Mode tembak Semi-Auto & Full-Auto fleksibel", "Proteksi mata & arahan teknik trigger reset"]'::jsonb,
    11,
    true
),

-- Kategori: TACTICAL COACHING (2 Paket)
(
    'ch-htm',
    'coaching',
    'Kelas Teori & Drill Dasar',
    'HTM Coaching CQB',
    NULL,
    35000,
    '/ Orang / 1,5 Jam',
    90,
    1,
    'Tiket masuk sesi pelatihan dasar CQB. Mempelajari aturan baku pertempuran, etika, dan safety handling.',
    '["Materi etika airsoft, aturan hit, dan kedisiplinan trigger safety", "Pengenalan dasar formasi pergerakan regu CQB (stacking & breach)", "Simulasi pergerakan taktis tanpa peluru (dry fire drill)", "Konsultasi tanya jawab seputar unit dan perlengkapan airsoft"]'::jsonb,
    12,
    true
),
(
    'ch-private',
    'coaching',
    '1-on-1 Bersama Instruktur',
    'Private Coaching',
    'VIP DRILL',
    150000,
    '/ Orang / 1,5 Jam',
    90,
    1,
    'Bimbingan intensif 1-on-1 dengan instruktur untuk mempertajam teknik menembak, pergerakan, dan evaluasi.',
    '["Instruktur pribadi mendedikasikan 100% perhatian selama 1,5 jam", "Drill transisi senjata, shooting on the move, dan cornering pie", "Analisis koreksi postur tubuh, pernapasan, dan recoil control", "Skenario pertempuran terarah dengan instruktur sebagai sparing partner"]'::jsonb,
    13,
    true
),

-- Kategori: UNIT COACHING & DRILL (2 Paket)
(
    'uc-gbb',
    'unit',
    'Gas Blowback System',
    'Unit Drill: GBB',
    NULL,
    100000,
    '/ 2 Mag',
    30,
    1,
    'Latihan operasional, firing cadence, dan reload unit Gas Blowback dengan recoil realistis.',
    '["2 Magazine penuh diisi Green Gas & BB kompetisi", "Drill Slide Lock, Reload, & Target Re-engagement", "Pelatihan manajemen gas agar FPS tetap konsisten", "Evaluasi akurasi & grouping tembakan"]'::jsonb,
    14,
    true
),
(
    'uc-aeg',
    'unit',
    'Electric Assault Rifle',
    'Unit Drill: AEG',
    NULL,
    125000,
    '/ 1 Mag',
    30,
    1,
    'Latihan trigger control, stance pertempuran cepat, dan grouping tight-shot senapan serbu AEG.',
    '["1 High-Cap Magazine penuh (±300 butir BB)", "Drill Double-Tap, Controlled Pairs & Off-Shoulder Firing", "Simulasi pergantian magazine dalam tekanan waktu (Speed Reload)", "Chrono tuning & penjelasan hop-up adjustment"]'::jsonb,
    15,
    true
),

-- Kategori: TACTICAL GEAR RENTAL (1 Paket)
(
    'gr-set',
    'gear',
    'Full Protective Armor',
    'Tactical Gear Set Lengkap',
    'STERIL & BERSIH',
    30000,
    '/ Set / Sesi',
    NULL,
    1,
    'Pelindung tubuh lengkap: Tactical Plate Carrier/Vest, Helm/Goggle anti-pecah, & Tactical Gloves anti-selip.',
    '["Tactical Plate Carrier Vest (Molle system pelindung dada & punggung)", "Fast Helmet atau Kacamata Tactical Goggle impact-rated", "Full-finger / Half-finger Tactical Gloves cengkeraman kokoh", "Pelindung Siku & Lutut (Elbow & Knee Protective Pads)", "Seluruh perlengkapan dicuci bersih dan disanitasi steril setiap sesi"]'::jsonb,
    16,
    true
)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    platform = EXCLUDED.platform,
    name = EXCLUDED.name,
    badge = EXCLUDED.badge,
    price_amount = EXCLUDED.price_amount,
    price_unit = EXCLUDED.price_unit,
    duration_minutes = EXCLUDED.duration_minutes,
    min_participants = EXCLUDED.min_participants,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- 5.2 SEED: Teks Editorial & Informasi Website (Sesuai index.html & booking.html)
INSERT INTO public.site_content (section_key, content_key, content_value, content_type, label)
VALUES
-- Hero Section
('hero', 'badge', 'Premium Tactical Experience', 'text', 'Hero Badge'),
('hero', 'title_line_1', 'DOMINATE THE FIELD', 'text', 'Hero Judul Baris 1'),
('hero', 'title_line_2', 'MASTER THE GAME', 'text', 'Hero Judul Baris 2'),
('hero', 'description', 'Arena bermain airsoft & tactical CQB indoor paling seru di Surabaya! Tempat seru-seruan bareng teman dan keluarga, ber-AC nyaman, peralatan lengkap, aman, dan ramah pemula.', 'text', 'Hero Deskripsi'),

-- Kontak, Alamat & Hotline WhatsApp Resmi
('contact', 'wa_number', '082233139118', 'text', 'Nomor WhatsApp Admin (Format 08...)'),
('contact', 'wa_number_intl', '6282233139118', 'text', 'Nomor WhatsApp Admin (Format Internasional 62...)'),
('contact', 'wa_display', '0822-3313-9118 (CS Admin Dreamfield Tactical)', 'text', 'Tampilan Teks Nomor WhatsApp'),
('contact', 'location_name', 'The Central Mall Gunawangsa Tidar, Lantai Indoor, Jl. Tidar No.350, Surabaya', 'text', 'Alamat Lengkap Dreamfield'),
('contact', 'maps_url', 'https://maps.app.goo.gl/HCUdE9qEE5wadkRj7?g_st=ic', 'text', 'Link Google Maps'),
('contact', 'operational_hours', 'Senin, Rabu - Minggu: 12.00 - 21.00 WIB', 'text', 'Jam Operasional Buka'),
('contact', 'closed_days', 'Selasa: LIBUR (Maintenance Rutin)', 'text', 'Hari Libur / Tutup'),

-- Media Sosial Resmi
('social', 'instagram_url', 'https://www.instagram.com/dreamfieldtacticalsurabaya?stkn=MWI1NnJ3dWYxN3Rvdw==', 'text', 'Link Instagram'),
('social', 'tiktok_url', 'https://www.tiktok.com/@dreamfieldtactical?_r=1&_t=ZS-99XNAs3k4X6', 'text', 'Link TikTok'),

-- Call to Action Card
('cta', 'heading', 'SIAP DOMINASI MEDAN PERTEMPURAN?', 'text', 'Judul Banner CTA'),
('cta', 'description', 'Pilih paket taktis Anda dan lakukan reservasi jadwal langsung melalui halaman booking online kami dengan konfirmasi instan via WhatsApp.', 'text', 'Deskripsi Banner CTA')
ON CONFLICT (section_key, content_key) DO UPDATE SET
    content_value = EXCLUDED.content_value,
    content_type = EXCLUDED.content_type,
    label = EXCLUDED.label,
    updated_at = now();

-- 5.3 SEED: FAQ (Frequently Asked Questions & Mindream Knowledge Base)
INSERT INTO public.site_faqs (id, category, question, answer, sort_order, is_active)
VALUES
(
    'faq-lokasi',
    'location',
    'Di mana lokasi Dreamfield Tactical Surabaya?',
    'The Central Mall Gunawangsa Tidar, Lantai Indoor, Jl. Tidar No.350, Surabaya (dekat Tunjungan Plaza, ±2,8 km). Arena ber-AC dingin dan bebas hujan.',
    1,
    true
),
(
    'faq-jam-buka',
    'schedule',
    'Kapan jam operasional Dreamfield Tactical?',
    'Buka pukul 12.00 – 21.00 WIB setiap hari Senin, Rabu, Kamis, Jumat, Sabtu, dan Minggu. Hari Selasa TUTUP/LIBUR untuk perawatan rutin arena dan unit.',
    2,
    true
),
(
    'faq-pemula',
    'rules',
    'Apakah aman untuk pemula yang belum pernah main airsoft?',
    'Sangat aman! Setiap sesi didampingi Game Marshal bersertifikat dari safety briefing hingga selesai. Perlengkapan proteksi wajah, vest, dan goggle standar militer disediakan lengkap.',
    3,
    true
),
(
    'faq-pakaian',
    'rules',
    'Pakaian apa yang disarankan saat bermain?',
    'Disarankan mengenakan celana panjang, baju lengan panjang / kaos nyaman, serta sepatu kets/sneakers beralas karet agar lincah dan tidak licin di arena.',
    4,
    true
),
(
    'faq-booking',
    'booking',
    'Bagaimana cara booking jadwal sesi bermain?',
    'Pilih paket dan arena di halaman booking online kami (booking.html), tentukan tanggal & jam kedatangan, lalu kirim konfirmasi instan ke WhatsApp Admin 0822-3313-9118.',
    5,
    true
),
(
    'faq-unit-sendiri',
    'rules',
    'Bolehkah membawa unit airsoft milik pribadi?',
    'Boleh! Tersedia paket Sewa Lapangan mulai Rp35.000/jam. Unit pribadi wajib melalui uji Chrono Test (maksimal 350 FPS untuk CQB) sebelum diizinkan masuk arena.',
    6,
    true
)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    question = EXCLUDED.question,
    answer = EXCLUDED.answer,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- 5.4 SEED: Media Gallery & Asset Links
INSERT INTO public.site_media (id, category, title, alt_text, media_url, sort_order, is_active)
VALUES
('gallery-1', 'gallery', 'Squad Team CQB', 'Tim pemain airsoft bersiap di arena CQB Dreamfield', 'assets/img/squad-team-cqb.jpg', 1, true),
('gallery-2', 'gallery', 'Tactical Stage Photobooth', 'Pemain berpose dengan perlengkapan taktis di photobooth', 'assets/img/tactical-stage-photobooth.jpg', 2, true),
('gallery-3', 'gallery', 'Community Squad Lineup', 'Foto bersama komunitas airsoft Dreamfield Surabaya', 'assets/img/community-squad-lineup.jpg', 3, true),
('gallery-4', 'gallery', 'Shooter Aiming Drill', 'Latihan bidik akurasi senapan taktis di target lane', 'assets/img/shooter-aiming-drill.jpg', 4, true),
('gallery-5', 'gallery', 'Junior Shooting Lane', 'Anak dan pemula mencoba latihan menembak aman dengan instruktur', 'assets/img/junior-shooting-lane.jpg', 5, true),
('arena-wargame', 'arena', 'Arena War Game CQB', 'Medan tempur CQB 1.200m² bertingkat', 'assets/img/arena-wargame.jpg', 6, true),
('arena-target', 'arena', 'Arena Shooting Target', 'Lane tembak sasaran pelat baja presisi', 'assets/img/arena-shooting-target.jpg', 7, true),
('arena-coaching', 'arena', 'Tactical Coaching', 'Kelas coaching taktis bersama instruktur berpengalaman', 'assets/img/arena-coaching.jpg', 8, true),
('arena-unit', 'arena', 'Unit Drill Armory', 'Latihan unit drill GBB dan AEG', 'assets/img/arena-unit-drill.jpg', 9, true),
('branding-logo', 'branding', 'Logo Dreamfield Tactical', 'Logo resmi Dreamfield Tactical Surabaya', 'assets/img/dreamfield-logo-orig.jpg', 10, true),
('bot-avatar', 'branding', 'Mindream Avatar', 'Avatar Customer Service Mindream', 'assets/img/mindream-avatar.jpg', 11, true)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    title = EXCLUDED.title,
    alt_text = EXCLUDED.alt_text,
    media_url = EXCLUDED.media_url,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- ==============================================================================
-- SELESAI. Semua tabel, RLS, Storage Bucket, dan Seed Data telah dikonfigurasi.
-- ==============================================================================
