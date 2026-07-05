/* =============================================================================
 * honkoma Design System — ArrowCTA (blueprint §2 P-5) — [fable-craft]
 *
 * The circular arrow button. The site's "feel" is largely decided here, so it
 * is the first primitive built (critical-path head, the touch-standard器).
 *
 * Behaviors (LayerX-faithful):
 *  - sweepSwap (default): on hover the fill sweeps out from center (scale 0->1)
 *    while the arrow slides out to the right and a second arrow slides in from
 *    the left; arrow color flips to --text-on-inverse. Un-hover does NOT reverse
 *    the sweep — it fades back in 0.2s (no round-trip mush).
 *  - spin: arrow rotates -45deg -> 0deg while the fill sweeps (external links).
 *  - Fill uses a masked circle (clip via border-radius:50% + overflow hidden),
 *    so no pseudo-element hacks and it composites cleanly.
 *
 * Theming: reads only semantic CSS vars, so inside [data-theme="inverse"] it
 * flips with NO props.
 *
 * Polymorphism: exactly one of { to | href | onClick } -> <Link> | <a> | <button>.
 * `label` (aria-label) is required by the type.
 *
 * Reduced motion: MotionProvider's reducedMotion="user" disables the transform
 * animations; we additionally gate hover-driven motion behind @media (hover:hover)
 * so touch devices only get the active press.
 * ========================================================================== */

import * as React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { dur, ease } from "../../design/tokens";

/* ---------------------------------------------------------------- types --- */

type Size = "sm" | "md" | "lg";
type Variant = "outline" | "fill" | "ghost";
type Direction = "right" | "up" | "external";
type Hover = "sweepSwap" | "spin";

type CommonProps = {
  /** Required accessible name (also used as visible companion text source if none). */
  label: string;
  size?: Size;
  variant?: Variant;
  direction?: Direction;
  hover?: Hover;
  /** Companion text rendered to the left of the circle (e.g. "事業内容へ"). */
  withText?: string;
  className?: string;
};

/** Exactly one navigation mechanism is allowed. */
type AsLink = { to: string; href?: never; onClick?: never };
type AsAnchor = { href: string; to?: never; onClick?: never };
type AsButton = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  to?: never;
  href?: never;
};

export type ArrowCTAProps = CommonProps & (AsLink | AsAnchor | AsButton);

/* ------------------------------------------------------------- geometry --- */

const SIZE_PX: Record<Size, number> = { sm: 40, md: 56, lg: 96 };

/** Icon stroke width scales down as the circle grows, for optical balance. */
const STROKE: Record<Size, number> = { sm: 1.75, md: 1.75, lg: 2 };

const ICON_ROTATION: Record<Direction, number> = {
  right: 0,
  up: -90,
  external: -45,
};

/* --------------------------------------------------------------- arrows --- */

/**
 * Base arrow glyph (points right; rotated per `direction`). External uses the
 * same shaft-with-head so rotation to -45deg reads as the ↗ affordance.
 */
function Arrow({ stroke }: { stroke: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ width: "45%", height: "45%", display: "block" }}
    >
      <path
        d="M4 12h15M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------------------- render --- */

/**
 * The visual body, shared by all three polymorphic wrappers. `interactive`
 * marks a `group` so the wrappers' :hover/:focus-visible drive the animation
 * via CSS custom-property flags (kept in the stylesheet block below).
 */
function ArrowBody({
  size,
  variant,
  direction,
  hover,
}: Required<Pick<CommonProps, "size" | "variant">> & {
  direction: Direction;
  hover: Hover;
}) {
  const px = SIZE_PX[size];
  const stroke = STROKE[size];
  const rot = ICON_ROTATION[direction];

  return (
    <span
      className={twMerge(
        "arrowcta-circle",
        variant === "outline" && "arrowcta--outline",
        variant === "fill" && "arrowcta--fill",
        variant === "ghost" && "arrowcta--ghost",
        hover === "spin" && "arrowcta--spin",
      )}
      style={{ width: px, height: px }}
    >
      {/* Fill sweep: masked circle scaled from 0 -> 1 on hover/focus. */}
      <span className="arrowcta-fill" aria-hidden="true" />

      {/* Two stacked arrows: primary (visible) and incoming (from left). */}
      <span
        className="arrowcta-icons"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        <span className="arrowcta-arrow arrowcta-arrow--primary">
          <Arrow stroke={stroke} />
        </span>
        <span className="arrowcta-arrow arrowcta-arrow--incoming" aria-hidden="true">
          <Arrow stroke={stroke} />
        </span>
      </span>
    </span>
  );
}

/* Motion values shared with the stylesheet (kept in JS so no literals leak). */
const MOTION_STYLE = `
.arrowcta {
  --ac-dur-fast: ${dur.fast}s;
  --ac-dur-back: 0.2s;
  --ac-dur-instant: ${dur.instant}s;
  --ac-ease-soft: cubic-bezier(${ease.soft.join(",")});
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: var(--color-accent);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-en);
  font-weight: 500;
  letter-spacing: 0.02em;
}
.arrowcta-text {
  font-size: var(--fs-label);
  color: var(--text-primary);
  transition: color var(--ac-dur-fast) var(--ac-ease-soft);
}
.arrowcta-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border-radius: 50%;
  overflow: hidden;
  color: var(--color-accent);
  transition: transform var(--ac-dur-instant) var(--ac-ease-soft);
  isolation: isolate;
}
.arrowcta--outline { border: 1.5px solid var(--color-accent); }
.arrowcta--ghost   { border: 1.5px solid transparent; }
.arrowcta--fill    { border: 1.5px solid var(--color-accent); }
.arrowcta--fill .arrowcta-fill { transform: scale(1); }
.arrowcta--fill .arrowcta-circle,
.arrowcta--fill.arrowcta-circle { color: var(--text-on-inverse); }

.arrowcta-fill {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-accent);
  transform: scale(0);
  transform-origin: center;
  transition: transform var(--ac-dur-back) var(--ac-ease-soft);
  z-index: 0;
}
.arrowcta-icons {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.arrowcta-arrow {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition:
    transform var(--ac-dur-back) var(--ac-ease-soft),
    color var(--ac-dur-back) var(--ac-ease-soft);
}
.arrowcta-arrow--primary  { transform: translateX(0); }
.arrowcta-arrow--incoming { transform: translateX(-130%); }

/* Hover / focus behavior only where a real pointer exists. Focus-visible always
 * triggers (keyboard users get the same affordance). */
@media (hover: hover) {
  .arrowcta:hover .arrowcta-fill { transform: scale(1); transition-duration: var(--ac-dur-fast); }
  .arrowcta:hover .arrowcta-circle { color: var(--text-on-inverse); }
  .arrowcta:hover .arrowcta-arrow--primary  { transform: translateX(130%); transition-duration: var(--ac-dur-fast); }
  .arrowcta:hover .arrowcta-arrow--incoming { transform: translateX(0);    transition-duration: var(--ac-dur-fast); }
  .arrowcta:hover .arrowcta-text { color: var(--color-accent); }
  /* spin: primary arrow settles from -45deg to 0 while the fill sweeps in. */
  .arrowcta:hover .arrowcta--spin .arrowcta-arrow--primary {
    transform: rotate(0deg);
    transition-duration: var(--ac-dur-fast);
  }
}
.arrowcta:focus-visible { outline: none; }
.arrowcta:focus-visible .arrowcta-circle {
  box-shadow: 0 0 0 2px var(--surface-base), 0 0 0 4px var(--focus-ring);
}
.arrowcta:focus-visible .arrowcta-fill { transform: scale(1); transition-duration: var(--ac-dur-fast); }
.arrowcta:focus-visible .arrowcta-circle { color: var(--text-on-inverse); }
.arrowcta:focus-visible .arrowcta-arrow--primary  { transform: translateX(130%); transition-duration: var(--ac-dur-fast); }
.arrowcta:focus-visible .arrowcta-arrow--incoming { transform: translateX(0);    transition-duration: var(--ac-dur-fast); }

/* spin variant: primary arrow starts pre-rotated, settles to 0 on hover. */
.arrowcta--spin .arrowcta-arrow--primary { transform: rotate(-45deg); }
.arrowcta--spin .arrowcta-arrow--incoming { display: none; }

.arrowcta:active .arrowcta-circle { transform: scale(0.96); }

@media (prefers-reduced-motion: reduce) {
  .arrowcta-fill,
  .arrowcta-arrow,
  .arrowcta-circle,
  .arrowcta-text { transition: none !important; }
  /* keep hover as an instant state change (still legible), no motion */
  .arrowcta--spin .arrowcta-arrow--primary { transform: rotate(0deg); }
}
`;

let styleInjected = false;
function useArrowStyles() {
  React.useEffect(() => {
    if (styleInjected || typeof document === "undefined") return;
    const el = document.createElement("style");
    el.setAttribute("data-arrowcta", "");
    el.textContent = MOTION_STYLE;
    document.head.appendChild(el);
    styleInjected = true;
  }, []);
}

/* ------------------------------------------------------------- component --- */

export function ArrowCTA(props: ArrowCTAProps) {
  const {
    label,
    size = "md",
    variant = "outline",
    direction = "right",
    hover = "sweepSwap",
    withText,
    className,
  } = props;

  useArrowStyles();

  const rootClass = twMerge(
    "arrowcta",
    hover === "spin" && "arrowcta--spin-wrap",
    className,
  );

  const body = (
    <>
      {withText && <span className="arrowcta-text">{withText}</span>}
      <ArrowBody
        size={size}
        variant={variant}
        direction={direction}
        hover={hover}
      />
    </>
  );

  // Polymorphic dispatch. Exactly one of to/href/onClick per the union type.
  if ("to" in props && props.to !== undefined) {
    return (
      <Link to={props.to} aria-label={label} className={rootClass}>
        {body}
      </Link>
    );
  }

  if ("href" in props && props.href !== undefined) {
    const isExternal = direction === "external";
    return (
      <a
        href={props.href}
        aria-label={label}
        className={rootClass}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={(props as AsButton).onClick}
      aria-label={label}
      className={rootClass}
    >
      {body}
    </button>
  );
}

export default ArrowCTA;
