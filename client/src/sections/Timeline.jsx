import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FiBookOpen, FiBriefcase } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import { timeline } from '../data/portfolio.js';

export default function Timeline() {
  const ref = useRef(null);
  // The coloured line "draws" itself as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="journey" className="section alt">
      <div className="container">
        <SectionHeading
          eyebrow="Education & Experience"
          title="My journey so far"
          subtitle="Degrees, courses and work experience that shaped me as a developer."
        />

        <div className="timeline" ref={ref}>
          <div className="timeline-line" aria-hidden="true">
            <motion.div className="timeline-line-fill" style={{ scaleY }} />
          </div>

          <ol className="timeline-list">
            {timeline.map((item, i) => {
              const Icon = item.type === 'work' ? FiBriefcase : FiBookOpen;
              const side = i % 2 === 0 ? 'left' : 'right';
              return (
                <li key={`${item.title}-${item.period}`} className={`timeline-item ${side}`}>
                  <motion.span
                    className={`timeline-dot ${item.type}`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <Icon aria-hidden="true" />
                  </motion.span>

                  <motion.div
                    className="timeline-card card"
                    initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="timeline-meta">
                      <span className={`badge ${item.type === 'work' ? 'badge-work' : ''}`}>
                        {item.type === 'work' ? 'Experience' : 'Education'}
                      </span>
                      <time className="muted small">{item.period}</time>
                    </div>
                    <h3>{item.title}</h3>
                    <p className="timeline-org">{item.org}</p>
                    <p className="muted small timeline-details">{item.details}</p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
