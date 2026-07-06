/* =============================================================================
 * honkoma — HomePage hero (corporate face). LayerX-faithful × honkoma blue.
 *
 * Design intent: the visual center of the site. NOT a product pitch — the
 * company's face. Light, generous whitespace, quiet confidence. The manifesto
 * "誰かが作った時代を、生きるな。" is the star (horizontal TextReveal) with an
 * English accent line and a single ArrowCTA. The anchor visual is a real
 * workspace photo in a LayerX-style geometric frame with blue wedge accents —
 * human and clear, not an abstract diagram. (The embraceStack 3D lives on
 * /_lab; it is no longer used here.)
 *
 * Uses only design-system assets: tokens (semantic vars), TextReveal, ArrowCTA.
 * No hard-coded colors, no motion literals. Facts stay compliant.
 * ========================================================================== */

import { m, useReducedMotion } from "framer-motion";
import { TextReveal } from "../motion/TextReveal";
import { ArrowCTA } from "../ui/ArrowCTA";
import { dur, ease } from "../../design/tokens";

/* -----------------------------------------------------------------------------
 * Hero visual image — SINGLE SWAP POINT.
 * This is a placeholder, AI-generated workspace photo. When real office / team
 * photos are available, just replace the file at public/assets/hero-workspace.png
 * (keep the same path) OR point HERO_IMAGE at a new file under /public. No other
 * change is needed — framing, wedges and animation stay the same.
 * -------------------------------------------------------------------------- */
const HERO_IMAGE = "/assets/hero-workspace.png";

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
              orientation="horizontal"
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

          {/* Visual column — real workspace photo in a geometric frame + wedges */}
          <div className="hero-visual" aria-hidden="true">
            <m.span
              className="hero-wedge hero-wedge--soft"
              initial={reduce ? undefined : { x: "-40%", opacity: 0 }}
              animate={reduce ? undefined : { x: 0, opacity: 1 }}
              transition={{ duration: dur.hero, ease: ease.inOut, delay: 0.35 }}
            />
            <m.span
              className="hero-wedge hero-wedge--accent"
              initial={reduce ? undefined : { x: "-40%", opacity: 0 }}
              animate={reduce ? undefined : { x: 0, opacity: 1 }}
              transition={{ duration: dur.hero, ease: ease.inOut, delay: 0.45 }}
            />
            <m.div
              className="hero-frame"
              initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: dur.hero, ease: ease.out, delay: 0.15 }}
            >
              <img src={HERO_IMAGE} alt="" loading="eager" />
            </m.div>
          </div>
        </div>
      </div>

      {/* scoped layout: desktop two-column, mobile stacked */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
        }
        .hero-title { font-size: clamp(2.5rem, 10vw, 3.5rem); font-weight: 700; line-height: 1.14; }
        .hero-visual { order: -1; height: min(52vh, 440px); position: relative; }
        .hero-frame {
          position: relative; z-index: 1; width: 100%; height: 100%; overflow: hidden;
          border-radius: 6px;
          clip-path: polygon(9% 0, 100% 0, 100% 82%, 84% 100%, 0 100%, 0 16%);
          box-shadow: 0 24px 60px -30px color-mix(in srgb, var(--navy-900) 55%, transparent);
        }
        .hero-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hero-wedge { position: absolute; z-index: 0; bottom: -7%; pointer-events: none; }
        .hero-wedge--soft {
          left: -8%; width: 58%; height: 46%;
          background: var(--color-accent-soft);
          clip-path: polygon(0 34%, 100% 0, 82% 100%, 0 100%);
        }
        .hero-wedge--accent {
          left: 10%; width: 56%; height: 40%; bottom: -12%;
          background: var(--color-accent);
          clip-path: polygon(0 42%, 100% 0, 80% 100%, 0 100%);
        }
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 1fr 1fr; }
          .hero-visual { order: 0; height: min(74vh, 640px); }
          .hero-title { font-size: clamp(2.75rem, 4vw, 4.25rem); line-height: 1.16; }
        }
      `}</style>
    </section>
  );
}

export default HeroHome;
