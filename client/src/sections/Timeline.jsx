import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { FiBookOpen, FiBriefcase } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import { timeline } from '../data/portfolio.js';

// "Steps flow" timeline (inspired by the Framer StepsFlow component): rows alternate sides and one
// continuous line snakes between them with rounded corners, drawing itself as you scroll.
const MOBILE_QUERY = '(max-width: 899px)';
const LINE_X_MOBILE = 20; // px from the left edge on phones
const RADIUS = 28; // corner radius where the line turns

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return mobile;
}

/** Builds the snake path from the measured row boxes. Even rows run down the left edge, odd rows down the middle. */
function buildPath(rows, width, mobile) {
  if (!rows.length) return '';
  if (mobile) {
    const last = rows[rows.length - 1];
    return `M ${LINE_X_MOBILE} ${rows[0].top} V ${last.top + last.height}`;
  }
  const xs = [1.5, width / 2];
  let d = `M ${xs[0]} ${rows[0].top}`;
  rows.forEach((row, i) => {
    const x = xs[i % 2];
    const bottom = row.top + row.height;
    if (i === rows.length - 1) {
      d += ` V ${bottom}`;
      return;
    }
    const nextX = xs[(i + 1) % 2];
    const dir = nextX > x ? 1 : -1;
    d += ` V ${bottom - RADIUS}`;
    d += ` Q ${x} ${bottom} ${x + dir * RADIUS} ${bottom}`;
    d += ` H ${nextX - dir * RADIUS}`;
    d += ` Q ${nextX} ${bottom} ${nextX} ${bottom + RADIUS}`;
  });
  return d;
}

/** Two-digit step number whose last digit rolls into place like an odometer. */
function StepNumber({ value }) {
  const [rolled, setRolled] = useState(false);
  const digit = value % 10;
  return (
    <motion.div
      className="step-number"
      aria-hidden="true"
      onViewportEnter={() => setRolled(true)}
      viewport={{ once: true, amount: 0.3 }}
    >
      <span>{Math.floor(value / 10)}</span>
      <span className="step-digit">
        <motion.span
          className="step-digit-strip"
          initial={{ y: '0%' }}
          animate={{ y: rolled ? `-${digit * 10}%` : '0%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 100 + 20 * digit }}
        >
          0123456789
        </motion.span>
      </span>
    </motion.div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

function StepRow({ item, index, rowRef }) {
  const Icon = item.type === 'work' ? FiBriefcase : FiBookOpen;
  const label = item.type === 'work' ? 'Experience' : 'Education';
  return (
    <li ref={rowRef} className={`step-row${index % 2 ? ' reversed' : ''}`}>
      <div className="step-text">
        <StepNumber value={index + 1} />
        <motion.div {...fadeUp(0.1)}>
          <span className={`badge${item.type === 'work' ? ' badge-work' : ''}`}>{label}</span>
          <h3 className="step-title">{item.title}</h3>
          <p className="step-org">{item.org}</p>
        </motion.div>
        <motion.p className="muted step-details" {...fadeUp(0.2)}>
          {item.details}
        </motion.p>
      </div>

      <motion.div className={`step-visual ${item.type}`} {...fadeUp(0.15)} aria-hidden="true">
        <Icon className="step-visual-icon" />
        <span className="step-visual-period">{item.period}</span>
        <span className="step-visual-org">{item.org}</span>
      </motion.div>
    </li>
  );
}

export default function Timeline() {
  const mobile = useIsMobile();
  const containerRef = useRef(null);
  const rowRefs = useRef([]);
  const pathRef = useRef(null);
  const [geometry, setGeometry] = useState({ width: 0, height: 0, d: '' });

  // Measure rows and rebuild the path whenever the layout changes size.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const measure = () => {
      const rows = rowRefs.current.filter(Boolean).map((el) => ({ top: el.offsetTop, height: el.offsetHeight }));
      const { offsetWidth: width, offsetHeight: height } = container;
      setGeometry({ width, height, d: buildPath(rows, width, mobile) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [mobile]);

  // Scroll progress through the section drives how much of the line is drawn.
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 70%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });
  const [head, setHead] = useState(null);

  useMotionValueEvent(progress, 'change', (v) => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    if (!length) return;
    const p = path.getPointAtLength(Math.min(Math.max(v, 0), 1) * length);
    setHead(v > 0.005 && v < 0.995 ? { x: p.x, y: p.y } : null);
  });

  return (
    <section id="journey" className="section alt">
      <div className="container">
        <SectionHeading
          eyebrow="Education & Experience"
          title="My journey so far"
          subtitle="Degrees, courses and work experience that shaped me as a developer."
        />

        <div className="steps" ref={containerRef}>
          <svg
            className="steps-line"
            width={geometry.width}
            height={geometry.height}
            viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`}
            aria-hidden="true"
          >
            <defs>
              {/* userSpaceOnUse: a bounding-box gradient can't paint the zero-width straight line on phones */}
              <linearGradient id="steps-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geometry.height || 1}>
                <stop offset="0" style={{ stopColor: 'var(--primary)' }} />
                <stop offset="1" style={{ stopColor: 'var(--accent)' }} />
              </linearGradient>
            </defs>
            <path d={geometry.d} className="steps-track" />
            <motion.path ref={pathRef} d={geometry.d} className="steps-progress" style={{ pathLength: progress }} />
            {head && <circle cx={head.x} cy={head.y} r="6" className="steps-head" />}
          </svg>

          <ol className="steps-list">
            {timeline.map((item, i) => (
              <StepRow
                key={`${item.title}-${item.period}`}
                item={item}
                index={i}
                rowRef={(el) => (rowRefs.current[i] = el)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
