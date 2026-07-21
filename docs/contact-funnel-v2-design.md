# honkoma 問い合わせ動線 v2 — 「単体サービス級」AI診断ファネル 設計正典

> 設計: Fable 5。実装: Opus / codex（本書はコードなし・設計のみ）。作成: 2026-07-06
> 位置づけ: [ai-chat-funnel-ux-redesign.md](./ai-chat-funnel-ux-redesign.md)（予約ファースト v1）の**上位改訂**。矛盾時は本書が優先。技術基盤の原則（DeepSeek adapter / 出力コントラクト / partial capture / Workers / Notion / Slack）は [contact-ai-advanced-design.md](./contact-ai-advanced-design.md) §3–4 のまま**不変**。
> 本書が変えるもの: 動線（深掘りフェーズの新設）・RAG（Notion事例）・入口（専用着地ページ）・人間バトン・フォーム改良。

## 0. v1からの決定変更と、その正当性

### 0.1 経営決定4「取得前の深掘り質問は全廃」の改訂（要・社長承認 → 要判断#1）

v1は「LPに来た温かい訪問者を、最小摩擦で予約に流す」設計だった。今回の要望は対象が違う——**YouTube/note経由の文脈ゼロの冷たい訪問者**を、この動線単体でCVさせる。冷たい訪問者に3案直後の「30分予約しませんか」は早すぎる。**深掘り＝診断の質そのものが商品**であり、質問はコストではなく価値提供の装置になる。

ただしv1の教訓は捨てない。次の3原則で「重くしない」を担保する:

1. **1問1価値返し**: 回答のたびに出力が目に見えて変わる。変えられない質問は置かない（役職は取得後エンリッチのまま）。
2. **タップ主体・最大3問・全問スキップ可**: 自由入力は課題1問の「その他」のみ・任意。
3. **質問はPII不要のものだけ**: 連絡先（メール）は最後の人間バトンまで一切要求しない。

### 0.2 設計の背骨（1文）

**「URLを入れる → AIが3つの仮説を返す → 課題を1〜3タップで深掘り → 匿名事例つきの"進め方プラン"を返す → 『ここから先は、林拓海が直接見ます』の人間バトンで予約/メールにCV」**——AIが深掘るほど診断が具体化する体験そのものがhonkomaの実力証明であり、最後に人間（代表）が出てくることが冷たい訪問者への最大の信頼形成になる。

### 0.3 現状実装のギャップ（設計の前提として明記）

| # | ギャップ | 本書での扱い |
|---|---|---|
| G1 | **レポートメール未送信**（Worker `emailSent: false` 固定なのにUIは「数分で届きます」） | Phase0で実送信を必須化（§8）。送信基盤の選定は要判断#3 |
| G2 | **予約成立の自動突合不能**（Googleカレンダーはmetadata/webhookなし） | 「診断コード」による人力突合を設計（§6.3） |
| G3 | **共有リンクが仮実装**（/contactへのリンク） | Phase0で文言ごと撤去、Phase2で実装（§8） |
| G4 | **Cron未実装**（hot-partial判定・digest・90日パージが動いていない） | Phase1で実装（§8） |

---

## 1. 全体動線図

### 1.1 入口 → CVまでの全体像

```
[YouTube/note 説明欄リンク]                    [LP内の既存起動点 A–E]
  ltdhonkoma.com/ai?utm_…                       (hero/float/whatwedo/cases/exit)
        │                                              │
        ▼                                              ▼
  専用着地ページ /ai ──────────────┐        ChatDrawer（既存・右ドロワー）
  hook＋信頼帯＋インラインChatStage │              │
        └────────────┬─────────────┘              │
                     ▼   （同一の状態機械・同一phase列を2つの外殻で共有）
              [Step0] URL入力（非PII・1入力）
                     ▼
              [Step1] 解析中（実シグナル逐次表示）── 失敗 → analysisFailed（仮説診断で合流）
                     ▼
              [Step2] 3つの仮説（insightsShown）＋ Q1課題チップ
                     │ 回答 ──────────────┐  「答えず相談する」→ バトンへ(汎用プラン)
                     ▼                     │
              [Step3] 深掘り（deepening）  │  Q2規模 → Q3AI活用状況（各スキップ可）
                     ▼                     │
              [Step4] 進め方プラン生成（focusBuilding 5–10秒・進捗表示）
                     ▼
              [Step5] focusShown ＝ 進め方プラン ＋ 匿名事例カード(Notion-RAG) ＋ 人間バトン
                     │
        ┌────────────┼───────────────┐
        ▼            ▼               ▼
  [3a 予約]      [3b メール]      [閉じる]
  bookingStarted  emailRequested   partialのまま
  (Googleカレンダー (メール＋同意    (Slack partial通知
   新規タブ＋      → leadCaptured    ＝既存挙動を維持)
   診断コード提示)   → 診断メール実送信)
        │            │
        └─────┬──────┘
              ▼
        [Step6] 取得後エンリッチ（role 1問・任意）→ completed
```

### 1.2 ChatPhase v2（状態遷移）

```
idle → analyzing ─┬→ insightsShown ─┬→ deepening → focusBuilding → focusShown ─┬→ bookingStarted ─┐
                  │ (Q1課題を内包)   │ (Q2/Q3)                    (バトン内包)  ├→ emailRequested ─┼→ leadCaptured ┐
                  └→ analysisFailed ─┘→(スキップ)→ focusShown[generic]          │                  └→ emailDeclined │
                     (同画面・注記つき)                                          └(閉じる)→ partialのまま           ▼
                                                                                                  enriching → completed
```

- **追加phase**: `deepening` `focusBuilding` `focusShown`
- **維持**: `idle` `analyzing` `insightsShown` `analysisFailed` `bookingStarted` `emailRequested` `leadCaptured` `emailDeclined` `enriching` `completed`（types.tsの既存enumと後方互換。`booked`はGoogleカレンダー化で検知不能のため使用しない——将来突合自動化時の予約枠として温存）
- **state追加フィールド**: `painPoint`（enum）/ `painPointRaw`（自由入力原文）/ `companySize`（enum・null許容）/ `aiMaturity`（enum・null許容）/ `focusPlan`（FocusPlan JSON）/ `matchedCase`（CaseRecord | null）/ `diagnosisCode`（sessionId由来の短縮コード）/ `contactMethod: "booking" | "email" | null`
- **Providerアクション差分**: `answerPain(value, raw?)` / `skipDeepen()`（→汎用プランでfocusShownへ）/ `answerSize(value)` / `answerMaturity(value)` / `buildFocus()`（Worker `deepen` 呼び出し）/ `startBooking()`（維持・診断コード提示を追加）/ `requestEmail()` / `submitEmailLead()` / `answerEnrich("role", v)` / `skipEnrich()`。v1の`choosePainPoint`廃止方針は`answerPain`として実質復活（ただし位置が違う——診断の中盤、連絡先要求の前）。

### 1.3 離脱回収（各stepの受け皿・partial→Slack維持/強化）

| 離脱点 | 受け皿 |
|---|---|
| /ai 着地のみで離脱 | gtagのみ（`ai_landing_view`→`ai_landing_start`の転換率がhook KPI） |
| URL入力後・解析中 | partial（stage=url_entered/analyzed）→ Notion保存。Slackはdigest扱い（Phase1） |
| 3案表示後・Q1未回答 | partial（stage=analyzed）＋ sessionStorage再開（既存） |
| Q1回答後に離脱 | **hot-partial**（課題まで答えた人は温い）→ Slack個別通知（Phase1でCron化。Phase0は既存の即時partial通知を維持） |
| focusShown到達後に離脱 | **最温のhot-partial**。Slack通知に診断コード・課題・プラン要旨を含め人力フォロー最優先 |
| 予約タブを開いて未予約 | 検知不能（新規タブ）。booking_clickのSlack即時通知＋診断コードで人力突合。予約が来なければ翌日フォロー対象 |
| メールask離脱 | declined記録・再要求なし（v1原則維持）。静かな予約リンク残置 |
| エンリッチ離脱 | リスクゼロ（連絡先確定済み）。無通知でPATCHのみ |

### 1.4 専用着地ページ /ai（新設・冷たい訪問者の入口）

- ルート: `/ai`（短くYouTube概要欄向き）。`utm_source=youtube|note` / `utm_campaign={動画・記事slug}` で流入元を判別しリードに記録（既存utm機構をそのまま使用）。
- 構成（上から）:
  1. **Hero**: kicker `AI Diagnosis` ／ H1「御社ならAIをどう使えるか。」／ sub「AIが御社サイトを読み、売上を伸ばす・コストを削る・現場に実装する、の3軸で仮説を返します。**無料・登録不要・約60秒。**」／ URL入力＋ArrowCTA(fill)「AIに聞いてみる」——**above the foldで入力欄が見える**。
  2. utm_source=youtube/note のときだけ入力欄上に1行:「動画からお越しの方へ——ここからは、御社の話をしましょう。」（noteは「記事から〜」）
  3. **信頼帯**（1行3要素・淡色）: 「30社以上のAI伴走導入（上場企業含む）」／「診断の続きは、代表・林拓海が直接見ます」（実写顔写真・小）／「売り込みはしません」
  4. **ChatStage**（インライン・ドロワーではなくページ内に展開。URL送信でこの位置にスクロール固定）
  5. **診断の仕組み** 3ステップ図解（URLを読む→3つの仮説→課題に絞った進め方＋近い事例）
  6. **ミニFAQ** 3問: 入力情報の扱い（透明性文言＋Privacyリンク）／なぜ無料か（「honkomaの初回診断は、いつでもここまで無料です。先の伴走が私たちの事業です」）／売り込みはあるか（「診断メモ以外のご案内は差し上げません」）
  7. 標準フッター
- ChatDrawer（LP内起動）とChatStage（/aiインライン）は**同一の状態機械・同一のフェーズ描画コンポーネントを共有**し、外殻（overlay+panel vs ページ内セクション）だけ差し替える。入口5＋1・体験1の原則を維持。
- SEO: Phase0はnoindex推奨（YouTube/note専用の計測しやすい入口として運用し、コピーが安定したらindex解放）→ 要判断#7。

---

## 2. 会話設計

### 2.1 原則（v1から継承＋追加）

- 敬体・静かな確信・感嘆符と希少性演出の禁止（トーン規定は高度設計§2.4のまま）。
- **エコーバックは固定テンプレ＋差し込み**（LLM不使用・即時表示）。LLMを待つのは解析と深掘り生成の2箇所だけ。会話のテンポは決定論で守る。
- 質問は「営業のために聞く」フレームを一切持たない。全質問が「診断を良くするため」の理由を文中で言う。
- 業種は**聞かない**（URL解析で推定し、3案冒頭の「〜とお見受けしました」で確認。誤読はバトンの商談理由に転化——v1の思想を維持）。

### 2.2 質問列（何を・どの順で・なぜ）

| # | phase | 質問 | 形式 | なぜ必要か（診断品質／事例マッチ／営業判断） |
|---|---|---|---|---|
| Q0 | idle | 会社サイトURL | テキスト1欄 | 品質: 解析燃料（非PII・正入力インセンティブ内在） |
| Q1 | insightsShown | いちばん重い課題 | チップ6択＋自由入力(任意)＋スキップ | 品質: 深掘り軸の選定（3案→1案への絞り込み）／マッチ: painCategory＝RAG検索の主キー／営業: 案件種別 |
| Q2 | deepening | 会社の規模 | チップ4択＋スキップ | 品質: 実装体制の現実味（10名の会社に専任チーム前提の提案をしない）／マッチ: 近い規模の事例選定／営業: 案件規模 |
| Q3 | deepening | AI・ITツールの今 | チップ4択＋スキップ | 品質: 始め方の位置決め（導入か・定着か・内製化か＝honkomaの3形態への接続）／マッチ: 成熟度の近い事例／営業: 導入成熟度 |
| Q4 | enriching | お立場（役職） | チップ4択・**取得後のみ** | 営業: 決裁者判定。診断品質に寄与しないため取得前に置かない（v1原則維持） |

摩擦予算: 連絡先要求前の操作は「URL入力1回＋タップ最大3回」。v1の「URL＋クリック1回」から3タップ分増えるが、各タップの直後に出力が変わる（エコーバック→最終的に専用プラン）ため、**摩擦ではなく診断への投資**として体験される。これが成立しない実装（回答しても出力が変わらない）は受け入れ不可（§9受入基準）。

### 2.3 逐語スケルトン（実文言）

**Q1（3案カードの直下・insightsShown内）**

> **3つのうち、実情に近いものはありましたか。**
> いちばん重い課題を1つだけ教えてください。ここから先の診断を、その課題に絞って組み直します。
>
> チップ: `人手不足・属人化` ／ `問い合わせ・顧客対応` ／ `バックオフィス業務` ／ `売上・集客` ／ `データが活かせていない` ／ `どれでもない（ひとこと入力）`
> \<text-button\>質問に答えず、このまま相談する\</text-button\>

- エコーバック（固定テーブル・LLM不使用。マッピングはv1 §D.2を継承: 人手不足→FDE / 問い合わせ・バックオフィス→BOTTOM_LINE / 売上→TOP_LINE / データ→FDE / その他→confidence先頭案）:
  「{課題}ですね。3案のうち **{最関連案タイトル}** を軸に、進め方を具体化します。」
- 自由入力はblurまたは1.5秒アイドルでPATCH（高度設計§1.4のままLLM要約＋分類・原文保存）。
- スキップ（「答えず相談する」）→ `focusShown[generic]`: 進め方プランは固定の汎用版（3案総合＋標準プロセス）＋事例カードなしでバトンへ直行。**答えない自由は常にCVへの近道と両立させる。**

**Q2（deepening・1画面1問）**

> **会社の規模だけ、教えてください。**
> 進め方の現実味——誰が運用を持てるか——を合わせます。
>
> チップ: `〜10名` ／ `〜50名` ／ `〜300名` ／ `301名〜`　　\<text-button\>スキップ\</text-button\>

- エコーバック: 「{規模}の体制を前提に組み立てます。近い規模の事例も探します。」

**Q3（deepening）**

> **最後に1つ。AIやITツールの今は、どれに近いですか。**
>
> チップ: `まだほとんど使っていない` ／ `個人で使う人はいる` ／ `一部の業務で導入済み` ／ `全社的に活用している`　　\<text-button\>スキップ\</text-button\>

- エコーバック: 「承知しました。{`導入の最初の一歩` / `個人利用から業務への引き上げ` / `定着と横展開` / `内製化と高度化`}から始まる形で組みます。」（enum→開始フェーズの固定マッピング）

**focusBuilding（生成待ち・5〜10秒）** — 進捗行を実処理に同期して逐次表示:

> `{課題}の進め方を組み立てています` → `近い状況の事例を探しています` → `体制と最初の一歩を整理しています`

**focusShown（診断の本体・§3のRAG出力）** — 構成は上から:

1. **言い換え1文**（restatement）:「御社の課題は『{訪問者の語彙での言い換え}』と理解しました。違っていたら、それごと壁打ちで直せます。」
2. **進め方プラン**: 3ステップ（`1〜2週目` / `3〜6週目` / `その後`）各1行＋「honkomaがやること／御社にお願いすること」の役割分担＋「必要になるもの」（データ・ツールの前提）＋リスク1文。
3. **匿名事例カード**（該当時のみ・§3.5の描画規則）: 「近い状況では——」＋事例タイトル・状況・打ち手・結果（DB原文）＋接続1文（LLM生成・≤80字）。フッターに固定注記「事例は特定を避けるため、業種・規模など一部の表現を調整しています。」
4. **人間バトン**（§2.4）。

**人間バトン（focusShown末尾・§2.4実文言）**

> **ここから先は、人が見ます。**
> ここまでの診断は、公開情報と{n}回の回答から立てた仮説です。この内容は代表の林拓海が直接確認します。会話を引き継いだ30分の壁打ち（オンライン・無料）で、御社の実情に合わせて組み直しませんか。売り込みはしません。
>
> ［ArrowCTA fill / withText: **林拓海と日程を選ぶ**］　\<small\>30分・オンライン・無料\</small\>
> \<text-button\>先にこの診断をメールで受け取る\</text-button\>

- 主CTAタップ → `bookingStarted`: Googleカレンダーを新規タブで開き、ドロワー/ステージ側に:
  > 予約画面を、別タブで開きました。
  > 予約フォームの「ご相談内容」欄に、この**診断コード: {HK-XXXX}** をお書きください。この診断を引き継いだ状態で当日を始められます。
  > ［再オープン用ArrowCTA］　\<text-button\>日程が合わなければ、この診断をメールで残す\</text-button\>
- 副CTAタップ → `emailRequested`（§2.5）。
- モバイル: focusShown中はパネル/ステージ下端にstickyバー（左: ArrowCTA sm/fill「日程を選ぶ」、右: text「メールで残す」）——v1 §E.2-4の仕様を`insightsShown`から`focusShown`へ移設（3案時点ではまだCTAを急がせない）。

**メールask（emailRequested・pull型・セッション1回・v1原則維持）**

> **この診断を、メールでそのまま。**
> 3つの仮説と、{課題}の進め方・近い事例をまとめてお送りします。診断メモ以外のご案内は差し上げません。内容は代表の林も確認します。
>
> ［input type=email / placeholder: `name@company.co.jp`］
> ☐ [プライバシーポリシー](/privacy) に同意します
> ［submit: **診断を受け取る**］

- 同意チェックONで送信された時のみemailがサーバへ載る（構造保証・高度設計§4.6維持）。
- 送信成功 → `leadCaptured`:「送信しました。数分で届きます。」＋ ArrowCTA outline「日程を選ぶ」（メール派への戻り道）＋「別のURLで診断する」。**このコピーはPhase0でメール実送信が実装されて初めて許される**（§0.3 G1）。
- 「共有リンクで残す」文言はPhase0で撤去（G3）。declineは「今回は受け取らない」テキストリンクに置換し、declined後の再要求なし。

**取得後エンリッチ（enriching）** — v1 §Dを1問に縮小（Q2/Q3は取得前に移動済みのため）:

> よければ最後に1つだけ。**答えなくても予約/送信は完了しています。**　お立場は？
> チップ: `経営者・役員` ／ `部門責任者` ／ `現場担当` ／ `情報収集中`　　\<text-button\>ここまでで大丈夫\</text-button\>

→ `completed`:「準備が整いました。」（予約者には「当日は診断コードの内容から始めます。」を追記）

### 2.4 analysisFailed の扱い（維持＋深掘り接続）

仮説診断で3案を出す現行挙動を維持。Q1以降も同じに流す。focusShownの言い換え文の直後に注記「今回は公開情報が少なく、仮説の割合が大きめです。壁打ちではその分、実情の聞き取りから始めます。」——誠実さをバトン理由に接続（v1 B.2の思想を深掘り版に移植）。

---

## 3. RAG設計 — Notion事例の検索・匿名化・注入

### 3.1 方針（1文）

**匿名化は「書く時」に人間が行い、LLMと訪問者には匿名化済みテキストしか渡さない。** 検索はベクトルではなくタグ照合で行う（事例数十件の規模ではその方が精度・監査性・実装コストの全てで勝る）。

### 3.2 事例データの出所とスキーマ（Notion「Case Studies (RAG)」DB・新設）

出所: Clients DB・議事録・提案書から**honkomaメンバーが手書きで起こした匿名化済み事例**のみ。クライアントDBからの自動抽出はしない（匿名化をLLMに任せない）。初期投入はClients DBの実稼働7社＋過去実績から**5〜8件**を目標に社長レビュー付きで作成する。

| プロパティ | 型 | 内容・制約 |
|---|---|---|
| `Title` | title | 匿名形の一行。例「従業員30名規模の建設業で、見積り一次対応をAIに移した」 |
| `Industry` | select | 大分類（建設/製造/小売・EC/医療・介護/士業・専門サービス/IT/その他）。特定リスクがある狭い業種は上位分類に丸める |
| `Company Size` | select | `〜10名` / `〜50名` / `〜300名` / `301名〜`（チャットのQ2と同一enum） |
| `Pain Category` | multi-select | Q1チップと同一enum（検索の主キー） |
| `Axis` | select | top_line / bottom_line / fde |
| `AI Maturity` | select | Q3と同一enum（導入前の状態） |
| `Situation` | rich_text ≤200字 | 導入前の状況。固有名詞・特定可能情報なし |
| `Approach` | rich_text ≤300字 | 何をどう作ったか（ツール名は一般名詞可: Slack/Notion/既存基幹 等） |
| `Outcome` | rich_text ≤200字 | **裏取り済みの定性表現、または本人確認済みレンジのみ**。「◯%削減」等の断定数値は入力時点で禁止 |
| `Duration` | rich_text | 「約6週間」等 |
| `Publish Level` | select | `anon_ok` / `internal_only` — **Workerは`anon_ok`のみ取得**（構造フィルタ） |
| `Verified By` / `Verified At` | person / date | 事実確認の記録（監査方針）。未検証の事例は`anon_ok`にできない運用 |
| `Source Client` | relation | 内部トレース用。**Workerの取得プロパティに含めない**（LLMに渡らない構造保証） |

**匿名化7重の担保**: ①作成時に人間が匿名化 ②`Publish Level`フィルタ ③`Source Client`を取得対象外 ④コンプライアンスlintの禁止語辞書にクライアント名リストを追加（全LLM出力に適用） ⑤業種×規模で1社に特定しうる組合せは業種を丸める（作成チェックリスト） ⑥Outcomeは検証済みのみ ⑦UI固定注記「表現を調整しています」。

### 3.3 検索（現実的な実装形）

1. **取得**: Workerが Notion API `databases/{CASES_DB_ID}/query`（filter: Publish Level = anon_ok）で全件取得 → `CaseRecord[]`に整形 → **Cache API/KVに1時間キャッシュ**（数十件規模。毎リクエストのNotionレイテンシを排除）。Secretに `NOTION_CASES_DB_ID` を追加。
2. **スコアリング（Worker内・決定論）**: `painCategory一致 +3` / `size同一 +2・隣接 +1` / `industry推定一致 +2`（URL解析のbusinessSummaryから推定した業種タグ） / `axis一致 +1` / `aiMaturity一致 +1`。
3. **選定**: 最高スコア1件（次点1件はUI上`<details>`に畳む）。**最高スコア < 3 なら事例を出さない**——弱い類似を無理に見せるより「近い事例は壁打ちで直接ご紹介します」の1行の方が誠実で、バトン理由にもなる。
4. **注入**: `deepen`のDeepSeek呼び出しに `<case_studies>`区切りで構造化テキストとして渡し、指示は「事例の内容を書き換えない・事例にない数値/事実を創作しない・生成するのは接続文（なぜこの事例が近いか・80字以内）のみ」。

### 3.4 捏造の構造的排除

- **事例カードはLLM出力から描画しない。** Title/Situation/Approach/Outcome/DurationはDB原文をそのまま型付きコンポーネントで表示。LLMが書くのは接続文1フィールドだけで、それにもコンプラregex＋クライアント名辞書lintをかける（高度設計§3.4のリペア梯子に載せる）。
- ベクトル検索（Cloudflare Vectorize等）は**事例50件超まで見送り**。件数が少ないうちはタグ照合が最適で、「なぜこの事例が出たか」を人間が説明できる＝監査可能性も高い。

### 3.5 FocusPlan 出力コントラクト（deepenの生成物・スキーマ駆動）

```json
{
  "$id": "honkoma/focus-plan/1.0",
  "required": ["schemaVersion", "restatement", "chosenAxis", "steps", "roles", "prerequisites", "agenda", "riskNote"],
  "properties": {
    "schemaVersion": { "const": "1.0" },
    "restatement":   { "type": "string", "maxLength": 80 },
    "chosenAxis":    { "enum": ["top_line", "bottom_line", "fde"] },
    "steps": { "minItems": 3, "maxItems": 3,
      "items": { "required": ["phase", "action"],
        "properties": { "phase": { "maxLength": 14 }, "action": { "maxLength": 80 } } } },
    "roles": { "properties": { "honkoma": { "maxLength": 100 }, "client": { "maxLength": 100 } } },
    "prerequisites": { "type": "string", "maxLength": 100 },
    "agenda": { "minItems": 2, "maxItems": 3, "items": { "maxLength": 60 } },
    "riskNote": { "type": "string", "maxLength": 80 },
    "caseConnection": { "type": "string", "maxLength": 80 }
  }
}
```

- `agenda`（壁打ちで確認すること2〜3項目）は**バトンの中身の可視化**——「相談したら何が起きるか」を先に見せる。バトン画面の本文直下に小さく箇条書き表示。
- 検証・リペア・言語検査・コンプラlint・決定論フォールバック（painCategory別の固定テンプレプラン）は高度設計§3.4の梯子をそのまま適用。**事例カードは検索が決定論なのでLLM失敗時も表示できる**（プランのみテンプレに落ちる）。
- deepen入力: analyzedSummary＋signals＋3案（該当axis）＋pain(+raw)＋size＋maturity＋選定事例＋会社正データブロック＋トーン規定＋スキーマ＋few-shot 1例。temperature 0.35 / max_tokens 1500 / response_format json_object（現行analyze実装と同型）。

---

## 4. コピー正典（フェーズ別・確定文言）

§2.3で逐語を示した箇所は略記。ここは残りと原則のみ。

| 箇所 | 文言 |
|---|---|
| /ai Hero H1 | 御社ならAIをどう使えるか。 |
| /ai Hero sub | AIが御社サイトを読み、売上を伸ばす・コストを削る・現場に実装する、の3軸で仮説を返します。無料・登録不要・約60秒。 |
| /ai 信頼帯 | 30社以上のAI伴走導入（上場企業含む）／診断の続きは、代表・林拓海が直接見ます／売り込みはしません |
| 透明性文言（入力欄下・常設） | 入力内容は途中でも品質向上・お問い合わせ対応のため保存されます（[プライバシーポリシー](/privacy)） |
| ヘッダーphase連動 | v1 §E.2-1を継承＋追加: `deepening`=「もう少しだけ、御社のことを。」／`focusBuilding`=「組み立てています。」／`focusShown`=「{companyName}の進め方、一案。」（kicker: Focus Plan） |
| バトン見出し | ここから先は、人が見ます。 |
| 予約完了案内 | 予約フォームの「ご相談内容」欄に、診断コード {HK-XXXX} をお書きください。 |
| leadCaptured | 送信しました。数分で届きます。／内容を見て話したくなったら、30分の枠をどうぞ。 |
| completed（予約者） | 準備が整いました。当日は診断コードの内容から始めます。 |
| 禁止 | 感嘆符連発・希少性演出（残枠/カウントダウン）・「必ず/保証/N%削減できます」・未検証数値・クライアント実名 |

診断メール（HTMLメール・Phase0）: 件名「【honkoma】{companyName}のAI活用診断メモ」。構成 = 3つの仮説 → 課題特化の進め方プラン → 匿名事例 → 壁打ち案内（Googleカレンダーリンク＋診断コード）→ 固定免責フッター（高度設計§2.3の7章構成を簡約。全文スキーマ駆動でテンプレ流し込み・LLMにHTMLを書かせない）。

---

## 5. ① シンプル問い合わせフォームの改良（ContactPage）

現行: 3ステップ（種別6択→入力→完了）。GAS＋Worker(Slack/Notion)並列送信・同意必須・完了画面にGoogleカレンダーCTA。骨格は良い。改善リスト:

| # | 改善 | 具体 |
|---|---|---|
| F1 | **必須項目の削減** | 必須 = お名前・メール・内容の3つに絞る。会社名は任意（メールドメインから営業側で特定可能）、従業員数チップは任意のまま。ラベルに「任意」明記 |
| F2 | **項目順の整理** | お名前 → メール → 内容 → 会社名(任意) → 従業員数(任意) → 同意。価値の高い必須を先・任意を後ろへ |
| F3 | **インラインバリデーション** | メールはblurで形式チェックし、フィールド直下にエラー。autoComplete（name/email/organization）とinputmode付与。送信ボタンのdisabled理由（未同意）をボタン下に1行表示 |
| F4 | **信頼要素** | フォーム冒頭に「1営業日以内に担当から返信します」（完了画面の「24時間以内」と統一——正はどちらか要判断#2）＋林の小さな実写＋「この窓口は代表が直接見ています」。同意文言は現行維持 |
| F5 | **途中離脱の回収** | Step2到達時にpartial送信（source=contact_form, stage=form_step2, inquiryType/employeeCount/companyのみ）。message はblur/1.5秒アイドルでPATCH。**name/emailは同意送信まで送らない**（チャットと同じPII線引き）。pagehideでsendBeaconフラッシュ。透明性文言をフォーム下に常設 |
| F6 | **AI診断との併存整理** | AIStarterBandを現在のHero直下からフォーム完了後・ページ下部へ移動。「フォームで相談を決めた人」のページで最初にAIへ分岐させない（主客転倒の解消）。逆にAI診断側からは/contactへ誘導しない（既存どおり） |
| F7 | **計測** | `contact_step1_select`（label=種別）/ `contact_step2_view` / `contact_form_submit`（既存form_submitを改名統一）/ `contact_partial_abandon`（beacon時・label=到達step） |
| F8 | **完了画面** | 現行の予約CTA維持。「診断コード」はフォーム経由では不要（連絡先取得済み） |

---

## 6. CV機構

### 6.1 CV定義

| 層 | 定義 | 検知 |
|---|---|---|
| **主CV: 予約成立** | Googleカレンダーに枠が入る | **人力突合**（§6.3診断コード）。速報proxy = `ai_baton_booking_click` |
| 副CV: メールリード | 同意つきemail送信成功（leadCaptured） | Worker（真値）＋gtag |
| 第3CV: フォーム送信 | contact_form送信成功 | Worker＋gtag |
| マイクロCV | Q1課題回答つきpartial | stage=pain_answered（人力フォロー対象） |

### 6.2 stage enum v2（lead行・前進のみ規則は維持）

```
'opened' → 'url_entered' → 'analyzed' → 'pain_answered' → 'deepened'
  → 'focus_shown' → 'booking_click' | 'email_form_shown'
  → 'contact_captured' → 'enriched'
別フィールド: contactMethod: 'booking' | 'email' | null ／ diagnosisCode
```

Notion Inbound Leads DBへの追加プロパティ: `Pain Raw` / `Company Size`(select) / `AI Maturity`(select) / `Stage`(select) / `Contact Method`(select) / `Diagnosis Code`(rich_text) / `Focus Plan`(rich_text・JSON) / `Matched Case`(rich_text・caseId＋タイトル)。

### 6.3 予約突合 — 診断コード運用（Googleカレンダー制約の現実解）

- `diagnosisCode` = sessionId先頭4文字のbase32大文字化に`HK-`前置（例 HK-3F7K）。衝突しても domain＋日時で人間が判別可能な精度で十分。
- bookingStarted画面・診断メール・Slack booking_click通知の3箇所に必ず表示。Googleカレンダーの予約フォームに「ご相談内容（診断コードがあればご記入ください）」欄を用意（→要判断#6）。
- 予約が入ったら営業がコードでNotion行を検索し `Contact Method=booking / Stage=contact_captured` に手動昇格。**将来cal.com等へ戻す場合はv1 §Gのwebhook設計をそのまま復活**できる（本書はそれを妨げない）。

### 6.4 同意ステップ

- メール送信時の同意チェック必須・未同意はサーバへemail不搭載（構造保証）——現行維持。
- 予約はGoogle側のフォームで完結（当方は事前にPIIを受け取らない）。
- partialの透明性文言をチャット/フォーム/着地ページの3箇所に常設。PrivacyPageに「AI診断チャットで取得する情報」節（取得項目・目的・90日保持）を追加（高度設計§4.6のまま・未実装なら本改修で入れる）。

### 6.5 計測イベント（gtag / category: ai_chat）

既存イベントは維持。追加・変更:

| イベント | 発火 | label |
|---|---|---|
| `ai_landing_view` / `ai_landing_start` | /ai表示／URL送信 | utm_campaign |
| `ai_deep_answered` | Q1/Q2/Q3回答 | pain / size / maturity |
| `ai_deep_skipped` | スキップ | 質問名 |
| `ai_focus_shown` | プラン表示 | case_shown / no_case / generic |
| `ai_baton_shown` | バトン可視化 | source |
| `ai_baton_booking_click` | 予約タップ | source |
| `ai_baton_email_submitted` | メール送信成功 | source |
| `ai_chat_drawer_closed` | 閉じた | その時のphase（離脱分布＝改善バックログ） |

KPI: 主 = 予約数（コード突合）／`focus_shown→booking_click`率。ガードレール = `analyzed÷url_submit`（体験品質）・`analyzed→pain_answered`率（深掘りが重すぎないかの監視。**この値が低いなら質問を削る**）。統合 = 連絡先取得率 =（booking_click ∪ leadCaptured）÷ analyzed。流入別 = utm_campaign単位の landing_view→start→contact 転換。

### 6.6 Slack通知Tier（Phase1で完成・Phase0は現行フラグ運用）

| Tier | 条件 | 形 |
|---|---|---|
| complete-email | leadCaptured | 即時リッチ: domain/課題/規模/成熟度/プラン要旨/事例ID |
| **hot-booking** | booking_click | 即時: 🔥予約クリック {domain}/{診断コード}——**予約が入らなければ翌日フォロー** |
| hot-partial | pain_answered以深＋30分無活動 | 個別軽量（Cron 15分毎） |
| digest | url_entered/analyzedのみ | 日次バッチ（平日18時） |

---

## 7. Topview利用 — 推奨: 動線内は No、告知素材は Yes

**結論: チャット/診断フローの中には生成動画・生成アニメーションを置かない。**

理由: この動線の通貨は「本物のAIが本当に読んだ」という真正性であり、それは解析中の実シグナル逐次表示・回答で変わる出力という**実データの動き**で既に演出されている。そこに合成メディアを足すことは、真正性を売る画面に「作り物」を混ぜる自己矛盾で、LCP/転送量の悪化（冷たい訪問者はモバイル・低速回線前提）にも直結する。人間バトンの林拓海も**実写1枚**とする——人間性を差し出す瞬間にAIアバターを使うのは設計趣旨の逆行。動線内のモーションは既存tokens（m.* / dur / ease / reduced-motion対応済みプリミティブ）で足りる。

**Yesの範囲（2点・いずれもLPのクリティカルパス外）**:

1. **/ai「診断の仕組み」セクションの説明動画（任意・Phase2）**: 16:9・20〜30秒・図解モーショングラフィックス調（実写風人物生成は不使用）。**ポスター画像＋click-to-play・autoplayなし・遅延読み込み**、mp4 ≤6MB を `public/` 配信。プロンプト方針:「白背景・藍色の図形アニメーションで『URL→3つの仮説→事例つきプラン→人と話す』の4コマを順に見せる。ナレーションなし・字幕焼き込み・誇張表現なし」。
2. **YouTube概要欄/note埋め込み用ティザー（サイト外）**: 縦9:16・15秒・「概要欄のリンクから、御社のAI活用診断ができます」の告知素材。こちらはTopviewの本領。LP側の制約と無関係に量産してよい。

ガードレール: 動線内メディアは初期ロード合計200KB以内／`prefers-reduced-motion`で全停止／動画は必ずclick-to-play。この3つを破る演出はKPIがどうであれ入れない。

---

## 8. 段階実装計画

### Phase0 — 「単体サービス」の最小成立（これだけで公開できる）

1. **Worker**: `deepen` action新設（FocusPlanコントラクト・検証lint・決定論フォールバック）／Case Studies DB取得＋キャッシュ＋タグ照合／**メール実送信**（capture_lead成功時に診断HTMLメール——基盤は要判断#3、推奨はCloudflare Email Service）／lead PATCHに新フィールド受理（whitelist方式）。
2. **Notion**: Case Studies (RAG) DB作成・integration共有・**種事例5〜8件を社長検証つきで投入**／Inbound Leads DBに§6.2のプロパティ追加。
3. **フロント**: phase v2（deepening/focusBuilding/focusShown）＋Q1〜Q3チップUI＋エコーバック／FocusPlanView・CaseCard・BatonBlock・DiagnosisCode表示／ChatDrawerから共有ChatStage抽出＋ /ai ページ新設（hero・信頼帯・FAQ・noindex）／共有リンク文言撤去／sticky CTAバー（focusShown時・モバイル）。
4. **計測**: §6.5イベント一式。

### Phase1 — 回収と運用の完成

フォーム改良F1〜F8／Cron Trigger（hot-partial 15分毎・digest日次・partial 90日パージ）／Slack Tier出し分け／取得後エンリッチ（role）／URLなし開始フロー（業種チップ→仮説診断）／PrivacyPage追記。

### Phase2 — 拡張

実共有リンク（Worker KVに検証済みスナップショット保存→ /ai/s/{id} 閲覧ページ）／事例ライブラリ拡充（目標15件＋lint辞書の育成）／Topview素材2点／hookとバトン文言のA/B／事例50件超でVectorize再検討／予約基盤をwebhookのあるものへ戻すかの再評価（v1 §G復活）。

---

## 9. Opusへの実装ハンドオフ（Phase0）

**触るファイル**
- `workers/ai-chat/src/index.ts`: `deepen` action（入力: sessionId/painPoint/painPointRaw/companySize/aiMaturity/analyzedSummary/proposals。出力: `{ok, focusPlan, matchedCase|null, mode}`）／Case取得・Cache API 1hキャッシュ・§3.3スコアリング／コンプラregex＋クライアント名辞書lint／メール送信（capture_lead内・`ctx.waitUntil`）／新Secret: `NOTION_CASES_DB_ID`＋メール基盤のkey
- `src/features/ai-chat/types.ts`: ChatPhase追加（deepening/focusBuilding/focusShown）・FocusPlan/CaseRecord型・state新フィールド（§1.2）
- `src/features/ai-chat/ChatProvider.tsx`: `answerPain/skipDeepen/answerSize/answerMaturity/buildFocus/answerEnrich/skipEnrich`・diagnosisCode生成・各回答でpartial PATCH＋gtag
- `src/features/ai-chat/components/`: ChatDrawer→`ChatStage`共有化＋新規 `FocusPlanView` `CaseCard` `BatonBlock`（すべてtokens/ArrowCTA/inverse範囲・新規モーション資産なし）
- `src/pages/AiDiagnosisPage.tsx`（新設）＋ `src/index.tsx` に `/ai` ルート＋noindexメタ
- Notion: Case Studies DB（§3.2スキーマ）／Inbound Leads DB プロパティ追加（§6.2）
- docs: 本書を正典として `ai-chat-funnel-ux-redesign.md` 冒頭に「§A–Dは contact-funnel-v2-design.md が優先」の注記を追加

**作る状態**: §1.2 phase列・§6.2 stage enum・FocusPlanコントラクト（§3.5）。

**受入基準（Phase0の完了定義）**
1. /ai に着地→URL入力→3案→Q1回答→（Q2/Q3任意）→事例つきプラン→バトン、が通しで動き、**各回答の直後に画面上の出力が変わる**（エコーバック即時表示）。
2. Q1〜Q3すべてスキップしてもバトンに到達できる（汎用プラン）。
3. 事例カードの本文がNotion DB原文と一致し、`internal_only` 事例・`Source Client` がWorkerレスポンスに一切含まれない。スコア<3で事例非表示＋代替1行が出る。
4. 全LLM出力（3案・プラン・接続文）がコンプラlint（禁止表現＋クライアント名辞書）を通過。lint不合格が決定論フォールバックへ落ちる。
5. メールリード送信で診断HTMLメールが実際に届き、`emailSent: true` が返る。同意なしでは email がリクエストに載らない。
6. bookingStarted画面・メール・Slack通知の3箇所に同一の診断コードが表示される。
7. 途中で閉じてもpartialがNotionに残りSlackに飛ぶ（既存挙動の非破壊）。再開時に保存phaseから復帰。
8. §6.5の全イベント発火。tsc差分エラー0・build通過・実ブラウザでReveal系発火確認（スキル検証プロトコル準拠）。
9. 全文言に感嘆符連発・希少性演出・断定数値・実名事例がない。reduced-motionで全モーション減衰。

---

## 10. 社長への要判断リスト

| # | 論点 | 推奨 |
|---|---|---|
| 1 | **経営決定4の改訂**: 取得前の深掘り質問（最大3問・スキップ可）を正式に認めるか | Yes。冷たい流入では深掘り＝商品。`analyzed→pain_answered`率をガードレールに、悪ければ削る |
| 2 | **「林拓海が直接見ます」の運用コミット**: メール相談への返信SLA（「1営業日以内」と書くか）・予約枠は林個人か・フォームの「24時間以内に返信」との統一 | 「内容は代表の林も確認します」に留めSLAは書かない（守れる約束だけ書く） |
| 3 | **メール送信基盤**（Phase0必須・現状未送信） | Cloudflare Email Service（Workers統合が最短）。不可ならResend |
| 4 | **事例の匿名化ポリシー承認**: §3.2スキーマ・作成チェックリスト・「anon_okは林の事実確認必須」の運用 | 本書の案で承認。種事例5〜8件の検証を最初の1営業日タスクに |
| 5 | **Topview**: 動線内は使わない推奨への裁可（告知素材のみYes） | 本書推奨どおり |
| 6 | **診断コード運用**: Googleカレンダー予約フォームに記入欄を設けるか・予約突合を人力でよいか | Yes（月間予約数が人力限界を超えたら予約基盤ごと再評価） |
| 7 | /ai をnoindexで始めるか | noindexで開始、コピー安定後に解放 |
| 8 | フォーム会社名の任意化（F1） | Yes（ドメインから特定可能） |

## 付記: 自己批判と割り切り

- **深掘り3問はCV前の摩擦を確実に増やす。** v1の予約ファーストより連絡先取得率が下がる可能性はある。賭けているのは「冷たい訪問者は摩擦最小より価値実感で動く」という仮説で、検証指標は `analyzed→pain_answered`（重さ）と `focus_shown→contact`（深掘りの見返り）。前者が高く後者も高ければ勝ち、前者が低ければQ2/Q3を削り、両方低ければv1型へ戻す——退路は状態機械上1フラグで作れる構造にしてある（スキップ導線＝v1動線そのもの）。
- **予約成立の真値が人力突合**なのは明確な弱点。ただし現在の予約量では運用が先に立ち、自動化はコード側でなく予約基盤の再選定（webhookを持つもの）で解くのが筋。
- **事例5〜8件のRAGは「検索」と呼ぶには小さい**。それでも「あなたに近い実例が返ってくる」体験価値は件数に比例しない。件数が信頼性を規定するのは検索精度ではなく「該当なし率」であり、§3.3-3の「弱一致は出さない」規則がそれを誠実さに変換する。
- 診断メールの実送信をPhase0必須にしたことで公開が数日遅れるが、「届くと言って届かない」状態での外部流入開始は信頼を最初に毀損するため譲らない。
