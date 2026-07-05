/* =============================================================================
 * honkoma Design System — Motion tokens (blueprint §1.3)
 *
 * "CSS holds color/size, TS holds time/easing." Framer Motion only accepts JS
 * values, so all duration / easing / stagger / distance / viewport / scroll
 * constants live here and are the ONLY source components may reference.
 * Direct duration/easing literals in components are forbidden (DoD).
 * ========================================================================== */

/** Duration steps (seconds). */
export const dur = {
  instant: 0.15, // focus ring / micro feedback
  fast: 0.3,     // hover (fill sweep, arrow swap)
  base: 0.5,     // tab underline, pill morph
  reveal: 0.8,   // card / text in-view reveal
  hero: 1.1,     // hero heading, wedge transition
} as const;

/** Easing curves. cubic-bezier arrays are consumable by Framer Motion. */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,    // expo-out. Default for reveals. "smooth deceleration"
  inOut: [0.83, 0, 0.17, 1] as const, // wedge / overlay (accelerate -> decelerate crossing)
  soft: [0.33, 1, 0.68, 1] as const,  // hover (gentler than out)
  /** spring for layout animations (underline, pill). */
  spring: { type: "spring", stiffness: 300, damping: 32, mass: 0.9 } as const,
} as const;

/** Stagger increments (seconds between children). */
export const stagger = { tight: 0.06, base: 0.1, loose: 0.16 } as const;

/** Transform distances. */
export const dist = {
  revealY: 32,
  revealYLg: 56,
  hoverLift: -4,
  textClipY: "110%",
} as const;

/** whileInView viewport presets. */
export const viewport = {
  default: { once: true, amount: 0.25 }, // cards / headings
  eager: { once: true, amount: 0.1 },    // tall elements (full grids)
  hero: { once: true, amount: 0.5 },
} as const;

/** Scroll-driven thresholds / offsets. */
export const scroll = {
  navMorphY: 0.85, // nav morph trigger: viewport height * this factor
  sceneRange: ["start end", "end start"] as const, // useScroll offset default
} as const;
