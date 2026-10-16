import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiExternalLink, FiGithub } from 'react-icons/fi';
import NotFound from './NotFound.jsx';
import { profile, projects } from '../data/portfolio.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    document.title = project ? `${project.name} | ${profile.name}` : `Not found | ${profile.name}`;
  }, [project]);

  if (!project) return <NotFound />;

  const { name, description, highlights, tech, github, live, gradient, emoji, year } = project;
  const others = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <section className="section page-top">
      <div className="container detail">
        <Link to="/projects" className="back-link">
          <FiArrowLeft aria-hidden="true" /> All projects
        </Link>

        <motion.div
          className="detail-cover"
          style={{ '--g1': gradient[0], '--g2': gradient[1] }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span aria-hidden="true">{emoji}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="muted small">{year}</p>
          <h1 className="detail-title">{name}</h1>
          <p className="detail-desc muted">{description}</p>

          <ul className="tech-list">
            {tech.map((t) => <li key={t} className="badge">{t}</li>)}
          </ul>

          <h2 className="detail-subtitle">Highlights</h2>
          <ul className="highlights">
            {highlights.map((h) => (
              <li key={h}><FiCheckCircle aria-hidden="true" /> {h}</li>
            ))}
          </ul>

          <div className="project-links">
            <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <FiGithub aria-hidden="true" /> View code on GitHub
            </a>
            <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <FiExternalLink aria-hidden="true" /> Open live demo
            </a>
          </div>
        </motion.div>

        {others.length > 0 && (
          <div className="detail-others">
            <h2 className="detail-subtitle">More projects</h2>
            <div className="others-list">
              {others.map((p) => (
                <Link key={p.slug} to={`/projects/${p.slug}`} className="other card">
                  <span className="other-emoji" style={{ '--g1': p.gradient[0], '--g2': p.gradient[1] }} aria-hidden="true">{p.emoji}</span>
                  <span>{p.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
