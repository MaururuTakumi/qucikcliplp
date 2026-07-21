#!/usr/bin/env node
/* =============================================================================
 * diagnose-eval.mjs — AI診断アウトプットの一括評価ハーネス
 *
 * 各社URLを本番Worker(analyze+deepen)に通し、出力をMarkdownレポートとJSONに
 * まとめる。fableへの提出用。汎用/固有・fallback/model・データ基盤発火などを
 * 機械的にフラグ付けする(最終判断はfable)。
 *
 * 使い方:
 *   node scripts/diagnose-eval.mjs                    # 既定10社
 *   node scripts/diagnose-eval.mjs companies.json     # {url,pain,label}[] を渡す
 *
 * 出力:
 *   <outDir>/diagnosis-eval.md    人が読む一覧＋自動フラグ
 *   <outDir>/diagnosis-eval.json  生データ(fable/後工程用)
 * ========================================================================== */

const WORKER = process.env.WORKER_URL || "https://honkoma-ai-chat.quickclip.workers.dev/api/ai-chat";
const OUT_DIR = process.env.OUT_DIR || ".";
const fs = await import("node:fs/promises");
const path = await import("node:path");

/* 既定の評価対象10社(業種を散らす。painはdeepen検証用に代表課題を割当) */
const DEFAULT_COMPANIES = [
  { url: "https://buysell-technologies.com/", pain: "support", label: "リユース買取(バイセル)" },
  { url: "https://www.hinokiya.jp/", pain: "sales", label: "注文住宅(桧家住宅)" },
  { url: "https://smarthr.jp/", pain: "support", label: "HR SaaS(SmartHR)" },
  { url: "https://www.komeda.co.jp/", pain: "staffing", label: "飲食FC(コメダ珈琲)" },
  { url: "https://www.tsukui.net/", pain: "staffing", label: "介護(ツクイ)" },
  { url: "https://www.freee.co.jp/", pain: "sales", label: "会計SaaS(freee)" },
  { url: "https://www.seino.co.jp/", pain: "backoffice", label: "物流(セイノー)" },
  { url: "https://www.snowpeak.co.jp/", pain: "data", label: "アウトドアEC(スノーピーク)" },
  { url: "https://www.qbhouse.co.jp/", pain: "staffing", label: "理美容(QBハウス)" },
  { url: "https://www.tsuruha.co.jp/", pain: "data", label: "ドラッグストア(ツルハ)" },
];

const BANNED_STEP_WORDS = ["現状把握", "現状分析", "最適化設計", "運用定着", "試作", "運用化"];

async function post(body, timeoutMs = 75000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(WORKER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const json = await res.json();
    return { ok: res.ok, json };
  } catch (e) {
    return { ok: false, error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

/* サイト由来固有語がproposalに載っているかの機械判定(緩い近似)。
 * signals由来の語(テンプレ語を除く)がtitle/bodyに現れるか。 */
function specificityFlags(a) {
  const signals = a.signals || [];
  const proposals = a.proposals || [];
  const termPool = signals
    .flatMap((s) => s.replace(/[を、。／\/]/g, " ").split(/\s+/))
    .filter((w) => w.length >= 2 && !/確認|掲載|あり|情報|ページ|窓口/.test(w));
  const proposalsWithTerm = proposals.filter((p) =>
    termPool.some((w) => (p.title || "").includes(w) || (p.body || "").includes(w)),
  ).length;
  const genericSignals = signals.filter((s) => /確認|の有無/.test(s)).length;
  return {
    signalCount: signals.length,
    genericSignalCount: genericSignals,
    proposalsWithSiteTerm: proposalsWithTerm,
    proposalTotal: proposals.length,
  };
}

function planFlags(fp) {
  if (!fp) return { hasPlan: false };
  const steps = fp.steps || [];
  const stepText = steps.map((s) => `${s.phase || ""} ${s.action || ""}`).join(" ");
  const bannedHit = BANNED_STEP_WORDS.filter((w) => stepText.includes(w));
  const phaseOk = steps.every((s) => /週目|その後/.test(s.phase || ""));
  const planText = JSON.stringify(fp);
  return {
    hasPlan: true,
    bannedWordHits: bannedHit,
    phaseLabelsOk: phaseOk,
    mentionsDataFoundation: /基盤|散らば|一元|統合|集約/.test(planText),
  };
}

async function runOne(c, i, total) {
  process.stderr.write(`[${i + 1}/${total}] ${c.label} — analyze...\n`);
  const analyzeRes = await post({ action: "analyze", source: "hero", sessionId: `eval-${i}-a`, companyUrl: c.url });
  const analysis = analyzeRes.json?.analysis || analyzeRes.json || {};
  const aMode = analyzeRes.json?.mode || (analysis.signals?.some((s) => /確認|フォールバック|ローカル診断/.test(s)) ? "fallback?" : "model?");

  process.stderr.write(`[${i + 1}/${total}] ${c.label} — deepen(pain=${c.pain})...\n`);
  const deepenRes = await post({
    action: "deepen", source: "hero", sessionId: `eval-${i}-d`, companyUrl: c.url,
    painPoint: c.pain, companySize: "lte300", aiMaturity: "partial",
    analyzedSummary: analysis.analyzedSummary || "",
    signals: analysis.signals || [],
    proposals: analysis.proposals || [],
  });
  const focusPlan = deepenRes.json?.focusPlan || null;
  const dMode = deepenRes.json?.mode || null;

  return {
    ...c,
    analyze: { mode: aMode, ...analysis, _flags: specificityFlags(analysis) },
    deepen: { mode: dMode, focusPlan, _flags: planFlags(focusPlan) },
  };
}

function mdCompany(r, i) {
  const a = r.analyze, f = a._flags;
  const dp = r.deepen.focusPlan, df = r.deepen._flags;
  const L = [];
  L.push(`## ${i + 1}. ${r.label}`);
  L.push(`- URL: ${r.url}`);
  L.push(`- analyze mode: **${a.mode}** / deepen mode: **${r.deepen.mode || "-"}** (pain=${r.pain})`);
  L.push(`- 自動フラグ: signals=${f.signalCount}(汎用${f.genericSignalCount}) / 固有語入りproposal=${f.proposalsWithSiteTerm}/${f.proposalTotal} / plan禁止語=${(df.bannedWordHits || []).join(",") || "なし"} / phase正=${df.phaseLabelsOk} / データ基盤言及=${df.mentionsDataFoundation}`);
  L.push("");
  L.push(`**summary**: ${a.analyzedSummary || "(なし)"}`);
  L.push(`**signals**: ${(a.signals || []).join(" ／ ") || "(なし)"}`);
  L.push("");
  L.push("**3案**:");
  for (const p of a.proposals || []) {
    L.push(`- \`${p.axis}\` **${p.title}**`);
    L.push(`  - ${p.body}`);
    if (p.rationale) L.push(`  - 根拠: ${p.rationale}`);
  }
  L.push("");
  if (dp) {
    L.push(`**進め方プラン(pain=${r.pain})**`);
    L.push(`- restatement: ${dp.restatement || ""}`);
    for (const s of dp.steps || []) L.push(`  - [${s.phase}] ${s.action}`);
    L.push(`- agenda: ${(dp.agenda || []).join(" ／ ")}`);
    L.push(`- riskNote: ${dp.riskNote || ""}`);
    if (dp.caseConnection) L.push(`- caseConnection: ${dp.caseConnection}`);
  } else {
    L.push("**進め方プラン**: (取得失敗)");
  }
  L.push("\n---\n");
  return L.join("\n");
}

async function main() {
  const arg = process.argv[2];
  let companies = DEFAULT_COMPANIES;
  if (arg) companies = JSON.parse(await fs.readFile(arg, "utf8"));

  const results = [];
  for (let i = 0; i < companies.length; i++) {
    results.push(await runOne(companies[i], i, companies.length));
  }

  const header = [
    `# AI診断アウトプット評価 — ${companies.length}社`,
    `Worker: ${WORKER}`,
    "",
    "## 集計",
    "| # | 会社 | analyze | 固有語proposal | plan禁止語 | データ基盤 |",
    "|---|---|---|---|---|---|",
    ...results.map((r, i) => {
      const f = r.analyze._flags, df = r.deepen._flags;
      return `| ${i + 1} | ${r.label} | ${r.analyze.mode} | ${f.proposalsWithSiteTerm}/${f.proposalTotal} | ${(df.bannedWordHits || []).length ? "⚠️" : "0"} | ${df.mentionsDataFoundation ? "✓" : "-"} |`;
    }),
    "",
    "---",
    "",
  ].join("\n");

  const md = header + results.map(mdCompany).join("\n");
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUT_DIR, "diagnosis-eval.md"), md);
  await fs.writeFile(path.join(OUT_DIR, "diagnosis-eval.json"), JSON.stringify(results, null, 2));
  process.stderr.write(`\n✅ 完了: ${path.join(OUT_DIR, "diagnosis-eval.md")}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
