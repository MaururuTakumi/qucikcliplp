/* =============================================================================
 * honkoma Design System — SectionHeading (blueprint §2 P-8) — [fable-craft]
 *
 * The LayerX "English accent label + oversized JP heading (+ 01/05 numbering)"
 * type, unified across every section. Burning the sequence into the component
 * keeps the site's rhythm consistent:
 *    enLabel (delay 0) -> title reveal (delay 0.15) -> index (delay 0.3)
 *
 * Title reveal is delegated to TextReveal (handles vertical writing, masks,
 * a11y). Colors are semantic tokens so this flips inside [data-theme="inverse"]
 * with no props. Reduced motion is handled globally by MotionProvider.
 * ========================================================================== */

import { useId } from "react";
import { m } from "framer-motion";
import type { Variants } from "framer-motion";
import { TextReveal } from "../motion/TextReveal";
import { dur, ease } from "../../design/tokens";

type Orientation = "horizontal" | "vertical" | "vertical-md";

export type SectionHeadingProps = {
  title: string | string[];
  /** English accent label, e.g. "What We Do" (Space Grotesk, wide tracking). */
  enLabel?: string;
  /** Numbering, e.g. { current: 1, total: 5 } -> "01 / 05". */
  index?: { current: number; total?: number };
  orientation?: Orientation;
  level?: 1 | 2 | 3;
  align?: "start" | "center";
  /** Use TextReveal animation. Default true. */
  reveal?: boolean;
  /** Fire title on mount (hero) rather than in-view. */
  hero?: boolean;
  className?: string;
};

const LEVEL_TAG = { 1: "h1", 2: "h2", 3: "h3" } as const;
const LEVEL_FS = { 1: "var(--fs-hero)", 2: "var(--fs-h2)", 3: "var(--fs-h3)" } as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Fade-up variant with a baked delay (label=0, index=0.3). */
function fadeUpAt(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out, delay } },
  };
}

export function SectionHeading({
  title,
  enLabel,
  index,
  orientation = "horizontal",
  level = 2,
  align = "start",
  reveal = true,
  hero = false,
  className,
}: SectionHeadingProps) {
  const tag = LEVEL_TAG[level];
  const fontSize = LEVEL_FS[level];
  const isVertical = orientation === "vertical" || orientation === "vertical-md";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const titleClass = `sh-title-${uid}`;

  const trigger = hero
    ? ({ initial: "hidden", animate: "show" } as const)
    : ({ initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.4 } } as const);

  return (
    <header
      className={className}
      style={{
        display: "flex",
        flexDirection: isVertical ? "row" : "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: "0.75rem",
        color: "var(--text-primary)",
      }}
    >
      {/* Scoped title sizing — unique class avoids leaking onto other headers. */}
      <style>{`.${titleClass} { font-size: ${fontSize}; font-weight: 700; line-height: 1.15; }`}</style>

      {enLabel && (
        <m.span
          className="font-en"
          variants={reveal ? fadeUpAt(0) : undefined}
          {...(reveal ? trigger : {})}
          style={{
            fontSize: "var(--fs-label)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          {enLabel}
        </m.span>
      )}

      <TextReveal
        text={title}
        as={tag}
        orientation={orientation}
        hero={hero}
        delay={reveal ? 0.15 : 0}
        className={titleClass}
      />

      {index && (
        <m.span
          className="font-en"
          variants={reveal ? fadeUpAt(0.3) : undefined}
          {...(reveal ? trigger : {})}
          style={{
            fontSize: "var(--fs-label)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: "var(--text-secondary)",
          }}
        >
          {pad2(index.current)}
          {index.total ? ` / ${pad2(index.total)}` : ""}
        </m.span>
      )}
    </header>
  );
}

export default SectionHeading;
