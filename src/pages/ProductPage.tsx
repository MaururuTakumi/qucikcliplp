/* =============================================================================
 * ProductPage (/product) — サービス（product-and-principles-design.md §2）
 *
 * 全面刷新: プラン制(スタンダード/AI顧問/AI秘書)を廃止し、売り物を1つに——
 * 「会社をAIネイティブにトランスフォームする、徹底的な伴走のフルパッケージ」。
 * 物語: 目的地(AIネイティブとは) → 道のり(徹底的な伴走) → 打ち手(3つ) →
 *   業界特化(相談導線) → FAQ → CTA。料金数値・比較表・裏取りなし成果は不掲載
 *   (監査 #6/#7/#10/#11/#14 を構造的に解消)。
 * ========================================================================== */

import { useEffect, type ReactNode } from "react";
import { SectionShell } from "../components/Layout/SectionShell";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaggerGrid } from "../components/ui/StaggerGrid";
import { Reveal } from "../components/motion/Reveal";
import { ArrowCTA } from "../components/ui/ArrowCTA";
import { useAiChat } from "../features/ai-chat/ChatProvider";

/* #2 AIネイティブの定義 = 到達後の"状態"を現在形で描く(提供物リストにしない)。 */
const PILLARS: { num: string; en: string; title: string; body: string }[] = [
  {
    num: "01",
    en: "Data Foundation",
    title: "データが、一つの基盤に集まっている。",
    body: "散らばった資料・記録・ノウハウを整備し、AIが読める共通のデータ基盤にする。トランスフォームは、ここから始まる。",
  },
  {
    num: "02",
    en: "Access for Everyone",
    title: "全員が、AIでその基盤に触れられる。",
    body: "一部の詳しい人だけの道具にしない。誰もがAIを通じて会社の共通基盤にアクセスし、必要な答えに自分で届く。",
  },
  {
    num: "03",
    en: "AI-Run Back Office",
    title: "バックオフィスは、基本AIに任せている。",
    body: "経理・総務・レポート・定型のやりとり。繰り返しの業務はAIエージェントが引き受ける前提で、業務を組み直す。",
  },
  {
    num: "04",
    en: "Humans on Human Work",
    title: "人は、人にしかできない仕事に集中している。",
    body: "判断、交渉、創造、関係づくり。空いた時間と集中力を人にしかできない仕事に投じる——これがトランスフォームの目的だ。",
  },
];

/* #3 進め方4ステップ(#2の4条件とゆるく対応)。 */
const STEPS: { num: string; en: string; name: string; body: string }[] = [
  {
    num: "01",
    en: "Assess",
    name: "診断",
    body: "現場に入り、業務・データ・組織の現在地を把握する。ゴールまでの道筋をここで設計する。",
  },
  {
    num: "02",
    en: "Build",
    name: "基盤",
    body: "データ基盤を整備し、全員がAIでアクセスできる共通基盤を実装する。",
  },
  {
    num: "03",
    en: "Deploy",
    name: "移行",
    body: "バックオフィスをはじめ、AIに任せられる業務から順に移していく。現場と一緒に手を動かす。",
  },
  {
    num: "04",
    en: "Own",
    name: "定着",
    body: "全社への定着と、内製化。honkomaがいなくても回り、進化し続ける状態にして引き渡す。",
  },
];

/* #3 要素B「すべて、含まれている。」フルパッケージの中身。 */
const INCLUDES: string[] = [
  "現状診断とロードマップ設計",
  "データ基盤の整備",
  "AI共通基盤の構築",
  "バックオフィス業務のAI移行",
  "社内トレーニング・定着支援",
  "必要なAIツールの開発",
];

/* #4 3つの打ち手 = HomePage What We Do と一字一句同じ(2ページで言葉をブレさせない)。 */
const CAPABILITIES: { en: string; title: string; body: string }[] = [
  {
    en: "Adopt",
    title: "AI導入",
    body: "活用診断から設計・実装、社内定着・内製化まで。AIを“使いこなせる状態”に持っていく。",
  },
  {
    en: "Embed",
    title: "FDE",
    body: "エンジニアが現場に入り込み、伴走しながら作り切る。Forward Deployed Engineer。",
  },
  {
    en: "Build",
    title: "プロダクト開発",
    body: "必要なAIツールを自社で開発。PoCから運用まで一気通貫で立ち上げる。",
  },
];

/* #6 FAQ 確定6問(全面差し替え・料金数値/最短2週間/裏取りなし規模事例は排除)。 */
const FAQ: { q: string; a: string }[] = [
  {
    q: "AIの知識がまったくない状態でも相談できますか？",
    a: "はい。前提知識は不要です。現状の業務をお聞きするところから始めますので、専門用語の準備もいりません。",
  },
  {
    q: "どのくらいの規模の会社が対象ですか？",
    a: "規模は問いません。数名規模の会社から上場企業まで、これまで30社以上の現場に伴走してきました。",
  },
  {
    q: "料金はどのように決まりますか？",
    a: "対象範囲と規模をお聞きした上で、お見積もりをご提案します。初回のご相談は無料です。",
  },
  {
    q: "導入までどのくらいかかりますか？",
    a: "範囲によって異なるため、一律の期間はお約束していません。初回のご相談で、御社の場合の目安をご提示します。",
  },
  {
    q: "まず一部の業務だけ、スポットで相談することはできますか？",
    a: "入り口のご相談として歓迎します。ただし私たちが目指すのは会社全体の転換なので、部分的なご依頼でも、全体の道筋を描いた上でご提案します。",
  },
  {
    q: "社内のデータや情報の取り扱いが不安です。",
    a: "お預かりする情報の範囲と管理方法は、契約時に書面で明確にします。ご不安な点は、初回のご相談でそのままお聞かせください。",
  },
];

const ANCHOR = { scrollMarginTop: "6rem" } as const;

/** English accent number + label used across the definition/steps grids. */
function NumLabel({ num, en }: { num: string; en: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginBottom: "0.75rem" }}>
      <span
        className="font-en"
        style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-accent)" }}
      >
        {num}
      </span>
      <span
        className="font-en"
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {en}
      </span>
    </div>
  );
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(1.6rem, 3vw, 2.25rem)",
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

const ProductPage = () => {
  const { openChat } = useAiChat();

  useEffect(() => {
    document.title = "サービス | honkoma";
  }, []);

  return (
    <div style={{ background: "var(--surface-base)" }}>
      {/* ===== #1 HERO ===== */}
      <SectionShell>
        <SectionHeading
          enLabel="Service"
          title="会社を、AIネイティブへ。"
          level={1}
        />
        <Reveal variant="fade">
          <p className="font-en" style={{ margin: "0.5rem 0 0", color: "var(--text-secondary)", letterSpacing: "0.04em", fontSize: "0.9rem" }}>
            Transform into an AI-native company.
          </p>
          <p
            style={{
              maxWidth: "48ch",
              margin: "1.75rem 0 clamp(2rem, 4vw, 3rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
              lineHeight: 1.95,
            }}
          >
            ツールを一つ入れて終わり、にはしない。データ基盤から日々の業務、組織の習慣まで——
            honkomaは徹底的な伴走で、会社がAIを前提に動く状態への転換を支援する。
          </p>
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            <ArrowCTA to="/contact" size="lg" variant="fill" withText="ご相談はこちら" label="ご相談はこちら" />
            <ArrowCTA
              onClick={() => openChat({ source: "whatwedo" })}
              variant="outline"
              withText="自社の場合をAIに聞く"
              label="自社の場合をAIに聞く"
            />
          </div>
        </Reveal>
      </SectionShell>

      {/* ===== #2 AIネイティブの定義 ===== */}
      <SectionShell id="ai-native" wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="What Is AI-Native" title="AIネイティブとは、どういう状態か。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "52ch",
              margin: "1.5rem 0 clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 1.9,
            }}
          >
            AIを“使っている”会社と、AIが“前提の”会社は違う。私たちが目指すのは後者——
            次の4つが、特別なプロジェクトではなく日常になっている状態だ。
          </p>
        </Reveal>
        <StaggerGrid columns={{ base: 1, md: 2 }} gap="md">
          {PILLARS.map((p) => (
            <Card key={p.num}>
              <NumLabel num={p.num} en={p.en} />
              <h3
                style={{
                  fontSize: "var(--fs-h3)",
                  fontWeight: 700,
                  margin: "0 0 0.75rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.4,
                }}
              >
                {p.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.9, flex: 1 }}>
                {p.body}
              </p>
            </Card>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== #3 関わり方(How) — inverse ===== */}
      <SectionShell id="how" theme="inverse" wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="How We Work" title={["関わり方は、一つ。", "徹底的な伴走。"]} level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "52ch",
              margin: "1.5rem 0 clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 1.9,
            }}
          >
            プランのメニューは用意していない。診断から定着まで、AIネイティブに至るために必要なことを
            すべて含んだフルパッケージで、御社の中に入り込んで伴走する。
          </p>
        </Reveal>

        {/* 進め方4ステップ */}
        <StaggerGrid columns={{ base: 1, md: 2, lg: 4 }} gap="md">
          {STEPS.map((s) => (
            <div key={s.num}>
              <NumLabel num={s.num} en={s.en} />
              <h3
                style={{
                  fontSize: "clamp(1.15rem, 1.8vw, 1.4rem)",
                  fontWeight: 700,
                  margin: "0 0 0.5rem",
                  color: "var(--text-primary)",
                }}
              >
                {s.name}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.85 }}>
                {s.body}
              </p>
            </div>
          ))}
        </StaggerGrid>

        {/* すべて、含まれている。 */}
        <div style={{ marginTop: "clamp(3rem, 6vw, 4.5rem)" }}>
          <Reveal variant="fadeUp">
            <h3
              style={{
                fontSize: "var(--fs-h3)",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: "var(--text-primary)",
              }}
            >
              すべて、含まれている。
            </h3>
            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.75rem 1.5rem",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {INCLUDES.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  <span aria-hidden="true" style={{ color: "var(--color-accent)", fontWeight: 700 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.9 }}>
              料金は、対象範囲と規模に応じたお見積もり制。初回のご相談は無料です。
            </p>
          </Reveal>
        </div>
      </SectionShell>

      {/* ===== #4 3つの打ち手(What) ===== */}
      <SectionShell id="capabilities" wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="Our Capabilities" title="トランスフォームを支える、3つの打ち手。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "48ch",
              margin: "1.5rem 0 clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 1.9,
            }}
          >
            伴走の中身は、この3つの組み合わせでできている。局面に応じて必要な打ち手を選び、
            御社の転換を前に進める。
          </p>
        </Reveal>
        <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
          {CAPABILITIES.map((c) => (
            <Card key={c.title}>
              <span
                className="font-en"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                {c.en}
              </span>
              <h3
                style={{
                  fontSize: "var(--fs-h3)",
                  fontWeight: 700,
                  margin: "0.75rem 0",
                  color: "var(--text-primary)",
                }}
              >
                {c.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.85, flex: 1 }}>
                {c.body}
              </p>
            </Card>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== #5 業界特化(Where) ===== */}
      <SectionShell id="solutions" wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="Industry Focus" title="業界に、深く。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "44ch",
              margin: "1.5rem 0 clamp(2.5rem, 5vw, 3.5rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 1.9,
            }}
          >
            業界固有の業務には、専用の型を用意している。
          </p>
        </Reveal>
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          業界固有のご相談は、お問い合わせください。
        </p>
      </SectionShell>

      {/* ===== #6 FAQ ===== */}
      <SectionShell id="faq" wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="FAQ" title="よくあるご質問。" level={2} />
        <div style={{ marginTop: "clamp(2rem, 4vw, 3rem)", maxWidth: 820 }}>
          {FAQ.map((f, i) => (
            <Reveal key={f.q} variant="fadeUp">
              <div
                style={{
                  padding: "1.5rem 0",
                  borderTop: i === 0 ? "none" : "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                }}
              >
                <h3 style={{ display: "flex", gap: "0.75rem", fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                  <span className="font-en" style={{ color: "var(--color-accent)" }}>Q.</span>
                  {f.q}
                </h3>
                <p style={{ display: "flex", gap: "0.75rem", color: "var(--text-secondary)", fontSize: "0.98rem", lineHeight: 1.9 }}>
                  <span className="font-en" style={{ color: "var(--text-secondary)" }}>A.</span>
                  <span>{f.a}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* ===== #7 CTA — inverse ===== */}
      <SectionShell id="contact-cta" theme="inverse" wedge="top" width="content" style={ANCHOR}>
        <div style={{ maxWidth: 760 }}>
          <SectionHeading enLabel="Contact" title="まずは、話すことから。" level={2} />
          <Reveal variant="fadeUp">
            <p
              style={{
                margin: "1.5rem 0 clamp(2rem, 4vw, 3rem)",
                color: "var(--text-secondary)",
                fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                lineHeight: 1.9,
                maxWidth: "46ch",
              }}
            >
              「何から始めればいいかわからない」——その状態からで大丈夫。
              AIに聞くのも、人に聞くのも、入り口はどちらでも。
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <ArrowCTA
                onClick={() => openChat({ source: "whatwedo" })}
                variant="outline"
                withText="自社での使い方をAIに聞く"
                label="自社での使い方をAIに聞く"
              />
              <ArrowCTA to="/contact" size="lg" variant="fill" withText="ご相談はこちら" label="ご相談はこちら" />
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </div>
  );
};

export default ProductPage;
