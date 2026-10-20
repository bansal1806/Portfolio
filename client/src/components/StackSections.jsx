import { Children, Fragment, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * "Stacking pages": every child section is position: sticky, so the next section slides UP
 * OVER the previous one like a deck of cards, while the covered one shrinks back, dims and
 * rounds its corners.
 *
 * Tall sections stick at `top = viewportHeight - sectionHeight` (a negative offset), so all
 * their content scrolls past before they pin and the next page slides over them.
 *
 * Because sticky sections stay pinned on screen, their own positions can't be used for
 * navigation. Each one gets a zero-height `[data-anchor]` marker at its natural position in
 * the page; ScrollManager and useActiveSection use those markers instead.
 *
 * Performance: one passive scroll listener, batched per animation frame, writing CSS
 * custom properties straight to the DOM (no React re-renders while scrolling).
 */
export default function StackSections({ ids, children }) {
  const itemRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    let frame = 0;

    // Where each section pins, and the point it shrinks toward (centre of its visible part).
    const layout = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const h = el.offsetHeight;
        el.style.top = `${Math.min(0, vh - h)}px`;
        el.style.transformOrigin = `50% ${Math.max(h - vh / 2, h / 2)}px`;
      });
      update();
    };

    // How far the NEXT section has slid over each one: 0 = not at all, 1 = fully covered.
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      els.forEach((el, i) => {
        const next = els[i + 1];
        const cover = next ? Math.min(Math.max(1 - next.getBoundingClientRect().top / vh, 0), 1) : 0;
        const c = reduceMotion ? 0 : cover;
        el.style.setProperty('--cover', c.toFixed(3));
        // Only transform while covered: any transform (even scale(1)) would become the containing
        // block for position: fixed descendants and trap overlays inside the section.
        el.style.transform = c > 0.001 ? `scale(${(1 - c * 0.07).toFixed(4)})` : '';
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    layout();
    const ro = new ResizeObserver(layout); // content changes height (filters, images, fonts…)
    els.forEach((el) => ro.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', layout);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', layout);
    };
  }, [reduceMotion, items.length]);

  return (
    <div className="stack">
      {/* Anchors and sections must be direct siblings: a sticky element only pins within its parent. */}
      {items.map((child, i) => (
        <Fragment key={ids[i]}>
          <span className="stack-anchor" data-anchor={ids[i]} aria-hidden="true" />
          <div className="stack-item" ref={(el) => (itemRefs.current[i] = el)} style={{ zIndex: i + 1 }}>
            {child}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
