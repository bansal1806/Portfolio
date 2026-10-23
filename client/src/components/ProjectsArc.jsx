import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import SitePreview from './SitePreview.jsx';

const SPEED = 45; // auto-scroll speed, px per second at the center
const CENTER_SCALE = 1.12; // the middle card is drawn this much bigger than its base size
const EDGE_SCALE = 0.6; // size of the cards at the screen edges
const EDGE_ANGLE = 75; // how far round the cylinder (degrees) the screen edges are
const TURN_RATIO = 0.6; // cards turn this share of their angle on the cylinder (1 = fully)
const GAP_PX = 15; // exact on-screen gap between neighboring cards
const SHADOW_ROOM = 80; // px kept free above and below the cards, see setHeight
const PERSPECTIVE = 1600; // keep in sync with .arc-stage perspective in sections.css

// The cards wrap the outside of a cylinder: `u` = distance from the middle in cards
// (fractional while moving) and `step` = degrees of the cylinder per card. Size and turn follow
// the cosine of the angle, so they barely change near the middle (a rounded C, no point) and
// roll off smoothly toward the edges.
const DEPTH = (1 - EDGE_SCALE / CENTER_SCALE) / (1 - Math.cos((EDGE_ANGLE * Math.PI) / 180));
const angleAt = (u, step) => Math.max(-EDGE_ANGLE, Math.min(EDGE_ANGLE, u * step));
const scaleAt = (u, step) => CENTER_SCALE * (1 - DEPTH * (1 - Math.cos((angleAt(u, step) * Math.PI) / 180)));
const turnAt = (u, step) => angleAt(u, step) * TURN_RATIO;

/**
 * Projects on an endless strip spanning the full screen width, wrapped round the outside of a
 * cylinder: every card's center is on the same horizontal line, the middle card is biggest, and
 * cards get smaller and turn away in a smooth curve toward the edges. Each frame, cards are chained outward from the middle one: every
 * card is placed from its neighbor's real on-screen edge (turn and perspective included), so
 * neighbors are always exactly GAP_PX apart and never overlap. It drifts on its own, pauses
 * on hover/focus, and can be dragged or stepped with the arrow buttons. Only the first copy
 * of each card is focusable; the loop fillers are hidden from assistive tech.
 */

// On-screen edges of a card centered at x (relative to the stage middle, which is also the
// perspective origin), with half-width h after scaling and turn t (radians, + = right edge back).
const rightEdge = (x, h, t) => ((x + h * Math.cos(t)) * PERSPECTIVE) / (PERSPECTIVE + h * Math.sin(t));
const leftEdge = (x, h, t) => ((x - h * Math.cos(t)) * PERSPECTIVE) / (PERSPECTIVE - h * Math.sin(t));
// Inverses: the center x that puts a card's left (or right) edge at screen position e.
const xForLeftEdge = (e, h, t) => (e * (PERSPECTIVE - h * Math.sin(t))) / PERSPECTIVE + h * Math.cos(t);
const xForRightEdge = (e, h, t) => (e * (PERSPECTIVE + h * Math.sin(t))) / PERSPECTIVE - h * Math.cos(t);
const rad = (deg) => (deg * Math.PI) / 180;

export default function ProjectsArc({ projects }) {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const [copies, setCopies] = useState(2);
  const [height, setHeight] = useState(420);
  const [dragging, setDragging] = useState(false);

  // Mutable animation state, kept out of React so frames don't re-render.
  const s = useRef({ offset: 0, target: null, velocity: 0, hover: false, focus: false, drag: null, moved: 0, inView: true, layout: null });

  const n = projects.length;
  const total = n * copies;

  // Measure the stage and card, then derive the curve and how many loop copies are needed.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const card = cardRefs.current[0];
    if (!stage || !card) return;
    const width = stage.clientWidth;
    const cardW = card.offsetWidth;
    const cardH = card.offsetHeight;
    // Track px per card, so dragging moves the middle card roughly 1:1 with the pointer.
    const spacing = cardW * CENTER_SCALE;
    // Pick the degrees-per-card that makes the chain reach the screen edge right at EDGE_ANGLE,
    // so the curve fits any screen width. More degrees per card = smaller cards = more cards.
    const reach = (step) => {
      let right = rightEdge(0, (cardW * scaleAt(0, step)) / 2, 0);
      let u = 0;
      while (right < width / 2 && u < 200) {
        u += 1;
        const h = (cardW * scaleAt(u, step)) / 2;
        const t = rad(turnAt(u, step));
        right = rightEdge(xForLeftEdge(right + GAP_PX, h, t), h, t);
      }
      return u * step;
    };
    let lo = 1;
    let hi = EDGE_ANGLE;
    for (let k = 0; k < 30; k++) {
      const mid = (lo + hi) / 2;
      if (reach(mid) >= EDGE_ANGLE) hi = mid;
      else lo = mid;
    }
    const step = hi;
    // Enough cards to fill half the screen even at the smallest size, on both sides, plus one.
    const perSide = Math.ceil(width / 2 / (cardW * EDGE_SCALE * Math.cos(rad(EDGE_ANGLE * TURN_RATIO)))) + 1;
    s.current.layout = { width, cardW, spacing, perSide, step };
    setCopies(Math.max(2, Math.ceil((2 * perSide + 1) / n)));
    // Extra room above and below the cards: the stage's edge-fade mask also cuts off anything
    // outside the stage box, so the card shadows (and the hover lift) must fit inside it.
    setHeight(cardH * CENTER_SCALE + SHADOW_ROOM * 2);
  }, [n]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [measure]);

  // Pause while scrolled off screen.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => (s.current.inView = entry.isIntersecting));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // Animation loop: move the offset, then place every card on the curve.
  useEffect(() => {
    let frame;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = s.current;
      const L = st.layout;

      if (L && st.inView) {
        const loop = total * L.spacing;

        if (st.target != null) {
          // Easing toward a chosen card (arrow buttons / keyboard focus).
          const diff = st.target - st.offset;
          st.offset += diff * Math.min(1, dt * 8);
          if (Math.abs(diff) < 0.5) st.target = null;
        } else if (!st.drag) {
          st.offset += st.velocity * dt; // throw momentum after a drag
          st.velocity *= Math.pow(0.04, dt);
          if (Math.abs(st.velocity) < 5) st.velocity = 0;
          if (!reduceMotion && !st.hover && !st.focus && st.velocity === 0) st.offset += SPEED * dt;
        }

        const half = (u) => (L.cardW * scaleAt(u, L.step)) / 2;
        const place = (i, u, x, show) => {
          const el = cardRefs.current[i];
          if (!el) return;
          if (!show) {
            el.style.visibility = 'hidden';
            return;
          }
          el.style.visibility = 'visible';
          el.style.transform = `translate3d(calc(-50% + ${x}px), -50%, 0) rotateY(${turnAt(u, L.step)}deg) scale(${scaleAt(u, L.step)})`;
          el.style.zIndex = String(1000 - Math.round(Math.abs(u) * 10));
        };

        // Anchor: the card within half a card of the middle. Its slot positions u differ by
        // exactly 1 from its neighbors, so the chain below walks outward card by card.
        // u of card i is i + raw (wrapped). Same mapping as centerOn/step: card i is centered
        // when offset = i * spacing, so offset 0 (the start) centers the first card.
        const raw = ((((-st.offset) % loop) + loop) % loop) / L.spacing;
        let a = Math.round(-raw) % total; // index whose u is nearest 0
        if (a < 0) a += total;
        let ua = ((a + raw) % total + total) % total;
        if (ua > total / 2) ua -= total;
        // Anchor x: by symmetry the anchor at u = ±0.5 must sit where it meets its mirror image
        // with the gap centered on the middle; scale linearly in between.
        const hHalf = half(0.5);
        const tHalf = rad(turnAt(0.5, L.step));
        const xa = 2 * ua * xForLeftEdge(GAP_PX / 2, hHalf, tHalf);
        place(a, ua, xa, true);

        const edge = L.width / 2;
        const shown = new Set([a]);
        // Rightward chain.
        let right = rightEdge(xa, half(ua), rad(turnAt(ua, L.step)));
        for (let j = 1; j <= L.perSide && j < total / 2; j++) {
          const i = (a + j) % total;
          const u = ua + j;
          const h = half(u);
          const t = rad(turnAt(u, L.step));
          const x = xForLeftEdge(right + GAP_PX, h, t);
          const visible = right + GAP_PX < edge;
          place(i, u, x, visible);
          if (visible) shown.add(i);
          right = rightEdge(x, h, t);
        }
        // Leftward chain.
        let left = leftEdge(xa, half(ua), rad(turnAt(ua, L.step)));
        for (let j = 1; j <= L.perSide && j < total / 2; j++) {
          const i = (((a - j) % total) + total) % total;
          if (shown.has(i)) break;
          const u = ua - j;
          const h = half(u);
          const t = rad(turnAt(u, L.step));
          const x = xForRightEdge(left - GAP_PX, h, t);
          const visible = left - GAP_PX > -edge;
          place(i, u, x, visible);
          if (visible) shown.add(i);
          left = leftEdge(x, h, t);
        }
        // Everything else is off screen.
        for (let i = 0; i < total; i++) if (!shown.has(i)) place(i, 0, 0, false);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total, reduceMotion]);

  // Offset that puts card `i` (any copy) closest to the center from where we are now.
  const centerOn = (i) => {
    const st = s.current;
    const L = st.layout;
    if (!L) return;
    const loop = total * L.spacing;
    const base = i * L.spacing;
    const k = Math.round((st.offset - base) / loop);
    st.velocity = 0;
    st.target = base + k * loop;
  };

  const step = (dir) => {
    const st = s.current;
    const L = st.layout;
    if (!L) return;
    // Index of the card nearest the center, then move one card along.
    const nearest = Math.round(st.offset / L.spacing);
    st.velocity = 0;
    st.target = (nearest + dir) * L.spacing;
  };

  // Drag with mouse or touch. Window listeners (not pointer capture) so link clicks still work.
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const st = s.current;
    st.drag = { x: e.clientX, time: performance.now() };
    st.moved = 0;
    st.target = null;
    st.velocity = 0;

    const onMove = (ev) => {
      const dx = ev.clientX - st.drag.x;
      const now = performance.now();
      st.offset -= dx;
      st.moved += Math.abs(dx);
      st.velocity = (-dx / Math.max(now - st.drag.time, 1)) * 1000;
      st.drag = { x: ev.clientX, time: now };
      if (st.moved > 6) setDragging(true);
    };
    const onUp = () => {
      st.drag = null;
      setDragging(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // A drag shouldn't count as a click on the card under the cursor.
  const onClickCapture = (e) => {
    if (s.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="arc">
      <div
        ref={stageRef}
        className={`arc-stage${dragging ? ' dragging' : ''}`}
        style={{ height }}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        onPointerEnter={(e) => e.pointerType === 'mouse' && (s.current.hover = true)}
        onPointerLeave={() => (s.current.hover = false)}
        onFocus={() => (s.current.focus = true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && (s.current.focus = false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
      >
        {Array.from({ length: total }, (_, i) => {
          const p = projects[i % n];
          const filler = i >= n;
          return (
            <div key={i} ref={(el) => (cardRefs.current[i] = el)} className="arc-card" aria-hidden={filler || undefined}>
              {/* Focus anywhere in the card (link or buttons) brings it to the middle. */}
              <div className="arc-inner" onFocus={() => centerOn(i)}>
                <Link to={`/projects/${p.slug}`} className="arc-link" tabIndex={filler ? -1 : undefined} draggable={false}>
                  {/* Same mini browser as the grid cards: the screenshot scrolls top → bottom on hover. */}
                  <span className="arc-shot">
                    <SitePreview url={p.live} image={p.preview} title={p.name} />
                    {p.year && <span className="project-year arc-year">{p.year}</span>}
                  </span>
                  <span className="arc-body">
                    <span className="arc-title">{p.name}</span>
                    <span className="arc-tech">{p.tech.slice(0, 3).join(' · ')}</span>
                  </span>
                </Link>
                {/* Siblings of the card link, not inside it: links can't be nested. */}
                <div className="arc-actions">
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="arc-action"
                      aria-label={`${p.name} live site`}
                      title="Live site"
                      tabIndex={filler ? -1 : undefined}
                      draggable={false}
                    >
                      <FiExternalLink aria-hidden="true" />
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="arc-action"
                      aria-label={`${p.name} code on GitHub`}
                      title="Code on GitHub"
                      tabIndex={filler ? -1 : undefined}
                      draggable={false}
                    >
                      <FiGithub aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="arc-nav">
        <button type="button" className="arc-btn" onClick={() => step(-1)} aria-label="Previous project">
          <FiChevronLeft aria-hidden="true" />
        </button>
        <span className="muted small">Drag or use the arrows to explore</span>
        <button type="button" className="arc-btn" onClick={() => step(1)} aria-label="Next project">
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
