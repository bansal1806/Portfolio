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
    // Defer so the target section has rendered after a route change and the
    // mobile menu has started collapsing (which would otherwise cancel the scroll).
    const id = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(id);
  }, [pathname, hash]);

  return null;
}
