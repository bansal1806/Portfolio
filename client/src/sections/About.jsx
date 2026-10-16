import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { FiBriefcase, FiMail, FiMapPin } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { profile } from '../data/portfolio.js';

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading eyebrow="About me" title="A little about who I am" />

        <div className="about-grid">
          <Reveal direction="left" className="about-photo-wrap">
            <div className="about-photo">
              <img src={profile.photo} alt={`Portrait of ${profile.name}`} width="360" height="420" loading="lazy" />
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1} className="about-text">
            <h3 className="about-heading">
              Full-stack developer in the making, <span className="gradient-text">product builder</span> at heart.
            </h3>
            {profile.bio.map((p) => (
              <p key={p.slice(0, 20)} className="muted">{p}</p>
            ))}

            <ul className="about-meta">
              <li><FiMapPin aria-hidden="true" /> <span><strong>Location:</strong> {profile.location}</span></li>
              <li><FiBriefcase aria-hidden="true" /> <span><strong>Status:</strong> {profile.status}</span></li>
              <li>
                <FiMail aria-hidden="true" />
                <span><strong>Email:</strong> <a href={`mailto:${profile.email}`} className="link">{profile.email}</a></span>
              </li>
            </ul>

            <div className="about-stats">
              {profile.facts.map((f) => (
                <div key={f.label} className="stat card">
                  <span className="stat-value gradient-text"><Counter value={f.value} suffix={f.suffix} /></span>
                  <span className="stat-label muted small">{f.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
