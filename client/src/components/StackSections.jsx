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
/**
 * Exit effects: how a section leaves while the next page slides over it.
 * Each gets e = eased cover progress (0 → 1) and the viewport height, and returns styles.
 * `origin` picks the pivot inside the part of the section that is on screen.
 */
const EFFECTS = {
  // Intro scene: zoom forward and blur away (one screen tall, so the blur stays cheap).
  zoom: (e) => ({ transform: `scale(${1 + 0.14 * e})`, filter: `blur(${(6 * e).toFixed(2)}px)`, opacity: 1 - 0.65 * e, veil: 0.15, radius: 0 }),
  // Classic card stack: shrink back and dim.
  stack: (e) => ({ transform: `scale(${1 - 0.07 * e})`, veil: 0.55, radius: 32 }),
  // Lay the page back on a desk.
  tilt: (e) => ({ transform: `perspective(1400px) rotateX(${24 * e}deg) scale(${1 - 0.06 * e})`, origin: 'bottom', veil: 0.5, radius: 28 }),
  // Swing away sideways like switching browser tabs.
  swipe: (e) => ({ transform: `perspective(1600px) translateX(${-10 * e}%) rotateY(${16 * e}deg) scale(${1 - 0.08 * e})`, origin: 'left', veil: 0.45, radius: 28 }),
  // Fade into the past: drift up, lose colour.
  past: (e, vh) => ({ transform: `translateY(${-0.08 * vh * e}px) scale(${1 - 0.05 * e})`, filter: `grayscale(${e.toFixed(3)})`, opacity: 1 - 0.45 * e, veil: 0.3, radius: 24 }),
  // Drop onto a pile of certificates.
  pile: (e, vh) => ({ transform: `translateY(${0.04 * vh * e}px) rotate(${-4 * e}deg) scale(${1 - 0.14 * e})`, veil: 0.5, radius: 24 }),
  // Fold back like a sheet of paper, hinged at the top.
  fold: (e) => ({ transform: `perspective(1200px) rotateX(${48 * e}deg) scale(${1 - 0.04 * e})`, origin: 'top', veil: 0.6, radius: 20 }),
};

const smooth = (t) => t * t * (3 - 2 * t); // ease in-out
const ENTER_RADIUS = 36; // incoming pages arrive with rounded top corners that flatten as they settle

export default function StackSections({ ids, effects = [], children }) {
  const itemRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    let frame = 0;

    // Where each section pins, and the point it shrinks toward (centre of its visible part).
    let heights = [];
    const layout = () => {
      const vh = window.innerHeight;
      heights = els.map((el) => el.offsetHeight);
      els.forEach((el, i) => {
        el.style.top = `${Math.min(0, vh - heights[i])}px`;
      });
      update();
    };

    // Pivot point inside the on-screen part of a (possibly tall, pinned) section.
    const originFor = (where, h, vh) => {
      const visibleTop = Math.max(h - vh, 0);
      if (where === 'bottom') return `50% ${h}px`;
      if (where === 'top') return `50% ${visibleTop}px`;
      if (where === 'left') return `0% ${visibleTop + Math.min(h, vh) / 2}px`;
      return `50% ${visibleTop + Math.min(h, vh) / 2}px`;
    };

    // How far the NEXT section has slid over each one: 0 = not at all, 1 = fully covered.
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const covers = els.map((el, i) => {
        const next = els[i + 1];
        const cover = next ? Math.min(Math.max(1 - next.getBoundingClientRect().top / vh, 0), 1) : 0;
        return reduceMotion ? 0 : cover;
      });
      els.forEach((el, i) => {
        const c = covers[i];
        const enter = i > 0 ? covers[i - 1] : 1; // how far this page has slid in over the previous one
        const style = el.style;
        if (c > 0.001) {
          const fx = (EFFECTS[effects[i]] ?? EFFECTS.stack)(smooth(c), vh);
          // Transforms only while animating: any transform (even scale(1)) becomes the containing
          // block for position: fixed descendants and would trap overlays inside the section.
          style.transform = fx.transform ?? '';
          style.transformOrigin = originFor(fx.origin, heights[i], vh);
          style.filter = fx.filter ?? '';
          style.opacity = fx.opacity != null ? fx.opacity.toFixed(3) : '';
          style.borderRadius = `${(fx.radius ?? 0) * c}px`;
          style.setProperty('--veil', ((fx.veil ?? 0.5) * c).toFixed(3));
        } else {
          style.transform = '';
          style.filter = '';
          style.opacity = '';
          style.setProperty('--veil', '0');
          const r = !reduceMotion && enter > 0 && enter < 0.999 ? (1 - smooth(enter)) * ENTER_RADIUS : 0;
          style.borderRadius = r ? `${r}px ${r}px 0 0` : '';
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, items.length, effects.join()]);

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
