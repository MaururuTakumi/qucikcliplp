type Env = {
  DEEPSEEK_API_KEY?: string;
  XAI_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  NOTION_TOKEN?: string;
  NOTION_LEADS_DB_ID?: string;
  NOTION_CASES_DB_ID?: string;
  NOTION_CASES_CACHE_VERSION?: string;
  SLACK_WEBHOOK_URL?: string;
  SLACK_NOTIFY_PARTIAL_LEADS?: string;
  ALLOWED_ORIGIN?: string;
  EMAIL?: {
    send(message: EmailMessagePayload): Promise<unknown>;
  };
  EMAIL_FROM?: string;
  EMAIL_FROM_NAME?: string;
  EMAIL_REPLY_TO?: string;
  BOOKING_URL?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_EMAIL_API_TOKEN?: string;
  CLOUDFLARE_API_TOKEN?: string;
  RESEND_API_KEY?: string;
  COMPLIANCE_CLIENT_NAMES?: string;
};

type EmailMessagePayload = {
  to: string;
  from: string | { email: string; name?: string };
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | { email: string; name?: string };
};

type WorkerExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
};

type ChatSource = "hero" | "float" | "whatwedo" | "cases" | "exit" | "header" | "footer" | "contact_form";
type ProposalAxis = "top_line" | "bottom_line" | "fde";
type PainCategory = "staffing" | "support" | "backoffice" | "sales" | "data" | "other";
type CompanySize = "lte10" | "lte50" | "lte300" | "gt300";
type AiMaturity = "none" | "individual" | "partial" | "company";
type ContactMethod = "booking" | "email";
type LeadType = "inquiry" | "recruit";
type LeadStage =
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
  | "urlEntered"
  | "painPointSelected"
  | "idle"
  | "analyzing"
  | "insightsShown"
  | "deepening"
  | "focusBuilding"
  | "focusShown"
  | "bookingStarted"
  | "booked"
  | "emailRequested"
  | "leadCaptured"
  | "completed"
  | "analysisFailed"
  | "emailDeclined";

type AiProposal = {
  axis: ProposalAxis;
  title: string;
  body: string;
  rationale: string;
};

type AiChatAnalysis = {
  companyName: string;
  analyzedSummary: string;
  signals: string[];
  proposals: AiProposal[];
  reportTeaser: string;
  shareUrl?: string;
  mode: "model" | "mock";
};

type AnalyzeBody = {
  action: "analyze";
  source: ChatSource;
  sessionId: string;
  companyUrl: string;
  referrer?: string;
  utm?: string;
};

type LeadBody = {
  action: "capture_lead";
  source: ChatSource;
  sessionId: string;
  companyUrl?: string;
  analyzedSummary?: string;
  proposedCases?: string;
  painPoint?: string;
  painPointRaw?: string;
  companySize?: CompanySize | null;
  aiMaturity?: AiMaturity | null;
  contactMethod?: ContactMethod;
  diagnosisCode?: string;
  focusPlan?: FocusPlan;
  matchedCase?: CaseRecord | null;
  matchedCaseId?: string;
  role?: string;
  stage?: LeadStage;
  type?: LeadType;
  email?: string;
  emailVerified?: boolean;
  urlReachable?: boolean;
  consent?: boolean;
  timestamp?: string;
  referrer?: string;
  utm?: string;
};

type PartialLeadBody = Omit<LeadBody, "action"> & {
  action: "partial_lead";
  stage: LeadStage;
};

type ContactFormBody = {
  action: "contact_form";
  inquiryType: string;
  company: string;
  name: string;
  email: string;
  employeeCount?: string;
  message: string;
  consent: boolean;
  timestamp?: string;
  referrer?: string;
  utm?: string;
  type?: LeadType;
  involvement?: string;
};

type FocusPlanStep = {
  phase: string;
  action: string;
};

type FocusPlan = {
  schemaVersion: string;
  restatement: string;
  chosenAxis: ProposalAxis;
  steps: FocusPlanStep[];
  roles: {
    honkoma: string;
    client: string;
  };
  prerequisites: string;
  agenda: string[];
  riskNote: string;
  caseConnection?: string;
};

type CaseRecord = {
  id: string;
  title: string;
  industry: string;
  companySize: string;
  situation: string;
  approach: string;
  outcome: string;
  duration: string;
};

type InternalCaseRecord = CaseRecord & {
  painCategories: string[];
  axis?: ProposalAxis;
  aiMaturity?: string;
  companySizeKey?: CompanySize;
};

type DeepenBody = {
  action: "deepen";
  source?: ChatSource;
  sessionId: string;
  companyUrl?: string;
  painPoint: PainCategory;
  painPointRaw?: string;
  companySize?: CompanySize | null;
  aiMaturity?: AiMaturity | null;
  analyzedSummary: string;
  signals?: string[];
  proposals: AiProposal[];
  referrer?: string;
  utm?: string;
};

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_DEFAULT_MODEL = "deepseek-v4-pro";
const NOTION_VERSION = "2022-06-28";
const CACHE_TTL_SECONDS = 3600;
const DEFAULT_BOOKING_URL = "https://calendar.app.google/DcGsqPYBvRf3dvZJ8";

const axisOrder: ProposalAxis[] = ["top_line", "bottom_line", "fde"];
const companySizeOrder: CompanySize[] = ["lte10", "lte50", "lte300", "gt300"];
const defaultClientNameDictionary = [
  "BUYSELL",
  "BuySell",
  "バイセル",
  "SOBLUE",
  "FIKA",
  "貞栄会",
  "慶洋",
];

function jsonResponse(data: unknown, request: Request, env: Env, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request, env),
    },
  });
}

function corsHeaders(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "*";
  const allowed = env.ALLOWED_ORIGIN?.split(",").map((value) => value.trim()).filter(Boolean);
  const allowOrigin = allowed?.length ? (allowed.includes(origin) ? origin : allowed[0]) : origin;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function normalizeCompanyUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("companyUrl is required");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function hostnameFor(value: string) {
  try {
    return new URL(normalizeCompanyUrl(value)).hostname.replace(/^www\./, "");
  } catch {
    return "御社";
  }
}

function isPrivateIpv4(hostname: string) {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const parts = match.slice(1).map(Number);
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function assertPublicHttpUrl(rawUrl: string) {
  const parsed = new URL(normalizeCompanyUrl(rawUrl));
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Only http/https URLs can be analyzed");
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "::1" ||
    host === "[::1]" ||
    isPrivateIpv4(host)
  ) {
    throw new Error("Private network URLs cannot be analyzed");
  }
  return parsed.toString();
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 9000);
}

async function fetchWebsiteText(companyUrl: string) {
  const safeUrl = assertPublicHttpUrl(companyUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(safeUrl, {
      headers: {
        "User-Agent": "honkoma-ai-chat/1.0",
        "Accept": "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.5",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`URL fetch failed: ${response.status}`);
    const length = Number(response.headers.get("content-length") || 0);
    if (length > 750_000) throw new Error("URL response is too large");
    return stripHtml(await response.text());
  } finally {
    clearTimeout(timer);
  }
}

function mockAnalysis(companyUrl: string, reason?: string): AiChatAnalysis {
  const domain = hostnameFor(companyUrl);
  const reasonSignal = reason ? `フォールバック理由: ${reason}` : "AIキー未設定のためローカル診断で継続";
  return {
    companyName: domain,
    analyzedSummary:
      `${domain} の公開情報をもとに、問い合わせ・集客・現場業務の改善余地を仮説として整理しました。`,
    signals: [
      `企業サイト: ${domain} を確認`,
      "問い合わせ導線とサービス説明の有無を確認",
      reasonSignal,
    ],
    proposals: [
      {
        axis: "top_line",
        title: "問い合わせ前の疑問にAIが答え、相談につながる温度感を作る",
        body:
          "訪問者の状況に合わせて提案を返し、資料請求や初回相談に進む前の不安を減らします。",
        rationale: "売上を伸ばす導線として、商談前の会話量と質を高めます。",
      },
      {
        axis: "bottom_line",
        title: "一次対応と定型確認をAIに寄せ、担当者の反復業務を減らす",
        body:
          "よくある質問、予約前確認、要件の整理をAIが受け、担当者は判断が必要な対応に集中します。",
        rationale: "工数を削る導線として、繰り返しの問い合わせ対応を圧縮します。",
      },
      {
        axis: "fde",
        title: "既存業務に合わせて小さく実装し、運用まで伴走する",
        body:
          "フォーム、Slack、Notion、社内DBなど今ある運用に合わせて、使われる状態まで作り込みます。",
        rationale: "FDEとして、PoCではなく現場実装まで接続します。",
      },
    ],
    reportTeaser:
      "選んだ課題に合わせ、導入順序・必要なデータ・初期実装範囲を診断レポートに整理できます。",
    shareUrl: `https://ltdhonkoma.com/contact?ai_chat=${encodeURIComponent(domain)}`,
    mode: "mock",
  };
}

function cleanText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return value
    .replace(/```/g, "")
    .replace(/\b\d+\s*(%|％)\b/g, "一定割合")
    .trim()
    .slice(0, 420) || fallback;
}

function shortText(value: unknown, fallback: string, maxLength: number) {
  return cleanText(value, fallback).slice(0, maxLength) || fallback.slice(0, maxLength);
}

function hasJapanese(text: string) {
  return /[ぁ-んァ-ヶ一-龠]/.test(text);
}

function hasLanguageDrift(text: string) {
  return /[们这说吗么韓國한국]/.test(text) || /[A-Za-z]{90,}/.test(text);
}

function complianceClientNames(env?: Env) {
  const configured = env?.COMPLIANCE_CLIENT_NAMES?.split(",").map((value) => value.trim()).filter(Boolean) || [];
  return [...defaultClientNameDictionary, ...configured];
}

function lintText(text: string, env?: Env) {
  const forbiddenPatterns = [
    /必ず/,
    /保証/,
    /断言/,
    /100\s*(%|％)/,
    /\d+\s*(%|％)?\s*(削減|向上|増加)(でき|し)ます/,
    /確実に/,
    /残枠/,
    /カウントダウン/,
  ];
  const hasForbiddenPattern = forbiddenPatterns.some((pattern) => pattern.test(text));
  const hasClientName = complianceClientNames(env).some((name) => name && text.includes(name));
  return {
    ok: !hasForbiddenPattern && !hasClientName && !hasLanguageDrift(text),
    hasForbiddenPattern,
    hasClientName,
  };
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((item) => collectStrings(item));
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((item) => collectStrings(item));
  }
  return [];
}

function outputPassesLint(value: unknown, env?: Env) {
  return collectStrings(value).every((text) => {
    const trimmed = text.trim();
    return !trimmed || lintText(trimmed, env).ok;
  });
}

function validateAnalysis(raw: unknown, companyUrl: string): AiChatAnalysis {
  const input = raw as Partial<AiChatAnalysis>;
  const fallback = mockAnalysis(companyUrl);
  const rawProposals = Array.isArray(input.proposals) ? input.proposals : [];
  const proposals = axisOrder.map((axis, index) => {
    const source = rawProposals.find((proposal) => proposal && proposal.axis === axis) ||
      rawProposals[index] ||
      fallback.proposals[index];
    return {
      axis,
      title: cleanText((source as Partial<AiProposal>).title, fallback.proposals[index].title),
      body: cleanText((source as Partial<AiProposal>).body, fallback.proposals[index].body),
      rationale: cleanText(
        (source as Partial<AiProposal>).rationale,
        fallback.proposals[index].rationale,
      ),
    };
  });
  return {
    companyName: cleanText(input.companyName, hostnameFor(companyUrl)).slice(0, 120),
    analyzedSummary: cleanText(input.analyzedSummary, fallback.analyzedSummary),
    signals: Array.isArray(input.signals)
      ? input.signals.slice(0, 4).map((signal) => cleanText(signal, "")).filter(Boolean)
      : fallback.signals,
    proposals,
    reportTeaser: cleanText(input.reportTeaser, fallback.reportTeaser),
    shareUrl: typeof input.shareUrl === "string" ? input.shareUrl : fallback.shareUrl,
    mode: "model",
  };
}

function validateAnalysisWithLint(raw: unknown, companyUrl: string, env: Env): AiChatAnalysis {
  const analysis = validateAnalysis(raw, companyUrl);
  return outputPassesLint(analysis, env) ? analysis : mockAnalysis(companyUrl, "出力検証で安全な文面に切り替え");
}

function extractJson(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function deepSeekRequestBody(env: Env, companyUrl: string, websiteText: string, retry = false) {
  const domain = hostnameFor(companyUrl);
  return {
    model: env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL,
    thinking: { type: "disabled" },
    temperature: retry ? 0.2 : 0.35,
    max_tokens: 1800,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          [
            "You are honkoma's AI diagnosis engine.",
            "Return valid json only. Do not wrap the json in markdown.",
            "Do not promise numerical outcomes. Do not invent client facts.",
            "Produce exactly three proposals mapped to axes top_line, bottom_line, fde.",
            "Keep Japanese concise and specific to the provided website text.",
            "Example json output:",
            JSON.stringify({
              companyName: "example.jp",
              analyzedSummary: "公開情報から見える業務課題の仮説。",
              signals: ["企業サイトを確認", "問い合わせ導線を確認"],
              proposals: [
                {
                  axis: "top_line",
                  title: "問い合わせ前の疑問に答える",
                  body: "訪問者の状況に合わせた回答を出します。",
                  rationale: "商談前の温度感を高めます。",
                },
                {
                  axis: "bottom_line",
                  title: "一次対応を自動化する",
                  body: "定型質問と要件整理をAIに寄せます。",
                  rationale: "反復対応の工数を減らします。",
                },
                {
                  axis: "fde",
                  title: "現場運用に接続する",
                  body: "SlackやNotionなど既存運用へつなぎます。",
                  rationale: "PoCで終わらせず実運用に残します。",
                },
              ],
              reportTeaser: "導入順序と初期実装範囲を診断レポートに整理できます。",
            }),
          ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify({
          companyUrl,
          domain,
          websiteText,
          outputSchema: {
            companyName: "string",
            analyzedSummary: "string",
            signals: ["string"],
            proposals: [
              {
                axis: "top_line | bottom_line | fde",
                title: "string",
                body: "string",
                rationale: "string",
              },
            ],
            reportTeaser: "string",
          },
        }),
      },
    ],
  };
}

function messageContent(message: { content?: unknown } | undefined) {
  const content = message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (item && typeof item === "object" && "text" in item && typeof item.text === "string") {
          return item.text;
        }
        return "";
      })
      .join("");
  }
  return "";
}

async function callDeepSeek(env: Env, companyUrl: string, websiteText: string) {
  const apiKey = env.DEEPSEEK_API_KEY || env.XAI_API_KEY;
  if (!apiKey) return mockAnalysis(companyUrl);

  let lastError = "DeepSeek response did not include content";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(DEEPSEEK_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deepSeekRequestBody(env, companyUrl, websiteText, attempt > 0)),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API failed: ${response.status}`);
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = messageContent(data.choices?.[0]?.message);
    if (content.trim()) return validateAnalysisWithLint(extractJson(content), companyUrl, env);
    lastError = "DeepSeek response did not include content";
  }

  throw new Error(lastError);
}

function painLabel(pain: PainCategory) {
  const labels: Record<PainCategory, string> = {
    staffing: "人手不足・属人化",
    support: "問い合わせ・顧客対応",
    backoffice: "バックオフィス業務",
    sales: "売上・集客",
    data: "データ活用",
    other: "その他の課題",
  };
  return labels[pain];
}

function companySizeLabel(size?: CompanySize | null) {
  const labels: Record<CompanySize, string> = {
    lte10: "〜10名",
    lte50: "〜50名",
    lte300: "〜300名",
    gt300: "301名〜",
  };
  return size ? labels[size] : "未回答";
}

function maturityLabel(maturity?: AiMaturity | null) {
  const labels: Record<AiMaturity, string> = {
    none: "これから導入",
    individual: "個人利用が中心",
    partial: "一部業務で利用中",
    company: "全社で活用中",
  };
  return maturity ? labels[maturity] : "未回答";
}

function contactMethodLabel(method?: ContactMethod) {
  if (method === "booking") return "30分相談";
  if (method === "email") return "メール受け取り";
  return "未選択";
}

function normalizeCompanySize(value: unknown): CompanySize | undefined {
  if (value === "lte10" || value === "lte50" || value === "lte300" || value === "gt300") return value;
  if (typeof value !== "string") return undefined;
  if (/301|300名超|gt300/.test(value)) return "gt300";
  if (/300|〜300|~300|lte300/.test(value)) return "lte300";
  if (/50|〜50|~50|lte50/.test(value)) return "lte50";
  if (/10|〜10|~10|lte10/.test(value)) return "lte10";
  return undefined;
}

function normalizeMaturity(value: unknown): AiMaturity | undefined {
  if (value === "none" || value === "individual" || value === "partial" || value === "company") return value;
  if (typeof value !== "string") return undefined;
  if (/全社|company/.test(value)) return "company";
  if (/一部|partial/.test(value)) return "partial";
  if (/個人|individual/.test(value)) return "individual";
  if (/導入前|これから|未導入|none/.test(value)) return "none";
  return undefined;
}

function painMatches(selected: PainCategory, candidate: string) {
  const text = candidate.toLowerCase();
  if (text === selected || text.includes(painLabel(selected))) return true;
  const patterns: Record<PainCategory, RegExp> = {
    staffing: /staffing|人手|属人|採用|不足/,
    support: /support|問い合わせ|顧客対応|カスタマー|予約|一次対応/,
    backoffice: /backoffice|バックオフィス|経理|総務|事務|請求|書類/,
    sales: /sales|売上|集客|商談|営業|リード/,
    data: /data|データ|分析|可視化|活用/,
    other: /other|その他/,
  };
  return patterns[selected].test(text);
}

function normalizePainCategory(value: unknown): PainCategory {
  const painValues: PainCategory[] = ["staffing", "support", "backoffice", "sales", "data", "other"];
  if (painValues.includes(value as PainCategory)) return value as PainCategory;
  if (typeof value === "string") {
    const matched = painValues.find((pain) => painMatches(pain, value));
    if (matched) return matched;
  }
  return "other";
}

function axisForPain(body: Pick<DeepenBody, "painPoint" | "proposals">): ProposalAxis {
  const mapped: Record<PainCategory, ProposalAxis> = {
    staffing: "fde",
    support: "bottom_line",
    backoffice: "bottom_line",
    sales: "top_line",
    data: "fde",
    other: "fde",
  };
  const preferred = mapped[body.painPoint];
  return body.proposals.find((proposal) => proposal.axis === preferred)?.axis || preferred;
}

function diagnosisCodeForSession(sessionId: string) {
  const direct = sessionId.toUpperCase().replace(/[^A-Z2-7]/g, "").slice(0, 4);
  if (direct.length === 4) return `HK-${direct}`;
  let hash = 2166136261;
  for (const char of sessionId) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  let value = hash >>> 0;
  for (let index = 0; index < 4; index += 1) {
    suffix += alphabet[value % alphabet.length];
    value = Math.floor(value / alphabet.length);
  }
  return `HK-${(direct + suffix).slice(0, 4)}`;
}

type CacheLike = {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
};

function defaultWorkerCache(): CacheLike | undefined {
  return (globalThis as unknown as { caches?: { default?: CacheLike } }).caches?.default;
}

function notionPlainText(property: unknown) {
  const value = property as {
    title?: Array<{ plain_text?: string }>;
    rich_text?: Array<{ plain_text?: string }>;
  };
  const parts = value?.title || value?.rich_text || [];
  return parts.map((part) => part.plain_text || "").join("").trim();
}

function notionSelectName(property: unknown) {
  const value = property as { select?: { name?: string } };
  return value?.select?.name?.trim() || "";
}

function notionMultiSelectNames(property: unknown) {
  const value = property as { multi_select?: Array<{ name?: string }> };
  return value?.multi_select?.map((item) => item.name || "").filter(Boolean) || [];
}

function publicCase(record: InternalCaseRecord): CaseRecord {
  return {
    id: record.id,
    title: record.title,
    industry: record.industry,
    companySize: record.companySize,
    situation: record.situation,
    approach: record.approach,
    outcome: record.outcome,
    duration: record.duration,
  };
}

function parseCaseRecord(page: unknown): InternalCaseRecord | null {
  const entry = page as { id?: string; properties?: Record<string, unknown> };
  const props = entry.properties || {};
  const title = notionPlainText(props.Title);
  if (!entry.id || !title) return null;
  const companySize = notionSelectName(props["Company Size"]);
  return {
    id: entry.id,
    title: title.slice(0, 180),
    industry: notionSelectName(props.Industry).slice(0, 80),
    companySize: companySize.slice(0, 40),
    companySizeKey: normalizeCompanySize(companySize),
    painCategories: notionMultiSelectNames(props["Pain Category"]),
    axis: axisOrder.includes(notionSelectName(props.Axis) as ProposalAxis)
      ? notionSelectName(props.Axis) as ProposalAxis
      : undefined,
    aiMaturity: notionSelectName(props["AI Maturity"]),
    situation: notionPlainText(props.Situation).slice(0, 200),
    approach: notionPlainText(props.Approach).slice(0, 300),
    outcome: notionPlainText(props.Outcome).slice(0, 200),
    duration: notionPlainText(props.Duration).slice(0, 80),
  };
}

async function fetchCaseRecords(env: Env): Promise<InternalCaseRecord[]> {
  if (!env.NOTION_TOKEN || !env.NOTION_CASES_DB_ID) return [];

  const cache = defaultWorkerCache();
  const cacheVersion = env.NOTION_CASES_CACHE_VERSION || "v1";
  const cacheKey = new Request(`https://honkoma.local/notion-case-studies/${env.NOTION_CASES_DB_ID}/${cacheVersion}`);
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      try {
        return await cached.json() as InternalCaseRecord[];
      } catch {
        // Fall through and refresh the cache.
      }
    }
  }

  const records: InternalCaseRecord[] = [];
  let startCursor: string | undefined;
  do {
    const result = await notionFetch(env, `/databases/${env.NOTION_CASES_DB_ID}/query`, {
      method: "POST",
      body: JSON.stringify({
        filter: {
          property: "Publish Level",
          select: { equals: "anon_ok" },
        },
        page_size: 100,
        start_cursor: startCursor,
      }),
    }) as { results?: unknown[]; has_more?: boolean; next_cursor?: string };
    for (const page of result.results || []) {
      const parsed = parseCaseRecord(page);
      if (parsed && outputPassesLint(publicCase(parsed), env)) records.push(parsed);
    }
    startCursor = result.has_more ? result.next_cursor : undefined;
  } while (startCursor);

  if (cache) {
    await cache.put(cacheKey, new Response(JSON.stringify(records), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    }));
  }
  return records;
}

function inferIndustry(body: Pick<DeepenBody, "companyUrl" | "analyzedSummary" | "proposals">) {
  const text = [
    body.companyUrl || "",
    body.analyzedSummary,
    ...body.proposals.flatMap((proposal) => [proposal.title, proposal.body, proposal.rationale]),
  ].join(" ");
  const rules: Array<[string, RegExp]> = [
    ["建設", /建設|工事|施工|現場|職人/],
    ["製造", /製造|工場|生産|部品|加工/],
    ["小売・EC", /小売|EC|通販|店舗|販売/],
    ["医療・介護", /医療|介護|クリニック|病院|福祉/],
    ["士業・専門サービス", /士業|法律|会計|税理士|社労士|コンサル|専門サービス/],
    ["IT", /IT|SaaS|システム|ソフトウェア|アプリ|開発/],
    ["宿泊・観光", /ホテル|宿泊|旅館|観光/],
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0];
}

function caseScore(record: InternalCaseRecord, body: DeepenBody) {
  let score = 0;
  if (record.painCategories.some((category) => painMatches(body.painPoint, category))) score += 3;

  const inputSize = body.companySize || undefined;
  if (inputSize && record.companySizeKey) {
    const inputIndex = companySizeOrder.indexOf(inputSize);
    const recordIndex = companySizeOrder.indexOf(record.companySizeKey);
    if (inputIndex === recordIndex) score += 2;
    else if (Math.abs(inputIndex - recordIndex) === 1) score += 1;
  }

  const industry = inferIndustry(body);
  if (industry && record.industry && (record.industry.includes(industry) || industry.includes(record.industry))) {
    score += 2;
  }

  if (record.axis && record.axis === axisForPain(body)) score += 1;

  const maturity = normalizeMaturity(record.aiMaturity);
  if (body.aiMaturity && maturity && maturity === body.aiMaturity) score += 1;

  return score;
}

function selectMatchedCase(records: InternalCaseRecord[], body: DeepenBody) {
  const ranked = records
    .map((record) => ({ record, score: caseScore(record, body) }))
    .sort((left, right) => right.score - left.score || left.record.title.localeCompare(right.record.title, "ja"));
  const best = ranked[0];
  return best && best.score >= 3 ? publicCase(best.record) : null;
}

function fallbackFocusPlan(body: DeepenBody, matchedCase: CaseRecord | null): FocusPlan {
  const chosenAxis = axisForPain(body);
  const selectedProposal = body.proposals.find((proposal) => proposal.axis === chosenAxis);
  const pain = painLabel(body.painPoint);
  const axisHeadline = selectedProposal?.title || {
    top_line: "問い合わせ前の疑問に答え、相談化率を高める",
    bottom_line: "一次対応と定型確認をAIに寄せる",
    fde: "現場の業務フローに合わせて小さく実装する",
  }[chosenAxis];

  const firstAction = body.painPoint === "support"
    ? "問い合わせ内容を分類し、AIが回答できる範囲と人が見る範囲を分けます。"
    : body.painPoint === "sales"
      ? "公開サイトと既存問い合わせを見て、相談前の不安と離脱点を整理します。"
      : body.painPoint === "backoffice"
        ? "反復している確認・転記・書類作成を棚卸しし、AI化の入口を決めます。"
        : "現場の判断と繰り返し作業を分け、最初に軽くできる業務を決めます。";

  const plan: FocusPlan = {
    schemaVersion: "1.0",
    restatement: `${pain}を起点に、${axisHeadline}`.slice(0, 80),
    chosenAxis,
    steps: [
      { phase: "整理", action: firstAction.slice(0, 80) },
      { phase: "試作", action: "Slack、Notion、フォームなど既存導線に合わせて小さな試作を作ります。" },
      { phase: "運用化", action: "担当者の確認点と改善サイクルを決め、使われる状態まで調整します。" },
    ],
    roles: {
      honkoma: "業務整理、AI設計、実装、運用初期の改善まで伴走します。",
      client: "現場の判断基準、既存資料、よくある問い合わせや例外対応を共有します。",
    },
    prerequisites: `規模: ${companySizeLabel(body.companySize)} / AI活用: ${maturityLabel(body.aiMaturity)}`,
    agenda: [
      "最初にAIへ任せる業務範囲",
      "人が確認すべき例外と判断基準",
      "既存ツールとのつなぎ方",
    ],
    riskNote: "初回は範囲を絞り、現場の確認を残した形で始めます。",
  };

  if (matchedCase) {
    plan.caseConnection = `${matchedCase.companySize || "近い規模"}の匿名事例と課題の入口が近いです。`.slice(0, 80);
  }
  return plan;
}

function focusPlanLanguageOk(plan: FocusPlan) {
  const prose = [
    plan.restatement,
    ...plan.steps.flatMap((step) => [step.phase, step.action]),
    plan.roles.honkoma,
    plan.roles.client,
    plan.prerequisites,
    ...plan.agenda,
    plan.riskNote,
    plan.caseConnection || "",
  ];
  return prose.every((text) => !text || hasJapanese(text));
}

function validateFocusPlan(raw: unknown, body: DeepenBody, matchedCase: CaseRecord | null, env: Env): FocusPlan | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Partial<FocusPlan>;
  const fallback = fallbackFocusPlan(body, matchedCase);
  const chosenAxis = axisOrder.includes(input.chosenAxis as ProposalAxis)
    ? input.chosenAxis as ProposalAxis
    : fallback.chosenAxis;

  const rawSteps = Array.isArray(input.steps) ? input.steps : [];
  const steps = rawSteps.slice(0, 3).map((step, index) => {
    const source = step as Partial<FocusPlanStep>;
    return {
      phase: shortText(source.phase, fallback.steps[index]?.phase || "確認", 14),
      action: shortText(source.action, fallback.steps[index]?.action || "実装範囲を確認します。", 80),
    };
  });
  while (steps.length < 3) steps.push(fallback.steps[steps.length]);

  const rawAgenda = Array.isArray(input.agenda) ? input.agenda : [];
  const agenda = rawAgenda.slice(0, 3).map((item, index) => (
    shortText(item, fallback.agenda[index] || "相談で確認すること", 60)
  ));
  while (agenda.length < 2) agenda.push(fallback.agenda[agenda.length]);

  const plan: FocusPlan = {
    schemaVersion: "1.0",
    restatement: shortText(input.restatement, fallback.restatement, 80),
    chosenAxis,
    steps,
    roles: {
      honkoma: shortText(input.roles?.honkoma, fallback.roles.honkoma, 100),
      client: shortText(input.roles?.client, fallback.roles.client, 100),
    },
    prerequisites: shortText(input.prerequisites, fallback.prerequisites, 100),
    agenda,
    riskNote: shortText(input.riskNote, fallback.riskNote, 80),
  };

  if (matchedCase) {
    plan.caseConnection = shortText(input.caseConnection, fallback.caseConnection || "", 80);
  }

  if (!outputPassesLint(plan, env) || !focusPlanLanguageOk(plan)) return null;
  return plan;
}

function deepSeekFocusPlanRequestBody(
  env: Env,
  body: DeepenBody,
  matchedCase: CaseRecord | null,
  retry = false,
) {
  const chosenAxis = axisForPain(body);
  const selectedProposal = body.proposals.find((proposal) => proposal.axis === chosenAxis);
  return {
    model: env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL,
    thinking: { type: "disabled" },
    temperature: retry ? 0.2 : 0.35,
    max_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          "You are honkoma's focus-plan generator.",
          "Return valid JSON only. Do not wrap in markdown.",
          "Generate only the FocusPlan object. Do not generate HTML.",
          "Do not promise numeric outcomes, guaranteed results, urgency scarcity, or client names.",
          "If a matched case is provided, do not rewrite its facts. Only write caseConnection within 80 Japanese characters.",
          "Use concise, polite Japanese.",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify({
          painPoint: body.painPoint,
          painPointLabel: painLabel(body.painPoint),
          painPointRaw: body.painPointRaw || "",
          companySize: body.companySize || null,
          companySizeLabel: companySizeLabel(body.companySize),
          aiMaturity: body.aiMaturity || null,
          aiMaturityLabel: maturityLabel(body.aiMaturity),
          analyzedSummary: body.analyzedSummary,
          selectedProposal,
          proposals: body.proposals,
          matchedCase,
          outputSchema: {
            schemaVersion: "1.0",
            restatement: "string <=80",
            chosenAxis: "top_line | bottom_line | fde",
            steps: [{ phase: "string <=14", action: "string <=80" }],
            roles: { honkoma: "string <=100", client: "string <=100" },
            prerequisites: "string <=100",
            agenda: ["2-3 strings <=60"],
            riskNote: "string <=80",
            caseConnection: "optional string <=80, only if matchedCase exists",
          },
          example: fallbackFocusPlan(body, matchedCase),
        }),
      },
    ],
  };
}

async function callDeepSeekFocusPlan(env: Env, body: DeepenBody, matchedCase: CaseRecord | null) {
  const apiKey = env.DEEPSEEK_API_KEY || env.XAI_API_KEY;
  if (!apiKey) return fallbackFocusPlan(body, matchedCase);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(DEEPSEEK_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deepSeekFocusPlanRequestBody(env, body, matchedCase, attempt > 0)),
    });
    if (!response.ok) throw new Error(`DeepSeek API failed: ${response.status}`);
    const data = await response.json() as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = messageContent(data.choices?.[0]?.message);
    if (!content.trim()) continue;
    try {
      const plan = validateFocusPlan(extractJson(content), body, matchedCase, env);
      if (plan) return plan;
    } catch {
      // Retry once with a stricter prompt, then deterministic fallback.
    }
  }
  return fallbackFocusPlan(body, matchedCase);
}

async function handleDeepen(body: DeepenBody, env: Env) {
  const normalized: DeepenBody = {
    ...body,
    painPoint: normalizePainCategory(body.painPoint),
    companySize: body.companySize || null,
    aiMaturity: body.aiMaturity || null,
    proposals: Array.isArray(body.proposals) ? body.proposals : [],
  };
  if (!normalized.sessionId) throw new Error("sessionId is required");
  if (!normalized.analyzedSummary) throw new Error("analyzedSummary is required");
  if (normalized.proposals.length < 1) throw new Error("proposals are required");

  let matchedCase: CaseRecord | null = null;
  try {
    matchedCase = selectMatchedCase(await fetchCaseRecords(env), normalized);
  } catch {
    matchedCase = null;
  }

  try {
    const focusPlan = await callDeepSeekFocusPlan(env, normalized, matchedCase);
    const mode = env.DEEPSEEK_API_KEY || env.XAI_API_KEY ? "model" : "mock";
    return { ok: true, focusPlan, matchedCase, mode };
  } catch {
    return {
      ok: true,
      focusPlan: fallbackFocusPlan(normalized, matchedCase),
      matchedCase,
      mode: "mock",
    };
  }
}

function richText(text: string) {
  return [{ type: "text", text: { content: text.slice(0, 1900) } }];
}

function titleText(text: string) {
  return [{ type: "text", text: { content: text.slice(0, 180) || "AI chat lead" } }];
}

function safeJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function matchedCaseLabel(payload: LeadBody | PartialLeadBody) {
  if (payload.matchedCase) {
    return [payload.matchedCase.id, payload.matchedCase.title].filter(Boolean).join(" | ");
  }
  return payload.matchedCaseId || "";
}

function stageRank(stage?: string) {
  const order = [
    "opened",
    "url_entered",
    "urlEntered",
    "analyzed",
    "insightsShown",
    "pain_answered",
    "painPointSelected",
    "deepening",
    "deepened",
    "focusBuilding",
    "focus_shown",
    "focusShown",
    "booking_click",
    "bookingStarted",
    "email_form_shown",
    "emailRequested",
    "contact_captured",
    "leadCaptured",
    "enriched",
    "completed",
  ];
  const index = stage ? order.indexOf(stage) : -1;
  return index === -1 ? 0 : index;
}

function forwardStage(incoming?: string, existing?: string) {
  if (!incoming) return existing;
  if (!existing) return incoming;
  return stageRank(existing) > stageRank(incoming) ? existing : incoming;
}

function notionProperties(payload: LeadBody | PartialLeadBody) {
  const title = payload.companyUrl ? hostnameFor(payload.companyUrl) : payload.email || payload.sessionId;
  const diagnosisCode = payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId);
  const properties: Record<string, unknown> = {
    Company: { title: titleText(title) },
    Source: { select: { name: payload.source } },
    "Session ID": { rich_text: richText(payload.sessionId) },
    Timestamp: { date: { start: payload.timestamp || new Date().toISOString() } },
    Status: { select: { name: "New" } },
  };

  if (payload.companyUrl) properties["Company URL"] = { url: payload.companyUrl };
  if (payload.analyzedSummary) {
    properties["Analyzed Summary"] = { rich_text: richText(payload.analyzedSummary) };
  }
  if (payload.proposedCases) properties["Proposed Cases"] = { rich_text: richText(payload.proposedCases) };
  if (payload.painPoint) properties["Pain Point"] = { rich_text: richText(payload.painPoint) };
  if (payload.painPointRaw) properties["Pain Raw"] = { rich_text: richText(payload.painPointRaw) };
  if (payload.companySize) properties["Company Size"] = { select: { name: companySizeLabel(payload.companySize) } };
  if (payload.aiMaturity) properties["AI Maturity"] = { select: { name: maturityLabel(payload.aiMaturity) } };
  if (payload.stage) properties.Stage = { select: { name: payload.stage } };
  if (payload.contactMethod) properties["Contact Method"] = { select: { name: contactMethodLabel(payload.contactMethod) } };
  properties["Diagnosis Code"] = { rich_text: richText(diagnosisCode) };
  if (payload.focusPlan) properties["Focus Plan"] = { rich_text: richText(safeJson(payload.focusPlan)) };
  const caseLabel = matchedCaseLabel(payload);
  if (caseLabel) properties["Matched Case"] = { rich_text: richText(caseLabel) };
  if (payload.role) properties.Role = { rich_text: richText(payload.role) };
  if (payload.type) {
    properties.Type = { select: { name: payload.type } };
    properties.type = { select: { name: payload.type } };
  }
  if (payload.email) properties.Email = { email: payload.email };
  if (typeof payload.emailVerified === "boolean") {
    properties["Email Verified"] = { checkbox: payload.emailVerified };
  }
  if (typeof payload.urlReachable === "boolean") {
    properties["URL Reachable"] = { checkbox: payload.urlReachable };
  }
  if (typeof payload.consent === "boolean") properties.Consent = { checkbox: payload.consent };
  if (payload.utm || payload.referrer) {
    properties["UTM / Referrer"] = { rich_text: richText([payload.utm, payload.referrer].filter(Boolean).join(" | ")) };
  }
  return properties;
}

function contactFormSessionId(payload: ContactFormBody) {
  const timestamp = payload.timestamp || new Date().toISOString();
  return `contact_form:${timestamp}:${payload.email}`;
}

function notionContactFormProperties(payload: ContactFormBody) {
  const timestamp = payload.timestamp || new Date().toISOString();
  const title = payload.company || payload.name || payload.email;
  const type = payload.type || (payload.inquiryType.includes("採用") ? "recruit" : "inquiry");
  const context = [
    `問い合わせ種別: ${payload.inquiryType}`,
    `お名前: ${payload.name}`,
    payload.employeeCount ? `従業員数: ${payload.employeeCount}` : "",
    payload.involvement ? `関わり方: ${payload.involvement}` : "",
  ].filter(Boolean).join("\n");
  const utmReferrer = [
    "source=contact_form",
    `type=${type}`,
    payload.utm ? `utm=${payload.utm}` : "",
    payload.referrer ? `referrer=${payload.referrer}` : "",
  ].filter(Boolean).join(" | ");

  return {
    Company: { title: titleText(title) },
    Source: { select: { name: "contact_form" } },
    "Session ID": { rich_text: richText(contactFormSessionId({ ...payload, timestamp })) },
    Timestamp: { date: { start: timestamp } },
    Status: { select: { name: "New" } },
    "Analyzed Summary": { rich_text: richText("通常問い合わせフォームからの問い合わせ") },
    "Pain Point": { rich_text: richText(payload.message) },
    "Proposed Cases": { rich_text: richText(context) },
    Email: { email: payload.email },
    Consent: { checkbox: payload.consent },
    "UTM / Referrer": { rich_text: richText(utmReferrer) },
    Type: { select: { name: type } },
    type: { select: { name: type } },
  };
}

async function notionFetch(env: Env, path: string, init: RequestInit) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Notion API failed: ${response.status}`);
  }
  return response.json();
}

async function notionDatabasePropertyNames(env: Env, databaseId: string) {
  const cache = defaultWorkerCache();
  const cacheKey = new Request(`https://honkoma.local/notion-db-props/${databaseId}`);
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      try {
        return new Set(await cached.json() as string[]);
      } catch {
        // Fall through and refresh.
      }
    }
  }

  const database = await notionFetch(env, `/databases/${databaseId}`, { method: "GET" }) as {
    properties?: Record<string, unknown>;
  };
  const names = Object.keys(database.properties || {});
  if (cache) {
    await cache.put(cacheKey, new Response(JSON.stringify(names), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    }));
  }
  return new Set(names);
}

async function filterNotionProperties(env: Env, properties: Record<string, unknown>) {
  if (!env.NOTION_TOKEN || !env.NOTION_LEADS_DB_ID) return properties;
  try {
    const allowed = await notionDatabasePropertyNames(env, env.NOTION_LEADS_DB_ID);
    return Object.fromEntries(
      Object.entries(properties).filter(([name]) => allowed.has(name)),
    );
  } catch {
    return properties;
  }
}

async function findNotionPageBySession(env: Env, sessionId: string) {
  const result = await notionFetch(env, `/databases/${env.NOTION_LEADS_DB_ID}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: {
        property: "Session ID",
        rich_text: { equals: sessionId },
      },
      page_size: 1,
    }),
  }) as { results?: Array<{ id: string; properties?: Record<string, unknown> }> };
  const page = result.results?.[0];
  if (!page) return undefined;
  return {
    id: page.id,
    stage: notionSelectName(page.properties?.Stage),
  };
}

async function upsertNotionLead(env: Env, payload: LeadBody | PartialLeadBody) {
  if (!env.NOTION_TOKEN || !env.NOTION_LEADS_DB_ID) return false;
  const existingPage = await findNotionPageBySession(env, payload.sessionId);
  const rawProperties = notionProperties(payload);
  const nextStage = forwardStage(payload.stage, existingPage?.stage);
  if (nextStage) rawProperties.Stage = { select: { name: nextStage } };
  const properties = await filterNotionProperties(env, rawProperties);
  if (existingPage) {
    await notionFetch(env, `/pages/${existingPage.id}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
    return true;
  }
  await notionFetch(env, "/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: env.NOTION_LEADS_DB_ID },
      properties,
    }),
  });
  return true;
}

async function saveContactFormToNotion(env: Env, payload: ContactFormBody) {
  if (!env.NOTION_TOKEN || !env.NOTION_LEADS_DB_ID) return false;
  const properties = await filterNotionProperties(env, notionContactFormProperties(payload));
  await notionFetch(env, "/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: env.NOTION_LEADS_DB_ID },
      properties,
    }),
  });
  return true;
}

type SlackBlock = Record<string, unknown>;

function slackText(value: unknown, fallback = "-") {
  if (typeof value !== "string" || !value.trim()) return fallback;
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim()
    .slice(0, 900);
}

function slackMrkdwn(text: string) {
  return { type: "mrkdwn", text };
}

function slackPlainText(text: string) {
  return { type: "plain_text", text: text.slice(0, 150), emoji: true };
}

function slackField(label: string, value: unknown) {
  const text = slackText(value);
  if (text === "-") return undefined;
  return slackMrkdwn(`*${label}*\n${text}`);
}

function slackUrl(url?: string) {
  if (!url) return "";
  try {
    const parsed = new URL(normalizeCompanyUrl(url));
    const href = parsed.toString();
    const label = parsed.hostname.replace(/^www\./, "");
    return `<${href}|${slackText(label)}>`;
  } catch {
    return slackText(url);
  }
}

function slackActionUrl(url?: string) {
  if (!url) return undefined;
  try {
    const normalized = normalizeCompanyUrl(url);
    new URL(normalized);
    return normalized;
  } catch {
    return undefined;
  }
}

function painDisplay(value?: string) {
  if (!value) return "";
  const normalized = normalizePainCategory(value);
  return normalized === "other" && value !== "other" ? value : painLabel(normalized);
}

function stageLabel(stage?: string) {
  const labels: Record<string, string> = {
    opened: "開始",
    url_entered: "URL入力",
    urlEntered: "URL入力",
    analyzed: "3案表示",
    insightsShown: "3案表示",
    pain_answered: "課題選択",
    painPointSelected: "課題選択",
    deepening: "深掘り中",
    deepened: "深掘り完了",
    focusBuilding: "プラン生成中",
    focus_shown: "プラン表示",
    focusShown: "プラン表示",
    booking_click: "予約クリック",
    bookingStarted: "予約クリック",
    email_form_shown: "メール入力表示",
    emailRequested: "メール入力表示",
    contact_captured: "連絡先取得",
    leadCaptured: "連絡先取得",
    enriched: "追加情報取得",
    completed: "完了",
  };
  return stage ? labels[stage] || stage : "";
}

function leadStageEmoji(payload: LeadBody | PartialLeadBody) {
  if (payload.action === "capture_lead") return "✅";
  if (payload.stage === "booking_click" || payload.stage === "bookingStarted") return "🔥";
  if (payload.stage === "focus_shown" || payload.stage === "focusShown") return "🧭";
  return "📝";
}

function leadNextAction(payload: LeadBody | PartialLeadBody) {
  if (payload.action === "capture_lead") {
    return payload.contactMethod === "booking"
      ? "予約導線からの連絡先取得。診断コードを見て初回相談で引き継ぐ。"
      : "診断メール送付後、返信または予約がなければ軽くフォロー。";
  }
  if (payload.stage === "booking_click" || payload.stage === "bookingStarted") {
    return "予約クリック。予約が入らなければ翌営業日に軽く確認。";
  }
  if (payload.stage === "focus_shown" || payload.stage === "focusShown") {
    return "プラン表示済み。連絡先未取得なら今は観測のみ。";
  }
  if (payload.stage === "deepened" || payload.stage === "pain_answered" || payload.stage === "painPointSelected") {
    return "課題回答あり。hot-partial候補として後続行動を確認。";
  }
  return "途中経過。重複時は最新stageだけ見ればよい。";
}

function slackLeadFallback(payload: LeadBody | PartialLeadBody) {
  const title = payload.action === "capture_lead" ? "AI診断 lead captured" : "AI診断 partial lead";
  return [
    `${leadStageEmoji(payload)} ${title}`,
    stageLabel(payload.stage),
    payload.companyUrl ? hostnameFor(payload.companyUrl) : "",
    payload.painPoint ? painDisplay(payload.painPoint) : "",
    payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId),
  ].filter(Boolean).join(" / ");
}

function compactSession(sessionId: string) {
  if (sessionId.length <= 16) return sessionId;
  return `${sessionId.slice(0, 8)}…${sessionId.slice(-6)}`;
}

function slackLeadNotification(payload: LeadBody | PartialLeadBody) {
  const isPartial = payload.action === "partial_lead";
  const diagnosisCode = payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId);
  const title = isPartial ? "AI診断 partial" : "AI診断 lead captured";
  const fields = [
    slackField("Stage", stageLabel(payload.stage)),
    slackField("診断コード", diagnosisCode),
    slackField("URL", slackUrl(payload.companyUrl)),
    slackField("課題", painDisplay(payload.painPoint)),
    slackField("規模", payload.companySize ? companySizeLabel(payload.companySize) : ""),
    slackField("AI活用", payload.aiMaturity ? maturityLabel(payload.aiMaturity) : ""),
    slackField("接点", payload.contactMethod ? contactMethodLabel(payload.contactMethod) : ""),
    slackField("Email", isPartial ? "" : payload.email),
  ].filter(Boolean);
  const detailLines = [
    payload.focusPlan?.restatement ? `*Plan* ${slackText(payload.focusPlan.restatement)}` : "",
    matchedCaseLabel(payload) ? `*Case* ${slackText(matchedCaseLabel(payload))}` : "",
    payload.painPointRaw ? `*Raw pain* ${slackText(payload.painPointRaw)}` : "",
  ].filter(Boolean);
  const context = [
    `source: ${slackText(payload.source)}`,
    `session: ${slackText(compactSession(payload.sessionId))}`,
    payload.utm ? `utm: ${slackText(payload.utm)}` : "",
    payload.referrer ? `referrer: ${slackText(payload.referrer)}` : "",
  ].filter(Boolean).join("  |  ");
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: slackPlainText(`${leadStageEmoji(payload)} ${title}`),
    },
    {
      type: "section",
      text: slackMrkdwn(`*Next*: ${slackText(leadNextAction(payload))}`),
    },
  ];
  if (fields.length) {
    blocks.push({ type: "section", fields });
  }
  if (detailLines.length) {
    blocks.push({ type: "section", text: slackMrkdwn(detailLines.join("\n")) });
  }
  if (payload.companyUrl) {
    const actionUrl = slackActionUrl(payload.companyUrl);
    if (actionUrl) {
      blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: slackPlainText("サイトを開く"),
            url: actionUrl,
          },
        ],
      });
    }
  }
  blocks.push({ type: "context", elements: [slackMrkdwn(context)] });
  return {
    text: slackLeadFallback(payload),
    unfurl_links: false,
    unfurl_media: false,
    blocks,
  };
}

function slackContactFormNotification(payload: ContactFormBody) {
  const type = payload.type || (payload.inquiryType.includes("採用") ? "recruit" : "inquiry");
  const title = type === "recruit" ? "採用問い合わせ" : "通常問い合わせ";
  const fields = [
    slackField("種別", payload.inquiryType),
    slackField("会社", payload.company),
    slackField("お名前", payload.name),
    slackField("Email", payload.email),
    slackField("従業員数", payload.employeeCount),
    slackField("関わり方", payload.involvement),
  ].filter(Boolean);
  const context = [
    `type: ${type}`,
    `consent: ${payload.consent ? "yes" : "no"}`,
    payload.utm ? `utm: ${slackText(payload.utm)}` : "",
    payload.referrer ? `referrer: ${slackText(payload.referrer)}` : "",
  ].filter(Boolean).join("  |  ");
  return {
    text: `${title}: ${payload.name || payload.email}`,
    unfurl_links: false,
    unfurl_media: false,
    blocks: [
      { type: "header", text: slackPlainText(`📩 ${title}`) },
      { type: "section", fields },
      { type: "section", text: slackMrkdwn(`*内容*\n${slackText(payload.message, "内容なし")}`) },
      { type: "context", elements: [slackMrkdwn(context)] },
    ],
  };
}

async function notifySlack(env: Env, payload: LeadBody | PartialLeadBody) {
  if (!env.SLACK_WEBHOOK_URL) return false;
  const isPartial = payload.action === "partial_lead";
  const notifyPartial = env.SLACK_NOTIFY_PARTIAL_LEADS?.toLowerCase() === "true";
  if (isPartial && !notifyPartial) return false;

  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slackLeadNotification(payload)),
  });
  if (!response.ok) throw new Error(`Slack webhook failed: ${response.status}`);
  return true;
}

async function notifyContactFormSlack(env: Env, payload: ContactFormBody) {
  if (!env.SLACK_WEBHOOK_URL) return false;

  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slackContactFormNotification(payload)),
  });
  if (!response.ok) throw new Error(`Slack webhook failed: ${response.status}`);
  return true;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function companyNameForLead(payload: LeadBody) {
  return payload.companyUrl ? hostnameFor(payload.companyUrl) : "御社";
}

function leadHypotheses(payload: LeadBody) {
  const lines = (payload.proposedCases || "")
    .split(/\n+|。/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);
  if (lines.length) return lines;
  if (payload.focusPlan) return payload.focusPlan.steps.map((step) => `${step.phase}: ${step.action}`).slice(0, 3);
  return [
    "問い合わせ前の不安を減らす導線を作る",
    "一次対応や定型確認を整理する",
    "既存ツールに合わせて小さく実装する",
  ];
}

function diagnosisEmailContent(env: Env, payload: LeadBody) {
  const diagnosisCode = payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId);
  const companyName = companyNameForLead(payload);
  const bookingUrl = env.BOOKING_URL || DEFAULT_BOOKING_URL;
  const focusPlan = payload.focusPlan;
  const matchedCase = payload.matchedCase;
  const hypotheses = leadHypotheses(payload);
  const subject = `【honkoma】${companyName}のAI活用診断メモ`;
  const planItems = focusPlan?.steps || [
    { phase: "整理", action: "最初にAIへ任せる業務範囲を決めます。" },
    { phase: "試作", action: "既存のフォームやSlack/Notionに合わせて小さく試します。" },
    { phase: "運用化", action: "人が確認する範囲を残しながら改善します。" },
  ];
  const text = [
    `${companyName}のAI活用診断メモ`,
    "",
    `診断コード: ${diagnosisCode}`,
    "",
    "3つの仮説",
    ...hypotheses.map((item) => `- ${item}`),
    "",
    "課題特化の進め方",
    ...(focusPlan ? [
      focusPlan.restatement,
      ...planItems.map((step) => `- ${step.phase}: ${step.action}`),
      `honkoma: ${focusPlan.roles.honkoma}`,
      `御社: ${focusPlan.roles.client}`,
      `確認事項: ${focusPlan.agenda.join(" / ")}`,
      `注意点: ${focusPlan.riskNote}`,
    ] : planItems.map((step) => `- ${step.phase}: ${step.action}`)),
    "",
    matchedCase ? [
      "匿名事例",
      matchedCase.title,
      matchedCase.situation,
      matchedCase.approach,
      matchedCase.outcome,
      matchedCase.duration,
    ].filter(Boolean).join("\n") : "近い匿名事例は、壁打ちの中で状況に合わせてご紹介します。",
    "",
    `30分相談: ${bookingUrl}`,
    "予約フォームのご相談内容欄に診断コードを記載してください。",
    "",
    "この診断は公開情報と入力内容に基づく仮説です。実装可否や優先順位は、業務詳細を確認して調整します。",
  ].join("\n");

  const html = `
<!doctype html>
<html lang="ja">
  <body style="margin:0;background:#f6f8fb;color:#17202a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;">
    <main style="max-width:680px;margin:0 auto;padding:28px 20px;background:#ffffff;">
      <p style="font-size:12px;color:#1d5fa7;font-weight:700;margin:0 0 8px;">AI Diagnosis</p>
      <h1 style="font-size:22px;line-height:1.4;margin:0 0 16px;">${escapeHtml(companyName)}のAI活用診断メモ</h1>
      <p style="margin:0 0 20px;">診断コード: <strong>${escapeHtml(diagnosisCode)}</strong></p>

      <h2 style="font-size:16px;margin:28px 0 10px;">3つの仮説</h2>
      <ul style="padding-left:20px;margin:0;">${hypotheses.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

      <h2 style="font-size:16px;margin:28px 0 10px;">課題特化の進め方</h2>
      ${focusPlan ? `<p>${escapeHtml(focusPlan.restatement)}</p>` : ""}
      <ol style="padding-left:20px;margin:0;">${planItems.map((step) => (
        `<li><strong>${escapeHtml(step.phase)}</strong>: ${escapeHtml(step.action)}</li>`
      )).join("")}</ol>
      ${focusPlan ? `
      <p><strong>honkoma側</strong>: ${escapeHtml(focusPlan.roles.honkoma)}</p>
      <p><strong>御社側</strong>: ${escapeHtml(focusPlan.roles.client)}</p>
      <p><strong>壁打ちで確認すること</strong>: ${escapeHtml(focusPlan.agenda.join(" / "))}</p>
      <p><strong>注意点</strong>: ${escapeHtml(focusPlan.riskNote)}</p>
      ` : ""}

      <h2 style="font-size:16px;margin:28px 0 10px;">匿名事例</h2>
      ${matchedCase ? `
        <p><strong>${escapeHtml(matchedCase.title)}</strong></p>
        <p>${escapeHtml(matchedCase.situation)}</p>
        <p>${escapeHtml(matchedCase.approach)}</p>
        <p>${escapeHtml(matchedCase.outcome)}</p>
        <p>${escapeHtml(matchedCase.duration)}</p>
      ` : `<p>近い匿名事例は、壁打ちの中で状況に合わせてご紹介します。</p>`}

      <h2 style="font-size:16px;margin:28px 0 10px;">壁打ちのご案内</h2>
      <p>30分の相談では、この診断コードの内容から始めます。予約フォームのご相談内容欄に <strong>${escapeHtml(diagnosisCode)}</strong> を記載してください。</p>
      <p><a href="${escapeHtml(bookingUrl)}" style="color:#0f5ea8;">30分相談を予約する</a></p>

      <hr style="border:none;border-top:1px solid #e5e9f0;margin:28px 0;" />
      <p style="font-size:12px;color:#667085;">この診断は公開情報と入力内容に基づく仮説です。実装可否や優先順位は、業務詳細を確認して調整します。</p>
    </main>
  </body>
</html>`.trim();

  return { subject, text, html };
}

function emailFrom(env: Env) {
  return env.EMAIL_FROM || "diagnosis@ltdhonkoma.com";
}

function emailTransportConfigured(env: Env) {
  return Boolean(
    env.EMAIL ||
    (env.CLOUDFLARE_ACCOUNT_ID && (env.CLOUDFLARE_EMAIL_API_TOKEN || env.CLOUDFLARE_API_TOKEN)) ||
    env.RESEND_API_KEY,
  );
}

async function sendDiagnosisEmail(env: Env, payload: LeadBody) {
  if (!payload.email || !payload.consent || !emailTransportConfigured(env)) return false;

  const fromEmail = emailFrom(env);
  const fromName = env.EMAIL_FROM_NAME || "honkoma";
  const replyTo = env.EMAIL_REPLY_TO || fromEmail;
  const content = diagnosisEmailContent(env, payload);

  if (env.EMAIL) {
    await env.EMAIL.send({
      to: payload.email,
      from: { email: fromEmail, name: fromName },
      replyTo: { email: replyTo, name: fromName },
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    return true;
  }

  if (env.CLOUDFLARE_ACCOUNT_ID && (env.CLOUDFLARE_EMAIL_API_TOKEN || env.CLOUDFLARE_API_TOKEN)) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN || env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: { email: fromEmail, name: fromName },
          to: [{ email: payload.email }],
          reply_to: { email: replyTo, name: fromName },
          subject: content.subject,
          html: content.html,
          text: content.text,
        }),
      },
    );
    if (!response.ok) throw new Error(`Cloudflare Email send failed: ${response.status}`);
    return true;
  }

  if (env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [payload.email],
        reply_to: replyTo,
        subject: content.subject,
        html: content.html,
        text: content.text,
      }),
    });
    if (!response.ok) throw new Error(`Resend email failed: ${response.status}`);
    return true;
  }

  return false;
}

function queueDiagnosisEmail(env: Env, payload: LeadBody, ctx?: WorkerExecutionContext) {
  if (payload.action !== "capture_lead" || !payload.email || !payload.consent || !emailTransportConfigured(env)) {
    return false;
  }
  const task = sendDiagnosisEmail(env, payload).catch((error) => {
    console.error(JSON.stringify({
      event: "diagnosis_email_failed",
      sessionId: payload.sessionId,
      error: error instanceof Error ? error.message : "unknown error",
    }));
  });
  if (ctx) {
    ctx.waitUntil(task);
    return true;
  }
  return false;
}

async function persistContactForm(env: Env, payload: ContactFormBody) {
  const dryRun = !env.NOTION_TOKEN && !env.SLACK_WEBHOOK_URL;
  const result = {
    ok: true,
    dryRun,
    notionSaved: false,
    slackNotified: false,
    emailSent: false,
    integrationErrors: [] as string[],
  };

  const [notionResult, slackResult] = await Promise.allSettled([
    saveContactFormToNotion(env, payload),
    notifyContactFormSlack(env, payload),
  ]);

  if (notionResult.status === "fulfilled") {
    result.notionSaved = notionResult.value;
  } else {
    result.integrationErrors.push(
      notionResult.reason instanceof Error ? notionResult.reason.message : "Contact form Notion save failed",
    );
  }

  if (slackResult.status === "fulfilled") {
    result.slackNotified = slackResult.value;
  } else {
    result.integrationErrors.push(
      slackResult.reason instanceof Error ? slackResult.reason.message : "Contact form Slack notification failed",
    );
  }

  if (!dryRun && !result.notionSaved && !result.slackNotified) {
    result.ok = false;
  }

  return result;
}

async function persistLead(env: Env, payload: LeadBody | PartialLeadBody, ctx?: WorkerExecutionContext) {
  const dryRun = !env.NOTION_TOKEN && !env.SLACK_WEBHOOK_URL;
  const result = {
    ok: true,
    dryRun,
    notionSaved: false,
    slackNotified: false,
    emailSent: false,
    integrationErrors: [] as string[],
  };

  const [notionResult, slackResult] = await Promise.allSettled([
    upsertNotionLead(env, payload),
    notifySlack(env, payload),
  ]);

  if (notionResult.status === "fulfilled") {
    result.notionSaved = notionResult.value;
  } else {
    result.integrationErrors.push(
      notionResult.reason instanceof Error ? notionResult.reason.message : "Notion save failed",
    );
  }

  if (slackResult.status === "fulfilled") {
    result.slackNotified = slackResult.value;
  } else {
    result.integrationErrors.push(
      slackResult.reason instanceof Error ? slackResult.reason.message : "Slack notification failed",
    );
  }

  if (!dryRun && !result.notionSaved && !result.slackNotified) {
    result.ok = false;
  }

  if (payload.action === "capture_lead" && result.ok) {
    result.emailSent = queueDiagnosisEmail(env, payload, ctx);
  }

  return result;
}

async function handleAnalyze(body: AnalyzeBody, env: Env) {
  const companyUrl = normalizeCompanyUrl(body.companyUrl);
  try {
    const websiteText = await fetchWebsiteText(companyUrl);
    const analysis = await callDeepSeek(env, companyUrl, websiteText);
    return { ok: true, analysis };
  } catch (error) {
    const message = error instanceof Error ? error.message : "analysis failed";
    return {
      ok: false,
      error: message,
      fallbackAnalysis: mockAnalysis(companyUrl, message),
    };
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: WorkerExecutionContext): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || (url.pathname !== "/" && url.pathname !== "/api/ai-chat")) {
      return jsonResponse({ ok: false, error: "Not found" }, request, env, 404);
    }

    try {
      const body = await request.json() as AnalyzeBody | DeepenBody | LeadBody | PartialLeadBody | ContactFormBody;
      if (body.action === "analyze") {
        const result = await handleAnalyze(body, env);
        return jsonResponse(result, request, env);
      }

      if (body.action === "deepen") {
        const result = await handleDeepen(body, env);
        return jsonResponse(result, request, env);
      }

      if (body.action === "contact_form") {
        const result = await persistContactForm(env, {
          ...body,
          timestamp: body.timestamp || new Date().toISOString(),
        });
        return jsonResponse(result, request, env);
      }

      if (body.action === "capture_lead" || body.action === "partial_lead") {
        const result = await persistLead(env, {
          ...body,
          timestamp: body.timestamp || new Date().toISOString(),
        }, ctx);
        return jsonResponse(result, request, env);
      }

      return jsonResponse({ ok: false, error: "Unknown action" }, request, env, 400);
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error instanceof Error ? error.message : "Unhandled error" },
        request,
        env,
        500,
      );
    }
  },
};
