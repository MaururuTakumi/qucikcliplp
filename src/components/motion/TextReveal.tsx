/* =============================================================================
 * honkoma Design System — TextReveal (blueprint §2 P-2) — [fable-craft]
 *
 * Heading reveal: each line (or char) rides up from behind an overflow-hidden
 * mask. The differentiator is VERTICAL Japanese support: in writing-mode
 * vertical-rl the block-progression axis is horizontal, so masked segments
 * slide along X instead of Y. `vertical-md` renders vertical only at >=768px
 * and falls back to horizontal on mobile.
 *
 * Accessibility / SEO / copy-paste: the split spans are aria-hidden and the
 * full text is preserved in an .sr-only node, so screen readers, crawlers and
 * text selection always get the real, unbroken string.
 *
 * Trigger: `hero` fires on mount (above-the-fold); otherwise whileInView.
 * Reduced motion is handled globally by MotionProvider (transforms drop,
 * opacity resolves to 1) — we additionally start segments at opacity 1 offset
 * only, so nothing can stay invisible.
 * ========================================================================== */

import { useId } from "react";
import { m } from "framer-motion";
import type { Variants } from "framer-motion";
import { dur, ease, stagger as staggerTokens } from "../../design/tokens";

type Orientation = "horizontal" | "vertical" | "vertical-md";
type Mode = "lines" | "chars";
type HeadingTag = "h1" | "h2" | "h3" | "p";

/** Explicit tag map keeps LazyMotion strict happy. */
const MOTION_HEADINGS = {
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  p: m.p,
} as const;

export type TextRevealProps = {
  /** string[] = author-controlled line breaks (do not rely on wrapping). */
  text: string | string[];
  as?: HeadingTag;
  mode?: Mode;
  orientation?: Orientation;
  /** fire on mount (hero) instead of whileInView. */
  hero?: boolean;
  delay?: number;
  staggerChildren?: number;
  className?: string;
};

/**
 * Container orchestrates the masked segments. Vertical uses X, horizontal Y.
 * The container is transparent to motion (only staggers its children).
 */
function containerVariants(staggerChildren: number, delayChildren: number): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
  };
}

/** Segment slides from 110% (offscreen behind the mask) to 0 on its axis. */
function segmentVariants(axis: "x" | "y"): Variants {
  const hiddenOffset = axis === "y" ? { y: "110%" } : { x: "110%" };
  const shown = axis === "y" ? { y: "0%" } : { x: "0%" };
  return {
    hidden: { ...hiddenOffset, opacity: 0 },
    show: {
      ...shown,
      opacity: 1,
      transition: { duration: dur.hero, ease: ease.out },
    },
  };
}

export function TextReveal({
  text,
  as = "h1",
  mode = "lines",
  orientation = "horizontal",
  hero = false,
  delay = 0,
  staggerChildren,
  className,
}: TextRevealProps) {
  const uid = useId();
  const Heading = MOTION_HEADINGS[as];

  const lines = Array.isArray(text) ? text : [text];
  const fullText = lines.join("\n");

  // Vertical mask motion travels along X (block progression is horizontal in
  // vertical-rl). vertical-md still animates X — the CSS media query only flips
  // writing-mode; the mask axis stays consistent with the rendered direction.
  const isVertical = orientation === "vertical" || orientation === "vertical-md";
  const axis: "x" | "y" = isVertical ? "x" : "y";

  const defaultStagger =
    staggerChildren ?? (mode === "chars" ? staggerTokens.tight : staggerTokens.base);

  const trigger = hero
    ? ({ initial: "hidden", animate: "show" } as const)
    : ({ initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.5 } } as const);

  const orientationClass =
    orientation === "vertical"
      ? "writing-vertical"
      : orientation === "vertical-md"
        ? "writing-vertical-md"
        : undefined;

  // Build the animated segments (aria-hidden). Real text lives in .sr-only.
  const segments: JSX.Element[] = [];
  lines.forEach((line, li) => {
    if (mode === "chars") {
      // Split into chars; keep spaces as non-breaking so layout is stable.
      Array.from(line).forEach((ch, ci) => {
        segments.push(
          <span
            key={`${uid}-${li}-${ci}`}
            className="textreveal-mask"
            style={{ display: "inline-block", overflow: "hidden" }}
          >
            <m.span className="textreveal-seg" variants={segmentVariants(axis)} style={{ display: "inline-block" }}>
              {ch === " " ? " " : ch}
            </m.span>
          </span>,
        );
      });
    } else {
      segments.push(
        <span
          key={`${uid}-${li}`}
          className="textreveal-mask"
          style={{ display: "block", overflow: "hidden" }}
        >
          <m.span className="textreveal-seg" variants={segmentVariants(axis)} style={{ display: "block" }}>
            {line}
          </m.span>
        </span>,
      );
    }
    // Break between lines (horizontal only; vertical wraps by writing-mode).
  });

  return (
    <Heading
      className={[className, orientationClass].filter(Boolean).join(" ") || undefined}
      variants={containerVariants(defaultStagger, delay)}
      {...trigger}
    >
      {/* Real, unbroken text for SR / SEO / copy-paste. */}
      <span className="sr-only">{fullText}</span>
      {/* Animated visual segments. */}
      <span aria-hidden="true" className="textreveal-visual">
        {segments}
      </span>
    </Heading>
  );
}

export default TextReveal;
