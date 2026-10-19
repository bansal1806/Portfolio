import { useEffect } from 'react';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Skills from '../sections/Skills.jsx';
import Projects from '../sections/Projects.jsx';
import Timeline from '../sections/Timeline.jsx';
import Certifications from '../sections/Certifications.jsx';
import Resume from '../sections/Resume.jsx';
import Contact from '../sections/Contact.jsx';
import StackSections from '../components/StackSections.jsx';
import { profile } from '../data/portfolio.js';

// Section ids, in order — used for the stacking anchors (nav links, scroll-spy).
const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'journey', 'certifications', 'resume', 'contact'];
// How each section leaves as the next page slides over it (see EFFECTS in StackSections).
const SECTION_EFFECTS = ['zoom', 'stack', 'tilt', 'swipe', 'past', 'pile', 'fold', null];

export default function Home() {
  useEffect(() => {
    document.title = `${profile.name} | ${profile.roles[0]}`;
  }, []);

  return (
    <StackSections ids={SECTION_IDS} effects={SECTION_EFFECTS}>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Certifications />
      <Resume />
      <Contact />
    </StackSections>
  );
}
