/* =============================================================================
 * honkoma — HomePage hero (corporate face). Full-bleed sky, inverse dark面.
 *
 * Design canon (Fable, 2026-07-06): the company's face is a full-bleed dawn sky
 * — a sea of clouds seen from altitude with god-rays breaking on the right,
 * blue-dominant to sit inside the brand's navy→blue token gradient. The
 * manifesto「誰かが作った時代を、生きるな。」stays the star (it is the origin of
 * the about/recruit story) and finally shares its sentence with the visual: a
 * new day / new era beginning. Left third is the quiet text zone; the light and
 * the open sky live lower-right.
 *
 * POSTER-FIRST (Phase 0): a compressed sky still is the LCP element. Phase 1
 * swaps in a seamless-loop <video> (Topview timelapse) behind the same poster,
 * with reduced-motion / save-data falling back to the still. SINGLE SWAP POINT:
 * the HERO_* constants below — no other change needed to go video.
 *
 * Design system only: semantic tokens (data-theme="inverse" auto-flips text +
 * accent to light), TextReveal, ArrowCTA, m.* + tokens.ts motion. No raw colors
 * (scrims reference --navy-900 via color-mix), no motion literals. Facts stay
 * compliant — no numbers/claims in the hero.
 * ========================================================================== */

import { m, useReducedMotion } from "framer-motion";
import { TextReveal } from "../motion/TextReveal";
import { ArrowCTA } from "../ui/ArrowCTA";
import { dur, ease } from "../../design/tokens";

/* -----------------------------------------------------------------------------
 * Hero visual — SINGLE SWAP POINT.
 * Phase 0 uses the poster only. Phase 1: drop hero-sky.mp4 / hero-sky_low.mp4
 * into public/assets and flip HERO_HAS_VIDEO to true (video layer already wired
 * below, gated on reduced-motion + save-data). Keep the poster = the video's
 * first frame so there is no flash on load.
 * -------------------------------------------------------------------------- */
const HERO_POSTER_WEBP = "/assets/hero-sky.webp";
const HERO_POSTER_JPG = "/assets/hero-sky.jpg";
const HERO_VIDEO = "/assets/hero-sky.mp4"; // Phase 1
const HERO_VIDEO_LOW = "/assets/hero-sky_low.mp4"; // Phase 1 (mobile / low-bitrate)
const HERO_HAS_VIDEO = false; // flip to true once the mp4s exist (Phase 1)

export function HeroHome() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="honkoma"
      data-theme="inverse"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        background: "var(--surface-base)", // navy fallback behind the image
        color: "var(--text-primary)",
        overflow: "hidden",
      }}
    >
      {/* Background visual layer: poster still (LCP). Phase 1 video sits above it. */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <picture>
          <source srcSet={HERO_POSTER_WEBP} type="image/webp" />
          <img
            src={HERO_POSTER_JPG}
            alt=""
            loading="eager"
            decoding="async"
            // raw attribute — hint the browser this is the LCP image
            {...{ fetchpriority: "high" }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </picture>

        {HERO_HAS_VIDEO && !reduce && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER_JPG}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src={HERO_VIDEO_LOW} type="video/mp4" media="(max-width: 767px)" />
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Scrims — legibility for the left text zone + depth. Tokenized navy only. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: [
            // left → right: darken the copy column only; the sky + god-rays on
            // the right must stay fully clear (past ~52% width = no scrim).
            "linear-gradient(100deg, color-mix(in srgb, var(--navy-900) 70%, transparent) 0%, color-mix(in srgb, var(--navy-900) 30%, transparent) 26%, transparent 52%)",
            // gentle bottom depth for the lead + CTA
            "linear-gradient(0deg, color-mix(in srgb, var(--navy-900) 34%, transparent) 0%, transparent 30%)",
          ].join(","),
        }}
      />

      {/* Copy — left-aligned, vertically centered. Right/lower stays open for sky. */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(6rem, 12vh, 9rem) var(--space-gutter) clamp(4rem, 9vh, 7rem)",
        }}
      >
        <div className="hero-copy" style={{ maxWidth: "min(46rem, 92%)" }}>
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
              color: "var(--color-accent-bright)",
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
              maxWidth: "34ch",
              color: "var(--text-primary)",
              fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
              lineHeight: 1.9,
              margin: "1.75rem 0 2.75rem",
            }}
          >
            <strong style={{ fontWeight: 700 }}>会社を、AIネイティブへ。</strong>
            <br />
            honkomaは徹底的な伴走で、現場から次の時代を立ち上げる。
          </m.p>

          <m.div
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: dur.reveal, ease: ease.out, delay: 0.55 }}
          >
            <ArrowCTA to="/about" size="lg" variant="fill" withText="私たちについて" label="私たちについて" />
          </m.div>
        </div>
      </div>

      {/* scoped: hero headline scale (this page may reach the --fs-hero max) */}
      <style>{`
        .hero-title { font-size: var(--fs-hero); font-weight: 700; line-height: 1.14; }
        @media (min-width: 768px) {
          .hero-title { line-height: 1.16; }
        }
      `}</style>
    </section>
  );
}

export default HeroHome;
