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
import { Canvas } from "@react-three/fiber";
import { useScroll, useReducedMotion, useMotionValue, type MotionValue } from "framer-motion";
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

  const dpr = useMemo<[number, number]>(() => (lite ? [1, 1] : [1, 1.5]), [lite]);

  if (useFallback) {
    return (
      <div ref={hostRef} className={className} role="img" aria-label={ariaLabel}>
        {fallback ?? <FallbackPlaceholder colors={colors} />}
      </div>
    );
  }

  return (
    <div ref={hostRef} className={className} role="img" aria-label={ariaLabel}>
      <Canvas
        dpr={dpr}
        frameloop={inView ? "always" : "demand"}
        orthographic
        camera={{ position: [4, 3.2, 4], zoom: lite ? 70 : 90, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.75} />
        {/* One warm key light adds human warmth to the honkoma blue. */}
        <directionalLight position={[3, 5, 4]} intensity={0.9} color="#FFF7EE" />
        <Suspense fallback={null}>
          {scene === "embraceStack" && (
            <EmbraceStack
              progress={activeProgress}
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
