import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import CVButtons from '../components/CVButtons.jsx';

const MAX_TILT = 8; // degrees — a wide card needs a much gentler tilt than the original 30°

/**
 * Resume call-to-action as a 3D glass card (adapted from a Uiverse.io card by Smit-Prajapati):
 * the card tilts toward the cursor, a stack of glass circles rises out of the corner one after
 * another, and the download buttons lift off the surface.
 */
export default function Resume() {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.5 });

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--ry', `${(x * MAX_TILT * 2).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${(-y * MAX_TILT * 2).toFixed(2)}deg`);
  };

  const onPointerLeave = () => {
    cardRef.current.style.setProperty('--rx', '0deg');
    cardRef.current.style.setProperty('--ry', '0deg');
  };

  return (
    <section id="resume" className="section resume-section">
      <div className="container">
        <Reveal className="resume-parent">
          <div
            ref={cardRef}
            className={`resume-card3d${inView ? ' in-view' : ''}`}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <div className="resume-glass" aria-hidden="true" />

            <div className="resume-logo" aria-hidden="true">
              <span className="resume-circle c1" />
              <span className="resume-circle c2" />
              <span className="resume-circle c3" />
              <span className="resume-circle c4" />
              <span className="resume-circle c5"><FiFileText /></span>
            </div>

            <div className="resume-content">
              <span className="resume-eyebrow">Resume</span>
              <h2>Grab a copy of my resume</h2>
              <p>
                View it online, or download it as a PDF for quick reading or a Word document if you need to edit it.
                Downloads are served straight from my Node.js API.
              </p>
            </div>

            <CVButtons className="resume-buttons" showOnline />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
