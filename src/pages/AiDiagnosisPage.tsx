/* =============================================================================
 * AiDiagnosisPage (/ai) — YouTube/note からの冷たい訪問者向け専用着地。
 * contact-funnel-v2 §1.4。ChatStage(ドロワーと共有)をインラインで展開する。
 * Phase0 は noindex(計測しやすい入口として運用、コピー安定後に解放)。
 * ========================================================================== */

import { useEffect } from "react";
import { m, useReducedMotion } from "framer-motion";
import { ChatStage } from "../features/ai-chat/components/ChatStage";
import { dur, ease } from "../design/tokens";

const STEPS = [
  { en: "01", title: "URLを読む", body: "会社サイトをAIが読み込み、事業と導線を把握します。" },
  { en: "02", title: "3つの仮説", body: "売上・コスト・現場実装の3軸で、活用の仮説を返します。" },
  { en: "03", title: "進め方と事例", body: "課題に絞った進め方プランと、近い状況の事例をお見せします。" },
];

const FAQ = [
  {
    q: "入力した情報はどう扱われますか？",
    a: "入力内容は品質向上・お問い合わせ対応のため保存されます。詳しくはプライバシーポリシーをご覧ください。",
  },
  {
    q: "なぜ無料なのですか？",
    a: "honkomaの初回診断は、いつでもここまで無料です。その先の伴走が私たちの事業です。",
  },
  {
    q: "なぜメールアドレスが必要ですか？",
    a: "診断は対象企業の方向けの内容のため、会社のアドレスで関係を確認しています。結果送付とお問い合わせ対応以外には使いません。",
  },
  {
    q: "売り込みはありますか？",
    a: "診断メモ以外のご案内は差し上げません。続きは、代表の林拓海が直接お話しします。",
  },
];

export default function AiDiagnosisPage() {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = "AI活用診断 | honkoma";
    /* 既存の robots メタを noindex に上書き(重複作成しない)。離脱時に復元。 */
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !meta;
    const prev = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex");
    return () => {
      if (created) meta?.remove();
      else if (prev !== null) meta?.setAttribute("content", prev);
    };
  }, []);

  const utm =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") : null;
  const fromMedia = utm === "youtube" ? "動画" : utm === "note" ? "記事" : null;

  return (
    <div style={{ background: "var(--surface-base)", color: "var(--text-primary)" }}>
      <section
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "clamp(3.5rem, 9vh, 6rem) var(--space-gutter) clamp(2.5rem, 6vh, 4rem)",
        }}
      >
        <m.span
          className="font-en"
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: dur.reveal, ease: ease.out }}
          style={{
            display: "block", fontSize: "var(--fs-label)", fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)",
            marginBottom: "1rem",
          }}
        >
          AI Diagnosis
        </m.span>
        <h1
          className="font-jp"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, lineHeight: 1.25, margin: "0 0 1rem" }}
        >
          御社ならAIをどう使えるか。
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.9, maxWidth: "40ch", margin: "0 0 1.75rem" }}>
          AIが御社サイトを読み、売上を伸ばす・コストを削る・現場に実装する、の3軸で仮説を返します。
          <strong style={{ color: "var(--text-primary)" }}>無料・約60秒。結果は会社のメール宛にもお届けします。</strong>
        </p>
        {fromMedia && (
          <p style={{ color: "var(--color-accent-bright)", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
            {fromMedia}からお越しの方へ——ここからは、御社の話をしましょう。
          </p>
        )}

        {/* 信頼帯 */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem",
            margin: "0 0 2rem", fontSize: "0.85rem", color: "var(--text-secondary)",
          }}
        >
          <span>30社以上のAI伴走導入（上場企業含む）</span>
          <span>診断の続きは、代表・林拓海が直接見ます</span>
          <span>売り込みはしません</span>
        </div>

        {/* ChatStage インライン(ドロワーと同一の状態機械) */}
        <div
          data-theme="inverse"
          style={{
            background: "var(--surface-base)",
            border: "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 24px 60px -30px color-mix(in srgb, var(--navy-900) 55%, transparent)",
            overflow: "hidden",
          }}
        >
          <ChatStage />
        </div>

        <p style={{ color: "color-mix(in srgb, var(--text-primary) 45%, transparent)", fontSize: "0.8rem", margin: "0.9rem 0 0" }}>
          入力内容は途中でも品質向上・お問い合わせ対応のため保存されます（
          <a href="/privacy" style={{ color: "var(--color-accent)" }}>プライバシーポリシー</a>）。
        </p>
      </section>

      {/* 診断の仕組み */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(2rem, 5vh, 3.5rem) var(--space-gutter)" }}>
        <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {STEPS.map((s) => (
            <div key={s.en}>
              <span className="font-en" style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 700 }}>{s.en}</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0.4rem 0 0.5rem" }}>{s.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.8, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "clamp(1rem, 3vh, 2rem) var(--space-gutter) clamp(4rem, 9vh, 6rem)" }}>
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {FAQ.map((f) => (
            <div key={f.q} style={{ borderTop: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)", paddingTop: "1.25rem" }}>
              <h3 style={{ fontSize: "0.98rem", fontWeight: 700, margin: "0 0 0.5rem" }}>{f.q}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
