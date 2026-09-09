'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Opacity-only enter. NEVER animate transform/will-change:transform here —
 * that creates a containing block and breaks Elementor position:fixed headers
 * (scroll jitter / header drifting with the page).
 */
export default function PageEnter({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className="pixel-page-enter">{children}</div>;

  return (
    <motion.div
      className="pixel-page-enter"
      initial={{ opacity: 0.28 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
