import React from "react";
import {
  analyzeCompany,
  deepenCompany,
  normalizeCompanyUrl,
  proposalsToText,
  submitLead,
  submitPartialLead,
} from "./api/client";
import type {
  AiChatAnalysis,
  AiMaturity,
  CaseRecord,
  ChatPhase,
  ChatSource,
  CompanySize,
  ContactMethod,
  EmailDomainMatch,
  FocusPlan,
  LeadPayload,
  PainCategory,
  PartialLeadPayload,
  Relationship,
} from "./types";
import { firstTouchAttribution } from "../../lib/attribution";
import { emailDomainMatchFor } from "./domain";

type ChatState = {
  isOpen: boolean;
  source: ChatSource;
  sessionId: string;
  companyUrl: string;
  analysis?: AiChatAnalysis;
  phase: ChatPhase;
  /* 深掘り(contact-funnel-v2 §2.2)。 */
  painPoint: PainCategory | "";
  painPointRaw: string;
  companySize: CompanySize | null;
  aiMaturity: AiMaturity | null;
  deepStep: number; // 0=規模(Q2)を表示 / 1=AI活用(Q3)を表示
  focusPlan?: FocusPlan;
  matchedCase?: CaseRecord | null;
  diagnosisCode: string;
  contactMethod: ContactMethod | null;
  role: string;
  email: string;
  consent: boolean;
  emailCaptured: boolean;
  emailDomainMatch: EmailDomainMatch | null;
  relationship: Relationship | null;
  gateStep: 0 | 1;
  gateReturn: "insights" | "focus";
  error?: string;
  isBusy: boolean;
  leadDryRun: boolean;
};

type PersistedChatState = Pick<
  ChatState,
  | "source"
  | "sessionId"
  | "companyUrl"
  | "analysis"
  | "phase"
  | "painPoint"
  | "painPointRaw"
  | "companySize"
  | "aiMaturity"
  | "deepStep"
  | "focusPlan"
  | "matchedCase"
  | "diagnosisCode"
  | "email"
  | "consent"
  | "emailCaptured"
  | "emailDomainMatch"
  | "relationship"
  | "gateStep"
  | "gateReturn"
>;

type OpenOptions = {
  source: ChatSource;
  companyUrl?: string;
};

type AiChatContextValue = {
  state: ChatState;
  openChat: (options: OpenOptions) => void;
  closeChat: () => void;
  startAnalysis: (source: ChatSource, companyUrl: string) => Promise<void>;
  /** Q1: いちばん重い課題(chip)を選ぶ → 深掘り(Q2)へ。 */
  answerPain: (pain: PainCategory, raw?: string) => void;
  /** emailGate: 送付先を保存してから深掘りへ進む。 */
  submitEmailGate: () => Promise<void>;
  /** emailGate: メール取得を後回しにして深掘りへ進む。 */
  skipEmailGate: () => void;
  /** emailGate: 不一致/freemail時の関係チップ。 */
  answerRelationship: (relationship: Relationship) => Promise<void>;
  /** Q1で「答えず相談する」→ 汎用プランで focusShown へ直行。 */
  skipDeepen: () => Promise<void>;
  /** Q2: 規模。null=スキップ。 */
  answerSize: (size: CompanySize | null) => void;
  /** Q3: AI活用状況。null=スキップ。回答で進め方プランを生成。 */
  answerMaturity: (maturity: AiMaturity | null) => Promise<void>;
  /** focusShown主導線: 予約(Googleカレンダー)を新規タブで開き bookingStarted へ。 */
  startBooking: () => void;
  /** 副導線: 診断をメールで残す pull型ask → emailRequested。 */
  requestEmail: () => void;
  updateEmail: (email: string) => void;
  updateConsent: (consent: boolean) => void;
  submitEmailLead: () => Promise<void>;
  declineEmail: () => Promise<void>;
  /** 取得後エンリッチ(role 1問)。 */
  answerEnrich: (role: string) => void;
  skipEnrich: () => void;
  resetChat: () => void;
};

const STORAGE_KEY = "honkoma-ai-chat-v2";

/** 担当との30分壁打ち予約。Googleカレンダーの予約ページ(経営決定でcal.comから変更)。 */
const BOOKING_URL = "https://calendar.app.google/DcGsqPYBvRf3dvZJ8";

function makeDiagnosisCode(sessionId: string) {
  const base = (sessionId || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  return `HK-${base || "0000"}`;
}

const initialState: ChatState = {
  isOpen: false,
  source: "hero",
  sessionId: "",
  companyUrl: "",
  phase: "idle",
  painPoint: "",
  painPointRaw: "",
  companySize: null,
  aiMaturity: null,
  deepStep: 0,
  matchedCase: null,
  diagnosisCode: "",
  contactMethod: null,
  role: "",
  email: "",
  consent: false,
  emailCaptured: false,
  emailDomainMatch: null,
  relationship: null,
  gateStep: 0,
  gateReturn: "insights",
  isBusy: false,
  leadDryRun: false,
};

type Action =
  | { type: "hydrate"; payload: PersistedChatState }
  | { type: "open"; payload: OpenOptions }
  | { type: "close" }
  | { type: "analysisStart"; payload: { source: ChatSource; companyUrl: string } }
  | { type: "analysisSuccess"; payload: { analysis: AiChatAnalysis; emailDomainMatch: EmailDomainMatch | null } }
  | { type: "analysisFail"; payload: { error: string; fallback: AiChatAnalysis; emailDomainMatch: EmailDomainMatch | null } }
  | { type: "answerPain"; payload: { pain: PainCategory; raw: string } }
  | { type: "showInsights" }
  | { type: "answerSize"; payload: CompanySize | null }
  | { type: "answerMaturity"; payload: AiMaturity | null }
  | { type: "requireEmailBeforeFocus" }
  | { type: "focusStart" }
  | { type: "focusReady"; payload: { focusPlan: FocusPlan; matchedCase: CaseRecord | null } }
  | { type: "startBooking" }
  | { type: "requestEmail" }
  | { type: "email"; payload: string }
  | { type: "consent"; payload: boolean }
  | { type: "leadStart" }
  | {
      type: "leadSuccess";
      payload: {
        dryRun: boolean;
        phase?: ChatPhase;
        contactMethod?: ContactMethod;
        emailDomainMatch?: EmailDomainMatch | null;
        gateStep?: 0 | 1;
      };
    }
  | { type: "leadFail"; payload: string }
  | { type: "relationship"; payload: Relationship }
  | { type: "declineEmail" }
  | { type: "enrich"; payload: string }
  | { type: "completed" }
  | { type: "reset"; payload: { sessionId: string } };

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readPersistedState(): PersistedChatState | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedChatState;
  } catch {
    return null;
  }
}

function createInitialState(): ChatState {
  const persisted = readPersistedState();
  if (persisted?.sessionId) {
    return {
      ...initialState,
      ...persisted,
      isOpen: false,
      isBusy: false,
      error: undefined,
      diagnosisCode: persisted.diagnosisCode || makeDiagnosisCode(persisted.sessionId),
    };
  }
  const sessionId = createSessionId();
  return { ...initialState, sessionId, diagnosisCode: makeDiagnosisCode(sessionId) };
}

function persistState(state: ChatState) {
  if (typeof window === "undefined") return;
  const persisted: PersistedChatState = {
    source: state.source,
    sessionId: state.sessionId,
    companyUrl: state.companyUrl,
    analysis: state.analysis,
    phase: state.phase,
    painPoint: state.painPoint,
    painPointRaw: state.painPointRaw,
    companySize: state.companySize,
    aiMaturity: state.aiMaturity,
    deepStep: state.deepStep,
    focusPlan: state.focusPlan,
    matchedCase: state.matchedCase,
    diagnosisCode: state.diagnosisCode,
    email: state.email,
    consent: state.consent,
    emailCaptured: state.emailCaptured,
    emailDomainMatch: state.emailDomainMatch,
    relationship: state.relationship,
    gateStep: state.gateStep,
    gateReturn: state.gateReturn,
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, isOpen: false, isBusy: false, error: undefined };
    case "open":
      return {
        ...state,
        isOpen: true,
        source: action.payload.source,
        companyUrl: action.payload.companyUrl ?? state.companyUrl,
        error: undefined,
      };
    case "close":
      return { ...state, isOpen: false };
    case "analysisStart":
      return {
        ...state,
        isOpen: true,
        isBusy: true,
        source: action.payload.source,
        companyUrl: action.payload.companyUrl,
        phase: "analyzing",
        analysis: undefined,
        painPoint: "",
        painPointRaw: "",
        companySize: null,
        aiMaturity: null,
        deepStep: 0,
        focusPlan: undefined,
        matchedCase: null,
        contactMethod: null,
        emailDomainMatch: null,
        relationship: null,
        gateStep: 0,
        gateReturn: "insights",
        error: undefined,
      };
    case "analysisSuccess":
      return {
        ...state,
        isBusy: false,
        phase: state.emailCaptured ? "insightsShown" : "emailGate",
        analysis: action.payload.analysis,
        emailDomainMatch: action.payload.emailDomainMatch,
        gateStep: 0,
        gateReturn: "insights",
        error: undefined,
      };
    case "analysisFail":
      return {
        ...state,
        isBusy: false,
        phase: state.emailCaptured ? "analysisFailed" : "emailGate",
        analysis: action.payload.fallback,
        emailDomainMatch: action.payload.emailDomainMatch,
        gateStep: 0,
        gateReturn: "insights",
        error: action.payload.error,
      };
    case "answerPain":
      return {
        ...state,
        painPoint: action.payload.pain,
        painPointRaw: action.payload.raw,
        phase: "deepening",
        deepStep: 0,
        error: undefined,
      };
    case "showInsights":
      return {
        ...state,
        phase: state.error ? "analysisFailed" : "insightsShown",
        gateStep: 0,
        gateReturn: "insights",
        error: undefined,
      };
    case "answerSize":
      return { ...state, companySize: action.payload, deepStep: 1 };
    case "answerMaturity":
      return { ...state, aiMaturity: action.payload };
    case "requireEmailBeforeFocus":
      return { ...state, phase: "emailGate", gateStep: 0, gateReturn: "focus", error: undefined };
    case "focusStart":
      return { ...state, phase: "focusBuilding", isBusy: true, error: undefined };
    case "focusReady":
      return {
        ...state,
        phase: "focusShown",
        isBusy: false,
        focusPlan: action.payload.focusPlan,
        matchedCase: action.payload.matchedCase,
      };
    case "startBooking":
      return { ...state, phase: "bookingStarted", contactMethod: "booking", error: undefined };
    case "requestEmail":
      return { ...state, phase: "emailRequested", error: undefined };
    case "email":
      return { ...state, email: action.payload, error: undefined };
    case "consent":
      return { ...state, consent: action.payload, error: undefined };
    case "leadStart":
      return { ...state, isBusy: true, error: undefined };
    case "leadSuccess":
      return {
        ...state,
        isBusy: false,
        phase: action.payload.phase || "leadCaptured",
        contactMethod: action.payload.contactMethod || state.contactMethod || "email",
        emailCaptured: true,
        emailDomainMatch: action.payload.emailDomainMatch ?? state.emailDomainMatch,
        gateStep: action.payload.gateStep ?? 0,
        leadDryRun: action.payload.dryRun,
        error: undefined,
      };
    case "leadFail":
      return { ...state, isBusy: false, error: action.payload };
    case "relationship":
      return {
        ...state,
        relationship: action.payload,
        gateStep: 0,
        phase: state.gateReturn === "focus" ? "deepening" : state.error ? "analysisFailed" : "insightsShown",
        error: undefined,
      };
    case "declineEmail":
      return { ...state, phase: "emailDeclined", error: undefined };
    case "enrich":
      return { ...state, role: action.payload, phase: "completed" };
    case "completed":
      return { ...state, phase: "completed" };
    case "reset":
      return {
        ...initialState,
        sessionId: action.payload.sessionId,
        diagnosisCode: makeDiagnosisCode(action.payload.sessionId),
        isOpen: true,
        email: state.email,
        consent: state.consent,
        emailCaptured: state.emailCaptured,
      };
    default:
      return state;
  }
}

const AiChatContext = React.createContext<AiChatContextValue | null>(null);

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function trackAiChat(eventName: string, label?: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, { event_category: "ai_chat", event_label: label });
}

function emailGateOptional() {
  const env = import.meta.env as unknown as Record<string, string | undefined>;
  return (env.VITE_EMAIL_GATE_OPTIONAL || env.EMAIL_GATE_OPTIONAL || "").toLowerCase() === "true";
}

function buildPartialLead(state: ChatState, stage: PartialLeadPayload["stage"]): PartialLeadPayload {
  const attribution = firstTouchAttribution();
  const includeEmail = state.emailCaptured && state.consent && isLikelyEmail(state.email);
  return {
    source: state.source,
    sessionId: state.sessionId,
    stage,
    companyUrl: state.companyUrl,
    analyzedSummary: state.analysis?.analyzedSummary,
    proposedCases: state.analysis ? proposalsToText(state.analysis.proposals) : undefined,
    painPoint: state.painPoint || undefined,
    painPointRaw: state.painPointRaw || undefined,
    companySize: state.companySize ?? undefined,
    aiMaturity: state.aiMaturity ?? undefined,
    diagnosisCode: state.diagnosisCode,
    email: includeEmail ? state.email.trim() : undefined,
    emailVerified: includeEmail ? true : undefined,
    consent: includeEmail ? true : undefined,
    emailDomainMatch: state.emailDomainMatch ?? undefined,
    relationship: state.relationship ?? undefined,
    timestamp: new Date().toISOString(),
    referrer: attribution.referrer,
    utm: attribution.utm,
    landingPath: attribution.landingPath,
  };
}

function buildLeadPayload(state: ChatState, contactMethod: ContactMethod): LeadPayload | string {
  const email = state.email.trim();

  if (!isLikelyEmail(email)) return "受け取り先メールアドレスを確認してください。";
  if (!state.consent) return "プライバシーポリシーへの同意が必要です。";
  if (!state.analysis) return "診断結果を作成してから送信してください。";
  const attribution = firstTouchAttribution();

  return {
    source: state.source,
    sessionId: state.sessionId,
    companyUrl: state.companyUrl,
    analyzedSummary: state.analysis.analyzedSummary,
    proposedCases: proposalsToText(state.analysis.proposals),
    painPoint: state.painPoint || "未選択",
    painPointRaw: state.painPointRaw || undefined,
    companySize: state.companySize ?? undefined,
    aiMaturity: state.aiMaturity ?? undefined,
    contactMethod,
    diagnosisCode: state.diagnosisCode,
    focusPlan: state.focusPlan,
    matchedCaseId: state.matchedCase?.id,
    email,
    emailDomainMatch: emailDomainMatchFor(email, state.companyUrl),
    relationship: state.relationship ?? undefined,
    emailVerified: isLikelyEmail(email),
    urlReachable: state.analysis.mode === "model",
    consent: state.consent,
    timestamp: new Date().toISOString(),
    referrer: attribution.referrer,
    utm: attribution.utm,
    landingPath: attribution.landingPath,
  };
}

function emailCaptureLabelForPhase(phase: ChatPhase) {
  if (phase === "bookingStarted") return "booking";
  if (phase === "completed") return "completed";
  return "focus";
}

export function AiChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, undefined, createInitialState);
  const stateRef = React.useRef(state);

  React.useEffect(() => {
    stateRef.current = state;
    persistState(state);
  }, [state]);

  const openChat = React.useCallback((options: OpenOptions) => {
    dispatch({ type: "open", payload: options });
    trackAiChat("ai_chat_open", options.source);
  }, []);

  const closeChat = React.useCallback(() => {
    const current = stateRef.current;
    if (current.phase === "emailGate" && !current.emailCaptured) {
      trackAiChat("ai_email_gate_abandon", current.source);
    }
    trackAiChat("ai_chat_drawer_closed", current.phase);
    dispatch({ type: "close" });
  }, []);

  const startAnalysis = React.useCallback(async (source: ChatSource, rawUrl: string) => {
    const companyUrl = normalizeCompanyUrl(rawUrl);
    if (!companyUrl) {
      dispatch({ type: "leadFail", payload: "会社サイトのURLを入力してください。" });
      return;
    }

    dispatch({ type: "analysisStart", payload: { source, companyUrl } });
    trackAiChat("ai_chat_url_submit", source);

    const attribution = firstTouchAttribution();
    const request = {
      source,
      sessionId: stateRef.current.sessionId,
      companyUrl,
      referrer: attribution.referrer,
      utm: attribution.utm,
      landingPath: attribution.landingPath,
    };

    void submitPartialLead({ ...request, stage: "url_entered", timestamp: new Date().toISOString() });

    const result = await analyzeCompany(request);
    const emailDomainMatch = stateRef.current.emailCaptured && stateRef.current.email
      ? emailDomainMatchFor(stateRef.current.email, companyUrl)
      : null;
    if (result.ok) {
      dispatch({ type: "analysisSuccess", payload: { analysis: result.analysis, emailDomainMatch } });
      if (stateRef.current.emailCaptured) trackAiChat("ai_chat_insights_shown", result.analysis.mode);
      else trackAiChat("ai_email_gate_view", source);
      void submitPartialLead({
        ...request,
        stage: "analyzed",
        analyzedSummary: result.analysis.analyzedSummary,
        proposedCases: proposalsToText(result.analysis.proposals),
        diagnosisCode: stateRef.current.diagnosisCode,
        timestamp: new Date().toISOString(),
      });
    } else {
      dispatch({ type: "analysisFail", payload: { error: result.error, fallback: result.fallbackAnalysis, emailDomainMatch } });
      trackAiChat("ai_chat_analysis_fallback", source);
      if (!stateRef.current.emailCaptured) trackAiChat("ai_email_gate_view", source);
    }
  }, []);

  /* 進め方プランを生成(deepen)。深掘り完了 or スキップから呼ぶ。
   * 直前に dispatch した値(maturity)は stateRef 未反映のため override で受け取る。 */
  const buildFocus = React.useCallback(async (override?: { aiMaturity?: AiMaturity | null; bypassEmailGate?: boolean }) => {
    const current = stateRef.current;
    if (!current.analysis) return;
    if (!override?.bypassEmailGate && !current.emailCaptured) {
      dispatch({ type: "requireEmailBeforeFocus" });
      trackAiChat("ai_email_gate_view", current.source);
      return;
    }
    const aiMaturity = override && "aiMaturity" in override ? override.aiMaturity ?? null : current.aiMaturity;
    dispatch({ type: "focusStart" });
    void submitPartialLead(buildPartialLead({ ...current, aiMaturity, phase: "focusBuilding" }, "deepened"));

    const attribution = firstTouchAttribution();
    const result = await deepenCompany({
      source: current.source,
      sessionId: current.sessionId,
      companyUrl: current.companyUrl,
      painPoint: (current.painPoint || "other") as PainCategory,
      painPointRaw: current.painPointRaw || undefined,
      companySize: current.companySize,
      aiMaturity,
      analyzedSummary: current.analysis.analyzedSummary,
      signals: current.analysis.signals,
      proposals: current.analysis.proposals,
      referrer: attribution.referrer,
      utm: attribution.utm,
      landingPath: attribution.landingPath,
    });

    const focusPlan = result.ok ? result.focusPlan : result.fallbackFocusPlan;
    const matchedCase = result.matchedCase ?? null;
    dispatch({ type: "focusReady", payload: { focusPlan, matchedCase } });
    trackAiChat("ai_focus_shown", matchedCase ? "case_shown" : current.painPoint ? "no_case" : "generic");
    void submitPartialLead(
      buildPartialLead(
        { ...stateRef.current, phase: "focusShown", focusPlan, matchedCase },
        "focus_shown",
      ),
    );
    const latest = stateRef.current;
    if (latest.emailCaptured && latest.email && latest.consent) {
      const leadPayload = buildLeadPayload(
        { ...latest, phase: "focusShown", focusPlan, matchedCase, aiMaturity, emailCaptured: true },
        latest.contactMethod || "email",
      );
      if (typeof leadPayload !== "string") void submitLead(leadPayload);
    }
  }, []);

  const answerPain = React.useCallback((pain: PainCategory, raw = "") => {
    dispatch({ type: "answerPain", payload: { pain, raw } });
    trackAiChat("ai_deep_answered", `pain:${pain}`);
  }, []);

  const skipEmailGate = React.useCallback(() => {
    if (!emailGateOptional()) return;
    dispatch({ type: "showInsights" });
    trackAiChat("ai_email_gate_skipped", stateRef.current.source);
  }, []);

  const submitEmailGate = React.useCallback(async () => {
    const current = stateRef.current;
    const payload = buildLeadPayload(current, "email");
    if (typeof payload === "string") {
      dispatch({ type: "leadFail", payload });
      return;
    }

    dispatch({ type: "leadStart" });
    const result = await submitLead(payload);
    if (result.ok) {
      const match = payload.emailDomainMatch || emailDomainMatchFor(payload.email, current.companyUrl);
      const needsRelationship = match === "freemail" || match === "mismatch";
      const returnToFocus = current.gateReturn === "focus";
      dispatch({
        type: "leadSuccess",
        payload: {
          dryRun: Boolean(result.dryRun),
          phase: needsRelationship ? "emailGate" : returnToFocus ? "deepening" : current.error ? "analysisFailed" : "insightsShown",
          contactMethod: "email",
          emailDomainMatch: match,
          gateStep: needsRelationship ? 1 : 0,
        },
      });
      trackAiChat("ai_email_gate_submitted", match);
      trackAiChat("ai_email_captured", "emailGate");
      if (!needsRelationship && returnToFocus) {
        await buildFocus({ bypassEmailGate: true });
      }
      return;
    }
    dispatch({ type: "leadFail", payload: result.error || "送信に失敗しました。" });
  }, [buildFocus]);

  const answerRelationship = React.useCallback(async (relationship: Relationship) => {
    const current = stateRef.current;
    dispatch({ type: "relationship", payload: relationship });
    trackAiChat("ai_relationship_answered", relationship);
    void submitPartialLead(
      buildPartialLead(
        { ...current, emailCaptured: true, relationship, phase: "emailGate" },
        "contact_captured",
      ),
    );
    if (current.gateReturn === "focus") {
      await buildFocus({ bypassEmailGate: true });
    }
  }, [buildFocus]);

  const skipDeepen = React.useCallback(async () => {
    trackAiChat("ai_deep_skipped", "pain");
    await buildFocus();
  }, [buildFocus]);

  const answerSize = React.useCallback((size: CompanySize | null) => {
    dispatch({ type: "answerSize", payload: size });
    trackAiChat(size ? "ai_deep_answered" : "ai_deep_skipped", size ? `size:${size}` : "size");
  }, []);

  const answerMaturity = React.useCallback(
    async (maturity: AiMaturity | null) => {
      dispatch({ type: "answerMaturity", payload: maturity });
      trackAiChat(maturity ? "ai_deep_answered" : "ai_deep_skipped", maturity ? `maturity:${maturity}` : "maturity");
      await buildFocus({ aiMaturity: maturity });
    },
    [buildFocus],
  );

  const startBooking = React.useCallback(() => {
    const current = stateRef.current;
    trackAiChat("ai_baton_booking_click", current.source);
    dispatch({ type: "startBooking" });
    void submitPartialLead(
      buildPartialLead({ ...current, phase: "bookingStarted", contactMethod: "booking" }, "booking_click"),
    );
    if (typeof window !== "undefined") {
      window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
    }
  }, []);

  const requestEmail = React.useCallback(() => {
    const current = stateRef.current;
    if (current.emailCaptured) return;
    trackAiChat("ai_baton_email_shown", current.source);
    dispatch({ type: "requestEmail" });
  }, []);

  const updateEmail = React.useCallback((email: string) => {
    dispatch({ type: "email", payload: email });
  }, []);

  const updateConsent = React.useCallback((consent: boolean) => {
    dispatch({ type: "consent", payload: consent });
  }, []);

  const submitEmailLead = React.useCallback(async () => {
    const current = stateRef.current;
    const contactMethod = current.contactMethod || "email";
    const payload = buildLeadPayload(current, contactMethod);
    if (typeof payload === "string") {
      dispatch({ type: "leadFail", payload });
      return;
    }

    dispatch({ type: "leadStart" });
    const result = await submitLead(payload);
    if (result.ok) {
      const captureLabel = emailCaptureLabelForPhase(stateRef.current.phase);
      dispatch({ type: "leadSuccess", payload: { dryRun: Boolean(result.dryRun), contactMethod } });
      trackAiChat("ai_email_captured", captureLabel);
      return;
    }
    dispatch({ type: "leadFail", payload: result.error || "送信に失敗しました。" });
  }, []);

  const declineEmail = React.useCallback(async () => {
    dispatch({ type: "declineEmail" });
    trackAiChat("ai_chat_email_declined");
    await submitPartialLead(buildPartialLead(stateRef.current, "emailDeclined"));
  }, []);

  const answerEnrich = React.useCallback((role: string) => {
    dispatch({ type: "enrich", payload: role });
    trackAiChat("ai_chat_enriched", role);
    void submitPartialLead(buildPartialLead({ ...stateRef.current, role }, "enriched"));
  }, []);

  const skipEnrich = React.useCallback(() => {
    dispatch({ type: "completed" });
  }, []);

  const resetChat = React.useCallback(() => {
    const sessionId = createSessionId();
    window.sessionStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "reset", payload: { sessionId } });
  }, []);

  const value = React.useMemo<AiChatContextValue>(
    () => ({
      state,
      openChat,
      closeChat,
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
    }),
    [
      state,
      openChat,
      closeChat,
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
    ],
  );

  return <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>;
}

export function useAiChat() {
  const value = React.useContext(AiChatContext);
  if (!value) {
    throw new Error("useAiChat must be used within AiChatProvider");
  }
  return value;
}
