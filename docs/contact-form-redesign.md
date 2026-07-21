# 問い合わせ動線 再設計 — Contact Form Redesign

> 設計: Fable 5（2026-07-07）。対象: `src/pages/ContactPage.tsx`（旧Tailwind世界の最後の生き残り）。実装: opus/codex。
> ゴール: LayerX問い合わせ水準の「番号ステップ・ミニマル・余白・絵文字ゼロ」に、honkomaデザインシステムのAI感（TextReveal/Reveal/inverse/ArrowCTA）を乗せる。既存機能（GAS/Slack/attribution/採用モード/GA計測）は無傷。ロジック温存・視覚レイヤー総入れ替え。

## 0. 現状診断
旧トークン(bg-cream/text-ink/text-warm/border-subtle/font-serif/font-mono)・絵文字5種(🚀⚡💻🧑‍💻💬)・lucide多用・丸数字プログレス。リニューアル済み(Recruit/Product/AiDiagnosis)は SectionShell+SectionHeading(TextReveal)+Reveal+ArrowCTA+inverse で統一。Contactだけ別サイトに見える。方針=修繕でなくデザインシステムでの再構築。

## 1. 相談種別の脱・絵文字 → 番号付き罫線リスト(ListRowの視覚言語をbutton化)
`(01) 会社をAIネイティブにしたい… →` の罫線行。番号=font-en/--fs-label、タイトル=font-jp600、右端=ArrowRight18px(絵文字/装飾アイコン全廃)、hover=--surface-raised+title 8px/arrow 4pxスライド(ListRow準拠)、入場=RevealGroup stagger。ローカル`InquiryRow`コンポーネント(aria-label/focus-visible必須)。**5種別の文言・並びは維持**(GA event_label/GAS/Slack/RECRUIT_LABELに直結・変更は計測連続性を切る)。

## 2. デザインシステム移植
- 骨格: SectionShell積み重ね。旧「連絡先3カード帯」廃止→Hero下メタ1行(quickclip@ltdhonkoma.com・初回相談無料・オンライン対応)。Wedge不使用(静かな面)。
- レイアウト(LayerX式): デスクトップ12カラム。左col-4に番号ステップレール(sticky)、右col-8にフォーム(max-width640・余白広め)。アクティブ行左に2px縦バー→ステップ遷移でframer-motion layout spring移動(フォーム面唯一のAI感)。モバイルはレール上部横並びテキストのみ。
- タイポ: 見出し=SectionHeading level1 hero(TextReveal)、ステップ見出し=--fs-h3/700/左寄せ、ラベル=font-jp500/0.875rem(必須*=accent/任意=(任意))。font-serif/font-mono全廃。
- 入力: 下線型維持・色トークン化(focusで--color-accentに0.15s)・placeholderに実例(山田太郎/yamada@example.co.jp/株式会社サンプル)。チップ(従業員数/かかわり方)=罫線+選択時accent-soft。エラーは既存赤継続(新規トークン足さない)。
- モーション当て所(過剰にしない・全てtokens.ts参照): Hero=TextReveal、Step1=RevealGroup、ステップ遷移=m.div key fadeUp、レールバー=layout spring、行hover=ListRow準拠、完了=Reveal clip。motion.直import禁止・直値禁止・reduced-motion既存処理。
- inverse=完了パネル1箇所のみ(navy・見出し+ArrowCTA external hover=spin「オンライン無料相談を予約する」・CheckCircle廃止→font-en「Thank you.」)。
- 送信ボタン: **ArrowCTAに非破壊props(disabled?/type?)追加**しArrowCTA variant=fill/lg「送信する」(recruit「面談を申し込む」)。送信中は「送信中…」。

## 3. ステップ構成 = 3ステップ維持・確認画面(02)入れない
レール表記 (01)ご相談内容/(02)必要事項の入力/(03)完了。確認画面不採用(必須4項目が1画面で見渡せる・honkomaの売りは軽さ・確認は離脱点を増やすだけ)。LayerXから借りるのは番号ステップの見た目の言語であり中身ではない。入力ミス対策=メールblur+完了文言。丸数字/チェック/接続線は全廃。

## 4. 部分キャプチャ → 限定形で「採用」
AI診断はURL(非PII)から捕捉、問い合わせは最初からPII→「都度送信」不可。**発火条件(AND全て)**: ①consent=true ②有効メール ③正式送信未完了 ④離脱シグナル(visibilitychange hidden/pagehide/unmount) ⑤1セッション1回(sessionStorage) ⑥非recruit。送信=sendBeacon(fallback keepalive fetch)で`action:"contact_partial"`。
**誠実性の核**: 同意文言を変更—「プライバシーポリシーに同意し、入力内容を送信することに同意します。※送信ボタンを押す前にページを離れた場合も、ご同意済みの入力内容にもとづきご連絡を差し上げることがあります。」注記はチェックボックス直下に常時表示。**注記を出せないなら部分キャプチャ自体を不採用**。
バックエンド: Worker `action:"contact_partial"`分岐+Slack「問い合わせ 途中離脱(同意済み)」(SLACK_NOTIFY_PARTIAL_LEADS流用)。正式送信通知にもsessionId追加(照合用)。**Notion upsertはPhase1でやらない**(正式送信がGAS+Slackでリード台帳二重化を避ける)。GA=contact_partial_capture追加。
やらない: 同意前の一切の送信・メールのみ(同意なし)送信・recruitでの部分キャプチャ・exit-intentポップアップ。

## 5. 採用モード(?type=recruit)
機能全踏襲、レールを2段(01必要事項の入力/02完了)に。Hero=Careers「カジュアル面談」現行文言維持。AI帯/連絡先/会社名/従業員数非表示。involvementチップ新スタイル。信頼コピー維持。完了inverse共通(CTA「面談日程をえらぶ」)。部分キャプチャ無効。

## 6. opus/codex実装ハンドオフ
触るファイル: `ContactPage.tsx`(視覚全面再構築・state/送信/GA温存、ローカルInquiryRow/StepRail/Field)/`ArrowCTA.tsx`(disabled?/type?非破壊追加)/`api/client.ts`(submitContactPartialLead: sendBeacon)/`workers/ai-chat/src/index.ts`(contact_partial分岐+Slack、正式送信にsessionId)/`PrivacyPage.tsx`(利用目的確認・不足時のみ追記)。
触らない: GAS_URL/GAS payload形/firstTouchAttribution/?type=recruit判定/既存GAイベント名/5種別文言・並び/RECRUIT_LABEL。
受入基準: ①絵文字0・lucideはArrow系のみ・旧トークン残存0(grep) ②通常送信でGAS/Slack後方互換+attribution3点 ③recruit全挙動 ④既存3GAイベント+contact_partial_capture ⑤部分キャプチャ(同意+有効メール+未送信で離脱→Slack1回/送信後・同意なし・無効・recruitで非発火・注記表示) ⑥tsc0/build ⑦claude-in-chrome実ブラウザ検証(TextReveal/レールspring/行hover/inverse反転/375px・スクショproof) ⑧reduced-motion全可視 ⑨duration/easing全てtokens.ts参照(直値grep0)。

## 7. 社長への要判断(3点)
1. 部分キャプチャの透明性注記(§4)を出す前提で採用。注記を出したくないなら部分キャプチャごと不採用。→推奨: 注記を出して採用
2. 電話番号(080-8526-6978): Hero下メタ行に残すかフッターのみか。→推奨: メタ行に残す
3. 確認ステップ非採用(番号ステップの見た目だけ借りる)。→推奨: 3ステップ現行構成のまま

*正データ・コンプラは facts-and-compliance.md 準拠(会社数値の新規主張なし)*
