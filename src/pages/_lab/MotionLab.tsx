/* =============================================================================
 * MotionLab — DEV-only living catalog (blueprint C-6 / #29 skeleton)
 *
 * A single screen to eyeball every primitive and use as a copy-source for the
 * assembly (labor) phase. Registered under /_lab ONLY when import.meta.env.DEV.
 *
 * This slice: ArrowCTA — full matrix (size x variant x direction), inside an
 * inverse-theme section, and withText examples.
 * ========================================================================== */

import type { ReactNode } from "react";
import { ArrowCTA } from "../../components/ui/ArrowCTA";
import { Reveal, RevealGroup } from "../../components/motion/Reveal";
import { TextReveal } from "../../components/motion/TextReveal";
import { WedgeDivider } from "../../components/motion/Wedge";
import { SectionHeading } from "../../components/ui/SectionHeading";

const SIZES = ["sm", "md", "lg"] as const;
const VARIANTS = ["outline", "fill", "ghost"] as const;
const DIRECTIONS = ["right", "up", "external"] as const;

function LabSection({
  title,
  subtitle,
  inverse,
  children,
}: {
  title: string;
  subtitle?: string;
  inverse?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      {...(inverse ? { "data-theme": "inverse" } : {})}
      style={{
        background: "var(--surface-base)",
        color: "var(--text-primary)",
        padding: "clamp(2rem, 5vw, 4rem)",
        borderRadius: "var(--radius-lg)",
        marginBottom: "1.5rem",
      }}
    >
      <h2
        className="font-en"
        style={{
          fontSize: "var(--fs-h3)",
          fontWeight: 700,
          margin: 0,
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: "0.875rem" }}>
          {subtitle}
        </p>
      )}
      <div style={{ marginTop: "1.5rem" }}>{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        flexWrap: "wrap",
        padding: "0.75rem 0",
      }}
    >
      <span
        className="font-en"
        style={{
          minWidth: 96,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

export default function MotionLab() {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "clamp(2rem, 6vw, 5rem) var(--space-gutter)",
        fontFamily: "var(--font-jp)",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <p
          className="font-en"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
          }}
        >
          Motion Lab · dev only
        </p>
        <h1 style={{ fontSize: "var(--fs-h2)", fontWeight: 700, margin: "0.25rem 0 0" }}>
          ArrowCTA
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>
          手触りの基準器。ホバー/フォーカス/タッチ挙動を目視検証。
        </p>
      </header>

      {/* size x variant matrix (direction: right) */}
      <LabSection title="Size × Variant" subtitle="direction=right, hover=sweepSwap">
        {VARIANTS.map((variant) => (
          <Row key={variant} label={variant}>
            {SIZES.map((size) => (
              <ArrowCTA
                key={size}
                size={size}
                variant={variant}
                label={`${variant} ${size}`}
                onClick={() => {}}
              />
            ))}
          </Row>
        ))}
      </LabSection>

      {/* direction matrix */}
      <LabSection title="Direction" subtitle="size=md, variant=outline. external=spin ↗">
        <Row label="directions">
          {DIRECTIONS.map((direction) => (
            <ArrowCTA
              key={direction}
              size="md"
              variant="outline"
              direction={direction}
              hover={direction === "external" ? "spin" : "sweepSwap"}
              label={`arrow ${direction}`}
              onClick={() => {}}
            />
          ))}
        </Row>
      </LabSection>

      {/* withText companion */}
      <LabSection title="withText" subtitle="companion label to the left of the circle">
        <Row label="link">
          <ArrowCTA to="/" size="md" variant="outline" withText="事業内容へ" label="事業内容へ" />
          <ArrowCTA to="/" size="lg" variant="fill" withText="採用情報へ" label="採用情報へ" />
        </Row>
        <Row label="external">
          <ArrowCTA
            href="https://layerx.co.jp/"
            direction="external"
            hover="spin"
            size="md"
            variant="ghost"
            withText="外部リンク"
            label="外部リンク (別タブで開く)"
          />
        </Row>
      </LabSection>

      {/* Reveal / RevealGroup — scroll into view */}
      <style>{`.lab-flex{display:flex;gap:1.5rem;flex-wrap:wrap}.lab-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}@media(max-width:640px){.lab-grid{grid-template-columns:repeat(2,1fr)}}.lab-card{padding:1.25rem 1.75rem;background:var(--surface-raised);border-radius:var(--radius-md);box-shadow:0 1px 2px rgba(0,0,0,0.06);font-weight:500}`}</style>

      <LabSection title="Reveal" subtitle="単発リビール。スクロールで in-view 発火（variant別）">
        <div className="lab-flex">
          {(["fadeUp", "fade", "scaleIn", "clip"] as const).map((v) => (
            <Reveal key={v} variant={v}>
              <div className="lab-card font-en">{v}</div>
            </Reveal>
          ))}
        </div>
      </LabSection>

      <LabSection title="RevealGroup" subtitle="stagger付き。親1つの IntersectionObserver で子が順に fadeUp">
        <RevealGroup className="lab-grid">
          {["顧客理解", "設計", "実装", "内製化"].map((t) => (
            <Reveal key={t}>
              <div className="lab-card">
                <span
                  className="font-en"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.08em", color: "var(--color-accent)" }}
                >
                  STEP
                </span>
                <p style={{ margin: "0.5rem 0 0", fontWeight: 600 }}>{t}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </LabSection>

      {/* TextReveal — line/char masks + vertical writing */}
      <LabSection
        title="TextReveal"
        subtitle="行/文字マスクのフェード。縦書き対応（vertical / vertical-md）"
      >
        <Row label="lines">
          <TextReveal
            as="h2"
            text={["まだ見ぬ未来を、", "一緒に。"]}
            className="font-jp"
          />
        </Row>
        <Row label="chars">
          <TextReveal as="h3" mode="chars" text="Creating a future, together." className="font-en" />
        </Row>
        <Row label="vertical">
          <div style={{ height: 260 }}>
            <TextReveal
              as="h2"
              orientation="vertical"
              text={["まだ見ぬ未来を、", "一緒に。"]}
              className="font-jp"
            />
          </div>
        </Row>
        <Row label="vertical-md">
          <div style={{ height: 260 }}>
            <TextReveal
              as="h2"
              orientation="vertical-md"
              text={["自分事。", "を、行動指針に。"]}
              className="font-jp"
            />
          </div>
        </Row>
      </LabSection>

      {/* WedgeDivider — signature diagonal boundary */}
      <LabSection title="WedgeDivider" subtitle="斜めウェッジ。in-view でバーがスライドイン（clip-path）">
        <Row label="ltr / 6deg">
          <div style={{ width: "100%" }}>
            <WedgeDivider direction="ltr" />
          </div>
        </Row>
        <Row label="rtl / 10deg">
          <div style={{ width: "100%" }}>
            <WedgeDivider direction="rtl" angle={10} />
          </div>
        </Row>
        <Row label="soft colors">
          <div style={{ width: "100%" }}>
            <WedgeDivider colors={["var(--color-accent-bright)", "var(--color-accent-soft)"]} angle={8} />
          </div>
        </Row>
      </LabSection>

      {/* SectionHeading — enLabel -> title reveal -> numbering */}
      <LabSection title="SectionHeading" subtitle="英字ラベル → 和文特大 → 01/05（固定シーケンス）">
        <Row label="basic">
          <SectionHeading enLabel="What We Do" title="事業内容" level={2} />
        </Row>
        <Row label="numbered">
          <SectionHeading
            enLabel="Our Principles"
            title={["自分事。"]}
            index={{ current: 1, total: 5 }}
            level={2}
          />
        </Row>
        <Row label="vertical-md">
          <div style={{ height: 300 }}>
            <SectionHeading
              enLabel="Mission"
              title={["まだ見ぬ未来を、", "一緒に。"]}
              orientation="vertical-md"
              level={2}
            />
          </div>
        </Row>
      </LabSection>

      {/* inverse theme — children flip with NO props */}
      <LabSection title="Inverse theme" subtitle='data-theme="inverse" — 配色がpropsなしで反転' inverse>
        <Row label="SectionHeading">
          <SectionHeading enLabel="Join Us" title="採用情報" index={{ current: 4, total: 5 }} level={2} />
        </Row>
        <Row label="WedgeDivider">
          <div style={{ width: "100%" }}>
            <WedgeDivider angle={8} />
          </div>
        </Row>
        <Row label="outline">
          {SIZES.map((size) => (
            <ArrowCTA key={size} size={size} variant="outline" label={`inv ${size}`} onClick={() => {}} />
          ))}
        </Row>
        <Row label="fill">
          <ArrowCTA size="lg" variant="fill" withText="採用情報へ" label="採用情報へ (inverse)" onClick={() => {}} />
        </Row>
        <Row label="up (back-to-top)">
          <ArrowCTA size="md" variant="ghost" direction="up" label="トップへ戻る" onClick={() => {}} />
        </Row>
      </LabSection>
    </div>
  );
}
