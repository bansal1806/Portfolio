import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAward, FiExternalLink, FiFolder, FiMaximize2, FiStar, FiX } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { achievements, certificateFolders, certifications } from '../data/portfolio.js';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'course', label: 'Courses' },
  { key: 'event', label: 'Hackathons & Events' },
];

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
          subtitle="Courses I've completed and the hackathons and events I've taken part in. Click a certificate to see it in full."
        />

        <div className="cert-filters" role="group" aria-label="Filter certificates">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className="chip" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label} <span className="chip-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="certs-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((c) => (
              <motion.article
                key={c.title}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
                className="cert-card card"
              >
                {c.image ? (
                  <button type="button" className="cert-thumb" onClick={() => setActive(c)} aria-label={`View ${c.title} certificate`}>
                    <img src={c.image} alt="" loading="lazy" decoding="async" />
                    <span className="cert-zoom"><FiMaximize2 aria-hidden="true" /> View</span>
                  </button>
                ) : (
                  <div className="cert-thumb cert-thumb-empty"><FiAward aria-hidden="true" /></div>
                )}
                <div className="cert-body">
                  <span className={`badge${c.category === 'event' ? ' badge-work' : ''}`}>{c.issuer}</span>
                  <h3>{c.title}</h3>
                  <p className="cert-kind muted small">{c.kind}</p>
                  <div className="cert-foot">
                    <span className="muted small">{c.date}</span>
                    <CertLinks links={c.links.slice(0, 1)} />
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

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
            <Reveal key={a.title} delay={i * 0.1} className="achievement card">
              <span className="achievement-icon"><FiStar aria-hidden="true" /></span>
              <div>
                <h4>
                  {a.title} {a.year && <span className="muted small">· {a.year}</span>}
                </h4>
                <p className="muted small">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Portal to <body>: the section may be transformed by the page stacking effect,
          which would otherwise trap this fixed overlay inside it. */}
      {createPortal(
        <AnimatePresence>{active && <Lightbox cert={active} onClose={() => setActive(null)} />}</AnimatePresence>,
        document.body
      )}
    </section>
  );
}
