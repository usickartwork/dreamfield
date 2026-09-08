/**
 * Vercel Serverless Function: /api/chat
 * Pure Google Gemini AI — no scripted fallbacks.
 */

const SYSTEM_INSTRUCTION = `Kamu adalah asisten AI yang ramah, santai, cerdas, dan luwes. Jawablah setiap pertanyaan, topik diskusi, atau obrolan pengguna dengan pengetahuanmu secara natural, mengalir, dan mudah dipahami dalam bahasa Indonesia yang luwes. Jangan kaku dan jangan gunakan bahasa template birokratis.`;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

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
            try { body = JSON.parse(body); } catch (e) {}
        }

        const userMessage = body?.message?.trim();
        const history = Array.isArray(body?.history) ? body.history : [];

        if (!userMessage) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(200).json({
                reply: 'AI sedang tidak tersedia saat ini. Silakan coba beberapa saat lagi.',
                source: 'error'
            });
        }

        // Build alternating conversation history for Gemini
        const contents = [];
        let lastRole = null;
        for (const item of history.slice(-10)) {
            if (!item?.role || !item?.text) continue;
            const role = item.role === 'user' ? 'user' : 'model';
            if (contents.length === 0 && role !== 'user') continue;
            if (role === lastRole) continue;
            contents.push({ role, parts: [{ text: item.text }] });
            lastRole = role;
        }

        // Add current user message
        if (lastRole === 'user' && contents.length > 0) {
            contents[contents.length - 1].parts[0].text += `\n${userMessage}`;
        } else {
            contents.push({ role: 'user', parts: [{ text: userMessage }] });
        }

        const payload = {
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1000,
                topP: 0.95
            }
        };

        // Try models in order: gemini-3.6-flash → gemini-3.5-flash
        for (const model of ['gemini-3.6-flash', 'gemini-3.5-flash']) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        return res.status(200).json({ reply: text.trim(), source: 'gemini_ai' });
                    }
                } else {
                    const err = await response.text();
                    console.error(`[${model}] ${response.status}:`, err);
                }
            } catch (e) {
                console.error(`[${model}] fetch error:`, e.message);
            }
        }

        return res.status(200).json({
            reply: 'Maaf, lagi ada gangguan sebentar. Coba kirim pesanmu lagi ya!',
            source: 'error'
        });

    } catch (err) {
        console.error('Handler error:', err);
        return res.status(200).json({
            reply: 'Terjadi kesalahan. Silakan coba lagi.',
            source: 'error'
        });
    }
};
