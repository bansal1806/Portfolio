import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  animate, easeInOut, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform,
} from 'framer-motion';
import signature from '../data/signature.json';

// signature.json is generated from the scanned signature (skeleton → ordered pen strokes):
//   inkPaths — the exact ink shapes (vector trace of the scan)
//   strokes  — centre-line pen strokes in writing order, used as a growing reveal mask
const PEN_SPEED = 1900; // px of stroke per second (in the 1254px source space)
const PEN_LIFT = 0.06; // pause between strokes, seconds
const MIN_STROKE = 0.12; // even tiny flicks take a moment

/** Timeline: when each stroke starts and ends while "signing". */
function useSchedule() {
  return useMemo(() => {
    let t = 0;
    const timings = signature.strokes.map((s) => {
      const duration = Math.max(MIN_STROKE, s.length / PEN_SPEED);
      const span = [t, t + duration];
      t += duration + PEN_LIFT;
      return span;
    });
    return { timings, total: t };
  }, []);
}

/** One mask stroke: its drawn length follows the shared clock between its start and end time. */
function MaskStroke({ d, clock, span, width, pathRef }) {
  const pathLength = useTransform(clock, span, [0, 1], { ease: easeInOut, clamp: true });
  const opacity = useTransform(clock, (t) => (t >= span[0] ? 1 : 0)); // hide the round cap dot before it starts
  return (
    <motion.path
      ref={pathRef}
      d={d}
      fill="none"
      stroke="#fff"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength, opacity }}
    />
  );
}

/**
 * The owner's signature, written out stroke by stroke with a glowing pen tip.
 * Click to sign again. Users who prefer reduced motion see the finished signature.
 */
export default function Signature({ className = '', delay = 0.9 }) {
  const id = useId().replace(/:/g, '');
  const ref = useRef(null);
  const strokeRefs = useRef([]);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const { timings, total } = useSchedule();
  const clock = useMotionValue(0);
  const [tip, setTip] = useState(null);
  const [x, y, w, h] = signature.viewBox;

  const sign = (wait = 0) => {
    clock.set(0);
    return animate(clock, total, { duration: total, delay: wait, ease: 'linear' });
  };

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      clock.set(total);
      return undefined;
    }
    const controls = sign(delay);
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  // Pen tip rides on the end of whichever stroke is currently being drawn.
  useMotionValueEvent(clock, 'change', (t) => {
    const i = timings.findIndex(([start, end]) => t >= start && t <= end);
    const path = strokeRefs.current[i];
    if (i === -1 || !path) {
      setTip(null);
      return;
    }
    const [start, end] = timings[i];
    const p = easeInOut((t - start) / (end - start));
    const point = path.getPointAtLength(p * path.getTotalLength());
    setTip({ x: point.x, y: point.y });
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`signature ${className}`}
      onClick={() => !reduceMotion && sign(0)}
      aria-label="My signature — click to watch me sign it again"
      title="Click to sign again"
    >
      <svg viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-ink`} gradientUnits="userSpaceOnUse" x1={x} y1={y + h} x2={x + w} y2={y}>
            <stop offset="0" style={{ stopColor: 'var(--primary)' }} />
            <stop offset="0.55" style={{ stopColor: '#a855f7' }} />
            <stop offset="1" style={{ stopColor: 'var(--accent)' }} />
          </linearGradient>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h}>
            {signature.strokes.map((s, i) => (
              <MaskStroke
                key={s.d}
                d={s.d}
                clock={clock}
                span={timings[i]}
                width={s.width ?? signature.maskWidth}
                pathRef={(el) => (strokeRefs.current[i] = el)}
              />
            ))}
          </mask>
        </defs>

        <g mask={`url(#${id}-mask)`} fill={`url(#${id}-ink)`}>
          {signature.inkPaths.map((d) => (
            <path key={d.slice(0, 40)} d={d} />
          ))}
        </g>

        {tip && <circle className="signature-tip" cx={tip.x} cy={tip.y} r="11" />}
      </svg>
    </button>
  );
}
