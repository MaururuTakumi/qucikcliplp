type Env = {
  DEEPSEEK_API_KEY?: string;
  XAI_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  MATERIAL_APPROVAL_ENABLED?: string;
  SLACK_BOT_TOKEN?: string;
  SLACK_SIGNING_SECRET?: string;
  SLACK_APPROVAL_CHANNEL_ID?: string;
  SLACK_APPROVER_IDS?: string;
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
  LEAD_MATERIALS?: MaterialKVNamespace;
};

type MaterialKVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
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
  landingPath?: string;
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
  landingPath?: string;
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
  landingPath?: string;
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

type MaterialVariant = "normal" | "booked_confirmed" | "booking_in_progress" | "other_channel";
type MaterialStatus =
  | "generating"
  | "pending"
  | "revising"
  | "approved_sending"
  | "sent"
  | "discarded"
  | "failed";

type MaterialScene = {
  title: string;
  current: string;
  withAi: string;
  firstMove: string;
};

type MaterialDraft = {
  schemaVersion: "1.0";
  opening: string;
  scenes: MaterialScene[];
  firstStep: string;
  caseConnection?: string;
  meetingTopics: string[];
};

type MaterialDraftEntry = {
  rev: number;
  mode: "model" | "fallback" | "failed";
  draft?: MaterialDraft;
  instruction?: string;
  createdAt: string;
  warning?: string;
};

type MaterialOverlap = {
  booked: boolean;
  bookingClick: boolean;
  sameEmail: boolean;
  sameDomain: boolean;
  matchedLeadUrl?: string;
};

type MaterialRecord = {
  status: MaterialStatus;
  rev: number;
  variant: MaterialVariant;
  variantSuggested: MaterialVariant;
  overlap: MaterialOverlap;
  context: LeadBody;
  drafts: MaterialDraftEntry[];
  slack?: { channel: string; ts: string };
  slackWebhookOnly?: boolean;
  slackWebhookCardPosted?: boolean;
  slackResponseUrl?: string;
  approvedBy?: string;
  approvalRunId?: string;
  sentAt?: string;
  discardedBy?: string;
  failedPhase?: "generation" | "send" | "flow";
  failedError?: string;
  createdAt: string;
  updatedAt: string;
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
const MATERIAL_TTL_SECONDS = 60 * 60 * 24 * 90;
const MATERIAL_MAX_REVISIONS = 3;

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

function htmlAttr(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

/**
 * meta(title/description/og:title/og:description)とJSON-LD(Organization/LocalBusiness の
 * name/description)を抽出し、text先頭に連結する用の短い文字列を作る（D方針）。
 * fetch薄（HTML本文がSPA等でスカスカ）でも、metaだけは実在情報として観測に使える。
 */
function extractMetaAndJsonLd(html: string): string {
  const parts: string[] = [];
  const title = htmlAttr(html, /<title[^>]*>([^<]*)<\/title>/i);
  if (title) parts.push(title);
  const description = htmlAttr(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (description) parts.push(description);
  const ogTitle = htmlAttr(html, /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
  if (ogTitle) parts.push(ogTitle);
  const ogDescription = htmlAttr(html, /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  if (ogDescription) parts.push(ogDescription);

  const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of jsonLdBlocks) {
    const inner = block.replace(/^[\s\S]*?>/, "").replace(/<\/script>$/i, "");
    try {
      const parsed = JSON.parse(inner.trim());
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      for (const candidate of candidates) {
        const type = typeof candidate?.["@type"] === "string" ? candidate["@type"] : "";
        if (/Organization|LocalBusiness/i.test(type)) {
          if (typeof candidate.name === "string") parts.push(candidate.name);
          if (typeof candidate.description === "string") parts.push(candidate.description);
        }
      }
    } catch {
      // JSON-LDが壊れている場合は無視する。
    }
  }
  return parts.filter(Boolean).join(" ");
}

async function fetchRawHtml(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
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
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

const SUBPAGE_CANDIDATES = ["/company", "/about", "/service", "/recruit"];

function japaneseCharCount(text: string) {
  return (text.match(/[ぁ-んァ-ヶ一-龠]/g) || []).length;
}

async function fetchSubpageText(baseUrl: string, path: string): Promise<string> {
  try {
    const target = new URL(path, baseUrl).toString();
    const html = await fetchRawHtml(target, 3000);
    return stripHtml(html);
  } catch {
    return "";
  }
}

type WebsiteTextResult = { text: string; thin: boolean };

/**
 * メインページ取得→meta/JSON-LDをtext先頭に連結→日本語400字未満ならサブページを最大2本追加取得。
 * thin(300字未満)フラグを返す。スキーマは変えない（呼び出し側でtext/thinを取り出して使う）。
 */
async function fetchWebsiteText(companyUrl: string): Promise<WebsiteTextResult> {
  const safeUrl = assertPublicHttpUrl(companyUrl);
  const html = await fetchRawHtml(safeUrl, 7000);
  const metaText = extractMetaAndJsonLd(html);
  const bodyText = stripHtml(html);
  let combined = [metaText, bodyText].filter(Boolean).join(" ").trim();

  if (japaneseCharCount(combined) < 400) {
    let subpagesFetched = 0;
    for (const path of SUBPAGE_CANDIDATES) {
      if (subpagesFetched >= 2) break;
      const subText = await fetchSubpageText(safeUrl, path);
      if (subText) {
        combined = `${combined} ${subText}`.trim();
        subpagesFetched += 1;
      }
      if (japaneseCharCount(combined) >= 400) break;
    }
  }

  const text = combined.slice(0, 9000);
  return { text, thin: text.length < 300 };
}

type IndustryKey =
  | "construction"
  | "healthcare"
  | "retail"
  | "professional"
  | "manufacturing"
  | "it"
  | "hospitality"
  | "generic";

type SiteFacts = {
  domain: string;
  industry: IndustryKey;
  industryLabel: string;
  industryConfident: boolean;
  signals: string[];
  specificTerms: string[];
  hasMultipleChannels: boolean;
  hasRecruitingSignal: boolean;
  hasContentAsset: boolean;
  hasDataScatteringSignal: boolean;
};

/**
 * strong = その業種にほぼ固有の語（他業種にまず出ない）。weak = 業種に寄せるが他業種でも出うる語。
 * 「予約」「事例」「実績」「DX」「システム」は業種を跨いで頻出し誤爆源になるため、
 * どの業種のstrong/weakからも除外する（B方針）。signalRules側には残してよい。
 */
const industryRules: Array<{ key: IndustryKey; label: string; strong: RegExp; weak: RegExp }> = [
  {
    key: "construction",
    label: "建設・施工",
    strong: /建設業|工務店|施工管理|注文住宅|リフォーム|外壁塗装|内装工事/g,
    weak: /建設|施工|工事|現場|職人|外壁|内装/g,
  },
  {
    key: "healthcare",
    label: "医療・介護",
    strong: /クリニック|歯科医院|病院|レセプト|看護師|診療科|訪問介護|デイサービス/g,
    weak: /医療|介護|福祉|診療|治療|通院|入院/g,
  },
  {
    key: "retail",
    label: "小売・EC",
    strong: /オンラインショップ|通信販売|ネットショップ|在庫管理|ショッピングカート/g,
    weak: /EC|通販|小売|店舗|在庫|商品|レビュー|購入|カート/g,
  },
  {
    key: "professional",
    label: "士業・専門サービス",
    strong: /税理士|社会保険労務士|社労士|行政書士|弁護士|公認会計士/g,
    weak: /士業|法律|会計|顧問|コンサル/g,
  },
  {
    key: "manufacturing",
    label: "製造・BtoB",
    strong: /製造業|工場|生産ライン|部品加工|図面|品質管理/g,
    weak: /製造|生産|部品|加工|設備|BtoB/g,
  },
  {
    key: "it",
    label: "IT・SaaS",
    strong: /SaaS|クラウドサービス|ソフトウェア開発|API連携/g,
    weak: /ソフトウェア|クラウド|API|エンジニア|開発/g,
  },
  {
    key: "hospitality",
    label: "宿泊・観光",
    strong: /ホテル|旅館|客室|インバウンド|多言語対応/g,
    weak: /宿泊|観光|旅行|客室|多言語/g,
  },
];

const signalRules: Array<{ signal: string; terms: string[]; pattern: RegExp }> = [
  { signal: "施工事例・実績を掲載", terms: ["施工事例"], pattern: /施工事例|施工実績/ },
  { signal: "導入事例を掲載", terms: ["導入事例"], pattern: /導入事例/ },
  { signal: "症例・診療メニューを掲載", terms: ["症例", "診療メニュー"], pattern: /症例|診療メニュー|診療案内|初診|治療/ },
  { signal: "商品・レビュー情報を掲載", terms: ["商品", "レビュー"], pattern: /商品|レビュー|口コミ|購入|カート|オンラインショップ/ },
  { signal: "料金・見積もり導線あり", terms: ["料金", "見積もり"], pattern: /料金|価格|費用|見積|お見積もり/ },
  { signal: "電話窓口を掲載", terms: ["電話"], pattern: /電話|TEL|tel:|Call|お問い合わせ番号/ },
  { signal: "フォーム窓口を掲載", terms: ["フォーム"], pattern: /フォーム|お問い合わせ|問合せ|資料請求|contact/ },
  { signal: "LINE導線あり", terms: ["LINE"], pattern: /LINE|ライン/ },
  { signal: "採用・募集ページあり", terms: ["採用", "募集"], pattern: /採用|募集|求人|キャリア|recruit/ },
  { signal: "FAQ・よくある質問を掲載", terms: ["FAQ"], pattern: /FAQ|よくある質問|Q&A|Q＆A/ },
  { signal: "お知らせ・ブログを運用", terms: ["お知らせ", "ブログ"], pattern: /お知らせ|ニュース|NEWS|ブログ|コラム/ },
  { signal: "店舗・拠点情報を掲載", terms: ["店舗", "拠点"], pattern: /店舗|拠点|支店|営業所|対応エリア|アクセス/ },
  { signal: "Excel・紙の管理語がある", terms: ["Excel", "紙"], pattern: /Excel|エクセル|スプレッドシート|紙|台帳|帳票/ },
];

function distinctMatchCount(text: string, pattern: RegExp) {
  const flagged = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
  const matches = text.match(flagged) || [];
  return new Set(matches).size;
}

/**
 * score = 2×strong distinct matches + 1×weak distinct matches。
 * 採用条件: score>=3 かつ 1位と2位の差>=2。満たさなければgeneric（B方針・過剰確信の防止）。
 */
function detectIndustryFromText(text: string): { key: IndustryKey; label: string; confident: boolean } {
  const scored = industryRules
    .map((rule) => ({
      rule,
      score: 2 * distinctMatchCount(text, rule.strong) + 1 * distinctMatchCount(text, rule.weak),
    }))
    .sort((left, right) => right.score - left.score);
  const top = scored[0];
  const second = scored[1];
  const confident = Boolean(top && top.score >= 3 && (!second || top.score - second.score >= 2));
  if (!confident || !top) return { key: "generic", label: "公開サイト", confident: false };
  return { key: top.rule.key, label: top.rule.label, confident: true };
}

function compactSignal(signal: string) {
  return signal
    .replace(/を確認/g, "")
    .replace(/確認/g, "")
    .replace(/\s+/g, "")
    .trim()
    .slice(0, 40);
}

function analyzeSiteFacts(companyUrl: string, websiteText = ""): SiteFacts {
  const domain = hostnameFor(companyUrl);
  const text = `${domain} ${websiteText}`;
  const industry = detectIndustryFromText(text);
  const matchedSignals = signalRules.filter((rule) => rule.pattern.test(text));
  const signals = [...new Set(matchedSignals.map((rule) => compactSignal(rule.signal)))].slice(0, 4);
  if (!signals.length) {
    signals.push(`${domain}の公開サイト`, `${industry.label}の事業情報を掲載`);
  }
  const channelCount = [
    /電話|TEL|tel:/i.test(text),
    /フォーム|お問い合わせ|問合せ|資料請求|contact/i.test(text),
    /LINE|ライン/.test(text),
    /Instagram|インスタ|X\b|Twitter|Facebook|SNS/.test(text),
  ].filter(Boolean).length;
  const specificTerms = [
    industry.label,
    ...matchedSignals.flatMap((rule) => rule.terms),
    ...signals,
    domain,
  ].filter(Boolean);
  return {
    domain,
    industry: industry.key,
    industryLabel: industry.label,
    industryConfident: industry.confident,
    signals,
    specificTerms: [...new Set(specificTerms)].slice(0, 12),
    hasMultipleChannels: channelCount >= 2 || /複数|多店舗|各店舗|チャネル|媒体|SNS/.test(text),
    hasRecruitingSignal: /採用|募集|求人|キャリア|recruit/.test(text),
    hasContentAsset: /施工事例|症例|実績|ブログ|コラム|FAQ|レビュー|導入事例/.test(text),
    hasDataScatteringSignal: /Excel|エクセル|スプレッドシート|紙|台帳|複数|媒体|チャネル|店舗|拠点|記録/.test(text),
  };
}

/**
 * テレメトリ＋retryトリガ専用（差し替え判定には使わない）。
 * facts.specificTerms はプロンプトテンプレ内の語彙も含むため、これで「サイト由来かどうか」を
 * 判定して丸ごと差し替えると、業種テンプレの語がヒットして無関係な差し替えが起きる（B/eval参照）。
 * サイト由来かどうかの実判定は textMatchesWebsiteText で websiteText に直接照合する。
 */
function containsSiteCue(text: string, facts: SiteFacts) {
  return facts.specificTerms.some((term) => term.length >= 2 && text.includes(term));
}

/** 文中の語が実際にwebsiteTextへ出現するか（差し替え判定はこちらを使う）。短い共通語は除外。 */
function textMatchesWebsiteText(text: string, websiteText: string) {
  if (!websiteText) return false;
  const candidates = text.match(/[一-龠ぁ-んァ-ヶA-Za-z0-9]{2,}/g) || [];
  return candidates.some((token) => token.length >= 2 && websiteText.includes(token));
}

function proposalAssetLabel(signal: string) {
  return signal
    .replace(/を掲載$/g, "")
    .replace(/を運用$/g, "")
    .replace(/あり$/g, "")
    .trim();
}

/**
 * 業種ごとに asset 補間で使ってよい signal 原文のホワイトリスト（C方針）。
 * ここにない signal は業種テンプレの asset に使わない（他業種の資産語が紛れ込むのを防ぐ）。
 * generic は業種非依存資産（FAQ/フォーム/採用/お知らせ）に限定する。
 */
const industryAssetWhitelist: Record<IndustryKey, string[]> = {
  construction: ["施工事例・実績を掲載", "導入事例を掲載", "店舗・拠点情報を掲載", "FAQ・よくある質問を掲載"],
  healthcare: ["症例・診療メニューを掲載", "FAQ・よくある質問を掲載", "店舗・拠点情報を掲載"],
  retail: ["商品・レビュー情報を掲載", "料金・見積もり導線あり", "FAQ・よくある質問を掲載"],
  professional: ["導入事例を掲載", "FAQ・よくある質問を掲載", "料金・見積もり導線あり"],
  manufacturing: ["導入事例を掲載", "料金・見積もり導線あり", "FAQ・よくある質問を掲載"],
  it: ["導入事例を掲載", "FAQ・よくある質問を掲載", "料金・見積もり導線あり"],
  hospitality: ["店舗・拠点情報を掲載", "FAQ・よくある質問を掲載", "お知らせ・ブログを運用"],
  generic: ["FAQ・よくある質問を掲載", "フォーム窓口を掲載", "採用・募集ページあり", "お知らせ・ブログを運用"],
};

const genericAssetFallback = "公開情報";

function whitelistedAsset(facts: SiteFacts): string {
  const allowed = industryAssetWhitelist[facts.industry] || industryAssetWhitelist.generic;
  // facts.signalsは既にcompactSignal済みなので、ホワイトリストのsignal原文もcompactSignalして比較する。
  const compactAllowed = allowed.map((entry) => compactSignal(entry));
  const hit = facts.signals.find((signal) => compactAllowed.includes(signal));
  return proposalAssetLabel(hit || genericAssetFallback);
}

function fallbackProposalSet(facts: SiteFacts): AiProposal[] {
  const asset = whitelistedAsset(facts);
  const channel = facts.hasMultipleChannels ? "電話・フォーム・LINEなど複数窓口" : "問い合わせ窓口";
  const templates: Record<IndustryKey, AiProposal[]> = {
    construction: [
      {
        axis: "top_line",
        title: `${asset}を、見積もり前の相談窓口に変える`,
        body: `${asset}は、相談前の不安をほどく材料になります。事例の文脈で概算条件を聞き取るAI窓口を置き、電話をためらう層の受け皿を作ります。`,
        rationale: `${asset}と${channel}から。`,
      },
      {
        axis: "bottom_line",
        title: "日報・写真・発注書類をAIに引き取らせる",
        body: `現場と事務所の往復では、写真整理や書類下書きが重くなりがちです。AIに転記と仕分けを寄せ、人の時間を現場判断に返します。`,
        rationale: "建設・施工系の現場業務語から。",
      },
      {
        axis: "fde",
        title: `${channel}を、ひとつのデータ基盤にまとめる`,
        body: `問い合わせと現場記録が分かれると、次の一手が経験頼みになります。AIが読める基盤に集め、過去案件を誰でも引ける状態を作ります。`,
        rationale: `${channel}と記録分散の構造から。`,
      },
    ],
    healthcare: [
      {
        axis: "top_line",
        title: "予約前・利用前の不安を、AIの事前相談で受け止める",
        body: `${asset}は、来院・利用を検討する方の判断材料になります。予約や申し込みの前に浮かぶ疑問をAIが先に受け、相談への一歩を後押しします。`,
        rationale: `${asset}と予約・申し込み導線から。`,
      },
      {
        axis: "bottom_line",
        title: "予約変更・書類案内をAIに寄せる",
        body: `医療・介護の現場では、定型の案内や確認が繰り返し発生します。予約変更、持ち物、書類の初動をAIが受け、スタッフは人の判断が要る対応に集中します。`,
        rationale: "予約・案内まわりの業務語から。",
      },
      {
        axis: "fde",
        title: "予約・記録・FAQを共通データに整える",
        body: `予約、問い合わせ、FAQが分かれると回答の質が担当者に寄ります。AIが読める共通基盤に整え、誰が対応しても同じ水準の案内ができる状態にします。`,
        rationale: "予約導線とFAQ資産から。",
      },
    ],
    retail: [
      {
        axis: "top_line",
        title: `${asset}を、接客前の比較相談に変える`,
        body: `${asset}は購入前の迷いをほどく材料です。AIが用途や予算を聞き取り、商品選びの相談を問い合わせ前に受け止めます。`,
        rationale: `${asset}と商品情報から。`,
      },
      {
        axis: "bottom_line",
        title: "受注・在庫・問い合わせの定型対応を減らす",
        body: `小売・ECでは、配送、在庫、返品の確認が繰り返されます。AIが初動を受け、担当者は例外対応と接客に時間を戻します。`,
        rationale: "商品・購入導線の業務語から。",
      },
      {
        axis: "fde",
        title: "店舗・EC・SNSの数字を一つに集める",
        body: `チャネルごとに数字が分かれると、売れ筋の判断が遅れます。AIが読める基盤に集め、販促と接客の判断を揃えます。`,
        rationale: "商品情報と複数チャネルの構造から。",
      },
    ],
    professional: [
      {
        axis: "top_line",
        title: `${asset}を、相談前の迷いをほどく入口にする`,
        body: `${asset}は専門性を伝える材料になります。AIが「聞いてよいか分からない」相談を受け、初回面談につながる論点を整えます。`,
        rationale: `${asset}と相談導線から。`,
      },
      {
        axis: "bottom_line",
        title: "定型調査・書類ドラフトをAIに寄せる",
        body: `士業・専門サービスでは、事前確認と書類準備が積み重なります。AIが初稿と確認項目を作り、人は判断と助言に集中します。`,
        rationale: "相談・書類準備の業務語から。",
      },
      {
        axis: "fde",
        title: "過去相談とナレッジをAIが引ける形にする",
        body: `回答が人の記憶に残ると、品質が担当者に寄ります。相談ログとナレッジを基盤化し、全員がAIで引ける状態を作ります。`,
        rationale: "専門相談とナレッジ属人化の構造から。",
      },
    ],
    manufacturing: [
      {
        axis: "top_line",
        title: `${asset}を、技術問い合わせの一次対応に使う`,
        body: `${asset}は検討前の判断材料になります。AIが用途、仕様、数量を聞き取り、営業や技術者へ渡す前の情報を揃えます。`,
        rationale: `${asset}と技術問い合わせの業務語から。`,
      },
      {
        axis: "bottom_line",
        title: "見積もり・図面・帳票の下準備をAIに寄せる",
        body: `製造・BtoBでは、見積もり前の確認が何度も発生します。AIが条件整理と帳票下書きを受け、人は技術判断に集中します。`,
        rationale: "見積もり・図面・帳票の語から。",
      },
      {
        axis: "fde",
        title: "基幹データと問い合わせをAIにつなぐ",
        body: `仕様、在庫、問い合わせが分かれると、回答が経験頼みになります。AIが読める基盤に接続し、過去案件を使える状態にします。`,
        rationale: "製造データと問い合わせの分散から。",
      },
    ],
    it: [
      {
        axis: "top_line",
        title: `${asset}を、デモ前の見込み整理に使う`,
        body: `${asset}は導入検討の入口になります。AIが課題、規模、既存環境を聞き取り、商談前に温度感と論点を整えます。`,
        rationale: `${asset}とIT・SaaSの導入検討語から。`,
      },
      {
        axis: "bottom_line",
        title: "サポートと社内ナレッジの反復回答を減らす",
        body: `ITサービスでは、同じ質問がサポートと社内に重なりがちです。AIが一次回答を担い、人は設計や例外対応に集中します。`,
        rationale: "サポート・ナレッジの業務語から。",
      },
      {
        axis: "fde",
        title: "顧客データをAIが読める基盤に集める",
        body: `利用状況、問い合わせ、商談情報が分かれると改善点が見えにくくなります。AIが横断して読める基盤を作ります。`,
        rationale: "顧客データと問い合わせの分散から。",
      },
    ],
    hospitality: [
      {
        axis: "top_line",
        title: `${asset}を、予約前質問の受け皿にする`,
        body: `${asset}は予約前の期待値を作る材料です。AIが空き、設備、周辺情報の質問を受け、迷っている客の相談を拾います。`,
        rationale: `${asset}と予約導線から。`,
      },
      {
        axis: "bottom_line",
        title: "予約変更・定型連絡をAIに寄せる",
        body: `宿泊・観光では、変更、確認、多言語の連絡が積み上がります。AIが初動を受け、スタッフは現場対応に集中します。`,
        rationale: "予約・多言語対応の業務語から。",
      },
      {
        axis: "fde",
        title: "口コミ・料金・稼働データを一つに見る",
        body: `口コミ、料金、稼働が別々だと打ち手が経験頼みになります。AIが読める基盤に集め、判断材料を一つに揃えます。`,
        rationale: "予約と口コミ・稼働データの構造から。",
      },
    ],
    generic: [
      {
        axis: "top_line",
        title: `${asset}を、問い合わせ前の相談入口に変える`,
        body: `${asset}から、訪問者が事前に知りたい情報が見えます。AIが状況を聞き取り、相談前の迷いを減らす入口を作ります。`,
        rationale: `${asset}から。`,
      },
      {
        axis: "bottom_line",
        title: "よくある確認と初動対応をAIに寄せる",
        body: `問い合わせの初動には、同じ確認が繰り返し出ます。AIが要件と質問を先に受け、人は判断が必要な会話に集中します。`,
        rationale: "問い合わせ導線の構造から。",
      },
      {
        axis: "fde",
        title: `${channel}を、AIが読める基盤にまとめる`,
        body: `窓口や記録が分かれると、対応の質が人の記憶に寄ります。AIが読める一つの基盤に集め、次の対応へ使える状態にします。`,
        rationale: `${channel}から。`,
      },
    ],
  };
  return templates[facts.industry];
}

function mockAnalysis(companyUrl: string, reason?: string, websiteText = ""): AiChatAnalysis {
  const facts = analyzeSiteFacts(companyUrl, websiteText);
  const proposals = fallbackProposalSet(facts);
  return {
    companyName: facts.domain,
    analyzedSummary: `${facts.domain} は、${facts.signals.slice(0, 2).join("、")}という公開情報があります。${proposals[0].title}余地がありそうです。`,
    signals: facts.signals.slice(0, 4),
    proposals,
    reportTeaser:
      reason
        ? `ローカル診断で継続しました。課題を1つ選ぶと、御社の体制に合わせた進め方まで具体化します。`
        : "課題を1つ選んでいただければ、御社の体制に合わせた進め方まで具体化します。",
    shareUrl: `https://ltdhonkoma.com/contact?ai_chat=${encodeURIComponent(facts.domain)}`,
    mode: "mock",
  };
}

/**
 * fetch薄（websiteTextが120字未満）のときの誠実generic mock（D方針）。
 * 業種断定をしない・neutralAxisText（業種非依存の固定文）のみを使う。捏造リスクゼロで、
 * 「公開情報が少なく仮説の割合が大きい」ことを正直に伝える。
 */
function honestThinMockAnalysis(companyUrl: string): AiChatAnalysis {
  const domain = hostnameFor(companyUrl);
  const proposals = axisOrder.map((axis) => neutralAxisText[axis]);
  return {
    companyName: domain,
    analyzedSummary: `${domain} の公開情報が少なく、事業内容を十分に読み取れませんでした。以下は一般的なAI活用の切り口としての仮説です。詳しい状況を教えていただければ、精度を上げてご提案します。`,
    signals: [`${domain}の公開情報が限定的`, "業種の断定はできていません"],
    proposals,
    reportTeaser: "課題を1つ選んでいただければ、御社の状況をお伺いしながら具体化します。",
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

function safeEchoText(value: unknown, env: Env, maxLength: number) {
  const text = cleanText(value, "").slice(0, maxLength).trim();
  return text && lintText(text, env).ok ? text : "";
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

function validateAnalysis(raw: unknown, companyUrl: string, websiteText = ""): AiChatAnalysis {
  const input = raw as Partial<AiChatAnalysis>;
  const fallback = mockAnalysis(companyUrl, undefined, websiteText);
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

function validOutputText(text: string, env: Env) {
  return !text.trim() || lintText(text, env).ok;
}

function signalLooksLikeObservation(signal: string) {
  return Boolean(signal.trim()) && !/確認|チェック|調査|分析しました|見ました/.test(signal);
}

/**
 * lint(hard)違反を「文単位」で除去する。。区切りで文を割り、違反する文だけを落として残りを結合する。
 * 丸ごと差し替えを避けるための最初の手段（A方針）。空文字や記号だけの断片は捨てる。
 */
function dropViolatingSentences(text: string, env: Env): string {
  if (!text.trim()) return "";
  const sentences = text.split("。").map((part) => part.trim()).filter(Boolean);
  const kept = sentences.filter((sentence) => lintText(sentence, env).ok);
  if (!kept.length) return "";
  return kept.map((sentence) => `${sentence}。`).join("");
}

/**
 * 業種非依存・asset補間なしの固定文（3軸 × title/body/rationale = 9本）。
 * lint違反文をdropViolatingSentencesで削っても最小長に届かない、または全文が違反のときの最終防波堤。
 * どの業種のサイトにも当てはまる一般論のみで構成し、固有語・数値・断定は一切使わない。
 */
const neutralAxisText: Record<ProposalAxis, AiProposal> = {
  top_line: {
    axis: "top_line",
    title: "問い合わせ前の相談をAIが受け止める",
    body: "検討中の方が抱く小さな疑問は、問い合わせをためらう理由になりがちです。AIが先に話を聞き、相談への入口を広げます。",
    rationale: "公開情報から読み取れる問い合わせ導線の構造から。",
  },
  bottom_line: {
    axis: "bottom_line",
    title: "繰り返しの確認業務をAIに寄せる",
    body: "同じ内容の確認や案内が積み重なると、担当者の時間を圧迫します。定型的な初動をAIに任せ、人は判断が必要な対応に集中します。",
    rationale: "問い合わせ・案内の業務構造から。",
  },
  fde: {
    axis: "fde",
    title: "散らばった記録をAIが読める形にまとめる",
    body: "窓口や記録が複数に分かれると、次の一手が経験頼みになりがちです。AIが読める一つの基盤に集め、誰でも過去の経緯を確認できる状態を作ります。",
    rationale: "複数の窓口・記録が存在する構造から。",
  },
};

/**
 * フィールド単位のrepair（A方針）。丸ごとfallback差し替えは行わない。
 * 手順: ①lint通過ならそのまま採用 ②違反なら文単位で違反文だけ落とす
 * ③それでも空/最小長未満、または全文違反ならneutralAxisText（業種非依存の固定文）へ。
 * containsSiteCue/textMatchesWebsiteTextは判定に使わない（差し替えトリガではなくテレメトリ専用）。
 */
function repairField(
  value: string,
  neutralValue: string,
  env: Env,
  minLength: number,
): string {
  if (validOutputText(value, env) && value.trim().length >= minLength) return value;
  const dropped = dropViolatingSentences(value, env);
  if (dropped.trim().length >= minLength && validOutputText(dropped, env)) return dropped;
  return neutralValue;
}

function repairProposal(
  proposal: AiProposal,
  domain: string,
  websiteText: string,
  env: Env,
): AiProposal {
  const neutral = neutralAxisText[proposal.axis] || neutralAxisText.fde;
  const title = repairField(proposal.title, neutral.title, env, 6);
  const body = repairField(proposal.body, neutral.body, env, 20);
  const rationale = repairField(proposal.rationale, neutral.rationale, env, 4);
  // テレメトリ専用: 差し替え判定には使わない。retryトリガ材料として観測するだけ（判定はwebsiteText照合）。
  const combined = `${title} ${body}`;
  if (!textMatchesWebsiteText(combined, websiteText)) {
    console.log(JSON.stringify({
      event: "proposal_no_site_cue",
      axis: proposal.axis,
      domain,
    }));
  }
  return { axis: proposal.axis, title, body, rationale };
}

function validateAnalysisWithLint(raw: unknown, companyUrl: string, env: Env, websiteText = ""): AiChatAnalysis {
  const domain = hostnameFor(companyUrl);
  const fallback = mockAnalysis(companyUrl, "出力検証で安全な文面に切り替え", websiteText);
  const analysis = validateAnalysis(raw, companyUrl, websiteText);
  const proposals = analysis.proposals.map((proposal) => (
    repairProposal(proposal, domain, websiteText, env)
  ));
  const signals = analysis.signals
    .map(compactSignal)
    .filter((signal) => signalLooksLikeObservation(signal) && validOutputText(signal, env));
  // summaryはcue条件を撤廃: lintを通過すれば採用。違反時のみ文単位除去→なお不可ならfallbackへ。
  const summaryRepaired = repairField(analysis.analyzedSummary, fallback.analyzedSummary, env, 20);
  if (!textMatchesWebsiteText(summaryRepaired, websiteText)) {
    console.log(JSON.stringify({ event: "summary_no_site_cue", domain }));
  }
  const repaired: AiChatAnalysis = {
    ...analysis,
    analyzedSummary: summaryRepaired,
    signals: signals.length ? signals.slice(0, 4) : fallback.signals,
    proposals,
    reportTeaser: validOutputText(analysis.reportTeaser, env) ? analysis.reportTeaser : fallback.reportTeaser,
  };
  // 最終ゲートの mock 全損は廃止。ここまでで各フィールドは既にlint保証済みのため、
  // これ以降 outputPassesLint に落ちることは構造上ない（保険としてのみ残す）。
  return repaired;
}

function extractJson(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function deepSeekRequestBody(env: Env, companyUrl: string, websiteText: string, retry = false, thin = false) {
  const domain = hostnameFor(companyUrl);
  const facts = analyzeSiteFacts(companyUrl, websiteText);
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
            "あなたはhonkomaのAI導入診断エンジンです。返答はvalid JSONのみ。markdownで囲まない。",
            "目的: 相手が「自社の事業を読まれている」と感じる具体診断を作る。",
            "禁止: サイトにない事実の断定、数値効果、保証、残枠・煽り、クライアント実名、景表法上の強い効果断定。",
            "書き方: [観測] サイトに実在する具体を言い切る → [橋] 業界一般論 → [仮説] 内側は質問形で当てにいく。",
            "観測チェックリスト: 事業構成、問い合わせ導線、媒体やチャネルの散らばり、採用ページ、施工事例・症例・ブログ・FAQ、業界固有語、店舗・拠点、更新の気配。",
            "signals定義: サイトから読み取った具体的事実を3-4個。各40字以内。「確認」「チェック」「調査」など作業報告は禁止。中身だけを書く。",
            "3案はtop_line/bottom_line/fdeを1つずつ。3案を同じチャットボットの言い換えにしない。売る場面、繰り返しの場面、データと現場の場面を分ける。",
            "各proposal: titleは30字前後、bodyは2文、title+bodyにwebsiteText由来の固有語を最低1つ入れる。rationaleは「どこからそう読んだか」1文。",
            "honkomaの背骨: ①散らばったデータをAIが読める基盤に整える ②全員がAIでその基盤に触れる ③バックオフィスと繰り返し業務をAIに任せる ④人は判断・交渉・創造に集中する。",
            "軸プレイブック: 建設/施工=概算対応・事例営業活用、日報写真書類、現場事務所の情報一元化。医療/介護=予約前不安、レセプト書類日程、記録基盤。EC/小売=レビュー接客データ、受注在庫問い合わせ、チャネル横断データ。士業=相談前不安、書類ドラフト、ナレッジ属人解消。製造BtoB=技術問い合わせ、見積図面帳票、基幹データ接続。IT/SaaS=リード一次選別、サポートナレッジ、顧客データ分析。宿泊観光=予約前質問多言語、予約変更定型連絡、口コミ料金稼働データ。",
            "summaryの末尾で、3案のうち最も効くと考える一点を仮説形で1回だけ指名する（例:「特に◯◯の取りこぼしが気になります」）。3案並列の「どれでもどうぞ」感を出さない。",
            "websiteTextに固有名詞（商品名・サービス名・機能名）があれば、それを一般名詞に置き換えず、最低1つのproposalのtitleにそのまま使う。",
            retry ? "前回は汎用または安全検証で落ちた。signalsとproposalにサイト由来の固有語を増やす。" : "",
            thin ? "今回の観測はmeta情報（title/description/OGP等）由来に限定されている。内側の状況は仮説形に徹し、断定しない。" : "",
            "架空の良例:",
            JSON.stringify({
              companyName: "サンプル工務店（架空の例）",
              analyzedSummary: "注文住宅とリフォームの2本柱で、施工事例を80件以上公開されているとお見受けしました。一方で窓口は電話とフォームのみ——事例で温まった見込み客を営業時間の外で取りこぼしていないでしょうか。特に、夜間や休日に温度が上がる見込み客の取りこぼしが気になります。",
              signals: ["施工事例80件超を掲載", "窓口は電話とフォームの2つ", "採用ページで施工管理を募集中"],
              proposals: [
                {
                  axis: "top_line",
                  title: "施工事例80件を、見積もり前の相談窓口に変える",
                  body: "事例を読み込んだ訪問者ほど、概算だけ知りたい段階にいます。事例の文脈で条件を聞き取るAI窓口を置き、電話をためらう層の受け皿を作ります。",
                  rationale: "施工事例の厚さと、窓口が電話・フォームのみである点から。",
                },
                {
                  axis: "bottom_line",
                  title: "現場写真と日報の整理を、AIに引き取らせる",
                  body: "施工管理を募集されている今は、現場と事務の往復が重くなりがちです。写真の仕分け、日報の転記、発注書類の下書きをAIに寄せます。",
                  rationale: "採用ページの募集職種から、現場側の人手逼迫を仮説化。",
                },
                {
                  axis: "fde",
                  title: "問い合わせと施工記録を、ひとつのデータ基盤にまとめる",
                  body: "電話、フォーム、現場記録が別々の場所に残ると、次の一手が経験頼みになります。散らばった記録をAIが読める基盤に集めます。",
                  rationale: "窓口と記録が複数に分かれている構造から。",
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
          detectedIndustry: facts.industryConfident ? facts.industryLabel : "不明(本文から判断)",
          deterministicSignals: facts.signals,
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

/** repair後のproposalがwebsiteText由来の語を含むか（retryトリガ・テレメトリ専用、A方針）。 */
function analysisLacksSiteCue(analysis: AiChatAnalysis, companyUrl: string, websiteText: string) {
  const combined = analysis.proposals.map((proposal) => `${proposal.title} ${proposal.body}`).join(" ");
  const facts = analyzeSiteFacts(companyUrl, websiteText);
  // 判定の主軸はwebsiteText直接照合。containsSiteCueはテレメトリの参考値としてのみ併記する。
  const hasWebsiteCue = textMatchesWebsiteText(combined, websiteText);
  const hasFactsCue = containsSiteCue(combined, facts);
  if (!hasWebsiteCue) {
    console.log(JSON.stringify({ event: "site_cue_telemetry", hasWebsiteCue, hasFactsCue, domain: facts.domain }));
  }
  return !hasWebsiteCue;
}

async function callDeepSeek(env: Env, companyUrl: string, websiteText: string, thin = false) {
  const apiKey = env.DEEPSEEK_API_KEY || env.XAI_API_KEY;
  if (!apiKey) return mockAnalysis(companyUrl, undefined, websiteText);

  let lastError = "DeepSeek response did not include content";
  let lastAnalysis: AiChatAnalysis | undefined;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(DEEPSEEK_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deepSeekRequestBody(env, companyUrl, websiteText, attempt > 0, thin)),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API failed: ${response.status}`);
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = messageContent(data.choices?.[0]?.message);
    if (content.trim()) {
      const analysis = validateAnalysisWithLint(extractJson(content), companyUrl, env, websiteText);
      // A方針: containsSiteCueは判定ではなくretryトリガ＋テレメトリ専用。
      // 1回目でサイト由来の手がかりが弱ければ2回目（temperature低）を試し、それでも弱ければそのまま返す
      // （丸ごとfallback差し替えはしない）。
      const lacksCue = analysisLacksSiteCue(analysis, companyUrl, websiteText);
      if (lacksCue) {
        console.log(JSON.stringify({ event: "analysis_retry_trigger", attempt, domain: hostnameFor(companyUrl) }));
      }
      lastAnalysis = analysis;
      if (!lacksCue || attempt === 1) return analysis;
      continue;
    }
    lastError = "DeepSeek response did not include content";
  }

  if (lastAnalysis) return lastAnalysis;
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

function inferIndustry(body: Pick<DeepenBody, "companyUrl" | "analyzedSummary" | "signals" | "proposals">) {
  const text = [
    body.companyUrl || "",
    ...(body.signals || []),
    body.analyzedSummary,
    ...body.proposals.flatMap((proposal) => [proposal.title, proposal.body, proposal.rationale]),
  ].join(" ");
  const industry = detectIndustryFromText(text);
  return industry.key === "generic" ? undefined : industry.label;
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

const focusPhaseLabels = ["1〜2週目", "3〜6週目", "その後"] as const;
const genericFocusTerms = [
  "現状把握",
  "現状分析",
  "最適化設計",
  "運用定着",
  "整理",
  "試作",
  "運用化",
  "小さく始める",
  "ヒアリング",
];

function bodySpecificTerms(body: DeepenBody) {
  return [
    body.painPointRaw || "",
    ...(body.signals || []),
    body.analyzedSummary,
    ...body.proposals.flatMap((proposal) => [proposal.title, proposal.body, proposal.rationale]),
  ].filter(Boolean);
}

function primarySpecificTerm(body: DeepenBody) {
  const fromRaw = body.painPointRaw?.trim();
  if (fromRaw) return fromRaw.slice(0, 26);
  const signal = (body.signals || []).find((item) => item && !/確認|チェック|調査/.test(item));
  if (signal) return signal.slice(0, 26);
  const proposal = body.proposals.find((item) => item.title)?.title;
  return proposal ? proposal.slice(0, 26) : painLabel(body.painPoint);
}

function dataFoundationRequired(body: DeepenBody) {
  const text = bodySpecificTerms(body).join(" ");
  const hasScatterCue = /複数(媒体|チャネル|店舗|拠点|窓口)|Excel|エクセル|スプレッドシート|紙|台帳|帳票|記録.*分|データ.*散/.test(text);
  const mediaChannelCount = [
    /LINE|ライン/.test(text),
    /Instagram|インスタ|SNS|媒体|チャネル/.test(text),
    /店舗|拠点/.test(text),
  ].filter(Boolean).length;
  return (
    body.painPoint === "data" ||
    hasScatterCue ||
    mediaChannelCount >= 2
  );
}

function containsDataFoundation(text: string) {
  return /データ基盤|AIが読める|共通基盤|一つの基盤|ひとつの基盤|集約|散らば/.test(text);
}

function hasGenericFocusTerm(text: string) {
  return genericFocusTerms.some((term) => text.includes(term));
}

function focusFieldText(value: unknown, fallback: string, maxLength: number, env: Env) {
  const text = shortText(value, fallback, maxLength);
  if (!hasJapanese(text) || !lintText(text, env).ok) return fallback.slice(0, maxLength);
  return text;
}

function questionText(value: unknown, fallback: string, maxLength: number, env: Env) {
  const text = focusFieldText(value, fallback, maxLength, env);
  return /[か？?]$/.test(text.trim()) ? text : fallback.slice(0, maxLength);
}

function restatementWithPainEcho(text: string, fallback: string, body: DeepenBody) {
  const raw = body.painPointRaw?.trim();
  if (!raw) return text;
  if (text.includes(raw) || text.includes(raw.slice(0, 12))) return text;
  return fallback;
}

function ensureDataFoundationText(text: string, body: DeepenBody) {
  if (!dataFoundationRequired(body) || containsDataFoundation(text)) return text;
  const addition = "複数媒体や記録はAIが読めるデータ基盤へ集めます。";
  const base = text.replace(/。?$/, "。");
  if (base.length + addition.length <= 100) return `${base}${addition}`;
  return `${base.slice(0, Math.max(0, 100 - addition.length))}${addition}`;
}

function caseConnectionText(value: unknown, fallback: string, env: Env) {
  const text = focusFieldText(value, fallback, 80, env);
  if (/近いです|近い状況|似ています|類似/.test(text)) return fallback.slice(0, 80);
  return text;
}

/**
 * 42字上限で区切り境界（読点等）まで戻す。境界が見つからなければそのまま切る。
 * 「アプリ」のような1語だけが残る事故を防ぐため、8字未満ならprimarySpecificTerm(body)へ（E方針）。
 */
function truncateAtBoundary(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  const window = text.slice(0, maxLength);
  const lastBoundary = Math.max(
    window.lastIndexOf("、"),
    window.lastIndexOf("・"),
    window.lastIndexOf(" "),
  );
  if (lastBoundary >= 8) return window.slice(0, lastBoundary);
  return window;
}

function riskTarget(action: string, body?: DeepenBody) {
  const base = action
    .replace(/^(電話とフォームに来た|直近の|過去の|まず|最初に)/, "")
    /* 読点では切らず、。のみで文を区切る（読点切り捨てを廃止・E方針） */
    .replace(/。.*$/, "")
    /* 末尾の動詞句(「〜を特定します」等)を落として名詞止めにする */
    .replace(/を(特定|整理|分類|実装|集約|作成|確認|設計|統合|一元化|見直し|準備|検討|把握)(します|する|し)?$/, "")
    /* ぶら下がり助詞を除去。「」で囲むので語尾の不自然さは吸収される */
    .replace(/[をにがはでとへの]$/, "");
  const bounded = truncateAtBoundary(base, 42);
  if (bounded.trim().length < 8 && body) return primarySpecificTerm(body).slice(0, 42);
  return bounded || "最初の対象業務";
}

function fallbackFocusPlan(body: DeepenBody, matchedCase: CaseRecord | null): FocusPlan {
  const chosenAxis = axisForPain(body);
  const term = primarySpecificTerm(body);
  const rawPrefix = body.painPointRaw ? `「${body.painPointRaw.slice(0, 32)}」を起点に、` : "";
  const needsData = dataFoundationRequired(body);
  const templates: Record<PainCategory, Pick<FocusPlan, "restatement" | "steps" | "roles" | "prerequisites" | "agenda">> = {
    data: {
      restatement: `${rawPrefix}散らばったデータをAIが読める一つの基盤づくりから解きます`,
      steps: [
        { phase: focusPhaseLabels[0], action: `売上・顧客・問い合わせのデータがどのツールや表に分かれているかを特定します` },
        { phase: focusPhaseLabels[1], action: `判断に効く一群からAIが読める共通基盤に集約し、担当の方が自分で聞ける状態を作ります` },
        { phase: focusPhaseLabels[2], action: `基盤に載せる範囲を広げ、定例でAIに聞けば分かる数字を増やします` },
      ],
      roles: {
        honkoma: "データの置き場、AIで読む形、現場で聞ける導線まで設計・実装します。",
        client: "使っている表、紙、ツール、判断に使いたい数字を共有します。",
      },
      prerequisites: "売上・顧客・問い合わせなど、判断に使いたいデータの置き場。",
      agenda: [
        "数字を見たいとき、今は誰に頼んで何日かかっていますか",
        "Excelやスプレッドシートは何種類くらい動いていますか",
        "最初にAIへ聞けるようにしたい数字は何ですか",
      ],
    },
    support: {
      restatement: `${rawPrefix}問い合わせ対応を、AIが先に受けられる範囲から解きほぐします`,
      steps: [
        { phase: focusPhaseLabels[0], action: `電話・フォーム・FAQに来る質問を「概算・仕様・日程」などに分け、AIが先に受ける範囲を決めます` },
        { phase: focusPhaseLabels[1], action: `${term}を回答の裏付けに使うAI一次窓口を実装し、問い合わせログもAIが読めるデータ基盤に集めます` },
        { phase: focusPhaseLabels[2], action: `蓄積した問い合わせデータを営業と現場で共有し、次にAIへ移す書類や日程連絡を決めます` },
      ],
      roles: {
        honkoma: "一次対応AI、FAQ整備、問い合わせログの基盤化まで実装します。",
        client: "よくある質問、過去の返信、例外時に人が見る判断基準を共有します。",
      },
      prerequisites: "過去の問い合わせログ・FAQ・公開ページをAIが読める形に集める準備。",
      agenda: [
        "同じ質問は週にどれくらい来ていますか",
        "過去の問い合わせ記録は今どこに残っていますか",
        "人が見るべき例外は何ですか",
      ],
    },
    backoffice: {
      restatement: `${rawPrefix}請求・日程・書類などの反復業務をAIに寄せる順番を決めます`,
      steps: [
        { phase: focusPhaseLabels[0], action: `請求、日程調整、書類作成の中で毎週繰り返す入力と確認を特定します` },
        { phase: focusPhaseLabels[1], action: `最も回数が多い書類や連絡文の下書きをAIに任せ、確認履歴をデータ基盤に残します` },
        { phase: focusPhaseLabels[2], action: `空いた時間を判断・交渉・顧客対応へ戻し、次に任せる反復業務を増やします` },
      ],
      roles: {
        honkoma: "反復業務の分解、AI下書き、既存ツールへの接続を担当します。",
        client: "実際に使う帳票、文面、承認が必要な条件を共有します。",
      },
      prerequisites: "対象にする帳票、メール文、承認条件、既存の管理ツール。",
      agenda: [
        "毎週いちばん時間を取られる書類や連絡は何ですか",
        "人の承認が必要な条件はどこですか",
        "空いた時間を戻したい業務は何ですか",
      ],
    },
    sales: {
      restatement: `${rawPrefix}相談前の迷いをAIで受け、営業に渡す情報を揃えます`,
      steps: [
        { phase: focusPhaseLabels[0], action: `${term}を見た訪問者が問い合わせ前に知りたい質問を洗い出し、AIが聞く項目を決めます` },
        { phase: focusPhaseLabels[1], action: `AIが課題・規模・検討状況を聞き取り、営業が初回から使えるメモにして渡します` },
        { phase: focusPhaseLabels[2], action: `問い合わせ経路と商談メモをデータ基盤に集め、次の提案や追客に使える状態にします` },
      ],
      roles: {
        honkoma: "サイト上のAI窓口、営業メモ、問い合わせデータの接続まで作ります。",
        client: "よくある商談前質問、失注理由、営業が知りたい条件を共有します。",
      },
      prerequisites: "問い合わせフォーム、営業メモ、よくある質問、追客に使う情報。",
      agenda: [
        "問い合わせ前に多い質問は何ですか",
        "初回商談までに営業が知りたい条件は何ですか",
        "流入経路は今どこで見ていますか",
      ],
    },
    staffing: {
      restatement: `${rawPrefix}属人化しているノウハウをAIが読める形にし、人を判断に戻します`,
      steps: [
        { phase: focusPhaseLabels[0], action: `担当者しか分からない判断、手順、例外対応を具体的な業務名で書き出します` },
        { phase: focusPhaseLabels[1], action: `${term}に関わるノウハウをデータ基盤に集め、AIが次の担当者へ説明できる形にします` },
        { phase: focusPhaseLabels[2], action: `繰り返しの確認をAIへ移し、人は現場判断・交渉・育成に時間を戻します` },
      ],
      roles: {
        honkoma: "属人ノウハウの構造化、AI検索、現場で使う導線を実装します。",
        client: "ベテランの判断例、例外対応、引き継ぎで詰まる箇所を共有します。",
      },
      prerequisites: "手順書、過去対応、担当者の判断メモ、引き継ぎで使う資料。",
      agenda: [
        "その業務で一番その人に聞かないと分からない点は何ですか",
        "新人が詰まりやすい判断はどこですか",
        "人に戻したい時間は現場判断と育成のどちらですか",
      ],
    },
    other: {
      restatement: `${rawPrefix}${term}に近い課題を、共通AI基盤の入口として具体化します`,
      steps: [
        { phase: focusPhaseLabels[0], action: `${term}に関係する資料、問い合わせ、判断基準がどこに残っているかを特定します` },
        { phase: focusPhaseLabels[1], action: `AIが読める共通基盤に必要な情報を集め、担当者が自分で聞ける導線を作ります` },
        { phase: focusPhaseLabels[2], action: `使われた質問と回答をもとに、次にAIへ任せる業務面を広げます` },
      ],
      roles: {
        honkoma: "課題の分解、AI基盤、現場で使う導線まで実装します。",
        client: "課題の実例、使っている資料、判断者と確認フローを共有します。",
      },
      prerequisites: "対象業務の資料、過去対応、今使っているツール。",
      agenda: [
        "その課題はどの場面で一番困っていますか",
        "判断に必要な情報は今どこにありますか",
        "最初にAIへ聞けるようにしたいことは何ですか",
      ],
    },
  };
  const template = templates[body.painPoint] || templates.other;
  const steps = template.steps.map((step, index) => ({ ...step, phase: focusPhaseLabels[index] }));
  let prerequisites = template.prerequisites;
  if (needsData && !containsDataFoundation([prerequisites, ...steps.map((step) => step.action)].join(" "))) {
    prerequisites = `${prerequisites} 複数窓口や記録はAIが読めるデータ基盤へ集めます。`;
  }

  const plan: FocusPlan = {
    schemaVersion: "1.0",
    restatement: template.restatement.slice(0, 80),
    chosenAxis,
    steps,
    roles: template.roles,
    prerequisites: `${prerequisites} 規模: ${companySizeLabel(body.companySize)} / AI活用: ${maturityLabel(body.aiMaturity)}`.slice(0, 100),
    agenda: template.agenda,
    riskNote: `期間は目安です。初回は「${riskTarget(steps[0].action, body)}」に範囲を絞って始めます。`.slice(0, 80),
  };

  if (matchedCase) {
    const casePoint = (matchedCase.situation || matchedCase.title || "課題の入口").replace(/[。、\s]+$/, "");
    plan.caseConnection = `${matchedCase.companySize || "近い規模"}で、${casePoint}点が重なる匿名事例があります。`.slice(0, 80);
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

  const rawSteps = Array.isArray(input.steps) ? input.steps : [];
  const steps = rawSteps.slice(0, 3).map((step, index) => {
    const source = step as Partial<FocusPlanStep>;
    const action = focusFieldText(source.action, fallback.steps[index]?.action || "", 80, env);
    if (hasGenericFocusTerm(action)) return null;
    return { phase: focusPhaseLabels[index], action };
  });
  if (steps.some((step) => !step)) return null;
  const normalizedSteps = steps.filter(Boolean) as FocusPlanStep[];
  while (normalizedSteps.length < 3) normalizedSteps.push(fallback.steps[normalizedSteps.length]);

  const rawAgenda = Array.isArray(input.agenda) ? input.agenda : [];
  const agenda = rawAgenda.slice(0, 3).map((item, index) => (
    questionText(item, fallback.agenda[index] || "最初に確認したいことは何ですか", 60, env)
  ));
  while (agenda.length < 2) agenda.push(fallback.agenda[agenda.length]);

  const restatement = restatementWithPainEcho(
    focusFieldText(input.restatement, fallback.restatement, 80, env),
    fallback.restatement,
    body,
  );
  const prerequisites = ensureDataFoundationText(
    focusFieldText(input.prerequisites, fallback.prerequisites, 100, env),
    body,
  );

  const plan: FocusPlan = {
    schemaVersion: "1.0",
    restatement,
    chosenAxis: fallback.chosenAxis,
    steps: normalizedSteps,
    roles: {
      honkoma: focusFieldText(input.roles?.honkoma, fallback.roles.honkoma, 100, env),
      client: focusFieldText(input.roles?.client, fallback.roles.client, 100, env),
    },
    prerequisites,
    agenda,
    riskNote: `期間は目安です。初回は「${riskTarget(normalizedSteps[0].action, body)}」に範囲を絞って始めます。`.slice(0, 80),
  };

  if (matchedCase) {
    plan.caseConnection = caseConnectionText(input.caseConnection, fallback.caseConnection || "", env);
  }

  if (!outputPassesLint(plan, env) || !focusPlanLanguageOk(plan)) return null;
  if (dataFoundationRequired(body) && !containsDataFoundation([plan.prerequisites, ...plan.steps.map((step) => step.action)].join(" "))) {
    return null;
  }
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
  const goodExample: FocusPlan = {
    schemaVersion: "1.0",
    restatement: "「問い合わせせずに離脱」を起点に、施工事例を読んだ人の概算相談をAIが先に受けます",
    chosenAxis: "bottom_line",
    steps: [
      { phase: "1〜2週目", action: "施工事例を読んだ人が聞きたい概算・工期・対応エリアの質問を分類します" },
      { phase: "3〜6週目", action: "電話とフォームの前にAI一次窓口を置き、問い合わせログをデータ基盤に残します" },
      { phase: "その後", action: "蓄積した相談データを営業と現場で共有し、次にAIへ移す書類連絡を決めます" },
    ],
    roles: {
      honkoma: "AI一次窓口、FAQ整備、問い合わせログの基盤化まで実装します。",
      client: "過去の問い合わせ、よくある概算質問、人が見る例外条件を共有します。",
    },
    prerequisites: "過去の問い合わせログ・FAQ・公開ページをAIが読める形に集める準備。",
    agenda: [
      "見積もり前の概算質問は、今どなたが答えていますか",
      "電話とフォームの問い合わせ記録はどこに残っていますか",
      "AIではなく人が見るべき例外は何ですか",
    ],
    riskNote: "期間は目安です。初回は施工事例を読んだ人の質問に範囲を絞って始めます。",
    caseConnection: "同規模で、電話とフォームの問い合わせ記録が分かれていた点が重なります。",
  };
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
          "あなたはhonkomaのAI診断の進め方プラン生成エンジンです。",
          "返答はFocusPlanのJSONだけ。MarkdownやHTMLは禁止。",
          "phaseは必ず「1〜2週目」「3〜6週目」「その後」の3つをこの順で使う。",
          "actionは各1文。現状把握、現状分析、最適化設計、運用定着、整理、試作、運用化、小さく始める、ヒアリングなど汎用語で逃げない。",
          "painPointRaw、signals、selectedProposalの固有語をrestatementかstepsに再利用する。",
          "agendaは必ず質問形にする。",
          "riskNoteは「期間は目安です。初回は◯◯に範囲を絞って始めます。」の型にする。",
          "数値効果、保証、実在顧客名、残枠/緊急性、断定的な成果表現は禁止。",
          "matchedCaseがある場合、事例本文を書き換えず、caseConnectionで何が重なるかだけ80字以内で書く。「近いです」だけは禁止。",
          dataFoundationRequired(body)
            ? "今回の入力ではデータ基盤提案が必須。stepsまたはprerequisitesに「AIが読めるデータ基盤」「共通基盤」「集約」のいずれかを明示する。"
            : "",
          retry ? "前回は汎用語または検証違反で落ちた。期間ラベル固定、固有語、データ基盤条件を必ず守る。" : "",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify({
          painPoint: body.painPoint,
          painPointLabel: painLabel(body.painPoint),
          painPointRaw: body.painPointRaw || "",
          signals: body.signals || [],
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
          goodExample,
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
    painPointRaw: safeEchoText(body.painPointRaw, env, 64) || undefined,
    companySize: body.companySize || null,
    aiMaturity: body.aiMaturity || null,
    signals: Array.isArray(body.signals)
      ? body.signals.slice(0, 4).map((signal) => safeEchoText(signal, env, 40)).filter(Boolean)
      : [],
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

function parseUtm(utm?: string) {
  const params = new URLSearchParams((utm || "").replace(/^\?/, ""));
  return {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    content: params.get("utm_content") || undefined,
    term: params.get("utm_term") || undefined,
  };
}

function referrerHost(referrer?: string) {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return referrer.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "").toLowerCase();
  }
}

function channelFromSource(source?: string) {
  const value = (source || "").toLowerCase();
  if (!value) return "";
  if (value === "youtube" || value === "yt" || value.includes("youtu")) return "YouTube";
  if (value === "note" || value.includes("note")) return "note";
  if (value === "x" || value === "twitter" || value.includes("twitter")) return "X(Twitter)";
  if (value === "google" || value === "yahoo" || value === "bing") return "検索";
  return source || "";
}

function deriveChannel(utm?: string, referrer?: string) {
  const utmParts = parseUtm(utm);
  const fromUtm = channelFromSource(utmParts.source);
  if (fromUtm) return fromUtm;

  const host = referrerHost(referrer);
  if (!host || /(^|\.)ltdhonkoma\.com$|localhost|127\.0\.0\.1/.test(host)) return "直接";
  if (/t\.co|twitter\.com|x\.com/.test(host)) return "X(Twitter)";
  if (/google|yahoo|bing/.test(host)) return "検索";
  if (/youtube\.com|youtu\.be/.test(host)) return "YouTube";
  if (/note\.com/.test(host)) return "note";
  return host;
}

function trafficContextLine(payload: { utm?: string; referrer?: string; landingPath?: string }) {
  const utm = parseUtm(payload.utm);
  const parts = [
    `流入: ${deriveChannel(payload.utm, payload.referrer)}`,
    utm.campaign ? `campaign: ${utm.campaign}` : "",
    utm.medium ? `medium: ${utm.medium}` : "",
    utm.content ? `content: ${utm.content}` : "",
    payload.landingPath ? `着地: ${payload.landingPath}` : "",
  ].filter(Boolean);
  return parts.join(" ・ ");
}

function notionProperties(payload: LeadBody | PartialLeadBody) {
  const title = payload.companyUrl ? hostnameFor(payload.companyUrl) : payload.email || payload.sessionId;
  const diagnosisCode = payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId);
  const channel = deriveChannel(payload.utm, payload.referrer);
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
  if (channel) properties.Channel = { select: { name: channel } };
  if (payload.landingPath) properties["Landing Path"] = { rich_text: richText(payload.landingPath) };
  if (payload.utm || payload.referrer || payload.landingPath) {
    properties["UTM / Referrer"] = {
      rich_text: richText([
        payload.utm,
        payload.referrer,
        payload.landingPath ? `landing=${payload.landingPath}` : "",
      ].filter(Boolean).join(" | ")),
    };
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
  const channel = deriveChannel(payload.utm, payload.referrer);
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
    payload.landingPath ? `landing=${payload.landingPath}` : "",
  ].filter(Boolean).join(" | ");

  const properties: Record<string, unknown> = {
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
  if (channel) properties.Channel = { select: { name: channel } };
  if (payload.landingPath) properties["Landing Path"] = { rich_text: richText(payload.landingPath) };
  return properties;
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

async function notionDatabaseProperties(env: Env, databaseId: string) {
  const cache = defaultWorkerCache();
  const cacheKey = new Request(`https://honkoma.local/notion-db-props/${databaseId}`);
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      try {
        const cachedValue = await cached.json() as Record<string, string> | string[];
        if (Array.isArray(cachedValue)) {
          return Object.fromEntries(cachedValue.map((name) => [name, "unknown"]));
        }
        return cachedValue;
      } catch {
        // Fall through and refresh.
      }
    }
  }

  const database = await notionFetch(env, `/databases/${databaseId}`, { method: "GET" }) as {
    properties?: Record<string, { type?: string }>;
  };
  const properties = Object.fromEntries(
    Object.entries(database.properties || {}).map(([name, property]) => [name, property.type || "unknown"]),
  );
  if (cache) {
    await cache.put(cacheKey, new Response(JSON.stringify(properties), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    }));
  }
  return properties;
}

function coerceNotionProperty(name: string, value: unknown, propertyType: string) {
  if (name === "Channel") {
    const richTextValue = (value as { rich_text?: Array<{ plain_text?: string; text?: { content?: string } }> }).rich_text?.[0];
    const channel = ((value as { select?: { name?: string } }).select?.name ||
      richTextValue?.plain_text ||
      richTextValue?.text?.content ||
      "").trim();
    if (!channel) return undefined;
    if (propertyType === "rich_text") return { rich_text: richText(channel) };
    return { select: { name: channel } };
  }
  if (name === "Landing Path" && propertyType === "url") {
    const richTextValue = (value as { rich_text?: Array<{ plain_text?: string; text?: { content?: string } }> }).rich_text?.[0];
    const landingPath = richTextValue?.plain_text || richTextValue?.text?.content;
    if (!landingPath) return undefined;
    return { url: landingPath.startsWith("/") ? `https://ltdhonkoma.com${landingPath}` : landingPath };
  }
  return value;
}

async function filterNotionProperties(env: Env, properties: Record<string, unknown>) {
  if (!env.NOTION_TOKEN || !env.NOTION_LEADS_DB_ID) return properties;
  try {
    const allowed = await notionDatabaseProperties(env, env.NOTION_LEADS_DB_ID);
    return Object.fromEntries(
      Object.entries(properties)
        .filter(([name]) => Object.prototype.hasOwnProperty.call(allowed, name))
        .map(([name, value]) => [name, coerceNotionProperty(name, value, allowed[name])])
        .filter(([, value]) => Boolean(value)),
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
    booked: Boolean((page.properties?.Booked as { checkbox?: boolean } | undefined)?.checkbox),
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
    trafficContextLine(payload),
    `source: ${slackText(payload.source)}`,
    `session: ${slackText(compactSession(payload.sessionId))}`,
    payload.utm ? `utm: ${slackText(payload.utm)}` : "",
    payload.referrer ? `referrer: ${slackText(payload.referrer)}` : "",
    payload.landingPath ? `landing: ${slackText(payload.landingPath)}` : "",
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
    trafficContextLine(payload),
    `type: ${type}`,
    `consent: ${payload.consent ? "yes" : "no"}`,
    payload.utm ? `utm: ${slackText(payload.utm)}` : "",
    payload.referrer ? `referrer: ${slackText(payload.referrer)}` : "",
    payload.landingPath ? `landing: ${slackText(payload.landingPath)}` : "",
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
    "一次対応や定型確認をAIへ寄せる",
    "既存ツールに合わせてデータ基盤へつなぐ",
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
    { phase: "1〜2週目", action: "AIが先に受ける問い合わせや資料の置き場を特定します。" },
    { phase: "3〜6週目", action: "既存のフォームやSlack/Notionに合わせてAI窓口を接続します。" },
    { phase: "その後", action: "人が確認する例外条件を残し、次にAIへ任せる業務を増やします。" },
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

async function sendEmailContent(
  env: Env,
  to: string,
  content: { subject: string; html: string; text: string },
) {
  if (!to || !emailTransportConfigured(env)) return false;
  const fromEmail = emailFrom(env);
  const fromName = env.EMAIL_FROM_NAME || "honkoma";
  const replyTo = env.EMAIL_REPLY_TO || fromEmail;

  /* 送信優先順位: Resend → Cloudflare Email API → EMAIL(send_email)バインディング。
   * Resendを最優先にする理由: ドメインltdhonkoma.comはDMARC=p=reject・SPF/DKIMが
   * Google専用のため、Cloudflareのsend_emailバインディング(env.EMAIL)経由だと不特定
   * リード宛は認証非整合で拒否される。Resendでドメイン認証(DKIM)すればp=rejectでも
   * 整合して届く。RESEND_API_KEY未設定なら従来どおりEMAILバインディングへフォールバック。 */
  if (env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        reply_to: replyTo,
        subject: content.subject,
        html: content.html,
        text: content.text,
      }),
    });
    if (!response.ok) throw new Error(`Resend email failed: ${response.status}`);
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
          to: [{ email: to }],
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

  if (env.EMAIL) {
    await env.EMAIL.send({
      to,
      from: { email: fromEmail, name: fromName },
      replyTo: { email: replyTo, name: fromName },
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    return true;
  }

  return false;
}

async function sendDiagnosisEmail(env: Env, payload: LeadBody) {
  if (!payload.email || !payload.consent) return false;
  return sendEmailContent(env, payload.email, diagnosisEmailContent(env, payload));
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

function materialApprovalEnabled(env: Env) {
  return (
    env.MATERIAL_APPROVAL_ENABLED?.toLowerCase() === "true" &&
    Boolean(env.LEAD_MATERIALS && env.SLACK_BOT_TOKEN && env.SLACK_SIGNING_SECRET && env.SLACK_APPROVAL_CHANNEL_ID)
  );
}

function materialKey(sessionId: string) {
  return `material:${sessionId}`;
}

function latestDraft(record: MaterialRecord) {
  return [...record.drafts].reverse().find((entry) => entry.draft)?.draft;
}

async function readMaterialRecord(env: Env, sessionId: string) {
  if (!env.LEAD_MATERIALS) return null;
  const raw = await env.LEAD_MATERIALS.get(materialKey(sessionId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MaterialRecord;
  } catch {
    return null;
  }
}

async function writeMaterialRecord(env: Env, record: MaterialRecord) {
  if (!env.LEAD_MATERIALS) return;
  record.updatedAt = new Date().toISOString();
  await env.LEAD_MATERIALS.put(materialKey(record.context.sessionId), JSON.stringify(record), {
    expirationTtl: MATERIAL_TTL_SECONDS,
  });
}

function materialStatusLabel(status: MaterialStatus) {
  const labels: Record<MaterialStatus, string> = {
    generating: "生成中",
    pending: "承認待ち",
    revising: "修正中",
    approved_sending: "送信中",
    sent: "送信済み",
    discarded: "見送り",
    failed: "失敗",
  };
  return labels[status];
}

function materialVariantLabel(variant: MaterialVariant) {
  const labels: Record<MaterialVariant, string> = {
    normal: "通常版",
    booked_confirmed: "既予約版",
    booking_in_progress: "日程調整中版",
    other_channel: "別動線版",
  };
  return labels[variant];
}

function materialVariantOptions(selected: MaterialVariant) {
  const variants: MaterialVariant[] = ["normal", "booked_confirmed", "booking_in_progress", "other_channel"];
  return variants.map((variant) => ({
    text: slackPlainText(materialVariantLabel(variant)),
    value: variant,
    ...(variant === selected ? { selected: true } : {}),
  }));
}

function materialStageLabel(payload: LeadBody) {
  return stageLabel(payload.stage) || (payload.focusPlan ? "プラン表示後" : "課題選択後");
}

function materialTitle(payload: LeadBody) {
  return companyNameForLead(payload);
}

function proposedCaseLines(payload: LeadBody) {
  return (payload.proposedCases || "")
    .split(/\n+/)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

function fallbackMaterialDraft(payload: LeadBody): MaterialDraft {
  const pain = painDisplay(payload.painPoint) || "AI活用";
  const proposals = proposedCaseLines(payload);
  const focusSteps = payload.focusPlan?.steps || [];
  const sceneTitles = proposals.length ? proposals : [
    `${pain}の最初の入口`,
    "定型確認の軽量化",
    "現場で使うAI基盤",
  ];
  const scenes = sceneTitles.slice(0, 2).map((title, index) => {
    const focusStep = focusSteps[index];
    return {
      title: shortText(title, `${pain}の活用場面`, 24),
      current: shortText(
        payload.analyzedSummary || "公開情報と入力内容から、改善余地のある業務を仮説化しました。",
        "公開情報と入力内容から、改善余地のある業務を仮説化しました。",
        90,
      ),
      withAi: shortText(
        focusStep?.action || "AIが一次対応を担い、人が確認すべき判断に集中できる状態を作ります。",
        "AIが一次対応を担い、人が確認すべき判断に集中できる状態を作ります。",
        110,
      ),
      firstMove: shortText(
        focusStep?.phase ? `${focusStep.phase}: ${focusStep.action}` : "まず対象業務を1つに絞り、既存ツールへAI窓口を接続します。",
        "まず対象業務を1つに絞り、既存ツールへAI窓口を接続します。",
        80,
      ),
    };
  });
  return {
    schemaVersion: "1.0",
    opening: shortText(
      payload.focusPlan?.restatement || `${pain}を起点に、公開情報とご回答から進め方を具体化しました。`,
      `${pain}を起点に、公開情報とご回答から進め方を具体化しました。`,
      140,
    ),
    scenes,
    firstStep: shortText(
      focusSteps[0]?.action || "最初の2〜6週間で、対象業務を特定しAIが読める共通基盤へつなぎます。",
      "最初の2〜6週間で、対象業務を特定しAIが読める共通基盤へつなぎます。",
      120,
    ),
    caseConnection: payload.matchedCase
      ? shortText(`${payload.matchedCase.companySize || "近い規模"}の匿名事例と、課題の入口が重なります。`, "", 80)
      : undefined,
    meetingTopics: (payload.focusPlan?.agenda || [
      "最初にAIへ任せたい業務は何ですか",
      "人が確認すべき例外はどこですか",
      "既存ツールはどこにつなぐべきですか",
    ]).slice(0, 3).map((item) => shortText(item, "相談で確認すること", 40)),
  };
}

function materialDraftLanguageOk(draft: MaterialDraft) {
  return collectStrings(draft).every((text) => !text || hasJapanese(text));
}

function validateMaterialDraft(raw: unknown, payload: LeadBody, env: Env): MaterialDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Partial<MaterialDraft>;
  const fallback = fallbackMaterialDraft(payload);
  const rawScenes = Array.isArray(input.scenes) ? input.scenes : [];
  const scenes = rawScenes.slice(0, 3).map((scene, index) => {
    const source = scene as Partial<MaterialScene>;
    const fallbackScene = fallback.scenes[index] || fallback.scenes[0];
    return {
      title: shortText(source.title, fallbackScene.title, 24),
      current: shortText(source.current, fallbackScene.current, 90),
      withAi: shortText(source.withAi, fallbackScene.withAi, 110),
      firstMove: shortText(source.firstMove, fallbackScene.firstMove, 80),
    };
  });
  while (scenes.length < 2) scenes.push(fallback.scenes[scenes.length] || fallback.scenes[0]);

  const rawTopics = Array.isArray(input.meetingTopics) ? input.meetingTopics : [];
  const meetingTopics = rawTopics.slice(0, 3).map((topic, index) => (
    shortText(topic, fallback.meetingTopics[index] || "相談で確認すること", 40)
  ));
  while (meetingTopics.length < 2) meetingTopics.push(fallback.meetingTopics[meetingTopics.length] || "相談で確認すること");

  const draft: MaterialDraft = {
    schemaVersion: "1.0",
    opening: shortText(input.opening, fallback.opening, 140),
    scenes,
    firstStep: shortText(input.firstStep, fallback.firstStep, 120),
    caseConnection: payload.matchedCase
      ? shortText(input.caseConnection, fallback.caseConnection || "", 80)
      : undefined,
    meetingTopics,
  };

  if (!outputPassesLint(draft, env) || !materialDraftLanguageOk(draft)) return null;
  return draft;
}

function materialPromptBody(env: Env, record: MaterialRecord, instruction?: string, retry = false) {
  const payload = record.context;
  const previous = latestDraft(record);
  return {
    model: env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL,
    thinking: { type: "disabled" },
    temperature: retry ? 0.2 : 0.35,
    max_tokens: 1600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          "You are honkoma's lead-material generator. Return valid JSON only.",
          "書いてよい事実は入力にあるものだけ。相手企業の内部事情、新しい事実、数値効果、固有名詞を創作しない。",
          "クライアント実名、感嘆符、希少性、保証、断定数値は禁止。",
          "matchedCaseの事実は書き換えない。caseConnectionだけを書く。",
          "丁寧で静かな日本語で、営業色を強くしすぎない。",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify({
          companyUrl: payload.companyUrl,
          companyName: materialTitle(payload),
          analyzedSummary: payload.analyzedSummary,
          proposedCases: payload.proposedCases,
          painPoint: payload.painPoint,
          painPointLabel: painDisplay(payload.painPoint),
          painPointRaw: payload.painPointRaw,
          companySize: payload.companySize,
          companySizeLabel: companySizeLabel(payload.companySize),
          aiMaturity: payload.aiMaturity,
          aiMaturityLabel: maturityLabel(payload.aiMaturity),
          focusPlan: payload.focusPlan,
          matchedCase: payload.matchedCase || null,
          diagnosisCode: payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId),
          stage: payload.stage,
          fixedCompanyFacts: {
            company: "株式会社honkoma",
            supportScale: "30社以上のAI伴走導入",
            team: "10名体制",
            representative: "代表 林拓海",
          },
          previousDraft: previous || null,
          revisionInstruction: instruction || "",
          outputSchema: {
            schemaVersion: "1.0",
            opening: "string <=140",
            scenes: [
              {
                title: "string <=24",
                current: "string <=90",
                withAi: "string <=110",
                firstMove: "string <=80",
              },
            ],
            firstStep: "string <=120",
            caseConnection: "optional string <=80",
            meetingTopics: ["2-3 strings <=40"],
          },
          example: fallbackMaterialDraft(payload),
        }),
      },
    ],
  };
}

async function generateMaterialDraft(env: Env, record: MaterialRecord, instruction?: string): Promise<MaterialDraftEntry> {
  const apiKey = env.DEEPSEEK_API_KEY || env.XAI_API_KEY;
  const fallback = fallbackMaterialDraft(record.context);
  const createdAt = new Date().toISOString();
  if (!apiKey) {
    return {
      rev: record.rev + 1,
      mode: "fallback",
      draft: fallback,
      instruction,
      createdAt,
      warning: "DeepSeek APIキー未設定のため、テンプレ版を表示しています。",
    };
  }

  let transportFailed = false;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(DEEPSEEK_BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(materialPromptBody(env, record, instruction, attempt > 0)),
      });
      if (!response.ok) {
        transportFailed = true;
        throw new Error(`DeepSeek API failed: ${response.status}`);
      }
      const data = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
      const content = messageContent(data.choices?.[0]?.message);
      if (!content.trim()) continue;
      const draft = validateMaterialDraft(extractJson(content), record.context, env);
      if (draft) {
        return { rev: record.rev + 1, mode: "model", draft, instruction, createdAt };
      }
    } catch (error) {
      if (error instanceof TypeError) transportFailed = true;
      // Retry once, then deterministic fallback.
    }
  }

  if (transportFailed) {
    return {
      rev: record.rev + 1,
      mode: "failed",
      instruction,
      createdAt,
      warning: "資料生成に失敗しました。再試行できます。",
    };
  }

  return {
    rev: record.rev + 1,
    mode: "fallback",
    draft: fallback,
    instruction,
    createdAt,
    warning: "自動生成が検証を通らなかったため、テンプレ版を表示しています。",
  };
}

function materialEmailContent(env: Env, record: MaterialRecord) {
  const payload = record.context;
  const draft = latestDraft(record) || fallbackMaterialDraft(payload);
  const companyName = materialTitle(payload);
  const pain = painDisplay(payload.painPoint) || "AI活用";
  const diagnosisCode = payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId);
  const bookingUrl = env.BOOKING_URL || DEFAULT_BOOKING_URL;
  const bookedVariant = record.variant === "booked_confirmed" || record.variant === "booking_in_progress";
  const subject = bookedVariant
    ? "【honkoma】ご予約ありがとうございます — 当日に向けた資料です"
    : `【honkoma】${companyName}向けに、AI活用の進め方をまとめました`;
  const greeting = (() => {
    if (record.variant === "booked_confirmed") {
      return [
        "このたびは、ミーティングのご予約をありがとうございます。代表の林です。",
        "ご予約の前後にご案内が行き違いになっていましたら、申し訳ございません。",
        "当日に向けて、診断の内容を資料としてまとめました。事前のご準備は不要です。当日は、この内容から一緒に始めましょう。",
      ];
    }
    if (record.variant === "booking_in_progress") {
      return [
        "代表の林です。診断のご利用ありがとうございました。",
        "すでに日程調整にお進みいただいていましたら、ご案内が行き違いになり申し訳ございません。",
        "その場合このメールへのご返信は不要です。当日、この資料の内容からお話しできるよう、こちらで準備しておきます。",
      ];
    }
    const overlapLine = record.variant === "other_channel"
      ? "なお、別の窓口からも既にご連絡をいただいているようでしたら、ご案内が重なってしまい申し訳ございません。お返事は、どちらか一方で結構です。"
      : "";
    return [
      `${companyName} ご担当者様`,
      "先ほどは、honkomaのAI診断をご利用いただきありがとうございました。",
      "代表の林です。",
      overlapLine,
      `診断の内容を確認し、${pain}を起点とした${companyName}での活用イメージを、こちらの1通にまとめました。`,
    ].filter(Boolean);
  })();
  const caseLines = payload.matchedCase ? [
    payload.matchedCase.title,
    payload.matchedCase.situation,
    payload.matchedCase.approach,
    payload.matchedCase.outcome,
    payload.matchedCase.duration,
    draft.caseConnection || "",
  ].filter(Boolean) : ["近い事例は、お話の中で状況に合わせてご紹介します。"];
  const meetingBlock = (() => {
    if (record.variant === "booked_confirmed") return [];
    if (record.variant === "booking_in_progress") {
      return [
        "もしまだ日程がお決まりでなければ、こちらからどうぞ。",
        `日程: ${bookingUrl}`,
        `予約フォームのご相談内容欄に、診断コード ${diagnosisCode} をご記入ください。`,
      ];
    }
    const heading = record.variant === "other_channel"
      ? "■ もしまだ日程のご相談が進んでいなければ"
      : "■ 一度、お話ししませんか";
    return [
      heading,
      "30分のオンラインミーティングで、この資料を御社の実情に合わせて組み直すこともできます。売り込みはしません。",
      `日程: ${bookingUrl}`,
      `予約フォームのご相談内容欄に、診断コード ${diagnosisCode} をご記入ください。`,
      "ミーティングで話すこと（目安）",
      ...draft.meetingTopics.map((topic) => `・${topic}`),
    ];
  })();
  const text = [
    subject,
    "",
    ...greeting,
    "",
    "■ 診断の要約",
    draft.opening,
    "",
    `■ ${companyName}での活用イメージ`,
    ...draft.scenes.flatMap((scene, index) => [
      `${index + 1}. ${scene.title}`,
      `　いま　　　: ${scene.current}`,
      `　AI導入後　: ${scene.withAi}`,
      `　最初の一歩: ${scene.firstMove}`,
    ]),
    "",
    "■ 進め方（最初の2〜6週間）",
    draft.firstStep,
    "",
    "■ 近い状況の事例",
    ...caseLines,
    "",
    ...meetingBlock,
    "",
    "この資料は公開情報とご入力内容に基づく仮説です。実装可否や優先順位は、業務の詳細を確認して調整します。",
    payload.matchedCase ? "※事例は特定を避けるため、業種・規模など一部の表現を調整しています。" : "",
    "",
    "株式会社honkoma",
    "代表取締役 林 拓海",
    "https://ltdhonkoma.com",
    "※このメールは、AI診断をご利用いただいた方に、内容を人が確認したうえで一度だけお送りしています。",
    "　以降のご案内をお送りすることはありません。",
  ].filter((line) => line !== "").join("\n");
  const htmlScenes = draft.scenes.map((scene, index) => `
        <li>
          <strong>${index + 1}. ${escapeHtml(scene.title)}</strong><br>
          いま: ${escapeHtml(scene.current)}<br>
          AI導入後: ${escapeHtml(scene.withAi)}<br>
          最初の一歩: ${escapeHtml(scene.firstMove)}
        </li>`).join("");
  const htmlMeeting = meetingBlock.length ? `
      <h2 style="font-size:16px;margin:28px 0 10px;">${escapeHtml(meetingBlock[0].replace(/^■\s*/, ""))}</h2>
      ${meetingBlock.slice(1).map((line) => `<p style="margin:0 0 8px;">${escapeHtml(line)}</p>`).join("")}
  ` : "";
  const html = `
<!doctype html>
<html lang="ja">
  <body style="margin:0;background:#f6f8fb;color:#17202a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;">
    <main style="max-width:680px;margin:0 auto;padding:28px 20px;background:#ffffff;">
      <p style="font-size:12px;color:#1d5fa7;font-weight:700;margin:0 0 8px;">AI Material</p>
      <h1 style="font-size:22px;line-height:1.4;margin:0 0 16px;">${escapeHtml(subject)}</h1>
      ${greeting.map((line) => `<p style="margin:0 0 10px;">${escapeHtml(line)}</p>`).join("")}
      <h2 style="font-size:16px;margin:28px 0 10px;">診断の要約</h2>
      <p>${escapeHtml(draft.opening)}</p>
      <h2 style="font-size:16px;margin:28px 0 10px;">${escapeHtml(companyName)}での活用イメージ</h2>
      <ol style="padding-left:20px;margin:0;">${htmlScenes}</ol>
      <h2 style="font-size:16px;margin:28px 0 10px;">進め方（最初の2〜6週間）</h2>
      <p>${escapeHtml(draft.firstStep)}</p>
      <h2 style="font-size:16px;margin:28px 0 10px;">近い状況の事例</h2>
      ${caseLines.map((line) => `<p style="margin:0 0 8px;">${escapeHtml(line)}</p>`).join("")}
      ${htmlMeeting}
      <hr style="border:none;border-top:1px solid #e5e9f0;margin:28px 0;" />
      <p style="font-size:12px;color:#667085;">この資料は公開情報とご入力内容に基づく仮説です。実装可否や優先順位は、業務の詳細を確認して調整します。</p>
      ${payload.matchedCase ? `<p style="font-size:12px;color:#667085;">※事例は特定を避けるため、業種・規模など一部の表現を調整しています。</p>` : ""}
      <p style="font-size:12px;color:#667085;">株式会社honkoma<br>代表取締役 林 拓海<br>https://ltdhonkoma.com</p>
      <p style="font-size:12px;color:#667085;">※このメールは、AI診断をご利用いただいた方に、内容を人が確認したうえで一度だけお送りしています。以降のご案内をお送りすることはありません。</p>
    </main>
  </body>
</html>`.trim();
  return { subject, text, html };
}

async function sendMaterialEmail(env: Env, record: MaterialRecord) {
  const email = record.context.email;
  if (!email || !record.context.consent || record.sentAt) return false;
  return sendEmailContent(env, email, materialEmailContent(env, record));
}

async function updateNotionMaterialStatus(env: Env, sessionId: string, status: MaterialStatus, sentAt?: string) {
  if (!env.NOTION_TOKEN || !env.NOTION_LEADS_DB_ID) return false;
  const page = await findNotionPageBySession(env, sessionId);
  if (!page?.id) return false;
  const rawProperties: Record<string, unknown> = {
    "Material Status": { select: { name: materialStatusLabel(status) } },
  };
  if (sentAt) rawProperties["Material Sent At"] = { date: { start: sentAt } };
  const properties = await filterNotionProperties(env, rawProperties);
  if (!Object.keys(properties).length) return false;
  await notionFetch(env, `/pages/${page.id}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });
  return true;
}

async function detectMaterialOverlap(env: Env, payload: LeadBody): Promise<MaterialOverlap> {
  const overlap: MaterialOverlap = {
    booked: false,
    bookingClick: payload.stage === "booking_click" || payload.stage === "bookingStarted" || payload.contactMethod === "booking",
    sameEmail: false,
    sameDomain: false,
  };
  if (!env.NOTION_TOKEN || !env.NOTION_LEADS_DB_ID) return overlap;
  try {
    const current = await findNotionPageBySession(env, payload.sessionId);
    overlap.booked = Boolean(current?.booked);
    overlap.bookingClick = overlap.bookingClick || current?.stage === "booking_click" || current?.stage === "bookingStarted";
    if (payload.email) {
      const result = await notionFetch(env, `/databases/${env.NOTION_LEADS_DB_ID}/query`, {
        method: "POST",
        body: JSON.stringify({
          filter: { property: "Email", email: { equals: payload.email } },
          page_size: 5,
        }),
      }) as { results?: Array<{ properties?: Record<string, unknown> }> };
      const matched = (result.results || []).find((page) => {
        const session = notionPlainText(page.properties?.["Session ID"]);
        return session && session !== payload.sessionId;
      });
      if (matched) {
        overlap.sameEmail = true;
        overlap.matchedLeadUrl = notionPlainText(matched.properties?.["Company"]);
      }
    }
  } catch {
    return overlap;
  }
  return overlap;
}

function suggestedVariant(overlap: MaterialOverlap): MaterialVariant {
  if (overlap.booked) return "booked_confirmed";
  if (overlap.bookingClick) return "booking_in_progress";
  if (overlap.sameEmail) return "other_channel";
  return "normal";
}

type SlackApiResponse = { ok?: boolean; error?: string; channel?: string; ts?: string };

async function slackApi(env: Env, method: string, body: Record<string, unknown>): Promise<SlackApiResponse> {
  if (!env.SLACK_BOT_TOKEN) throw new Error("Slack bot token is not configured");
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json() as SlackApiResponse;
  if (!response.ok || !data.ok) throw new Error(`Slack API ${method} failed: ${data.error || response.status}`);
  return data;
}

function materialCardPayload(env: Env, record: MaterialRecord) {
  return {
    text: `リード資料 ${materialStatusLabel(record.status)}: ${materialTitle(record.context)}`,
    unfurl_links: false,
    unfurl_media: false,
    blocks: materialSlackBlocks(env, record),
  };
}

async function postMaterialCardWebhook(env: Env, record: MaterialRecord) {
  if (!env.SLACK_WEBHOOK_URL) return false;
  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(materialCardPayload(env, record)),
  });
  if (!response.ok) throw new Error(`Slack webhook failed: ${response.status}`);
  return true;
}

async function replaceMaterialCardWithResponseUrl(env: Env, record: MaterialRecord) {
  if (!record.slackResponseUrl) return false;
  const response = await fetch(record.slackResponseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      replace_original: true,
      ...materialCardPayload(env, record),
    }),
  });
  return response.ok;
}

function materialSlackPreview(env: Env, record: MaterialRecord) {
  const content = materialEmailContent(env, record);
  return [
    `*件名*: ${slackText(content.subject)}`,
    "```",
    slackText(content.text.slice(0, 1800)),
    "```",
  ].join("\n");
}

function materialSlackBlocks(env: Env, record: MaterialRecord): SlackBlock[] {
  const payload = record.context;
  const diagnosisCode = payload.diagnosisCode || diagnosisCodeForSession(payload.sessionId);
  const fields = [
    slackField("診断コード", diagnosisCode),
    slackField("Stage", materialStageLabel(payload)),
    slackField("課題", painDisplay(payload.painPoint)),
    slackField("規模", payload.companySize ? companySizeLabel(payload.companySize) : ""),
    slackField("AI活用", payload.aiMaturity ? maturityLabel(payload.aiMaturity) : ""),
    slackField("URL", slackUrl(payload.companyUrl)),
    slackField("Email", payload.email),
    slackField("rev", String(record.rev)),
  ].filter(Boolean);
  const warning = [
    record.overlap.booked ? "Bookedフラグあり → 既予約版を提案" : "",
    record.overlap.bookingClick ? "booking_clickあり → 日程調整中版を提案" : "",
    record.overlap.sameEmail ? "同じメールアドレスの既存リードあり → 別動線版を提案" : "",
  ].filter(Boolean).join("\n");
  const draftEntry = record.drafts[record.drafts.length - 1];
  const blocks: SlackBlock[] = [
    { type: "header", text: slackPlainText(`📮 リード資料 ${materialStatusLabel(record.status)} — ${materialTitle(payload)}`) },
    {
      type: "section",
      text: slackMrkdwn("*Next*: 内容を確認し「承認して送信」か「修正を依頼」を押してください。承認まで送信されません。"),
    },
    { type: "section", fields },
  ];
  if (warning) {
    blocks.push({ type: "section", text: slackMrkdwn(`*⚠️ 行き違い候補*\n${slackText(warning)}`) });
  }
  blocks.push({
    type: "actions",
    block_id: `material_variant:${payload.sessionId}`,
    elements: [
      {
        type: "static_select",
        action_id: "material_variant",
        placeholder: slackPlainText("文面タイプ"),
        initial_option: {
          text: slackPlainText(materialVariantLabel(record.variant)),
          value: record.variant,
        },
        options: materialVariantOptions(record.variant).map(({ text, value }) => ({ text, value })),
      },
    ],
  });
  if (record.status === "generating" || record.status === "revising") {
    blocks.push({ type: "section", text: slackMrkdwn("資料を生成しています。完了後にこのカードを更新します。") });
  } else if (draftEntry?.warning) {
    blocks.push({ type: "section", text: slackMrkdwn(`*⚠️* ${slackText(draftEntry.warning)}`) });
  }
  if (latestDraft(record)) {
    blocks.push({ type: "section", text: slackMrkdwn(materialSlackPreview(env, record)) });
  } else if (record.status === "failed") {
    blocks.push({ type: "section", text: slackMrkdwn(`*⚠️ 失敗*: ${slackText(record.failedError || "生成または送信に失敗しました。")}`) });
  }

  const actionElements: Record<string, unknown>[] = [];
  if (record.status === "pending" && record.drafts.length <= MATERIAL_MAX_REVISIONS) {
    actionElements.push(
      { type: "button", style: "primary", text: slackPlainText("承認して送信"), action_id: "material_approve", value: payload.sessionId },
      { type: "button", text: slackPlainText("修正を依頼"), action_id: "material_revise", value: payload.sessionId },
      { type: "button", style: "danger", text: slackPlainText("今回は送らない"), action_id: "material_discard", value: payload.sessionId },
    );
  } else if (record.status === "failed") {
    const retryLabel = record.failedPhase === "send" && latestDraft(record) ? "再送" : "再生成";
    actionElements.push(
      { type: "button", style: "primary", text: slackPlainText(retryLabel), action_id: "material_retry", value: payload.sessionId },
      { type: "button", style: "danger", text: slackPlainText("今回は送らない"), action_id: "material_discard", value: payload.sessionId },
    );
  } else if (record.status === "pending") {
    actionElements.push(
      { type: "button", style: "danger", text: slackPlainText("今回は送らない"), action_id: "material_discard", value: payload.sessionId },
    );
    blocks.push({ type: "section", text: slackMrkdwn("修正上限に達しました。手書きでの送信をおすすめします。") });
  }
  if (actionElements.length) blocks.push({ type: "actions", elements: actionElements });
  blocks.push({
    type: "context",
    elements: [
      slackMrkdwn([
        `session: ${slackText(compactSession(payload.sessionId))}`,
        `文面: ${slackText(materialVariantLabel(record.variant))}`,
        "送信前にカレンダーをご確認ください（予約が見えるのは人間だけです）",
        "承認するまで自動送信されません",
      ].join("  |  ")),
    ],
  });
  return blocks;
}

async function postMaterialCard(env: Env, record: MaterialRecord) {
  try {
    const result = await slackApi(env, "chat.postMessage", {
      channel: env.SLACK_APPROVAL_CHANNEL_ID,
      ...materialCardPayload(env, record),
    });
    if (result.channel && result.ts) {
      record.slack = { channel: result.channel, ts: result.ts };
      record.slackWebhookOnly = false;
      await writeMaterialRecord(env, record);
    }
  } catch (error) {
    if (!env.SLACK_WEBHOOK_URL) throw error;
    record.slackWebhookOnly = true;
    if (record.status !== "generating" && record.status !== "revising") {
      await postMaterialCardWebhook(env, record);
      record.slackWebhookCardPosted = true;
    }
    await writeMaterialRecord(env, record);
  }
}

async function updateMaterialCard(env: Env, record: MaterialRecord) {
  if (record.slack) {
    await slackApi(env, "chat.update", {
      channel: record.slack.channel,
      ts: record.slack.ts,
      ...materialCardPayload(env, record),
    });
    return;
  }
  if (await replaceMaterialCardWithResponseUrl(env, record)) return;
  if (!record.slackWebhookOnly || record.slackWebhookCardPosted) return;
  if (record.status === "generating" || record.status === "revising") return;
  await postMaterialCardWebhook(env, record);
  record.slackWebhookCardPosted = true;
  await writeMaterialRecord(env, record);
}

async function postMaterialThread(env: Env, record: MaterialRecord, text: string) {
  if (!record.slack) return;
  await slackApi(env, "chat.postMessage", {
    channel: record.slack.channel,
    thread_ts: record.slack.ts,
    text,
    unfurl_links: false,
    unfurl_media: false,
  });
}

async function startMaterialFlow(env: Env, payload: LeadBody) {
  if (!materialApprovalEnabled(env) || !payload.email || !payload.consent) return false;
  const existing = await readMaterialRecord(env, payload.sessionId);
  if (existing) return true;
  const now = new Date().toISOString();
  const record: MaterialRecord = {
    status: "generating",
    rev: 0,
    variant: "normal",
    variantSuggested: "normal",
    overlap: { booked: false, bookingClick: false, sameEmail: false, sameDomain: false },
    context: payload,
    drafts: [],
    createdAt: now,
    updatedAt: now,
  };
  await writeMaterialRecord(env, record);
  await updateNotionMaterialStatus(env, payload.sessionId, "generating").catch(() => false);
  try {
    await postMaterialCard(env, record);
    record.overlap = await detectMaterialOverlap(env, payload);
    record.variantSuggested = suggestedVariant(record.overlap);
    record.variant = record.variantSuggested;
    await writeMaterialRecord(env, record);
    const draft = await generateMaterialDraft(env, record);
    record.rev = draft.rev;
    record.drafts.push(draft);
    record.status = draft.mode === "failed" || !draft.draft ? "failed" : "pending";
    record.failedPhase = record.status === "failed" ? "generation" : undefined;
    record.failedError = record.status === "failed" ? draft.warning || "material generation failed" : undefined;
    await writeMaterialRecord(env, record);
    await updateNotionMaterialStatus(env, payload.sessionId, record.status).catch(() => false);
    await updateMaterialCard(env, record);
    return record.status === "pending";
  } catch (error) {
    record.status = "failed";
    record.failedPhase = "flow";
    record.failedError = error instanceof Error ? error.message : "material flow failed";
    await writeMaterialRecord(env, record);
    await updateNotionMaterialStatus(env, payload.sessionId, "failed").catch(() => false);
    await updateMaterialCard(env, record).catch(() => undefined);
    return false;
  }
}

async function approveMaterial(env: Env, sessionId: string, userId: string, retry = false) {
  const record = await readMaterialRecord(env, sessionId);
  if (!record) return;
  const canApprove = record.status === "pending";
  const canRetrySend = retry && record.status === "failed" && record.failedPhase === "send" && Boolean(latestDraft(record));
  if (record.sentAt || (!canApprove && !canRetrySend)) {
    return;
  }
  const approvalRunId = crypto.randomUUID();
  record.status = "approved_sending";
  record.approvedBy = userId;
  record.approvalRunId = approvalRunId;
  record.failedPhase = undefined;
  record.failedError = undefined;
  await writeMaterialRecord(env, record);
  const locked = await readMaterialRecord(env, sessionId);
  if (!locked || locked.status !== "approved_sending" || locked.approvalRunId !== approvalRunId || locked.sentAt) {
    return;
  }
  await updateMaterialCard(env, locked).catch(() => undefined);
  try {
    const sent = await sendMaterialEmail(env, locked);
    if (!sent) throw new Error("Material email transport is not configured");
    locked.status = "sent";
    locked.sentAt = new Date().toISOString();
    locked.failedPhase = undefined;
    locked.failedError = undefined;
    await writeMaterialRecord(env, locked);
  } catch (error) {
    locked.status = "failed";
    locked.failedPhase = "send";
    locked.failedError = error instanceof Error ? error.message : "send failed";
    await writeMaterialRecord(env, locked);
    await updateNotionMaterialStatus(env, sessionId, "failed").catch(() => false);
    await updateMaterialCard(env, locked).catch(() => undefined);
    return;
  }
  await updateNotionMaterialStatus(env, sessionId, "sent", locked.sentAt).catch(() => false);
  await postMaterialThread(env, locked, `送信済み / by <@${userId}> / ${materialVariantLabel(locked.variant)}`).catch(() => undefined);
  await updateMaterialCard(env, locked).catch(() => undefined);
}

async function retryMaterial(env: Env, sessionId: string, userId: string) {
  const record = await readMaterialRecord(env, sessionId);
  if (!record || record.sentAt || record.status !== "failed") return;
  if (record.failedPhase === "send" && latestDraft(record)) {
    await approveMaterial(env, sessionId, userId, true);
    return;
  }

  record.status = "revising";
  record.failedPhase = undefined;
  record.failedError = undefined;
  await writeMaterialRecord(env, record);
  await updateNotionMaterialStatus(env, sessionId, "revising").catch(() => false);
  await updateMaterialCard(env, record).catch(() => undefined);
  await postMaterialThread(env, record, `再生成 / by <@${userId}>`);
  const draft = await generateMaterialDraft(env, record, "前回の生成失敗から再試行");
  record.rev = draft.rev;
  record.drafts.push(draft);
  record.status = draft.mode === "failed" || !draft.draft ? "failed" : "pending";
  record.failedPhase = record.status === "failed" ? "generation" : undefined;
  record.failedError = record.status === "failed" ? draft.warning || "material generation failed" : undefined;
  await writeMaterialRecord(env, record);
  await updateNotionMaterialStatus(env, sessionId, record.status).catch(() => false);
  await updateMaterialCard(env, record);
}

async function discardMaterial(env: Env, sessionId: string, userId: string) {
  const record = await readMaterialRecord(env, sessionId);
  if (!record || record.sentAt) return;
  record.status = "discarded";
  record.discardedBy = userId;
  await writeMaterialRecord(env, record);
  await updateNotionMaterialStatus(env, sessionId, "discarded").catch(() => false);
  await postMaterialThread(env, record, `見送り / by <@${userId}>`);
  await updateMaterialCard(env, record);
}

async function reviseMaterial(env: Env, sessionId: string, userId: string, instruction: string, variant?: MaterialVariant) {
  const record = await readMaterialRecord(env, sessionId);
  if (!record || record.sentAt || record.drafts.length >= MATERIAL_MAX_REVISIONS) return;
  if (variant) record.variant = variant;
  record.status = "revising";
  await writeMaterialRecord(env, record);
  await updateNotionMaterialStatus(env, sessionId, "revising").catch(() => false);
  await updateMaterialCard(env, record).catch(() => undefined);
  await postMaterialThread(env, record, `rev${record.rev} → rev${record.rev + 1} / by <@${userId}> / 指示: ${slackText(instruction, "修正指示")}`);
  const draft = await generateMaterialDraft(env, record, instruction);
  record.rev = draft.rev;
  record.drafts.push(draft);
  record.status = draft.mode === "failed" || !draft.draft ? "failed" : "pending";
  record.failedPhase = record.status === "failed" ? "generation" : undefined;
  record.failedError = record.status === "failed" ? draft.warning || "material generation failed" : undefined;
  await writeMaterialRecord(env, record);
  await updateNotionMaterialStatus(env, sessionId, record.status).catch(() => false);
  await updateMaterialCard(env, record);
}

async function updateMaterialVariant(env: Env, sessionId: string, variant: MaterialVariant) {
  const record = await readMaterialRecord(env, sessionId);
  if (!record || record.sentAt) return;
  record.variant = variant;
  await writeMaterialRecord(env, record);
  await updateMaterialCard(env, record);
}

function allowedApprover(env: Env, userId?: string) {
  const configured = env.SLACK_APPROVER_IDS?.split(",").map((value) => value.trim()).filter(Boolean) || [];
  if (!configured.length) return true;
  return Boolean(userId && configured.includes(userId));
}

function slackAck(body: unknown = "") {
  if (typeof body === "string") return new Response(body, { status: 200 });
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function timingSafeEqualString(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a[index] ^ b[index];
  return diff === 0;
}

async function slackSignatureValid(request: Request, env: Env, rawBody: string) {
  if (!env.SLACK_SIGNING_SECRET) return false;
  const timestamp = request.headers.get("X-Slack-Request-Timestamp") || "";
  const signature = request.headers.get("X-Slack-Signature") || "";
  const timestampSeconds = Number(timestamp);
  if (!timestampSeconds || Math.abs(Date.now() / 1000 - timestampSeconds) > 60 * 5) return false;
  const base = `v0:${timestamp}:${rawBody}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SLACK_SIGNING_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(base));
  const hex = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return timingSafeEqualString(`v0=${hex}`, signature);
}

function parseSlackPayload(rawBody: string) {
  const payload = new URLSearchParams(rawBody).get("payload");
  if (!payload) throw new Error("Slack payload is missing");
  return JSON.parse(payload) as {
    type?: string;
    trigger_id?: string;
    response_url?: string;
    user?: { id?: string };
    channel?: { id?: string };
    message?: { ts?: string };
    actions?: Array<{ action_id?: string; block_id?: string; value?: string; selected_option?: { value?: string } }>;
    view?: {
      private_metadata?: string;
      state?: { values?: Record<string, Record<string, { value?: string; selected_option?: { value?: string } }>> };
    };
  };
}

async function rememberSlackResponseUrl(env: Env, sessionId: string, responseUrl?: string) {
  if (!sessionId || !responseUrl) return;
  const record = await readMaterialRecord(env, sessionId);
  if (!record) return;
  record.slackResponseUrl = responseUrl;
  await writeMaterialRecord(env, record);
}

function materialVariantFrom(value?: string): MaterialVariant | undefined {
  if (value === "normal" || value === "booked_confirmed" || value === "booking_in_progress" || value === "other_channel") {
    return value;
  }
  return undefined;
}

function sessionIdFromSlackAction(action?: { block_id?: string; value?: string }) {
  if (action?.value) return action.value;
  const blockId = action?.block_id || "";
  return blockId.startsWith("material_variant:") ? blockId.slice("material_variant:".length) : "";
}

function revisionInstructionFromView(view?: {
  state?: { values?: Record<string, Record<string, { value?: string }>> };
}) {
  const values = view?.state?.values || {};
  for (const block of Object.values(values)) {
    for (const action of Object.values(block)) {
      if (typeof action.value === "string" && action.value.trim()) return action.value.trim().slice(0, 1200);
    }
  }
  return "";
}

async function openRevisionModal(env: Env, triggerId: string, sessionId: string, currentVariant: MaterialVariant) {
  await slackApi(env, "views.open", {
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: "material_revision",
      title: slackPlainText("資料の修正依頼"),
      submit: slackPlainText("再生成する"),
      close: slackPlainText("閉じる"),
      private_metadata: JSON.stringify({ sessionId }),
      blocks: [
        {
          type: "input",
          block_id: "instruction_block",
          label: slackPlainText("修正指示"),
          element: {
            type: "plain_text_input",
            action_id: "instruction",
            multiline: true,
            placeholder: slackPlainText("例）事例の話を先頭に。もっと短く。経理向けのシーンに差し替え。"),
          },
        },
        {
          type: "input",
          block_id: "variant_block",
          label: slackPlainText("文面タイプ"),
          optional: true,
          element: {
            type: "static_select",
            action_id: "variant",
            initial_option: {
              text: slackPlainText(materialVariantLabel(currentVariant)),
              value: currentVariant,
            },
            options: materialVariantOptions(currentVariant).map(({ text, value }) => ({ text, value })),
          },
        },
      ],
    },
  });
}

async function handleSlackInteraction(request: Request, env: Env, ctx: WorkerExecutionContext) {
  const rawBody = await request.text();
  if (!(await slackSignatureValid(request, env, rawBody))) {
    return new Response("invalid signature", { status: 401 });
  }
  const payload = parseSlackPayload(rawBody);
  const userId = payload.user?.id || "";
  if (!allowedApprover(env, userId)) return slackAck("not allowed");

  if (payload.type === "block_actions") {
    const action = payload.actions?.[0];
    const actionId = action?.action_id;
    const sessionId = sessionIdFromSlackAction(action);
    if (sessionId && payload.response_url) {
      await rememberSlackResponseUrl(env, sessionId, payload.response_url);
    }
    if (actionId === "material_variant") {
      const variant = materialVariantFrom(action?.selected_option?.value);
      if (variant) ctx.waitUntil(updateMaterialVariant(env, sessionId, variant));
      return slackAck();
    }
    if (actionId === "material_revise" && payload.trigger_id) {
      const record = await readMaterialRecord(env, sessionId);
      await openRevisionModal(env, payload.trigger_id, sessionId, record?.variant || "normal");
      return slackAck();
    }
    if (actionId === "material_approve") {
      ctx.waitUntil(approveMaterial(env, sessionId, userId));
      return slackAck();
    }
    if (actionId === "material_retry") {
      ctx.waitUntil(retryMaterial(env, sessionId, userId));
      return slackAck();
    }
    if (actionId === "material_discard") {
      ctx.waitUntil(discardMaterial(env, sessionId, userId));
      return slackAck();
    }
  }

  if (payload.type === "view_submission") {
    const metadata = payload.view?.private_metadata ? JSON.parse(payload.view.private_metadata) as { sessionId?: string } : {};
    const sessionId = metadata.sessionId || "";
    const instruction = revisionInstructionFromView(payload.view);
    const variantBlock = payload.view?.state?.values?.variant_block?.variant?.selected_option?.value;
    const variant = materialVariantFrom(variantBlock);
    if (sessionId && instruction) ctx.waitUntil(reviseMaterial(env, sessionId, userId, instruction, variant));
    return slackAck({ response_action: "clear" });
  }

  return slackAck();
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
  const useMaterialApproval = payload.action === "capture_lead" &&
    Boolean(payload.email && payload.consent) &&
    materialApprovalEnabled(env);
  const dryRun = !env.NOTION_TOKEN && !env.SLACK_WEBHOOK_URL && !materialApprovalEnabled(env);
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
    useMaterialApproval ? Promise.resolve(false) : notifySlack(env, payload),
  ]);

  if (notionResult.status === "fulfilled") {
    result.notionSaved = notionResult.value;
  } else {
    result.integrationErrors.push(
      notionResult.reason instanceof Error ? notionResult.reason.message : "Notion save failed",
    );
  }

  if (slackResult.status === "fulfilled") {
    result.slackNotified = useMaterialApproval || slackResult.value;
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
    if (useMaterialApproval) {
      const task = startMaterialFlow(env, payload).catch((error) => {
        console.error(JSON.stringify({
          event: "material_flow_failed",
          sessionId: payload.sessionId,
          error: error instanceof Error ? error.message : "unknown error",
        }));
      });
      if (ctx) ctx.waitUntil(task);
      else void task;
      result.slackNotified = true;
    }
  }

  return result;
}

async function handleAnalyze(body: AnalyzeBody, env: Env) {
  const companyUrl = normalizeCompanyUrl(body.companyUrl);
  try {
    const { text: websiteText, thin } = await fetchWebsiteText(companyUrl);
    // D方針: fetch薄（120字未満）は業種断定を避け、誠実generic mockで正直に伝える。
    // 120字以上ならDeepSeekは呼ぶが、systemに「観測はmeta由来に限定」の1行を追加する（thinフラグ）。
    if (thin && websiteText.length < 120) {
      return { ok: true, analysis: honestThinMockAnalysis(companyUrl) };
    }
    const analysis = await callDeepSeek(env, companyUrl, websiteText, thin);
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
    if (url.pathname === "/slack/interactions") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      return handleSlackInteraction(request, env, ctx);
    }

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
