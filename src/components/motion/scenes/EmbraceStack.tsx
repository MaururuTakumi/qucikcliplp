/* =============================================================================
 * honkoma Design System — EmbraceStack scene (blueprint §5① / #19) — [fable-craft]
 *
 * The hero's signature 3D. LayerX uses stacked "layers"; honkoma translates its
 * logo (arms embracing an egg / a child) into geometry: three open rounded ARCS
 * that close and nest around a small STACK of rounded core cubes (the seed /
 * child growing upward), with a few floating MOTES ("together / gathering").
 *
 * Story across progress 0 -> 1:
 *   0.00       arcs open & scattered, cubes low & apart, motes dispersed
 *   0.00-0.55  arcs close inward and nest (the embrace forms), cubes gather &
 *              stack upward
 *   0.55-1.00  the finished whole rotates ~100deg to the isometric hero pose;
 *              motes begin a gentle orbit; top cube breathes upward (growth)
 *   1.00       never fully static — slow idle rotation + mote orbit stay alive
 *
 * Color = single honkoma blue in depth layers: outer arc lightest (soft),
 * inner arc deepest (accent), cubes accent->bright bottom-to-top. The accent
 * hex is resolved from a CSS variable at mount so token swaps reach the 3D.
 *
 * Motion is driven by a progress MotionValue read inside useFrame via .get()
 * (NO React re-render). Lighting is flat (ambient + one warm key light), no
 * shadows — graphical, not photoreal.
 * ========================================================================== */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { MotionValue } from "framer-motion";

/** easeOutExpo approximation used for the "arc closing" feel. */
function easeOutExpo(p: number): number {
  return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
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

export type EmbraceStackProps = {
  /** Scroll-linked progress 0..1. */
  progress: MotionValue<number>;
  /** Resolved hex colors: [soft, bright, accent]. */
  colors: { soft: string; bright: string; accent: string };
  /** true = simplified mobile build (fewer arcs/cubes, no motes, less spin). */
  lite?: boolean;
  reducedMotion?: boolean;
};

/** Arc = a partial torus. We tune arc length via the `arc` geometry arg. */
function Arc({
  radius,
  color,
  opacity,
  tube,
  segments,
}: {
  radius: number;
  color: string;
  opacity: number;
  tube: number;
  segments: number;
}) {
  // Rendered arc length is animated in the parent by scaling geometry? No —
  // torus arc length can't be animated cheaply, so we animate the group's
  // rotation/position and keep a fixed generous arc that reads as "an embrace".
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, segments, Math.max(24, segments * 2), Math.PI * 1.25]} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.55}
        metalness={0.05}
      />
    </mesh>
  );
}

export function EmbraceStack({ progress, colors, lite = false, reducedMotion = false }: EmbraceStackProps) {
  const root = useRef<Group>(null);
  const arcsRef = useRef<Group>(null);
  const cubesRef = useRef<Group>(null);
  const motesRef = useRef<Group>(null);
  const topCubeRef = useRef<Mesh>(null);

  const moteCount = lite ? 0 : 7;

  // Per-arc static config (radius ratio + phase offset for the "nested arms").
  const arcConfig = useMemo(() => {
    const all = [
      { r: 2.0, color: colors.soft, opacity: 0.85, tube: 0.14, phase: 0.0 },
      { r: 1.44, color: colors.bright, opacity: 1, tube: 0.16, phase: 0.26 },
      { r: 0.96, color: colors.accent, opacity: 1, tube: 0.18, phase: 0.52 },
    ];
    return lite ? [all[0], all[2]] : all;
  }, [colors, lite]);

  const cubeConfig = useMemo(() => {
    const all = [
      { scale: 0.9, color: colors.accent, y: 0.0 },
      { scale: 0.7, color: colors.bright, y: 0.62 },
      { scale: 0.55, color: colors.bright, y: 1.12 },
    ];
    return lite ? [all[0], all[1]] : all;
  }, [colors, lite]);

  const moteConfig = useMemo(() => {
    return Array.from({ length: moteCount }).map((_, i) => {
      const a = (i / Math.max(1, moteCount)) * Math.PI * 2;
      return { angle: a, radius: 2.4 + (i % 3) * 0.35, y: (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.25) };
    });
  }, [moteCount]);

  useFrame((state) => {
    const p = progress.get();
    const t = state.clock.getElapsedTime();

    const close = easeOutExpo(seg(p, 0.0, 0.55)); // embrace forms
    const turn = seg(p, 0.55, 1.0);               // rotate to hero pose

    // Root pose: slight initial tilt -> settle, plus the big turn + idle spin.
    if (root.current) {
      const idle = reducedMotion ? 0 : t * 0.05;
      root.current.rotation.y = lerp(-0.5, 1.9, turn) + idle; // ~ -28deg -> ~109deg
      root.current.rotation.x = lerp(0.15, 0.0, close);
    }

    // Arcs: nest inward as they close (scatter -> defined radius) + phase spin.
    if (arcsRef.current) {
      arcsRef.current.children.forEach((child, i) => {
        const cfg = arcConfig[i];
        if (!cfg) return;
        const spread = lerp(1.7, 1.0, close); // start pushed out, settle to 1.0
        child.scale.setScalar(spread);
        child.rotation.y = lerp(cfg.phase - 0.8, cfg.phase, close);
        child.position.y = lerp(0.4 - i * 0.3, 0, close);
      });
    }

    // Cubes: gather from below and stack upward; top cube breathes (growth).
    if (cubesRef.current) {
      cubesRef.current.children.forEach((child, i) => {
        const cfg = cubeConfig[i];
        if (!cfg) return;
        const targetY = cfg.y;
        const startY = -1.2 - i * 0.5;
        child.position.y = lerp(startY, targetY, close);
        const scatter = lerp(0.7, 0, close);
        child.position.x = (i % 2 === 0 ? 1 : -1) * scatter;
      });
    }
    if (topCubeRef.current && !reducedMotion) {
      const breathe = 1 + Math.sin(t * 1.2) * 0.03 * turn;
      const base = cubeConfig[cubeConfig.length - 1].scale;
      topCubeRef.current.scale.setScalar(base * breathe);
    }

    // Motes: dispersed at 0, gentle orbit once embraced.
    if (motesRef.current) {
      motesRef.current.children.forEach((child, i) => {
        const cfg = moteConfig[i];
        if (!cfg) return;
        const orbit = reducedMotion ? cfg.angle : cfg.angle + t * 0.25 * turn;
        const rad = lerp(cfg.radius * 1.4, cfg.radius, close);
        child.position.set(Math.cos(orbit) * rad, cfg.y, Math.sin(orbit) * rad);
      });
    }
  });

  return (
    <group ref={root} scale={lite ? 0.85 : 1}>
      {/* Embrace arcs (the "arms") */}
      <group ref={arcsRef}>
        {arcConfig.map((cfg, i) => (
          <group key={`arc-${i}`}>
            <Arc
              radius={cfg.r}
              color={cfg.color}
              opacity={cfg.opacity}
              tube={cfg.tube}
              segments={lite ? 12 : 20}
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
              <meshStandardMaterial color={cfg.color} roughness={0.5} metalness={0.05} />
            </RoundedBox>
          );
        })}
      </group>

      {/* Motes ("together") */}
      {moteCount > 0 && (
        <group ref={motesRef}>
          {moteConfig.map((_, i) => (
            <mesh key={`mote-${i}`}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial
                color={colors.bright}
                emissive={colors.bright}
                emissiveIntensity={0.25}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

export default EmbraceStack;
