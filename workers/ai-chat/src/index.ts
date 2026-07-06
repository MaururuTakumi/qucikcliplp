type Env = {
  DEEPSEEK_API_KEY?: string;
  XAI_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  NOTION_TOKEN?: string;
  NOTION_LEADS_DB_ID?: string;
  SLACK_WEBHOOK_URL?: string;
  SLACK_NOTIFY_PARTIAL_LEADS?: string;
  ALLOWED_ORIGIN?: string;
};

type ChatSource = "hero" | "float" | "whatwedo" | "cases" | "exit";
type ProposalAxis = "top_line" | "bottom_line" | "fde";

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
  stage: string;
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
};

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_DEFAULT_MODEL = "deepseek-v4-pro";
const NOTION_VERSION = "2022-06-28";

const axisOrder: ProposalAxis[] = ["top_line", "bottom_line", "fde"];

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
    if (content.trim()) return validateAnalysis(extractJson(content), companyUrl);
    lastError = "DeepSeek response did not include content";
  }

  throw new Error(lastError);
}

function richText(text: string) {
  return [{ type: "text", text: { content: text.slice(0, 1900) } }];
}

function titleText(text: string) {
  return [{ type: "text", text: { content: text.slice(0, 180) || "AI chat lead" } }];
}

function notionProperties(payload: LeadBody | PartialLeadBody) {
  const title = payload.companyUrl ? hostnameFor(payload.companyUrl) : payload.email || payload.sessionId;
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
  }) as { results?: Array<{ id: string }> };
  return result.results?.[0]?.id;
}

async function upsertNotionLead(env: Env, payload: LeadBody | PartialLeadBody) {
  if (!env.NOTION_TOKEN || !env.NOTION_LEADS_DB_ID) return false;
  const properties = notionProperties(payload);
  const existingPageId = await findNotionPageBySession(env, payload.sessionId);
  if (existingPageId) {
    await notionFetch(env, `/pages/${existingPageId}`, {
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

async function notifySlack(env: Env, payload: LeadBody | PartialLeadBody) {
  if (!env.SLACK_WEBHOOK_URL) return false;
  const isPartial = payload.action === "partial_lead";
  const notifyPartial = env.SLACK_NOTIFY_PARTIAL_LEADS?.toLowerCase() === "true";
  if (isPartial && !notifyPartial) return false;

  const title = isPartial ? "AI chat partial lead" : "AI chat lead captured";
  const fields = [
    `source: ${payload.source}`,
    `session: ${payload.sessionId}`,
    payload.companyUrl ? `url: ${payload.companyUrl}` : "",
    payload.painPoint ? `pain: ${payload.painPoint}` : "",
    payload.email ? `email: ${payload.email}` : "",
  ].filter(Boolean);

  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `${title}\n${fields.join("\n")}`,
    }),
  });
  if (!response.ok) throw new Error(`Slack webhook failed: ${response.status}`);
  return true;
}

function slackLine(label: string, value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";
  return `${label}: ${value.trim().slice(0, 1200)}`;
}

async function notifyContactFormSlack(env: Env, payload: ContactFormBody) {
  if (!env.SLACK_WEBHOOK_URL) return false;
  const fields = [
    slackLine("種別", payload.inquiryType),
    slackLine("会社名", payload.company),
    slackLine("お名前", payload.name),
    slackLine("メール", payload.email),
    slackLine("従業員数", payload.employeeCount),
    slackLine("内容", payload.message),
    `同意: ${payload.consent ? "yes" : "no"}`,
    slackLine("utm", payload.utm),
    slackLine("referrer", payload.referrer),
  ].filter(Boolean);

  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `通常問い合わせフォーム\n${fields.join("\n")}`,
    }),
  });
  if (!response.ok) throw new Error(`Slack webhook failed: ${response.status}`);
  return true;
}

async function persistContactForm(env: Env, payload: ContactFormBody) {
  const dryRun = !env.SLACK_WEBHOOK_URL;
  const result = {
    ok: true,
    dryRun,
    notionSaved: false,
    slackNotified: false,
    emailSent: false,
    integrationErrors: [] as string[],
  };

  try {
    result.slackNotified = await notifyContactFormSlack(env, payload);
  } catch (error) {
    result.ok = false;
    result.integrationErrors.push(
      error instanceof Error ? error.message : "Contact form Slack notification failed",
    );
  }

  return result;
}

async function persistLead(env: Env, payload: LeadBody | PartialLeadBody) {
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
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || (url.pathname !== "/" && url.pathname !== "/api/ai-chat")) {
      return jsonResponse({ ok: false, error: "Not found" }, request, env, 404);
    }

    try {
      const body = await request.json() as AnalyzeBody | LeadBody | PartialLeadBody | ContactFormBody;
      if (body.action === "analyze") {
        const result = await handleAnalyze(body, env);
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
        });
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
