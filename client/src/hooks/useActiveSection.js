import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently in the middle of the viewport.
 * Re-subscribes when `enabled` or the list of ids changes (e.g. on route change).
 */
export default function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState('');
  const key = ids.join(',');

  useEffect(() => {
    if (!enabled) {
      setActive('');
      return undefined;
    }
    const sections = key.split(',').map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    // A thin band across the middle of the screen decides which section is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [key, enabled]);

  return active;
}
