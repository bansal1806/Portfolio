export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export const CV_URLS = {
  pdf: `${API_URL}/api/cv/pdf`,
  docx: `${API_URL}/api/cv/docx`,
};
