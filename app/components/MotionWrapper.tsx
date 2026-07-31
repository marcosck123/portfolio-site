"use client";

import { motion, type Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Shared entrance: fade in + slide up. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Shared entrance for media tiles: fade in + scale up. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

/** Viewport config shared by every scroll-triggered section. */
export const viewportOnce = { once: true, margin: "-50px" } as const;

/**
 * Variants for a container that staggers its children.
 * Pair with `motion.ul` / `motion.div` and children using `fadeUp` / `scaleIn`.
 */
export function staggerParent(stagger = 0.1, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/**
 * Scroll-triggered fade-in + slide-up container.
 * `delay` staggers a list when set to index * 0.1.
 */
export function MotionWrapper({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its `MotionItem` children on scroll. */
export function MotionStagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

/** A single staggered child of `MotionStagger`. */
export function MotionItem({
  children,
  className,
  variants = fadeUp,
  duration = 0.6,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{ duration, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
