import { motion } from 'framer-motion';

const OFFSETS = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -50 },
  right: { x: 50 },
  none: {},
};

/** Fades + slides its children in the first time they scroll into view. */
export default function Reveal({ children, direction = 'up', delay = 0, duration = 0.6, as = 'div', className, ...rest }) {
  const Component = motion[as] ?? motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...OFFSETS[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
