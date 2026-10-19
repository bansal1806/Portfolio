import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import useTypewriter from '../hooks/useTypewriter.js';
import CVButtons from '../components/CVButtons.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import { profile } from '../data/portfolio.js';

// Loaded separately: the signature data is ~34 KB and only starts drawing ~1s after load.
const Signature = lazy(() => import('../components/Signature.jsx'));

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const role = useTypewriter(profile.roles);
  const [scrolled, setScrolled] = useState(false);

  // The scroll hint fades away once the visitor starts scrolling (and returns at the top).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
        <span className="hero-grid" />
      </div>

      <motion.div className="container hero-content" variants={container} initial="hidden" animate="show">
        <motion.span variants={item} className="hero-badge">
          <span className="pulse-dot" /> Available for internships & fresher roles
        </motion.span>

        <motion.p variants={item} className="hero-hello">Hi, I&apos;m</motion.p>
        <motion.h1 variants={item} className="hero-name">
          <span className="gradient-text">{profile.name}</span>
        </motion.h1>

        <motion.p variants={item} className="hero-role">
          {/* Screen readers get the full list once instead of the constantly changing typed text. */}
          <span className="visually-hidden">{profile.roles.join(', ')}</span>
          <span aria-hidden="true">
            {role}
            <span className="caret" />
          </span>
        </motion.p>

        <motion.p variants={item} className="hero-tagline">{profile.tagline}</motion.p>

        <motion.div variants={item} className="hero-cta">
          <CVButtons />
          <Link to="/projects" className="btn btn-outline">
            View my work <FiArrowRight aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <SocialLinks />
        </motion.div>

        <Suspense fallback={null}>
          <Signature className="hero-signature" />
        </Suspense>
      </motion.div>

      <a href="#about" className={`scroll-cue${scrolled ? ' is-hidden' : ''}`} aria-label="Scroll to explore — go to the About section">
        {/* Mouse with a rolling wheel on pointer devices; bouncing chevrons on touch screens (see CSS) */}
        <span className="scroll-mouse" aria-hidden="true">
          <span className="scroll-wheel" />
        </span>
        <span className="scroll-chevrons" aria-hidden="true">
          <FiChevronDown />
          <FiChevronDown />
        </span>
        <span className="scroll-label scroll-label-mouse" aria-hidden="true">Scroll to explore</span>
        <span className="scroll-label scroll-label-touch" aria-hidden="true">Swipe to explore</span>
      </a>
    </section>
  );
}
