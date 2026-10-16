import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the #hash target after navigation, or to the top on a plain route change. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    // Wait a frame so the target section has rendered after a route change.
    const id = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}
