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
            <button class="df-cs-launcher" id="dfCsLauncher" aria-label="Buka Chat CS Dreamfield" title="Chat CS AI Dreamfield">
                <div class="df-cs-launcher-avatar">
                    <i class="fa-solid fa-headset"></i>
                    <span class="df-cs-pulse-dot"></span>
                </div>
                <div class="df-cs-launcher-text">
                    <span class="df-cs-launcher-title">TANYA CS AI</span>
                    <span class="df-cs-launcher-sub"><i class="fa-solid fa-circle" style="font-size:7px;"></i> Online 24/7</span>
                </div>
            </button>

            <!-- Chat Window -->
            <div class="df-cs-window" id="dfCsWindow" role="dialog" aria-labelledby="dfCsHeaderTitle">
                <!-- Header -->
                <div class="df-cs-header">
                    <div class="df-cs-header-info">
                        <div class="df-cs-header-avatar">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div class="df-cs-header-titles">
                            <span class="df-cs-header-name" id="dfCsHeaderTitle">Dreamfield Support AI</span>
                            <span class="df-cs-header-status">Tactical Assistant • Active</span>
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

                <!-- WhatsApp Direct Banner -->
                <div class="df-cs-wa-banner">
                    <span>Butuh respons admin langsung?</span>
                    <a href="https://wa.me/6285196561811" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp Admin
                    </a>
                </div>

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
        injectUI();

        // Restore sound settings
        const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
        if (savedSound !== null) soundEnabled = savedSound === 'true';
        updateSoundButton();

        // Restore session messages or add welcome message
        try {
            const savedHistory = sessionStorage.getItem(STORAGE_KEY);
            if (savedHistory) {
                messages = JSON.parse(savedHistory);
            }
        } catch (e) {
            messages = [];
        }

        if (!messages || messages.length === 0) {
            messages = [
                {
                    role: 'model',
                    text: 'Halo Operator! Selamat datang di **Dreamfield Tactical Surabaya**.\n\nSaya CS AI resmi siap membantu Anda seputar **lokasi arena, jadwal operasional, harga paket, aturan keamanan, hingga cara booking**. Ada yang bisa saya bantu?'
                }
            ];
            saveMessages();
        }

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
            scrollToBottom();
            setTimeout(() => {
                input.focus();
            }, 250);
            playTacticalSfx('send');
        } else {
            windowBox.classList.remove('active');
            launcher.classList.remove('hidden');
        }
    }

    function saveMessages() {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {}
    }

    function scrollToBottom() {
        const container = document.getElementById('dfCsMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    function renderMessages() {
        const container = document.getElementById('dfCsMessages');
        if (!container) return;

        let html = '';
        for (let i = 0; i < messages.length; i++) {
            const m = messages[i];
            const isBot = m.role === 'model';
            html += `
                <div class="df-cs-msg ${isBot ? 'bot' : 'user'}">
                    <div class="df-cs-msg-avatar">
                        <i class="fa-solid ${isBot ? 'fa-robot' : 'fa-user'}"></i>
                    </div>
                    <div class="df-cs-msg-bubble">
                        ${formatMarkdown(m.text)}
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
                if (query && !isSending) {
                    sendMessage(query);
                }
            });
        });

        scrollToBottom();
    }

    function showTypingIndicator() {
        const container = document.getElementById('dfCsMessages');
        if (!container || document.getElementById('dfCsTyping')) return;

        const typingEl = document.createElement('div');
        typingEl.id = 'dfCsTyping';
        typingEl.className = 'df-cs-msg bot';
        typingEl.innerHTML = `
            <div class="df-cs-msg-avatar"><i class="fa-solid fa-robot"></i></div>
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

        // Show typing
        showTypingIndicator();

        try {
            // Prepare history payload for API
            const historyPayload = messages.slice(0, -1).map(m => ({
                role: m.role,
                text: m.text
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: historyPayload
                })
            });

            removeTypingIndicator();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data?.reply || 'Siap Operator! Ada kendala penerimaan sinyal. Silakan chat WhatsApp Admin kami di 0851-9656-1811.';

            messages.push({ role: 'model', text: botReply });
            saveMessages();
            renderMessages();
            playTacticalSfx('receive');

        } catch (err) {
            console.error('Chat error:', err);
            removeTypingIndicator();

            const fallbackMsg = 'Maaf Operator, koneksi sedang mengalami gangguan sinyal. Anda dapat langsung mengontak Admin WhatsApp Dreamfield di **0851-9656-1811** (https://wa.me/6285196561811).';
            messages.push({ role: 'model', text: fallbackMsg });
            saveMessages();
            renderMessages();
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
