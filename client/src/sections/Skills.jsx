import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  SiReact, SiJavascript, SiHtml5, SiTailwindcss, SiFramer, SiNodedotjs, SiExpress, SiMongodb,
  SiJsonwebtokens, SiGit, SiPostman, SiVercel, SiFigma,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { TbApi } from 'react-icons/tb';
import { FiBarChart2, FiList } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { skillGroups, proficiencyLabel } from '../data/portfolio.js';

const SKILL_LOGOS = {
  react: SiReact, javascript: SiJavascript, html: SiHtml5, tailwind: SiTailwindcss, framer: SiFramer,
  node: SiNodedotjs, express: SiExpress, mongodb: SiMongodb, api: TbApi, jwt: SiJsonwebtokens,
  git: SiGit, postman: SiPostman, vscode: VscVscode, vercel: SiVercel, figma: SiFigma,
};

// Proficiency tiers, low → high. Same cut-offs as proficiencyLabel in data/portfolio.js.
const TIERS = [
  { label: 'Beginner', range: '< 55' },
  { label: 'Intermediate', range: '55–69' },
  { label: 'Proficient', range: '70–84' },
  { label: 'Advanced', range: '85+' },
];

// Each area keeps its color slot whatever the filter (color follows the area, never its rank).
// Slots are --viz-1..3 in sections.css, validated for colorblind separation in both themes.
const AREAS = skillGroups.map((g, i) => ({ name: g.category, slot: i + 1 }));
const ALL_SKILLS = skillGroups.flatMap((g, gi) => g.skills.map((s) => ({ ...s, area: g.category, slot: gi + 1 })));

const EASE = [0.22, 1, 0.36, 1];

/** Number that counts up from 0 the first time it scrolls into view. */
function CountUp({ value, suffix = '', inView }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setShown(value);
      return undefined;
    }
    const controls = animate(shown, value, { duration: 1, ease: EASE, onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
    // `shown` is left out on purpose: each change animates from the number on screen now.
  }, [value, inView, reduce]);

  return (
    <>
      {shown}
      {suffix}
    </>
  );
}

/** One shared tooltip per chart: shows on hover and on keyboard focus. Value first, label second. */
function useTooltip() {
  const [tip, setTip] = useState(null);
  const box = useRef(null);

  const show = (e, content) => {
    const rect = box.current.getBoundingClientRect();
    // Keyboard focus has no pointer position: anchor to the focused element instead.
    const src = e.clientX != null && e.type !== 'focus' ? { x: e.clientX, y: e.clientY } : null;
    const el = e.currentTarget.getBoundingClientRect();
    const x = (src ? src.x : el.left + el.width / 2) - rect.left;
    const y = (src ? src.y : el.top) - rect.top;
    setTip({ x: Math.min(Math.max(x, 70), rect.width - 70), y, content });
  };
  const hide = () => setTip(null);

  const node = (
    <AnimatePresence>
      {tip && (
        <motion.div
          className="viz-tip"
          role="tooltip"
          style={{ left: tip.x, top: tip.y }}
          // Opacity only: the CSS transform places the tooltip above the pointer.
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {tip.content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { box, show, hide, node };
}

/** Horizontal bars, strongest first. Bars grow from the baseline; filtering re-ranks with a glide. */
function RankedBars({ skills, inView }) {
  const tip = useTooltip();
  const { hide } = tip;
  useEffect(hide, [skills]); // a filter change can remove the hovered bar
  const ticks = [0, 25, 50, 75, 100];

  return (
    <figure className="viz-card viz-bars">
      <figcaption>
        <h3 className="viz-title">Skills ranked by proficiency</h3>
        <p className="viz-sub">Self-assessed, 0–100</p>
      </figcaption>

      <div className="bars-plot" ref={tip.box}>
        {/* Hairline grid behind the bars, aligned with the axis labels below. */}
        <div className="bars-grid" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} style={{ left: `${t}%` }} />
          ))}
        </div>

        <motion.ul className="bars-list" layout>
          <AnimatePresence initial={false}>
            {skills.map((s, i) => {
              const Logo = SKILL_LOGOS[s.logo];
              const tier = proficiencyLabel(s.level);
              const content = (
                <>
                  <strong>{s.level}%</strong>
                  <span>
                    <i className={`viz-key s${s.slot}`} /> {s.name} · {tier}
                  </span>
                </>
              );
              return (
                <motion.li
                  key={s.name}
                  layout
                  className="bar-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  tabIndex={0}
                  aria-label={`${s.name}, ${s.area}: ${s.level}%, ${tier}`}
                  onPointerMove={(e) => tip.show(e, content)}
                  onPointerLeave={tip.hide}
                  onFocus={(e) => tip.show(e, content)}
                  onBlur={tip.hide}
                >
                  <span className="bar-label">
                    {Logo && <Logo aria-hidden="true" className="bar-logo" />}
                    <span className="bar-name">{s.name}</span>
                  </span>
                  <span className="bar-track">
                    <motion.span
                      className={`bar-fill s${s.slot}`}
                      initial={{ width: 0 }}
                      animate={{ width: inView ? `${s.level}%` : 0 }}
                      transition={{ duration: 1, delay: inView ? 0.1 + i * 0.05 : 0, ease: EASE }}
                    />
                    <motion.span
                      className="bar-value"
                      initial={{ left: 0, opacity: 0 }}
                      animate={{ left: inView ? `${s.level}%` : 0, opacity: inView ? 1 : 0 }}
                      transition={{ duration: 1, delay: inView ? 0.1 + i * 0.05 : 0, ease: EASE }}
                    >
                      {s.level}
                    </motion.span>
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>

        <div className="bars-axis" aria-hidden="true">
          <span className="bar-label" />
          <span className="bars-ticks">
            {ticks.map((t) => (
              <span key={t} style={{ left: `${t}%` }}>{t}</span>
            ))}
          </span>
        </div>
        {tip.node}
      </div>
    </figure>
  );
}

/** Stacked columns: how many skills sit at each proficiency tier, split by area. */
function TierColumns({ skills, areas, inView }) {
  const tip = useTooltip();
  const { hide } = tip;
  useEffect(hide, [skills]); // a filter change can remove the hovered segment
  const columns = TIERS.map((t) => ({
    ...t,
    stacks: areas
      .map((a) => ({ ...a, skills: skills.filter((s) => s.area === a.name && proficiencyLabel(s.level) === t.label) }))
      .filter((st) => st.skills.length > 0),
  }));
  const max = Math.max(4, ...columns.map((c) => c.stacks.reduce((n, st) => n + st.skills.length, 0)));
  const step = max > 6 ? 2 : 1;
  const yTicks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);

  return (
    <figure className="viz-card viz-tiers">
      <figcaption>
        <h3 className="viz-title">Skills per proficiency level</h3>
        <p className="viz-sub">Number of skills, by area</p>
      </figcaption>

      <div className="tiers-plot" ref={tip.box}>
        <div className="tiers-y" aria-hidden="true">
          {yTicks.map((t) => (
            <span key={t} style={{ bottom: `${(t / max) * 100}%` }}>{t}</span>
          ))}
        </div>
        <div className="tiers-area">
          <div className="tiers-grid" aria-hidden="true">
            {yTicks.map((t) => (
              <span key={t} style={{ bottom: `${(t / max) * 100}%` }} />
            ))}
          </div>
          {columns.map((c, ci) => {
            const total = c.stacks.reduce((n, st) => n + st.skills.length, 0);
            return (
              <div key={c.label} className="tier-col">
                <div className="tier-stack">
                  {total > 0 && (
                    <motion.span
                      className="tier-total"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: inView ? 1 : 0, bottom: `${(total / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: inView ? 0.5 + ci * 0.1 : 0, ease: EASE }}
                    >
                      {total}
                    </motion.span>
                  )}
                  {c.stacks.map((st, si) => {
                    const content = (
                      <>
                        <strong>
                          {st.skills.length} {st.skills.length === 1 ? 'skill' : 'skills'}
                        </strong>
                        <span>
                          <i className={`viz-key s${st.slot}`} /> {st.name} · {c.label}
                        </span>
                        <span className="viz-tip-list">{st.skills.map((s) => s.name).join(', ')}</span>
                      </>
                    );
                    return (
                      <motion.span
                        key={st.name}
                        className={`tier-seg s${st.slot}${si === c.stacks.length - 1 ? ' top' : ''}`}
                        tabIndex={0}
                        aria-label={`${c.label}, ${st.name}: ${st.skills.length} (${st.skills.map((s) => s.name).join(', ')})`}
                        initial={{ height: 0 }}
                        animate={{ height: inView ? `${(st.skills.length / max) * 100}%` : 0 }}
                        transition={{ duration: 0.8, delay: inView ? 0.3 + ci * 0.1 + si * 0.08 : 0, ease: EASE }}
                        onPointerMove={(e) => tip.show(e, content)}
                        onPointerLeave={tip.hide}
                        onFocus={(e) => tip.show(e, content)}
                        onBlur={tip.hide}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="tiers-x" aria-hidden="true">
          {columns.map((c) => (
            <span key={c.label}>
              {c.label}
              <small>{c.range}</small>
            </span>
          ))}
        </div>
        {tip.node}
      </div>
    </figure>
  );
}

/** Accessible equivalent of both charts. */
function SkillsTable({ skills }) {
  return (
    <div className="viz-card viz-table-wrap">
      <table className="viz-table">
        <caption className="visually-hidden">Skills and proficiency levels</caption>
        <thead>
          <tr>
            <th scope="col">Skill</th>
            <th scope="col">Area</th>
            <th scope="col" className="num">Level</th>
            <th scope="col">Tier</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.name}>
              <th scope="row">{s.name}</th>
              <td>
                <i className={`viz-key s${s.slot}`} aria-hidden="true" /> {s.area}
              </td>
              <td className="num">{s.level}%</td>
              <td>{proficiencyLabel(s.level)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Skills() {
  const [area, setArea] = useState('All');
  const [view, setView] = useState('chart');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const areas = area === 'All' ? AREAS : AREAS.filter((a) => a.name === area);
  const skills = useMemo(
    () => ALL_SKILLS.filter((s) => area === 'All' || s.area === area).sort((a, b) => b.level - a.level || a.name.localeCompare(b.name)),
    [area]
  );
  const avg = Math.round(skills.reduce((n, s) => n + s.level, 0) / skills.length);
  const advanced = skills.filter((s) => proficiencyLabel(s.level) === 'Advanced').length;
  const top = skills[0];

  return (
    <section id="skills" className="section alt">
      <div className="container">
        <SectionHeading
          eyebrow="Skills"
          title="My technical toolkit"
          subtitle="Every skill, ranked. Filter by area and hover or focus a bar for details."
        />

        <Reveal>
          <div ref={ref} className="viz">
            {/* One control row scopes everything below it. */}
            <div className="viz-controls">
              <div className="chips" role="group" aria-label="Filter skills by area">
                {['All', ...AREAS.map((a) => a.name)].map((name) => {
                  const slot = AREAS.find((a) => a.name === name)?.slot;
                  return (
                    <button key={name} type="button" className="chip" aria-pressed={area === name} onClick={() => setArea(name)}>
                      {slot && <i className={`viz-key s${slot}`} aria-hidden="true" />}
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="viz-view" role="group" aria-label="Display as">
                <button type="button" aria-pressed={view === 'chart'} onClick={() => setView('chart')}>
                  <FiBarChart2 aria-hidden="true" /> Charts
                </button>
                <button type="button" aria-pressed={view === 'table'} onClick={() => setView('table')}>
                  <FiList aria-hidden="true" /> Table
                </button>
              </div>
            </div>

            <div className="viz-stats">
              <div className="viz-stat">
                <span className="viz-stat-label">Skills</span>
                <span className="viz-stat-value"><CountUp value={skills.length} inView={inView} /></span>
              </div>
              <div className="viz-stat">
                <span className="viz-stat-label">Average proficiency</span>
                <span className="viz-stat-value"><CountUp value={avg} suffix="%" inView={inView} /></span>
              </div>
              <div className="viz-stat">
                <span className="viz-stat-label">Advanced (85+)</span>
                <span className="viz-stat-value"><CountUp value={advanced} inView={inView} /></span>
              </div>
              <div className="viz-stat">
                <span className="viz-stat-label">Strongest</span>
                <span className="viz-stat-value viz-stat-text">{top.name}</span>
              </div>
            </div>

            {view === 'chart' ? (
              <>
                {area === 'All' && (
                  <ul className="viz-legend" aria-label="Areas">
                    {AREAS.map((a) => (
                      <li key={a.name}>
                        <i className={`viz-swatch s${a.slot}`} aria-hidden="true" /> {a.name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="viz-charts">
                  <RankedBars skills={skills} inView={inView} />
                  <TierColumns skills={skills} areas={areas} inView={inView} />
                </div>
              </>
            ) : (
              <SkillsTable skills={skills} />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
