export type ChatSource =
  | "hero"
  | "float"
  | "whatwedo"
  | "cases"
  | "exit"
  | "header"
  | "footer";

export type ChatPhase =
  | "idle"
  | "analyzing"
  | "insightsShown"
  | "emailRequested"
  | "leadCaptured"
  | "analysisFailed"
  | "emailDeclined";

export type ProposalAxis = "top_line" | "bottom_line" | "fde";

export type AiProposal = {
  axis: ProposalAxis;
  title: string;
  body: string;
  rationale: string;
};

export type AiChatAnalysis = {
  companyName: string;
  analyzedSummary: string;
  signals: string[];
  proposals: AiProposal[];
  reportTeaser: string;
  shareUrl?: string;
  mode: "model" | "mock";
};

export type AnalyzeRequest = {
  source: ChatSource;
  sessionId: string;
  companyUrl: string;
  referrer?: string;
  utm?: string;
};

export type AnalyzeResponse =
  | { ok: true; analysis: AiChatAnalysis }
  | { ok: false; error: string; fallbackAnalysis: AiChatAnalysis };

export type LeadPayload = {
  source: ChatSource;
  sessionId: string;
  companyUrl: string;
  analyzedSummary: string;
  proposedCases: string;
  painPoint: string;
  email: string;
  emailVerified: boolean;
  urlReachable: boolean;
  consent: boolean;
  timestamp: string;
  referrer?: string;
  utm?: string;
};

export type LeadResponse = {
  ok: boolean;
  dryRun?: boolean;
  notionSaved?: boolean;
  slackNotified?: boolean;
  emailSent?: boolean;
  integrationErrors?: string[];
  error?: string;
};

export type PartialLeadPayload = Partial<LeadPayload> & {
  source: ChatSource;
  sessionId: string;
  stage: ChatPhase | "urlEntered" | "painPointSelected";
  timestamp: string;
};
