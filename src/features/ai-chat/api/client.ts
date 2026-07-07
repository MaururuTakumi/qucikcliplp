import type {
  AiChatAnalysis,
  AiProposal,
  AnalyzeRequest,
  AnalyzeResponse,
  ContactPartialPayload,
  ContactFormPayload,
  DeepenRequest,
  DeepenResponse,
  FocusPlan,
  LeadPayload,
  LeadResponse,
  PainCategory,
  PartialLeadPayload,
  ProposalAxis,
} from "../types";

const DEFAULT_ENDPOINT = "/api/ai-chat";
const REQUEST_TIMEOUT_MS = 18_000;
/* deepen は DeepSeek(プラン生成)＋Notion事例RAG検索＋検証/リトライを挟むため
 * analyze より長い。18秒だと本物のプランが間に合わず汎用フォールバックに落ちる
 * ケースが出ていたため延長。 */
const DEEPEN_TIMEOUT_MS = 45_000;

const axisLabels: Record<ProposalAxis, string> = {
  top_line: "TOP LINE",
  bottom_line: "BOTTOM LINE",
  fde: "FDE",
};

function apiEndpoint() {
  return import.meta.env.VITE_AI_CHAT_API_URL || DEFAULT_ENDPOINT;
}

function domainFromUrl(companyUrl: string) {
  try {
    return new URL(normalizeCompanyUrl(companyUrl)).hostname.replace(/^www\./, "");
  } catch {
    return "御社";
  }
}

export function normalizeCompanyUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function proposalsToText(proposals: AiProposal[]) {
  return proposals
    .map((proposal, index) => {
      const axis = axisLabels[proposal.axis];
      return `${index + 1}. ${axis}: ${proposal.title} - ${proposal.body}`;
    })
    .join("\n");
}

export function createMockAnalysis(companyUrl: string): AiChatAnalysis {
  const domain = domainFromUrl(companyUrl);
  return {
    companyName: domain,
    analyzedSummary:
      `${domain} の公開サイトを起点に、問い合わせ前の迷いと反復対応の受け皿を仮説化しました。`,
    signals: [
      `公開サイト: ${domain}`,
      "問い合わせ前の相談入口",
      "反復対応と社内データの接続余地",
    ],
    proposals: [
      {
        axis: "top_line",
        title: `${domain}の問い合わせ前相談をAIが受ける`,
        body:
          "公開サイトを見た人が、問い合わせ前に聞きたいことをAIが受けます。営業や担当者へ渡す前に、課題と温度感をそろえます。",
        rationale: `${domain}の公開サイトから。`,
      },
      {
        axis: "bottom_line",
        title: "よくある質問と初動連絡をAIに寄せる",
        body:
          "問い合わせの初動には、同じ確認が繰り返し出ます。AIが要件と質問を先に受け、人は判断が必要な会話に集中します。",
        rationale: "問い合わせ前の相談入口から。",
      },
      {
        axis: "fde",
        title: "問い合わせと社内メモをAIが読める基盤にまとめる",
        body:
          "フォーム、Slack、Notion、社内DBが分かれると、対応の質が人の記憶に寄ります。AIが読める基盤に集め、次の対応へ使える状態を作ります。",
        rationale: "反復対応と社内データの接続余地から。",
      },
    ],
    reportTeaser:
      "選んだ課題に合わせ、優先順位・導入ステップ・確認すべきデータを含む診断レポートに整理できます。",
    shareUrl: `${window.location.origin}/contact?ai_chat=${encodeURIComponent(domain)}`,
    mode: "mock",
  };
}

async function postJson<TBody, TResponse>(
  body: TBody,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<TResponse> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(apiEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("application/json")) {
      throw new Error(`AI chat API returned ${response.status}`);
    }

    return (await response.json()) as TResponse;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function analyzeCompany(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  try {
    const result = await postJson<
      AnalyzeRequest & { action: "analyze" },
      AnalyzeResponse
    >({ ...request, action: "analyze" });

    if (result.ok) return result;
    return {
      ok: false,
      error: result.error,
      fallbackAnalysis: result.fallbackAnalysis,
    };
  } catch (error) {
    const technicalMessage = error instanceof Error ? error.message : "";
    return {
      ok: false,
      error: technicalMessage.includes("404")
        ? "AI接続が未設定のため、ローカル診断で続行しています。"
        : "AI接続が不安定なため、ローカル診断で続行しています。",
      fallbackAnalysis: createMockAnalysis(request.companyUrl),
    };
  }
}

/* 課題→軸の対応(contact-funnel-v2 §2.3)。決定論のエコーバック/フォールバックに使用。 */
const painToAxis: Record<PainCategory, ProposalAxis> = {
  staffing: "fde",
  support: "bottom_line",
  backoffice: "bottom_line",
  sales: "top_line",
  data: "fde",
  other: "top_line",
};

function safeMockFocusTerm(value?: string) {
  const text = (value || "")
    .replace(/```/g, "")
    .replace(/\b\d+\s*(%|％)\b/g, "一定割合")
    .trim()
    .slice(0, 30);
  if (!text) return "";
  if (/必ず|保証|断言|確実に|残枠|カウントダウン|BUYSELL|BuySell|バイセル|SOBLUE|FIKA|貞栄会|慶洋/.test(text)) {
    return "";
  }
  return text;
}

function mockDataFoundationRequired(request: DeepenRequest) {
  const text = [
    request.painPointRaw || "",
    ...(request.signals || []),
    request.analyzedSummary,
    ...request.proposals.flatMap((proposal) => [proposal.title, proposal.body, proposal.rationale]),
  ].join(" ");
  const hasScatterCue = /複数(媒体|チャネル|店舗|拠点|窓口)|Excel|エクセル|スプレッドシート|紙|台帳|帳票|記録.*分|データ.*散/.test(text);
  const mediaChannelCount = [
    /LINE|ライン/.test(text),
    /Instagram|インスタ|SNS|媒体|チャネル/.test(text),
    /店舗|拠点/.test(text),
  ].filter(Boolean).length;
  return request.painPoint === "data" || hasScatterCue || mediaChannelCount >= 2;
}

/** LLM生成が失敗した時の決定論フォールバック・プラン(§3.5)。事例カードは別で表示可。 */
export function createMockFocusPlan(request: DeepenRequest): FocusPlan {
  const axis =
    request.painPoint === "other"
      ? request.proposals[0]?.axis ?? "top_line"
      : painToAxis[request.painPoint];
  const term = safeMockFocusTerm(request.painPointRaw) ||
    safeMockFocusTerm(request.signals?.[0]) ||
    safeMockFocusTerm(request.proposals.find((proposal) => proposal.axis === axis)?.title) ||
    "公開サイトの相談入口";
  const needsData = mockDataFoundationRequired(request);
  const dataNote = needsData ? " 複数窓口や記録はAIが読めるデータ基盤へ集めます。" : "";
  return {
    schemaVersion: "1.0",
    restatement: `「${term}」を起点に、AIが先に受ける範囲と人が見る範囲を分けます`.slice(0, 80),
    chosenAxis: axis,
    steps: [
      { phase: "1〜2週目", action: `${term}に関係する問い合わせ、資料、判断基準の置き場を特定します` },
      { phase: "3〜6週目", action: `AIが読める共通基盤に必要情報を集め、担当者が自分で聞ける導線を作ります` },
      { phase: "その後", action: `使われた質問と回答をもとに、次にAIへ任せる業務面を広げます` },
    ],
    roles: {
      honkoma: "AI窓口、共通基盤、既存ツールへの接続まで設計・実装します。",
      client: "過去の問い合わせ、資料、例外時に人が見る判断基準を共有します。",
    },
    prerequisites: (`今使っているツール、対象業務の担当者、過去の問い合わせや資料。${dataNote}`).slice(0, 100),
    agenda: [
      "同じ質問は週にどれくらい来ていますか",
      "判断に必要な情報は今どこにありますか",
      "人が見るべき例外は何ですか",
    ],
    riskNote: `期間は目安です。初回は${term}に範囲を絞って始めます。`.slice(0, 80),
  };
}

export async function deepenCompany(request: DeepenRequest): Promise<DeepenResponse> {
  try {
    const result = await postJson<DeepenRequest & { action: "deepen" }, DeepenResponse>(
      { ...request, action: "deepen" },
      DEEPEN_TIMEOUT_MS,
    );
    if (result.ok) return result;
    return {
      ok: false,
      error: result.error,
      fallbackFocusPlan: result.fallbackFocusPlan ?? createMockFocusPlan(request),
      matchedCase: result.matchedCase ?? null,
    };
  } catch (error) {
    const technicalMessage = error instanceof Error ? error.message : "";
    return {
      ok: false,
      error: technicalMessage.includes("404")
        ? "AI接続が未設定のため、ローカルで進め方を組み立てました。"
        : "AI接続が不安定なため、ローカルで進め方を組み立てました。",
      fallbackFocusPlan: createMockFocusPlan(request),
      matchedCase: null,
    };
  }
}

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  try {
    return await postJson<LeadPayload & { action: "capture_lead" }, LeadResponse>({
      ...payload,
      action: "capture_lead",
    });
  } catch (error) {
    return {
      ok: true,
      dryRun: true,
      notionSaved: false,
      slackNotified: false,
      emailSent: false,
      error: error instanceof Error ? error.message : "Lead API unavailable",
    };
  }
}

export async function submitPartialLead(payload: PartialLeadPayload): Promise<LeadResponse> {
  try {
    return await postJson<
      PartialLeadPayload & { action: "partial_lead" },
      LeadResponse
    >(
      {
        ...payload,
        action: "partial_lead",
      },
      8_000,
    );
  } catch {
    return { ok: true, dryRun: true };
  }
}

export async function submitContactFormNotification(payload: ContactFormPayload): Promise<LeadResponse> {
  try {
    return await postJson<ContactFormPayload & { action: "contact_form" }, LeadResponse>(
      {
        ...payload,
        action: "contact_form",
      },
      8_000,
    );
  } catch (error) {
    return {
      ok: true,
      dryRun: true,
      slackNotified: false,
      error: error instanceof Error ? error.message : "Contact form notification unavailable",
    };
  }
}

export function submitContactPartialLead(payload: ContactPartialPayload): boolean {
  const body = JSON.stringify({
    ...payload,
    action: "contact_partial",
  });
  const endpoint = apiEndpoint();

  try {
    if (navigator.sendBeacon) {
      return navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    }
  } catch {
    // Fall back to keepalive fetch below.
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
  return true;
}
