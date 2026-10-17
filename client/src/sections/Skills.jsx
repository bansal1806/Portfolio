import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiLayout, FiServer, FiTool } from 'react-icons/fi';
import {
  SiReact, SiJavascript, SiHtml5, SiTailwindcss, SiFramer, SiNodedotjs, SiExpress, SiMongodb,
  SiJsonwebtokens, SiGit, SiPostman, SiVercel, SiFigma,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { TbApi } from 'react-icons/tb';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { skillGroups, proficiencyLabel } from '../data/portfolio.js';

const ICONS = { layout: FiLayout, server: FiServer, tool: FiTool };

const SKILL_LOGOS = {
  react: SiReact, javascript: SiJavascript, html: SiHtml5, tailwind: SiTailwindcss, framer: SiFramer,
  node: SiNodedotjs, express: SiExpress, mongodb: SiMongodb, api: TbApi, jwt: SiJsonwebtokens,
  git: SiGit, postman: SiPostman, vscode: VscVscode, vercel: SiVercel, figma: SiFigma,
};

/**
 * Decorative card header (adapted from a Uiverse.io card by Smit-Prajapati): a gradient panel whose
 * category icon glides to the corner on hover while three glass layers slide in from the
 * bottom-left, each carrying the logo of one of the group's strongest skills.
 */
function SkillArt({ icon: Icon, skills }) {
  const top = [...skills].sort((a, b) => b.level - a.level).filter((s) => SKILL_LOGOS[s.logo]).slice(0, 3);
  return (
    <div className="skill-art" aria-hidden="true">
      <span className="art-logo"><Icon /></span>
      {top.map((s, i) => {
        const Logo = SKILL_LOGOS[s.logo];
        return (
          <span key={s.name} className={`art-box art-box${i + 1}`}>
            <span className="art-icon" title={s.name}><Logo /></span>
          </span>
        );
      })}
      <span className="art-box art-box4" />
    </div>
  );
}

function RadialProgress({ value, inView }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="radial" role="img" aria-label={`Average proficiency ${value}%`}>
      <svg viewBox="0 0 64 64" width="64" height="64">
        <defs>
          <linearGradient id="radial-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--primary)' }} />
            <stop offset="1" style={{ stopColor: 'var(--accent)' }} />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r={r} className="radial-track" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          className="radial-value"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? circumference * (1 - value / 100) : circumference }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <span className="radial-label">{value}%</span>
    </div>
  );
}

function SkillBar({ name, level, index, inView }) {
  const label = proficiencyLabel(level);
  return (
    <li className="skill" tabIndex={0} aria-label={`${name}: ${label}, ${level}%`}>
      <div className="skill-top">
        <span className="skill-name">{name}</span>
        <span className="skill-level muted small">{level}%</span>
      </div>
      <div className="skill-track">
        <motion.div
          className="skill-fill"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${level}%` : 0 }}
          transition={{ duration: 1.1, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="tooltip" role="tooltip">
        {label} · {level}%
      </span>
    </li>
  );
}

function SkillCard({ group, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const Icon = ICONS[group.icon] ?? FiTool;
  const avg = Math.round(group.skills.reduce((s, k) => s + k.level, 0) / group.skills.length);

  return (
    <Reveal delay={index * 0.12} className={`skill-card card art-${index % 3}${inView ? ' in-view' : ''}`}>
      <SkillArt icon={Icon} skills={group.skills} />
      <div ref={ref} className="skill-card-body">
        <div className="skill-card-head">
          <h3>{group.category}</h3>
          <RadialProgress value={avg} inView={inView} />
        </div>
        <ul className="skill-list">
          {group.skills.map((s, i) => (
            <SkillBar key={s.name} {...s} index={i} inView={inView} />
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section alt">
      <div className="container">
        <SectionHeading
          eyebrow="Skills"
          title="My technical toolkit"
          subtitle="Hover or focus a skill to see my proficiency level."
        />
        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <SkillCard key={g.category} group={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
