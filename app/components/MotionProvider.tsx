"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global Framer Motion configuration.
 *
 * `reducedMotion="user"` makes Motion read the user's OS-level
 * prefers-reduced-motion setting and skip transform/layout animations
 * app-wide, while still allowing opacity fades. Paired with the CSS
 * media query in globals.css this covers both Motion and plain CSS.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
