import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiAward, FiChevronLeft, FiChevronRight, FiExternalLink, FiFolder, FiMaximize2, FiStar, FiX } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { achievements, certificateFolders, certifications, profile } from '../data/portfolio.js';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'course', label: 'Courses' },
  { key: 'event', label: 'Hackathons & Events' },
];

const pad = (n) => String(n).padStart(2, '0');
const TURN_MS = 900; // keep in sync with --turn on .book in sections.css

function CertLinks({ links, className = '' }) {
  return (
    <div className={`cert-links ${className}`}>
      {links.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="cert-link">
          {l.label} <FiExternalLink aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function Lightbox({ cert, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div className="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-label={`${cert.title} certificate`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close" autoFocus>
          <FiX />
        </button>
        <img src={cert.image} alt={`${cert.title} certificate issued by ${cert.issuer}`} />
        <div className="modal-caption">
          <div>
            <strong>{cert.title}</strong>
            <p className="muted small" style={{ margin: 0 }}>{cert.issuer} · {cert.date}</p>
          </div>
          <CertLinks links={cert.links} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Book pages ──────────────────────────────────────────────────────────── */

// Photo of the leather cover (public/images). Its proportions set the size of the whole book.
const COVER_IMAGE = '/images/certificate-book-cover.webp';
const COVER_RATIO = 940 / 716; // width / height of the image file

function Cover() {
  return (
    <div className="book-cover">
      <img src={COVER_IMAGE} alt="" draggable={false} decoding="async" />
    </div>
  );
}

function DetailsPage({ cert, n, onView }) {
  return (
    <div className="page page-details">
      <span className="page-no-top">No. {pad(n)}</span>
      <span className={`page-badge${cert.category === 'event' ? ' event' : ''}`}>{cert.category === 'event' ? 'Event' : 'Course'}</span>
      <h3 className="page-title">{cert.title}</h3>
      <p className="page-issuer">{cert.issuer}</p>
      <p className="page-meta">{cert.kind}</p>
      <p className="page-meta">{cert.date}</p>
      <div className="page-actions">
        {cert.image && (
          <button type="button" className="page-btn" onClick={() => onView(cert)}>
            <FiMaximize2 aria-hidden="true" /> View full size
          </button>
        )}
        <CertLinks links={cert.links} />
      </div>
      <span className="page-folio left">{n * 2}</span>
    </div>
  );
}

function ImagePage({ cert, n }) {
  return (
    <div className="page page-image">
      {cert.image ? (
        <figure className="mounted">
          <img src={cert.image} alt={`${cert.title} certificate issued by ${cert.issuer}`} loading="lazy" decoding="async" draggable={false} />
          <span className="photo-corner tl" aria-hidden="true" />
          <span className="photo-corner tr" aria-hidden="true" />
          <span className="photo-corner bl" aria-hidden="true" />
          <span className="photo-corner br" aria-hidden="true" />
        </figure>
      ) : (
        <span className="page-noimg" aria-hidden="true"><FiAward /></span>
      )}
      <span className="page-folio right">{n * 2 + 1}</span>
    </div>
  );
}

function AwardsPage() {
  return (
    <div className="page page-awards">
      <span className="page-no-top">Awards</span>
      <h3 className="page-title">Awards &amp; achievements</h3>
      <ul className="page-list">
        {achievements.map((a) => (
          <li key={a.title}>
            <FiStar aria-hidden="true" />
            <span>
              <strong>{a.title}</strong>
              {a.year && <em> · {a.year}</em>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EndPage() {
  return (
    <div className="page page-end">
      <span className="end-flourish" aria-hidden="true">❦</span>
      <h3 className="page-title">That&apos;s every certificate so far</h3>
      <p className="page-meta">More are on the way. The originals are in Google Drive:</p>
      <div className="page-actions center">
        <a href={certificateFolders.course} target="_blank" rel="noopener noreferrer" className="page-btn">
          <FiFolder aria-hidden="true" /> Course certificates
        </a>
        <a href={certificateFolders.event} target="_blank" rel="noopener noreferrer" className="page-btn">
          <FiFolder aria-hidden="true" /> Event certificates
        </a>
      </div>
    </div>
  );
}

/**
 * A leather-bound certificate album. Closed, it shows the cover (which lifts a little on hover);
 * click it to open. Each certificate gets a spread: details on the left page, the certificate
 * mounted on the right. Pages turn in 3D around the spine (click a page, use the arrows, swipe,
 * or the arrow keys). On narrow screens it shows one page at a time with the details below.
 *
 * Structure: a stack of sheets hinged on the spine. Sheet 0's front is the cover; sheet i's
 * front (i >= 1) is certificate i's image and sheet i's back is certificate i+1's details, so
 * turning sheet i reveals the next spread. `page` = how many sheets are turned (0 = closed).
 */
function CertificateBook({ certs, onView }) {
  const wrap = useRef(null);
  const swipe = useRef(null);
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  // Closing takes a full page turn. `settled` flips true once the cover has landed, and only
  // then do the closed-only styles apply (photo backing, hidden base page, hover lift).
  const [settled, setSettled] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (page !== 0) {
      setSettled(false);
      return undefined;
    }
    const t = setTimeout(() => setSettled(true), reduceMotion ? 0 : TURN_MS);
    return () => clearTimeout(t);
  }, [page, reduceMotion]);

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  const n = certs.length;
  const sheets = n + 1;
  const double = width >= 760;
  // Single: leave room for the cover's 10px overhang and 9px thickness shadow on the right.
  const pw = double ? Math.min(460, Math.floor((width - 40) / 2)) : Math.min(440, Math.floor(width - 24));
  // The cover is the page size plus a 10px overhang on the right and 8px top and bottom.
  const ph = Math.round((pw + 10) / COVER_RATIO - 16);

  const go = (p) => setPage(Math.max(0, Math.min(sheets, p)));
  const next = () => go(page + 1);
  const prev = () => go(page - 1);
  const closed = page === 0;
  const current = page >= 1 && page <= n ? certs[page - 1] : null;

  // Ignore clicks on links/buttons inside a page; the rest of the page turns it.
  const pageClick = (dir) => (e) => {
    if (e.target.closest('a, button')) return;
    dir > 0 ? next() : prev();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e) => (swipe.current = { x: e.clientX, y: e.clientY });
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || e.pointerType === 'mouse') return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) (dx < 0 ? next : prev)();
  };

  const status = closed ? 'Closed' : current ? `Certificate ${page} of ${n}` : 'The end';

  return (
    <div className="book-wrap" ref={wrap}>
      {width > 0 && (
        <div
          className={`book ${double ? 'double' : 'single'}${closed ? ' at-cover' : ''}${closed && settled ? ' is-closed' : ''}`}
          style={{ '--pw': `${pw}px`, '--ph': `${ph}px` }}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          role="region"
          aria-roledescription="book"
          aria-label="Certificates book"
        >
          {/* Closed and double: shift left by half a page so the cover sits centered. */}
          <div className="book-inner" style={{ transform: `translateX(${closed && double ? -pw / 2 : 0}px)` }}>
            <span className="board left" aria-hidden="true" />
            <span className="board right" aria-hidden="true" />
            <div className="page-base">
              <EndPage />
            </div>

            {Array.from({ length: sheets }, (_, i) => {
              const turned = i < page;
              const frontVisible = i === page;
              const backVisible = double && i === page - 1;
              return (
                <div
                  key={i}
                  className={`sheet${turned ? ' turned' : ''}${i === 0 ? ' cover' : ''}`}
                  // Unturned sheets stack with the lowest index on top; turned ones the reverse.
                  // z-index switches halfway through the turn (see CSS), when the sheet is edge-on.
                  style={{ zIndex: turned ? i + 1 : sheets - i + 1 }}
                >
                  <div className="face front" inert={!frontVisible} onClick={i > 0 ? pageClick(1) : undefined}>
                    {i === 0 ? (
                      <button
                        type="button"
                        className="cover-btn"
                        onClick={next}
                        aria-label={`Open the certificates book: ${n} certificates by ${profile.name}`}
                      >
                        <Cover />
                      </button>
                    ) : (
                      <ImagePage cert={certs[i - 1]} n={i} />
                    )}
                  </div>
                  <div className="face back" inert={!backVisible} onClick={pageClick(-1)}>
                    {i < n ? <DetailsPage cert={certs[i]} n={i + 1} onView={onView} /> : <AwardsPage />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="book-controls">
        {closed ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={next}>
            Open the book
          </button>
        ) : (
          <>
            <button type="button" className="arc-btn" onClick={prev} aria-label="Previous page">
              <FiChevronLeft aria-hidden="true" />
            </button>
            <span className="book-status" aria-live="polite">{status}</span>
            <button type="button" className="arc-btn" onClick={next} disabled={page === sheets} aria-label="Next page">
              <FiChevronRight aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-outline btn-sm book-close" onClick={() => go(0)}>
              Close book
            </button>
          </>
        )}
      </div>

      {/* One page at a time on narrow screens: the details page isn't visible, so show it here. */}
      {!double && current && (
        <div className="book-caption card">
          <strong>{current.title}</strong>
          <p className="muted small">{current.issuer} · {current.kind} · {current.date}</p>
          <div className="page-actions">
            <button type="button" className="page-btn" onClick={() => onView(current)}>
              <FiMaximize2 aria-hidden="true" /> View full size
            </button>
            <CertLinks links={current.links} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Certifications() {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('all');

  const counts = useMemo(
    () => ({
      all: certifications.length,
      course: certifications.filter((c) => c.category === 'course').length,
      event: certifications.filter((c) => c.category === 'event').length,
    }),
    []
  );
  const visible = useMemo(
    () =>
      certifications
        .filter((c) => filter === 'all' || c.category === filter)
        .sort((a, b) => b.sort.localeCompare(a.sort)),
    [filter]
  );

  return (
    <section id="certifications" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Certifications & Achievements"
          title="Learning never stops"
          subtitle="Courses I've completed and the hackathons and events I've taken part in. Open the book and turn the pages."
        />

        <div className="cert-filters" role="group" aria-label="Filter certificates">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className="chip" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label} <span className="chip-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <Reveal>
          {/* A new filter is a new book: remount so it starts closed with the right pages. */}
          <CertificateBook key={filter} certs={visible} onView={setActive} />
        </Reveal>

        <div className="cert-folders">
          <a href={certificateFolders.course} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            <FiFolder aria-hidden="true" /> All course certificates
          </a>
          <a href={certificateFolders.event} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            <FiFolder aria-hidden="true" /> All event certificates
          </a>
        </div>

        <h3 className="achievements-title">Awards & achievements</h3>
        <div className="achievements">
          {achievements.map((a, i) => (
            // Text sits on a leather plaque image (public/images/achievement-plaque.webp)
            <Reveal key={a.title} delay={i * 0.1} className="plaque">
              <div className="plaque-text">
                <h4 className="plaque-title">{a.title}</h4>
                <p className="plaque-detail">
                  {a.detail}
                  {a.year && <span className="plaque-year"> · {a.year}</span>}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>{active && <Lightbox cert={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
