import { Router } from 'express';
import { canEmbed } from '../utils/frameCheck.js';

const router = Router();

// Only these sites may be checked, so the endpoint can't be used to make the server
// request arbitrary URLs. Add a project's host here when its card shows the live site.
const ALLOWED_HOSTS = new Set(['www.hackjklu.com', 'hackjklu.com']);
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map(); // url -> { headers, expires }

async function fetchFrameHeaders(url) {
  const hit = cache.get(url);
  if (hit && hit.expires > Date.now()) return hit.headers;

  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(8000) });
  res.body?.cancel().catch(() => {}); // only the headers are needed
  const headers = {
    xFrameOptions: res.headers.get('x-frame-options'),
    csp: res.headers.get('content-security-policy'),
    finalOrigin: new URL(res.url).origin,
  };
  cache.set(url, { headers, expires: Date.now() + CACHE_MS });
  return headers;
}

// GET /api/embed-check?url=https://www.hackjklu.com/&origin=https://my-portfolio.vercel.app
router.get('/', async (req, res) => {
  let target;
  let origin;
  try {
    target = new URL(String(req.query.url));
    origin = new URL(String(req.query.origin)).origin;
  } catch {
    return res.status(400).json({ success: false, message: 'Query params "url" and "origin" must be valid URLs.' });
  }
  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    return res.status(400).json({ success: false, message: 'This site is not on the embed allowlist.' });
  }

  try {
    const headers = await fetchFrameHeaders(target.href);
    res.set('Cache-Control', 'public, max-age=300');
    return res.json({ success: true, embeddable: canEmbed(headers, origin, headers.finalOrigin) });
  } catch {
    // Can't reach the site — say "no" so the client keeps showing the screenshot.
    return res.json({ success: true, embeddable: false });
  }
});

export default router;
