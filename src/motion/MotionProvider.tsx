/* =============================================================================
 * honkoma Design System — MotionProvider (blueprint §1.5 / P-0)
 *
 * One place for the motion runtime policy:
 *  - LazyMotion(domAnimation, strict): components use `m.*` (never `motion.*`)
 *    so framer-motion tree-shakes to the smaller feature bundle.
 *  - MotionConfig reducedMotion="user": transform-based animations are
 *    auto-disabled when the OS "reduce motion" setting is on.
 *
 * Mount ONCE at the app root. All primitives then benefit implicitly.
 * `strict` throws in dev if someone imports the full `motion.*` API, which is
 * exactly the guardrail we want for the "m. only" DoD.
 * ========================================================================== */

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

export default MotionProvider;
