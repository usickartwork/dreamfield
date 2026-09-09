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
        let cleaned = text.trim();
        // Hapus tanda petik pembungkus jika ada
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
            (cleaned.startsWith('“') && cleaned.endsWith('”')) ||
            (cleaned.startsWith('\'') && cleaned.endsWith('\''))) {
            cleaned = cleaned.slice(1, -1).trim();
        }

        let escaped = cleaned
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold **text**
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Links [text](url)
        escaped = escaped.replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Plain URLs
        escaped = escaped.replace(/(^|[^"])((https?:\/\/)(wa\.me|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})[^\s<]*)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');

        // Line breaks & bullet / numbered lists
        const lines = escaped.split('\n');
        let listType = null;
        let html = '';

        for (let line of lines) {
            line = line.trim();
            const isBullet = line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ') || line.startsWith('⁃ ');
            const isNumbered = /^\d+[\.\)]\s+/.test(line);

            if (isBullet) {
                if (listType !== 'ul') {
                    if (listType === 'ol') html += '</ol>';
                    html += '<ul>';
                    listType = 'ul';
                }
                const bulletContent = line.replace(/^(\*|-|•|⁃)\s*/, '');
                html += `<li>${bulletContent}</li>`;
            } else if (isNumbered) {
                if (listType !== 'ol') {
                    if (listType === 'ul') html += '</ul>';
                    html += '<ol>';
                    listType = 'ol';
                }
                const numContent = line.replace(/^\d+[\.\)]\s*/, '');
                html += `<li>${numContent}</li>`;
            } else {
                if (listType) {
                    html += listType === 'ol' ? '</ol>' : '</ul>';
                    listType = null;
                }
                if (line) {
                    html += `<p>${line}</p>`;
                }
            }
        }
        if (listType) {
            html += listType === 'ol' ? '</ol>' : '</ul>';
        }

        return html || `<p>${escaped}</p>`;
    }

    // Create and inject HTML UI into document
    function injectUI() {
        if (document.getElementById('df-cs-container')) return;

        const container = document.createElement('div');
        container.id = 'df-cs-container';
        container.innerHTML = `
            <!-- Floating Capsule Launcher -->
            <button class="df-cs-launcher" id="dfCsLauncher" aria-label="Tanya Mindream" title="Tanya Mindream">
                <div class="df-cs-launcher-avatar">
                    <img src="/assets/img/mindream-avatar.jpg?v=3" alt="Mindream" class="df-cs-avatar-img" />
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
                            <img src="/assets/img/mindream-avatar.jpg?v=3" alt="Mindream" class="df-cs-avatar-img" />
                        </div>
                        <div class="df-cs-header-titles">
                            <span class="df-cs-header-name" id="dfCsHeaderTitle">Mindream</span>
                            <span class="df-cs-header-status">Admin Support • Online</span>
                        </div>
                    </div>
                    <div class="df-cs-header-actions">
                        <a href="https://wa.me/6282233139118" target="_blank" rel="noopener noreferrer" class="df-cs-btn-icon df-cs-btn-wa" title="Chat Admin WhatsApp" aria-label="Chat Admin WhatsApp">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
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

                <!-- Floating Scroll Down Indicator -->
                <button type="button" class="df-cs-scroll-down-btn" id="dfCsScrollDownBtn" title="Lihat pesan baru di bawah" aria-label="Lihat pesan baru di bawah">
                    <i class="fa-solid fa-chevron-down"></i>
                    <span>Pesan baru di bawah</span>
                </button>

                <!-- Input Footer -->
                <div class="df-cs-footer">
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
        // Jangan aktifkan CS Bot di halaman booking
        if (window.location.pathname.includes('booking') || window.location.href.includes('booking.html')) {
            return;
        }

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
                text: 'Halo kak! Selamat datang di Dreamfield Tactical Surabaya.\n\nAku Mindream, admin yang lagi standby shift di sini. Mau tanya info arena, harga paket main, jadwal buka, atau mau langsung pesan slot?'
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
        const messagesContainer = document.getElementById('dfCsMessages');
        const scrollDownBtn = document.getElementById('dfCsScrollDownBtn');

        launcher.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', updateScrollDownBtn, { passive: true });
        }

        if (scrollDownBtn) {
            scrollDownBtn.addEventListener('click', () => {
                if (messagesContainer) {
                    messagesContainer.scrollTo({
                        top: messagesContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                }
                scrollDownBtn.classList.remove('visible');
            });
        }

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

        // Intercept horizontal gestures inside chat window to prevent browser history edge navigation (e.g. accidental swipe to booking page)
        const windowBox = document.getElementById('dfCsWindow');
        let touchStartX = 0;
        let touchStartY = 0;

        windowBox.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        windowBox.addEventListener('touchmove', (e) => {
            if (!e.touches || e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - touchStartX;
            const dy = e.touches[0].clientY - touchStartY;
            // If movement is horizontal, block native browser history back/forward navigation
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        // Handle mobile back button / swipe back gesture so it closes chat instead of navigating away
        window.addEventListener('popstate', () => {
            if (isOpen) {
                toggleChat(true);
            }
        });
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

    function toggleChat(fromPopState = false) {
        isOpen = !isOpen;
        const launcher = document.getElementById('dfCsLauncher');
        const windowBox = document.getElementById('dfCsWindow');
        const input = document.getElementById('dfCsInput');

        if (isOpen) {
            launcher.classList.add('hidden');
            windowBox.classList.add('active');
            document.body.classList.add('df-cs-open');
            document.documentElement.classList.add('df-cs-open');
            scrollToBottom();
            setTimeout(() => {
                input.focus();
            }, 250);
            playTacticalSfx('send');

            try {
                history.pushState({ dfCsOpen: true }, '');
            } catch (e) {}
        } else {
            windowBox.classList.remove('active');
            launcher.classList.remove('hidden');
            document.body.classList.remove('df-cs-open');
            document.documentElement.classList.remove('df-cs-open');

            if (!fromPopState && window.history.state && window.history.state.dfCsOpen) {
                try {
                    window.history.back();
                } catch (e) {}
            }
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

    function updateScrollDownBtn() {
        const container = document.getElementById('dfCsMessages');
        const btn = document.getElementById('dfCsScrollDownBtn');
        if (!container || !btn) return;
        const remainingScroll = container.scrollHeight - container.scrollTop - container.clientHeight;
        if (remainingScroll > 45) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    function renderMessages(firstNewIndex, forceBottom = false, isFirstBubble = false) {
        const container = document.getElementById('dfCsMessages');
        if (!container) return;

        const prevScrollTop = container.scrollTop;

        let html = '';
        let hasAnyCTA = false;
        for (let i = 0; i < messages.length; i++) {
            const m = messages[i];
            const isBot = m.role === 'model';
            const isNew = firstNewIndex !== undefined && i >= firstNewIndex;
            const hasCTA = isBot && m.text.includes('[BOOKING_CTA]');
            if (hasCTA) hasAnyCTA = true;
            const cleanText = m.text.replace('[BOOKING_CTA]', '').trim();
            html += `
                <div class="df-cs-msg ${isBot ? 'bot' : 'user'}${isNew ? ' df-cs-msg-new' : ''}">
                    <div class="df-cs-msg-avatar">
                        ${isBot ? '<img src="/assets/img/mindream-avatar.jpg?v=3" alt="Mindream" class="df-cs-avatar-img" />' : '<i class="fa-solid fa-user"></i>'}
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

        if (forceBottom) {
            scrollToBottom();
        } else if (isFirstBubble && firstNewIndex !== undefined) {
            scrollToFirstNew();
        } else if (firstNewIndex !== undefined) {
            // Tetap stay di posisi bubble 1 (jangan loncat/scroll ke bawah)
            container.scrollTop = prevScrollTop;
        } else {
            scrollToBottom();
        }

        setTimeout(updateScrollDownBtn, 80);
    }


    function showTypingIndicator(forceScroll = true) {
        const container = document.getElementById('dfCsMessages');
        if (!container || document.getElementById('dfCsTyping')) return;

        const typingEl = document.createElement('div');
        typingEl.id = 'dfCsTyping';
        typingEl.className = 'df-cs-msg bot';
        typingEl.innerHTML = `
            <div class="df-cs-msg-avatar"><img src="/assets/img/mindream-avatar.jpg?v=3" alt="Mindream" class="df-cs-avatar-img" /></div>
            <div class="df-cs-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        container.appendChild(typingEl);
        if (forceScroll) {
            scrollToBottom();
        } else {
            updateScrollDownBtn();
        }
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
        renderMessages(undefined, true);
        playTacticalSfx('send');

        // 1. Jeda sesaat setelah user kirim sebelum admin mulai mengetik (natural pause)
        await sleep(650);

        // 2. Mulai animasi mengetik
        showTypingIndicator(true);
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
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const botReply = data?.reply || 'Maaf, ada kendala koneksi. Coba lagi ya!';

            // Deteksi booking intent di sisi client sebagai pengaman cadangan
            const bookingKeywords = /(mau|ingin|pengen|bisa|tolong|minta|cara|link|buka|jadwal|siap|oke|ikut)\s*(booking|pesan|reservasi|order|main)/i;
            const directKeywords = /^(booking|reservasi|booking sekarang|mau booking|mau pesan|mau main|cara booking|pesan slot)$/i;
            const hasCTA = botReply.includes('[BOOKING_CTA]') || bookingKeywords.test(text) || directKeywords.test(text.trim());

            // Split into multiple bubbles by double newline
            const cleanReply = botReply.replace('[BOOKING_CTA]', '').trim();
            const rawBubbles = cleanReply
                .split(/\n\n+/)
                .map(b => b.trim())
                .filter(b => b.length > 0);

            const bubbles = rawBubbles.length > 0 ? rawBubbles : [cleanReply];
            const firstNewIndex = messages.length;

            // Durasi mengetik bubble 1: minimal 2.0s - 3.2s agar natural seperti admin manusia mengetik
            const firstBubbleTypingTime = Math.min(3200, Math.max(2000, bubbles[0].length * 18));
            const elapsed = Date.now() - typingStart;
            if (elapsed < firstBubbleTypingTime) {
                await sleep(firstBubbleTypingTime - elapsed);
            }

            removeTypingIndicator();

            // Render bubble pertama (anchor view ke Bubble 1)
            const isSingle = bubbles.length === 1;
            messages.push({
                role: 'model',
                text: bubbles[0] + (isSingle && hasCTA ? ' [BOOKING_CTA]' : '')
            });
            saveMessages();
            renderMessages(firstNewIndex, false, true);
            playTacticalSfx('receive');

            // Jika ada bubble berikutnya, kirim satu per satu dengan jeda mengetik dan tetap STAY di bubble 1
            for (let i = 1; i < bubbles.length; i++) {
                // Jeda membaca sebelum admin mulai mengetik bubble berikutnya
                await sleep(750);
                showTypingIndicator(false);

                // Durasi mengetik proporsional dengan panjang teks (1.5s - 2.8s)
                const bubbleTypingTime = Math.min(2800, Math.max(1500, bubbles[i].length * 16));
                await sleep(bubbleTypingTime);
                removeTypingIndicator();

                const isLast = i === bubbles.length - 1;
                messages.push({
                    role: 'model',
                    text: bubbles[i] + (isLast && hasCTA ? ' [BOOKING_CTA]' : '')
                });
                saveMessages();
                renderMessages(firstNewIndex, false, false);
                playTacticalSfx('receive');
            }

            updateScrollDownBtn();

        } catch (err) {
            console.error('Chat error:', err);
            removeTypingIndicator();
            const firstNewIndex = messages.length;
            messages.push({ role: 'model', text: 'Maaf, koneksi sedang gangguan. Coba kirim pesanmu lagi ya!' });
            saveMessages();
            renderMessages(firstNewIndex, false, true);
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

