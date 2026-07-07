/* =============================================================================
 * honkoma Design System — SurfaceCard — [structural]
 *
 * The single raised content card used across every page (特性/価値観/事例/職種…).
 * Previously each page re-declared its own inline `Card` and they had drifted
 * (padding 1.6 vs 1.75, flex vs block). Unifying here keeps surface / radius /
 * padding / shadow identical site-wide — the base of the site's 統一感.
 *
 * `style` は個別上書き用（従来 ProductPage が使っていた口を温存）。
 * ========================================================================== */

import type { CSSProperties, ReactNode } from "react";

export type SurfaceCardProps = {
  children: ReactNode;
  /** Per-instance overrides (merged last). */
  style?: CSSProperties;
  className?: string;
};

export function SurfaceCard({ children, style, className }: SurfaceCardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(1.75rem, 3vw, 2.5rem)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default SurfaceCard;
