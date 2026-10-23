import { useEffect } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import ProjectsShowcase from '../components/ProjectsShowcase.jsx';
import { profile, projects } from '../data/portfolio.js';

export default function ProjectsPage() {
  useEffect(() => {
    document.title = `Projects | ${profile.name}`;
  }, []);

  return (
    <section className="section page-top">
      <div className="container">
        <SectionHeading
          as="h1"
          eyebrow="All projects"
          title="Project archive"
          subtitle="Everything I've built so far. Filter by technology or sort by date and name."
        />
      </div>
      <ProjectsShowcase projects={projects} />
    </section>
  );
}
