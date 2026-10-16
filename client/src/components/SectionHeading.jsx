import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, subtitle, as: Tag = 'h2' }) {
  return (
    <Reveal className="section-head">
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <Tag className="section-title">{title}</Tag>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </Reveal>
  );
}
