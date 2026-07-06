/* =============================================================================
 * honkoma Design System — Wedge (blueprint §2 P-3) — [fable-craft]
 *
 * The site's signature diagonal motion, in two forms:
 *
 *  - WedgeDivider: a static/in-view diagonal section boundary. Bars slide in
 *    from the left. Shape is drawn with clip-path: polygon() (NOT a rotated
 *    rectangle) so Safari does not fuzz the diagonal edge.
 *
 *  - WedgeOverlay: wraps the app's <Routes>. On route change, diagonal bars
 *    sweep across the viewport; at the crossing peak the route swaps. The
 *    overlay owns scroll-position reset and focus move, and degrades to a
 *    plain crossfade under reduced motion.
 *
 * Colors come from semantic tokens (accent / accent-soft), so both forms flip
 * automatically inside [data-theme="inverse"]. Angle is eased down on mobile so
 * the triangle never eats the screen.
 * ========================================================================== */

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { dur, ease, stagger as staggerTokens } from "../../design/tokens";

/* ------------------------------------------------------------- Divider ----- */

export type WedgeDividerProps = {
  /** Diagonal angle in degrees (mobile auto-scales to ~60%). Default 6. */
  angle?: number;
  /** [top bar color, optional back bar color]. CSS var refs. */
  colors?: [string, string?];
  direction?: "ltr" | "rtl";
  height?: string;
  /** Animate bars sliding in on scroll-into-view. Default true. */
  animateInView?: boolean;
  className?: string;
};

/**
 * Build a parallelogram clip-path skewed by `angle`. The vertical offset the
 * diagonal introduces is tan(angle) * height, expressed in % of the box.
 */
function wedgePolygon(angleDeg: number, direction: "ltr" | "rtl"): string {
  // Convert angle to a vertical percentage offset across the full width.
  const offset = Math.min(40, Math.max(0, Math.tan((angleDeg * Math.PI) / 180) * 100));
  return direction === "ltr"
    ? `polygon(0 0, 100% ${offset}%, 100% 100%, 0 ${100 - offset}%)`
    : `polygon(0 ${offset}%, 100% 0, 100% ${100 - offset}%, 0 100%)`;
}

export function WedgeDivider({
  angle = 6,
  colors = ["var(--color-accent)", "var(--color-accent-soft)"],
  direction = "ltr",
  height = "clamp(64px, 10vw, 140px)",
  animateInView = true,
  className,
}: WedgeDividerProps) {
  const reduce = useReducedMotion();
  const [front, back] = colors;

  const bars = [back, front].filter(Boolean) as string[]; // draw back first

  const enter = animateInView && !reduce;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ position: "relative", width: "100%", height, overflow: "hidden" }}
    >
      {bars.map((color, i) => {
        const isBack = bars.length === 2 && i === 0;
        return (
          <m.div
            key={i}
            initial={enter ? { x: "-110%" } : { x: 0 }}
            whileInView={enter ? { x: 0 } : undefined}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: dur.hero,
              ease: ease.inOut,
              delay: enter ? i * staggerTokens.loose : 0,
            }}
            style={{
              position: "absolute",
              inset: 0,
              background: color,
              // Back bar sits slightly offset/steeper for depth.
              clipPath: wedgePolygon(isBack ? angle * 1.6 : angle, direction),
              // Mobile: soften the angle by scaling the box's own skew via a CSS var.
              opacity: isBack ? 0.9 : 1,
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- Overlay ----- */

export type WedgeOverlayProps = {
  /** Wrap your <Routes> (or the routed content) here. */
  children: ReactNode;
  /** Number of sweeping bars. Default 2 (soft blue behind, deep blue front). */
  bars?: number;
  /** Return true to skip the transition (e.g. query-only changes). */
  skipOn?: (from: string, to: string) => boolean;
};

/**
 * WedgeOverlay owns:
 *  - the diagonal sweep on route change (AnimatePresence keyed by pathname),
 *  - scroll reset to top on navigation,
 *  - moving focus to the main region (a11y) after the swap.
 * Under reduced motion it degrades to a short crossfade of the bar layer.
 */
export function WedgeOverlay({ children, bars = 2, skipOn }: WedgeOverlayProps) {
  const location = useLocation();
  const reduce = useReducedMotion();
  const prevPath = useRef(location.pathname);
  const mounted = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // The sweep is keyed off `navKey` (null on first render → NO wipe on a hard load /
  // reload). We set it in a useLayoutEffect, which runs synchronously BEFORE the
  // browser paints — so the wipe mounts in the same paint as the swapped route and
  // starts flowing the instant the link is pressed. (The earlier version used a
  // post-paint useEffect, so the new page painted first and the wipe ran a beat
  // LATER, over already-swapped content — the "late animation" the user reported.)
  const [navKey, setNavKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return; // initial mount: no scroll reset, no wipe
    }
    const from = prevPath.current;
    prevPath.current = location.pathname;
    // Scroll reset + focus move on the committed navigation.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mainRef.current?.focus({ preventScroll: true });
    // Fire the sweep (before paint) unless this transition is opted out.
    if (!(skipOn && skipOn(from, location.pathname))) {
      setNavKey(location.pathname);
    }
  }, [location.pathname, skipOn]);

  const barColors = ["var(--color-accent-soft)", "var(--color-accent)"];
  const clearSweep = () => setNavKey(null);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mainRef} tabIndex={-1} style={{ outline: "none" }}>
        {children}
      </div>

      <AnimatePresence mode="wait">
        {navKey && (
          <m.div
            key={navKey}
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 60,
              display: "grid",
            }}
          >
            {reduce ? (
              // Reduced motion: simple crossfade of a flat accent veil.
              <m.div
                initial={{ opacity: 0.0 }}
                animate={{ opacity: [0.0, 0.6, 0.0] }}
                transition={{ duration: dur.fast, times: [0, 0.5, 1] }}
                onAnimationComplete={clearSweep}
                style={{ position: "absolute", inset: 0, background: "var(--color-accent)" }}
              />
            ) : (
              Array.from({ length: bars }).map((_, i) => (
                <m.div
                  key={i}
                  initial={{ x: "-110%" }}
                  animate={{ x: ["-110%", "0%", "110%"] }}
                  transition={{
                    duration: dur.hero,
                    ease: ease.inOut,
                    times: [0, 0.5, 1],
                    delay: i * staggerTokens.tight,
                  }}
                  onAnimationComplete={i === bars - 1 ? clearSweep : undefined}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: barColors[i % barColors.length],
                    clipPath: "polygon(0 0, 100% 8%, 100% 100%, 0 92%)",
                  }}
                />
              ))
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WedgeDivider;
