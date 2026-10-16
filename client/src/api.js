import { API_URL } from './config.js';

/**
 * POST a contact message to the Express API.
 * Resolves with the server's JSON body; throws an Error with `.errors` (field → message) on failure.
 */
export async function sendContactMessage(payload, { timeout = 45000 } = {}) {
  // Free-tier hosts (Render) can take ~30s to wake up, so allow a generous timeout.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      const err = new Error(data.message || `Request failed (${res.status})`);
      err.errors = data.errors;
      throw err;
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('The server took too long to respond. Please try again.');
    if (err instanceof TypeError) throw new Error('Could not reach the server. Please check your connection and try again.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
