import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp, parseOrigins } from './app.js';
import { connectDB } from './config/db.js';

const app = createApp();

if (process.env.NODE_ENV === 'production') {
  const missing = ['MONGODB_URI', 'CLIENT_ORIGIN'].filter((k) => !process.env[k]);
  if (missing.length) console.warn(`[config] Missing environment variables: ${missing.join(', ')}`);
}
// Shows up in the host's logs, so it's easy to confirm which sites may call the API.
console.log(`[cors] Allowed origins: ${parseOrigins().join(', ')}`);

await connectDB(process.env.MONGODB_URI);

// On Vercel the exported app is invoked as a function; everywhere else (local dev,
// Render, Railway) start a regular HTTP server.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
  });

  // Render/Railway send SIGTERM on redeploy — finish in-flight requests, then close the DB.
  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down gracefully`);
    server.close(async () => {
      await mongoose.connection.close().catch(() => {});
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => console.error('[server] Unhandled rejection:', reason));

export default app;
