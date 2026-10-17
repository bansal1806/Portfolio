import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle.jsx';
import useActiveSection from '../hooks/useActiveSection.js';
import { profile } from '../data/portfolio.js';

const LINKS = [
  { to: '/#about', label: 'About' },
  { to: '/#skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/#journey', label: 'Journey' },
  { to: '/#certifications', label: 'Certificates' },
  { to: '/#resume', label: 'Resume' },
  { to: '/#contact', label: 'Contact' },
];

// Home-page section ids that each link highlights while in view ("/projects" maps to #projects).
const SECTION_IDS = LINKS.map(({ to }) => (to.startsWith('/#') ? to.slice(2) : to.slice(1)));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const activeSection = useActiveSection(SECTION_IDS, location.pathname === '/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route or hash changes.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  const renderLinks = () =>
    LINKS.map(({ to, label }, i) => {
      const inView = activeSection === SECTION_IDS[i];
      return to.startsWith('/#') ? (
        <Link key={to} to={to} className={`nav-link${inView ? ' active' : ''}`} aria-current={inView ? 'location' : undefined}>
          {label}
        </Link>
      ) : (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive || inView ? ' active' : ''}`}>
          {label}
        </NavLink>
      );
    });

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <nav className="container nav-inner" aria-label="Main">
        <Link to="/" className="brand" aria-label="Home">
          <img src="/images/logo.png" alt="" className="brand-logo" width="44" height="44" />
          <span className="brand-name">{profile.name}</span>
        </Link>

        <div className="nav-links desktop-only">{renderLinks()}</div>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn mobile-only"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu mobile-only"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="container mobile-menu-inner">{renderLinks()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
