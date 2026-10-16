import { FiDownload, FiFileText } from 'react-icons/fi';
import { CV_URLS } from '../config.js';

/** Download links for the CV. Files are streamed from the Express backend (/api/cv/:format). */
export default function CVButtons({ size, className = '' }) {
  const sizeClass = size === 'sm' ? ' btn-sm' : '';
  return (
    <div className={`cv-buttons ${className}`}>
      <a href={CV_URLS.pdf} className={`btn btn-primary${sizeClass}`} download>
        <FiDownload aria-hidden="true" /> Download CV (PDF)
      </a>
      <a href={CV_URLS.docx} className={`btn btn-outline${sizeClass}`} download>
        <FiFileText aria-hidden="true" /> Word (.docx)
      </a>
    </div>
  );
}
