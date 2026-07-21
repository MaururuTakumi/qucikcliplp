/* =============================================================================
 * honkoma Design System — SectionShell (blueprint §2 C-5) — [structural]
 *
 * The container that gives every section the same vertical rhythm
 * (--section-py), optional inverse theme (children auto-flip, no props), and
 * optional signature wedge boundary. Page assembly = stacking these.
 * ========================================================================== */

import type { CSSProperties, ElementType, ReactNode } from "react";
import { WedgeDivider } from "../motion/Wedge";

const MAX_WIDTH = { content: "1200px", wide: "1440px", full: "100%" } as const;

export type SectionShellProps = {
  children: ReactNode;
  theme?: "default" | "inverse";
  /** Signature diagonal boundary. */
  wedge?: "top" | "bottom" | "both" | false;
  width?: keyof typeof MAX_WIDTH;
  id?: string;
  as?: "section" | "div" | "footer";
  className?: string;
  style?: CSSProperties;
};

export function SectionShell({
  children,
  theme = "default",
  wedge = false,
  width = "content",
  id,
  as = "section",
  className,
  style,
}: SectionShellProps) {
  const Comp = as as ElementType;
  const showTop = wedge === "top" || wedge === "both";
  const showBottom = wedge === "bottom" || wedge === "both";

  return (
    <Comp
      id={id}
      {...(theme === "inverse" ? { "data-theme": "inverse" } : {})}
      className={className}
      style={{
        background: "var(--surface-base)",
        color: "var(--text-primary)",
        ...style,
      }}
    >
      {showTop && <WedgeDivider direction="ltr" />}
      <div
        style={{
          maxWidth: MAX_WIDTH[width],
          marginInline: "auto",
          paddingInline: width === "full" ? 0 : "var(--space-gutter)",
          paddingBlock: "var(--section-py)",
        }}
      >
        {children}
      </div>
      {showBottom && <WedgeDivider direction="rtl" />}
    </Comp>
  );
}

export default SectionShell;
