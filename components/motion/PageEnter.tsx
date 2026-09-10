'use client';

import type { ReactNode } from 'react';

/**
 * Stable page wrapper — NEVER swap element types or gate on mount state.
 * Remounting children (div → motion.div, or ready-gate) causes the double page load
 * under the curtain. Enter soul comes from the route veil + pixelChoreography only.
 * Do not put transform on this wrapper (breaks Elementor fixed headers).
 */
export default function PageEnter({ children }: { children: ReactNode }) {
  return <div className="pixel-page-enter">{children}</div>;
}
