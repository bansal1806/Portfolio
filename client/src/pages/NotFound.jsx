import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiArrowLeft, FiFolder, FiHome } from 'react-icons/fi';
import { profile } from '../data/portfolio.js';
import '../styles/notfound.css';

/* ── Starfield ─────────────────────────────────────────────────────────────
   Each layer is a single 1px element whose box-shadow paints hundreds of stars,
   so the whole sky costs three DOM nodes. Layers move at different speeds with the cursor. */
function makeStars(count, size, seed) {
  let x = seed;
  const rand = () => {
    x = (x * 16807) % 2147483647; // tiny deterministic PRNG → same sky on every render
    return x / 2147483647;
  };
  return Array.from({ length: count }, () => {
    const alpha = (0.35 + rand() * 0.65).toFixed(2);
    return `${Math.round(rand() * 2600)}px ${Math.round(rand() * 1600)}px 0 ${size - 1}px rgb(var(--star-rgb) / ${alpha})`;
  }).join(', ');
}

function StarLayer({ shadow, depth, mx, my, className }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return <motion.div className={`nf-stars ${className}`} style={{ boxShadow: shadow, x, y }} aria-hidden="true" />;
}

/* ── The "0": a ringed planet with an orbiting moon ─────────────────────── */
function Planet() {
  return (
    <svg className="nf-planet" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <radialGradient id="nf-planet-fill" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="0.45" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#1e1b4b" />
        </radialGradient>
        <linearGradient id="nf-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#06b6d4" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#f472b6" stopOpacity="0.4" />
        </linearGradient>
        <clipPath id="nf-planet-clip">
          <circle cx="120" cy="120" r="62" />
        </clipPath>
      </defs>
      <g transform="rotate(-18 120 120)">
        {/* back half of the ring, behind the planet */}
        <path d="M 18 120 A 102 26 0 0 1 222 120" className="nf-ring" />
        <circle cx="120" cy="120" r="62" fill="url(#nf-planet-fill)" />
        {/* surface bands + craters drift across the planet */}
        <g clipPath="url(#nf-planet-clip)">
          <g className="nf-surface">
            <ellipse cx="90" cy="96" rx="70" ry="7" fill="#fff" opacity="0.08" />
            <ellipse cx="150" cy="138" rx="80" ry="9" fill="#fff" opacity="0.07" />
            <circle cx="96" cy="128" r="9" fill="#1e1b4b" opacity="0.35" />
            <circle cx="140" cy="100" r="6" fill="#1e1b4b" opacity="0.3" />
            <circle cx="150" cy="150" r="4" fill="#1e1b4b" opacity="0.3" />
            <circle cx="216" cy="128" r="9" fill="#1e1b4b" opacity="0.35" />
            <circle cx="260" cy="100" r="6" fill="#1e1b4b" opacity="0.3" />
          </g>
        </g>
        {/* front half of the ring, over the planet */}
        <path d="M 18 120 A 102 26 0 0 0 222 120" className="nf-ring" />
      </g>
      <g className="nf-moon-orbit">
        <circle cx="120" cy="22" r="9" className="nf-moon" />
      </g>
    </svg>
  );
}

/* ── Astronaut: drifts on a loop, can be grabbed and flung ──────────────── */
function Astronaut({ constraintsRef }) {
  return (
    <motion.div
      className="nf-astronaut-wrap"
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.25}
      dragSnapToOrigin
      whileDrag={{ scale: 1.08, rotate: 12, cursor: 'grabbing' }}
      title="Grab me!"
    >
      <svg className="nf-astronaut" viewBox="0 0 140 160" aria-hidden="true">
        <defs>
          <linearGradient id="nf-visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1e1b4b" />
            <stop offset="0.6" stopColor="#4c1d95" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* tether */}
        <path d="M 30 92 C -10 110, 10 150, -20 158" className="nf-tether" />
        {/* backpack */}
        <rect x="34" y="62" width="72" height="62" rx="16" fill="#c4b5fd" />
        {/* legs */}
        <rect x="46" y="112" width="18" height="34" rx="9" fill="#f1f5f9" />
        <rect x="76" y="112" width="18" height="34" rx="9" fill="#f1f5f9" />
        <rect x="44" y="136" width="22" height="12" rx="6" fill="#a78bfa" />
        <rect x="74" y="136" width="22" height="12" rx="6" fill="#a78bfa" />
        {/* arms */}
        <rect x="18" y="74" width="20" height="40" rx="10" fill="#f1f5f9" transform="rotate(28 28 94)" />
        <rect x="102" y="70" width="20" height="40" rx="10" fill="#f1f5f9" transform="rotate(-38 112 90)" />
        <circle cx="16" cy="108" r="8" fill="#a78bfa" />
        <circle cx="128" cy="66" r="8" fill="#a78bfa" />
        {/* body */}
        <rect x="40" y="66" width="60" height="56" rx="20" fill="#ffffff" />
        <rect x="56" y="80" width="28" height="18" rx="5" fill="#e0e7ff" />
        <circle cx="63" cy="89" r="3" fill="#06b6d4" />
        <circle cx="71" cy="89" r="3" fill="#f472b6" />
        <circle cx="79" cy="89" r="3" fill="#7c3aed" />
        {/* helmet */}
        <circle cx="70" cy="46" r="34" fill="#ffffff" />
        <ellipse cx="70" cy="48" rx="24" ry="19" fill="url(#nf-visor)" />
        <ellipse cx="61" cy="41" rx="7" ry="4" fill="#fff" opacity="0.55" transform="rotate(-25 61 41)" />
        <circle cx="82" cy="56" r="2" fill="#fff" opacity="0.5" />
        <rect x="64" y="8" width="12" height="8" rx="3" fill="#c4b5fd" />
      </svg>
    </motion.div>
  );
}

/* ── Terminal line that types itself out ───────────────────────────────── */
function TypedLines({ lines, speed = 28 }) {
  const full = lines.join('\n');
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= full.length) return undefined;
    const t = setTimeout(() => setCount((c) => c + 1), full[count] === '\n' ? 420 : speed);
    return () => clearTimeout(t);
  }, [count, full, speed]);
  return (
    <pre className="nf-terminal" aria-hidden="true">
      {full.slice(0, count)}
      <span className="nf-cursor" />
    </pre>
  );
}

const QUICK_LINKS = [
  { to: '/#about', label: 'About' },
  { to: '/#skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/#resume', label: 'Resume' },
  { to: '/#contact', label: 'Contact' },
];

export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const sceneRef = useRef(null);

  // Cursor parallax: -0.5…0.5 → smoothed with a spring.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 });
  const my = useSpring(rawY, { stiffness: 60, damping: 20 });
  const digitsX = useTransform(mx, (v) => v * -26);
  const digitsY = useTransform(my, (v) => v * -18);

  const stars = useMemo(
    () => ({ far: makeStars(260, 1, 7), mid: makeStars(120, 2, 23), near: makeStars(40, 3, 91) }),
    []
  );

  useEffect(() => {
    document.title = `Page not found | ${profile.name}`;
  }, []);

  const onPointerMove = (e) => {
    const rect = sceneRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const shownPath = pathname.length > 40 ? `${pathname.slice(0, 37)}…` : pathname;
  const canGoBack = typeof window !== 'undefined' && window.history.state?.idx > 0;

  return (
    <section className="nf-scene" ref={sceneRef} onPointerMove={onPointerMove}>
      <StarLayer shadow={stars.far} depth={-12} mx={mx} my={my} className="far" />
      <StarLayer shadow={stars.mid} depth={-28} mx={mx} my={my} className="mid" />
      <StarLayer shadow={stars.near} depth={-50} mx={mx} my={my} className="near" />
      <span className="nf-shooting s1" aria-hidden="true" />
      <span className="nf-shooting s2" aria-hidden="true" />
      <span className="nf-shooting s3" aria-hidden="true" />
      <div className="nf-glow" aria-hidden="true" />

      <Astronaut constraintsRef={sceneRef} />

      <div className="container nf-content">
        <motion.div
          className="nf-digits"
          style={{ x: digitsX, y: digitsY }}
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <span className="nf-four" data-text="4">4</span>
          <Planet />
          <span className="nf-four" data-text="4">4</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="nf-eyebrow">Error 404</p>
          <h1 className="nf-title">
            Houston, we have a problem.
            <span className="visually-hidden"> Page not found.</span>
          </h1>
          <p className="nf-text">
            The page you&apos;re looking for drifted out of orbit — it doesn&apos;t exist or has been moved.
          </p>

          <TypedLines lines={[`$ GET ${shownPath}`, '→ 404 Not Found', '→ plotting a course back home…']} />

          <div className="nf-actions">
            <Link to="/" className="btn btn-primary">
              <FiHome aria-hidden="true" /> Back to home
            </Link>
            {canGoBack && (
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                <FiArrowLeft aria-hidden="true" /> Go back
              </button>
            )}
            <Link to="/projects" className="btn btn-outline">
              <FiFolder aria-hidden="true" /> Browse projects
            </Link>
          </div>

          <nav className="nf-links" aria-label="Popular pages">
            {QUICK_LINKS.map((l) => (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ))}
          </nav>
          <p className="nf-hint" aria-hidden="true">Psst — try grabbing the astronaut.</p>
        </motion.div>
      </div>
    </section>
  );
}
