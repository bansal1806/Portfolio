// Empty by default: the client calls the API on the same domain (`/api/...`), which is
// how it's routed on Vercel and proxied by Vite in development. Set VITE_API_URL only
// when the API is hosted on a different domain (e.g. a separate Render deployment).
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const CV_URLS = {
  pdf: `${API_URL}/api/cv/pdf`,
  docx: `${API_URL}/api/cv/docx`,
};

// HTML version of the CV, served as a static file from client/public/cv/.
export const CV_ONLINE_URL = '/cv/index.html';
