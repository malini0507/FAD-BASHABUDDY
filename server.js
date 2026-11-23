const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const { handleApiRequest } = require('./routes/apiRoutes');

const PORT = process.env.PORT || 5000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle API endpoints
  if (pathname.startsWith('/api/')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      let parsedBody = null;
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          parsedBody = {};
        }
      }
      handleApiRequest(req, res, pathname, parsedUrl.searchParams, parsedBody);
    });
    return;
  }

  // Handle Static Frontend Files
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  
  // Look in frontend/src or frontend/public or frontend
  let filePath = path.join(FRONTEND_DIR, relativePath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(FRONTEND_DIR, 'src', relativePath);
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(FRONTEND_DIR, 'public', relativePath);
  }
  if (!fs.existsSync(filePath)) {
    // SPA fallback
    filePath = path.join(FRONTEND_DIR, 'src', 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 BhashaBuddy: VoiceBridge Jam Server Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 Database: SQLite (bhashabuddy.db)`);
  console.log(`🗣️ Speech: Web Speech Synthesis & Recognition Enabled`);
  console.log(`====================================================`);
});
