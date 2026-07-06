/* =============================================================================
 * ChatStage — AI診断の phase 別本体UI(contact-funnel-v2)。
 *
 * ChatDrawer(右ドロワーの殻)と AiDiagnosisPage(/ai インライン)で共有する。
 * 状態機械は ChatProvider が持ち、ここは描画に専念。styles(.aichat-*)を一度だけ注入。
 *
 * 動線: URL入力 → 3仮説(Q1課題chip) → 深掘り(Q2規模/Q3AI活用) → 進め方プラン生成
 *   → focusShown(プラン + 匿名事例 + 人間バトン) → 予約/メール → 取得後エンリッチ。
 * ========================================================================== */

import React from "react";
import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { dur, ease, stagger } from "../../../design/tokens";
import { ArrowCTA } from "../../../components/ui/ArrowCTA";
import { useAiChat } from "../ChatProvider";
import type { AiMaturity, AiProposal, CaseRecord, CompanySize, FocusPlan, PainCategory, ProposalAxis } from "../types";

const CAL_BOOKING_URL = "https://calendar.app.google/DcGsqPYBvRf3dvZJ8";

const axisLabels: Record<ProposalAxis, { label: string; body: string }> = {
  top_line: { label: "TOP LINE", body: "売上を伸ばす" },
  bottom_line: { label: "BOTTOM LINE", body: "コストを削る" },
  fde: { label: "FDE", body: "現場で作り切る" },
};

const analysisHints = [
  "公開サイトを読み込んでいます",
  "事業内容と問い合わせ導線を確認しています",
  "honkomaの提供価値3軸に整理しています",
];

const focusHints = [
  "課題に合わせて進め方を組み立てています",
  "近い状況の事例を探しています",
  "体制と最初の一歩を整理しています",
];

const PAIN_CHIPS: { value: PainCategory; label: string }[] = [
  { value: "staffing", label: "人手不足・属人化" },
  { value: "support", label: "問い合わせ・顧客対応" },
  { value: "backoffice", label: "バックオフィス業務" },
  { value: "sales", label: "売上・集客" },
  { value: "data", label: "データが活かせていない" },
  { value: "other", label: "どれでもない（ひとこと入力）" },
];

const SIZE_CHIPS: { value: CompanySize; label: string }[] = [
  { value: "lte10", label: "〜10名" },
  { value: "lte50", label: "〜50名" },
  { value: "lte300", label: "〜300名" },
  { value: "gt300", label: "301名〜" },
];

const MATURITY_CHIPS: { value: AiMaturity; label: string }[] = [
  { value: "none", label: "まだほとんど使っていない" },
  { value: "individual", label: "個人で使う人はいる" },
  { value: "partial", label: "一部の業務で導入済み" },
  { value: "company", label: "全社的に活用している" },
];

const ROLE_CHIPS = ["経営者・役員", "部門責任者", "現場担当", "情報収集中"];

const CHAT_STYLE = `
.aichat-overlay {
  position: fixed; inset: 0; z-index: 80; display: flex;
  align-items: flex-end; justify-content: center;
  background: color-mix(in srgb, var(--ink-900) 48%, transparent);
}
.aichat-panel {
  --chat-dur-fast: ${dur.fast}s; --chat-dur-base: ${dur.base}s; --chat-dur-reveal: ${dur.reveal}s;
  --chat-ease: cubic-bezier(${ease.soft.join(",")});
  width: min(100vw, 520px); max-height: min(92vh, 760px);
  background: var(--surface-base); color: var(--text-primary);
  border: 1px solid color-mix(in srgb, var(--text-primary) 14%, transparent);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  box-shadow: 0 24px 70px -24px color-mix(in srgb, var(--ink-900) 74%, transparent);
  overflow: hidden; display: flex; flex-direction: column;
}
.aichat-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  padding: 1.25rem; border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
}
.aichat-title { margin: 0.2rem 0 0; font-size: 1rem; font-weight: 700; line-height: 1.45; }
.aichat-kicker { display: block; font-family: var(--font-en); font-size: 0.72rem; color: var(--color-accent); }
.aichat-close {
  width: 2.5rem; height: 2.5rem; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  color: var(--text-primary); background: transparent; cursor: pointer;
  transition: border-color var(--chat-dur-fast) var(--chat-ease), color var(--chat-dur-fast) var(--chat-ease);
}
@media (hover: hover) { .aichat-close:hover { border-color: var(--color-accent); color: var(--color-accent); } }
.aichat-close:focus-visible, .aichat-field:focus-visible, .aichat-chip:focus-visible,
.aichat-textbutton:focus-visible, .aichat-submit:focus-visible {
  outline: none; box-shadow: 0 0 0 2px var(--surface-base), 0 0 0 4px var(--focus-ring);
}
.aichat-body { overflow: auto; padding: 1.25rem; }
.aichat-intro { margin: 0 0 1rem; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.85; }
.aichat-urlform, .aichat-emailform { display: grid; gap: 0.8rem; }
.aichat-field {
  min-height: 3rem; width: 100%;
  border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  border-radius: var(--radius-sm); background: color-mix(in srgb, var(--surface-raised) 76%, transparent);
  color: var(--text-primary); padding: 0.85rem 1rem; font: inherit;
}
.aichat-field::placeholder { color: color-mix(in srgb, var(--text-primary) 42%, transparent); }
.aichat-submit {
  min-height: 3rem; border: 1px solid var(--color-accent); border-radius: var(--radius-sm);
  background: var(--color-accent); color: var(--text-on-inverse); font-weight: 700; cursor: pointer;
  transition: transform var(--chat-dur-fast) var(--chat-ease), opacity var(--chat-dur-fast) var(--chat-ease);
}
.aichat-submit:disabled { cursor: wait; opacity: 0.68; }
.aichat-submit:active { transform: scale(0.98); }
.aichat-progress { display: grid; gap: 0.65rem; margin-top: 1.1rem; }
.aichat-progress-row { display: flex; align-items: center; gap: 0.65rem; color: var(--text-secondary); font-size: 0.88rem; }
.aichat-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--color-accent); }
.aichat-summary {
  margin: 1rem 0; padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
  border-radius: var(--radius-sm); background: color-mix(in srgb, var(--surface-raised) 70%, transparent);
}
.aichat-summary p { margin: 0; color: var(--text-secondary); line-height: 1.8; }
.aichat-signals { display: grid; gap: 0.45rem; margin: 0.9rem 0 0; padding: 0; list-style: none; }
.aichat-signals li { color: var(--text-secondary); font-size: 0.84rem; }
.aichat-proposals { display: grid; gap: 0.8rem; margin: 1rem 0; }
.aichat-proposal {
  padding: 1rem; border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--text-primary) 13%, transparent);
  background: color-mix(in srgb, var(--surface-raised) 68%, transparent);
}
.aichat-axis {
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  margin-bottom: 0.5rem; color: var(--color-accent); font-size: 0.76rem; font-family: var(--font-en);
}
.aichat-proposal h3 { margin: 0 0 0.45rem; font-size: 1rem; line-height: 1.55; }
.aichat-proposal p { margin: 0; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.75; }
.aichat-question { margin-top: 1.2rem; }
.aichat-question h3, .aichat-emailform h3, .aichat-success h3, .aichat-plan h3, .aichat-baton h3 {
  margin: 0 0 0.75rem; font-size: 1.05rem;
}
.aichat-chips { display: flex; flex-wrap: wrap; gap: 0.55rem; }
.aichat-chip {
  border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  border-radius: var(--radius-pill); background: transparent; color: var(--text-primary);
  padding: 0.6rem 0.85rem; cursor: pointer; font: inherit;
}
@media (hover: hover) { .aichat-chip:hover { border-color: var(--color-accent); color: var(--color-accent); } }
.aichat-consent { display: flex; gap: 0.65rem; align-items: flex-start; color: var(--text-secondary); font-size: 0.84rem; line-height: 1.7; }
.aichat-consent input { margin-top: 0.25rem; }
.aichat-consent a, .aichat-link { color: var(--color-accent); }
.aichat-error { margin: 0.8rem 0; color: var(--color-accent-bright); font-size: 0.86rem; line-height: 1.6; }
.aichat-note { margin: 0.75rem 0 0; color: var(--text-secondary); font-size: 0.84rem; line-height: 1.7; }
.aichat-textbutton { border: 0; background: transparent; color: var(--color-accent); padding: 0; cursor: pointer; text-align: left; font: inherit; }
.aichat-success, .aichat-baton {
  display: grid; gap: 1rem; padding: 1rem; border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--color-accent) 34%, transparent);
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}
.aichat-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
/* --- v2: 進め方プラン / 事例 --- */
.aichat-plan { margin: 0.4rem 0 0; }
.aichat-plan-restate {
  margin: 0 0 1rem; font-size: 1rem; font-weight: 700; line-height: 1.6; color: var(--text-primary);
}
.aichat-steps { display: grid; gap: 0.7rem; margin: 0 0 1rem; padding: 0; list-style: none; }
.aichat-step { display: grid; grid-template-columns: auto 1fr; gap: 0.75rem; align-items: baseline; }
.aichat-step-phase { font-family: var(--font-en); font-size: 0.72rem; color: var(--color-accent); white-space: nowrap; }
.aichat-step-action { margin: 0; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; }
.aichat-plan-meta { display: grid; gap: 0.5rem; margin: 0 0 0.5rem; }
.aichat-plan-meta p { margin: 0; color: var(--text-secondary); font-size: 0.84rem; line-height: 1.7; }
.aichat-plan-meta strong { color: var(--text-primary); font-weight: 700; }
.aichat-agenda { margin: 0.6rem 0 0; padding-left: 1.1rem; color: var(--text-secondary); font-size: 0.84rem; line-height: 1.7; }
.aichat-case {
  margin: 1.1rem 0; padding: 1rem; border-radius: var(--radius-sm);
  border: 1px dashed color-mix(in srgb, var(--color-accent) 40%, transparent);
  background: color-mix(in srgb, var(--surface-raised) 66%, transparent);
}
.aichat-case-kicker { font-family: var(--font-en); font-size: 0.72rem; color: var(--color-accent); }
.aichat-case h4 { margin: 0.3rem 0 0.6rem; font-size: 0.98rem; line-height: 1.5; }
.aichat-case p { margin: 0.3rem 0; color: var(--text-secondary); font-size: 0.86rem; line-height: 1.7; }
.aichat-case-foot { margin-top: 0.6rem; font-size: 0.76rem; color: color-mix(in srgb, var(--text-primary) 55%, transparent); }
@media (prefers-reduced-motion: reduce) { .aichat-submit, .aichat-close { transition: none !important; } }
`;

let styleInjected = false;
export function useChatStyles() {
  React.useEffect(() => {
    if (styleInjected || typeof document === "undefined") return;
    const element = document.createElement("style");
    element.setAttribute("data-aichat", "");
    element.textContent = CHAT_STYLE;
    document.head.appendChild(element);
    styleInjected = true;
  }, []);
}

/** phase連動ヘッダー(ドロワー/ページ共用)。 */
export function chatHeaderFor(phase: string, companyName?: string): { kicker: string; title: string } {
  switch (phase) {
    case "insightsShown":
    case "analysisFailed":
      return { kicker: "3 Hypotheses", title: `${companyName || "御社"}への、3つの仮説。` };
    case "deepening":
      return { kicker: "Deep Dive", title: "もう少しだけ、御社のことを。" };
    case "focusBuilding":
      return { kicker: "Focus Plan", title: "進め方を、組み立てています。" };
    case "focusShown":
      return { kicker: "Focus Plan", title: `${companyName || "御社"}の進め方、一案。` };
    case "bookingStarted":
      return { kicker: "Booking", title: "日程調整を、別タブで開きました。" };
    case "emailRequested":
      return { kicker: "Email", title: "この診断を、メールでお送りします。" };
    case "leadCaptured":
      return { kicker: "Sent", title: "診断メモを送信しました。" };
    case "enriching":
      return { kicker: "One more", title: "最後に1つだけ。" };
    case "completed":
      return { kicker: "Ready", title: "準備が整いました。" };
    default:
      return { kicker: "AI Diagnosis", title: "御社ならAIをどう使えるか、診断します。" };
  }
}

function ProposalCard({ proposal }: { proposal: AiProposal }) {
  const axis = axisLabels[proposal.axis];
  return (
    <article className="aichat-proposal">
      <div className="aichat-axis">
        <span>{axis.label}</span>
        <span>{axis.body}</span>
      </div>
      <h3>{proposal.title}</h3>
      <p>{proposal.body}</p>
    </article>
  );
}

function ProgressRows({ hints, activeCount }: { hints: string[]; activeCount: number }) {
  return (
    <div className="aichat-progress" aria-live="polite">
      {hints.slice(0, activeCount).map((hint) => (
        <div className="aichat-progress-row" key={hint}>
          <span className="aichat-dot" aria-hidden="true" />
          <span>{hint}</span>
        </div>
      ))}
    </div>
  );
}

function FocusPlanView({ plan }: { plan: FocusPlan }) {
  return (
    <section className="aichat-plan" aria-label="進め方プラン">
      <p className="aichat-plan-restate">{plan.restatement}</p>
      <ul className="aichat-steps">
        {plan.steps.map((step, i) => (
          <li className="aichat-step" key={i}>
            <span className="aichat-step-phase">{step.phase}</span>
            <p className="aichat-step-action">{step.action}</p>
          </li>
        ))}
      </ul>
      <div className="aichat-plan-meta">
        <p><strong>honkomaがやること</strong>／{plan.roles.honkoma}</p>
        <p><strong>御社にお願いすること</strong>／{plan.roles.client}</p>
        <p><strong>必要になるもの</strong>／{plan.prerequisites}</p>
      </div>
      {plan.riskNote && <p className="aichat-note" style={{ margin: "0.4rem 0 0" }}>{plan.riskNote}</p>}
      {plan.agenda?.length > 0 && (
        <>
          <p className="aichat-note" style={{ margin: "0.9rem 0 0.2rem" }}>壁打ちで確認すること:</p>
          <ul className="aichat-agenda">
            {plan.agenda.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </>
      )}
    </section>
  );
}

function CaseCard({ record }: { record: CaseRecord }) {
  return (
    <section className="aichat-case" aria-label="近い状況の事例">
      <span className="aichat-case-kicker">近い状況では——</span>
      <h4>{record.title}</h4>
      {record.situation && <p>{record.situation}</p>}
      {record.approach && <p>{record.approach}</p>}
      {record.outcome && <p>{record.outcome}</p>}
      {record.duration && <p className="aichat-case-foot">期間: {record.duration}</p>}
      <p className="aichat-case-foot">事例は特定を避けるため、業種・規模など一部の表現を調整しています。</p>
    </section>
  );
}

export type ChatStageProps = {
  /** ドロワー内リンククリック時に閉じる(ページ埋め込み時は不要)。 */
  onNavigate?: () => void;
};

/** AI診断の本体(phase別)。ChatDrawer と AiDiagnosisPage が同一 provider で共有。 */
export function ChatStage({ onNavigate }: ChatStageProps) {
  const {
    state,
    startAnalysis,
    answerPain,
    skipDeepen,
    answerSize,
    answerMaturity,
    startBooking,
    requestEmail,
    updateEmail,
    updateConsent,
    submitEmailLead,
    declineEmail,
    answerEnrich,
    skipEnrich,
    resetChat,
  } = useAiChat();

  const [urlDraft, setUrlDraft] = React.useState(state.companyUrl);
  const [painRaw, setPainRaw] = React.useState("");
  const [showRaw, setShowRaw] = React.useState(false);
  const [analysisCount, setAnalysisCount] = React.useState(1);
  const [focusCount, setFocusCount] = React.useState(1);

  useChatStyles();

  React.useEffect(() => setUrlDraft(state.companyUrl), [state.companyUrl, state.isOpen]);

  React.useEffect(() => {
    const stepping = state.phase === "analyzing" || state.phase === "focusBuilding";
    if (!stepping) return undefined;
    const setter = state.phase === "analyzing" ? setAnalysisCount : setFocusCount;
    const max = (state.phase === "analyzing" ? analysisHints : focusHints).length;
    setter(1);
    const timer = window.setInterval(() => setter((c) => Math.min(c + 1, max)), dur.reveal * 1000);
    return () => window.clearInterval(timer);
  }, [state.phase]);

  const onUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void startAnalysis(state.source, urlDraft);
  };
  const onEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitEmailLead();
  };

  const hasAnalysis =
    state.analysis &&
    ["insightsShown", "analysisFailed", "deepening", "focusBuilding", "focusShown",
     "bookingStarted", "emailRequested", "leadCaptured", "enriching", "completed", "emailDeclined"].includes(state.phase);

  const showThreeCards = ["insightsShown", "analysisFailed", "deepening"].includes(state.phase);

  return (
    <>
      {(state.phase === "idle" || state.phase === "analyzing") && (
        <>
          <p className="aichat-intro">
            会社サイトのURLを入れてください。登録不要・約60秒で、honkomaならどこを自動化・売上化できるかを整理します。
          </p>
          <form className="aichat-urlform" onSubmit={onUrlSubmit}>
            <input
              className="aichat-field" value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://example.com" inputMode="url" autoComplete="url"
              disabled={state.isBusy}
            />
            <button className="aichat-submit" type="submit" disabled={state.isBusy}>
              {state.isBusy ? "読み込み中" : "AIに聞いてみる"}
            </button>
          </form>
        </>
      )}

      {state.phase === "analyzing" && <ProgressRows hints={analysisHints} activeCount={analysisCount} />}
      {state.error && <p className="aichat-error">{state.error}</p>}

      {hasAnalysis && state.analysis && (
        <>
          {state.phase === "analysisFailed" && (
            <p className="aichat-note">
              サイト取得またはAI応答が不安定だったため、入力URLをもとにした仮説診断で続行します。
            </p>
          )}

          {showThreeCards && (
            <>
              <section className="aichat-summary" aria-label="解析サマリー">
                <p>{state.analysis.analyzedSummary}</p>
                <ul className="aichat-signals">
                  {state.analysis.signals.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </section>
              <div className="aichat-proposals">
                {state.analysis.proposals.map((proposal, index) => (
                  <m.div
                    key={`${proposal.axis}-${proposal.title}`}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: dur.reveal, ease: ease.out, delay: index * stagger.tight }}
                  >
                    <ProposalCard proposal={proposal} />
                  </m.div>
                ))}
              </div>
            </>
          )}

          {/* Q1: いちばん重い課題 */}
          {(state.phase === "insightsShown" || state.phase === "analysisFailed") && (
            <section className="aichat-question" aria-label="課題の深掘り">
              <h3>3つのうち、実情に近いものはありましたか。</h3>
              <p className="aichat-intro">
                いちばん重い課題を1つだけ教えてください。ここから先の診断を、その課題に絞って組み直します。
              </p>
              <div className="aichat-chips">
                {PAIN_CHIPS.map((chip) => (
                  <button
                    key={chip.value} type="button" className="aichat-chip"
                    onClick={() => {
                      if (chip.value === "other") { setShowRaw(true); return; }
                      answerPain(chip.value);
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              {showRaw && (
                <form
                  className="aichat-urlform" style={{ marginTop: "0.8rem" }}
                  onSubmit={(e) => { e.preventDefault(); answerPain("other", painRaw.trim()); }}
                >
                  <input
                    className="aichat-field" value={painRaw} autoFocus
                    onChange={(e) => setPainRaw(e.target.value)}
                    placeholder="ひとことで課題を教えてください"
                  />
                  <button className="aichat-submit" type="submit">この課題で進める</button>
                </form>
              )}
              <button
                className="aichat-textbutton" type="button"
                style={{ marginTop: "0.9rem" }}
                onClick={() => void skipDeepen()}
              >
                質問に答えず、このまま相談する
              </button>
            </section>
          )}

          {/* Q2/Q3: 深掘り */}
          {state.phase === "deepening" && (
            <section className="aichat-question" aria-label="深掘り">
              {state.deepStep === 0 ? (
                <>
                  <h3>会社の規模だけ、教えてください。</h3>
                  <p className="aichat-intro">進め方の現実味——誰が運用を持てるか——を合わせます。</p>
                  <div className="aichat-chips">
                    {SIZE_CHIPS.map((chip) => (
                      <button key={chip.value} type="button" className="aichat-chip" onClick={() => answerSize(chip.value)}>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                  <button className="aichat-textbutton" type="button" style={{ marginTop: "0.9rem" }} onClick={() => answerSize(null)}>
                    スキップ
                  </button>
                </>
              ) : (
                <>
                  <h3>最後に1つ。AIやITツールの今は、どれに近いですか。</h3>
                  <div className="aichat-chips">
                    {MATURITY_CHIPS.map((chip) => (
                      <button key={chip.value} type="button" className="aichat-chip" onClick={() => void answerMaturity(chip.value)}>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                  <button className="aichat-textbutton" type="button" style={{ marginTop: "0.9rem" }} onClick={() => void answerMaturity(null)}>
                    スキップ
                  </button>
                </>
              )}
            </section>
          )}

          {state.phase === "focusBuilding" && <ProgressRows hints={focusHints} activeCount={focusCount} />}

          {/* focusShown: 進め方プラン + 事例 + 人間バトン */}
          {state.phase === "focusShown" && state.focusPlan && (
            <>
              <FocusPlanView plan={state.focusPlan} />
              {state.matchedCase && <CaseCard record={state.matchedCase} />}
              <section className="aichat-baton" aria-label="人間バトン">
                <h3>ここから先は、人が見ます。</h3>
                <p className="aichat-note" style={{ margin: 0 }}>
                  ここまでの診断は、公開情報とご回答から立てた仮説です。この内容は弊社代表も直接確認します。
                  まずはお気軽に、30分のオンライン相談（無料）で、御社の実情に合わせて組み直しませんか。売り込みはしません。
                </p>
                <div className="aichat-actions">
                  <ArrowCTA onClick={startBooking} variant="fill" direction="external" withText="弊社代表に相談してみる" label="弊社代表に無料オンラインで相談する" />
                  <small className="aichat-note" style={{ margin: 0 }}>30分・オンライン・無料</small>
                </div>
                <button className="aichat-textbutton" type="button" onClick={requestEmail}>
                  先にこの診断をメールで受け取る
                </button>
              </section>
            </>
          )}

          {state.phase === "bookingStarted" && (
            <section className="aichat-success" aria-live="polite">
              <h3>予約画面を、別タブで開きました。</h3>
              <p className="aichat-note" style={{ margin: 0 }}>
                予約フォームの「ご相談内容」欄に、この<strong>診断コード: {state.diagnosisCode}</strong>をお書きください。
                この診断を引き継いだ状態で当日を始められます。
              </p>
              <div className="aichat-actions">
                <ArrowCTA href={CAL_BOOKING_URL} variant="fill" direction="external" withText="日程調整をもう一度開く" label="日程調整をもう一度開く" />
              </div>
              <button className="aichat-textbutton" type="button" onClick={requestEmail}>
                日程が合わなければ、この診断をメールで残す
              </button>
            </section>
          )}

          {state.phase === "emailRequested" && (
            <form className="aichat-emailform" onSubmit={onEmailSubmit}>
              <h3>この診断を、メールでそのまま。</h3>
              <p className="aichat-intro">
                3つの仮説と、課題に絞った進め方・近い事例をまとめてお送りします。診断メモ以外のご案内は差し上げません。内容は代表の林も確認します。
              </p>
              <input
                className="aichat-field" type="email" value={state.email}
                onChange={(e) => updateEmail(e.target.value)}
                placeholder="name@company.co.jp" autoComplete="email"
              />
              <label className="aichat-consent">
                <input type="checkbox" checked={state.consent} onChange={(e) => updateConsent(e.target.checked)} />
                <span>
                  <Link to="/privacy" className="aichat-link" onClick={onNavigate}>プライバシーポリシー</Link>に同意します。
                </span>
              </label>
              <button className="aichat-submit" type="submit" disabled={state.isBusy}>
                {state.isBusy ? "送信中" : "診断を受け取る"}
              </button>
              <button className="aichat-textbutton" type="button" onClick={() => void declineEmail()}>
                今回は受け取らない
              </button>
            </form>
          )}

          {(state.phase === "leadCaptured" || state.phase === "enriching") && (
            <section className="aichat-success" aria-live="polite">
              {state.phase === "leadCaptured" && (
                <>
                  <h3>送信しました。数分で届きます。</h3>
                  <p className="aichat-note" style={{ margin: 0 }}>
                    {state.leadDryRun
                      ? "ローカル確認のため外部保存はdry-runです。"
                      : "診断メモをお送りしました。内容を見て話したくなったら、30分の枠をどうぞ。"}
                  </p>
                  <div className="aichat-actions">
                    <ArrowCTA href={CAL_BOOKING_URL} variant="outline" direction="external" withText="日程を選ぶ" label="日程を選ぶ" />
                  </div>
                </>
              )}
              <div>
                <p className="aichat-note" style={{ marginTop: state.phase === "leadCaptured" ? "0.9rem" : 0 }}>
                  よければ最後に1つだけ。答えなくても送信は完了しています。お立場は？
                </p>
                <div className="aichat-chips" style={{ marginTop: "0.6rem" }}>
                  {ROLE_CHIPS.map((r) => (
                    <button key={r} type="button" className="aichat-chip" onClick={() => answerEnrich(r)}>{r}</button>
                  ))}
                </div>
                <button className="aichat-textbutton" type="button" style={{ marginTop: "0.8rem" }} onClick={skipEnrich}>
                  ここまでで大丈夫
                </button>
              </div>
            </section>
          )}

          {state.phase === "completed" && (
            <section className="aichat-success" aria-live="polite">
              <h3>準備が整いました。</h3>
              <p className="aichat-note" style={{ margin: 0 }}>
                {state.contactMethod === "booking"
                  ? "当日は診断コードの内容から始めます。"
                  : "ありがとうございました。"}
              </p>
              <button className="aichat-textbutton" type="button" onClick={resetChat}>別のURLで診断する</button>
            </section>
          )}

          {state.phase === "emailDeclined" && (
            <section className="aichat-success" aria-live="polite">
              <h3>承知しました。</h3>
              <p className="aichat-note" style={{ margin: 0 }}>
                気が向いたら、日程はこちらからいつでも。
              </p>
              <div className="aichat-actions">
                <a className="aichat-link" href={CAL_BOOKING_URL} target="_blank" rel="noopener noreferrer">日程を選ぶ</a>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}

export default ChatStage;
