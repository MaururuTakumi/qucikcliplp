/* =============================================================================
 * honkoma Design System — ScrollScene (blueprint §2 P-4 / #19) — [fable-craft]
 *
 * The reusable r3f wrapper. It owns Canvas lifecycle, scroll->progress wiring,
 * WebGL/reduced-motion/mobile fallbacks, and viewport-out rAF pausing — so
 * geometry stays a swappable `scene` preset (embraceStack today).
 *
 * Scroll linkage: Framer Motion useScroll -> a progress MotionValue read inside
 * the scene's useFrame via .get() (no React re-render = 60fps).
 *
 * This whole module is meant to be React.lazy()'d by callers so three/fiber/drei
 * never touch the bundle of pages that don't use 3D.
 * ========================================================================== */

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll, useReducedMotion, useMotionValue, type MotionValue } from "framer-motion";
import type { PointLight } from "three";
import { scroll as scrollTokens } from "../../design/tokens";
import { EmbraceStack } from "./scenes/EmbraceStack";

export type ScenePreset = "embraceStack";

export type ScrollSceneProps = {
  scene?: ScenePreset;
  /** External progress (0..1). If omitted, wrapper derives it from its own scroll. */
  progress?: MotionValue<number>;
  /** CSS var name resolved to the material accent. Default '--color-accent'. */
  accentVar?: string;
  /** Static image shown when WebGL unavailable / reduced-motion / no support. */
  fallback?: ReactNode;
  /** Mobile behavior. 'lite' = simplified geometry, dpr 1. Default 'lite'. */
  mobile?: "full" | "lite" | "fallback";
  className?: string;
  ariaLabel?: string;
};

/** Resolve up to three depth colors from CSS custom properties at mount. */
function useResolvedColors(accentVar: string) {
  const [colors, setColors] = useState({
    soft: "#DCEEFF",
    bright: "#2F9BFF",
    accent: "#0462CB",
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const cs = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
    setColors({
      soft: read("--color-accent-soft", "#DCEEFF"),
      bright: read("--color-accent-bright", "#2F9BFF"),
      accent: read(accentVar, "#0462CB"),
    });
  }, [accentVar]);
  return colors;
}

/** Cheap WebGL support probe. */
function webglAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function useIsMobile(breakpoint = 768): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return m;
}

/** Pause rAF when the wrapper is scrolled out of view (GPU saver). */
function useInViewFrameloop(ref: React.RefObject<HTMLElement>) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return active;
}

/**
 * Capture pointer (and device tilt) into normalized -1..1 MotionValues, relative
 * to the host element's center. Written outside React render (no re-render) so
 * the scene reads them in useFrame. Disabled when `enabled` is false (mobile
 * lite / reduced motion).
 */
function usePointerParallax(
  ref: React.RefObject<HTMLElement>,
  enabled: boolean,
  x: MotionValue<number>,
  y: MotionValue<number>,
) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      x.set(clampSigned(((e.clientX - cx) / (r.width / 2)) || 0));
      y.set(clampSigned(((e.clientY - cy) / (r.height / 2)) || 0));
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      // gamma: left/right (-90..90), beta: front/back. Map to a gentle range.
      if (e.gamma == null || e.beta == null) return;
      x.set(clampSigned(e.gamma / 30));
      y.set(clampSigned((e.beta - 45) / 30));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [ref, enabled, x, y]);
}

function clampSigned(v: number): number {
  return v < -1 ? -1 : v > 1 ? 1 : v;
}

/* ---- drift light time constants (scene-local; tokens.ts owns UI time) ----- */
const DRIFT_ORBIT_SPEED = 0.11;  // rad/s — one slow lap ~57s, light wanders
const DRIFT_PULSE_SPEED = 0.23;  // intensity swell frequency
const DRIFT_BASE_INTENSITY = 5;  // candela-ish (physical lights: I/d^2 at ~4.5u)

/**
 * A soft accent point light that slowly wanders around the scene, so
 * highlights migrate across the matte blue surfaces even at rest — the
 * "light is alive" layer of the ambient life. Desktop only (skipped on lite).
 */
function DriftLight({ color }: { color: string }) {
  const ref = useRef<PointLight>(null);
  useFrame((state) => {
    const l = ref.current;
    if (!l) return;
    const t = state.clock.getElapsedTime();
    l.position.set(
      Math.cos(t * DRIFT_ORBIT_SPEED) * 4,
      2.4 + Math.sin(t * DRIFT_ORBIT_SPEED * 0.7) * 0.9,
      Math.sin(t * DRIFT_ORBIT_SPEED) * 4,
    );
    l.intensity = DRIFT_BASE_INTENSITY + Math.sin(t * DRIFT_PULSE_SPEED) * 1.6;
  });
  return <pointLight ref={ref} color={color} intensity={DRIFT_BASE_INTENSITY} distance={12} decay={2} />;
}

export function ScrollScene({
  scene = "embraceStack",
  progress,
  accentVar = "--color-accent",
  fallback,
  mobile = "lite",
  className,
  ariaLabel = "honkoma 3D visual",
}: ScrollSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const colors = useResolvedColors(accentVar);
  const inView = useInViewFrameloop(hostRef);

  // Own scroll progress when none supplied: element enters -> leaves viewport.
  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: scrollTokens.sceneRange as unknown as ["start end", "end start"],
  });
  const ownProgress = useMotionValue(0);
  const activeProgress = progress ?? scrollYProgress ?? ownProgress;

  const [canWebgl, setCanWebgl] = useState(true);
  useEffect(() => setCanWebgl(webglAvailable()), []);

  const useFallback =
    !canWebgl || reduce || (isMobile && mobile === "fallback");
  const lite = isMobile && mobile === "lite";

  // Pointer parallax MotionValues (disabled on lite / reduced motion).
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  usePointerParallax(hostRef, !lite && !reduce, pointerX, pointerY);

  const dpr = useMemo<[number, number]>(() => (lite ? [1, 1] : [1, 1.5]), [lite]);

  // position:relative is REQUIRED as the useScroll target (Framer Motion warns
  // otherwise) and anchors pointer-parallax measurement.
  const hostStyle: React.CSSProperties = { position: "relative" };

  if (useFallback) {
    return (
      <div ref={hostRef} className={className} style={hostStyle} role="img" aria-label={ariaLabel}>
        {fallback ?? <FallbackPlaceholder colors={colors} />}
      </div>
    );
  }

  return (
    <div ref={hostRef} className={className} style={hostStyle} role="img" aria-label={ariaLabel}>
      <Canvas
        dpr={dpr}
        frameloop={inView ? "always" : "demand"}
        orthographic
        camera={{ position: [4, 3.2, 4], zoom: lite ? 70 : 90, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Flat/graphical (no photoreal). The light rig builds honkoma-blue
            depth: a hemisphere gradient (cool sky -> warm ground) as the soft
            environment, a warm key for human warmth, a cool fill so shadows
            keep blue, a faint rim to lift edges off the light background, and
            (desktop only) a slow-wandering accent light so highlights migrate
            even at rest. Scene materials add a subtle fresnel rim on top. */}
        <ambientLight intensity={0.4} />
        <hemisphereLight args={[colors.soft, "#FFF4E8", 0.55]} />
        <directionalLight position={[3, 5, 4]} intensity={0.8} color="#FFF7EE" />
        <directionalLight position={[-4, 1, -2]} intensity={0.3} color="#BFD8FF" />
        <directionalLight position={[-1, 2, -5]} intensity={0.45} color="#EAF3FF" />
        {!lite && <DriftLight color={colors.soft} />}
        <Suspense fallback={null}>
          {scene === "embraceStack" && (
            <EmbraceStack
              progress={activeProgress}
              pointerX={pointerX}
              pointerY={pointerY}
              colors={colors}
              lite={lite}
              reducedMotion={!!reduce}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

/** Minimal on-brand static fallback (Opus may swap a nanobanana render in). */
function FallbackPlaceholder({ colors }: { colors: { soft: string; bright: string; accent: string } }) {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="es-bg" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={colors.soft} stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#es-bg)" />
      {/* three nested embracing arcs */}
      <path d="M110 250 A90 90 0 1 1 290 250" fill="none" stroke={colors.soft} strokeWidth="14" strokeLinecap="round" />
      <path d="M135 245 A66 66 0 1 1 265 245" fill="none" stroke={colors.bright} strokeWidth="15" strokeLinecap="round" />
      <path d="M160 240 A42 42 0 1 1 240 240" fill="none" stroke={colors.accent} strokeWidth="16" strokeLinecap="round" />
      {/* core cubes */}
      <rect x="185" y="205" width="30" height="30" rx="7" fill={colors.accent} />
      <rect x="190" y="178" width="22" height="22" rx="5" fill={colors.bright} />
    </svg>
  );
}

export default ScrollScene;
