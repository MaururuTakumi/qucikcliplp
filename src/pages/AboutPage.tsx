/* =============================================================================
 * AboutPage — 会社概要。Rebuilt on the design system, same corporate face as
 * home/team. Facts corrected to the source of truth (docs/lp-redesign-brief §1):
 * 設立 2025年6月 / 10名体制 / 30社以上 — the audit issues (#5/#8/#9/#11/#12)
 * are resolved here. No "98%継続率", no unverified lead-time claims.
 * ========================================================================== */

import { useEffect, type ReactNode } from "react";
import { SectionShell } from "../components/Layout/SectionShell";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaggerGrid } from "../components/ui/StaggerGrid";
import { Reveal } from "../components/motion/Reveal";
import { ArrowCTA } from "../components/ui/ArrowCTA";

const philosophy = [
  {
    en: "Philosophy",
    title: "テクノロジーで、人の可能性を解放する。",
    body: "人がやるべきでない仕事から人を解放し、創造的な仕事に集中できる世界を実現する。それが私たちの原点です。",
  },
  {
    en: "Mission",
    title: "AI導入のハードルを、ゼロにする。",
    body: "「AIは使いたいが何から始めればいいかわからない」。そんな企業に寄り添い、最適なAI活用を実現するパートナーであり続けます。",
  },
  {
    en: "Vision",
    title: "すべての企業に、AIの恩恵を届ける。",
    body: "大企業だけでなく、中小企業やスタートアップまで。あらゆる規模の企業がAIの力を活用できる社会を目指します。",
  },
];

const metrics = [
  { value: "30社以上", label: "導入・支援実績（上場企業を含む）" },
  { value: "10名", label: "体制（創業メンバー＋社員）" },
  { value: "2025.6", label: "設立" },
];

const companyInfo: [string, string][] = [
  ["商号", "株式会社honkoma"],
  ["設立", "2025年6月"],
  ["代表者", "代表取締役 林 拓海"],
  ["資本金", "50万円"],
  ["所在地", "東京都文京区本駒込1-20-16 モンテベルデ本駒込102"],
  ["事業内容", "AIの伴走導入支援（AI導入 / FDE / プロダクト開発）"],
  ["従業員数", "10名（正社員・インターン・業務委託を含む）"],
  ["URL", "ltdhonkoma.com"],
  ["お問い合わせ", "quickclip@ltdhonkoma.com"],
];

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(1.75rem, 3vw, 2.5rem)",
        height: "100%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}

const AboutPage = () => {
  useEffect(() => {
    document.title = "会社概要 | honkoma";
  }, []);

  return (
    <div style={{ background: "var(--surface-base)" }}>
      {/* ===== HERO ===== */}
      <SectionShell>
        <SectionHeading enLabel="About" title="会社概要。" level={1} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "44ch",
              margin: "1.5rem 0 0",
              color: "var(--text-secondary)",
              fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
              lineHeight: 1.9,
            }}
          >
            テクノロジーの力で企業の課題を解決し、AIと自動化で日本のビジネスを次のステージへ。
          </p>
        </Reveal>
      </SectionShell>

      {/* ===== PHILOSOPHY ===== */}
      <SectionShell wedge="top">
        <SectionHeading enLabel="What We Believe" title="私たちが、信じていること。" level={2} />
        <div style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
          <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
            {philosophy.map((p) => (
              <Card key={p.en}>
                <span
                  className="font-en"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)" }}
                >
                  {p.en}
                </span>
                <h3 style={{ fontSize: "var(--fs-h3)", fontWeight: 700, margin: "0.75rem 0 0.75rem", color: "var(--text-primary)" }}>
                  {p.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.85 }}>{p.body}</p>
              </Card>
            ))}
          </StaggerGrid>
        </div>
      </SectionShell>

      {/* ===== METRICS (inverse) ===== */}
      <SectionShell theme="inverse" wedge="top">
        <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
          {metrics.map((m) => (
            <div key={m.label} style={{ textAlign: "center", padding: "clamp(1.5rem, 3vw, 2.5rem) 1rem" }}>
              <div style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 700, color: "var(--text-primary)" }}>
                {m.value}
              </div>
              <div className="font-en" style={{ marginTop: "0.5rem", fontSize: "0.8rem", letterSpacing: "0.04em", color: "var(--text-secondary)" }}>
                {m.label}
              </div>
            </div>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== CEO MESSAGE ===== */}
      <SectionShell wedge="top">
        <SectionHeading enLabel="Message" title="代表者メッセージ。" level={2} />
        <div className="ceo-row" style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
          <Reveal variant="fadeUp" className="ceo-copy">
            <div style={{ color: "var(--text-secondary)", lineHeight: 2, fontSize: "1.05rem", display: "grid", gap: "1.25rem" }}>
              <p>AIの進化は、ビジネスのあり方を根本から変えつつあります。しかし多くの企業にとって「AIをどう使えばいいのか」は、依然として大きな課題です。</p>
              <p>私たちhonkomaは、そのギャップを埋めるために生まれました。AI導入・FDE・プロダクト開発を通じて、企業の生産性向上と競争力強化を、現場に入り込んで実現します。</p>
              <p style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                「テクノロジーは難しい」と感じている方にこそ、私たちの価値がある。<br />
                誰かが作った時代を生きるのではなく、御社と一緒に、次の時代をつくりに行きます。
              </p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <p className="font-en" style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>株式会社honkoma</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "0.25rem" }}>
                代表取締役 CEO　林 拓海
              </p>
            </div>
          </Reveal>
          <Reveal variant="scaleIn" className="ceo-photo">
            <div style={{ aspectRatio: "3 / 4", overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
              <img
                src="/team/hayashi_img.jpg"
                alt="代表取締役CEO 林 拓海"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }}
              />
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* ===== COMPANY INFO ===== */}
      <SectionShell wedge="top">
        <SectionHeading enLabel="Company" title="会社情報。" level={2} />
        <div style={{ marginTop: "clamp(2rem, 4vw, 3rem)", maxWidth: 760 }}>
          <dl style={{ margin: 0 }}>
            {companyInfo.map(([k, v]) => (
              <Reveal key={k} as="div" variant="fade">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(120px, 200px) 1fr",
                    gap: "1.5rem",
                    padding: "1.1rem 0",
                    borderTop: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                  }}
                >
                  <dt className="font-en" style={{ fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                    {k}
                  </dt>
                  <dd style={{ margin: 0, color: "var(--text-primary)", fontSize: "0.95rem", lineHeight: 1.7 }}>{v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </SectionShell>

      {/* ===== CTA (inverse) ===== */}
      <SectionShell theme="inverse" wedge="top" width="content">
        <div style={{ maxWidth: 720 }}>
          <SectionHeading enLabel="Contact" title="AI導入・開発のご相談。" level={2} />
          <Reveal variant="fadeUp">
            <p style={{ margin: "1.5rem 0 clamp(2rem, 4vw, 3rem)", color: "var(--text-secondary)", fontSize: "clamp(1rem, 1.3vw, 1.15rem)", lineHeight: 1.9, maxWidth: "40ch" }}>
              御社の課題に合わせて、最適な一手をご提案します。初回相談は無料です。
            </p>
            <ArrowCTA to="/contact" size="lg" variant="fill" withText="無料で相談する" label="無料で相談する" />
          </Reveal>
        </div>
      </SectionShell>

      <style>{`
        .ceo-row { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: start; }
        .ceo-photo { max-width: 360px; }
        @media (min-width: 768px) {
          .ceo-row { grid-template-columns: 1.4fr 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
