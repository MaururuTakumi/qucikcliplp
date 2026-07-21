import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AIStarterBand } from "../features/ai-chat/components/AIStarterBand";
import {
  submitContactFormNotification,
  submitContactPartialLead,
} from "../features/ai-chat/api/client";
import { firstTouchAttribution } from "../lib/attribution";
import { dur, ease, stagger } from "../design/tokens";
import { Reveal, RevealGroup } from "../components/motion/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ArrowCTA } from "../components/ui/ArrowCTA";

const GAS_URL = "https://script.google.com/macros/s/AKfycbxVMYEL9aJS124xpDj-bpynGYH_QbyEsb0yGqUznlTALT6OreAjCSS7oth4f7ETDciQ/exec";

const RECRUIT_LABEL = "採用・カジュアル面談を希望する";

/* site-ia-design §3.6 / 経営方針: プラン制(AI顧問/AI秘書)・口コミAIは廃止。
 * 選択肢を新ポジショニング(AIネイティブ化の伴走)へ整理し、採用導線を追加。 */
const inquiryOptions = [
  "会社をAIネイティブにしたい（AI導入・伴走）",
  "業務を自動化したい",
  "プロダクト開発を依頼したい",
  RECRUIT_LABEL,
  "その他",
] as const;

const employeeCountOptions = ["1〜10名", "11〜50名", "51〜100名", "100名以上"];
/* 採用モードの「希望のかかわり方」(recruit-redesign §4.2・任意)。 */
const involvementOptions = ["インターン", "業務委託", "正社員", "まだ決めていない"];

type StepKey = 1 | 2 | 3;

type ContactSnapshot = {
  inquiryType: string;
  company: string;
  name: string;
  email: string;
  employeeCount: string;
  involvement: string;
  message: string;
  consent: boolean;
  isRecruit: boolean;
  submitted: boolean;
};

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function trackContact(eventName: string, label?: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, { event_category: "contact", event_label: label });
}

function createContactSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `contact_form:${crypto.randomUUID()}`;
  }
  return `contact_form:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

function currentAttribution() {
  const attribution = firstTouchAttribution();
  return {
    referrer: attribution.referrer,
    utm: attribution.utm,
    landingPath: attribution.landingPath,
  };
}

function Field({
  id,
  label,
  required,
  optionalLabel = "任意",
  error,
  children,
}: {
  id?: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="contact-field">
      <label htmlFor={id} className="contact-label">
        {label}
        {required ? <span className="contact-required">*</span> : <span className="contact-optional">（{optionalLabel}）</span>}
      </label>
      {children}
      {error ? <p className="contact-error">{error}</p> : null}
    </div>
  );
}

function InquiryRow({
  index,
  label,
  active,
  onSelect,
}: {
  index: number;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${label}を選択`}
      className={`contact-inquiry-row${active ? " contact-inquiry-row--active" : ""}`}
    >
      <span className="contact-inquiry-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="contact-inquiry-title">{label}</span>
      <ArrowRight className="contact-inquiry-arrow" aria-hidden="true" />
    </button>
  );
}

function StepRail({
  step,
  isRecruit,
}: {
  step: StepKey;
  isRecruit: boolean;
}) {
  const steps = isRecruit
    ? [
        { id: 2 as StepKey, label: "必要事項の入力" },
        { id: 3 as StepKey, label: "完了" },
      ]
    : [
        { id: 1 as StepKey, label: "ご相談内容" },
        { id: 2 as StepKey, label: "必要事項の入力" },
        { id: 3 as StepKey, label: "完了" },
      ];

  return (
    <nav className="contact-rail" aria-label="問い合わせステップ">
      {steps.map((item, index) => {
        const active = item.id === step;
        const complete = item.id < step;
        return (
          <div key={item.id} className="contact-rail-item">
            {active ? (
              <m.span
                layoutId="contact-rail-active"
                className="contact-rail-active"
                transition={ease.spring}
              />
            ) : null}
            <span className="contact-rail-index">{String(index + 1).padStart(2, "0")}</span>
            <span className={active ? "contact-rail-label contact-rail-label--active" : "contact-rail-label"}>
              {item.label}
            </span>
            <span className="contact-rail-state">{complete ? "完了" : active ? "現在" : ""}</span>
          </div>
        );
      })}
    </nav>
  );
}

function ChoiceGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="contact-choice-grid">
      {options.map((option) => (
        <label key={option} className={`contact-choice${value === option ? " contact-choice--active" : ""}`}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={(event) => onChange(event.target.value)}
            className="sr-only"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

const formTransition = { duration: dur.base, ease: ease.out };

const ContactPage: React.FC = () => {
  const [step, setStep] = useState<StepKey>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecruit, setIsRecruit] = useState(false);

  const [inquiryType, setInquiryType] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [involvement, setInvolvement] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const sessionIdRef = useRef(createContactSessionId());
  const snapshotRef = useRef<ContactSnapshot>({
    inquiryType: "",
    company: "",
    name: "",
    email: "",
    employeeCount: "",
    involvement: "",
    message: "",
    consent: false,
    isRecruit: false,
    submitted: false,
  });

  useEffect(() => {
    document.title = "お問い合わせ | honkoma";
    /* /recruit からの採用導線: ?type=recruit で種別=採用をプリセットしStep2へ。
     * 採用モードでは AI診断帯・営業ボイスを出さず、候補者向けの体験に切り替える。 */
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "recruit") {
      setInquiryType(RECRUIT_LABEL);
      setIsRecruit(true);
      setStep(2);
      trackContact("contact_step2_view", "recruit");
    }
  }, []);

  useEffect(() => {
    snapshotRef.current = {
      inquiryType,
      company,
      name,
      email,
      employeeCount,
      involvement,
      message,
      consent,
      isRecruit,
      submitted: snapshotRef.current.submitted,
    };
  }, [company, consent, email, employeeCount, inquiryType, involvement, isRecruit, message, name]);

  const sendPartialCapture = useCallback((reason: string) => {
    const snapshot = snapshotRef.current;
    if (
      snapshot.submitted ||
      snapshot.isRecruit ||
      !snapshot.consent ||
      !isLikelyEmail(snapshot.email)
    ) {
      return;
    }

    const sessionKey = `contact_partial_sent:${sessionIdRef.current}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");

    submitContactPartialLead({
      sessionId: sessionIdRef.current,
      inquiryType: snapshot.inquiryType || "未選択",
      company: snapshot.company,
      name: snapshot.name,
      email: snapshot.email,
      employeeCount: snapshot.employeeCount || undefined,
      message: snapshot.message,
      consent: snapshot.consent,
      timestamp: new Date().toISOString(),
      type: "inquiry",
      partialReason: reason,
      ...currentAttribution(),
    });
    trackContact("contact_partial_capture", reason);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendPartialCapture("visibility_hidden");
    };
    const onPageHide = () => sendPartialCapture("pagehide");
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      sendPartialCapture("unmount");
    };
  }, [sendPartialCapture]);

  const goToStep = (next: StepKey) => {
    setStep(next);
    if (next === 2) trackContact("contact_step2_view", isRecruit ? "recruit" : inquiryType);
  };

  const handleSelectInquiry = (label: string) => {
    setInquiryType(label);
    const selectedRecruit = label === RECRUIT_LABEL;
    setIsRecruit(selectedRecruit);
    trackContact("contact_step1_select", label);
    setStep(2);
    trackContact("contact_step2_view", selectedRecruit ? "recruit" : label);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLikelyEmail(email)) {
      setEmailError("メールアドレスの形式をご確認ください。");
      return;
    }
    setIsSubmitting(true);
    snapshotRef.current.submitted = true;

    const timestamp = new Date().toISOString();
    const data = {
      inquiryType,
      company,
      name,
      email,
      employeeCount,
      message,
      consent,
      timestamp,
      type: isRecruit ? ("recruit" as const) : ("inquiry" as const),
      involvement: isRecruit ? involvement : undefined,
    };
    const contactData = {
      sessionId: sessionIdRef.current,
      ...data,
    };

    const gasSubmission = fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const slackNotification = submitContactFormNotification({
      ...contactData,
      ...currentAttribution(),
    });

    const [gasResult, slackResult] = await Promise.allSettled([gasSubmission, slackNotification]);
    if (gasResult.status === "rejected") {
      console.error("Error submitting form:", gasResult.reason);
    }
    if (slackResult.status === "rejected") {
      console.error("Error notifying contact form:", slackResult.reason);
    } else if (!slackResult.value.slackNotified) {
      console.warn("Contact form Slack notification was not sent:", slackResult.value.error);
    }

    setIsSubmitting(false);
    trackContact("contact_form_submit", isRecruit ? "recruit" : inquiryType);
    goToStep(3);
  };

  const canSubmit = Boolean(name.trim() && isLikelyEmail(email) && message.trim() && consent);
  const stepTitle = isRecruit
    ? "面談のお申し込み"
    : "お客様情報をご入力ください";
  const stepSubtitle = isRecruit
    ? "選考ではありません。まずは気軽にお話ししましょう。内容は代表の林が直接確認します。"
    : "この窓口は、代表の林が直接目を通しています。";

  const styles = useMemo(() => contactStyles, []);

  return (
    <div className="contact-page">
      <style>{styles}</style>

      <section className="contact-hero">
        <div className="contact-shell">
          <div className="contact-hero-grid">
            <div className="contact-hero-aside">
              <span className="contact-kicker">{isRecruit ? "Careers" : "Contact"}</span>
            </div>
            <div className="contact-hero-main">
              <SectionHeading
                title={isRecruit ? "カジュアル面談" : "お問い合わせ"}
                level={1}
                hero
                className="contact-heading"
              />
              <Reveal as="p" className="contact-hero-copy" delay={dur.instant}>
                {isRecruit
                  ? "まずは話すことから。履歴書も、志望動機も、準備もいりません。30分、オンラインで雑談するところから始めましょう。"
                  : "AI導入・業務自動化・開発に関するご相談を受け付けています。初回相談は無料です。"}
              </Reveal>
              {!isRecruit ? (
                <Reveal className="contact-meta" delay={dur.fast}>
                  <span>quickclip@ltdhonkoma.com</span>
                  <span>080-8526-6978</span>
                  <span>初回相談無料</span>
                  <span>オンライン対応可</span>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <main className="contact-form-section">
        <div className="contact-shell contact-form-grid">
          <aside className="contact-form-aside">
            <StepRail step={step} isRecruit={isRecruit} />
          </aside>

          <section className="contact-form-main" aria-live="polite">
            <m.div
              key={`${step}-${isRecruit ? "recruit" : "inquiry"}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={formTransition}
            >
              {step === 1 ? (
                <div>
                  <div className="contact-step-header">
                    <span className="contact-step-number">01</span>
                    <h2>ご相談内容を選択してください</h2>
                    <p>該当するものをお選びください。</p>
                  </div>
                  <RevealGroup className="contact-inquiry-list" stagger={stagger.tight}>
                    {inquiryOptions.map((label, index) => (
                      <Reveal key={label}>
                        <InquiryRow
                          index={index}
                          label={label}
                          active={inquiryType === label}
                          onSelect={() => handleSelectInquiry(label)}
                        />
                      </Reveal>
                    ))}
                  </RevealGroup>
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <div className="contact-step-header">
                    <span className="contact-step-number">{isRecruit ? "01" : "02"}</span>
                    <h2>{stepTitle}</h2>
                    <p>{stepSubtitle}</p>
                    {inquiryType ? <span className="contact-selected-type">{inquiryType}</span> : null}
                  </div>

                  <form onSubmit={handleSubmit} className="contact-form">
                    <Field id="name" label="お名前" required>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        autoComplete="name"
                        placeholder="山田太郎"
                        onChange={(event) => setName(event.target.value)}
                        className="contact-input"
                      />
                    </Field>

                    <Field id="email" label="メールアドレス" required error={emailError}>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        autoComplete="email"
                        inputMode="email"
                        placeholder="yamada@example.co.jp"
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (emailError) setEmailError("");
                        }}
                        onBlur={() => setEmailError(email && !isLikelyEmail(email) ? "メールアドレスの形式をご確認ください。" : "")}
                        className={`contact-input${emailError ? " contact-input--error" : ""}`}
                      />
                    </Field>

                    <Field
                      id="message"
                      label={isRecruit ? "今なにをしている人か・話してみたいこと" : "どんなことを相談したいですか？"}
                      required
                    >
                      <textarea
                        id="message"
                        rows={5}
                        required
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder={
                          isRecruit
                            ? "例: 学生でAIに興味がある、業務委託で関わってみたい、まず話を聞いてみたい など"
                            : "例: 定型レポートの作成を自動化したい、問い合わせ対応をAIに任せたい、社内のデータを整理したい など"
                        }
                        className="contact-input contact-textarea"
                      />
                    </Field>

                    {isRecruit ? (
                      <Field label="希望のかかわり方">
                        <ChoiceGroup
                          name="involvement"
                          options={involvementOptions}
                          value={involvement}
                          onChange={setInvolvement}
                        />
                      </Field>
                    ) : null}

                    {!isRecruit ? (
                      <Field id="company" label="会社名">
                        <input
                          id="company"
                          type="text"
                          value={company}
                          autoComplete="organization"
                          placeholder="株式会社サンプル"
                          onChange={(event) => setCompany(event.target.value)}
                          className="contact-input"
                        />
                      </Field>
                    ) : null}

                    {!isRecruit ? (
                      <Field label="従業員数">
                        <ChoiceGroup
                          name="employeeCount"
                          options={employeeCountOptions}
                          value={employeeCount}
                          onChange={setEmployeeCount}
                        />
                      </Field>
                    ) : null}

                    <div className="contact-consent">
                      <label className="contact-consent-label">
                        <input
                          type="checkbox"
                          required
                          checked={consent}
                          onChange={(event) => setConsent(event.target.checked)}
                        />
                        <span>
                          <a href="/privacy">プライバシーポリシー</a>
                          に同意し、入力内容を送信することに同意します。
                        </span>
                      </label>
                      {!isRecruit ? (
                        <p className="contact-consent-note">
                          送信ボタンを押す前にページを離れた場合も、ご同意済みの入力内容にもとづきご連絡を差し上げることがあります。
                        </p>
                      ) : null}
                    </div>

                    <div className="contact-actions">
                      {!isRecruit ? (
                        <button type="button" className="contact-back" onClick={() => goToStep(1)}>
                          <ArrowLeft aria-hidden="true" />
                          <span>戻る</span>
                        </button>
                      ) : null}
                      <ArrowCTA
                        onClick={() => undefined}
                        type="submit"
                        disabled={isSubmitting || !canSubmit}
                        size="lg"
                        variant="fill"
                        withText={isSubmitting ? "送信中..." : isRecruit ? "面談を申し込む" : "送信する"}
                        label={isSubmitting ? "送信中" : isRecruit ? "面談を申し込む" : "送信する"}
                        className="contact-submit"
                      />
                    </div>

                    {!canSubmit ? (
                      <p className="contact-submit-hint">
                        {!consent
                          ? "プライバシーポリシーへの同意で送信できます。"
                          : "お名前・メール・内容のご入力で送信できます。"}
                      </p>
                    ) : null}
                  </form>
                </div>
              ) : null}

              {step === 3 ? (
                <section data-theme="inverse" className="contact-complete">
                  <Reveal variant="clip">
                    <p className="contact-complete-kicker">Thank you.</p>
                  </Reveal>
                  <h2>{isRecruit ? "お申し込みありがとうございます" : "お問い合わせありがとうございます"}</h2>
                  <p>
                    {isRecruit
                      ? "日程調整のご連絡を差し上げます。まずはお気軽にお話ししましょう。"
                      : "内容を確認のうえ、担当よりご連絡いたします。"}
                  </p>
                  <ArrowCTA
                    href="https://calendar.app.google/DcGsqPYBvRf3dvZJ8"
                    direction="external"
                    hover="spin"
                    variant="fill"
                    size="md"
                    withText={isRecruit ? "面談日程をえらぶ" : "オンライン無料相談を予約する"}
                    label={isRecruit ? "面談日程をえらぶ" : "オンライン無料相談を予約する"}
                  />
                  <span className="contact-complete-note">30秒で予約完了・オンライン</span>
                </section>
              ) : null}
            </m.div>
          </section>
        </div>
      </main>

      {!isRecruit ? (
        <AIStarterBand
          source="float"
          compact
          title="フォームの前に、AIで自社活用案を見てみる。"
          body="会社サイトのURLから、honkomaならどこを自動化・売上化できるかを先に整理できます。"
        />
      ) : null}
    </div>
  );
};

const contactStyles = `
.contact-page {
  min-height: 100vh;
  background: var(--surface-base);
  color: var(--text-primary);
  font-family: var(--font-jp);
}
.contact-shell {
  width: min(100% - (var(--space-gutter) * 2), 1200px);
  margin-inline: auto;
}
.contact-hero {
  padding-block: var(--section-py) clamp(3rem, 8vw, 6rem);
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
}
.contact-hero-grid,
.contact-form-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(1.5rem, 4vw, 4rem);
}
.contact-hero-aside,
.contact-form-aside {
  grid-column: span 4;
}
.contact-hero-main,
.contact-form-main {
  grid-column: span 8;
}
.contact-kicker,
.contact-step-number,
.contact-inquiry-index,
.contact-rail-index,
.contact-rail-state,
.contact-label,
.contact-complete-kicker {
  font-family: var(--font-en);
}
.contact-kicker {
  display: inline-block;
  color: var(--color-accent);
  font-size: var(--fs-label);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.contact-heading {
  margin-bottom: clamp(1.5rem, 3vw, 2.25rem);
}
.contact-hero-copy {
  max-width: 44rem;
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  line-height: 1.9;
}
.contact-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.2rem;
  margin-top: clamp(1.6rem, 3vw, 2.25rem);
  color: var(--text-secondary);
  font-size: var(--fs-label);
}
.contact-meta span:not(:last-child)::after {
  content: "";
  display: inline-block;
  width: 1px;
  height: 0.8em;
  margin-left: 1.2rem;
  vertical-align: -0.1em;
  background: color-mix(in srgb, var(--text-primary) 20%, transparent);
}
.contact-form-section {
  padding-block: clamp(4rem, 10vw, 8rem);
}
.contact-form-aside {
  position: relative;
}
.contact-rail {
  position: sticky;
  top: 7rem;
  display: grid;
  gap: 0.15rem;
  padding-top: 0.25rem;
}
.contact-rail-item {
  position: relative;
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 0.75rem;
  align-items: baseline;
  min-height: 3rem;
  padding: 0.55rem 0 0.55rem 1rem;
}
.contact-rail-active {
  position: absolute;
  left: 0;
  top: 0.45rem;
  bottom: 0.45rem;
  width: 2px;
  background: var(--color-accent);
}
.contact-rail-index {
  color: var(--color-accent);
  font-size: var(--fs-label);
  letter-spacing: 0.04em;
}
.contact-rail-label {
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.contact-rail-label--active {
  color: var(--text-primary);
  font-weight: 600;
}
.contact-rail-state {
  grid-column: 2;
  min-height: 1em;
  color: var(--text-secondary);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}
.contact-form-main {
  max-width: 640px;
}
.contact-step-header {
  margin-bottom: clamp(2rem, 5vw, 3rem);
}
.contact-step-number {
  display: block;
  margin-bottom: 0.8rem;
  color: var(--color-accent);
  font-size: var(--fs-label);
  letter-spacing: 0.08em;
}
.contact-step-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--fs-h3);
  line-height: 1.35;
}
.contact-step-header p {
  margin: 0.9rem 0 0;
  color: var(--text-secondary);
  line-height: 1.9;
}
.contact-selected-type {
  display: inline-block;
  margin-top: 1.1rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  color: var(--color-accent);
  font-size: 0.82rem;
}
.contact-inquiry-list {
  display: grid;
}
.contact-inquiry-row {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  gap: 1rem;
  align-items: center;
  width: 100%;
  min-height: 5.25rem;
  padding: 1.25rem 0;
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--text-primary) 14%, transparent);
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
}
.contact-inquiry-list > div:last-child .contact-inquiry-row {
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 14%, transparent);
}
.contact-inquiry-index {
  color: var(--color-accent);
  font-size: var(--fs-label);
}
.contact-inquiry-title {
  font-weight: 600;
  line-height: 1.65;
  transition: transform ${dur.fast}s cubic-bezier(${ease.soft.join(",")}), color ${dur.fast}s cubic-bezier(${ease.soft.join(",")});
}
.contact-inquiry-arrow {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--color-accent);
  transition: transform ${dur.fast}s cubic-bezier(${ease.soft.join(",")});
}
.contact-inquiry-row:hover,
.contact-inquiry-row:focus-visible,
.contact-inquiry-row--active {
  background: var(--surface-raised);
}
.contact-inquiry-row:hover .contact-inquiry-title,
.contact-inquiry-row:focus-visible .contact-inquiry-title,
.contact-inquiry-row--active .contact-inquiry-title {
  transform: translateX(8px);
  color: var(--color-accent);
}
.contact-inquiry-row:hover .contact-inquiry-arrow,
.contact-inquiry-row:focus-visible .contact-inquiry-arrow,
.contact-inquiry-row--active .contact-inquiry-arrow {
  transform: translateX(4px);
}
.contact-inquiry-row:focus-visible,
.contact-choice:focus-within,
.contact-back:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}
.contact-form {
  display: grid;
  gap: 2rem;
}
.contact-field {
  display: grid;
  gap: 0.75rem;
}
.contact-label {
  color: var(--text-primary);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.02em;
}
.contact-required {
  margin-left: 0.35rem;
  color: var(--color-accent);
}
.contact-optional {
  margin-left: 0.35rem;
  color: var(--text-secondary);
  font-family: var(--font-jp);
  letter-spacing: 0;
}
.contact-input {
  width: 100%;
  padding: 0.9rem 0;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 24%, transparent);
  border-radius: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  transition: border-color ${dur.instant}s cubic-bezier(${ease.soft.join(",")});
}
.contact-input::placeholder {
  color: color-mix(in srgb, var(--text-secondary) 55%, transparent);
}
.contact-input:focus {
  border-bottom-color: var(--color-accent);
  outline: none;
}
.contact-input--error {
  border-bottom-color: #ef4444;
}
.contact-textarea {
  resize: vertical;
  min-height: 9rem;
}
.contact-error {
  margin: 0;
  color: #ef4444;
  font-size: 0.78rem;
}
.contact-choice-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}
.contact-choice {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.25rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid color-mix(in srgb, var(--text-primary) 18%, transparent);
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
  transition: border-color ${dur.instant}s cubic-bezier(${ease.soft.join(",")}), color ${dur.instant}s cubic-bezier(${ease.soft.join(",")}), background ${dur.instant}s cubic-bezier(${ease.soft.join(",")});
}
.contact-choice:hover,
.contact-choice--active {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 9%, transparent);
  color: var(--color-accent);
}
.contact-consent {
  display: grid;
  gap: 0.45rem;
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.75;
}
.contact-consent-label {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  cursor: pointer;
}
.contact-consent input {
  width: 1rem;
  height: 1rem;
  margin-top: 0.28rem;
  accent-color: var(--color-accent);
  flex: none;
}
.contact-consent a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.contact-consent-note {
  margin: 0 0 0 1.75rem;
  color: color-mix(in srgb, var(--text-secondary) 82%, transparent);
  font-size: 0.72rem;
  line-height: 1.65;
}
.contact-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
}
.contact-back {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
}
.contact-back svg {
  width: 1rem;
  height: 1rem;
}
.contact-submit {
  margin-left: auto;
}
.contact-submit[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}
.contact-submit[disabled] .arrowcta-circle {
  transform: none !important;
}
.contact-submit-hint {
  margin: -0.8rem 0 0;
  color: var(--text-secondary);
  font-size: 0.78rem;
  text-align: right;
}
.contact-complete {
  display: grid;
  gap: 1.4rem;
  padding: clamp(2rem, 5vw, 3rem);
  background: var(--surface-base);
  color: var(--text-primary);
}
.contact-complete-kicker {
  margin: 0;
  color: var(--color-accent);
  font-size: var(--fs-label);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.contact-complete h2 {
  margin: 0;
  font-size: var(--fs-h3);
  line-height: 1.45;
}
.contact-complete p {
  max-width: 34rem;
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.85;
}
.contact-complete-note {
  color: var(--text-secondary);
  font-size: 0.78rem;
}
@media (max-width: 900px) {
  .contact-hero-grid,
  .contact-form-grid {
    grid-template-columns: 1fr;
    row-gap: 2.5rem;
  }
  .contact-hero-aside,
  .contact-hero-main,
  .contact-form-aside,
  .contact-form-main {
    grid-column: auto;
  }
  .contact-rail {
    position: relative;
    top: auto;
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  .contact-rail-item {
    min-width: max-content;
    grid-template-columns: auto auto;
    padding: 0.4rem 0;
  }
  .contact-rail-active {
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    width: auto;
    height: 2px;
  }
  .contact-rail-state {
    display: none;
  }
  .contact-choice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 520px) {
  .contact-shell {
    width: min(100% - 2rem, 1200px);
  }
  .contact-meta {
    display: grid;
    gap: 0.5rem;
  }
  .contact-meta span::after {
    display: none !important;
  }
  .contact-inquiry-row {
    grid-template-columns: 2.4rem 1fr auto;
    gap: 0.75rem;
  }
  .contact-actions {
    align-items: flex-start;
    flex-direction: column;
  }
  .contact-submit {
    margin-left: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .contact-inquiry-title,
  .contact-inquiry-arrow,
  .contact-input,
  .contact-choice {
    transition: none !important;
  }
}
`;

export default ContactPage;
