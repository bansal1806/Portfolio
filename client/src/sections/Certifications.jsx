import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAward, FiExternalLink, FiMaximize2, FiStar, FiX } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { achievements, certifications } from '../data/portfolio.js';

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
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
          {cert.link && (
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              <FiExternalLink aria-hidden="true" /> Verify credential
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Certifications() {
  const [active, setActive] = useState(null);

  return (
    <section id="certifications" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Certifications & Achievements"
          title="Learning never stops"
          subtitle="Courses I've completed and milestones I'm proud of."
        />

        <div className="certs-grid">
          {certifications.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className="cert-card card">
              {c.image ? (
                <button type="button" className="cert-thumb" onClick={() => setActive(c)} aria-label={`View ${c.title} certificate`}>
                  <img src={c.image} alt="" loading="lazy" />
                  <span className="cert-zoom"><FiMaximize2 aria-hidden="true" /> View</span>
                </button>
              ) : (
                <div className="cert-thumb cert-thumb-empty"><FiAward aria-hidden="true" /></div>
              )}
              <div className="cert-body">
                <span className="badge">{c.issuer}</span>
                <h3>{c.title}</h3>
                <div className="cert-foot">
                  <span className="muted small">{c.date}</span>
                  {c.link && (
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                      Verify <FiExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="achievements-title">Achievements & hackathons</h3>
        <div className="achievements">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.1} className="achievement card">
              <span className="achievement-icon"><FiStar aria-hidden="true" /></span>
              <div>
                <h4>{a.title} <span className="muted small">· {a.year}</span></h4>
                <p className="muted small">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>{active && <Lightbox cert={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
