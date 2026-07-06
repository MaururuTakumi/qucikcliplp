# AIチャット外部セットアップ手順

> 対象: GitHub issue #39 / #40。Secret値はこのファイル、issue、チャット、git管理ファイルに貼らない。値はCloudflare Secretsにだけ投入する。

## 0. 前提

- LLMはDeepSeek APIを使う。
- 既定モデルは `deepseek-v4-pro`。変更する場合だけ `workers/ai-chat/wrangler.toml` の `DEEPSEEK_MODEL` を変える。
- Workerは `workers/ai-chat` にある。
- フロントは `VITE_AI_CHAT_API_URL` があればそこへ、無ければ同一originの `/api/ai-chat` へPOSTする。
- Vercel本番では `vercel.json` のrewriteで `/api/ai-chat` をWorkerへproxyする。
- Secret未設定でもローカルUIはモック診断で動く。

## 1. 用意するSecret

| Secret名 | 用途 |
|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek Chat Completions API |
| `NOTION_TOKEN` | Notion integration secret |
| `NOTION_LEADS_DB_ID` | Notion Inbound Leads DB |
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook |
| `SLACK_NOTIFY_PARTIAL_LEADS` | 任意。`true` の場合だけpartial leadもSlack通知 |

互換移行用にWorkerは `XAI_API_KEY` も読むが、正式には `DEEPSEEK_API_KEY` を使う。

2026-07-06時点で、`DEEPSEEK_API_KEY` / `NOTION_TOKEN` / `NOTION_LEADS_DB_ID` / `SLACK_WEBHOOK_URL` はCloudflare Secretsへ投入済み。

## 2. Notion Leads DB

issue #39 のプロパティ名・型で `Inbound Leads` DBを作成する。DBをNotion integrationにConnection追加し、32桁hexのDB IDを `NOTION_LEADS_DB_ID` として使う。

2026-07-06時点で、Notion MCP経由で `honkoma Vault ハブ` 配下に `Inbound Leads` DBを作成済み。テストレコード1件の作成も成功済み。DB ID値はSecret扱いで、git管理ファイルやチャットには貼らずCloudflare Secretsにだけ投入する。

ただし、Cloudflare Workerから使うNotion API tokenのコネクトには、まだ `Inbound Leads` DBへのアクセス権限がなく、Worker本番URLからの保存は `Notion API failed: 404` になる。DBを対象コネクトへ明示共有してから再検証する。

## 2.5 Slack Incoming Webhook

2026-07-06時点で、Slack app `honkoma-inbound-leads` を `Ltdhonkoma` ワークスペースに作成し、Incoming Webhookを `問い合わせチャンネル` に接続済み。Webhook URLはSecret扱いで、git管理ファイルやチャットには貼らず `SLACK_WEBHOOK_URL` としてCloudflare Secretsにだけ投入する。

Slack通知は原則 `capture_lead` のみ。`partial_lead` はNotion保存用で、問い合わせチャンネルへは流さない。partialもSlackへ流したい場合だけ `SLACK_NOTIFY_PARTIAL_LEADS=true` をCloudflare環境変数に設定する。

## 3. Cloudflare login

```bash
cd workers/ai-chat
npx wrangler login
```

## 4. Secrets投入

```bash
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put NOTION_LEADS_DB_ID
npx wrangler secret put SLACK_WEBHOOK_URL
```

必要に応じて許可originを設定する。

```bash
npx wrangler secret put ALLOWED_ORIGIN
```

例: `https://ltdhonkoma.com`

## 5. Deploy

```bash
npx wrangler deploy
```

2026-07-06時点の本番Worker URL:

```bash
https://honkoma-ai-chat.quickclip.workers.dev
```

2026-07-06時点の最新確認済みdeploy:

```bash
d182d443-9f70-4b81-913c-7a955c309229
```

`vercel.json` では `/api/ai-chat` をこのWorkerへrewrite済み。別ドメインに変更する場合は `vercel.json` のdestinationを更新する。

Vercel rewriteを使わない場合は、Vercel/Cloudflare Pages側でフロント環境変数に設定する。

```bash
VITE_AI_CHAT_API_URL=https://<worker-domain>/api/ai-chat
```

同一originにWorkers Routeを切る場合は、フロント側の環境変数は不要。

## 6. 動作確認

```bash
curl -X POST https://<worker-domain>/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"action":"analyze","source":"hero","sessionId":"setup-test","companyUrl":"https://ltdhonkoma.com"}'
```

確認すること:

- `ok: true` か、失敗時でも `fallbackAnalysis` が返る。
- DeepSeekキー設定後は `analysis.mode` が `model` になる。2026-07-06時点でWorker本番URLから確認済み。
- メール送信ステップでNotionに1行作成または更新される。
- Slackにsource/session/companyUrl/painPoint/emailが通知される。
- Secret値がレスポンスやフロントバンドルに出ない。
