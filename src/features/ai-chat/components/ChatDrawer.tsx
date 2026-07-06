import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { dur, ease, stagger } from "../../../design/tokens";
import { ArrowCTA } from "../../../components/ui/ArrowCTA";
import { useAiChat } from "../ChatProvider";
import type { AiProposal, ProposalAxis } from "../types";

/** cal.com 予約(ChatProvider と同一・完了画面の戻り導線用)。 */
const CAL_BOOKING_URL =
  "https://cal.com/takumi-honkoma-mljb0f/honkoma-meeting?overlayCalendar=true";

/** phase連動ヘッダー(§E.2-1: 静的タイトルの陳腐化を解消)。 */
function headerFor(phase: string, companyName?: string): { kicker: string; title: string } {
  switch (phase) {
    case "insightsShown":
    case "analysisFailed":
      return {
        kicker: "3 Hypotheses",
        title: `${companyName ? companyName : "御社"}への、3つの仮説。`,
      };
    case "bookingStarted":
      return { kicker: "Booking", title: "日程調整を、別タブで開きました。" };
    case "emailRequested":
      return { kicker: "Email", title: "この3案を、メールでお送りします。" };
    case "leadCaptured":
      return { kicker: "Sent", title: "診断メモを送信しました。" };
    case "emailDeclined":
      return { kicker: "Share", title: "共有用の受け皿を用意しました。" };
    default:
      return { kicker: "AI Diagnosis", title: "御社ならAIをどう使えるか、30秒で3案にします。" };
  }
}

const analysisHints = [
  "公開サイトを読み込んでいます",
  "事業内容と問い合わせ導線を確認しています",
  "honkomaの提供価値3軸に整理しています",
];

const axisLabels: Record<ProposalAxis, { label: string; body: string }> = {
  top_line: { label: "TOP LINE", body: "売上を伸ばす" },
  bottom_line: { label: "BOTTOM LINE", body: "コストを削る" },
  fde: { label: "FDE", body: "現場で作り切る" },
};

const CHAT_STYLE = `
.aichat-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: color-mix(in srgb, var(--ink-900) 48%, transparent);
}
.aichat-panel {
  --chat-dur-fast: ${dur.fast}s;
  --chat-dur-base: ${dur.base}s;
  --chat-dur-reveal: ${dur.reveal}s;
  --chat-ease: cubic-bezier(${ease.soft.join(",")});
  width: min(100vw, 520px);
  max-height: min(92vh, 760px);
  background: var(--surface-base);
  color: var(--text-primary);
  border: 1px solid color-mix(in srgb, var(--text-primary) 14%, transparent);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  box-shadow: 0 24px 70px -24px color-mix(in srgb, var(--ink-900) 74%, transparent);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.aichat-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
}
.aichat-title {
  margin: 0.2rem 0 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.45;
}
.aichat-kicker {
  display: block;
  font-family: var(--font-en);
  font-size: 0.72rem;
  color: var(--color-accent);
}
.aichat-close {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
  transition: border-color var(--chat-dur-fast) var(--chat-ease), color var(--chat-dur-fast) var(--chat-ease);
}
@media (hover: hover) {
  .aichat-close:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}
.aichat-close:focus-visible,
.aichat-field:focus-visible,
.aichat-chip:focus-visible,
.aichat-textbutton:focus-visible,
.aichat-submit:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--surface-base), 0 0 0 4px var(--focus-ring);
}
.aichat-body {
  overflow: auto;
  padding: 1.25rem;
}
.aichat-intro {
  margin: 0 0 1rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.85;
}
.aichat-urlform,
.aichat-emailform {
  display: grid;
  gap: 0.8rem;
}
.aichat-field {
  min-height: 3rem;
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--surface-raised) 76%, transparent);
  color: var(--text-primary);
  padding: 0.85rem 1rem;
  font: inherit;
}
.aichat-field::placeholder {
  color: color-mix(in srgb, var(--text-primary) 42%, transparent);
}
.aichat-submit {
  min-height: 3rem;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--text-on-inverse);
  font-weight: 700;
  cursor: pointer;
  transition: transform var(--chat-dur-fast) var(--chat-ease), opacity var(--chat-dur-fast) var(--chat-ease);
}
.aichat-submit:disabled {
  cursor: wait;
  opacity: 0.68;
}
.aichat-submit:active {
  transform: scale(0.98);
}
.aichat-progress {
  display: grid;
  gap: 0.65rem;
  margin-top: 1.1rem;
}
.aichat-progress-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--text-secondary);
  font-size: 0.88rem;
}
.aichat-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--color-accent);
}
.aichat-summary {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--surface-raised) 70%, transparent);
}
.aichat-summary p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
}
.aichat-signals {
  display: grid;
  gap: 0.45rem;
  margin: 0.9rem 0 0;
  padding: 0;
  list-style: none;
}
.aichat-signals li {
  color: var(--text-secondary);
  font-size: 0.84rem;
}
.aichat-proposals {
  display: grid;
  gap: 0.8rem;
  margin: 1rem 0;
}
.aichat-proposal {
  padding: 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--text-primary) 13%, transparent);
  background: color-mix(in srgb, var(--surface-raised) 68%, transparent);
}
.aichat-axis {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  color: var(--color-accent);
  font-size: 0.76rem;
  font-family: var(--font-en);
}
.aichat-proposal h3 {
  margin: 0 0 0.45rem;
  font-size: 1rem;
  line-height: 1.55;
}
.aichat-proposal p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.75;
}
.aichat-question {
  margin-top: 1.2rem;
}
.aichat-question h3,
.aichat-emailform h3,
.aichat-success h3 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
}
.aichat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}
.aichat-chip {
  border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text-primary);
  padding: 0.6rem 0.85rem;
  cursor: pointer;
}
@media (hover: hover) {
  .aichat-chip:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}
.aichat-consent {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.7;
}
.aichat-consent input {
  margin-top: 0.25rem;
}
.aichat-consent a,
.aichat-link {
  color: var(--color-accent);
}
.aichat-error {
  margin: 0.8rem 0;
  color: var(--color-accent-bright);
  font-size: 0.86rem;
  line-height: 1.6;
}
.aichat-note {
  margin: 0.75rem 0 0;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.7;
}
.aichat-textbutton {
  border: 0;
  background: transparent;
  color: var(--color-accent);
  padding: 0;
  cursor: pointer;
  text-align: left;
  font: inherit;
}
.aichat-success {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--color-accent) 34%, transparent);
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}
.aichat-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
@media (min-width: 768px) {
  .aichat-overlay {
    align-items: stretch;
    justify-content: flex-end;
  }
  .aichat-panel {
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .aichat-panel,
  .aichat-submit,
  .aichat-close {
    transition: none !important;
  }
}
`;

let styleInjected = false;

function useChatStyles() {
  React.useEffect(() => {
    if (styleInjected || typeof document === "undefined") return;
    const element = document.createElement("style");
    element.setAttribute("data-aichat", "");
    element.textContent = CHAT_STYLE;
    document.head.appendChild(element);
    styleInjected = true;
  }, []);
}

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
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

function ProgressRows({ activeCount }: { activeCount: number }) {
  return (
    <div className="aichat-progress" aria-live="polite">
      {analysisHints.slice(0, activeCount).map((hint) => (
        <div className="aichat-progress-row" key={hint}>
          <span className="aichat-dot" aria-hidden="true" />
          <span>{hint}</span>
        </div>
      ))}
    </div>
  );
}

export function ChatDrawer() {
  const {
    state,
    closeChat,
    startAnalysis,
    startBooking,
    requestEmail,
    updateEmail,
    updateConsent,
    submitEmailLead,
    declineEmail,
    resetChat,
  } = useAiChat();
  const panelRef = React.useRef<HTMLElement | null>(null);
  const [urlDraft, setUrlDraft] = React.useState(state.companyUrl);
  const [progressCount, setProgressCount] = React.useState(1);

  useChatStyles();

  React.useEffect(() => {
    setUrlDraft(state.companyUrl);
  }, [state.companyUrl, state.isOpen]);

  React.useEffect(() => {
    if (!state.isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const first = panelRef.current ? getFocusable(panelRef.current)[0] : undefined;
      first?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeChat();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = getFocusable(panelRef.current);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousActive?.focus();
    };
  }, [closeChat, state.isOpen]);

  React.useEffect(() => {
    if (state.phase !== "analyzing") {
      setProgressCount(1);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setProgressCount((current) => Math.min(current + 1, analysisHints.length));
    }, dur.reveal * 1000);

    return () => window.clearInterval(timer);
  }, [state.phase]);

  const onUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void startAnalysis(state.source, urlDraft);
  };

  const onEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitEmailLead();
  };

  const hasAnalysis =
    state.analysis &&
    [
      "insightsShown",
      "bookingStarted",
      "emailRequested",
      "leadCaptured",
      "analysisFailed",
      "emailDeclined",
    ].includes(state.phase);

  const head = headerFor(state.phase, state.analysis?.companyName);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <m.div
          className="aichat-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur.fast, ease: ease.soft }}
          role="presentation"
          onClick={(event) => {
            /* §E.2-2: オーバーレイ(パネル外)クリックで閉じる。状態は保持される。 */
            if (event.target === event.currentTarget) closeChat();
          }}
        >
          <m.aside
            ref={panelRef}
            className="aichat-panel"
            data-theme="inverse"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aichat-title"
            initial={{ x: "100%", y: "8%" }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "100%", y: "8%" }}
            transition={{ duration: dur.base, ease: ease.inOut }}
          >
            <header className="aichat-head">
              <div>
                <span className="aichat-kicker">{head.kicker}</span>
                <h2 id="aichat-title" className="aichat-title">
                  {head.title}
                </h2>
              </div>
              <button className="aichat-close" type="button" onClick={closeChat} aria-label="AI診断を閉じる">
                <X aria-hidden="true" size={18} />
              </button>
            </header>

            <div className="aichat-body">
              {(state.phase === "idle" || state.phase === "analyzing") && (
                <>
                  <p className="aichat-intro">
                    会社サイトのURLを入れてください。登録不要で、honkomaならどこを自動化・売上化できるかを整理します。
                  </p>
                  <form className="aichat-urlform" onSubmit={onUrlSubmit}>
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
                      {state.isBusy ? "読み込み中" : "AIに聞いてみる"}
                    </button>
                  </form>
                </>
              )}

              {state.phase === "analyzing" && <ProgressRows activeCount={progressCount} />}

              {state.error && <p className="aichat-error">{state.error}</p>}

              {hasAnalysis && state.analysis && (
                <>
                  {state.phase === "analysisFailed" && (
                    <p className="aichat-note">
                      サイト取得またはAI応答が不安定だったため、入力URLをもとにした仮説診断で続行します。
                    </p>
                  )}

                  <section className="aichat-summary" aria-label="解析サマリー">
                    <p>{state.analysis.analyzedSummary}</p>
                    <ul className="aichat-signals">
                      {state.analysis.signals.map((signal) => (
                        <li key={signal}>{signal}</li>
                      ))}
                    </ul>
                  </section>

                  <div className="aichat-proposals">
                    {state.analysis.proposals.map((proposal, index) => (
                      <m.div
                        key={`${proposal.axis}-${proposal.title}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: dur.reveal,
                          ease: ease.out,
                          delay: index * stagger.tight,
                        }}
                      >
                        <ProposalCard proposal={proposal} />
                      </m.div>
                    ))}
                  </div>

                  {(state.phase === "insightsShown" || state.phase === "analysisFailed") && (
                    <section className="aichat-question" aria-label="次の一歩">
                      <h3>この3案、合っていますか。</h3>
                      <p className="aichat-intro">
                        {state.phase === "analysisFailed"
                          ? "今回は公開情報が少なく、仮説の割合が大きめです。30分あれば、実情ベースで作り直せます。オンライン・無料で、売り込みはしません。"
                          : "公開サイトから立てた仮説なので、実情とずれている部分があるはずです。30分の壁打ちで、そのずれごと御社仕様に組み直します。オンライン・無料で、売り込みはしません。"}
                      </p>
                      <div className="aichat-actions">
                        <ArrowCTA
                          onClick={startBooking}
                          variant="fill"
                          direction="external"
                          withText="日程を選ぶ"
                          label="担当との30分壁打ちを予約する"
                        />
                        <small className="aichat-note" style={{ margin: 0 }}>
                          30分・オンライン・無料
                        </small>
                      </div>
                      <button className="aichat-textbutton" type="button" onClick={requestEmail} style={{ marginTop: "0.9rem" }}>
                        今は話すほどではない方へ——この3案をメールで残す
                      </button>
                    </section>
                  )}

                  {state.phase === "bookingStarted" && (
                    <section className="aichat-success" aria-live="polite">
                      <h3>予約画面を、別タブで開きました。</h3>
                      <p className="aichat-note">
                        日程を選ぶと確定します。開かなかった場合は、下のボタンからどうぞ。
                      </p>
                      <div className="aichat-actions">
                        <ArrowCTA
                          href={CAL_BOOKING_URL}
                          variant="fill"
                          direction="external"
                          withText="日程調整をもう一度開く"
                          label="日程調整をもう一度開く"
                        />
                      </div>
                      <button className="aichat-textbutton" type="button" onClick={requestEmail} style={{ marginTop: "0.9rem" }}>
                        日程が合わなければ、この3案をメールで残す
                      </button>
                    </section>
                  )}

                  {state.phase === "emailRequested" && (
                    <form className="aichat-emailform" onSubmit={onEmailSubmit}>
                      <h3>この3案を、メールでそのまま。</h3>
                      <p className="aichat-intro">
                        いま画面にある3案と診断メモをお送りします。不要なご案内は差し上げません。
                      </p>
                      <input
                        className="aichat-field"
                        type="email"
                        value={state.email}
                        onChange={(event) => updateEmail(event.target.value)}
                        placeholder="name@company.co.jp"
                        autoComplete="email"
                      />
                      <label className="aichat-consent">
                        <input
                          type="checkbox"
                          checked={state.consent}
                          onChange={(event) => updateConsent(event.target.checked)}
                        />
                        <span>
                          <Link to="/privacy" className="aichat-link" onClick={closeChat}>
                            プライバシーポリシー
                          </Link>
                          に同意します。
                        </span>
                      </label>
                      <button className="aichat-submit" type="submit" disabled={state.isBusy}>
                        {state.isBusy ? "送信中" : "メールで受け取る"}
                      </button>
                      <button className="aichat-textbutton" type="button" onClick={() => void declineEmail()}>
                        メールは使わず、共有リンクで残す
                      </button>
                    </form>
                  )}

                  {state.phase === "leadCaptured" && (
                    <section className="aichat-success" aria-live="polite">
                      <h3>送信しました。数分で届きます。</h3>
                      <p className="aichat-note">
                        {state.leadDryRun
                          ? "ローカル確認のため、外部保存はdry-runです。Secrets設定後はNotionとSlackに連携されます。"
                          : "診断メモをお送りしました。"}
                      </p>
                      <p className="aichat-note">
                        内容を見て話したくなったら、30分の枠をどうぞ。
                      </p>
                      <div className="aichat-actions">
                        <ArrowCTA
                          href={CAL_BOOKING_URL}
                          variant="outline"
                          direction="external"
                          withText="日程を選ぶ"
                          label="日程を選ぶ"
                        />
                        <button className="aichat-textbutton" type="button" onClick={resetChat}>
                          別のURLで診断する
                        </button>
                      </div>
                    </section>
                  )}

                  {state.phase === "emailDeclined" && (
                    <section className="aichat-success" aria-live="polite">
                      <h3>共有用の受け皿を用意しました。</h3>
                      <p className="aichat-note">
                        URLと診断結果は部分リードとして記録されます。気が向いたら、日程はこちらからいつでも。
                      </p>
                      <div className="aichat-actions">
                        {state.analysis.shareUrl && (
                          <a className="aichat-link" href={state.analysis.shareUrl}>
                            共有リンクを開く
                          </a>
                        )}
                        <a
                          className="aichat-link"
                          href={CAL_BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          日程を選ぶ
                        </a>
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </m.aside>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export default ChatDrawer;
