/* =============================================================================
 * honkoma Design System — StaggerGrid (blueprint §2 C-2) — [structural]
 *
 * "Drop cards in and they enter, staggered, in one satisfying wave." A layout
 * (grid or masonry) + motion composite: one IntersectionObserver on the
 * container fades each child up in sequence.
 *
 * maxStagger caps the per-child delay so a 30-logo grid does not drag — rows
 * past the cap all share the last delay instead of waiting forever.
 * ========================================================================== */

import { Children, type CSSProperties, type ReactNode } from "react";
import { m } from "framer-motion";
import type { Variants } from "framer-motion";
import { dur, ease, stagger as staggerTokens, dist, viewport as vpTokens } from "../../design/tokens";
import "./StaggerGrid.css";

const GAP = { sm: "1rem", md: "1.5rem", lg: "2rem" } as const;

export type StaggerGridProps = {
  children: ReactNode;
  columns?: { base?: number; md?: number; lg?: number };
  gap?: keyof typeof GAP;
  stagger?: number;
  masonry?: boolean;
  /** Cap the per-child delay (index beyond this shares the last delay). */
  maxStagger?: number;
  className?: string;
};

export function StaggerGrid({
  children,
  columns = { base: 1, md: 2, lg: 3 },
  gap = "md",
  stagger = staggerTokens.base,
  masonry = false,
  maxStagger = 6,
  className,
}: StaggerGridProps) {
  const item: Variants = {
    hidden: { opacity: 0, y: dist.revealY },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: dur.reveal,
        ease: ease.out,
        delay: Math.min(i, maxStagger) * stagger,
      },
    }),
  };

  const style = {
    "--sg-base": columns.base ?? 1,
    "--sg-md": columns.md ?? columns.base ?? 2,
    "--sg-lg": columns.lg ?? columns.md ?? 3,
    "--sg-gap": GAP[gap],
  } as CSSProperties;

  return (
    <m.div
      className={`${masonry ? "ds-stagger-grid--masonry" : "ds-stagger-grid"}${className ? ` ${className}` : ""}`}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={vpTokens.eager}
    >
      {Children.map(children, (child, i) => (
        <m.div custom={i} variants={item}>
          {child}
        </m.div>
      ))}
    </m.div>
  );
}

export default StaggerGrid;
