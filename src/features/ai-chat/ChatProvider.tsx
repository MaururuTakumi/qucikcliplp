import React from "react";
import {
  analyzeCompany,
  normalizeCompanyUrl,
  proposalsToText,
  submitLead,
  submitPartialLead,
} from "./api/client";
import type {
  AiChatAnalysis,
  ChatPhase,
  ChatSource,
  LeadPayload,
  PartialLeadPayload,
} from "./types";

type ChatState = {
  isOpen: boolean;
  source: ChatSource;
  sessionId: string;
  companyUrl: string;
  analysis?: AiChatAnalysis;
  phase: ChatPhase;
  painPoint: string;
  email: string;
  consent: boolean;
  error?: string;
  isBusy: boolean;
  leadDryRun: boolean;
};

type PersistedChatState = Pick<
  ChatState,
  "source" | "sessionId" | "companyUrl" | "analysis" | "phase" | "painPoint" | "email" | "consent"
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
  /** 3案直後の主導線: cal.com日程予約を新規タブで開き bookingStarted へ。 */
  startBooking: () => void;
  /** 副導線: 「この3案をメールで残す」pull型ask → emailRequested。 */
  requestEmail: () => void;
  updateEmail: (email: string) => void;
  updateConsent: (consent: boolean) => void;
  submitEmailLead: () => Promise<void>;
  declineEmail: () => Promise<void>;
  resetChat: () => void;
};

const STORAGE_KEY = "honkoma-ai-chat-v1";

/** 担当との30分壁打ち予約(ai-chat-funnel-ux-redesign §G)。ContactPage完了画面と同一。 */
const CAL_BOOKING_URL = "https://cal.com/takumi-honkoma-mljb0f/honkoma-meeting";

const initialState: ChatState = {
  isOpen: false,
  source: "hero",
  sessionId: "",
  companyUrl: "",
  phase: "idle",
  painPoint: "",
  email: "",
  consent: false,
  isBusy: false,
  leadDryRun: false,
};

type Action =
  | { type: "hydrate"; payload: PersistedChatState }
  | { type: "open"; payload: OpenOptions }
  | { type: "close" }
  | { type: "setCompanyUrl"; payload: string }
  | { type: "analysisStart"; payload: { source: ChatSource; companyUrl: string } }
  | { type: "analysisSuccess"; payload: AiChatAnalysis }
  | { type: "analysisFail"; payload: { error: string; fallback: AiChatAnalysis } }
  | { type: "startBooking" }
  | { type: "requestEmail" }
  | { type: "email"; payload: string }
  | { type: "consent"; payload: boolean }
  | { type: "leadStart" }
  | { type: "leadSuccess"; payload: { dryRun: boolean } }
  | { type: "leadFail"; payload: string }
  | { type: "declineEmail" }
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
    return { ...initialState, ...persisted, isOpen: false, isBusy: false, error: undefined };
  }
  return { ...initialState, sessionId: createSessionId() };
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
    case "setCompanyUrl":
      return { ...state, companyUrl: action.payload, error: undefined };
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
      return {
        ...state,
        isBusy: false,
        phase: "insightsShown",
        analysis: action.payload,
        error: undefined,
      };
    case "analysisFail":
      return {
        ...state,
        isBusy: false,
        phase: "analysisFailed",
        analysis: action.payload.fallback,
        error: action.payload.error,
      };
    case "startBooking":
      return { ...state, phase: "bookingStarted", error: undefined };
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
        leadDryRun: action.payload.dryRun,
        error: undefined,
      };
    case "leadFail":
      return { ...state, isBusy: false, error: action.payload };
    case "declineEmail":
      return { ...state, phase: "emailDeclined", error: undefined };
    case "reset":
      return { ...initialState, sessionId: action.payload.sessionId, isOpen: true };
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
  window.gtag("event", eventName, {
    event_category: "ai_chat",
    event_label: label,
  });
}

function buildPartialLead(state: ChatState, stage: PartialLeadPayload["stage"]): PartialLeadPayload {
  return {
    source: state.source,
    sessionId: state.sessionId,
    stage,
    companyUrl: state.companyUrl,
    analyzedSummary: state.analysis?.analyzedSummary,
    proposedCases: state.analysis ? proposalsToText(state.analysis.proposals) : undefined,
    painPoint: state.painPoint,
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

    void submitPartialLead({
      ...request,
      stage: "urlEntered",
      timestamp: new Date().toISOString(),
    });

    const result = await analyzeCompany(request);
    if (result.ok) {
      dispatch({ type: "analysisSuccess", payload: result.analysis });
      trackAiChat("ai_chat_insights_shown", result.analysis.mode);
      void submitPartialLead({
        ...request,
        stage: "insightsShown",
        analyzedSummary: result.analysis.analyzedSummary,
        proposedCases: proposalsToText(result.analysis.proposals),
        timestamp: new Date().toISOString(),
      });
    } else {
      dispatch({
        type: "analysisFail",
        payload: { error: result.error, fallback: result.fallbackAnalysis },
      });
      trackAiChat("ai_chat_analysis_fallback", source);
    }
  }, []);

  const startBooking = React.useCallback(() => {
    const current = stateRef.current;
    trackAiChat("ai_chat_booking_click", current.source);
    dispatch({ type: "startBooking" });
    /* partial: 予約画面まで進んだ=hot-partial(webhook確定までの一次記録)。 */
    void submitPartialLead(
      buildPartialLead({ ...current, phase: "bookingStarted" }, "painPointSelected"),
    );
    /* v1: cal.com を新規タブで開く(§G-5 フォールバック)。webhookが予約を真値化。
     * embed popup + bookingSuccessful イベント + Worker webhook は後続で追加。 */
    if (typeof window !== "undefined") {
      const url = new URL(CAL_BOOKING_URL);
      url.searchParams.set("overlayCalendar", "true");
      url.searchParams.set("metadata[sessionId]", current.sessionId);
      url.searchParams.set("metadata[source]", current.source);
      if (current.companyUrl) url.searchParams.set("metadata[companyUrl]", current.companyUrl);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    }
  }, []);

  const requestEmail = React.useCallback(() => {
    trackAiChat("ai_chat_email_ask_shown", stateRef.current.source);
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
      trackAiChat("ai_chat_lead_captured", result.dryRun ? "dry_run" : "saved");
      return;
    }

    dispatch({ type: "leadFail", payload: result.error || "送信に失敗しました。" });
  }, []);

  const declineEmail = React.useCallback(async () => {
    dispatch({ type: "declineEmail" });
    trackAiChat("ai_chat_email_declined");
    await submitPartialLead(buildPartialLead(stateRef.current, "emailDeclined"));
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
      startBooking,
      requestEmail,
      updateEmail,
      updateConsent,
      submitEmailLead,
      declineEmail,
      resetChat,
    }),
    [
      state,
      openChat,
      closeChat,
      startAnalysis,
      startBooking,
      requestEmail,
      updateEmail,
      updateConsent,
      submitEmailLead,
      declineEmail,
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
