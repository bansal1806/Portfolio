import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.js';
import contactRoutes from './routes/contact.js';
import cvRoutes from './routes/cv.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.set('trust proxy', 1); // Vercel/Render sit behind a proxy
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors((req, cb) => {
      const origin = req.header('Origin');
      // When the client and API share a domain (Vercel services), browsers still send
      // an Origin header on POST. Treat it as same-origin when the browser says so
      // (Sec-Fetch-Site can't be set by page scripts) or when it matches the API host.
      const host = req.header('x-forwarded-host') || req.header('host');
      let sameOrigin = req.header('sec-fetch-site') === 'same-origin';
      try {
        sameOrigin ||= Boolean(origin && host && new URL(origin).host === host);
      } catch {
        /* malformed Origin header, e.g. "null" */
      }
      // Also allow non-browser requests (no Origin header) and whitelisted origins.
      if (!origin || sameOrigin || allowedOrigins.includes(origin)) {
        return cb(null, { origin: true, exposedHeaders: ['Content-Disposition'] });
      }
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    })
  );
  app.use(express.json({ limit: '20kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/', (_req, res) => res.json({ message: 'Portfolio API is running', docs: '/api/health' }));
  app.use('/api/health', healthRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/cv', cvRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
