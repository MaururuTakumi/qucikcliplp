import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TELEGRAM_BOT_TOKEN =
  Deno.env.get("TELEGRAM_BOT_TOKEN") ??
  "8777165888:AAFiPB2NaiB0rsA77pX1ImwyuZI8pdhcmYY";
const TELEGRAM_CHAT_ID =
  Deno.env.get("TELEGRAM_CHAT_ID") ?? "5752822568";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { name, email, company, department, inquiryType, message, timestamp } =
      await req.json();

    const text = [
      `<b>【LP問い合わせ】</b>`,
      `<b>名前:</b> ${escapeHtml(name ?? "")}`,
      `<b>会社名:</b> ${escapeHtml(company ?? "")}`,
      `<b>部署:</b> ${escapeHtml(department ?? "")}`,
      `<b>メール:</b> ${escapeHtml(email ?? "")}`,
      `<b>種別:</b> ${escapeHtml(inquiryType ?? "")}`,
      ``,
      `<b>内容:</b>`,
      escapeHtml(message ?? ""),
      ``,
      `<i>送信時刻: ${escapeHtml(timestamp ?? new Date().toISOString())}</i>`,
    ].join("\n");

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    const result = await telegramRes.json();

    return new Response(JSON.stringify({ ok: result.ok }), {
      status: telegramRes.ok ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
