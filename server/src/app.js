import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.js';
import contactRoutes from './routes/contact.js';
import cvRoutes from './routes/cv.js';
import embedRoutes from './routes/embed.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

/**
 * CLIENT_ORIGIN as a clean list. Forgives the usual copy-paste slips: surrounding quotes,
 * spaces and trailing slashes (a browser's Origin header never ends with "/").
 */
export function parseOrigins(list = process.env.CLIENT_ORIGIN || 'http://localhost:5173') {
  return list
    .split(',')
    .map((o) => o.trim().replace(/^["']|["']$/g, '').trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

/**
 * Turns CLIENT_ORIGIN entries into matchers. An entry may use `*` for any run of letters,
 * digits and dashes (never a dot), e.g. `https://portfolio-two-fawn*.vercel.app` matches the
 * stable Vercel domain and every per-deploy URL like `portfolio-two-fawn-0h72eb46it.vercel.app`.
 */
function originMatchers(list) {
  return parseOrigins(list).map((o) => {
    if (!o.includes('*')) return (origin) => origin === o;
    const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${o.split('*').map(escape).join('[a-z0-9-]*')}$`, 'i');
    return (origin) => re.test(origin);
  });
}

export function createApp() {
  const app = express();

  const allowed = originMatchers();
  const isAllowed = (origin) => allowed.some((match) => match(origin));

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
      if (!origin || sameOrigin || isAllowed(origin)) {
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
  app.use('/api/embed-check', embedRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
