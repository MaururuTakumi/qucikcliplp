/* =============================================================================
 * honkoma Design System — EmbraceStack scene (blueprint §5① / #19) — [fable-craft]
 *
 * The hero's signature 3D, tuned for a "quiet but certain wow" (LayerX-tier).
 * honkoma's logo (arms embracing an egg / a child) becomes geometry: three open
 * rounded ARCS that close and nest around a small STACK of rounded core cubes
 * (the seed growing upward), with a few floating MOTES ("together").
 *
 * What makes it feel alive (all present even when NOT scrolling):
 *   - the whole group breathes (slow vertical float + micro-sway, two detuned sines)
 *   - each arc drifts + micro-tilts on its own phase (nested arms never still)
 *   - the top cube pulses faintly in scale AND emissive (growth as inner light)
 *   - motes drift on incommensurate sine pairs and glow in slow waves
 *   - a soft contact glow under the group breathes in counter-phase (grounding)
 *   - fresnel rim light lifts every edge off the light background (custom
 *     shader chunk injected into MeshStandardMaterial — one cheap term)
 *   - pointer parallax with LAYERED depth: motes sway most, arcs less, core
 *     stays anchored — a few degrees that read as real dimensionality
 *
 * Cinematic scroll choreography 0 -> 1 (jo-ha-kyū pacing):
 *   0.00        arcs open & scattered, cubes low & apart, motes far & dim
 *   0.00-0.58   the embrace forms INSIDE-OUT: the inner arc hugs first, then
 *               mid, then outer wraps around (staggered easeOutExpo); each arc
 *               takes a tiny outward "inhale" before pulling in (anticipation);
 *               cubes gather bottom-up with a soft damped overshoot (the
 *               "squeeze" of an embrace); the whole group dollies from 92%->100%
 *   0.50-0.75   motes take a synchronized breath toward the center (pulled in
 *               by the embrace) then release into orbit
 *   0.58-1.00   easeInOutCubic turn ~100deg to the isometric hero pose with a
 *               gentle rise; top cube overshoots upward (growth)
 *   never fully static — ambient life continues at rest.
 *
 * Color = single honkoma blue in depth layers (outer soft -> inner accent).
 * Flat/graphical (no photoreal): lighting lives in ScrollScene (hemisphere
 * ambient + warm key + cool fill + slow-drifting accent light); here only the
 * fresnel rim and a hand-painted radial contact glow (NO drei ContactShadows —
 * that re-renders the scene every frame; a gradient sprite is ~free and can
 * breathe with the geometry).
 *
 * Progress & pointer are MotionValues read inside useFrame via .get() — NO React
 * re-render, so it holds 60fps and stays swappable.
 * ========================================================================== */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  Color,
  SphereGeometry,
  CanvasTexture,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  type WebGLProgramParametersWithUniforms,
} from "three";
import type { MotionValue } from "framer-motion";

/* ---- scene time constants (scene-local by design; tokens.ts owns UI time,
 *      these own continuous 3D life — every value named + commented) -------- */
const IDLE_SPIN_SPEED = 0.045;   // rad/s idle yaw at rest (blueprint: ~0.05)
const BREATH_SPEED = 0.55;       // main vertical breathing frequency
const BREATH_AMPLITUDE = 0.09;   // vertical breathing travel (world units)
const SWAY_SPEED = 0.4;          // slow z micro-sway frequency
const ARC_WOBBLE_BASE = 0.5;     // per-arc scale wobble base frequency
const ARC_TILT_SPEED = 0.27;     // per-arc micro-tilt frequency
const CUBE_SWAY_SPEED = 0.7;     // stacked-cube sway frequency
const TOP_PULSE_SPEED = 1.2;     // top cube growth pulse frequency
const MOTE_GLOW_SPEED = 0.7;     // mote emissive wave frequency
const PARALLAX_DAMP = 0.0015;    // pow() base for frame-rate-independent damping

/* ---- easing helpers (kept local; scene motion is not token-bound) --------- */
function easeOutExpo(p: number): number {
  return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
}
function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}
function easeOutCubic(p: number): number {
  return 1 - Math.pow(1 - p, 3);
}
/** Back-out with tunable overshoot (s≈1.7 default; smaller = gentler). */
function easeOutBack(p: number, s = 1.70158): number {
  const c3 = s + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
/** Map progress within [start,end] to 0..1. */
function seg(p: number, start: number, end: number): number {
  return clamp01((p - start) / (end - start));
}

/* ---- fresnel rim: one emissive term injected into the standard shader ------
 * totalEmissiveRadiance += rimColor * fresnel^power * strength
 * All rim materials share identical GLSL, so three.js compiles ONE program. */
const RIM_POWER = "2.6";
function makeRimOnBeforeCompile(rimColor: string, rimStrength: number) {
  return (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uRimColor = { value: new Color(rimColor) };
    shader.uniforms.uRimStrength = { value: rimStrength };
    shader.fragmentShader =
      "uniform vec3 uRimColor;\nuniform float uRimStrength;\n" +
      shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        [
          "#include <emissivemap_fragment>",
          "float hkFresnel = pow(1.0 - saturate(dot(normalize(vViewPosition), normal)), " + RIM_POWER + ");",
          "totalEmissiveRadiance += uRimColor * hkFresnel * uRimStrength;",
        ].join("\n"),
      );
  };
}

export type EmbraceStackProps = {
  /** Scroll-linked progress 0..1. */
  progress: MotionValue<number>;
  /** Normalized pointer parallax, each -1..1 (from ScrollScene). Optional. */
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
  /** Resolved hex colors: [soft, bright, accent]. */
  colors: { soft: string; bright: string; accent: string };
  /** true = simplified mobile build (fewer arcs/cubes, no motes, less motion). */
  lite?: boolean;
  reducedMotion?: boolean;
};

/** Arc = a partial torus. Fixed generous arc reads as "an embracing arm". */
function Arc({
  radius,
  color,
  rim,
  opacity,
  tube,
  roughness,
  segments,
}: {
  radius: number;
  color: string;
  rim: string;
  opacity: number;
  tube: number;
  roughness: number;
  segments: number;
}) {
  const onBeforeCompile = useMemo(
    () => makeRimOnBeforeCompile(rim, 0.34),
    [rim],
  );
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, segments, Math.max(28, segments * 2), Math.PI * 1.25]} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={roughness}
        metalness={0.05}
        envMapIntensity={0.6}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}

/** Hand-painted radial gradient — the soft contact glow under the group. */
function useContactGlowTexture(hex: string): CanvasTexture | null {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const c = new Color(hex);
    const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
    // Deliberately faint: over the warm light background a strong blue wash
    // drifts toward purple (brand: no purple). Keep it a whisper of a shadow.
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `rgba(${rgb},0.20)`);
    grad.addColorStop(0.5, `rgba(${rgb},0.07)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, [hex]);
  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

export function EmbraceStack({
  progress,
  pointerX,
  pointerY,
  colors,
  lite = false,
  reducedMotion = false,
}: EmbraceStackProps) {
  const root = useRef<Group>(null);     // pointer parallax + big turn + idle spin
  const floatRef = useRef<Group>(null); // ambient breathing float (separate axis)
  const arcsRef = useRef<Group>(null);
  const cubesRef = useRef<Group>(null);
  const motesRef = useRef<Group>(null);
  const topCubeRef = useRef<Mesh>(null);
  const shadowRef = useRef<Mesh>(null);

  // Damped pointer state (so parallax eases toward the target, never snaps).
  const parallax = useRef({ x: 0, y: 0 });

  const moteCount = lite ? 0 : 8;

  // Per-arc config. Outer arc softest (more matte), inner crisper.
  // closeStart/closeEnd = the staggered inside-out embrace (inner hugs first).
  const arcConfig = useMemo(() => {
    const all = [
      { r: 2.0, color: colors.soft, opacity: 0.82, tube: 0.14, roughness: 0.7, phase: 0.0, drift: 0.9, closeStart: 0.1, closeEnd: 0.58 },
      { r: 1.44, color: colors.bright, opacity: 1, tube: 0.16, roughness: 0.5, phase: 0.26, drift: 1.3, closeStart: 0.05, closeEnd: 0.5 },
      { r: 0.96, color: colors.accent, opacity: 1, tube: 0.18, roughness: 0.42, phase: 0.52, drift: 1.7, closeStart: 0.0, closeEnd: 0.42 },
    ];
    return lite ? [all[0], all[2]] : all;
  }, [colors, lite]);

  // Cubes gather bottom-up (closeStart staggered) with a soft damped overshoot.
  const cubeConfig = useMemo(() => {
    const all = [
      { scale: 0.9, color: colors.accent, y: 0.0, closeStart: 0.0, closeEnd: 0.46 },
      { scale: 0.7, color: colors.bright, y: 0.62, closeStart: 0.06, closeEnd: 0.52 },
      { scale: 0.55, color: colors.bright, y: 1.12, closeStart: 0.12, closeEnd: 0.58 },
    ];
    return lite ? [all[0], all[1]] : all;
  }, [colors, lite]);

  const moteConfig = useMemo(() => {
    return Array.from({ length: moteCount }).map((_, i) => {
      const a = (i / Math.max(1, moteCount)) * Math.PI * 2;
      return {
        angle: a,
        radius: 2.3 + (i % 3) * 0.4,
        y: (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.28),
        speed: 0.18 + (i % 4) * 0.05,        // organic per-mote drift speed
        bobAmp: 0.12 + (i % 3) * 0.05,       // vertical bob amplitude
        bobPhase: i * 1.7,
        closeStart: 0.08 + (i % 4) * 0.05,   // staggered convergence
        closeEnd: 0.58 + (i % 3) * 0.05,
        size: 0.85 + (i % 3) * 0.18,         // varied mote sizes (organic)
      };
    });
  }, [moteCount]);

  // Shared mote geometry (one buffer for all motes; materials stay unique so
  // each mote can glow on its own phase).
  const moteGeometry = useMemo(() => new SphereGeometry(0.05, 14, 14), []);
  useEffect(() => () => moteGeometry.dispose(), [moteGeometry]);

  const cubeRim = useMemo(() => makeRimOnBeforeCompile(colors.soft, 0.3), [colors.soft]);
  const glowTexture = useContactGlowTexture(colors.accent);

  useFrame((state, delta) => {
    const p = progress.get();
    const t = state.clock.getElapsedTime();

    const close = easeOutExpo(seg(p, 0.0, 0.55));  // master embrace amount
    const turnRaw = seg(p, 0.58, 1.0);
    const turn = easeInOutCubic(turnRaw);          // cinematic settle to hero pose
    const grow = easeOutBack(seg(p, 0.7, 1.0));    // top cube growth overshoot
    const dolly = easeOutCubic(seg(p, 0.0, 0.55)); // gentle scale dolly 92% -> 100%

    // --- pointer parallax (damped toward target). Disabled on lite/reduced. ---
    if (!lite && !reducedMotion) {
      const tx = pointerX ? pointerX.get() : 0;
      const ty = pointerY ? pointerY.get() : 0;
      // frame-rate independent damping
      const k = 1 - Math.pow(PARALLAX_DAMP, delta);
      parallax.current.x = lerp(parallax.current.x, tx, k);
      parallax.current.y = lerp(parallax.current.y, ty, k);
    }
    const par = parallax.current;

    // --- root: big turn + rise + idle spin + pointer tilt + scale dolly ---
    if (root.current) {
      const idle = reducedMotion ? 0 : t * (lite ? IDLE_SPIN_SPEED * 0.5 : IDLE_SPIN_SPEED);
      const parX = par.x * 0.18; // ~±10deg max yaw
      const parY = par.y * 0.12; // ~±7deg max pitch
      root.current.rotation.y = lerp(-0.5, 1.9, turn) + idle + parX;
      root.current.rotation.x = lerp(0.15, 0.0, close) - parY;
      root.current.position.y = lerp(0, 0.12, turn); // gentle rise into hero pose
      const s = (lite ? 0.85 : 1) * lerp(0.92, 1, dolly);
      root.current.scale.setScalar(s);
    }

    // --- ambient breathing: two detuned sines (never a metronome) ---
    if (floatRef.current && !reducedMotion) {
      floatRef.current.position.y =
        Math.sin(t * BREATH_SPEED) * BREATH_AMPLITUDE +
        Math.sin(t * BREATH_SPEED * 1.73 + 1.2) * BREATH_AMPLITUDE * 0.25;
      floatRef.current.rotation.z = Math.sin(t * SWAY_SPEED) * 0.015;
      floatRef.current.rotation.y = Math.sin(t * SWAY_SPEED * 0.62 + 2.1) * 0.012;
    }

    // --- arcs: inside-out staggered close, with an anticipation "inhale" ---
    if (arcsRef.current) {
      // arcs parallax layer: mid depth
      arcsRef.current.position.x = par.x * 0.08;
      arcsRef.current.children.forEach((child, i) => {
        const cfg = arcConfig[i];
        if (!cfg) return;
        const closeI = easeOutExpo(seg(p, cfg.closeStart, cfg.closeEnd));
        // anticipation: a small outward breath right before the pull-in
        const inhale = Math.sin(clamp01(closeI * 3) * Math.PI) * (1 - closeI) * 0.05;
        const spread = lerp(1.7, 1.0, closeI) + inhale;
        const wobble = reducedMotion ? 0 : Math.sin(t * (ARC_WOBBLE_BASE + i * 0.12) + cfg.phase * 6) * 0.03;
        child.scale.setScalar(spread + wobble);
        const drift = reducedMotion ? 0 : Math.sin(t * 0.3 * cfg.drift + i) * 0.05;
        child.rotation.y = lerp(cfg.phase - 0.8, cfg.phase, closeI) + drift;
        // micro-tilt on own phase — arms subtly re-settling around the core
        child.rotation.x = reducedMotion ? 0 : Math.sin(t * ARC_TILT_SPEED * cfg.drift + i * 2.4) * 0.02 * closeI;
        child.position.y = lerp(0.4 - i * 0.3, 0, closeI);
      });
    }

    // --- cubes: gather bottom-up with a soft damped overshoot (the squeeze) ---
    if (cubesRef.current) {
      cubesRef.current.children.forEach((child, i) => {
        const cfg = cubeConfig[i];
        if (!cfg) return;
        const closeC = seg(p, cfg.closeStart, cfg.closeEnd);
        const arrive = easeOutBack(closeC, 0.9); // mild overshoot = embraced, not dropped
        const startY = -1.2 - i * 0.5;
        const sway = reducedMotion ? 0 : Math.sin(t * CUBE_SWAY_SPEED + i * 1.3) * 0.02 * closeC;
        child.position.y = lerp(startY, cfg.y, arrive) + sway;
        const scatter = lerp(0.7, 0, easeOutExpo(closeC));
        child.position.x = (i % 2 === 0 ? 1 : -1) * scatter;
        child.rotation.y = reducedMotion ? 0 : Math.sin(t * 0.5 + i) * 0.04 * closeC;
      });
    }
    if (topCubeRef.current) {
      const base = cubeConfig[cubeConfig.length - 1].scale;
      const breathe = reducedMotion ? 1 : 1 + Math.sin(t * TOP_PULSE_SPEED) * 0.03;
      const growScale = 1 + 0.14 * grow; // rises up at the very end
      topCubeRef.current.scale.setScalar(base * breathe * growScale);
      // growth as inner light: faint emissive pulse, brighter once grown
      const mat = topCubeRef.current.material as MeshStandardMaterial;
      const glowWave = reducedMotion ? 0 : (Math.sin(t * TOP_PULSE_SPEED * 0.8 + 0.7) * 0.5 + 0.5);
      mat.emissiveIntensity = 0.04 + glowWave * 0.08 + grow * 0.08;
    }

    // --- motes: incommensurate-sine drift, a synchronized "breath in" at the
    //     embrace climax, then release into orbit; each glows on its own phase ---
    if (motesRef.current) {
      // motes are the foreground layer: strongest parallax
      motesRef.current.position.x = par.x * 0.22;
      motesRef.current.position.y = -par.y * 0.14;
      // one shared breath: pulled toward the center as the embrace completes
      const breathIn = Math.sin(seg(p, 0.5, 0.75) * Math.PI) * 0.3;
      motesRef.current.children.forEach((child, i) => {
        const cfg = moteConfig[i];
        if (!cfg) return;
        const closeM = easeOutExpo(seg(p, cfg.closeStart, cfg.closeEnd));
        const orbit = reducedMotion ? cfg.angle : cfg.angle + t * cfg.speed * (0.4 + turn * 0.8);
        // organic radius: two incommensurate sines, tighten with the embrace
        const flow = reducedMotion
          ? 0
          : Math.sin(t * 0.31 + cfg.bobPhase) * 0.12 + Math.sin(t * 0.53 + cfg.bobPhase * 2.3) * 0.06;
        const rad = lerp(cfg.radius * 1.5, cfg.radius, closeM) + flow - breathIn * closeM;
        const bob = reducedMotion
          ? cfg.y
          : cfg.y + Math.sin(t * 0.8 + cfg.bobPhase) * cfg.bobAmp + Math.sin(t * 1.31 + cfg.bobPhase * 1.7) * cfg.bobAmp * 0.3;
        child.position.set(Math.cos(orbit) * rad, bob, Math.sin(orbit) * rad);
        // scale in as they approach + gentle per-mote pulse
        const pulse = reducedMotion ? 0 : Math.sin(t * 0.9 + cfg.bobPhase) * 0.08;
        child.scale.setScalar(cfg.size * (0.7 + 0.3 * closeM + pulse));
        // slow glow waves traveling around the ring
        const mesh = child as Mesh;
        const mat = mesh.material as MeshStandardMaterial;
        const wave = reducedMotion ? 0.5 : Math.sin(t * MOTE_GLOW_SPEED + cfg.bobPhase) * 0.5 + 0.5;
        mat.emissiveIntensity = 0.18 + wave * 0.3 + closeM * 0.1;
      });
    }

    // --- contact glow: breathes in counter-phase with the float (grounding) ---
    if (shadowRef.current) {
      const breathe = reducedMotion ? 0 : Math.sin(t * BREATH_SPEED) * BREATH_AMPLITUDE;
      const mat = shadowRef.current.material as MeshBasicMaterial;
      // object rises -> shadow softens & spreads; object settles -> firms up
      mat.opacity = 0.5 - breathe * 1.1;
      const spread = 1 + breathe * 0.35;
      shadowRef.current.scale.set(spread, spread, 1);
    }
  });

  return (
    <group>
      <group ref={root} scale={lite ? 0.85 : 1}>
        <group ref={floatRef}>
          {/* Embrace arcs (the "arms") */}
          <group ref={arcsRef}>
            {arcConfig.map((cfg, i) => (
              <group key={`arc-${i}`}>
                <Arc
                  radius={cfg.r}
                  color={cfg.color}
                  rim={colors.soft}
                  opacity={cfg.opacity}
                  tube={cfg.tube}
                  roughness={cfg.roughness}
                  segments={lite ? 14 : 22}
                />
              </group>
            ))}
          </group>

          {/* Core cubes (the seed / child growing upward) */}
          <group ref={cubesRef}>
            {cubeConfig.map((cfg, i) => {
              const isTop = i === cubeConfig.length - 1;
              return (
                <RoundedBox
                  key={`cube-${i}`}
                  ref={isTop ? topCubeRef : undefined}
                  args={[cfg.scale, cfg.scale, cfg.scale]}
                  radius={cfg.scale * 0.18}
                  smoothness={3}
                >
                  <meshStandardMaterial
                    color={cfg.color}
                    emissive={colors.bright}
                    emissiveIntensity={0.04}
                    roughness={0.45}
                    metalness={0.05}
                    envMapIntensity={0.7}
                    onBeforeCompile={cubeRim}
                  />
                </RoundedBox>
              );
            })}
          </group>

          {/* Motes ("together") — shared geometry, unique glowing materials */}
          {moteCount > 0 && (
            <group ref={motesRef}>
              {moteConfig.map((_, i) => (
                <mesh key={`mote-${i}`} geometry={moteGeometry}>
                  <meshStandardMaterial
                    color={colors.bright}
                    emissive={colors.bright}
                    emissiveIntensity={0.3}
                    roughness={0.35}
                  />
                </mesh>
              ))}
            </group>
          )}
        </group>
      </group>

      {/* Soft contact glow — a gradient sprite (near-free, unlike drei
          ContactShadows which re-renders the scene each frame) that breathes
          in counter-phase with the float. Outside `root` so parallax tilt
          never skews the ground plane. */}
      {!lite && glowTexture && (
        <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]}>
          <planeGeometry args={[4.6, 4.6]} />
          <meshBasicMaterial map={glowTexture} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export default EmbraceStack;
