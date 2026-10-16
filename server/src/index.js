import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  const missing = ['MONGODB_URI', 'CLIENT_ORIGIN'].filter((k) => !process.env[k]);
  if (missing.length) console.warn(`[config] Missing environment variables: ${missing.join(', ')}`);
}

await connectDB(process.env.MONGODB_URI);

const server = createApp().listen(PORT, () => {
  console.log(`[server] API listening on http://localhost:${PORT}`);
});

// Render/Railway send SIGTERM on redeploy — finish in-flight requests, then close the DB.
function shutdown(signal) {
  console.log(`[server] ${signal} received, shutting down gracefully`);
  server.close(async () => {
    await mongoose.connection.close().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => console.error('[server] Unhandled rejection:', reason));
