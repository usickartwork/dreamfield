/**
 * DREAMFIELD TACTICAL — ADMIN CMS JAVASCRIPT
 * Complete CRUD, Supabase Auth session handling, Storage uploads, and live UI synchronization.
 */

(function () {
    const SUPABASE_URL = 'https://rskxeeahhyzqoxofdfms.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJza3hlZWFoaHl6cW94b2ZkZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNTc4NzMsImV4cCI6MjEwODgzMzg3M30.u9gh-CPu_HRbDj3u4sgF9XGHSHXSArPb0IEPIvE1LjE';

    let client = null;
    let currentUser = null;
    let currentAdminProfile = null;

    // Cache state
    let packagesCache = [];
    let currentCategoryFilter = 'all';

    // --------------------------------------------------------------------------
    // 1. INITIALIZATION & AUTH
    // --------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.supabase) {
            console.error('Supabase client library not loaded');
            showToast('Library Supabase gagal dimuat dari CDN.', 'error');
            return;
        }

        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true
            }
        });

        setupEventListeners();
        await checkAuth();
    });

    async function checkAuth() {
        try {
            const { data: { session }, error } = await client.auth.getSession();
            if (error || !session) {
                showLoginView();
                return;
            }

            currentUser = session.user;

            // Verify admin rights in public.admin_users
            const { data: adminData, error: adminErr } = await client
                .from('admin_users')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (adminErr || !adminData || !adminData.is_active) {
                showLoginError('Akun ini belum memiliki otorisasi Admin di tabel admin_users.');
                await client.auth.signOut();
                showLoginView();
                return;
            }

            currentAdminProfile = adminData;
            showDashboardView();
            loadAllData();
        } catch (err) {
            console.error('Check auth error:', err);
            showLoginView();
        }
    }

    function showLoginView() {
        document.getElementById('loginWrapper').style.display = 'flex';
        document.getElementById('dashboardApp').classList.remove('active');
    }

    function showDashboardView() {
        document.getElementById('loginWrapper').style.display = 'none';
        document.getElementById('dashboardApp').classList.add('active');

        // Populate header HUD
        document.getElementById('adminEmailDisplay').textContent = currentUser.email;
        document.getElementById('adminRoleTag').textContent = currentAdminProfile.role || 'ADMIN';
        document.getElementById('adminAvatarInitial').textContent = (currentUser.email || 'A')[0].toUpperCase();
    }

    function showLoginError(msg) {
        const alertBox = document.getElementById('loginAlert');
        alertBox.textContent = msg;
        alertBox.classList.add('show');
    }

    function hideLoginError() {
        const alertBox = document.getElementById('loginAlert');
        alertBox.classList.remove('show');
    }

    // --------------------------------------------------------------------------
    // 2. EVENT LISTENERS
    // --------------------------------------------------------------------------
    function setupEventListeners() {
        // Login Form Submit
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            hideLoginError();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const btn = document.getElementById('btnLoginSubmit');
            const originalText = btn.innerHTML;

            try {
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memeriksa Autentikasi...';
                btn.disabled = true;

                const { data, error } = await client.auth.signInWithPassword({ email, password });
                if (error) throw error;

                currentUser = data.user;

                // Verify admin
                const { data: adminData, error: adminErr } = await client
                    .from('admin_users')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();

                if (adminErr || !adminData || !adminData.is_active) {
                    throw new Error('Akun Anda belum terdaftar sebagai admin aktif di database.');
                }

                currentAdminProfile = adminData;
                showDashboardView();
                loadAllData();
                showToast(`Selamat datang, ${currentAdminProfile.full_name || currentUser.email}!`, 'success');

            } catch (err) {
                console.error('Login error:', err);
                showLoginError(err.message || 'Login gagal. Periksa kembali email dan password.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

        // Logout
        document.getElementById('btnLogout').addEventListener('click', async () => {
            await client.auth.signOut();
            currentUser = null;
            currentAdminProfile = null;
            showLoginView();
            showToast('Anda telah logout dengan aman.', 'success');
        });

        // Tab Switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                switchTab(targetTab);
            });
        });

        // Category Filter Chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentCategoryFilter = chip.getAttribute('data-category');
                renderPackages();
            });
        });

        // Modal Close
        document.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', () => closeModal());
        });

        // Package Edit Form Submit
        document.getElementById('packageForm').addEventListener('submit', handlePackageSave);

        // Editorial Content Form Submit
        document.getElementById('editorialForm').addEventListener('submit', handleEditorialSave);

        // FAQ Form Submit
        document.getElementById('faqForm').addEventListener('submit', handleFaqSave);

        // Media Upload Form Submit
        document.getElementById('mediaUploadForm').addEventListener('submit', handleMediaUpload);
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${tabId}`);
        });
    }

    // --------------------------------------------------------------------------
    // 3. DATA LOADING
    // --------------------------------------------------------------------------
    async function loadAllData() {
        await Promise.all([
            loadPackages(),
            loadEditorialContent(),
            loadMedia(),
            loadFaqs(),
            loadAdmins()
        ]);
    }

    // --------------------------------------------------------------------------
    // 4. PACKAGES & PRICING
    // --------------------------------------------------------------------------
    async function loadPackages() {
        const grid = document.getElementById('packagesGrid');
        grid.innerHTML = '<div style="color: var(--color-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Memuat daftar paket...</div>';

        try {
            const { data, error } = await client
                .from('site_packages')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            packagesCache = data || [];
            renderPackages();
        } catch (err) {
            console.error('Load packages error:', err);
            grid.innerHTML = `<div style="color: var(--color-danger);"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat paket: ${err.message}</div>`;
        }
    }

    function renderPackages() {
        const grid = document.getElementById('packagesGrid');
        grid.innerHTML = '';

        const filtered = packagesCache.filter(pkg => {
            if (currentCategoryFilter === 'all') return true;
            return pkg.category === currentCategoryFilter;
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 40px 0;">Tidak ada paket ditemukan untuk kategori ini.</div>';
            return;
        }

        filtered.forEach(pkg => {
            const card = document.createElement('div');
            card.className = `package-card ${pkg.is_active ? '' : 'inactive'}`;

            const formattedPrice = Number(pkg.price_amount || 0).toLocaleString('id-ID');
            const featuresList = Array.isArray(pkg.features) ? pkg.features : [];

            card.innerHTML = `
                <div>
                    <div class="card-top">
                        <span class="card-category-badge">${pkg.category.toUpperCase()}</span>
                        ${pkg.badge ? `<span class="card-badge-promo">${pkg.badge}</span>` : ''}
                    </div>
                    <h3 class="package-name">${pkg.name}</h3>
                    <div class="package-platform">
                        <i class="fa-solid fa-shield-halved" style="color: var(--color-lime); font-size: 11px;"></i>
                        ${pkg.platform}
                    </div>
                    <div class="package-price-wrap">
                        <span class="price-val">Rp ${formattedPrice}</span>
                        <span class="price-unit">${pkg.price_unit}</span>
                    </div>
                    <p class="package-desc">${pkg.description || '-'}</p>
                    <div class="package-features-preview">
                        <span class="features-count"><i class="fa-solid fa-list-check"></i> ${featuresList.length} Rincian Fasilitas</span>
                    </div>
                </div>
                <div class="card-actions">
                    <label class="status-toggle">
                        <input type="checkbox" ${pkg.is_active ? 'checked' : ''} onchange="window.togglePackageActive('${pkg.id}', this.checked)">
                        <span>${pkg.is_active ? 'Aktif' : 'Non-Aktif'}</span>
                    </label>
                    <div style="display: flex; gap: 6px;">
                        <button type="button" class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="window.editPackage('${pkg.id}')">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    window.togglePackageActive = async function (id, isActive) {
        try {
            const { error } = await client
                .from('site_packages')
                .update({ is_active: isActive, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            const target = packagesCache.find(p => p.id === id);
            if (target) target.is_active = isActive;

            renderPackages();
            showToast(`Status paket ${id} diperbarui menjadi ${isActive ? 'Aktif' : 'Non-Aktif'}.`, 'success');
        } catch (err) {
            console.error('Toggle package error:', err);
            showToast(`Gagal mengubah status: ${err.message}`, 'error');
            await loadPackages();
        }
    };

    window.openNewPackageModal = function () {
        document.getElementById('packageModalTitle').textContent = 'Tambah Paket Baru';
        document.getElementById('pkgId').value = '';
        document.getElementById('pkgId').disabled = false;
        document.getElementById('pkgCategory').value = 'wargame';
        document.getElementById('pkgName').value = '';
        document.getElementById('pkgPlatform').value = '';
        document.getElementById('pkgPrice').value = '';
        document.getElementById('pkgUnit').value = '/ Orang / Jam';
        document.getElementById('pkgBadge').value = '';
        document.getElementById('pkgDuration').value = '60';
        document.getElementById('pkgDesc').value = '';
        document.getElementById('pkgFeatures').value = '';
        document.getElementById('pkgIsActive').checked = true;

        openModal('packageModal');
    };

    window.editPackage = function (id) {
        const pkg = packagesCache.find(p => p.id === id);
        if (!pkg) return;

        document.getElementById('packageModalTitle').textContent = `Edit Paket: ${pkg.name}`;
        document.getElementById('pkgId').value = pkg.id;
        document.getElementById('pkgId').disabled = true; // Primary key cannot be changed
        document.getElementById('pkgCategory').value = pkg.category;
        document.getElementById('pkgName').value = pkg.name;
        document.getElementById('pkgPlatform').value = pkg.platform;
        document.getElementById('pkgPrice').value = pkg.price_amount;
        document.getElementById('pkgUnit').value = pkg.price_unit;
        document.getElementById('pkgBadge').value = pkg.badge || '';
        document.getElementById('pkgDuration').value = pkg.duration_minutes || '';
        document.getElementById('pkgDesc').value = pkg.description || '';
        
        const featuresText = Array.isArray(pkg.features) ? pkg.features.join('\n') : '';
        document.getElementById('pkgFeatures').value = featuresText;
        document.getElementById('pkgIsActive').checked = pkg.is_active;

        openModal('packageModal');
    };

    async function handlePackageSave(e) {
        e.preventDefault();
        const id = document.getElementById('pkgId').value.trim();
        if (!id) {
            showToast('ID Paket wajib diisi.', 'error');
            return;
        }

        const featuresArray = document.getElementById('pkgFeatures').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const payload = {
            id: id,
            category: document.getElementById('pkgCategory').value,
            name: document.getElementById('pkgName').value.trim(),
            platform: document.getElementById('pkgPlatform').value.trim(),
            price_amount: parseInt(document.getElementById('pkgPrice').value, 10) || 0,
            price_unit: document.getElementById('pkgUnit').value.trim(),
            badge: document.getElementById('pkgBadge').value.trim() || null,
            duration_minutes: parseInt(document.getElementById('pkgDuration').value, 10) || null,
            description: document.getElementById('pkgDesc').value.trim(),
            features: featuresArray,
            is_active: document.getElementById('pkgIsActive').checked,
            updated_at: new Date().toISOString()
        };

        const btn = document.getElementById('btnSavePackage');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

        try {
            const { error } = await client
                .from('site_packages')
                .upsert(payload);

            if (error) throw error;

            closeModal();
            showToast(`Paket "${payload.name}" berhasil disimpan!`, 'success');
            await loadPackages();
        } catch (err) {
            console.error('Save package error:', err);
            showToast(`Gagal menyimpan paket: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Paket';
        }
    }

    // --------------------------------------------------------------------------
    // 5. EDITORIAL CONTENT
    // --------------------------------------------------------------------------
    async function loadEditorialContent() {
        try {
            const { data, error } = await client.from('site_content').select('*');
            if (error) throw error;

            if (Array.isArray(data)) {
                data.forEach(item => {
                    const fieldId = `content_${item.section_key}_${item.content_key}`;
                    const el = document.getElementById(fieldId);
                    if (el) el.value = item.content_value;
                });
            }
        } catch (err) {
            console.error('Load editorial error:', err);
            showToast(`Gagal memuat teks website: ${err.message}`, 'error');
        }
    }

    async function handleEditorialSave(e) {
        e.preventDefault();
        const btn = document.getElementById('btnSaveEditorial');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan Perubahan Teks...';

        const inputs = document.querySelectorAll('[data-content-key]');
        const updates = [];

        inputs.forEach(input => {
            const section = input.getAttribute('data-section');
            const key = input.getAttribute('data-content-key');
            const value = input.value;
            updates.push({
                section_key: section,
                content_key: key,
                content_value: value,
                updated_at: new Date().toISOString()
            });
        });

        try {
            const { error } = await client.from('site_content').upsert(updates);
            if (error) throw error;

            showToast('Semua teks dan kontak website berhasil diperbarui!', 'success');
        } catch (err) {
            console.error('Save editorial error:', err);
            showToast(`Gagal menyimpan teks: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan Teks';
        }
    }

    // --------------------------------------------------------------------------
    // 6. MEDIA & STORAGE
    // --------------------------------------------------------------------------
    async function loadMedia() {
        const grid = document.getElementById('mediaGrid');
        grid.innerHTML = '<div style="color: var(--color-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Memuat aset media...</div>';

        try {
            const { data, error } = await client
                .from('site_media')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            grid.innerHTML = '';
            (data || []).forEach(item => {
                const card = document.createElement('div');
                card.className = 'media-card';
                card.innerHTML = `
                    <div class="media-thumb-wrap">
                        <img src="${item.media_url}" alt="${item.alt_text || ''}" class="media-thumb" onerror="this.src='assets/img/dreamfield-logo-orig.jpg'">
                        <span class="media-category-pill">${item.category}</span>
                    </div>
                    <div class="media-info">
                        <div>
                            <h4 class="media-title">${item.title || item.id}</h4>
                            <p class="media-alt">${item.alt_text || 'Tidak ada teks alternatif'}</p>
                            <code style="font-size: 11px; color: var(--color-lime); word-break: break-all;">${item.media_url}</code>
                        </div>
                        <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <label class="status-toggle">
                                <input type="checkbox" ${item.is_active ? 'checked' : ''} onchange="window.toggleMediaActive('${item.id}', this.checked)">
                                <span>${item.is_active ? 'Aktif' : 'Non-Aktif'}</span>
                            </label>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        } catch (err) {
            console.error('Load media error:', err);
            grid.innerHTML = `<div style="color: var(--color-danger);"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat media: ${err.message}</div>`;
        }
    }

    window.toggleMediaActive = async function (id, isActive) {
        try {
            const { error } = await client
                .from('site_media')
                .update({ is_active: isActive, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            showToast(`Status gambar ${id} diperbarui.`, 'success');
        } catch (err) {
            console.error('Toggle media error:', err);
            showToast(`Gagal mengubah status: ${err.message}`, 'error');
            await loadMedia();
        }
    };

    window.openUploadModal = function () {
        document.getElementById('mediaFileInput').value = '';
        document.getElementById('mediaTitleInput').value = '';
        document.getElementById('mediaAltInput').value = '';
        document.getElementById('mediaCategorySelect').value = 'gallery';
        openModal('mediaModal');
    };

    async function handleMediaUpload(e) {
        e.preventDefault();
        const fileInput = document.getElementById('mediaFileInput');
        if (!fileInput.files || fileInput.files.length === 0) {
            showToast('Pilih file gambar terlebih dahulu.', 'error');
            return;
        }

        const file = fileInput.files[0];
        const title = document.getElementById('mediaTitleInput').value.trim() || file.name;
        const alt = document.getElementById('mediaAltInput').value.trim() || title;
        const category = document.getElementById('mediaCategorySelect').value;

        const btn = document.getElementById('btnSubmitUpload');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah ke Storage...';

        try {
            // Generate safe filename
            const ext = file.name.split('.').pop();
            const fileName = `${category}_${Date.now()}.${ext}`;
            const filePath = `uploads/${fileName}`;

            // Upload to Supabase Storage Bucket 'dreamfield-assets'
            const { error: uploadErr } = await client.storage
                .from('dreamfield-assets')
                .upload(filePath, file, { cacheControl: '3600', upsert: true });

            if (uploadErr) throw uploadErr;

            // Get Public URL
            const { data: { publicUrl } } = client.storage
                .from('dreamfield-assets')
                .getPublicUrl(filePath);

            // Record into public.site_media
            const mediaId = `upload-${Date.now()}`;
            const { error: dbErr } = await client
                .from('site_media')
                .insert({
                    id: mediaId,
                    category: category,
                    title: title,
                    alt_text: alt,
                    media_url: publicUrl,
                    is_active: true,
                    sort_order: 99
                });

            if (dbErr) throw dbErr;

            closeModal();
            showToast('Gambar berhasil diunggah dan disimpan ke media!', 'success');
            await loadMedia();
        } catch (err) {
            console.error('Upload error:', err);
            showToast(`Gagal mengunggah: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Unggah Gambar';
        }
    }

    // --------------------------------------------------------------------------
    // 7. FAQS & MINDREAM BOT KNOWLEDGE
    // --------------------------------------------------------------------------
    async function loadFaqs() {
        const list = document.getElementById('faqList');
        list.innerHTML = '<div style="color: var(--color-text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Memuat FAQ...</div>';

        try {
            const { data, error } = await client
                .from('site_faqs')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            list.innerHTML = '';
            (data || []).forEach(faq => {
                const item = document.createElement('div');
                item.className = 'faq-card';
                item.innerHTML = `
                    <div style="flex-grow: 1;">
                        <span class="card-category-badge" style="margin-bottom: 6px; display: inline-block;">${faq.category}</span>
                        <h4 class="faq-q">${faq.question}</h4>
                        <p class="faq-a">${faq.answer}</p>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                        <button type="button" class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="window.editFaq('${faq.id}', \`${escapeHtml(faq.question)}\`, \`${escapeHtml(faq.answer)}\`, '${faq.category}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                    </div>
                `;
                list.appendChild(item);
            });
        } catch (err) {
            console.error('Load FAQs error:', err);
            list.innerHTML = `<div style="color: var(--color-danger);"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat FAQ: ${err.message}</div>`;
        }
    }

    window.openNewFaqModal = function () {
        document.getElementById('faqModalTitle').textContent = 'Tambah FAQ Baru';
        document.getElementById('faqId').value = `faq-${Date.now()}`;
        document.getElementById('faqQuestion').value = '';
        document.getElementById('faqAnswer').value = '';
        document.getElementById('faqCategory').value = 'general';
        openModal('faqModal');
    };

    window.editFaq = function (id, question, answer, category) {
        document.getElementById('faqModalTitle').textContent = 'Edit FAQ';
        document.getElementById('faqId').value = id;
        document.getElementById('faqQuestion').value = question;
        document.getElementById('faqAnswer').value = answer;
        document.getElementById('faqCategory').value = category || 'general';
        openModal('faqModal');
    };

    async function handleFaqSave(e) {
        e.preventDefault();
        const id = document.getElementById('faqId').value.trim();
        const question = document.getElementById('faqQuestion').value.trim();
        const answer = document.getElementById('faqAnswer').value.trim();
        const category = document.getElementById('faqCategory').value;

        const btn = document.getElementById('btnSaveFaq');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

        try {
            const { error } = await client
                .from('site_faqs')
                .upsert({
                    id,
                    question,
                    answer,
                    category,
                    is_active: true,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            closeModal();
            showToast('FAQ berhasil disimpan dan terintegrasi ke Chatbot!', 'success');
            await loadFaqs();
        } catch (err) {
            console.error('Save FAQ error:', err);
            showToast(`Gagal menyimpan FAQ: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan FAQ';
        }
    }

    // --------------------------------------------------------------------------
    // 8. ADMIN MANAGEMENT
    // --------------------------------------------------------------------------
    async function loadAdmins() {
        const tableBody = document.getElementById('adminsTableBody');
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted); padding: 20px;">Memuat data admin...</td></tr>';

        try {
            const { data, error } = await client
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            tableBody.innerHTML = '';
            (data || []).forEach(adm => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--color-card-border)';
                tr.innerHTML = `
                    <td style="padding: 12px 16px; font-weight: 600;">${adm.full_name || '-'}</td>
                    <td style="padding: 12px 16px; font-family: monospace;">${adm.email}</td>
                    <td style="padding: 12px 16px;"><span class="admin-role-tag">${adm.role}</span></td>
                    <td style="padding: 12px 16px;">
                        <span style="color: ${adm.is_active ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 600;">
                            ● ${adm.is_active ? 'Aktif' : 'Non-Aktif'}
                        </span>
                    </td>
                    <td style="padding: 12px 16px; font-size: 12px; color: var(--color-text-muted);">
                        ${new Date(adm.created_at).toLocaleDateString('id-ID')}
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (err) {
            console.error('Load admins error:', err);
            tableBody.innerHTML = `<tr><td colspan="5" style="color: var(--color-danger); padding: 16px;">Gagal memuat admin: ${err.message}</td></tr>`;
        }
    }

    // --------------------------------------------------------------------------
    // 9. HELPERS (MODALS & TOAST)
    // --------------------------------------------------------------------------
    function openModal(modalId) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        const target = document.getElementById(modalId);
        if (target) target.classList.add('active');
    }

    function closeModal() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="color: ${type === 'success' ? 'var(--color-lime)' : 'var(--color-danger)'}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

})();
