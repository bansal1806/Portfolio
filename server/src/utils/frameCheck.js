/**
 * Decides whether a page with the given response headers may be shown in an iframe on
 * `embedderOrigin`, following the browser rules:
 *  - CSP `frame-ancestors` wins when present (X-Frame-Options is then ignored);
 *  - otherwise X-Frame-Options DENY / SAMEORIGIN blocks a cross-origin embedder.
 */
export function canEmbed({ xFrameOptions, csp }, embedderOrigin, targetOrigin) {
  const directive = (csp || '')
    .split(';')
    .map((d) => d.trim())
    .find((d) => d.toLowerCase().startsWith('frame-ancestors'));

  if (directive) {
    const sources = directive.split(/\s+/).slice(1);
    return sources.some((src) => matchesSource(src, embedderOrigin, targetOrigin));
  }

  const xfo = (xFrameOptions || '').trim().toLowerCase();
  if (xfo === 'deny') return false;
  if (xfo === 'sameorigin') return embedderOrigin === targetOrigin;
  return true;
}

function matchesSource(source, origin, targetOrigin) {
  const src = source.replace(/\/$/, '');
  if (src === "'none'") return false;
  if (src === '*') return true;
  if (src === "'self'") return origin === targetOrigin;

  let embedder;
  try {
    embedder = new URL(origin);
  } catch {
    return false;
  }
  if (/^https?:$/i.test(src)) return embedder.protocol === src.toLowerCase();

  // e.g. https://portfolio.vercel.app, https://*.vercel.app, portfolio.vercel.app
  const m = src.match(/^(?:(https?):\/\/)?(\*\.)?([^/:]+)(?::(\d+))?$/i);
  if (!m) return false;
  const [, scheme, wildcard, host, port] = m;
  if (scheme && embedder.protocol !== `${scheme.toLowerCase()}:`) return false;
  if (port && embedder.port !== port) return false;
  const h = embedder.hostname.toLowerCase();
  return wildcard ? h.endsWith(`.${host.toLowerCase()}`) : h === host.toLowerCase();
}
