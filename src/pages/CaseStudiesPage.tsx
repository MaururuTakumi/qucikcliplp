/* =============================================================================
 * CaseStudiesPage (/case-studies) — 導入事例 一覧（site-ia-design §3.5）
 *
 * カード → 個別記事(/case-studies/:slug) へ遷移する2階層構成。信頼エンジン。
 * 実名(許諾済み)は BuySell / 貞栄会 / 慶洋。匿名は業種+定性(監査#7対応)。
 * 記事末尾の問い合わせ動線は fable 設計(docs/case-study-conversion-design.md)
 * を反映予定 — 本ファイルは一覧の箱。
 * ========================================================================== */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionShell } from "../components/Layout/SectionShell";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaggerGrid } from "../components/ui/StaggerGrid";
import { Reveal } from "../components/motion/Reveal";
import { ArrowCTA } from "../components/ui/ArrowCTA";
import { useAiChat } from "../features/ai-chat/ChatProvider";
import { caseStudies } from "../data/caseStudies";

const CaseStudiesPage = () => {
  const { openChat } = useAiChat();

  useEffect(() => {
    document.title = "導入事例 | honkoma";
  }, []);

  return (
    <div style={{ background: "var(--surface-base)" }}>
      {/* ===== HERO ===== */}
      <SectionShell>
        <SectionHeading enLabel="Case Studies" title="導入事例。" level={1} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "48ch",
              margin: "1.5rem 0 0",
              color: "var(--text-secondary)",
              fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
              lineHeight: 1.95,
            }}
          >
            上場企業を含む、これまで30社以上の現場に伴走してきた。
            honkomaの伴走でAIネイティブへ踏み出した企業の、導入前後の変化を紹介する。
          </p>
        </Reveal>
      </SectionShell>

      {/* ===== CASE CARDS ===== */}
      <SectionShell wedge="top">
        <StaggerGrid columns={{ base: 1, md: 2 }} gap="md">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              to={`/case-studies/${cs.slug}`}
              style={{ textDecoration: "none", height: "100%" }}
            >
              <article
                className="cs-card"
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "var(--radius-lg)",
                  padding: "clamp(1.75rem, 3vw, 2.5rem)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {/* logo or company */}
                <div style={{ minHeight: 32, marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                  {cs.logo ? (
                    <img src={cs.logo} alt={cs.company} style={{ height: 26, objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem" }}>
                      {cs.company}
                    </span>
                  )}
                </div>

                <span
                  className="font-en"
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                  }}
                >
                  {cs.industry}
                </span>

                <h2
                  style={{
                    fontSize: "var(--fs-h3)",
                    fontWeight: 700,
                    margin: "0.6rem 0 1rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.45,
                    flex: 1,
                  }}
                >
                  {cs.oneLiner}
                </h2>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  {cs.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-secondary)",
                        background: "color-mix(in srgb, var(--text-primary) 6%, transparent)",
                        borderRadius: "var(--radius-pill)",
                        padding: "0.25rem 0.7rem",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <span
                  className="font-en"
                  style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--color-accent)" }}
                >
                  詳細を読む →
                </span>
              </article>
            </Link>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== BOTTOM CTA (fable動線設計で調整予定) — inverse ===== */}
      <SectionShell theme="inverse" wedge="top" width="content">
        <div style={{ maxWidth: 720 }}>
          <SectionHeading enLabel="Your Case" title="次の事例は、御社かもしれない。" level={2} />
          <Reveal variant="fadeUp">
            <p
              style={{
                margin: "1.5rem 0 clamp(2rem, 4vw, 3rem)",
                color: "var(--text-secondary)",
                fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                lineHeight: 1.9,
                maxWidth: "44ch",
              }}
            >
              「うちの場合はどうか」——その問いから始めましょう。
              御社サイトのURLから、AIがその場で活用案を整理することもできます。
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <ArrowCTA
                onClick={() => openChat({ source: "cases" })}
                variant="outline"
                withText="自社の場合をAIに聞く"
                label="自社の場合をAIに聞く"
              />
              <ArrowCTA to="/contact" size="lg" variant="fill" withText="ご相談はこちら" label="ご相談はこちら" />
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </div>
  );
};

export default CaseStudiesPage;
