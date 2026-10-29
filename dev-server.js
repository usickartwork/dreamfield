const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // API Route: /api/chat
    if (pathname === '/api/chat') {
        try {
            let bodyBuffer = [];
            req.on('data', chunk => bodyBuffer.push(chunk));
            req.on('end', async () => {
                const bodyStr = Buffer.concat(bodyBuffer).toString();
                try {
                    req.body = JSON.parse(bodyStr);
                } catch {
                    req.body = bodyStr;
                }

                // Add helper methods expected by Vercel serverless function
                res.status = function(code) {
                    res.statusCode = code;
                    return res;
                };
                res.json = function(data) {
                    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                    res.end(JSON.stringify(data));
                    return res;
                };

                const chatHandler = require('./api/chat.js');
                await chatHandler(req, res);
            });
            return;
        } catch (err) {
            console.error('API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
        }
    }

    // Static Files
    if (pathname === '/') {
        pathname = '/index.html';
    }

    let filePath = path.join(PUBLIC_DIR, pathname);

    // Clean URLs support (e.g., /booking -> /booking.html, /pricelist -> /pricelist.html)
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.end('<h1>404 Not Found</h1><p>Halaman tidak ditemukan.</p><p><a href="/">Kembali ke Beranda</a></p>');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server Dreamfield Tactical aktif di http://localhost:${PORT}`);
});
