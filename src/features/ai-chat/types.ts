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
  | "emailGate" // ai-diagnosis-ui-redesign §4.5: Q1直後の主メール取得
  | "deepening" // contact-funnel-v2 §1.2: Q2/Q3 深掘り
  | "focusBuilding" // 進め方プラン生成待ち(5-10秒)
  | "focusShown" // 進め方プラン + 匿名事例 + 人間バトン
  | "bookingStarted" // ai-chat-funnel-ux-redesign §A: 予約ファースト
  | "booked" // webhook確定で遷移(将来)。v1はbookingStartedで案内
  | "emailRequested"
  | "leadCaptured"
  | "enriching" // 取得後エンリッチ(role 1問)
  | "completed"
  | "analysisFailed"
  | "emailDeclined";

/* 深掘りの回答enum(contact-funnel-v2 §2.2)。Notion事例RAGの照合キーと同一集合。 */
export type PainCategory =
  | "staffing" // 人手不足・属人化
  | "support" // 問い合わせ・顧客対応
  | "backoffice" // バックオフィス業務
  | "sales" // 売上・集客
  | "data" // データが活かせていない
  | "other"; // どれでもない(自由入力)

export type CompanySize = "lte10" | "lte50" | "lte300" | "gt300";
export type AiMaturity = "none" | "individual" | "partial" | "company";
export type ContactMethod = "booking" | "email";
export type EmailDomainMatch = "match" | "freemail" | "mismatch";
export type Relationship = "member" | "supporter" | "research" | "unknown";

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
  landingPath?: string;
};

export type AnalyzeResponse =
  | { ok: true; analysis: AiChatAnalysis }
  | { ok: false; error: string; fallbackAnalysis: AiChatAnalysis };

/* 深掘り→進め方プラン(contact-funnel-v2 §3.5 FocusPlan出力コントラクト)。 */
export type FocusPlanStep = { phase: string; action: string };

export type FocusPlan = {
  schemaVersion: string;
  restatement: string;
  chosenAxis: ProposalAxis;
  steps: FocusPlanStep[];
  roles: { honkoma: string; client: string };
  prerequisites: string;
  agenda: string[];
  riskNote: string;
  caseConnection?: string;
};

/* 訪問者に見せる匿名事例(§3.2の公開フィールドのみ。内部プロパティは含めない)。 */
export type CaseRecord = {
  id: string;
  title: string;
  industry: string;
  companySize: string;
  situation: string;
  approach: string;
  outcome: string;
  duration: string;
};

export type DeepenRequest = {
  source: ChatSource;
  sessionId: string;
  companyUrl: string;
  painPoint: PainCategory;
  painPointRaw?: string;
  companySize?: CompanySize | null;
  aiMaturity?: AiMaturity | null;
  analyzedSummary: string;
  signals?: string[];
  proposals: AiProposal[];
  referrer?: string;
  utm?: string;
  landingPath?: string;
};

export type DeepenResponse =
  | { ok: true; focusPlan: FocusPlan; matchedCase: CaseRecord | null; mode: "model" | "mock" }
  | { ok: false; error: string; fallbackFocusPlan: FocusPlan; matchedCase: CaseRecord | null };

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
  landingPath?: string;
  /* contact-funnel-v2 §6.2 の追加フィールド(すべて任意・後方互換)。 */
  painPointRaw?: string;
  companySize?: CompanySize;
  aiMaturity?: AiMaturity;
  contactMethod?: ContactMethod;
  diagnosisCode?: string;
  focusPlan?: FocusPlan;
  matchedCaseId?: string;
  role?: string;
  emailDomainMatch?: EmailDomainMatch;
  relationship?: Relationship;
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

export type ContactFormPayload = {
  sessionId?: string;
  inquiryType: string;
  company: string;
  name: string;
  email: string;
  employeeCount?: string;
  message: string;
  consent: boolean;
  timestamp: string;
  referrer?: string;
  utm?: string;
  landingPath?: string;
  /* 採用モード(recruit-redesign §4.2 / contact-funnel-v2)。既定は問い合わせ。 */
  type?: "inquiry" | "recruit";
  involvement?: string;
};

export type ContactPartialPayload = ContactFormPayload & {
  sessionId: string;
  partialReason?: string;
};

/* stage enum v2(contact-funnel-v2 §6.2)。旧値も後方互換で許容。 */
export type LeadStage =
  | "opened"
  | "url_entered"
  | "analyzed"
  | "pain_answered"
  | "deepened"
  | "focus_shown"
  | "booking_click"
  | "email_form_shown"
  | "contact_captured"
  | "enriched"
  // 旧v1の値(後方互換)
  | "urlEntered"
  | "painPointSelected"
  | ChatPhase;

export type PartialLeadPayload = Partial<LeadPayload> & {
  source: ChatSource;
  sessionId: string;
  stage: LeadStage;
  timestamp: string;
};
