/* =============================================================================
 * HomePage — corporate face. LayerX-content-analysis §8 structure:
 *   Hero(manifesto) → Trusted → What We Do(3 cards) → Value(2 axes)
 *   → Track record(curated, NOT a vertical wall of cases) → We/Recruit hook
 *   → CTA. Product-pitch density, orange accents, scarcity ("残りわずか"),
 *   stale numbers (20社/98%/2名) and the FAQ/pricing walls are removed —
 *   those live on /product and /case-studies. Facts stay compliant.
 *
 * Built from the design system: SectionShell / SectionHeading / StaggerGrid /
 * Reveal / ArrowCTA. Semantic tokens only (honkoma blue, inverse auto-flip).
 * ========================================================================== */

import { useEffect, type ReactNode } from "react";
import { HeroHome } from "../components/sections/HeroHome";
import { SectionShell } from "../components/Layout/SectionShell";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaggerGrid } from "../components/ui/StaggerGrid";
import { Reveal } from "../components/motion/Reveal";
import { ArrowCTA } from "../components/ui/ArrowCTA";

const services = [
  {
    en: "Adopt",
    title: "AI導入",
    desc: "活用診断から設計・実装、社内定着・内製化まで。AIを“使いこなせる状態”に持っていく。",
  },
  {
    en: "Embed",
    title: "FDE",
    desc: "エンジニアが現場に入り込み、伴走しながら作り切る。Forward Deployed Engineer。",
  },
  {
    en: "Build",
    title: "プロダクト開発",
    desc: "必要なAIツールを自社で開発。PoCから運用まで一気通貫で立ち上げる。",
  },
];

const values = [
  {
    en: "Top line",
    title: "売上を、伸ばす。",
    desc: "マーケ・集客・提案の現場にAIを実装し、事業の伸びしろを解き放つ。",
  },
  {
    en: "Bottom line",
    title: "コストを、削る。",
    desc: "定型業務はAIエージェントが引き受け、人は判断と創造に集中する。",
  },
];

/** Light surface card used across the page. */
function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(1.75rem, 3vw, 2.5rem)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}

const HomePage = () => {
  useEffect(() => {
    document.title = "honkoma | 誰かが作った時代を、生きるな。";
  }, []);

  return (
    <div style={{ background: "var(--surface-base)" }}>
      {/* ===== HERO (manifesto + embraceStack 3D) ===== */}
      <HeroHome />

      {/* ===== TRUSTED BY (thin band, subtle) ===== */}
      <div
        style={{
          background: "var(--surface-base)",
          borderTop: "1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)",
          borderBottom: "1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "1.75rem var(--space-gutter)",
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem 2.5rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-en"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            Trusted by
          </span>
          <img
            src="/assets/clients/buysell-technologies.svg"
            alt="BuySell Technologies"
            style={{ height: 22, opacity: 0.7 }}
          />
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            上場企業を含む、30社以上の現場に。
          </span>
        </div>
      </div>

      {/* ===== WHAT WE DO (3 service cards, one line each) ===== */}
      <SectionShell>
        <SectionHeading
          enLabel="What We Do"
          title="AIの伴走導入で、現場に戦力を実装する。"
          level={2}
        />
        <Reveal variant="fade" className="section-lead">
          <p
            style={{
              maxWidth: "44ch",
              margin: "1.5rem 0 clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 1.9,
            }}
          >
            ツールを配って終わりにしない。御社の業務に入り込み、
            AIを設計・実装し、成果が出て、社内に残るところまで伴走する。
          </p>
        </Reveal>

        <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
          {services.map((s) => (
            <Card key={s.title}>
              <span
                className="font-en"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                {s.en}
              </span>
              <h3
                style={{
                  fontSize: "var(--fs-h3)",
                  fontWeight: 700,
                  margin: "0.75rem 0 0.75rem",
                  color: "var(--text-primary)",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                  lineHeight: 1.85,
                  flex: 1,
                }}
              >
                {s.desc}
              </p>
            </Card>
          ))}
        </StaggerGrid>

        <div style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}>
          <ArrowCTA to="/product" variant="outline" withText="サービスの詳細へ" label="サービスの詳細へ" />
        </div>
      </SectionShell>

      {/* ===== VALUE (two axes) — inverse (navy) section ===== */}
      <SectionShell theme="inverse" wedge="top">
        <SectionHeading enLabel="Why honkoma" title="売上を伸ばし、コストを削る。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "44ch",
              margin: "1.5rem 0 clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 1.9,
            }}
          >
            honkomaが動かすのは、事業の2本のライン。
            トップラインを伸ばし、ボトムラインを削る——現場から、次の時代を立ち上げる。
          </p>
        </Reveal>

        <StaggerGrid columns={{ base: 1, md: 2 }} gap="md">
          {values.map((v) => (
            <Card key={v.title}>
              <span
                className="font-en"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                {v.en}
              </span>
              <h3
                style={{
                  fontSize: "var(--fs-h3)",
                  fontWeight: 700,
                  margin: "0.75rem 0 0.75rem",
                  color: "var(--text-primary)",
                }}
              >
                {v.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.85 }}>
                {v.desc}
              </p>
            </Card>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== TRACK RECORD (curated — NOT a vertical wall of cases) ===== */}
      <SectionShell wedge="top">
        <div
          style={{
            display: "grid",
            gap: "clamp(2rem, 5vw, 4rem)",
            gridTemplateColumns: "1fr",
            alignItems: "center",
          }}
        >
          <SectionHeading enLabel="Track Record" title="上場企業を含む、30社以上の現場に。" level={2} />
          <Reveal variant="fadeUp">
            <p
              style={{
                maxWidth: "48ch",
                color: "var(--text-secondary)",
                fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                lineHeight: 1.9,
                marginBottom: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              リユース・製造・医療・宿泊・士業まで。上場企業からクリニックの現場まで、
              業種と規模を問わずAIの伴走導入を重ねてきた。詳細は導入事例で。
            </p>
            <ArrowCTA to="/case-studies" variant="fill" withText="導入事例を見る" label="導入事例を見る" />
          </Reveal>
        </div>
      </SectionShell>

      {/* ===== WE / RECRUIT hook ===== */}
      <SectionShell wedge="top">
        <SectionHeading enLabel="Who We Are" title="時代を、つくる側に回る。" level={2} />
        <Reveal variant="fadeUp">
          <p
            style={{
              maxWidth: "52ch",
              margin: "1.5rem 0 clamp(2rem, 4vw, 3rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 2,
            }}
          >
            東京大学運動会硬式野球部での挫折、マッキンゼーの内定辞退——
            代表の林拓海は、AI時代の変化の速さに胸を躍らせ、自らの手で未来を切り拓く道を選んだ。
            「自分事」を合言葉に、私たちは今日も現場で時代を立ち上げている。
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <ArrowCTA to="/team" variant="outline" withText="メンバーを見る" label="メンバーを見る" />
            <ArrowCTA to="/about" variant="ghost" withText="会社概要" label="会社概要" />
          </div>
        </Reveal>
      </SectionShell>

      {/* ===== BOTTOM CTA (inverse) ===== */}
      <SectionShell theme="inverse" wedge="top" width="content">
        <div style={{ maxWidth: 760 }}>
          <SectionHeading
            enLabel="Let's build the future"
            title={["時代は、与えられるものではなく、", "つくるもの。"]}
            level={2}
          />
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
              「何から始めればいいかわからない」——その状態からで大丈夫。
              御社の現場をお聞きした上で、最適な一手をご提案します。初回相談は無料です。
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <ArrowCTA to="/contact" size="lg" variant="fill" withText="まず無料で相談する" label="まず無料で相談する" />
              <ArrowCTA to="/product" variant="ghost" withText="サービスを見る" label="サービスを見る" />
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </div>
  );
};

export default HomePage;
