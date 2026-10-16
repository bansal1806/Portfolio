import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <section className="section page-top not-found">
      <motion.div
        className="container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="not-found-code gradient-text">404</p>
        <h1>Page not found</h1>
        <p className="muted">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="btn btn-primary"><FiHome aria-hidden="true" /> Back to home</Link>
      </motion.div>
    </section>
  );
}
