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

import { useEffect, useRef, useState } from "react";
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
const HERO_HAS_VIDEO = true; // seamless-loop sky timelapse (Topview i2v)

export function HeroHome() {
  const reduce = useReducedMotion();
  // Honor reduced-motion + Data Saver: fall back to the poster still, no video.
  const saveData =
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const showVideo = HERO_HAS_VIDEO && !reduce && !saveData;

  // Source selection in JS (a <source media> on <video> is not reliably honored):
  // low-bitrate file on phones, full-res otherwise. Default to full-res for SSR/first paint.
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!showVideo) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const pick = () => setVideoSrc(mq.matches ? HERO_VIDEO_LOW : HERO_VIDEO);
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, [showVideo]);

  // Nudge autoplay (muted autoplay is allowed but some engines need the call).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !showVideo) return;
    const play = () => void v.play().catch(() => {});
    if (v.readyState >= 2) play();
    v.addEventListener("canplay", play, { once: true });
    return () => v.removeEventListener("canplay", play);
  }, [showVideo, videoSrc]);

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

        {showVideo && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER_JPG}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
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
