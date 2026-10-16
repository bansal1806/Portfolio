import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { profile } from '../data/portfolio.js';

export default function SocialLinks({ className = '' }) {
  const links = [
    { href: profile.socials.github, label: 'GitHub', Icon: FiGithub },
    { href: profile.socials.linkedin, label: 'LinkedIn', Icon: FiLinkedin },
    { href: `mailto:${profile.email}`, label: 'Email', Icon: FiMail },
  ];

  return (
    <div className={`socials ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          className="icon-btn"
          aria-label={label}
          title={label}
          {...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
