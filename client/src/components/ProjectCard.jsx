import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiExternalLink, FiGithub } from 'react-icons/fi';

export default function ProjectCard({ project }) {
  const { slug, name, description, tech, github, live, gradient, emoji, year } = project;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -8 }}
      className="project-card card"
    >
      <Link
        to={`/projects/${slug}`}
        className="project-cover"
        style={{ '--g1': gradient[0], '--g2': gradient[1] }}
        aria-label={`Read more about ${name}`}
      >
        <span className="project-emoji" aria-hidden="true">{emoji}</span>
        <span className="project-year">{year}</span>
      </Link>

      <div className="project-body">
        <h3 className="project-title">
          <Link to={`/projects/${slug}`}>
            {name} <FiArrowUpRight aria-hidden="true" className="project-arrow" />
          </Link>
        </h3>
        <p className="muted project-desc">{description}</p>

        <ul className="tech-list" aria-label="Tech stack">
          {tech.map((t) => (
            <li key={t} className="badge">{t}</li>
          ))}
        </ul>

        <div className="project-links">
          <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            <FiGithub aria-hidden="true" /> Code
          </a>
          <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            <FiExternalLink aria-hidden="true" /> Live demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}
