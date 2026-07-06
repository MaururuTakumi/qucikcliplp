# honkoma リード資料エージェント — ヒューマン・イン・ザ・ループ設計正典

> 設計: Fable 5（2026-07-06）。実装: codex（本書はコードなし・設計のみ）。
> 位置づけ: [contact-funnel-v2-design.md](./contact-funnel-v2-design.md)（動線・stage・診断コード）と [ai-diagnosis-ui-redesign.md](./ai-diagnosis-ui-redesign.md) §4.5（emailGate=3案+Q1直後・**据え置き**）の**上に積む**。既存の `capture_lead`（Notion保存・Slack Webhook通知・診断メモメール即時送信）は**非破壊**。矛盾時、動線はv2が正、メール取得点は§4.5が正、**資料エージェントと承認フローは本書が正**。

## 0. 設計の背骨（1文）と大方針

**「メアドが取れた瞬間にSlackへ承認カードが立ち、エージェントがその会社向けの資料下書きを添え、人間が『承認』を押すまで1通も送らない——承認までの全状態はWorker＋KVが持ち、行き違い（既予約・別動線）は機械が提案し人間が最終確定する」**。

大方針（各論の前に決め切る3点・いずれも推奨1つ）:

| # | 論点 | 決定 | 理由 |
|---|---|---|---|
| D1 | **メールは2通モデル** | 1通目=診断メモメール（既存・テンプレ・**即時自動送信を維持**）／2通目=**資料メール（本書の対象・承認制）** | 診断メモは「画面で見た内容の控え」＝transactionalで捏造リスクゼロ、かつUIが「数分で届きます」と約束済み——人間承認を挟むとこの約束が壊れる。一方、資料メールはエージェントが新たに書く営業的コンテンツ＝人間ゲート必須。性質が違うものを1通に混ぜない。1通化したい場合の変更点は要判断#1に記載 |
| D2 | **Slackは既存Webhook併存＋Slack App新設** | 承認カードはBot Token（chat.postMessage）で投稿。partial通知・フォーム通知は既存Webhookのまま | Incoming Webhookはボタン押下を受けられない（§6）。全面移行は既存動線を壊すリスクだけ増える |
| D3 | **資料の形＝メール本文一体型（HTMLメール）** | PDF添付・別ページホスティングは不採用（Phase2で共有ページ化を再検討） | WorkerでのPDF生成は基盤が重く、添付はスパム判定リスク。メール本文なら開封=閲覧で計測も歩留まりも良い。LLMにHTMLは書かせず、構造化JSON→テンプレ流し込み（既存FocusPlanと同じ思想） |

不変の憲法: **承認までは絶対に自動送信しない**（資料メールの送信関数は承認ハンドラからしか呼べない構造にする＝受入基準H-4）／捏造・裏取り無し定量の禁止／クライアント実名はLLM出力経路に載せない（既存lint辞書を全draft検査に適用）。

---

## 1. 全体ワークフロー図

### 1.1 全体像（担当: 🤖=自動 / 👤=人間）

```
[emailGate等で email+consent 取得]  ←(§4.5: 3案+Q1直後。focusShown副導線・◉①・completed askも同経路)
        │ capture_lead（既存・非破壊）
        ▼
 🤖 既存処理: Notion upsert ＋ 診断メモメール即時送信（1通目・従来どおり）
 🤖 新規処理: ①KVに material:{sessionId} を作成(status=generating)
             ②Slackへ承認カードを即時投稿「📮 承認待ち＋資料を生成しています…」 ←社長要望1「取れた瞬間に通知」
             ③overlap検知（同一email/同一ドメインの既存リード・Bookedフラグ）→文面タイプを自動提案
             ④DeepSeekで資料draft生成（5〜15秒）→ lint検査 → カードを chat.update でプレビューに差し替え
        ▼
 ┌──────────────── status: pending（承認待ち）────────────────┐
 │  Slack承認カード:                                            │
 │   リード要約＋overlap警告＋文面タイプselect＋資料プレビュー   │
 │   [✅ 承認して送信] [✏️ 修正を依頼] [🛑 今回は送らない]        │
 └──┬───────────────┬───────────────────┬─────────────────────┘
    │👤承認          │👤修正を依頼        │👤送らない
    ▼               ▼                   ▼
 status=            モーダルで具体指示    status=discarded
 approved_sending    を記入して送信       🤖カード更新「見送り」
    │               ▼                   　Notion: Material Status=見送り
    │            status=revising
    │            🤖 Notionから最新文脈を再取得(focusPlan追記等を吸収)
    │            🤖 DeepSeek再生成(前draft+指示) → lint → カード更新(rev+1)
    │            🤖 指示と旧draftはスレッドに記録
    │               │
    │               └──→ status=pending に戻る（承認 or 再修正。上限=3回→§9）
    ▼
 🤖 文面タイプ(通常/既予約/別動線)を確定値で本文レンダリング
 🤖 資料メール送信（2通目・Cloudflare Email／既存transport再利用）
 🤖 status=sent／カード更新「✅ 送信済み・{承認者}・{文面タイプ}」ボタン除去
 🤖 スレッドに送信全文を記録（監査）／Notion: Material Status=送信済み・Sent At
    │
    ▼
 👤 以降の返信・予約は既存運用（診断コード突合・hot-booking翌日フォロー）
```

### 1.2 状態機械（material record）

```
generating → pending ⇄ revising          （⇄は修正ループ・上限3回）
                │
                ├→ approved_sending → sent
                │        └→ failed →(👤再送ボタン)→ approved_sending
                ├→ discarded
                └→ expired（Phase1: 48時間で自動失効・リマインド後）
```

- 状態の唯一の正は **KV `material:{sessionId}`**（§6.3）。Slackカードは常にKVの投影。
- **どの状態からも「自動でsentに遷移する経路は存在しない**。sentへの唯一の入口は approved_sending＝人間のボタン押下ハンドラ。

### 1.3 タイミングの急所 — emailGateは focusPlan生成前

§4.5により、メール取得の主点はQ1直後＝**深掘り（Q2/Q3）・進め方プラン（deepen）の前**。つまり資料draftの初回生成は多くの場合「analyzedSummary＋3案＋painPointのみ」で行われる。

- **推奨: 即時生成で開始する**（取得の瞬間に通知＝社長要望どおり。待つ設計はhot leadの鮮度を殺す）。承認カードにStage表示を置き、承認者が「文脈の浅い段階のdraftだ」と分かるようにする。
- セッションがその後 focusShown まで進んだ場合: **Phase0では「修正を依頼」を押した時にNotionの最新リード行（Focus Planプロパティ含む）を再取得してから再生成**する（修正＝refreshを兼ねる。追加実装ほぼゼロ）。**Phase1で、pending中にfocusPlan付きPATCHが届いたら自動refresh**（§7）。
- 実務上の含意: 承認は焦らなくてよい。**リードがまだ診断を続けている間に承認を押すより、離脱を見てから（または30分後に）押す方が資料の質が上がる**。運用目安は§7.3。

---

## 2. エージェント生成仕様

### 2.1 入力（診断文脈スナップショット）

`capture_lead` ペイロードから: `companyUrl` / `analyzedSummary` / `signals` / `proposals`（3案） / `painPoint`（+`painPointRaw`） / `companySize` / `aiMaturity` / `focusPlan`（あれば） / `matchedCase`（あれば・DB原文） / `diagnosisCode` / `email` / `role`（あれば） / `utm` / `stage`。加えて固定入力: **会社正データブロック**（`facts-and-compliance.md` の正データ表: 30社以上・10名体制・代表 林拓海——**この表の外の会社事実は書かせない**）とトーン規定（v2 §2.1: 敬体・静かな確信・感嘆符/希少性禁止）。

### 2.2 出力 — MaterialDraft コントラクト（スキーマ駆動・LLMはJSONのみ）

```json
{
  "$id": "honkoma/material-draft/1.0",
  "required": ["schemaVersion", "opening", "scenes", "firstStep", "meetingTopics"],
  "properties": {
    "schemaVersion": { "const": "1.0" },
    "opening":   { "type": "string", "maxLength": 140 },
    "scenes": { "minItems": 2, "maxItems": 3,
      "items": { "required": ["title", "current", "withAi", "firstMove"],
        "properties": {
          "title":    { "maxLength": 24 },
          "current":  { "maxLength": 90 },
          "withAi":   { "maxLength": 110 },
          "firstMove": { "maxLength": 80 } } } },
    "firstStep": { "type": "string", "maxLength": 120 },
    "caseConnection": { "type": "string", "maxLength": 80 },
    "meetingTopics": { "minItems": 2, "maxItems": 3, "items": { "maxLength": 40 } }
  }
}
```

- `opening` = 診断文脈の言い換え＋「なぜこの資料を送るか」1〜2文。
- `scenes` = **資料の本体**。「{その会社の業務場面} × {選択課題}」の活用イメージ。各シーン=「いま（推定される流れ）／AI導入後（どう変わるか）／最初の一歩」。**推奨2シーン**（メールで読み切れる量を優先。3は情報が濃いリードのみ）。
- `firstStep` = 最初の2〜6週間で何をするか（focusPlanがあればsteps[0-1]準拠、なければ課題別テンプレ準拠）。
- `caseConnection` = matchedCaseがある時のみ「なぜこの事例が近いか」80字。**事例本文はLLM出力から描画しない**（v2 §3.4と同一原則: Title/Situation/Approach/Outcome/DurationはDB原文をテンプレに流し込む）。
- `meetingTopics` = ミーティングで話すこと2〜3点（focusPlan.agendaがあれば流用可）。ミーティング打診文そのものは**テンプレ固定でLLMに書かせない**。

**粒度・長さ・トーンの規定**: 資料部の合計はテキスト換算800〜1,200字（スマホで2〜3スクロール）。敬体。仮説は必ず仮説形（「〜と拝見しました」「〜であれば」）で書き、**相手企業の内部事情を断定しない**。感嘆符・希少性・「必ず/保証」・数値効果の断定は禁止（既存lintがそのまま落とす）。

### 2.3 プロンプト方針（DeepSeek・既存`deepen`と同型）

- system: 「You are honkoma's lead-material generator. Return valid JSON only.／**書いてよい事実は入力にあるものだけ**。相手企業についての新しい事実・数値・固有名詞を創作しない。効果の数値を約束しない。クライアント名を出さない。matchedCaseの内容を書き換えない（書くのはcaseConnectionのみ）。丁寧で静かな日本語。」＋スキーマ＋few-shot 1例（決定論フォールバック§2.4を例に流用——`deepen`実装と同じ手筋）。
- user: §2.1の文脈JSON＋会社正データブロック。
- パラメータ: temperature 0.35（retry時0.2）・max_tokens 1600・response_format json_object・2回試行。**修正再生成時**は「前revのdraft JSON＋人間の修正指示原文」をuserに追加し、「指示に該当しない部分はできるだけ維持する」を指示（差分修正で承認者の確認コストを下げる）。

### 2.4 検証・コンプラガード・フォールバック（梯子）

1. スキーマ検証（欠落フィールドは決定論フォールバック値で充填・`validateFocusPlan`と同型）。
2. `outputPassesLint`（禁止表現regex＋クライアント実名辞書`COMPLIANCE_CLIENT_NAMES`）＋`hasJapanese`＋言語ドリフト検査——**全フィールドに適用**。
3. 不合格→retry 1回→なお不合格なら**決定論フォールバックdraft**: scenesは選択axisのproposal（title/body）から、firstStepはfallbackFocusPlanのstepsから機械組立（全て既検証済みテキストの再配置＝捏造構造的ゼロ）。
4. フォールバックに落ちた場合もSlackへは必ず出す。カードに `⚠️ 自動生成が検証を通らなかったため、テンプレ版を表示しています。修正依頼で書き直しを指示できます。` を表示。**生成失敗が「通知が来ない」に化けることを許さない**（メアド取得の通知自体が価値のため）。
5. DeepSeek API自体の障害時: draftなしの承認カード（リード要約のみ＋「生成に失敗しました」＋[🔁 生成を再試行] ボタン）を立てる。通知は死なせない。

---

## 3. Slackメッセージ設計 & 承認/修正UI

### 3.1 承認カード（Bot投稿→生成完了でchat.update）

```
┌──────────────────────────────────────────────┐
│ 📮 リード資料 承認待ち — {companyName}          │  ← header
│ Next: 内容を確認し「承認して送信」か「修正を依頼」│  ← section
│ を押してください。承認まで送信されません。        │
│──────────────────────────────────────────────│
│ 診断コード HK-3F7K │ Stage 課題選択(emailGate)  │  ← fields
│ 課題 問い合わせ・顧客対応 │ 規模 〜50名          │
│ AI活用 個人利用が中心 │ Email a@example.co.jp   │
│ 流入 youtube/{slug} │ 生成 model / rev 1        │
│──────────────────────────────────────────────│
│ ⚠️ 行き違い: 同じメールアドレスの問い合わせが     │  ← overlap検知時のみ（§5）
│ 7/3 にあります → 文面タイプ「別動線版」を提案     │
│ 文面タイプ: [通常版 ▾]（static_select・提案値を   │
│ 初期選択。人間が上書き可能）                      │
│──────────────────────────────────────────────│
│ ✉️ 件名: 【honkoma】{companyName}向けに、AI活用   │  ← 資料プレビュー（text版）
│ の進め方をまとめました                            │
│ （本文プレビュー…資料全文のtext版…）              │
│──────────────────────────────────────────────│
│ [✅ 承認して送信] [✏️ 修正を依頼] [🛑 今回は送らない]│  ← actions
│ session: abc123…f9 | 承認するまで自動送信されません │  ← context
└──────────────────────────────────────────────┘
```

- action_id: `material_approve` / `material_revise` / `material_discard` / `material_variant`（select）/ `material_retry`（failed時のみ）。valueは`sessionId`。
- 投稿は2段階: **①取得の瞬間に骨組み（リード要約＋「資料を生成しています…」）を即投稿**（=要望1の即時通知）→ ②生成完了で同メッセージをchat.update。生成の5〜15秒が通知遅延にならない。
- 既存Webhookの `lead captured` 通知は、本機能フラグON時この承認カードに**置換**（同チャンネル二重通知の防止）。partial・contact_form・hot-booking通知は従来どおりWebhook。

### 3.2 修正指示の入力方式 — **モーダル採用（スレッド返信は不採用）**

理由: スレッド返信の取り込みには Events API（`message.channels`購読）が必要でスコープが重く誤発火も出る。モーダルは押した人・対象sessionId・指示本文が構造化されて1リクエストで届き、実装も運用も明確。

```
モーダル「資料の修正依頼」（views.open・trigger_id起点）
├ 修正指示（plain_text_input・multiline・必須）
│  placeholder: 例)「事例の話を先頭に」「もっと短く」「経理向けのシーンに差し替え」
├ 文面タイプ（static_select・現在値を初期選択）: 通常版/既予約版/別動線版
└ submit:「再生成する」  ／ private_metadata: {sessionId, channel, ts}
```

- view_submission受信 → 即ack（3秒ルール） → カードを「✏️ 再生成中…（{指示の先頭30字}）」にchat.update → `ctx.waitUntil`で §2.3 の再生成 → カードをrev+1のプレビューに更新。
- **修正履歴はカードのスレッドに自動記録**: 「rev1 → rev2／指示: {原文}／by @taku」＋旧draftのtext版。カード本体は常に最新revのみ（見せ方をシンプルに保つ）。
- 修正ループ上限: **3回**（推奨・要判断#3）。超過時はカードに「これ以上の自動修正より、手書きでの送信をおすすめします」と表示し、[🛑 今回は送らない] のみ残す。

### 3.3 承認〜送信の状態管理（二重送信防止の3層）

1. **KV status検査**: `material_approve`受信時、statusが`pending`以外なら処理せずエフェメラル返信「この資料は既に処理済みです（{status}）」。
2. **先行status書換**: 送信処理の前に`approved_sending`＋`approvedBy`を書いてから送信（read-check-write）。厳密化が必要になったらDurable Object化（§6.4）。
3. **送信成功後**: `sent`＋`sentAt`を記録し、**chat.updateでボタン自体を除去**（UIレベルで再押下を不可能に）。送信関数冒頭でも`sentAt`存在チェック。

送信失敗時: status=`failed`・カードに「⚠️ 送信に失敗しました（{error}）」＋[🔁 再送] ボタン。再送も同じ3層を通る。

### 3.4 権限

Phase0は**チャンネル参加者なら誰でも承認可**（10名・プライベートチャンネル前提）。`SLACK_APPROVER_IDS`（カンマ区切りuser ID）を設定した場合のみ許可制に切替（要判断#4）。

---

## 4. メールテンプレ正典（資料メール=2通目・overlap出し分け含む）

共通規定: HTMLメールは既存`diagnosisEmailContent`と同系の簡素スタイル（白地・藍見出し・装飾なし）。**LLM出力が入るのは §2.2 の各フィールドのみ**で、以下のテンプレ地文は固定。text版を必ず併送。感嘆符・希少性・断定数値・実名なし。差出人・署名は要判断#2。

**共通署名（固定）**
```
株式会社honkoma
代表取締役 林 拓海
https://ltdhonkoma.com
※このメールは、AI診断をご利用いただいた方に、内容を人が確認したうえで一度だけお送りしています。
　以降のご案内をお送りすることはありません。
```

**共通免責（固定・フッター）**
```
この資料は公開情報とご入力内容に基づく仮説です。実装可否や優先順位は、業務の詳細を確認して調整します。
※事例は特定を避けるため、業種・規模など一部の表現を調整しています。（事例掲載時のみ）
```

### 4.1 通常版（overlapシグナルなし）

```
件名: 【honkoma】{companyName}向けに、AI活用の進め方をまとめました

{companyName} ご担当者様

先ほどは、honkomaのAI診断をご利用いただきありがとうございました。
代表の林です。診断の内容を確認し、{painLabel}を起点とした{companyName}での
活用イメージを、こちらの1通にまとめました。

■ 診断の要約
{opening}

■ {companyName}での活用イメージ
1. {scene1.title}
　いま　　　: {scene1.current}
　AI導入後　: {scene1.withAi}
　最初の一歩: {scene1.firstMove}
2. {scene2.title}（同構成）

■ 進め方（最初の2〜6週間）
{firstStep}

■ 近い状況の事例
{matchedCase.title / situation / approach / outcome / duration ←DB原文}
{caseConnection}
（matchedCase無し時: 「近い事例は、お話の中で状況に合わせてご紹介します。」）

■ 一度、お話ししませんか
ここまでの内容は、公開情報とご回答から立てた仮説です。よろしければ、
30分のオンラインミーティングで一度一緒にお話ししてみませんか。
御社の実情に合わせて、その場でこの資料を組み直します。売り込みはしません。

・日程はこちらから: {bookingUrl}
・予約フォームの「ご相談内容」欄に、診断コード {HK-XXXX} をご記入ください。
　この資料の内容から当日を始められます。

ミーティングで話すこと（目安）
・{meetingTopics[0]}
・{meetingTopics[1]}

{共通免責}
{共通署名}
```

### 4.2 既予約版（予約済み確定=Bookedフラグ／予約進行中=booking_click の2形）

件名: `【honkoma】ご予約ありがとうございます — 当日に向けた資料です`

冒頭ブロックだけ差し替え、資料本体（■診断の要約〜■事例）は共通。**「■一度、お話ししませんか」ブロックと予約リンクは出さない**（重複プッシュの排除）:

```
（a. Bookedフラグ確定時の冒頭）
このたびは、ミーティングのご予約をありがとうございます。代表の林です。
ご予約の前後にご案内が行き違いになっていましたら、申し訳ございません。
当日に向けて、診断の内容を資料としてまとめました。事前のご準備は不要です——
当日は、この内容から一緒に始めましょう。

（b. booking_clickのみ・予約未確認時の冒頭）
代表の林です。診断のご利用ありがとうございました。
すでに日程調整にお進みいただいていましたら、ご案内が行き違いになり
申し訳ございません。その場合このメールへのご返信は不要です——当日、
この資料の内容からお話しできるよう、こちらで準備しておきます。

（末尾・(b)のみ）
もしまだ日程がお決まりでなければ、こちらからどうぞ: {bookingUrl}
（診断コード {HK-XXXX} をご相談内容欄にご記入ください）
```

### 4.3 別動線版（同一email/ドメインで別リードあり: フォーム送信済み等）

件名: 通常版と同じ。冒頭に1ブロック追加＋ミーティング打診を弱形に:

```
（冒頭・通常版の挨拶の直後に挿入）
なお、別の窓口からも既にご連絡をいただいているようでしたら、ご案内が
重なってしまい申し訳ございません。お返事は、どちらか一方で結構です。

（■一度、お話ししませんか → 弱形に差し替え）
■ もしまだ日程のご相談が進んでいなければ
30分のオンラインミーティングで、この資料を御社の実情に合わせて
組み直すこともできます。売り込みはしません。
・日程はこちらから: {bookingUrl}（ご相談内容欄に診断コード {HK-XXXX}）
```

出し分けの原則: **「申し訳ございません」は行き違いの可能性に対してのみ使い、卑屈にしない**（1回だけ・冒頭のみ）。既に動いている相手には「押さない」ことが最大の礼儀であり、資料は「当日の下敷き」に再定義して価値だけ残す。

---

## 5. overlap検知の設計

### 5.1 シグナルと使い分け

| シグナル | 取得方法 | 強さ | 落とす文面 |
|---|---|---|---|
| **Bookedフラグ**（人力） | Notionリード行に checkbox `Booked` を新設。予約が入ったら営業が診断コード突合（既存運用§6.3）の際に✅ | 確定 | 既予約版(a) |
| **booking_click**（同一セッション） | 既存stage。draft生成時にNotionリード行のStageを参照 | 中（クリック≠予約） | 既予約版(b) |
| **同一email** | Notion Leads DBを `Email equals` でクエリ（自セッション除外・過去30日） | 強 | 別動線版 |
| **同一ドメイン** | email/companyUrlのドメインで `Company` title contains クエリ（フリーメールドメインは除外辞書で無効化） | 弱 | 通常版＋カードに⚠️表示のみ |

判定は**draft生成時に1回**（`ctx.waitUntil`内・Notionクエリ2本）。優先順位: Booked > booking_click > 同一email > 同一ドメイン。

### 5.2 機械は「提案」、人間が「確定」——これが本設計のHITLの核

- 検知結果は承認カードの ⚠️行＋文面タイプselectの**初期値**として出すだけ。**最終確定は常に人間のselect値**。理由: 予約の真値はGoogleカレンダー（webhook無し）にしかなく、機械には見えない。「予約が入った直後にカードを開いた林が、カレンダーを見て既予約版に切り替える」——この人間の1タップが、自動化では埋まらない最後の10cmを埋める。
- 承認カードのcontextに固定文言: `送信前にカレンダーをご確認ください（予約が見えるのはあなただけです）`。
- Phase1でBookedフラグ運用が定着したら、フラグ→初期値の自動一致率をNotionで振り返り、既定の信頼度を上げる。

### 5.3 取りこぼしの防御（逆方向のoverlap）

資料メール送信**後**に予約が入るケース（最頻の行き違い）は、メール側で先回りする——通常版の予約案内に診断コードを必ず添えているため、予約フォーム突合で「資料送付済みリード」と判明する。営業はhot-booking通知（既存）を見た時、**Material Status=送信済みなら追撃メールを送らない**、を運用ルールに明文化。

---

## 6. インフラ前提（codexが実装できる粒度で）

### 6.1 Slack: Incoming Webhookではボタンを扱えない — Slack App必須

- **既存の`SLACK_WEBHOOK_URL`はボタン押下（interactivity）を一切受けられない**。承認/修正ボタンには Slack App の作成が必要:
  1. Slack App作成（workspace: honkoma）→ Bot Token Scopes: `chat:write`（＋対象チャンネルにBotを招待）。
  2. **Interactivity & Shortcuts を ON にし、Request URL = `https://{worker-domain}/slack/interactions`** を設定。ボタン押下・select変更・モーダルsubmitは全部ここにPOSTされる（`application/x-www-form-urlencoded`の`payload`フィールドにJSON）。
  3. Signing Secret を控える（署名検証用）。
- **署名検証必須**: `v0=HMAC-SHA256(signingSecret, "v0:{timestamp}:{rawBody}")` を `X-Slack-Signature` と定数時間比較。timestampが5分超過なら401。これが無いと承認エンドポイントが第三者から叩ける=無承認送信の穴になる。
- **3秒ルール**: interactionへのHTTP応答は3秒以内。DeepSeek再生成（5〜15秒）は必ず「即ack→`ctx.waitUntil`で処理→`chat.update`」の順。モーダルを開く`views.open`は**trigger_idの有効期限3秒**のため、ボタン受信ハンドラの最初に呼ぶ。
- 承認カードの投稿・更新はBot Token: `chat.postMessage`（channel=`SLACK_APPROVAL_CHANNEL_ID`）→ ts保持 → `chat.update` / `chat.postMessage(thread_ts)`。

### 6.2 Worker: 既存workerに載せる（別worker不要）

- ルーティング追加: `POST /slack/interactions`（既存は `/` と `/api/ai-chat` のみ）。既存actionディスパッチは非破壊。
- 新Secret/Var: `SLACK_BOT_TOKEN` / `SLACK_SIGNING_SECRET` / `SLACK_APPROVAL_CHANNEL_ID` / `MATERIAL_APPROVAL_ENABLED`（"true"でフラグON・OFFなら完全に従来挙動＝ロールバック弁）/ 任意`SLACK_APPROVER_IDS`。
- `capture_lead`へのフック: email＋consentあり かつ フラグON のとき、`ctx.waitUntil`で「KV作成→カード投稿→overlap検知→draft生成→カード更新」。**既存のNotion upsert・診断メモメール送信・レスポンス形は一切変えない**。同一sessionIdでKVレコード既存なら二重作成しない（capture_leadは◉①/completed askでも再発火するため）。

### 6.3 状態保持: Workers KV（namespace `LEAD_MATERIALS`）

```
key: material:{sessionId}   （expirationTtl: 90日 — privacy方針の90日保持と整合）
value: {
  status, rev, variant, variantSuggested,
  overlap: { booked, bookingClick, sameEmail, sameDomain, matchedLeadUrl? },
  context: { …§2.1のスナップショット… },
  drafts: [ { rev, mode: "model"|"fallback", draft, instruction?, createdAt } ],
  slack: { channel, ts },
  approvedBy?, sentAt?, discardedBy?, failedError?,
  createdAt, updatedAt
}
```

- **PIIの扱い**: emailはKVとNotionにのみ置き、`console.*`ログに出さない（既存方針踏襲）。TTLで自動パージ。

### 6.4 KV vs Durable Object（推奨: Phase0はKV）

KVは結果整合で、理論上「2人が同時に承認を押す」レースがある。ただし本件は承認者1〜2名・単一チャンネル・件数/日が一桁で、§3.3の3層防御（status検査→先行書換→ボタン除去）でレース窓は実質数秒未満。**Phase0はKVで出し、二重送信が1度でも観測されたらDurable Object（sessionId単位の直列化）へ昇格**——これを判断基準ごと明文化しておく。

### 6.5 メール送信

既存の3段transport（`env.EMAIL` binding → Cloudflare REST → Resend）を資料メール用にそのまま再利用（関数は分ける: `sendMaterialEmail`）。**呼出点は承認ハンドラ（と再送ハンドラ）のみ**に限定し、これを受入基準で機械的に検査する（§8）。

---

## 7. 段階実装

### Phase0 — 最小で回る承認ループ（これだけで社長要望1〜4が満たせる）

1. **Slack App作成**（人力・30分）: §6.1の手順。チャンネル `#leads-approval`（新設推奨・通知と分離）にBot招待。
2. **Worker**: `/slack/interactions`＋署名検証／KV binding／capture_leadフック（カード即時投稿→draft生成→更新）／MaterialDraft生成＋lint＋フォールバック／承認→送信／修正モーダル→再生成（Notion最新行の再読込）／見送り／文面タイプselect／二重送信3層防御。
3. **overlap検知（最小）**: 同一emailクエリ＋同一セッションbooking_clickのみ。文面3タイプ＋(a)(b)分岐のテンプレは全部Phase0で入れる（検知が弱くても**人間がselectで切替できる**ことが先）。
4. **Notion**: Inbound Leads DBにプロパティ追加: `Material Status`(select: 生成中/承認待ち/修正中/送信済み/見送り/失敗)・`Material Sent At`(date)・`Booked`(checkbox)。既存`filterNotionProperties`のwhitelist機構がそのまま守ってくれる。
5. **運用ルール明文化**（§7.3）。

### Phase1 — 検知と運用の完成

pending中のfocusPlan付きPATCHでdraft自動refresh／同一ドメイン検知＋フリーメール除外辞書／Bookedフラグ→文面初期値の自動連動／48時間で`expired`＋期限前リマインド（Cron。v2のCron基盤に相乗り）／修正履歴スレッドの整形／計測: 取得→承認までのリードタイム・修正回数・文面タイプ分布・資料メール経由の予約率（診断コード突合で人力集計）。

### 7.3 人間の作業分担（運用の正）

| 担当 | 作業 | SLA目安 |
|---|---|---|
| 林（承認者） | カード確認→カレンダー照合→文面タイプ確定→承認/修正/見送り | 営業時間内: 1時間以内／時間外: 翌営業日午前 |
| 林（承認者） | 予約が入ったら診断コード突合＋**Bookedフラグ✅**（既存突合作業に1クリック追加） | 予約検知時 |
| 営業/メンバー | 修正3回超・生成失敗時の手書きメール送信、hot-booking時のMaterial Status確認（追撃防止） | 随時 |
| codex | Phase0実装→受入基準検証→Phase1 | — |

---

## codexへの実装ハンドオフ（Worker/Slack App/KV・触る所・受入基準）

**触る所**
- `workers/ai-chat/src/index.ts`（または分割新設 `material.ts` ＋ `slack-interactions.ts`）:
  - ルータに `POST /slack/interactions` 追加（署名検証→payload種別: `block_actions` / `view_submission` でディスパッチ。action_id: `material_approve` / `material_revise` / `material_discard` / `material_variant` / `material_retry`）。
  - `persistLead`内フック: `action==="capture_lead" && email && consent && MATERIAL_APPROVAL_ENABLED` → `ctx.waitUntil(startMaterialFlow(...))`。KV既存レコードあればskip。フラグON時は既存`notifySlack`のcapture_lead通知を承認カードに置換（partial通知は不変）。
  - MaterialDraft生成: §2.2スキーマ・§2.3プロンプト・§2.4梯子。**既存の`lintText`/`outputPassesLint`/`hasJapanese`/`extractJson`/`callDeepSeek`系ヘルパを再利用**。
  - メールレンダリング: §4テンプレ（通常/既予約a/既予約b/別動線）× MaterialDraft × matchedCase原文。`sendMaterialEmail`は既存3段transportを流用、**呼出点は承認/再送ハンドラのみ**。
  - overlapクエリ: Notion `Email equals`（自sessionId除外）＋リード行Stage参照。
- `workers/ai-chat/wrangler.*`: KV namespace `LEAD_MATERIALS` binding／新Secrets: `SLACK_BOT_TOKEN` `SLACK_SIGNING_SECRET` `SLACK_APPROVAL_CHANNEL_ID` `MATERIAL_APPROVAL_ENABLED`（＋任意 `SLACK_APPROVER_IDS`）。
- Slack App（人力セットアップ・codexは手順書化まで）: scopes `chat:write`／Interactivity Request URL／Signing Secret／Bot招待。
- Notion Inbound Leads DB: `Material Status` / `Material Sent At` / `Booked` プロパティ追加。
- フロント変更: **なし**（Phase0はWorker完結）。

**受入基準**
1. emailGateでメール送信→数秒以内にSlackへ承認カード骨組みが立ち、生成完了でプレビューに更新される。診断メモメール（1通目）は従来どおり即時に届く。
2. [承認して送信]→本人へ資料メールが1通届き、カードが「✅送信済み・承認者・文面タイプ」に変わりボタンが消える。**連打・2名同時押下でも送信は1通**。
3. [修正を依頼]→モーダル→指示送信→カードがrev+1のプレビューに更新され、指示原文と旧draftがスレッドに残る。修正3回超でカードが手書き推奨表示に変わる。
4. **`sendMaterialEmail`の呼出点が承認ハンドラと再送ハンドラのみであることをコード上で確認できる**（承認なし送信のコードパスが存在しない）。
5. lint不合格の生成物はテンプレ版に落ち、カードに⚠️表示。DeepSeek障害時もカード自体は立つ（生成失敗表示＋再試行ボタン）。
6. 同一emailの既存リードがある場合カードに⚠️と「別動線版」初期値が出る。selectの切替でプレビューの件名・冒頭が変わり、承認時は確定値でレンダリングされる。
7. 不正署名・timestamp5分超過のinteractionは401。emailがWorkerログに出ない。KVレコードTTL=90日。
8. `MATERIAL_APPROVAL_ENABLED=false`（またはSecret未設定）で完全に従来挙動（既存capture_lead/partial/contact_form/診断メモメールの回帰テスト通過）。
9. 送信された全メール文面に感嘆符連発・希少性・断定数値・クライアント実名がない（テンプレ地文＋lint済みフィールドのみで構成されている）。

## 社長への要判断リスト

| # | 論点 | 推奨 |
|---|---|---|
| 1 | **2通モデル**（診断メモ=即時自動＋資料メール=承認制）でよいか | 2通モデルで承認。診断メモは控え・資料メールが本命、と役割が分かれる |
| 2 | **送信元と署名**: 差出人表示・reply-to | From: `honkoma 林 拓海 <diagnosis@ltdhonkoma.com>`／Reply-To: 林が実際に受信できるアドレス。返信が林に直接届くことが「人が見ている」の証明になる |
| 3 | **修正ループ上限** | 3回。超えたら手書き送信へ |
| 4 | **承認権限**: チャンネル参加者全員 or 林のみ | 全員（プライベートチャンネル前提）。`SLACK_APPROVER_IDS`でいつでも絞れる |
| 5 | **資料の形**: メール本文一体型（PDF添付・別ページ不採用） | 本書推奨どおり。Phase2で共有ページと統合再検討 |
| 6 | **overlap既定**: 機械は提案・人間がselectで最終確定＋Bookedフラグ運用のコミット | Yes。カレンダーが見えるのは人間だけ、という制約の正面解 |
| 7 | **承認待ちの期限**: 48時間で失効（Phase1）でよいか | Yes。48時間放置したリードに自動で送る方が事故 |
| 8 | **送信時間帯**: 承認=即送信でよいか | 承認即送。気になるなら「翌朝9時に送る」ボタンをPhase1で追加 |
