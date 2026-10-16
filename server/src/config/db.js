import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    console.warn('[db] MONGODB_URI not set — contact form will be unavailable');
    return;
  }
  mongoose.connection.on('connected', () => console.log('[db] MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('[db] MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('[db] MongoDB disconnected'));

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  } catch (err) {
    console.error('[db] Initial connection failed:', err.message);
  }
}

export const isDBConnected = () => mongoose.connection.readyState === 1;
