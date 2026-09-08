/**
 * DREAMFIELD TACTICAL — CS AI CHATBOT CONTROLLER
 * Integrates interactive widget with /api/chat (Powered by Google Gemini)
 */

(function () {
    'use strict';

    // State
    let isOpen = false;
    let isSending = false;
    let soundEnabled = true;
    let messages = [];
    let waTimerTriggered = false;

    const STORAGE_KEY = 'df_cs_chat_history_v1';
    const SOUND_STORAGE_KEY = 'df_cs_sound_enabled';

    // Tactical Web Audio API SFX (Zero external mp3 dependencies)
    let audioCtx = null;
    function playTacticalSfx(type = 'receive') {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) audioCtx = new AudioContext();
            }
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'send') {
                // Subtle high tactical blip
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'receive') {
                // Double radio beep
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(750, now);
                osc.frequency.setValueAtTime(980, now + 0.06);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            }
        } catch (e) {
            // Audio error silently ignored
        }
    }

    // Markdown simple formatter
    function formatMarkdown(text) {
        if (!text) return '';
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold **text**
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Links [text](url)
        escaped = escaped.replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Plain URLs
        escaped = escaped.replace(/(^|[^"])((https?:\/\/)(wa\.me|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})[^\s<]*)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');

        // Line breaks & bullet lists
        const lines = escaped.split('\n');
        let inList = false;
        let html = '';

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('* ') || line.startsWith('- ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${line.substring(2)}</li>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                if (line) {
                    html += `<p>${line}</p>`;
                }
            }
        }
        if (inList) html += '</ul>';

        return html || `<p>${escaped}</p>`;
    }

    // Create and inject HTML UI into document
    function injectUI() {
        if (document.getElementById('df-cs-container')) return;

        const container = document.createElement('div');
        container.id = 'df-cs-container';
        container.innerHTML = `
            <!-- Floating Launcher -->
            <button class="df-cs-launcher" id="dfCsLauncher" aria-label="Tanya Mindream" title="Tanya Mindream">
                <div class="df-cs-launcher-avatar">
                    <img src="/assets/img/mindream-avatar.jpg?v=2" alt="Mindream" class="df-cs-avatar-img" />
                    <span class="df-cs-pulse-dot"></span>
                </div>
                <div class="df-cs-launcher-text">
                    <span class="df-cs-launcher-title">Tanya Mindream</span>
                    <span class="df-cs-launcher-sub"><i class="fa-solid fa-circle" style="font-size:7px;"></i> Online 24/7</span>
                </div>
            </button>

            <!-- Chat Window -->
            <div class="df-cs-window" id="dfCsWindow" role="dialog" aria-labelledby="dfCsHeaderTitle">
                <!-- Header -->
                <div class="df-cs-header">
                    <div class="df-cs-header-info">
                        <div class="df-cs-header-avatar">
                            <img src="/assets/img/mindream-avatar.jpg?v=2" alt="Mindream" class="df-cs-avatar-img" />
                        </div>
                        <div class="df-cs-header-titles">
                            <span class="df-cs-header-name" id="dfCsHeaderTitle">Mindream</span>
                            <span class="df-cs-header-status">Tactical Assistant • Online</span>
                        </div>
                    </div>
                    <div class="df-cs-header-actions">
                        <button class="df-cs-btn-icon active-sound" id="dfCsSoundToggle" title="Matikan/Nyalakan Suara" aria-label="Toggle Suara">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                        <button class="df-cs-btn-icon" id="dfCsCloseBtn" title="Tutup Chat" aria-label="Tutup Chat">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- Messages Body -->
                <div class="df-cs-messages" id="dfCsMessages"></div>

                <!-- Input Footer -->
                <div class="df-cs-footer">
                    <div class="df-cs-wa-bar hidden" id="dfCsWaBar">
                        <span class="df-cs-wa-text">💬 Butuh bantuan khusus admin?</span>
                        <a href="https://wa.me/6285196561811" target="_blank" rel="noopener noreferrer" class="df-cs-wa-btn">
                            <i class="fa-brands fa-whatsapp"></i> Chat Admin WA
                        </a>
                    </div>
                    <form class="df-cs-input-wrap" id="dfCsForm">
                        <input 
                            type="text" 
                            class="df-cs-input" 
                            id="dfCsInput" 
                            placeholder="Ketik pertanyaan seputar Dreamfield..." 
                            autocomplete="off" 
                            maxlength="300"
                        />
                        <button type="submit" class="df-cs-btn-send" id="dfCsBtnSend" aria-label="Kirim Pesan">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }

    function init() {
        injectUI();

        // Restore sound settings
        const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
        if (savedSound !== null) soundEnabled = savedSound === 'true';
        updateSoundButton();

        // Clear chat history on every page load/refresh
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}

        // Always start with welcome message
        messages = [
            {
                role: 'model',
                text: 'Halo Operator! Selamat datang di **Dreamfield Tactical Surabaya**.\n\nSaya **Mindream**, asisten resmi yang siap membantu seputar **lokasi arena, jadwal operasional, harga paket, aturan safety, hingga booking online**. Ada yang bisa saya bantu?'
            }
        ];
        saveMessages();

        renderMessages();

        // Wire DOM Events
        const launcher = document.getElementById('dfCsLauncher');
        const closeBtn = document.getElementById('dfCsCloseBtn');
        const soundToggle = document.getElementById('dfCsSoundToggle');
        const form = document.getElementById('dfCsForm');
        const input = document.getElementById('dfCsInput');

        launcher.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled);
            updateSoundButton();
            if (soundEnabled) playTacticalSfx('receive');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text || isSending) return;
            input.value = '';
            sendMessage(text);
        });

        // Timer otomatis: jika user sudah berada di chat ~2 menit (120 detik), tampilkan tombol WhatsApp
        setTimeout(() => {
            waTimerTriggered = true;
            checkWaOptionVisibility();
        }, 120000);
    }

    function checkWaOptionVisibility() {
        const waBar = document.getElementById('dfCsWaBar');
        if (!waBar) return;
        // Muncul setelah beberapa bubble (>= 5 pesan) ATAU sudah lewat 2 menit
        if (messages.length >= 5 || waTimerTriggered) {
            waBar.classList.remove('hidden');
        } else {
            waBar.classList.add('hidden');
        }
    }

    function updateSoundButton() {
        const btn = document.getElementById('dfCsSoundToggle');
        if (!btn) return;
        if (soundEnabled) {
            btn.classList.add('active-sound');
            btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            btn.classList.remove('active-sound');
            btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    }

    function toggleChat() {
        isOpen = !isOpen;
        const launcher = document.getElementById('dfCsLauncher');
        const windowBox = document.getElementById('dfCsWindow');
        const input = document.getElementById('dfCsInput');

        if (isOpen) {
            launcher.classList.add('hidden');
            windowBox.classList.add('active');
            document.body.classList.add('df-cs-open');
            scrollToBottom();
            setTimeout(() => {
                input.focus();
            }, 250);
            playTacticalSfx('send');
        } else {
            windowBox.classList.remove('active');
            launcher.classList.remove('hidden');
            document.body.classList.remove('df-cs-open');
        }
    }

    function saveMessages() {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {}
    }

    function scrollToBottom() {
        const container = document.getElementById('dfCsMessages');
        if (container) container.scrollTop = container.scrollHeight;
    }

    function scrollToFirstNew() {
        const container = document.getElementById('dfCsMessages');
        if (!container) return;
        const newMsg = container.querySelector('.df-cs-msg-new');
        if (newMsg) {
            const containerTop = container.getBoundingClientRect().top;
            const msgTop = newMsg.getBoundingClientRect().top;
            container.scrollTo({
                top: container.scrollTop + (msgTop - containerTop) - 8,
                behavior: 'smooth'
            });
        }
    }

    function renderMessages(firstNewIndex) {
        const container = document.getElementById('dfCsMessages');
        if (!container) return;

        let html = '';
        for (let i = 0; i < messages.length; i++) {
            const m = messages[i];
            const isBot = m.role === 'model';
            const isNew = firstNewIndex !== undefined && i >= firstNewIndex;
            const hasCTA = isBot && m.text.includes('[BOOKING_CTA]');
            const cleanText = m.text.replace('[BOOKING_CTA]', '').trim();
            html += `
                <div class="df-cs-msg ${isBot ? 'bot' : 'user'}${isNew ? ' df-cs-msg-new' : ''}">
                    <div class="df-cs-msg-avatar">
                        ${isBot ? '<img src="/assets/img/mindream-avatar.jpg?v=2" alt="Mindream" class="df-cs-avatar-img" />' : '<i class="fa-solid fa-user"></i>'}
                    </div>
                    <div class="df-cs-msg-content">
                        <div class="df-cs-msg-bubble">
                            ${formatMarkdown(cleanText)}
                        </div>
                        ${hasCTA ? `
                        <a href="/booking.html" class="df-cs-booking-btn">
                            <i class="fa-solid fa-calendar-check"></i> Booking Sekarang
                        </a>` : ''}
                    </div>
                </div>
            `;
        }

        // Add Quick Action Pills on first render or after greeting
        if (messages.length <= 1) {
            html += `
                <div class="df-cs-quick-prompts">
                    <button type="button" class="df-cs-chip" data-query="Di mana lokasi Dreamfield dan jam buka?">📍 Lokasi & Jam Buka</button>
                    <button type="button" class="df-cs-chip" data-query="Berapa daftar harga paket main di Dreamfield?">💰 Daftar Harga Paket</button>
                    <button type="button" class="df-cs-chip" data-query="Apa saja arena yang tersedia dan syarat safetynya?">🛡️ Arena & Aturan Safety</button>
                    <button type="button" class="df-cs-chip" data-query="Bagaimana alur dan cara booking main?">📅 Cara Booking</button>
                </div>
            `;
        }

        container.innerHTML = html;

        // Attach listeners to quick chips
        const chips = container.querySelectorAll('.df-cs-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.getAttribute('data-query');
                if (query && !isSending) sendMessage(query);
            });
        });

        if (firstNewIndex !== undefined) {
            scrollToFirstNew();
        } else {
            scrollToBottom();
        }

        checkWaOptionVisibility();
    }


    function showTypingIndicator() {
        const container = document.getElementById('dfCsMessages');
        if (!container || document.getElementById('dfCsTyping')) return;

        const typingEl = document.createElement('div');
        typingEl.id = 'dfCsTyping';
        typingEl.className = 'df-cs-msg bot';
        typingEl.innerHTML = `
            <div class="df-cs-msg-avatar"><img src="/assets/img/mindream-avatar.jpg?v=2" alt="Mindream" class="df-cs-avatar-img" /></div>
            <div class="df-cs-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        container.appendChild(typingEl);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingEl = document.getElementById('dfCsTyping');
        if (typingEl) typingEl.remove();
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function sendMessage(text) {
        if (!text || isSending) return;
        isSending = true;

        const sendBtn = document.getElementById('dfCsBtnSend');
        if (sendBtn) sendBtn.disabled = true;

        // Append user message
        messages.push({ role: 'user', text: text });
        saveMessages();
        renderMessages();
        playTacticalSfx('send');

        // 1. Jeda sesaat setelah user kirim sebelum mulai mengetik (natural pause)
        await sleep(450);

        // 2. Mulai animasi mengetik
        showTypingIndicator();
        const typingStart = Date.now();

        try {
            // Build history payload (exclude current user message at end)
            const historyPayload = messages.slice(0, -1).map(m => ({
                role: m.role,
                text: m.text
            }));

            // Fetch jawaban AI dari backend
            const responsePromise = fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: historyPayload })
            });

            const response = await responsePromise;

            // Pastikan animasi mengetik terlihat minimal 1.3 detik agar terasa natural
            const elapsed = Date.now() - typingStart;
            if (elapsed < 1300) {
                await sleep(1300 - elapsed);
            }

            removeTypingIndicator();

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const botReply = data?.reply || 'Maaf, ada kendala koneksi. Coba lagi ya!';

            // Split into multiple bubbles by double newline
            const hasCTA = botReply.includes('[BOOKING_CTA]');
            const cleanReply = botReply.replace('[BOOKING_CTA]', '').trim();
            const rawBubbles = cleanReply
                .split(/\n\n+/)
                .map(b => b.trim())
                .filter(b => b.length > 0);

            const bubbles = rawBubbles.length > 0 ? rawBubbles : [cleanReply];
            const firstNewIndex = messages.length;

            // Render bubble pertama
            const isSingle = bubbles.length === 1;
            messages.push({
                role: 'model',
                text: bubbles[0] + (isSingle && hasCTA ? ' [BOOKING_CTA]' : '')
            });
            saveMessages();
            renderMessages(firstNewIndex);
            playTacticalSfx('receive');

            // Jika ada bubble berikutnya, kirim satu per satu dengan jeda mengetik
            for (let i = 1; i < bubbles.length; i++) {
                await sleep(400);
                showTypingIndicator();

                // Durasi mengetik proporsional dengan panjang teks (800ms - 1300ms)
                const bubbleTypingTime = Math.min(1300, Math.max(800, bubbles[i].length * 10));
                await sleep(bubbleTypingTime);
                removeTypingIndicator();

                const isLast = i === bubbles.length - 1;
                messages.push({
                    role: 'model',
                    text: bubbles[i] + (isLast && hasCTA ? ' [BOOKING_CTA]' : '')
                });
                saveMessages();
                renderMessages(firstNewIndex);
                playTacticalSfx('receive');
            }

        } catch (err) {
            console.error('Chat error:', err);
            removeTypingIndicator();
            const firstNewIndex = messages.length;
            messages.push({ role: 'model', text: 'Maaf, koneksi sedang gangguan. Coba kirim pesanmu lagi ya!' });
            saveMessages();
            renderMessages(firstNewIndex);
            playTacticalSfx('receive');
        } finally {
            isSending = false;
            if (sendBtn) sendBtn.disabled = false;
            const input = document.getElementById('dfCsInput');
            if (input) input.focus();
        }
    }



    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

