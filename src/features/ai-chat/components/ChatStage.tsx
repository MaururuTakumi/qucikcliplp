/* =============================================================================
 * ChatStage — AI診断の phase 別本体UI(contact-funnel-v2 / #46)。
 *
 * ChatDrawer(右ドロワーの殻)と AiDiagnosisPage(/ai インライン)で共有する。
 * UI正典は docs/ai-diagnosis-ui-redesign.md。Workerには触れない。
 * ========================================================================== */

import React from "react";
import { m, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { dur, ease, stagger } from "../../../design/tokens";
import { ArrowCTA } from "../../../components/ui/ArrowCTA";
import { useAiChat } from "../ChatProvider";
import type {
  AiMaturity,
  AiProposal,
  CaseRecord,
  ChatPhase,
  CompanySize,
  FocusPlan,
  PainCategory,
  ProposalAxis,
  Relationship,
} from "../types";
import { emailPlaceholderForCompany } from "../domain";

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

const MATURITY_CHIPS: { value: AiMaturity; label: string; helper: string }[] = [
  { value: "none", label: "まだほとんど使っていない", helper: "導入の最初の一歩から始めます。" },
  { value: "individual", label: "個人で使う人はいる", helper: "個人利用から業務への引き上げを前提にします。" },
  { value: "partial", label: "一部の業務で導入済み", helper: "定着と横展開から組み立てます。" },
  { value: "company", label: "全社的に活用している", helper: "内製化と高度化まで見据えます。" },
];

const ROLE_CHIPS = ["経営者・役員", "部門責任者", "現場担当", "情報収集中"];

const RELATIONSHIP_CHIPS: { value: Relationship; label: string }[] = [
  { value: "member", label: "経営者・役員・社員です" },
  { value: "supporter", label: "支援先・取引先として調べています" },
  { value: "research", label: "導入検討・情報収集です" },
];

function emailGateOptional() {
  const env = import.meta.env as unknown as Record<string, string | undefined>;
  return (env.VITE_EMAIL_GATE_OPTIONAL || env.EMAIL_GATE_OPTIONAL || "").toLowerCase() === "true";
}

const CHAT_STYLE = `
.aichat-overlay {
  position: fixed; inset: 0; z-index: 80; display: flex; justify-content: flex-end;
  background: color-mix(in srgb, var(--ink-900) 32%, transparent);
}
.aichat-panel {
  --chat-dur-fast: ${dur.fast}s; --chat-dur-base: ${dur.base}s; --chat-dur-reveal: ${dur.reveal}s;
  --chat-ease-soft: cubic-bezier(${ease.soft.join(",")});
  --chat-ease-out: cubic-bezier(${ease.out.join(",")});
  width: min(480px, 92vw); height: 100dvh; background: var(--surface-base); color: var(--text-primary);
  border-left: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  box-shadow: 0 24px 70px -24px color-mix(in srgb, var(--ink-900) 74%, transparent);
  overflow: hidden; display: flex; flex-direction: column;
}
.aichat-shell {
  --chat-dur-fast: ${dur.fast}s; --chat-dur-base: ${dur.base}s; --chat-dur-reveal: ${dur.reveal}s;
  --chat-ease-soft: cubic-bezier(${ease.soft.join(",")});
  --chat-ease-out: cubic-bezier(${ease.out.join(",")});
  display: flex; flex-direction: column; min-height: 520px; height: 100%;
  background: var(--surface-base); color: var(--text-primary);
}
.aichat-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  padding: 1.75rem 2rem 1rem;
}
.aichat-kicker {
  display: block; font-family: var(--font-en); font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent);
}
.aichat-title { margin: 0.5rem 0 0; font-size: 1.25rem; font-weight: 700; line-height: 1.5; }
.aichat-close {
  width: 2.75rem; height: 2.75rem; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  color: var(--text-primary); background: transparent; cursor: pointer;
  transition: border-color var(--chat-dur-fast) var(--chat-ease-soft), color var(--chat-dur-fast) var(--chat-ease-soft);
}
@media (hover: hover) { .aichat-close:hover { border-color: var(--color-accent); color: var(--color-accent); } }
.aichat-close:focus-visible, .aichat-field:focus-visible, .aichat-chip:focus-visible,
.aichat-textbutton:focus-visible, .aichat-submit:focus-visible, .aichat-copy:focus-visible {
  outline: none; box-shadow: 0 0 0 2px var(--surface-base), 0 0 0 4px var(--focus-ring);
}
.aichat-railwrap { padding: 0 2rem 1rem; }
.aichat-railtop { display: flex; justify-content: flex-end; min-height: 1rem; }
.aichat-railtext {
  color: color-mix(in srgb, var(--text-primary) 55%, transparent); font-size: 0.8rem; line-height: 1.7;
}
.aichat-rail { height: 2px; background: color-mix(in srgb, var(--text-primary) 10%, transparent); overflow: hidden; }
.aichat-railbar {
  display: block; height: 100%; background: linear-gradient(90deg, var(--brand-600), var(--brand-400));
  transition: width var(--chat-dur-base) var(--chat-ease-out);
}
.aichat-body { flex: 1; overflow: auto; padding: 1.75rem 2rem; }
.aichat-screen { display: grid; gap: 1.75rem; }
.aichat-block { display: grid; gap: 1rem; }
.aichat-tight { display: grid; gap: 0.5rem; }
.aichat-t1 { margin: 0; font-size: 1.25rem; font-weight: 700; line-height: 1.5; color: var(--text-primary); }
.aichat-t2 { margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.85; }
.aichat-t3 {
  margin: 0; font-family: var(--font-en); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--color-accent);
}
.aichat-t4 { margin: 0; color: color-mix(in srgb, var(--text-primary) 55%, transparent); font-size: 0.8rem; line-height: 1.7; }
.aichat-hairline { border-top: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent); padding-top: 1rem; }
.aichat-urlform { display: grid; gap: 1rem; }
.aichat-urlrow { display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; align-items: stretch; }
.aichat-emailform { display: grid; gap: 1rem; }
.aichat-field {
  min-height: 3.25rem; width: 100%;
  border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  border-radius: var(--radius-sm); background: var(--surface-raised);
  color: var(--text-primary); padding: 0.85rem 1rem; font: inherit;
}
.aichat-field::placeholder { color: color-mix(in srgb, var(--text-primary) 42%, transparent); }
.aichat-submit {
  min-height: 3.25rem; border: 1px solid var(--color-accent); border-radius: var(--radius-sm);
  background: var(--color-accent); color: var(--text-on-inverse); font-weight: 700; cursor: pointer;
  padding: 0 1rem;
  transition: transform var(--chat-dur-fast) var(--chat-ease-soft), opacity var(--chat-dur-fast) var(--chat-ease-soft);
}
.aichat-submit:disabled { cursor: wait; opacity: 0.68; }
.aichat-submit:active { transform: scale(0.98); }
.aichat-checklist { display: grid; gap: 1rem; }
.aichat-checkrow { display: grid; grid-template-columns: 1.4rem 1fr; gap: 0.5rem; align-items: center; }
.aichat-checkicon {
  width: 1.4rem; height: 1.4rem; display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-accent); font-size: 0.8rem;
}
.aichat-checkrow[data-state="future"] { opacity: 0.4; }
.aichat-checkrow[data-state="current"] .aichat-checkicon::before {
  content: ""; width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--color-accent);
  animation: aichatPulse var(--chat-dur-reveal) var(--chat-ease-soft) infinite alternate;
}
.aichat-checkrow[data-state="done"] .aichat-checkicon::before { content: "✓"; font-weight: 700; }
.aichat-checklabel { margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.85; }
.aichat-checkrow[data-state="current"] .aichat-checklabel { color: var(--text-primary); }
@keyframes aichatPulse { from { opacity: 0.4; } to { opacity: 1; } }
.aichat-read {
  display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 1rem 0;
  border-top: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
  color: color-mix(in srgb, var(--text-primary) 55%, transparent); font-size: 0.8rem; line-height: 1.7;
}
.aichat-proposals { display: grid; gap: 1rem; }
.aichat-proposal {
  padding: 1rem; border-radius: var(--radius-md);
  border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
  background: var(--surface-raised);
}
.aichat-axis {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  margin-bottom: 0.5rem; font-family: var(--font-en); font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent);
}
.aichat-proposal h3 { margin: 0 0 0.5rem; font-size: 1rem; font-weight: 700; line-height: 1.5; }
.aichat-proposal p { margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.85; }
.aichat-rationale {
  margin-top: 0.75rem !important; color: color-mix(in srgb, var(--text-primary) 55%, transparent) !important;
  font-size: 0.8rem !important; line-height: 1.7 !important;
}
.aichat-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.aichat-chip {
  min-height: 2.75rem; border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  border-radius: var(--radius-pill); background: transparent; color: var(--text-primary);
  padding: 0.65rem 1.1rem; cursor: pointer; font: inherit; text-align: left;
  transition: border-color var(--chat-dur-fast) var(--chat-ease-soft), color var(--chat-dur-fast) var(--chat-ease-soft), background var(--chat-dur-fast) var(--chat-ease-soft);
}
.aichat-chip--selected { background: var(--color-accent-soft); border-color: var(--color-accent); color: var(--text-primary); }
.aichat-chiprow { width: 100%; }
@media (hover: hover) { .aichat-chip:hover { border-color: var(--color-accent); color: var(--color-accent); } }
.aichat-recap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.aichat-echo { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.85; }
.aichat-consent { display: flex; gap: 0.5rem; align-items: flex-start; color: var(--text-secondary); font-size: 0.8rem; line-height: 1.7; }
.aichat-consent input { margin-top: 0.25rem; }
.aichat-consent a, .aichat-link { color: var(--color-accent); }
.aichat-error { margin: 0; color: var(--color-accent-bright); font-size: 0.8rem; line-height: 1.7; }
.aichat-textbutton, .aichat-copy {
  border: 0; background: transparent; color: var(--color-accent); padding: 0; cursor: pointer;
  text-align: left; font: inherit;
}
@media (hover: hover) { .aichat-textbutton:hover, .aichat-copy:hover { text-decoration: underline; } }
.aichat-timeline { position: relative; display: grid; gap: 1rem; margin: 0; padding: 0; list-style: none; }
.aichat-timeline::before {
  content: ""; position: absolute; left: 4.75rem; top: 0.4rem; bottom: 0.4rem;
  width: 1px; background: color-mix(in srgb, var(--text-primary) 10%, transparent);
}
.aichat-step { display: grid; grid-template-columns: 4rem 1fr; gap: 1rem; align-items: baseline; }
.aichat-step-phase { position: relative; z-index: 1; font-family: var(--font-en); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent); }
.aichat-step-action { margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.85; }
.aichat-details {
  border-top: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
  padding: 1rem 0;
}
.aichat-details summary { cursor: pointer; color: color-mix(in srgb, var(--text-primary) 55%, transparent); font-size: 0.8rem; line-height: 1.7; }
.aichat-details-content { display: grid; gap: 0.5rem; margin-top: 1rem; }
.aichat-case {
  display: grid; gap: 0.5rem; padding: 1rem; border-radius: var(--radius-md);
  border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
  background: var(--surface-raised);
}
.aichat-case h4 { margin: 0; font-size: 0.95rem; line-height: 1.85; }
.aichat-baton {
  display: grid; gap: 1rem; padding: 1rem; border-radius: var(--radius-md);
  background: var(--color-accent-soft);
}
.aichat-agenda { margin: 0; padding-left: 1.1rem; color: color-mix(in srgb, var(--text-primary) 55%, transparent); font-size: 0.8rem; line-height: 1.7; }
.aichat-sticky {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 1rem 2rem; border-top: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
  background: var(--surface-base);
}
.aichat-code {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 1rem; border-radius: var(--radius-md); background: var(--surface-raised);
  border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
}
.aichat-code strong {
  font-family: var(--font-en); font-size: 1.5rem; letter-spacing: 0.14em; line-height: 1.5;
}
.aichat-dawnline { height: 2px; background: linear-gradient(90deg, var(--brand-600), var(--brand-400)); }
@media (max-width: 767px) {
  .aichat-overlay { align-items: stretch; }
  .aichat-panel { width: 100vw; height: 100dvh; border-radius: 0; border-left: 0; }
  .aichat-head { padding: 1.25rem var(--space-gutter) 1rem; }
  .aichat-title, .aichat-t1 { font-size: 1.15rem; }
  .aichat-railwrap { padding: 0 var(--space-gutter) 1rem; }
  .aichat-body { padding: 1.25rem var(--space-gutter); }
  .aichat-sticky { padding: 1rem var(--space-gutter); }
  .aichat-urlrow { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .aichat-railbar, .aichat-submit, .aichat-close, .aichat-chip { transition: none !important; }
  .aichat-checkrow[data-state="current"] .aichat-checkicon::before { animation: none; opacity: 1; }
}
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

export function chatHeaderFor(phase: ChatPhase, companyName?: string): { kicker: string; title: string } {
  switch (phase) {
    case "analyzing":
      return { kicker: "Analyzing", title: "読み込んでいます。" };
    case "insightsShown":
    case "analysisFailed":
      return { kicker: "3 Hypotheses", title: `${companyName || "御社"}への、3つの仮説。` };
    case "emailGate":
      return { kicker: "Confirm", title: `${companyName || "御社"}の診断が、まとまりました。` };
    case "deepening":
      return { kicker: "Deep Dive", title: "もう少しだけ、御社のことを。" };
    case "focusBuilding":
      return { kicker: "Focus Plan", title: "進め方を、組み立てています。" };
    case "focusShown":
      return { kicker: "Focus Plan", title: `${companyName || "御社"}の進め方、一案。` };
    case "bookingStarted":
      return { kicker: "Booking", title: "予約画面を、別タブで開きました。" };
    case "emailRequested":
      return { kicker: "Email", title: "この診断を、メールでそのまま。" };
    case "leadCaptured":
      return { kicker: "Sent", title: "送信しました。数分で届きます。" };
    case "enriching":
      return { kicker: "One more", title: "最後に1つだけ。" };
    case "completed":
      return { kicker: "Ready", title: "準備が整いました。" };
    case "emailDeclined":
      return { kicker: "Email", title: "承知しました。" };
    default:
      return { kicker: "AI Diagnosis", title: "御社ならAIをどう使えるか、診断します。" };
  }
}

function painLabel(pain?: PainCategory | "") {
  return PAIN_CHIPS.find((chip) => chip.value === pain)?.label || "";
}

function sizeLabel(size?: CompanySize | null) {
  return SIZE_CHIPS.find((chip) => chip.value === size)?.label || "";
}

function maturityLabel(maturity?: AiMaturity | null) {
  return MATURITY_CHIPS.find((chip) => chip.value === maturity)?.label || "";
}

function progressFor(phase: ChatPhase, deepStep: number, analysisCount: number, focusCount: number) {
  if (phase === "analyzing") return 8 + Math.min(analysisCount, 3) * 7;
  if (phase === "emailGate") return 40;
  if (phase === "insightsShown" || phase === "analysisFailed") return 50;
  if (phase === "deepening") return deepStep === 0 ? 62 : 74;
  if (phase === "focusBuilding") return 80 + Math.min(focusCount, 3) * 5;
  if (phase === "idle") return 0;
  return 100;
}

function railLabel(phase: ChatPhase, deepStep: number) {
  if (phase === "emailGate") return "あと3問";
  if (phase === "deepening") return deepStep === 0 ? "あと2問" : "あと1問";
  if (phase === "focusBuilding") return "まもなく完成";
  if (phase === "focusShown" || phase === "bookingStarted" || phase === "leadCaptured" || phase === "completed") {
    return "診断完了";
  }
  return "";
}

function ProgressRail({
  phase,
  deepStep,
  analysisCount,
  focusCount,
}: {
  phase: ChatPhase;
  deepStep: number;
  analysisCount: number;
  focusCount: number;
}) {
  const progress = progressFor(phase, deepStep, analysisCount, focusCount);
  return (
    <div className="aichat-railwrap" aria-hidden="true">
      <div className="aichat-railtop">
        <span className="aichat-railtext">{railLabel(phase, deepStep)}</span>
      </div>
      <div className="aichat-rail"><span className="aichat-railbar" style={{ width: `${progress}%` }} /></div>
    </div>
  );
}

function ChecklistRows({ hints, activeCount }: { hints: string[]; activeCount: number }) {
  const currentIndex = Math.min(activeCount - 1, hints.length - 1);
  return (
    <div className="aichat-checklist" aria-live="polite">
      {hints.map((hint, index) => {
        const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "future";
        return (
          <div className="aichat-checkrow" data-state={state} key={hint}>
            <span className="aichat-checkicon" aria-hidden="true" />
            <p className="aichat-checklabel">{hint}</p>
          </div>
        );
      })}
    </div>
  );
}

function AnswerRecap({
  pain,
  size,
  maturity,
}: {
  pain: PainCategory | "";
  size: CompanySize | null;
  maturity: AiMaturity | null;
}) {
  const labels = [painLabel(pain), sizeLabel(size), maturityLabel(maturity)].filter(Boolean);
  if (!labels.length) return null;
  return (
    <div className="aichat-recap" aria-label="回答内容">
      {labels.map((label) => <span className="aichat-chip aichat-chip--selected" key={label}>{label}</span>)}
    </div>
  );
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
      {proposal.rationale && <p className="aichat-rationale">根拠: {proposal.rationale}</p>}
    </article>
  );
}

function FocusPlanView({ plan }: { plan: FocusPlan }) {
  return (
    <section className="aichat-block" aria-label="進め方プラン">
      <p className="aichat-t1">{plan.restatement}</p>
      <ol className="aichat-timeline">
        {plan.steps.map((step, index) => (
          <li className="aichat-step" key={`${step.phase}-${index}`}>
            <span className="aichat-step-phase">{String(index + 1).padStart(2, "0")}</span>
            <p className="aichat-step-action"><strong>{step.phase}</strong>／{step.action}</p>
          </li>
        ))}
      </ol>
      <details className="aichat-details">
        <summary>体制と前提を見る</summary>
        <div className="aichat-details-content">
          <p className="aichat-t2"><strong>honkomaがやること</strong>／{plan.roles.honkoma}</p>
          <p className="aichat-t2"><strong>御社にお願いすること</strong>／{plan.roles.client}</p>
          <p className="aichat-t2"><strong>必要になるもの</strong>／{plan.prerequisites}</p>
          {plan.riskNote && <p className="aichat-t4">{plan.riskNote}</p>}
        </div>
      </details>
    </section>
  );
}

function CaseCard({ record }: { record: CaseRecord }) {
  return (
    <section className="aichat-case" aria-label="近い状況の事例">
      <p className="aichat-t3">近い状況では</p>
      <h4>{record.title}</h4>
      {record.outcome && <p className="aichat-t2">{record.outcome}</p>}
      <details className="aichat-details">
        <summary>詳しく見る</summary>
        <div className="aichat-details-content">
          {record.situation && <p className="aichat-t2">{record.situation}</p>}
          {record.approach && <p className="aichat-t2">{record.approach}</p>}
          {record.duration && <p className="aichat-t4">期間: {record.duration}</p>}
        </div>
      </details>
      <p className="aichat-t4">事例は特定を避けるため、業種・規模など一部の表現を調整しています。</p>
    </section>
  );
}

function DiagnosisCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="aichat-code">
      <strong>{code}</strong>
      <button
        type="button"
        className="aichat-copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "コピーしました" : "コピー"}
      </button>
    </div>
  );
}

function StickyCtaBar({
  onBooking,
  onEmail,
  showEmail,
}: {
  onBooking: () => void;
  onEmail: () => void;
  showEmail: boolean;
}) {
  return (
    <footer className="aichat-sticky">
      <ArrowCTA onClick={onBooking} variant="fill" direction="external" withText="弊社代表に相談してみる" label="弊社代表に相談してみる" />
      {showEmail && (
        <button className="aichat-textbutton" type="button" onClick={onEmail}>
          メールで受け取る
        </button>
      )}
    </footer>
  );
}

export type ChatStageProps = {
  onNavigate?: () => void;
  onClose?: () => void;
};

export function ChatStage({ onNavigate, onClose }: ChatStageProps) {
  const {
    state,
    startAnalysis,
    answerPain,
    submitEmailGate,
    skipEmailGate,
    answerRelationship,
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
  const [longFocusWait, setLongFocusWait] = React.useState(false);
  const reduceMotion = useReducedMotion();

  useChatStyles();

  React.useEffect(() => setUrlDraft(state.companyUrl), [state.companyUrl, state.isOpen]);

  React.useEffect(() => {
    const stepping = state.phase === "analyzing" || state.phase === "focusBuilding";
    if (!stepping) return undefined;
    const setter = state.phase === "analyzing" ? setAnalysisCount : setFocusCount;
    const max = (state.phase === "analyzing" ? analysisHints : focusHints).length;
    setter(1);
    const timer = window.setInterval(() => setter((count) => Math.min(count + 1, max)), dur.reveal * 1000);
    return () => window.clearInterval(timer);
  }, [state.phase]);

  React.useEffect(() => {
    if (state.phase !== "focusBuilding") {
      setLongFocusWait(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setLongFocusWait(true), 8000);
    return () => window.clearTimeout(timer);
  }, [state.phase]);

  const head = chatHeaderFor(state.phase, state.analysis?.companyName);
  const hasAnalysis = Boolean(state.analysis);
  const showSticky = state.phase === "focusShown";
  const canSkipGate = emailGateOptional();
  const emailPlaceholder = emailPlaceholderForCompany(state.companyUrl);

  const onUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void startAnalysis(state.source, urlDraft);
  };

  const onEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitEmailLead();
  };

  const onGateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitEmailGate();
  };

  return (
    <section className="aichat-shell" data-theme="inverse">
      <header className="aichat-head">
        <div>
          <span className="aichat-kicker">{head.kicker}</span>
          <h2 id="aichat-title" className="aichat-title">{head.title}</h2>
        </div>
        {onClose && (
          <button className="aichat-close" type="button" onClick={onClose} aria-label="AI診断を閉じる">
            <X aria-hidden="true" size={18} />
          </button>
        )}
      </header>

      <ProgressRail
        phase={state.phase}
        deepStep={state.deepStep}
        analysisCount={analysisCount}
        focusCount={focusCount}
      />

      <div className="aichat-body">
        <m.div
          key={`${state.phase}-${state.deepStep}`}
          className="aichat-screen"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: dur.reveal, ease: ease.out }}
        >
          {state.phase === "idle" && (
            <>
              <div className="aichat-tight">
                <p className="aichat-t2">
                  会社サイトのURLを入れてください。約60秒で、3つの活用仮説を返します。
                </p>
              </div>
              <form className="aichat-urlform" onSubmit={onUrlSubmit}>
                <div className="aichat-urlrow">
                  <input
                    className="aichat-field"
                    value={urlDraft}
                    onChange={(event) => setUrlDraft(event.target.value)}
                    placeholder="https://example.com"
                    inputMode="url"
                    autoComplete="url"
                    disabled={state.isBusy}
                  />
                  <button className="aichat-submit" type="submit" disabled={state.isBusy}>
                    AIに聞いてみる
                  </button>
                </div>
              </form>
              <p className="aichat-t4">
                入力内容は品質向上・お問い合わせ対応のため保存されます。診断結果は、会社のメール宛にもお届けします。
              </p>
            </>
          )}

          {state.phase === "analyzing" && (
            <>
              <ChecklistRows hints={analysisHints} activeCount={analysisCount} />
              <div className="aichat-hairline aichat-emailform">
                <p className="aichat-t4">解析がまとまったら、このアドレスで結果を確認できます。</p>
                <input
                  className="aichat-field"
                  type="email"
                  value={state.email}
                  onChange={(event) => updateEmail(event.target.value)}
                  placeholder={emailPlaceholder}
                  autoComplete="email"
                />
                <label className="aichat-consent">
                  <input type="checkbox" checked={state.consent} onChange={(event) => updateConsent(event.target.checked)} />
                  <span>
                    <Link to="/privacy" className="aichat-link" onClick={onNavigate}>プライバシーポリシー</Link>に同意します。
                  </span>
                </label>
              </div>
              {state.error && <p className="aichat-error">{state.error}</p>}
            </>
          )}

          {hasAnalysis && state.analysis && (state.phase === "insightsShown" || state.phase === "analysisFailed") && (
            <>
              {state.phase === "analysisFailed" && (
                <p className="aichat-t4">
                  サイトの読み込みが不安定だったため、仮説ベースで続けます。壁打ちではその分、実情の聞き取りから始めます。
                </p>
              )}
              <div className="aichat-tight">
                <p className="aichat-t2">{state.analysis.analyzedSummary}</p>
                {state.analysis.signals.length > 0 && (
                  <p className="aichat-read">読み取り: {state.analysis.signals.slice(0, 3).join(" ／ ")}</p>
                )}
              </div>
              <div className="aichat-proposals">
                {state.analysis.proposals.map((proposal, index) => (
                  <m.div
                    key={`${proposal.axis}-${proposal.title}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: dur.reveal, ease: ease.out, delay: index * stagger.tight }}
                  >
                    <ProposalCard proposal={proposal} />
                  </m.div>
                ))}
              </div>
              <section className="aichat-block aichat-hairline" aria-label="課題の深掘り">
                <div className="aichat-tight">
                  <h3 className="aichat-t1">3つのうち、実情に近いものはありましたか。</h3>
                  <p className="aichat-t2">
                    いちばん重い課題を1つ。ここから先の診断を、その課題に絞って組み直します。
                  </p>
                </div>
                <div className="aichat-chips">
                  {PAIN_CHIPS.map((chip) => (
                    <button
                      key={chip.value}
                      type="button"
                      className="aichat-chip"
                      onClick={() => {
                        if (chip.value === "other") {
                          setShowRaw(true);
                          return;
                        }
                        answerPain(chip.value);
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                {showRaw && (
                  <form className="aichat-urlform" onSubmit={(event) => { event.preventDefault(); answerPain("other", painRaw.trim()); }}>
                    <input
                      className="aichat-field"
                      value={painRaw}
                      autoFocus
                      onChange={(event) => setPainRaw(event.target.value)}
                      placeholder="ひとことで課題を教えてください"
                    />
                    <button className="aichat-submit" type="submit">この課題で進める</button>
                  </form>
                )}
                <button className="aichat-textbutton" type="button" onClick={() => void skipDeepen()}>
                  質問に答えず、このまま相談する
                </button>
              </section>
            </>
          )}

          {state.phase === "emailGate" && (
            state.gateStep === 1 ? (
              <section className="aichat-block" aria-live="polite">
                <div className="aichat-tight">
                  <h3 className="aichat-t1">ありがとうございます。ひとつだけ教えてください。</h3>
                  <p className="aichat-t2">
                    {state.emailDomainMatch === "mismatch"
                      ? `${state.analysis?.companyName || "診断対象"}とご入力のドメインが異なるようです。お立場に近いものは？`
                      : "ご入力は個人のアドレスのようです。お立場に近いものは？"}
                  </p>
                </div>
                <div className="aichat-chips">
                  {RELATIONSHIP_CHIPS.map((chip) => (
                    <button key={chip.value} type="button" className="aichat-chip aichat-chiprow" onClick={() => void answerRelationship(chip.value)}>
                      {state.analysis?.companyName && chip.value === "member"
                        ? `${state.analysis.companyName}の${chip.label}`
                        : chip.label}
                    </button>
                  ))}
                </div>
                <button className="aichat-textbutton" type="button" onClick={() => void answerRelationship("unknown")}>
                  答えずに進む
                </button>
              </section>
            ) : (
              <form className="aichat-emailform" onSubmit={onGateSubmit}>
                <div className="aichat-tight">
                  <h3 className="aichat-t1">{state.analysis?.companyName || "御社"}の診断が、まとまりました。</h3>
                  {state.analysis && (
                    <>
                      <p className="aichat-t2">{state.analysis.analyzedSummary}</p>
                      {state.analysis.signals.length > 0 && (
                        <p className="aichat-read">読み取り: {state.analysis.signals.slice(0, 3).join(" ／ ")}</p>
                      )}
                    </>
                  )}
                </div>
                <p className="aichat-t2">
                  3つの活用仮説（売上・コスト・現場実装）と、課題に絞った進め方プランまで用意できます。
                </p>
                <p className="aichat-t2">
                  ここから先は、{state.analysis?.companyName || "御社"}の関係者の方に向けた内容です。
                  会社のメールアドレスをご入力ください。診断対象のドメインとの一致を確認のうえ、結果はこのアドレスにもお送りします。
                </p>
                <input
                  className="aichat-field"
                  type="email"
                  value={state.email}
                  onChange={(event) => updateEmail(event.target.value)}
                  placeholder={emailPlaceholder}
                  autoComplete="email"
                />
                <label className="aichat-consent">
                  <input type="checkbox" checked={state.consent} onChange={(event) => updateConsent(event.target.checked)} />
                  <span>
                    <Link to="/privacy" className="aichat-link" onClick={onNavigate}>プライバシーポリシー</Link>に同意します。
                  </span>
                </label>
                {state.error && <p className="aichat-error">{state.error}</p>}
                <button className="aichat-submit" type="submit" disabled={state.isBusy}>
                  {state.isBusy ? "確認中" : "確認して、診断を見る"}
                </button>
                <p className="aichat-t4">
                  無料です。診断結果のほかに営業のご案内をお送りすることはありません。
                  会社のアドレスがない場合は、ふだんお使いのアドレスでも進めます。
                </p>
                {canSkipGate && (
                  <button className="aichat-textbutton" type="button" onClick={skipEmailGate}>
                    あとで進む
                  </button>
                )}
              </form>
            )
          )}

          {state.phase === "deepening" && (
            <section className="aichat-block" aria-label="深掘り">
              <AnswerRecap pain={state.painPoint} size={state.companySize} maturity={state.aiMaturity} />
              {state.deepStep === 0 ? (
                <>
                  <p className="aichat-t3">Q2 / 3</p>
                  <div className="aichat-tight">
                    <h3 className="aichat-t1">会社の規模だけ、教えてください。</h3>
                    <p className="aichat-t2">誰が運用を持てるか——進め方の現実味を合わせます。</p>
                  </div>
                  <div className="aichat-chips">
                    {SIZE_CHIPS.map((chip) => (
                      <button key={chip.value} type="button" className="aichat-chip" onClick={() => answerSize(chip.value)}>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                  {state.companySize && <p className="aichat-echo">{sizeLabel(state.companySize)}の体制を前提に組み立てます。</p>}
                  <button className="aichat-textbutton" type="button" onClick={() => answerSize(null)}>
                    スキップして次へ
                  </button>
                </>
              ) : (
                <>
                  <p className="aichat-t3">Q3 / 3</p>
                  <div className="aichat-tight">
                    <h3 className="aichat-t1">最後に1つ。AIやITツールの今は。</h3>
                    <p className="aichat-t2">始め方の位置を合わせます。</p>
                  </div>
                  <div className="aichat-chips">
                    {MATURITY_CHIPS.map((chip) => (
                      <button key={chip.value} type="button" className="aichat-chip aichat-chiprow" onClick={() => void answerMaturity(chip.value)}>
                        {chip.label}
                      </button>
                    ))}
                  </div>
                  {state.aiMaturity && <p className="aichat-echo">{MATURITY_CHIPS.find((chip) => chip.value === state.aiMaturity)?.helper}</p>}
                  <button className="aichat-textbutton" type="button" onClick={() => void answerMaturity(null)}>
                    スキップして次へ
                  </button>
                </>
              )}
            </section>
          )}

          {state.phase === "focusBuilding" && (
            <>
              <AnswerRecap pain={state.painPoint} size={state.companySize} maturity={state.aiMaturity} />
              <div className="aichat-tight">
                <h3 className="aichat-t1">{painLabel(state.painPoint) || "御社の課題"}に絞って、組み立てています。</h3>
              </div>
              <ChecklistRows hints={focusHints} activeCount={focusCount} />
              {longFocusWait && <p className="aichat-t4">もう少しです。公開情報が多い会社ほど、少し時間がかかります。</p>}
            </>
          )}

          {state.phase === "focusShown" && state.focusPlan && (
            <>
              <FocusPlanView plan={state.focusPlan} />
              {state.matchedCase ? (
                <CaseCard record={state.matchedCase} />
              ) : (
                <p className="aichat-t4">近い事例は、壁打ちで直接ご紹介します。</p>
              )}
              <section className="aichat-baton" aria-label="人間バトン">
                <h3 className="aichat-t1">ここから先は、人が見ます。</h3>
                <p className="aichat-t2">
                  ここまでは、公開情報とご回答から立てた仮説です。内容は弊社代表も直接確認します。
                  まずはお気軽に、30分のオンライン相談（無料）で、御社の実情に合わせて組み直しませんか。売り込みはしません。
                </p>
                {state.email && <p className="aichat-t4">この内容はレポートとして {state.email} にお送りします。</p>}
                {state.focusPlan.agenda?.length > 0 && (
                  <ul className="aichat-agenda">
                    {state.focusPlan.agenda.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            </>
          )}

          {state.phase === "bookingStarted" && (
            <section className="aichat-block" aria-live="polite">
              <DiagnosisCodeBlock code={state.diagnosisCode} />
              <p className="aichat-t2">
                予約フォームの「ご相談内容」欄に、この診断コードをお書きください。診断を引き継いだ状態で当日を始められます。
                診断レポートは {state.email || "ご入力のメールアドレス"} にお届けします。
              </p>
              <div className="aichat-hairline">
                <ArrowCTA href={CAL_BOOKING_URL} variant="outline" direction="external" withText="日程調整をもう一度開く" label="日程調整をもう一度開く" />
              </div>
            </section>
          )}

          {state.phase === "emailRequested" && (
            <form className="aichat-emailform" onSubmit={onEmailSubmit}>
              <div className="aichat-tight">
                <h3 className="aichat-t1">この診断を、メールでそのまま。</h3>
                <p className="aichat-t2">
                  3つの仮説と、課題に絞った進め方・近い事例をまとめてお送りします。診断メモ以外のご案内は差し上げません。内容は弊社代表も確認します。
                </p>
              </div>
              <input
                className="aichat-field"
                type="email"
                value={state.email}
                onChange={(event) => updateEmail(event.target.value)}
                placeholder="name@company.co.jp"
                autoComplete="email"
              />
              <label className="aichat-consent">
                <input type="checkbox" checked={state.consent} onChange={(event) => updateConsent(event.target.checked)} />
                <span>
                  <Link to="/privacy" className="aichat-link" onClick={onNavigate}>プライバシーポリシー</Link>に同意します。
                </span>
              </label>
              {state.error && <p className="aichat-error">{state.error}</p>}
              <button className="aichat-submit" type="submit" disabled={state.isBusy}>
                {state.isBusy ? "送信中" : "診断を受け取る"}
              </button>
              <button className="aichat-textbutton" type="button" onClick={() => void declineEmail()}>
                今回は受け取らない
              </button>
            </form>
          )}

          {(state.phase === "leadCaptured" || state.phase === "enriching") && (
            <section className="aichat-block" aria-live="polite">
              {state.phase === "leadCaptured" && (
                <>
                  <div className="aichat-tight">
                    <h3 className="aichat-t1">送信しました。数分で届きます。</h3>
                    <p className="aichat-t2">
                      {state.leadDryRun
                        ? "ローカル確認のため外部保存はdry-runです。"
                        : "内容を見て話したくなったら、30分の枠をどうぞ。"}
                    </p>
                  </div>
                  <ArrowCTA href={CAL_BOOKING_URL} variant="outline" direction="external" withText="日程を選ぶ" label="日程を選ぶ" />
                </>
              )}
              <div className="aichat-hairline aichat-block">
                <p className="aichat-t3">One more</p>
                <p className="aichat-t2">答えなくても、送信は完了しています。お立場は？</p>
                <div className="aichat-chips">
                  {ROLE_CHIPS.map((role) => (
                    <button key={role} type="button" className="aichat-chip" onClick={() => answerEnrich(role)}>{role}</button>
                  ))}
                </div>
                <button className="aichat-textbutton" type="button" onClick={skipEnrich}>
                  ここまでで大丈夫
                </button>
              </div>
            </section>
          )}

          {state.phase === "completed" && (
            <section className="aichat-block" aria-live="polite">
              <div className="aichat-dawnline" />
              <p className="aichat-t2">
                {state.emailCaptured
                  ? "診断レポートをメールでお送りしました。"
                  : state.contactMethod === "booking"
                    ? "当日は診断コードの内容から始めます。"
                    : "ありがとうございました。"}
              </p>
              <button className="aichat-textbutton" type="button" onClick={resetChat}>別のURLで診断する</button>
            </section>
          )}

          {state.phase === "emailDeclined" && (
            <section className="aichat-block" aria-live="polite">
              <p className="aichat-t2">気が向いたら、日程はこちらからいつでも。</p>
              <a className="aichat-link" href={CAL_BOOKING_URL} target="_blank" rel="noopener noreferrer">日程を選ぶ</a>
            </section>
          )}

          {state.error && state.phase !== "emailGate" && state.phase !== "emailRequested" && (
            <p className="aichat-error">{state.error}</p>
          )}
        </m.div>
      </div>

      {showSticky && (
        <StickyCtaBar
          onBooking={startBooking}
          onEmail={requestEmail}
          showEmail={false}
        />
      )}
    </section>
  );
}

export default ChatStage;
