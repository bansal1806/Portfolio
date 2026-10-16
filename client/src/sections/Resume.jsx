import { FiFileText } from 'react-icons/fi';
import Reveal from '../components/Reveal.jsx';
import CVButtons from '../components/CVButtons.jsx';

export default function Resume() {
  return (
    <section id="resume" className="section resume-section">
      <div className="container">
        <Reveal className="resume-card">
          <span className="resume-icon"><FiFileText aria-hidden="true" /></span>
          <div className="resume-text">
            <h2>Grab a copy of my resume</h2>
            <p>Available as a PDF for quick reading or a Word document if you need to edit it. Both are served straight from my Node.js API.</p>
          </div>
          <CVButtons className="resume-buttons" />
        </Reveal>
      </div>
    </section>
  );
}
