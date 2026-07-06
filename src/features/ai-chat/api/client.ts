import type {
  AiChatAnalysis,
  AiProposal,
  AnalyzeRequest,
  AnalyzeResponse,
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
      `${domain} の公開サイトをもとに、問い合わせ・集客・現場業務の改善余地を仮説化しました。`,
    signals: [
      `企業サイト: ${domain} を確認`,
      "問い合わせ導線とサービス説明の有無を確認",
      "売上向上・工数削減・現場実装の3軸で整理",
    ],
    proposals: [
      {
        axis: "top_line",
        title: "問い合わせ前の不安をAIでほどき、相談化率を高める",
        body:
          "サイト訪問者の状況に合わせて提案を出し分け、問い合わせ前の疑問に即時回答する導線を作ります。",
        rationale: "TOP LINEを伸ばす施策として、商談前の温度感を上げます。",
      },
      {
        axis: "bottom_line",
        title: "一次対応と定型確認をAIに寄せ、対応工数を減らす",
        body:
          "よくある質問、予約前確認、資料請求の初動をAIが受け、担当者は判断が必要な会話に集中します。",
        rationale: "BOTTOM LINEを削る施策として、反復対応を圧縮します。",
      },
      {
        axis: "fde",
        title: "現場の業務フローに合わせて小さく実装し、運用まで残す",
        body:
          "既存のフォーム、Slack、Notion、社内DBなどに合わせ、使われる状態までエンジニアが伴走します。",
        rationale: "FDEとして、PoCで終わらせず実運用に接続します。",
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

/** LLM生成が失敗した時の決定論フォールバック・プラン(§3.5)。事例カードは別で表示可。 */
export function createMockFocusPlan(request: DeepenRequest): FocusPlan {
  const axis =
    request.painPoint === "other"
      ? request.proposals[0]?.axis ?? "top_line"
      : painToAxis[request.painPoint];
  return {
    schemaVersion: "1.0",
    restatement: "いただいた課題を軸に、まず小さく始めて確かめる進め方を用意しました。",
    chosenAxis: axis,
    steps: [
      { phase: "1〜2週目", action: "現状の業務を一緒に棚卸しし、AIで効く一点を決める。" },
      { phase: "3〜6週目", action: "その一点を小さく実装し、現場で使える形にして回す。" },
      { phase: "その後", action: "効果を見ながら横に広げ、社内に定着・内製化する。" },
    ],
    roles: {
      honkoma: "設計・実装・現場への伴走をエンジニアが担当します。",
      client: "現場の実情の共有と、試す時間の確保をお願いします。",
    },
    prerequisites: "今使っているツール(Slack/表計算/基幹など)と、対象業務の担当者。",
    agenda: ["いちばん効く一点はどこか", "誰が運用を持てるか", "最初の2週間で何を試すか"],
    riskNote: "現場が使わない仕組みは残らない。小さく始めて、使われる形から広げます。",
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
