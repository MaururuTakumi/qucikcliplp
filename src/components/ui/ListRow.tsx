/* =============================================================================
 * honkoma Design System — ListRow (blueprint §2 C-4) — [structural]
 *
 * The News/実績/press row: date + category pill + logo + headline + link icon.
 * One generic row for the "Latest News" UI and the 導入実績/採用職種 lists.
 * Entry animation is delegated to StaggerGrid (self holds no whileInView).
 * ========================================================================== */

import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "./ListRow.css";

type Pill = { label: string; tone?: "accent" | "neutral" | string };

export type ListRowProps = {
  title: string;
  meta?: string;
  pill?: Pill;
  thumb?: ReactNode;
  href?: string;
  to?: string;
  external?: boolean;
  className?: string;
};

function pillStyle(tone: Pill["tone"]): CSSProperties {
  if (tone === "neutral" || !tone) {
    return {
      background: "color-mix(in srgb, var(--text-primary) 8%, transparent)",
      color: "var(--text-secondary)",
    };
  }
  if (tone === "accent") {
    return { background: "var(--color-accent-soft)", color: "var(--color-accent)" };
  }
  // custom color string
  return { background: `color-mix(in srgb, ${tone} 18%, transparent)`, color: tone };
}

export function ListRow({ title, meta, pill, thumb, href, to, external, className }: ListRowProps) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const cls = `ds-list-row${className ? ` ${className}` : ""}`;

  const inner = (
    <>
      {meta && <span className="ds-list-row__meta font-en">{meta}</span>}
      {pill && (
        <span className="ds-list-row__pill font-en" style={pillStyle(pill.tone)}>
          {pill.label}
        </span>
      )}
      {thumb && <span className="ds-list-row__thumb">{thumb}</span>}
      <span className="ds-list-row__title">{title}</span>
      <span className="ds-list-row__icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}

export default ListRow;
