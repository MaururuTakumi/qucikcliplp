/* =============================================================================
 * RecruitPage (/recruit) — 採用（site-ia-design §4）
 *
 * 「職種で募らず、人物像で募る」オープンポジション型。深さは職種数ではなく
 * 物語の解像度で出す。レンズ=🔥主・👤副（発注者も代表の物語を読む前提で
 * 誇張ゼロ・実名実話のみ）。
 *
 * セクション: Hero(旗) → 創業ストーリー(感情→協働→大義) → 行動指針(再掲) →
 *   こんな人を探している(人物像) → 働き方・カルチャー → 応募CTA(カジュアル面談一本化)。
 *
 * TODO(founder): §9-4 行動指針の残り2原則が未確定。#principles は「自分事」＋
 *   暫定2枠で置いており、確定後にcoピーを差し替える（M3の/about原本と同期）。
 *   旗コピー「時代を、自分事にしろ。」は3案比較の第一候補（実装時決裁）。
 * ========================================================================== */

import { useEffect } from "react";
import { SectionShell } from "../components/Layout/SectionShell";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaggerGrid } from "../components/ui/StaggerGrid";
import { Reveal } from "../components/motion/Reveal";
import { ArrowCTA } from "../components/ui/ArrowCTA";

/* 創業ストーリー: 感情 → 協働 → 大義 の3段（content分析§6）。実名実話のみ。 */
const STORY: { en: string; title: string; body: string }[] = [
  {
    en: "01 — Ignition",
    title: "挫折から、起業へ。",
    body: "東京大学運動会硬式野球部での挫折。マッキンゼーの内定辞退。安定した“誰かが用意した道”を歩む選択肢はあった。それでも代表・林拓海は、AI最前線の変化の速さに胸を躍らせ、自らの手で未来を立ち上げる道を選んだ。",
  },
  {
    en: "02 — Together",
    title: "10人で、現場に入り込む。",
    body: "honkomaは10名のチーム。正社員・インターン・業務委託が混ざり合い、上場企業からクリニックの現場まで、AIの伴走導入を重ねてきた。ツールを配って終わりにせず、成果が出て社内に残るところまで一緒に作り切る。",
  },
  {
    en: "03 — Cause",
    title: "誰かが作った時代を、生きない。",
    body: "与えられた時代をなぞるのではなく、自分の手でつくる側に回る。honkomaが目指すのは、一人ひとりが「自分事」として時代を立ち上げる世界。その最前線を、一緒に走る仲間を探している。",
  },
];

/* こんな人を探している: 人物像の名指し。職種一覧は作らない（§4-4）。 */
const PERSONAS: string[] = [
  "変化を、面白がれる人",
  "頼まれる前に、作りはじめる人",
  "「自分事」で、現場に立てる人",
  "正解のない問いに、手を動かせる人",
];

/* 分類は3枠のみ（エンジニア / ビジネス / オープン）。 */
const TRACKS: { label: string; desc: string }[] = [
  {
    label: "エンジニア",
    desc: "AIツールの設計・実装から現場実装まで。技術で成果を出し切る。",
  },
  {
    label: "ビジネス",
    desc: "顧客の現場に入り込み、課題を定義し、伴走で成果を届ける。",
  },
  {
    label: "オープン",
    desc: "枠に当てはまらなくてもいい。まず話そう。役割は一緒につくる。",
  },
];

const X_DM_URL = "https://x.com/moriyorihayash1";

const RecruitPage = () => {
  useEffect(() => {
    document.title = "採用情報 | honkoma";
  }, []);

  return (
    <div style={{ background: "var(--surface-base)" }}>
      {/* ===== HERO — 旗 ===== */}
      <SectionShell>
        <SectionHeading
          enLabel="Careers"
          title={["時代を、", "自分事にしろ。"]}
          level={1}
        />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "46ch",
              margin: "1.75rem 0 clamp(2rem, 4vw, 3rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
              lineHeight: 2,
            }}
          >
            honkomaは、AIで時代の最前線を立ち上げる10人のチーム。
            求人票の空欄を埋める採用はしない。職種ではなく、人で募る。
            「誰かが作った時代を、生きない」と決めた人へ。
          </p>
          <div
            style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}
          >
            <ArrowCTA
              to="/contact?type=recruit"
              size="lg"
              variant="fill"
              withText="まず話す（カジュアル面談）"
              label="まず話す（カジュアル面談）"
            />
            <ArrowCTA
              to="/team"
              variant="outline"
              withText="メンバーを見る"
              label="メンバーを見る"
            />
          </div>
        </Reveal>
      </SectionShell>

      {/* ===== 創業ストーリー（感情→協働→大義） — inverse ===== */}
      <SectionShell theme="inverse" wedge="top">
        <SectionHeading
          enLabel="Our Story"
          title="人で語る、honkomaの原点。"
          level={2}
        />
        <div style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
          <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
            {STORY.map((s) => (
              <div key={s.en}>
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
                    margin: "0.75rem 0 0.9rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.95,
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </SectionShell>

      {/* ===== こんな人を探している（人物像） ===== */}
      <SectionShell wedge="top">
        <SectionHeading
          enLabel="Who We Look For"
          title="職種ではなく、人で募る。"
          level={2}
        />
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
            スキルより、姿勢を見る。以下のどれかに心が動いたら、
            まず話しましょう。
          </p>
        </Reveal>
        <StaggerGrid columns={{ base: 1, md: 2 }} gap="md">
          {PERSONAS.map((p, i) => (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "1rem",
                padding: "1.4rem 0",
                borderTop:
                  "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
              }}
            >
              <span
                className="font-en"
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-accent)",
                  fontWeight: 700,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                }}
              >
                {p}
              </span>
            </div>
          ))}
        </StaggerGrid>

        {/* 分類3枠 */}
        <div style={{ marginTop: "clamp(3rem, 6vw, 4.5rem)" }}>
          <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
            {TRACKS.map((t) => (
              <div
                key={t.label}
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "var(--radius-lg)",
                  padding: "clamp(1.5rem, 3vw, 2rem)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "var(--fs-h3)",
                    fontWeight: 700,
                    marginBottom: "0.6rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {t.label}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                  }}
                >
                  {t.desc}
                </p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </SectionShell>

      {/* ===== 応募CTA（カジュアル面談一本化） — inverse ===== */}
      <SectionShell theme="inverse" wedge="top" width="content">
        <div style={{ maxWidth: 760 }}>
          <SectionHeading
            enLabel="Let's talk"
            title={["まずは、", "話すことから。"]}
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
              応募フォームは用意していません。まずはカジュアル面談で、
              お互いのことを知るところから。代表に直接DMでも構いません。
            </p>
            <div
              style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}
            >
              <ArrowCTA
                to="/contact?type=recruit"
                size="lg"
                variant="fill"
                withText="カジュアル面談を申し込む"
                label="カジュアル面談を申し込む"
              />
              <ArrowCTA
                href={X_DM_URL}
                variant="ghost"
                direction="external"
                withText="代表にXでDM"
                label="代表にXでDM"
              />
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </div>
  );
};

export default RecruitPage;
