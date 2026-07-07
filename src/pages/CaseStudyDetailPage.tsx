/* =============================================================================
 * CaseStudyDetailPage (/case-studies/:slug) — 導入事例 個別記事
 *
 * 記事の型: 課題 → 取り組み → 成果 → お客様の声 → 問い合わせ動線。
 * データは src/data/caseStudies.ts（本文は取引先Q&A回収後に差し替え）。
 * 記事末尾CTAは fable 設計(docs/case-study-conversion-design.md)を反映予定。
 * ========================================================================== */

import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SectionShell } from "../components/Layout/SectionShell";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/motion/Reveal";
import { ArrowCTA } from "../components/ui/ArrowCTA";
import { AIStarterBand } from "../features/ai-chat/components/AIStarterBand";
import { getCaseStudy } from "../data/caseStudies";

function Block({ en, title, children }: { en: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}>
      <span
        className="font-en"
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
        }}
      >
        {en}
      </span>
      <h2
        style={{
          fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)",
          fontWeight: 700,
          margin: "0.5rem 0 1.25rem",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

const paraStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
  lineHeight: 1.95,
};

const CaseStudyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const cs = slug ? getCaseStudy(slug) : undefined;

  useEffect(() => {
    if (cs) document.title = `${cs.company}｜導入事例 | honkoma`;
  }, [cs]);

  if (!cs) return <Navigate to="/case-studies" replace />;

  return (
    <div style={{ background: "var(--surface-base)" }}>
      {/* ===== HERO ===== */}
      <SectionShell>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            to="/case-studies"
            className="font-en"
            style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none" }}
          >
            ← Case Studies
          </Link>
        </div>
        <div style={{ minHeight: 34, marginBottom: "1rem", display: "flex", alignItems: "center" }}>
          {cs.logo ? (
            <img src={cs.logo} alt={cs.company} style={{ height: 30, objectFit: "contain" }} />
          ) : (
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.1rem" }}>{cs.company}</span>
          )}
        </div>
        <SectionHeading enLabel={cs.industry} title={cs.oneLiner} level={1} />
        <Reveal variant="fade">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.5rem" }}>
            {cs.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  background: "color-mix(in srgb, var(--text-primary) 6%, transparent)",
                  borderRadius: "var(--radius-pill)",
                  padding: "0.3rem 0.8rem",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </SectionShell>

      {/* ===== BODY ===== */}
      <SectionShell wedge="top" width="content">
        <div style={{ maxWidth: 760 }}>
          <Block en="Challenge" title="課題">
            <p style={paraStyle}>{cs.challenge}</p>
          </Block>

          <Block en="What We Did" title="取り組み">
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {cs.actions.map((a) => (
                <li key={a} style={{ display: "flex", gap: "0.75rem", ...paraStyle }}>
                  <span aria-hidden="true" style={{ color: "var(--color-accent)", fontWeight: 700 }}>—</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block en="Outcome" title="成果">
            <p style={paraStyle}>{cs.outcome}</p>
          </Block>

          {cs.quote && (
            <blockquote
              style={{
                margin: "clamp(2rem, 4vw, 3rem) 0 0",
                padding: "clamp(1.75rem, 3vw, 2.5rem)",
                background: "var(--surface-raised)",
                borderRadius: "var(--radius-lg)",
                borderLeft: "3px solid var(--color-accent)",
              }}
            >
              <p style={{ ...paraStyle, color: "var(--text-primary)", fontWeight: 500 }}>「{cs.quote}」</p>
              {cs.role && (
                <footer className="font-en" style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  — {cs.role}
                </footer>
              )}
            </blockquote>
          )}
        </div>
      </SectionShell>

      {/* ===== CONVERSION (case-study-conversion-design §2.2) =====
       * 主=記事末尾のインラインAI診断(source=cases)。inverseにしない=記事の余韻の
       * まま静かに(売り込みモード切替に見せない)。副=/contactを下に1行・対等にしない。
       * ghost=一覧へ(逃げ道=回遊)。読中CTAは置かない(証明力を守る)。 */}
      <div style={{ borderTop: "1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)" }}>
        <AIStarterBand
          source="cases"
          compact
          title="同じ問いを、御社の現場に。"
          body={`${cs.industry}のこの事例と同じ観点で、AIが御社サイトを読み、活用案を3つ返します。無料です。`}
        />
      </div>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 var(--space-gutter) clamp(3.5rem, 7vw, 5.5rem)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        <ArrowCTA to="/contact" variant="outline" withText="導入の進め方を相談する" label="導入の進め方を相談する" />
        <ArrowCTA to="/case-studies" variant="ghost" withText="導入事例一覧へ" label="導入事例一覧へ" />
      </div>
    </div>
  );
};

export default CaseStudyDetailPage;
