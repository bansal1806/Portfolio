import { FiDownload, FiExternalLink, FiFileText } from 'react-icons/fi';
import { CV_URLS, CV_ONLINE_URL } from '../config.js';

/**
 * Download links for the CV. Files are streamed from the Express backend (/api/cv/:format).
 * `showOnline` adds a link to the HTML version of the CV hosted with the site.
 */
export default function CVButtons({ size, className = '', showOnline = false }) {
  const sizeClass = size === 'sm' ? ' btn-sm' : '';
  return (
    <div className={`cv-buttons ${className}`}>
      <a href={CV_URLS.pdf} className={`btn btn-primary${sizeClass}`} download>
        <FiDownload aria-hidden="true" /> Download CV (PDF)
      </a>
      <a href={CV_URLS.docx} className={`btn btn-outline${sizeClass}`} download>
        <FiFileText aria-hidden="true" /> Word (.docx)
      </a>
      {showOnline && (
        <a href={CV_ONLINE_URL} className={`btn btn-outline${sizeClass}`} target="_blank" rel="noopener noreferrer">
          <FiExternalLink aria-hidden="true" /> View online
        </a>
      )}
    </div>
  );
}
