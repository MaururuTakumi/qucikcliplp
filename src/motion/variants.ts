/* =============================================================================
 * honkoma Design System — shared Framer Motion variants (blueprint §1.1 / P-0)
 *
 * Variant FACTORIES (never inline variants in components). Every reveal in the
 * site is composed from these so timing/easing stay consistent and swappable.
 * ========================================================================== */

import type { Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { dur, ease, stagger as staggerTokens, dist } from "../design/tokens";

type FadeUpOpts = {
  distance?: number;
  duration?: number;
  delay?: number;
};

/**
 * fadeUp: opacity 0->1 + y (distance)->0. The site's most common reveal.
 * Use `hidden`/`show` states with initial="hidden" whileInView="show".
 */
export const fadeUp = (opts: FadeUpOpts = {}): Variants => {
  const {
    distance = dist.revealY,
    duration = dur.reveal,
    delay = 0,
  } = opts;
  return {
    hidden: { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: ease.out, delay },
    },
  };
};

/**
 * clipRevealY: inner element slides from y:110% -> 0. Pair with an
 * overflow-hidden parent (used by TextReveal for line masks).
 */
export const clipRevealY = (opts: { duration?: number } = {}): Variants => {
  const { duration = dur.hero } = opts;
  return {
    hidden: { y: dist.textClipY },
    show: {
      y: 0,
      transition: { duration, ease: ease.out },
    },
  };
};

type StaggerOpts = {
  stagger?: number;
  delayChildren?: number;
};

/**
 * staggerContainer: orchestrates children (which use fadeUp/clipRevealY).
 * A single container drives one IntersectionObserver for the whole group.
 */
export const staggerContainer = (opts: StaggerOpts = {}): Variants => {
  const { stagger = staggerTokens.base, delayChildren = 0 } = opts;
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
};

/**
 * useReducedMotionSafe: single hook every primitive consults so the reduced
 * motion policy is honored uniformly (mirrors MotionConfig reducedMotion="user").
 * Returns true when the user prefers reduced motion.
 */
export const useReducedMotionSafe = (): boolean => {
  return useReducedMotion() ?? false;
};
