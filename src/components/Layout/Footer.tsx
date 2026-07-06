/* =============================================================================
 * honkoma Footer — site map + trust anchor (site-ia-design §5).
 *
 * Full-IA rebuild: 4 columns (私たちについて / サービス / 導入事例・お問い合わせ /
 * 採用情報) + tagline. Legacy links removed: D2C支援, 口コミAI, and the per-plan
 * anchors (/product#standard 等) → collapsed to a single "プラン" link (M1/M10).
 * "AIに聞いてみる" fires the ChatDrawer (source=footer, 起動点G) — the reader who
 * reached the very bottom is the hottest. Navy surface via data-theme="inverse"
 * so semantic tokens flip; legacy cream/ink Tailwind tokens are not used here.
 * ========================================================================== */

import React from "react";
import { Link } from "react-router-dom";
import { useAiChat } from "../../features/ai-chat/ChatProvider";

/* --- link data ------------------------------------------------------------- */

type FLink = { label: string; to: string };

const COL_ABOUT: FLink[] = [
  { label: "ミッション・行動指針", to: "/about" },
  { label: "会社概要", to: "/about#profile" },
  { label: "メンバー", to: "/team" },
];

const COL_SERVICE: FLink[] = [
  { label: "AI導入", to: "/product" },
  { label: "FDE", to: "/product" },
  { label: "プロダクト開発", to: "/product" },
  { label: "プラン", to: "/product#plans" },
  { label: "ホテル向け", to: "/hotel" },
];

const COL_CONTACT: FLink[] = [
  { label: "導入事例", to: "/case-studies" },
  { label: "お問い合わせ", to: "/contact" },
];

const COL_RECRUIT: FLink[] = [
  { label: "採用情報", to: "/recruit" },
  { label: "メンバー", to: "/team" },
];

const X_URL = "https://x.com/moriyorihayash1";

/* --- scoped hover stylesheet (injected once, ArrowCTA/Header pattern) ------- */

const FOOTER_STYLE = `
.hkfoot {
  background: var(--surface-base);
  color: var(--text-secondary);
}
.hkfoot-h {
  font-family: var(--font-en);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--text-primary) 55%, transparent);
}
.hkfoot-link {
  display: inline-block;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-secondary);
  text-decoration: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  transition: color 0.18s ease;
}
@media (hover: hover) {
  .hkfoot-link:hover { color: var(--color-accent-bright); }
}
.hkfoot-link:focus-visible {
  outline: none;
  color: var(--color-accent-bright);
  box-shadow: 0 0 0 2px var(--focus-ring);
  border-radius: var(--radius-sm);
}
`;

let footStyleInjected = false;
function useFooterStyles() {
  React.useEffect(() => {
    if (footStyleInjected || typeof document === "undefined") return;
    const el = document.createElement("style");
    el.setAttribute("data-hkfoot", "");
    el.textContent = FOOTER_STYLE;
    document.head.appendChild(el);
    footStyleInjected = true;
  }, []);
}

/* --- column ---------------------------------------------------------------- */

function FooterCol({
  heading,
  links,
  children,
}: {
  heading: string;
  links: FLink[];
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="hkfoot-h" style={{ marginBottom: "1.25rem" }}>
        {heading}
      </h3>
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {links.map((l) => (
          <li key={l.label + l.to}>
            <Link to={l.to} className="hkfoot-link">
              {l.label}
            </Link>
          </li>
        ))}
        {children}
      </ul>
    </div>
  );
}

/* --- component ------------------------------------------------------------- */

const Footer: React.FC = () => {
  useFooterStyles();
  const { openChat } = useAiChat();

  return (
    <footer className="hkfoot" data-theme="inverse">
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(3.5rem, 8vw, 6rem) var(--space-gutter) 2.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "clamp(2.5rem, 5vw, 4rem)",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {/* Brand + tagline */}
          <div style={{ gridColumn: "1 / -1", maxWidth: 360 }}>
            <Link
              to="/"
              aria-label="honkoma ホーム"
              style={{
                display: "inline-block",
                marginBottom: "1.25rem",
                fontFamily: "var(--font-en)",
                fontSize: "1.6rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--text-primary)",
                textDecoration: "none",
              }}
            >
              honkoma
            </Link>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              まだ見ぬ未来を、一緒に。
            </p>
          </div>

          <FooterCol heading="私たちについて" links={COL_ABOUT} />
          <FooterCol heading="サービス" links={COL_SERVICE} />
          <FooterCol heading="導入事例・お問い合わせ" links={COL_CONTACT}>
            <li>
              <button
                type="button"
                className="hkfoot-link"
                onClick={() => openChat({ source: "footer" })}
              >
                AIに聞いてみる
              </button>
            </li>
          </FooterCol>
          <FooterCol heading="採用情報" links={COL_RECRUIT} />
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: "clamp(2.5rem, 6vw, 4rem)",
            paddingTop: "1.75rem",
            borderTop:
              "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem 1.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1.75rem",
            }}
          >
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hkfoot-link"
            >
              X @moriyorihayash1
            </a>
            <Link to="/privacy" className="hkfoot-link">
              プライバシーポリシー
            </Link>
          </div>
          <p
            style={{
              fontFamily: "var(--font-en)",
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
              color: "color-mix(in srgb, var(--text-primary) 45%, transparent)",
            }}
          >
            © {new Date().getFullYear()} 株式会社honkoma
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
