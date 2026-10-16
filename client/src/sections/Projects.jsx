import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ProjectsShowcase from '../components/ProjectsShowcase.jsx';
import { projects } from '../data/portfolio.js';

export default function Projects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          subtitle="A selection of full-stack projects. Filter by technology or open a card for details."
        />
        <Reveal>
          <ProjectsShowcase projects={featured} />
        </Reveal>
        <div className="center-cta">
          <Link to="/projects" className="btn btn-outline">
            See all projects <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
