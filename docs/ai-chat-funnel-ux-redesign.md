# honkoma「AIに聞いてみる」動線・UX再設計 v1 — 予約ファースト

> 設計: Fable 5。実装: Opus / codex（本書はコードなし・設計のみ）。
> 位置づけ: [contact-ai-funnel-design.md](./contact-ai-funnel-design.md)（基本設計）と [contact-ai-advanced-design.md](./contact-ai-advanced-design.md)（高度設計）の**動線部分を置換する上位差分**。矛盾時は本書が優先。技術基盤（DeepSeek adapter / 出力コントラクト / partial capture の仕組み / Workers / Notion / Slack）は高度設計のまま**不変**。両書への具体的な反映指示は §H。
> 経営決定（2026-07 確定・本書はこれを動かさない）:
> 1. 主眼＝連絡先取得。ただし挟みすぎない。
> 2. 主動線＝**「担当と話す」日程予約（cal.com）**。予約済みが最強の連絡先。
> 3. メールは副。予約しない層への軽い受け皿。
> 4. 取得前の深掘り質問（困りごと・役職・規模）は**全廃**し、取得後エンリッチへ回す。
> 5. partial capture維持。景表法配慮・煽り禁止・トーンは静かな確信。

## 0. 設計の背骨（1文）

**「URLを入れる → AIが3案を返す → その直後に『この仮説、合っていますか。30分で確かめませんか』と予約を差し出す」**——診断の誤読リスクそのものを商談理由に転化し、信頼が最大の瞬間（3案直後）に唯一の主要CTA＝予約を置く。メールは「今は話すほどでもない人」への静かな二列目。質問は連絡先が確定した後にだけする。

旧設計との本質差: 旧は「3案→質問2つ→メール→（ついでに）予約」の**メール主線**。新は「3案→予約（メールは脇）→質問」の**予約主線**。訪問者がすることは「URLを入れて、日程を選ぶ」の2つだけになる。

---

## A. 再設計した動線（ステップ列・状態機械）

### A.1 ステップ表

| Step | phase | 見せるもの | 要求するもの | 次に促すこと |
|---|---|---|---|---|
| 0 着手 | `idle` | 起動帯/ドロワーの導入文＋URL欄 | 会社URL（非PII・1入力） | 「AIに聞いてみる」 |
| 1 解析 | `analyzing` | 進捗3行＋検出シグナル逐次表示 | なし（待つだけ） | 自動遷移 |
| 2 一次価値＋次の一歩 | `insightsShown`（失敗時 `analysisFailed` で同画面＋仮説注記） | サマリー＋3案カード。**その直下に「次の一歩」ブロック**（§B） | なし | 主: 予約 ／ 副: メール |
| 3a 予約 | `bookingStarted` → `booked` | cal.com埋め込みポップアップ（§G）。完了で確認画面 | 日程選択（氏名/メールはcal.com側で自然に取得） | 自動で Step4 へ |
| 3b メール | `emailRequested` → `leadCaptured` | ソフトask（1フィールド＋同意チェック、§C） | メール＋同意 | 自動で Step4 へ |
| 3c 受け皿 | `emailDeclined` | 共有リンク発行 | なし | 静かなcal.comリンクを残置 |
| 4 取得後エンリッチ | `enriching`（内部で pain→size→role） | 1問1価値返しのチップ質問。冒頭に「答えなくても予約/送信は完了済み」明記（§D） | 任意タップ 最大3回 | 各回答でエコーバック→次問 or 完了 |
| 5 完了 | `completed` | 予約者: 当日の進め方1行。メール者: 送信確認＋軽い予約再提示 | なし | 閉じる／別URLで診断 |

**摩擦予算（改定）**: 連絡先取得前の訪問者操作は「**URL入力1回＋クリック1回（予約 or メールの選択）**」まで。取得前に選択チップ・質問を一切出さない（高度設計§1.1-3の「＋タップ2回」を撤廃）。

### A.2 phase遷移（ChatPhase 差分）

```
現行: idle → analyzing → insightsShown →(choosePainPoint)→ emailRequested → leadCaptured / emailDeclined
新:   idle → analyzing → insightsShown ─┬→ bookingStarted ─┬→ booked ──────┐
      （analysisFailed は insightsShown   │                 └(離脱)→ insightsShown[bookingAbandoned]
        と同画面・注記つきで合流）        ├→ emailRequested ─┬→ leadCaptured ┤
                                          │                  └→ emailDeclined │
                                          └(閉じる)→ partialのまま            ↓
                                                                      enriching → completed
```

- **追加phase**: `bookingStarted` / `booked` / `enriching` / `completed`
- **維持**: `idle` `analyzing` `insightsShown` `analysisFailed` `emailRequested` `leadCaptured` `emailDeclined`
- **削除する遷移**: `insightsShown →(choosePainPoint)→ emailRequested`。困りごとチップは取得前から消える。`choosePainPoint` は `answerEnrich("pain", v)` に改名・移設。
- **state追加フィールド**: `bookingAbandoned: boolean`（ポップアップを予約せず閉じた）、`contactMethod: "booking" | "email" | "share" | null`、`enrichStep: "pain" | "size" | "role" | null`、`companySize` / `role`（enum、null許容）。

### A.3 Provider アクション差分

| アクション | 変更 |
|---|---|
| `choosePainPoint` | 廃止 → `answerEnrich(field: "pain"\|"size"\|"role", value: string)` に置換。回答ごとに lead PATCH＋次問へ |
| `startBooking()` | **新規**。cal.com embed popupを開き `bookingStarted` へ。gtag `ai_chat_booking_click` |
| `confirmBooking()` | **新規**。embedの `bookingSuccessful` イベントで `booked` へ。gtag送出、lead PATCH（stage=booked, contactMethod=booking） |
| `abandonBooking()` | **新規**。予約せずpopupを閉じた → `insightsShown` に戻し `bookingAbandoned=true` |
| `requestEmail()` | **新規**。「メールで受け取る」タップで `emailRequested` へ |
| `skipEnrich()` / エンリッチ完了 | **新規**。`completed` へ |
| `submitEmailLead` / `declineEmail` / `resetChat` / partial同期 | 維持（submitEmailLead成功後は `leadCaptured` →自動で `enriching`） |

- ドロワーを閉じて再度開いた場合は保存phaseから再開（現行どおり）。`booked`/`completed` で再訪した場合は完了画面を表示し、「別のURLで診断する」を出す。

---

## B. 3案提示 → 予約への繋ぎ

### B.1 原則

1. **誤読を売り物にする**: 3案は公開情報からの仮説であり、必ずどこか実情とずれる。その「ずれの指摘と修正」こそ30分の中身——という枠組みにすると、予約CTAが売り込みでなく**診断の続き**になる（高度設計§2.3-2の思想を予約導線の主役に昇格）。
2. **選択肢は2つまで**: 主=予約、副=メール。共有リンクはこの画面に出さない（メールaskの中の逃げ道に置く。3択にすると全部弱くなる）。
3. **静かな確信**: 「無料」「30分」「売り込みはしません」を事実として一度だけ書く。感嘆符・希少性演出（残枠わずか等）・カウントダウンは禁止。

### B.2 「次の一歩」ブロック（insightsShown、3案カードの直下）

実文言:

> **この3案、合っていますか。**
>
> 公開サイトから立てた仮説なので、実情とずれている部分があるはずです。30分の壁打ちで、そのずれごと御社仕様に組み直します。オンライン・無料で、売り込みはしません。
>
> ［ArrowCTA fill / withText: **日程を選ぶ**］　<small>30分・オンライン・無料</small>
>
> <text-button>今は話すほどではない方へ——この3案をメールで残す</text-button>

- 主CTA部品: `ArrowCTA`（`variant="fill"` `size="md"` `withText="日程を選ぶ"` `label="担当との30分壁打ちを予約する"`）。`onClick=startBooking`。ドロワー内は inverse テーマなので色は自動反転。**現行の矩形 `.aichat-submit` ではなく ArrowCTA を使う**（サイトの主ボタン言語で「これが本線」を示す）。
- 副CTA部品: 既存 `.aichat-textbutton`。視覚ウェイトは主の1/3以下（テキストリンクのまま）。
- `confidence: low` のとき本文2文目を差し替え: 「今回は公開情報が少なく、仮説の割合が大きめです。30分あれば実情ベースで作り直せます。」——誠実さ表明を予約理由に接続。
- モバイル: このブロックの主CTA＋副リンクを**ドロワー内 sticky フッターバー**にも常時表示（§E.2-4）。3案スクロール中もCTAが視界から消えない。

### B.3 予約を選ばなかった人への副導線の出し方

- **bookingAbandoned=true で insightsShown に戻ったとき**: 見出しの下に1行追加——「日程が合わなければ、この3案をメールで残しておけます。」＋副リンクを通常テキストからボタン風（`.aichat-chip` 外観）に1段昇格。主CTA（日程を選ぶ）は残す。**再ポップアップの自動再表示はしない。**
- **emailDeclined（共有リンク）画面の末尾**: 「気が向いたら、日程はこちらからいつでも。」＋cal.comプレーンリンク（`ArrowCTA` は使わない。最弱の視覚ウェイトで残置）。
- **leadCaptured（メール取得後）の完了画面**: 「レポートを見て話したくなったら、30分の枠をどうぞ。」＋`ArrowCTA outline / withText: 日程を選ぶ`。メール派にも予約への戻り道を常に1本残す（ただしoutline＝二番手の見た目）。

---

## C. メール取得の最小設計

### C.1 いつ・何回

- **出す瞬間**: 訪問者が「この3案をメールで残す」を自分でタップしたときだけ（pull型）。自動でメールフォームを差し込むpush型askはどこにもない。
- **回数**: セッション中 **1回**。`emailDeclined` を選んだら二度と再要求しない（共有リンク画面とpartial記録で終える）。閉じて再開しても declined 状態を保持。
- **予約フロー内では聞かない**: cal.comが予約確定時に氏名・メールを自然に取得する。二重取得は摩擦にしかならない。予約者へのメール文言・確認はcal.com任せ。

### C.2 画面（emailRequested）実文言

> **この3案を、メールでそのまま。**
>
> いま画面にある3案と診断メモをお送りします。お送りするのは診断メモで、不要なご案内は差し上げません。
>
> ［input type=email / placeholder: `name@company.co.jp`］
> ☐ [プライバシーポリシー](/privacy) に同意します
> ［submit: **メールで受け取る**］
>
> <text-button>メールは使わず、共有リンクで残す</text-button>

- 現行の見出し `{state.painPoint}に合わせた診断レポートを受け取る` は**廃止**（painPointは取得前に存在しなくなる）。`reportTeaser` の表示も外す（「作成しました」系のsunk-value演出は予約主線では過剰。メールaskは軽く・事務的に）。
- placeholder を `name@company.co.jp` にして会社アドレスを無言でナッジ（「会社アドレス推奨」の注記文は置かない——文言で頼むより例示が軽い）。
- 同意チェック: 現行どおり必須・未チェックはエラー差し戻し。**同意チェックONで送信された時のみemailがサーバへ載る**（高度設計§4.6の構造保証を維持）。
- 送信成功 → `leadCaptured`:「送信しました。数分で届きます。」→ 自動で `enriching`（§D）へ。

---

## D. 取得後エンリッチ（1問1価値返し）

`booked` または `leadCaptured` の確認メッセージ直後に開始。**無回答リスクゼロの位置**——連絡先は既に確定しており、答えなくても何も失わない旨を冒頭で明言する。1画面1問・タップのみ・最大3問。各画面に「ここまでで大丈夫」スキップリンク。

### D.1 導入文（1問目の直前に1回だけ）

- 予約者: 「準備のために、1つだけ伺えますか。**答えなくても予約は完了しています。**」
- メール者: 「よければ1つだけ。レポートに反映します。**答えなくても送信は完了しています。**」

### D.2 質問列と価値返し

| # | 質問 | チップ | 価値返し（エコーバック） |
|---|---|---|---|
| Q1 pain | 「いま、いちばん重い課題はどれですか？」 | `人手不足・属人化` / `問い合わせ・顧客対応` / `バックオフィス業務` / `売上・集客` / `データが活かせていない` / `その他（自由入力・任意）` | 予約者: 「{課題}ですね。3案のうち **{最関連案タイトル}** が直結しそうです。当日はここから話せるよう準備します。」／メール者: 「{課題}ですね。レポートに{課題}の特化章を足します。」 |
| Q2 size | 「話の粒度を合わせたいので——会社の規模はどれに近いですか？」 | `〜10名` / `〜50名` / `〜300名` / `301名〜` | 「承知しました。{規模}の体制を前提に組み立てます。」 |
| Q3 role | 「最後に1つ。お立場は？」 | `経営者・役員` / `部門責任者` / `現場担当` / `情報収集中` | 「ありがとうございます。これで準備が揃いました。」→ `completed` |

- **最関連案マッピング（固定テーブル・LLM不使用）**: `人手不足・属人化→FDE` / `問い合わせ・顧客対応→BOTTOM_LINE` / `バックオフィス業務→BOTTOM_LINE` / `売上・集客→TOP_LINE` / `データが活かせていない→FDE` / `その他→confidence順の先頭案`。painPoint→3案中の該当axisのtitleを埋め込む。
- 各回答は確定イベントとして即 `POST /api/lead-progress` PATCH（高度設計§4.3のまま）。回答があればSlack通知を更新（complete通知に課題/規模/役職を追記）。
- **旧A3（検討温度感）は質問として廃止**。予約行動そのものが最強のタイミングシグナルであり、聞く必要がなくなった。レポートの締め（旧§2.3-5の温度別出し分け）は固定（進め方モデル＋壁打ち案内）に一本化。
- Q1自由入力の扱いは高度設計§1.4のまま（LLM要約＋分類、原文保存）。

---

## E. UI/見た目の指摘と改善（既存資産の範囲で）

### E.1 AIStarterBand（Hero帯・セクション末尾）

| # | イマイチの要因 | 改善 |
|---|---|---|
| 1 | **無効URLで無反応になるバグ**: `startAnalysis` が不正URLで `leadFail` を dispatch するが、エラー表示はドロワー内のみ。ドロワーが開いていないので押しても何も起きない | Band側にインラインエラー行を追加（input直下、`--color-accent-bright`）。「会社サイトのURLを入力してください」。ドロワーを開かずに差し戻す |
| 2 | 信頼要素ゼロ: 「無料・登録不要」が本文に埋没し、フォーム単体では冷たいフォームに見える | form直下にマイクロコピー1行: 「**無料・登録不要・約30秒**。入力内容は途中でも品質向上のため保存されます（[プライバシーポリシー](/privacy)）」——透明性文言は高度設計§4.6-①の要求でもある |
| 3 | 本文が説明的で長い | body を「URLを入れるだけ。売上を伸ばす・コストを削る・現場に実装する、の3軸で整理します。」に短縮。titleは維持 |
| 4 | 入力とCTAの視線動線は良いが、Enter送信時にボタンのプレス感がなく反応が分かりにくい | 送信直後にドロワーが開くので現状構造は維持。ボタン連打防止に `state.isBusy` でBand側CTAもdisabled化のみ追加 |

### E.2 ChatDrawer（濃紺・右ドロワー）

| # | イマイチの要因 | 改善 |
|---|---|---|
| 1 | **ヘッダーが常に「30秒で3案にします。」のまま**——3案表示後・完了後もタイトルが古い（進捗感がない最大要因） | phase連動でヘッダーを差し替え: `idle/analyzing`=現行 ／ `insightsShown`=「{companyName}への、3つの仮説。」（kicker: 3 Hypotheses）／ `booked`=「壁打ち、承りました。」／ `leadCaptured`=「診断メモを送信しました。」／ `completed`=「準備が整いました。」 |
| 2 | **オーバーレイクリックで閉じない**（Esc・×のみ）。閉じにくさは「捕まえられた感」を生む | `.aichat-overlay` にクリックで `closeChat`（`event.target === currentTarget` 判定）。状態は保持されるので閉じても損しない——それを×付近のmicrocopy「閉じても途中から再開できます」で明示（`insightsShown` 以降のみ表示） |
| 3 | 3案カードが縦に重く、スクロールの底にしかCTAがない | カードは `axis/title/what` を常時表示、`evidence/firstStep` は `<details>`「根拠と最初の一歩」に畳む（スキーマのフィールドをそのまま使用）。カード全体の視線コストを約半分に |
| 4 | **モバイルで予約CTAが埋もれる** | `insightsShown` 中のみ、パネル下端に sticky バー（背景 `color-mix(surface-base 88%)`＋blur、上borderのみ）: 左に「日程を選ぶ」ArrowCTA(sm/fill)、右に「メールで残す」textリンク。本文側の次の一歩ブロックと同一アクション（重複してよい——sticky は保険） |
| 5 | 進捗が見えない（今どこ？あと何ステップ？） | ヘッダーkicker下に極小の3点ドット（`URL → 3案 → 次の一歩`）。`analyzing`で2点目、`insightsShown`で3点目が accent 点灯。文字ラベルは `aria-label` のみ（視覚は点3つ、追加部品なし） |
| 6 | 主要ボタンが矩形 `.aichat-submit` で、サイトの主ボタン言語（ArrowCTA）と断絶 | 予約主CTAは ArrowCTA fill（§B.2）。フォーム送信（URL・メール）は矩形のままでよい（入力フォームの送信は矩形が自然）。「主線=ArrowCTA、フォーム=矩形」で強弱を統一 |
| 7 | `emailRequested` の見出しが `state.painPoint` 依存 | §C.2の固定文言に置換（painPoint は取得前に存在しない） |
| 8 | 完了画面の「担当と話す」が `/contact` 遷移でドロワー体験が切れる | `booked` フローに一本化されるため不要。`leadCaptured` 完了画面の予約CTAは cal.com 直（§B.3）。`/contact` への遷移はドロワーから排除 |

- いずれも tokens / ArrowCTA / inverse / 既存CSSクラスの範囲。新規コンポーネントは sticky バーと進捗ドットの2つの小物のみ。

---

## F. 計測とゴール定義

### F.1 KPI

| 区分 | 指標 | 定義（分母/分子） |
|---|---|---|
| **主KPI** | 予約数 | cal.com webhook `BOOKING_CREATED`（metadata.sessionId でAIチャット起点を判定・重複排除） |
| 主KPI率 | 予約率 | booked ÷ insightsShown到達 |
| 副KPI | メール取得数 | leadCaptured（同意つき送信成功） |
| 統合 | 連絡先取得率 | (booked ∪ leadCaptured) ÷ insightsShown |
| partial | URL取得数・課題取得数 | stage≥url_entered の行数／enrich Q1 回答数 |
| ガードレール | 解析成功率・3案到達率 | insightsShown ÷ url_submit（体験品質の下限監視） |
| 診断 | エンリッチ回答率 | Q1/Q2/Q3 各回答 ÷ contact captured |

### F.2 計測イベント（gtag / category: ai_chat）

既存: `ai_chat_open` `ai_chat_url_submit` `ai_chat_insights_shown` `ai_chat_analysis_fallback` `ai_chat_lead_captured` `ai_chat_email_declined` は維持。**廃止**: `ai_chat_pain_point`（取得前から消えるため。エンリッチ側で代替）。

**追加**:

| イベント | 発火 | label |
|---|---|---|
| `ai_chat_next_step_shown` | 次の一歩ブロックが可視化 | source |
| `ai_chat_booking_click` | 「日程を選ぶ」タップ | source |
| `ai_chat_booking_completed` | embed `bookingSuccessful`（クライアント速報。真値はwebhook） | source |
| `ai_chat_booking_abandoned` | popup予約なしクローズ | source |
| `ai_chat_email_ask_shown` | emailRequested 表示 | source |
| `ai_chat_enrich_answered` | エンリッチ回答 | pain / size / role |
| `ai_chat_drawer_closed` | ドロワーを閉じた | その時のphase（**離脱点の分布がそのまま改善バックログになる**） |

### F.3 stage enum（高度設計§4.2の置換）

```
'opened' → 'url_entered' → 'analyzed' → 'next_step_shown'
  → 'booking_started' | 'email_form_shown'      （分岐。数値rankは同位）
  → 'contact_captured'                           （booked or email_submitted）
  → 'enriched_pain' → 'enriched_full'
別フィールド: contactMethod: 'booking' | 'email' | 'share' | null
```

前進のみ規則・upsert・beacon・90日パージは高度設計§4.3–4.7のまま。

### F.4 Slack通知Tier（高度設計§4.5の置換）

| Tier | 条件 | 形 |
|---|---|---|
| **complete-booked** | webhook BOOKING_CREATED | 即時・リッチ: 🔥予約済み {domain}/{日時}/3案タイトル/（あれば）課題・規模・役職 |
| **complete-email** | leadCaptured | 即時: {domain}/email/3案タイトル |
| **hot-partial** | `booking_started` 到達後30分無活動で未予約 | 個別・軽量: 「予約画面まで進んで未完了: {domain}。3案はNotion参照」——**日程を見た人は最温。人力フォロー最優先** |
| **digest** | url_entered / analyzed / next_step_shown で離脱 | 日次バッチ（既存どおり） |

### F.5 各stepの離脱受け皿（総括）

| 離脱点 | 受け皿 |
|---|---|
| Step0 未入力離脱 | フローティング常駐・exit-intent（既存B/E起動点） |
| 解析中/3案表示で閉じる | partial（URL＋3案がNotionに残る）＋sessionStorage再開 |
| 予約popup離脱 | `bookingAbandoned` → メール副導線を1段昇格（§B.3）＋hot-partial通知 |
| メールask離脱 | 共有リンク（soft lead）＋静かなcalリンク残置 |
| エンリッチ離脱 | リスクゼロ（連絡先確定済み）。無通知でPATCHのみ |

---

## G. cal.com統合設計（実装者向け）

1. **埋め込み方式**: cal.com **element-click embed（popup型）** を第一候補（`@calcom/embed-react` の `getCalApi` か vanilla snippet）。ドロワーを離脱させず、`bookingSuccessful` イベントが取れる。inline embedは520pxドロワーには狭すぎるため不採用。
2. **イベント**: `Cal("on", {action: "bookingSuccessful", callback})` → `confirmBooking()`。popup閉鎖（`__closeIframe` 等）でbooking未成立なら `abandonBooking()`。イベント名・payload形状は実装時に最新docsで要確認。
3. **リンクとメタデータ**: `https://cal.com/takumi-honkoma-mljb0f/honkoma-meeting?metadata[sessionId]={sessionId}&metadata[source]={source}&metadata[companyUrl]={domain}`。既知ならemail/nameをprefillクエリで渡す（AIチャット経由では通常未知）。
4. **サーバ真値**: cal.com Webhook `BOOKING_CREATED` → Workers `/api/cal-webhook` → metadata.sessionId で Notion lead 行を upsert（status=complete, contactMethod=booking, email=attendee email）→ Slack complete-booked。**クライアントイベントは演出、webhookが真値**。
5. **フォールバック**: embedスクリプト読込失敗時は従来どおり新規タブでプレーンリンク（`?overlayCalendar=true`、ContactPage実装と同形）。この場合ドロワーは `bookingStarted` のまま「予約画面を別タブで開きました。完了後はメールをご確認ください」を表示し、副導線（メール）も併記。webhookが後追いでcompleteに昇格させる。

---

## H. 既存設計書への差分指示（Opus/codex向け）

### H.1 contact-ai-funnel-design.md

1. §1.2 ファネル図を本書§A.2で置換（深掘り→価値交換→商談化 の順序を、一次価値→**予約**→エンリッチへ）。
2. §2.2 Step3（深掘り）を削除、Step4（価値交換）を本書§C（pull型ソフトask）で置換、Step5を本書Step3a/4/5で置換。Step0–2は維持。
3. §2.3 状態モデルを本書§A.2のphase列で置換（`qualifying`系は廃止、`bookingStarted/booked/enriching/completed`追加）。
4. §3 離脱防止6「sunk-value表現」をメール導線から外す（予約主線では不使用）。他は維持。
5. §7 issue表: **E10**=cal.com統合（embed popup＋webhook＋metadata連携、§G）／**E11**=取得後エンリッチUI（§D）を追加。E3（状態機械）の内容を本書§A準拠に更新。実装順は E8→E4→**E10**→E1/E3→E9→E5/E6→**E11**→E2→E7。

### H.2 contact-ai-advanced-design.md

1. §1.2 質問表: A2（課題）を Step3→**エンリッチQ1**へ移設。**A3（温度感）は削除**（予約行動がシグナルを代替）。A5/A6はエンリッチQ3/Q2として維持。摩擦予算（§1.1-3）を「URL入力1回＋クリック1回」に改定。
2. §1.3 逐語スケルトンを本書§B.2／§C.2／§D.2で置換。Step5.5はエンリッチ（§D）に統合。
3. §2.3 レポート構成: 5章・6章の温度別出し分けを固定文（進め方モデル＋壁打ち案内）に一本化。4章（課題特化）はエンリッチQ1回答時のみ生成（**メール送信後の回答なら追補メールは送らず、次回接触の営業資料としてNotionに保持**——再送はノイズ）。
4. §4.2 stage enumを本書§F.3で、§4.5 Slack Tierを本書§F.4で置換。
5. §3（出力コントラクト）・§4.3/4.4/4.6/4.7 は**変更なし**。

---

## I. 受け入れ基準（実装完了の定義）

1. 連絡先取得（booked/leadCaptured）より前に、URL入力以外の質問UI（チップ・選択・自由入力）が一切表示されない。
2. `insightsShown` で予約CTA（ArrowCTA fill「日程を選ぶ」）が3案直下に表示され、モバイルではstickyバーでスクロール中も常時可視。
3. cal.com popupで予約完了 → ドロワーが `booked` に遷移し、webhook経由でNotion行が `complete / contactMethod=booking` に昇格、Slack complete-booked 通知が出る。
4. メールaskはpull型（訪問者のタップでのみ表示）・セッション1回・同意チェックなしでは送信不可。declined後の再要求なし。
5. エンリッチは最大3問・1画面1問・各画面にスキップ・冒頭に「答えなくても完了済み」明記。回答ごとにlead PATCHとエコーバック表示。
6. AIStarterBandで無効URL送信時、Band内にインラインエラーが表示される（ドロワー未開のまま無反応にならない）。
7. オーバーレイクリックでドロワーが閉じ、再開時に保存phaseから復帰する。
8. §F.2の全イベントが発火し、`ai_chat_drawer_closed` にphaseラベルが載る。
9. 全表示文言に禁止表現（必ず/保証/N%削減できます 等）・感嘆符連発・希少性演出がない。

---

## 付記: 自己批判と割り切り

- **3案直後の予約askは早すぎないか**: 旧設計は質問2つで「自分ごと化」を深めてから交換に入った。新設計はその深化を捨てて摩擦を削る側に賭けている。予約率が想定を大きく割る場合の第一の緩和策は「エンリッチQ1（課題）を予約前に1問だけ戻す」だが、それは経営決定4の再審議事項なので、データ（`next_step_shown`→`booking_click` の転換率）を持って経営者に諮ること。
- **メールaskをpull型に落とした**ため、メール取得数は旧設計比で確実に減る。これは「メールを主目的にしない」決定の直接の帰結であり、副KPIの絶対数低下は設計不良ではない。見るべきは統合の連絡先取得率。
- **温度感A3の削除**でレポートの締め出し分けを失うが、予約有無という行動データの方が自己申告より信頼できる。レポート品質への影響は軽微と判断。
- cal.com embedのイベント仕様は変動しうる。§G-5のプレーンリンク・フォールバックが常に成立するため、embed故障が予約導線の全損にならない構造は担保済み。
