import { useEffect, useState } from 'react';

/**
 * Returns the id of the section the visitor is currently on: the last section whose anchor has
 * scrolled past the middle of the viewport.
 *
 * On the home page sections are stacked sticky "pages" that stay pinned on screen, so their
 * own boxes never leave the viewport; we measure their `[data-anchor]` markers (natural
 * positions) instead, falling back to the element with that id.
 */
export default function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState('');
  const key = ids.join(',');

  useEffect(() => {
    if (!enabled) {
      setActive('');
      return undefined;
    }
    const list = key.split(',');
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current = '';
      list.forEach((id) => {
        const el = document.querySelector(`[data-anchor="${CSS.escape(id)}"]`) ?? document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key, enabled]);

  return active;
}
