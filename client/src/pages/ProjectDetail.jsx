import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiExternalLink, FiGithub } from 'react-icons/fi';
import NotFound from './NotFound.jsx';
import SitePreview, { useEmbeddable } from '../components/SitePreview.jsx';
import { profile, projects } from '../data/portfolio.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  // Same check the cards use, so a site shows live everywhere or nowhere.
  const canEmbed = useEmbeddable(project?.live ?? '', Boolean(project?.live && (project.embeddable || project.liveCard)));

  useEffect(() => {
    document.title = project ? `${project.name} | ${profile.name}` : `Not found | ${profile.name}`;
  }, [project]);

  if (!project) return <NotFound />;

  const { name, description, highlights = [], tech, github, live, preview, year, role } = project;
  // The next three projects in the list (wrapping around), so every page links somewhere new.
  const others = Array.from({ length: Math.min(3, projects.length - 1) }, (_, i) => projects[(index + i + 1) % projects.length]);

  return (
    <section className="section page-top">
      <div className="container detail">
        <Link to="/projects" className="back-link">
          <FiArrowLeft aria-hidden="true" /> All projects
        </Link>

        <motion.div
          className="detail-cover"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SitePreview url={live} image={preview} title={name} scroll="manual" live={canEmbed} />
          <p className="muted small detail-cover-note">
            {canEmbed ? 'Live site — interact with it right here.' : 'Scroll inside the preview to explore the full page.'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {(year || role) && <p className="muted small">{[year, role].filter(Boolean).join(' · ')}</p>}
          <h1 className="detail-title">{name}</h1>
          <p className="detail-desc muted">{description}</p>

          <ul className="tech-list">
            {tech.map((t) => <li key={t} className="badge">{t}</li>)}
          </ul>

          {highlights.length > 0 && (
            <>
              <h2 className="detail-subtitle">Highlights</h2>
              <ul className="highlights">
                {highlights.map((h) => (
                  <li key={h}><FiCheckCircle aria-hidden="true" /> {h}</li>
                ))}
              </ul>
            </>
          )}

          <div className="project-links">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <FiGithub aria-hidden="true" /> View code on GitHub
              </a>
            )}
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <FiExternalLink aria-hidden="true" /> Open live demo
              </a>
            )}
          </div>
        </motion.div>

        {others.length > 0 && (
          <div className="detail-others">
            <h2 className="detail-subtitle">More projects</h2>
            <div className="others-list">
              {others.map((p) => (
                <Link key={p.slug} to={`/projects/${p.slug}`} className="other card">
                  <img className="other-thumb" src={p.preview} alt="" loading="lazy" />
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
