import { createServer } from 'node:http';
import { submitContact, validateContact } from './contact.js';
export function createApp({ collection, ownerPhone, allowedOrigin = 'http://127.0.0.1:5173', serveStatic }) {
  const attempts = new Map();
  return createServer(async (req, res) => {
    const json = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
    if (req.url === '/api/health' && req.method === 'GET') return json(200, { status: 'ok' });
    if (!req.url.startsWith('/api/') && serveStatic && await serveStatic(req,res)) return;
    if (req.url !== '/api/contact' || req.method !== 'POST') return json(404, { message: 'Not found' });
    if (req.headers.origin && req.headers.origin !== allowedOrigin) return json(403, { message: 'Origin not allowed' });
    if (!req.headers['content-type']?.startsWith('application/json')) return json(415, { message: 'JSON required' });
    const now = Date.now();
    for (const [key, value] of attempts) if (now - value.start > 60000) attempts.delete(key);
    const key = req.socket.remoteAddress;
    const rate = attempts.get(key) || { start: now, count: 0 };
    if (++rate.count > 6) return json(429, { message: 'Too many requests. Please wait a minute.' });
    attempts.set(key, rate);
    let body = ''; let size = 0;
    try {
      for await (const chunk of req) { size += chunk.length; if (size > 4096) return json(413, { message: 'Request too large' }); body += chunk; }
      let input;
      try { input = JSON.parse(body); validateContact(input); } catch (error) { return json(400, { message: error instanceof SyntaxError ? 'Invalid JSON' : error.message }); }
      return json(201, await submitContact(input, collection, ownerPhone));
    } catch { return json(503, { message: 'Unable to save your request. Please try again later.' }); }
  });
}
