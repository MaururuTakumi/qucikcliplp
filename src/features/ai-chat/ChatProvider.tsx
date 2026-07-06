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
  FocusPlan,
  LeadPayload,
  PainCategory,
  PartialLeadPayload,
} from "./types";

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
  isBusy: false,
  leadDryRun: false,
};

type Action =
  | { type: "hydrate"; payload: PersistedChatState }
  | { type: "open"; payload: OpenOptions }
  | { type: "close" }
  | { type: "analysisStart"; payload: { source: ChatSource; companyUrl: string } }
  | { type: "analysisSuccess"; payload: AiChatAnalysis }
  | { type: "analysisFail"; payload: { error: string; fallback: AiChatAnalysis } }
  | { type: "answerPain"; payload: { pain: PainCategory; raw: string } }
  | { type: "answerSize"; payload: CompanySize | null }
  | { type: "answerMaturity"; payload: AiMaturity | null }
  | { type: "focusStart" }
  | { type: "focusReady"; payload: { focusPlan: FocusPlan; matchedCase: CaseRecord | null } }
  | { type: "startBooking" }
  | { type: "requestEmail" }
  | { type: "email"; payload: string }
  | { type: "consent"; payload: boolean }
  | { type: "leadStart" }
  | { type: "leadSuccess"; payload: { dryRun: boolean } }
  | { type: "leadFail"; payload: string }
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
        error: undefined,
      };
    case "analysisSuccess":
      return { ...state, isBusy: false, phase: "insightsShown", analysis: action.payload, error: undefined };
    case "analysisFail":
      return {
        ...state,
        isBusy: false,
        phase: "analysisFailed",
        analysis: action.payload.fallback,
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
    case "answerSize":
      return { ...state, companySize: action.payload, deepStep: 1 };
    case "answerMaturity":
      return { ...state, aiMaturity: action.payload };
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
        phase: "leadCaptured",
        contactMethod: "email",
        leadDryRun: action.payload.dryRun,
        error: undefined,
      };
    case "leadFail":
      return { ...state, isBusy: false, error: action.payload };
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
      };
    default:
      return state;
  }
}

const AiChatContext = React.createContext<AiChatContextValue | null>(null);

function currentReferrer() {
  if (typeof window === "undefined") return undefined;
  return document.referrer || window.location.href;
}

function currentUtm() {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const entries = Array.from(params.entries()).filter(([key]) => key.startsWith("utm_"));
  return entries.length ? new URLSearchParams(entries).toString() : undefined;
}

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function trackAiChat(eventName: string, label?: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, { event_category: "ai_chat", event_label: label });
}

function buildPartialLead(state: ChatState, stage: PartialLeadPayload["stage"]): PartialLeadPayload {
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
    email: state.email,
    consent: state.consent,
    timestamp: new Date().toISOString(),
    referrer: currentReferrer(),
    utm: currentUtm(),
  };
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
    trackAiChat("ai_chat_drawer_closed", stateRef.current.phase);
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

    const request = {
      source,
      sessionId: stateRef.current.sessionId,
      companyUrl,
      referrer: currentReferrer(),
      utm: currentUtm(),
    };

    void submitPartialLead({ ...request, stage: "url_entered", timestamp: new Date().toISOString() });

    const result = await analyzeCompany(request);
    if (result.ok) {
      dispatch({ type: "analysisSuccess", payload: result.analysis });
      trackAiChat("ai_chat_insights_shown", result.analysis.mode);
      void submitPartialLead({
        ...request,
        stage: "analyzed",
        analyzedSummary: result.analysis.analyzedSummary,
        proposedCases: proposalsToText(result.analysis.proposals),
        diagnosisCode: stateRef.current.diagnosisCode,
        timestamp: new Date().toISOString(),
      });
    } else {
      dispatch({ type: "analysisFail", payload: { error: result.error, fallback: result.fallbackAnalysis } });
      trackAiChat("ai_chat_analysis_fallback", source);
    }
  }, []);

  /* 進め方プランを生成(deepen)。深掘り完了 or スキップから呼ぶ。
   * 直前に dispatch した値(maturity)は stateRef 未反映のため override で受け取る。 */
  const buildFocus = React.useCallback(async (override?: { aiMaturity?: AiMaturity | null }) => {
    const current = stateRef.current;
    if (!current.analysis) return;
    const aiMaturity = override && "aiMaturity" in override ? override.aiMaturity ?? null : current.aiMaturity;
    dispatch({ type: "focusStart" });
    void submitPartialLead(buildPartialLead({ ...current, aiMaturity, phase: "focusBuilding" }, "deepened"));

    const result = await deepenCompany({
      source: current.source,
      sessionId: current.sessionId,
      companyUrl: current.companyUrl,
      painPoint: (current.painPoint || "other") as PainCategory,
      painPointRaw: current.painPointRaw || undefined,
      companySize: current.companySize,
      aiMaturity,
      analyzedSummary: current.analysis.analyzedSummary,
      proposals: current.analysis.proposals,
      referrer: currentReferrer(),
      utm: currentUtm(),
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
  }, []);

  const answerPain = React.useCallback((pain: PainCategory, raw = "") => {
    dispatch({ type: "answerPain", payload: { pain, raw } });
    trackAiChat("ai_deep_answered", `pain:${pain}`);
  }, []);

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
    trackAiChat("ai_baton_email_shown", stateRef.current.source);
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
    const email = current.email.trim();

    if (!isLikelyEmail(email)) {
      dispatch({ type: "leadFail", payload: "受け取り先メールアドレスを確認してください。" });
      return;
    }
    if (!current.consent) {
      dispatch({ type: "leadFail", payload: "プライバシーポリシーへの同意が必要です。" });
      return;
    }
    if (!current.analysis) {
      dispatch({ type: "leadFail", payload: "診断結果を作成してから送信してください。" });
      return;
    }

    dispatch({ type: "leadStart" });

    const payload: LeadPayload = {
      source: current.source,
      sessionId: current.sessionId,
      companyUrl: current.companyUrl,
      analyzedSummary: current.analysis.analyzedSummary,
      proposedCases: proposalsToText(current.analysis.proposals),
      painPoint: current.painPoint || "未選択",
      painPointRaw: current.painPointRaw || undefined,
      companySize: current.companySize ?? undefined,
      aiMaturity: current.aiMaturity ?? undefined,
      contactMethod: "email",
      diagnosisCode: current.diagnosisCode,
      focusPlan: current.focusPlan,
      email,
      emailVerified: isLikelyEmail(email),
      urlReachable: current.analysis.mode === "model",
      consent: current.consent,
      timestamp: new Date().toISOString(),
      referrer: currentReferrer(),
      utm: currentUtm(),
    };

    const result = await submitLead(payload);
    if (result.ok) {
      dispatch({ type: "leadSuccess", payload: { dryRun: Boolean(result.dryRun) } });
      trackAiChat("ai_baton_email_submitted", result.dryRun ? "dry_run" : "saved");
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
