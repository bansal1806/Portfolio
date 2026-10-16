import { useEffect } from 'react';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Skills from '../sections/Skills.jsx';
import Projects from '../sections/Projects.jsx';
import Timeline from '../sections/Timeline.jsx';
import Certifications from '../sections/Certifications.jsx';
import { profile } from '../data/portfolio.js';

export default function Home() {
  useEffect(() => {
    document.title = `${profile.name} | ${profile.roles[0]}`;
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Certifications />
    </>
  );
}
