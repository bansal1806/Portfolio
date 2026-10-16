import { Link } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import SocialLinks from './SocialLinks.jsx';
import { profile } from '../data/portfolio.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p className="muted small">
            © {new Date().getFullYear()} · Built with React, Express, MongoDB & Node.js
          </p>
        </div>
        <SocialLinks />
        <Link to="/#home" className="icon-btn" aria-label="Back to top" title="Back to top">
          <FiArrowUp />
        </Link>
      </div>
    </footer>
  );
}
