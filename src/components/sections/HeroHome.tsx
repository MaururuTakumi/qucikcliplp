/* =============================================================================
 * honkoma — HomePage hero (corporate face). LayerX-faithful × honkoma blue.
 *
 * Design intent: the visual center of the site. NOT a product pitch — the
 * company's face. Light, generous whitespace, quiet confidence. The theme
 * "まだ見ぬ未来を、一緒に" is the star, set as a vertical Japanese heading
 * (TextReveal), with an English accent line and a single ArrowCTA. The
 * scroll-linked embraceStack 3D is the anchor visual (lazy-loaded so 3D never
 * weighs on other pages; static fallback for WebGL-less / reduced-motion).
 *
 * Uses only design-system assets: tokens (semantic vars / ds namespace),
 * TextReveal, ArrowCTA, Reveal, and the lazy ScrollScene. No hard-coded colors,
 * no motion literals. Facts stay compliant (no 20社/98% claims here).
 * ========================================================================== */

import { Suspense, lazy } from "react";
import { m, useReducedMotion } from "framer-motion";
import { TextReveal } from "../motion/TextReveal";
import { ArrowCTA } from "../ui/ArrowCTA";
import { dur, ease } from "../../design/tokens";

// 3D is code-split: three/fiber/drei load only for this hero.
const ScrollScene = lazy(() => import("../motion/ScrollScene"));

export function HeroHome() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="honkoma"
      style={{
        position: "relative",
        background: "var(--surface-base)",
        color: "var(--text-primary)",
        overflow: "hidden",
      }}
    >
      {/* faint dotted texture, brand-tinted (very low presence) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--color-accent) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(120% 100% at 70% 40%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(120% 100% at 70% 40%, #000 30%, transparent 75%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          /* Top pad clears the sticky header; content flows (no forced center
           * that pushed the tall vertical heading up behind the header). */
          padding: "clamp(6.5rem, 13vh, 10rem) var(--space-gutter) clamp(4rem, 9vh, 7rem)",
        }}
      >
        <div className="hero-grid">
          {/* Copy column */}
          <div className="hero-copy">
            <m.span
              className="font-en"
              initial={reduce ? undefined : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: dur.reveal, ease: ease.out }}
              style={{
                display: "block",
                fontSize: "var(--fs-label)",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "1.5rem",
              }}
            >
              Don't live in an era someone else built.
            </m.span>

            <TextReveal
              as="h1"
              orientation="vertical-md"
              text={["誰かが作った", "時代を、", "生きるな。"]}
              className="hero-title font-jp"
            />

            <m.p
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: dur.reveal, ease: ease.out, delay: 0.4 }}
              className="hero-lead"
              style={{
                maxWidth: "36ch",
                color: "var(--text-secondary)",
                fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                lineHeight: 1.9,
                margin: "2rem 0 2.75rem",
              }}
            >
              時代は、与えられるものではなく、つくるもの。
              honkomaはAIの伴走導入で企業の可能性を解き放ち、
              売上を伸ばし、コストを削り、現場から次の時代を立ち上げる。
              まだ見ぬ未来を、お客様と一緒に。
            </m.p>

            <m.div
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: dur.reveal, ease: ease.out, delay: 0.55 }}
            >
              <ArrowCTA to="/about" size="lg" variant="fill" withText="私たちについて" label="私たちについて" />
            </m.div>
          </div>

          {/* 3D column — anchor visual */}
          <div className="hero-visual" aria-hidden="true">
            <Suspense fallback={null}>
              <ScrollScene
                scene="embraceStack"
                mobile="lite"
                className="hero-canvas"
                ariaLabel="honkoma のミッションを表す3Dビジュアル"
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* scoped layout: desktop two-column, mobile stacked (heading horizontal) */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
        }
        /* Horizontal (mobile fallback of vertical-md): normal hero scale. */
        .hero-title { font-size: clamp(2rem, 7vw, 2.75rem); font-weight: 700; line-height: 1.15; }
        .hero-visual { order: -1; height: min(46vh, 380px); }
        .hero-canvas { width: 100%; height: 100%; display: block; }
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 1.05fr 0.95fr; }
          .hero-visual { order: 0; height: min(70vh, 620px); }
          /* Vertical writing: a 6-char column multiplies the font-size into
           * height, so the hero scale must be smaller than --fs-hero here or the
           * heading overflows the section and collides with the sticky header. */
          .hero-title { font-size: clamp(2.25rem, 3vw, 3rem); line-height: 1.24; }
        }
      `}</style>
    </section>
  );
}

export default HeroHome;
