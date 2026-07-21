# AI診断 評価起点の改善設計 — ai-diagnosis-eval-improvements

> 設計: Fable 5（2026-07-07）。実装: opus（cc）。対象: `workers/ai-chat/src/index.ts`。
> 根拠: [diagnosis-eval-2026-07-07.md](./eval/diagnosis-eval-2026-07-07.md)（10社実測）＋cc特定の根本原因。
> 位置づけ: [ai-diagnosis-content-quality.md](./ai-diagnosis-content-quality.md) と [contact-funnel-v2-design.md](./contact-funnel-v2-design.md)（§2.4/§3.5）の上に載る修正設計。スキーマ・動線・lint(hard)辞書・DeepSeek主経路は不変。

## 0. 前提と設計原則
- model経路27案中10案(約37%)が `repairProposal` でDeepSeek案→`fallbackProposalSet`テンプレへ静かに差し替えられていた。壊れた4社と桧家の差は「置換先テンプレの業種が偶然合っていたか」だけ。DeepSeek自体はほぼ常に正しい。
- 原則1: 良い案を壊さない(repairは削るだけ、別内容へ差し替えない)。原則2: 確信なきときは誤った断定より控えめな汎用。原則3: industry推定は装飾でありfetch失敗系フォールバック専用。

## A) repair/差し替えポリシー再設計【最優先】
- `containsSiteCue`を差し替えトリガから外す→retryトリガ＋テレメトリ専用に。判定はwebsiteText照合へ。
- lint違反時は「文単位除去(。区切りで違反文だけ落とす)」→ダメなら業種非依存の`neutralAxisText`(3軸×3フィールド=9本・asset補間なし)。丸ごと差し替え分岐は削除。
- 最終ゲートのmock全損を廃止(mockはJSON不成立/proposals空のときだけ)。summaryもcue条件撤廃(lint通過で採用)。
- 軸単位の再生成は採らない(既存フルretry1回+文単位除去で十分)。

## B) industry検出の限定【最優先】
- 使い所限定: model経路repairから切り離し(facts引数撤去)、fallbackProposalSet選択(fetch成功×LLM失敗時)のみ。fetch失敗時は常にgeneric。DeepSeekへの`detectedIndustry`は確信時のみ、なければ「不明」。deepenのinferIndustryも同条件。
- スコアリング: industryRulesを{strong,weak}分離。score=2×strong+1×weak、採用は score>=3 かつ2位差>=2、満たなければgeneric。
- 業種証拠から`予約``事例``実績``DX``システム`を除外(signalには残す)。signalRules「施工事例・実績」を`/施工事例|施工実績/`と`/導入事例/`に分割、裸の`/事例/`削除。

## C) fallbackテンプレの質【高】
- asset補間を業種ホワイトリスト化(industryAssetWhitelist)。genericは業種非依存資産(FAQ/フォーム/採用/お知らせ)限定。
- healthcareテンプレ書き直し(「初診」を捨て医療介護両対応): top_line「予約前・利用前の不安を、AIの事前相談で受け止める」等。他6業種はcontent-quality §2.3準拠で点検＋ホワイトリスト適用のみ必須。

## D) fetch薄への対処【高】
- `fetchWebsiteText`: meta(title/description/og)/JSON-LD(Organization/LocalBusiness)抽出をtext先頭へ連結。日本語400字未満なら/company /about /service /recruit を最大2本(各3秒)追加fetch。`thin`(300字未満)を返す。
- thin時: 120字以上→DeepSeek呼ぶ+systemに「観測はmeta由来に限定・内側は仮説形・断定しない」。120字未満→誠実generic mock(業種断定なし)。スキーマ不変。
- Browser Rendering(有料)は今回見送り(要判断#1)。

## E) riskTarget【中】
- `.replace(/[。、].*$/,"")`の読点切り捨てを廃止(。のみで切る)。42字上限で区切り境界まで戻す。8字未満は`primarySpecificTerm(body)`へ。riskNote定型・80字制限は不変。

## F) 良→更良【中・2点のみ】
- summary末尾に「本命の指名」(3案で最も効く一点を仮説形1回)。few-shot例のsummaryにも追記。
- 固有名詞のtitle昇格(商品/サービス/機能の固有名詞があれば最低1案のtitleにそのまま使う・一般名詞化禁止)。

## opus実装ハンドオフ(順序)
1. `repairProposal`/`validateAnalysisWithLint`: 差し替え削除・文単位除去・neutralAxisText9本・summary cue撤廃・mock全損廃止(A)
2. `containsSiteCue`/`callDeepSeek`: cueをretryトリガ+テレメトリへ、判定はwebsiteText照合(A)
3. `industryRules`/`detectIndustryFromText`/`signalRules`/`analyzeSiteFacts`/`inferIndustry`/`deepSeekRequestBody`: strong/weak+score、除外語、施工事例分割、confident時のみdetectedIndustry(B)
4. `fallbackProposalSet`/`proposalAssetLabel`/`mockAnalysis`: assetホワイトリスト、healthcare書き直し、generic資産限定(C)
5. `fetchWebsiteText`/`handleAnalyze`/`deepSeekRequestBody`: meta/JSON-LD・サブページ梯子・thin分岐(D)
6. `riskTarget`+呼び出し2箇所: 読点切り捨て廃止・42字境界・8字未満はprimarySpecificTerm(E)
7. `deepSeekRequestBody` system+few-shot: 本命指名・固有名詞title昇格(F)

## 受入基準
1. 再eval: SmartHR/freee/セイノー/スノーピークの3案にwebsiteText非存在の業種語(初診/来院/施工事例/症例/受注在庫等)0件・summaryと同一事業文脈。
2. lint通過proposalは一字も変わらない。3. 1文に違反語→違反文のみ消え他文残る・全違反で初めてneutralAxisText・丸ごと置換パス不在。
4. industry: SmartHR→非healthcare、スノーピーク→非healthcare、セイノー→非retail、桧家→construction維持。
5. buysell再実行でmode=model(meta成功)またはthin誠実generic・断定業種テンプレ出ない。
6. riskNote: 対象名詞句8字以上・全体80字以内・「アプリ」等1語0件。
7. 良い社(桧家/コメダ/QB/ツクイ/ツルハ)の固有語率が下がらない。8. tsc/build・スキーマ1.0・禁止表現/実名0・phase固定・既存受入維持。

## 社長への要判断
1. Browser Rendering導入→今回見送り推奨。2. thin注記文言→Yes前提で文言承認のみ。3. 新規固定文(neutralAxisText9本+healthcare+thin注記)一括レビュー30分。
