import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';

// Undated projects (year: null) always sort after dated ones.
const byYear = (dir) => (a, b) => (a.year == null) - (b.year == null) || dir * ((a.year ?? 0) - (b.year ?? 0));

const SORTS = {
  newest: { label: 'Newest first', fn: byYear(-1) },
  oldest: { label: 'Oldest first', fn: byYear(1) },
  name: { label: 'Name (A–Z)', fn: (a, b) => a.name.localeCompare(b.name) },
};

/** Project grid with technology filter chips and a sort dropdown. */
export default function ProjectsShowcase({ projects }) {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');

  // Most-used technologies first so the important filters come up front.
  const techs = useMemo(() => {
    const counts = {};
    projects.forEach((p) => p.tech.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return ['All', ...Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))];
  }, [projects]);

  const visible = useMemo(
    () => projects.filter((p) => filter === 'All' || p.tech.includes(filter)).sort(SORTS[sort].fn),
    [projects, filter, sort]
  );

  return (
    <>
      <div className="project-controls">
        <div className="chips" role="group" aria-label="Filter projects by technology">
          {techs.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>
        <label className="sort">
          <span className="visually-hidden">Sort projects</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="muted small results-count" aria-live="polite">
        Showing {visible.length} of {projects.length} projects
      </p>

      <motion.div layout className="projects-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
