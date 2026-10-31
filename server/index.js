import { MongoClient } from 'mongodb';
import { createApp } from './app.js';
import { staticHandler } from './static.js';
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 5000 });
try {
  await client.connect();
  const collection = client.db(process.env.MONGODB_DB || 'myportfolio').collection('responses');
  const server = createApp({ collection, ownerPhone: process.env.OWNER_PHONE || '+917339339065', allowedOrigin: process.env.SITE_ORIGIN || 'http://127.0.0.1:5173', serveStatic: process.env.SERVE_STATIC === 'true' ? staticHandler('dist') : undefined });
  server.listen(Number(process.env.PORT || 3001), process.env.HOST || '127.0.0.1', () => console.log('Portfolio server ready on port ' + (process.env.PORT || 3001)));
  const shutdown = () => server.close(async () => { await client.close(); process.exit(0); });
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
} catch { console.error('Contact API could not connect to MongoDB. Check MONGODB_URI and that MongoDB is running.'); await client.close(); process.exit(1); }
