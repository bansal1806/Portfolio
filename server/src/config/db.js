import mongoose from 'mongoose';

let listenersAttached = false;
let connecting = null;

/**
 * Connects to MongoDB once and reuses the connection. Safe to call repeatedly — on
 * serverless platforms (Vercel) it runs on every cold start and before DB-backed requests.
 */
export async function connectDB(uri) {
  if (!uri) {
    console.warn('[db] MONGODB_URI not set — contact form will be unavailable');
    return;
  }
  if (mongoose.connection.readyState === 1) return;

  if (!listenersAttached) {
    listenersAttached = true;
    mongoose.connection.on('connected', () => console.log('[db] MongoDB connected'));
    mongoose.connection.on('error', (err) => console.error('[db] MongoDB error:', err.message));
    mongoose.connection.on('disconnected', () => console.warn('[db] MongoDB disconnected'));
  }

  connecting ??= mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .catch((err) => console.error('[db] Connection failed:', err.message))
    .finally(() => {
      connecting = null;
    });
  await connecting;
}

export const isDBConnected = () => mongoose.connection.readyState === 1;
