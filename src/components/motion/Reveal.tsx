/* =============================================================================
 * honkoma Design System — Reveal / RevealGroup (blueprint §2 P-1)
 *
 * The site's most frequent primitive: "fade up when scrolled into view".
 * Wrap anything in <Reveal> and it enters with the shared motion tokens, so
 * every reveal on the site shares one timing/easing language.
 *
 * RevealGroup orchestrates a set of child <Reveal>s from a SINGLE
 * IntersectionObserver (staggerChildren). Children detect the group via
 * context and delegate their in-view trigger to the parent — no per-child
 * observer, no double-fire.
 *
 * Reduced motion: handled globally by MotionProvider's MotionConfig
 * reducedMotion="user" (transforms are dropped, opacity still resolves to 1),
 * so content never stays hidden. `clip` additionally falls back to no-mask.
 * ========================================================================== */

import { createContext, useContext, type ReactNode } from "react";
import { m } from "framer-motion";
import type { Variants } from "framer-motion";
import { fadeUp, clipRevealY, staggerContainer } from "../../motion/variants";
import { dur, dist, ease, viewport as vpTokens, stagger as staggerTokens } from "../../design/tokens";

/** Motion elements Reveal can render as (kept explicit for LazyMotion strict). */
const MOTION_TAGS = {
  div: m.div,
  span: m.span,
  section: m.section,
  article: m.article,
  li: m.li,
  ul: m.ul,
  p: m.p,
  h2: m.h2,
  h3: m.h3,
} as const;

type RevealTag = keyof typeof MOTION_TAGS;
type RevealVariant = "fadeUp" | "fade" | "clip" | "scaleIn";
type ViewportOpts = { once?: boolean; amount?: number };

/** true when rendered inside a <RevealGroup> (child delegates trigger to parent). */
const GroupContext = createContext(false);

function buildVariants(
  variant: RevealVariant,
  { distance, duration, delay }: { distance: number; duration: number; delay: number },
): Variants {
  switch (variant) {
    case "fade":
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration, ease: ease.out, delay } },
      };
    case "scaleIn":
      return {
        hidden: { opacity: 0, scale: 0.96 },
        show: { opacity: 1, scale: 1, transition: { duration, ease: ease.out, delay } },
      };
    case "clip":
      return clipRevealY({ duration });
    case "fadeUp":
    default:
      return fadeUp({ distance, duration, delay });
  }
}

export type RevealProps = {
  children: ReactNode;
  as?: RevealTag;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  viewport?: ViewportOpts;
  className?: string;
};

export function Reveal({
  children,
  as = "div",
  variant = "fadeUp",
  delay = 0,
  duration = dur.reveal,
  distance = dist.revealY,
  viewport = vpTokens.default,
  className,
}: RevealProps) {
  const grouped = useContext(GroupContext);
  const variants = buildVariants(variant, { distance, duration, delay });

  // Inside a group the parent drives initial/whileInView; the child only needs
  // its variants so the "show" state propagates through staggerChildren.
  const trigger = grouped
    ? { variants }
    : ({ variants, initial: "hidden", whileInView: "show", viewport } as const);

  // clip needs an overflow-hidden mask around the moving inner element.
  if (variant === "clip") {
    return (
      <span className={className} style={{ display: "block", overflow: "hidden" }}>
        <m.span {...trigger} style={{ display: "block" }}>
          {children}
        </m.span>
      </span>
    );
  }

  const Comp = MOTION_TAGS[as];
  return (
    <Comp className={className} {...trigger}>
      {children}
    </Comp>
  );
}

export type RevealGroupProps = {
  children: ReactNode;
  as?: RevealTag;
  stagger?: number;
  delayChildren?: number;
  viewport?: ViewportOpts;
  className?: string;
};

export function RevealGroup({
  children,
  as = "div",
  stagger = staggerTokens.base,
  delayChildren = 0,
  viewport = vpTokens.eager,
  className,
}: RevealGroupProps) {
  const Comp = MOTION_TAGS[as];
  const variants = staggerContainer({ stagger, delayChildren });
  return (
    <GroupContext.Provider value={true}>
      <Comp
        className={className}
        variants={variants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {children}
      </Comp>
    </GroupContext.Provider>
  );
}

export default Reveal;
