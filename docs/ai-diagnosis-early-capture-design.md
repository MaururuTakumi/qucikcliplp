# honkoma AI診断 — 早期メール取得・ドメイン確認 設計正典

> 設計: Fable 5（2026-07-07）。実装: Opus / codex（本書はコードなし・設計のみ）。
> 位置づけ: [contact-funnel-v2-design.md](./contact-funnel-v2-design.md)（動線正典）と [ai-diagnosis-ui-redesign.md](./ai-diagnosis-ui-redesign.md)（UI正典・§4.5社長オーバーライド）の**上位改訂**。矛盾時は本書が優先。特に ui-redesign §4.5 の「emailGate = Q1直後」は本書で「**emailGate = 解析完了直後（3案の前）**」に改める。
> 解くべき社長課題: ①リードが匿名のままでアプローチ手段がない ②任意の会社URLを入れられると診断がその会社の話になりリード価値ゼロ ③「メールは冒頭で取ったほうがいいのか」「アプローチ手段のある情報が一つでも欲しい」。

## 0. 結論サマリー（1分で読む版）

1. **メールは「URL入力の前」ではなく「解析完了の直後・3案を見せる前」に必須で取る。** URL投入という先行コミットと「解析が終わっている」実物の証拠を担保にできる、冷間流入で最も歩留まりの高い早期取得点。
2. **「認証」という語は使わない。「確認」で建て付ける。** 実態＝①メールドメインと診断対象ドメインの照合（決定論・即時）＋②入力アドレスへの実メール送信（届く＝実在の傍証）。この2つは本当にやるので「会社アドレスで関係を確認しています」は一言も嘘がない。「認証」と言い切るには確認コード（OTP）実装が必要で、冷間CVRを殺すため不採用。
3. **ドメイン不一致・freemailでも診断はブロックしない。** 代わりに関係チップ1タップ（役員社員／支援先／情報収集）で自己申告させ、リードに品質フラグを付けてSlack通知の温度を変える。乱入URL問題は「見せない」ではなく「誰が見たか分かる」で解く。
4. **最低1接点＝メール必須ゲート（スキップなし）を推奨。** ゲート通過率をガードレール指標にし、35%を下回ったら1フラグでソフトゲート（スキップ可＋プラン生成前ハード要求）へ退却できる構造にする。
5. 状態機械は**既存 `emailGate` phase の位置替えだけ**で載る。新phase不要。追加フィールドは3つ（`emailDomainMatch` / `relationship` / `gateStep`）。

## 1. メール取得タイミング再設計

### 1.1 4案の比較と決定

| 案 | 位置 | 強み | 致命傷 |
|---|---|---|---|
| a. URL入力と同時（冒頭） | idle画面に2欄 | 取得率100% | 価値ゼロ地点でのPII要求。冷間流入では「入力フォームだ」と認知された瞬間に直帰。URL入力率そのものが落ち母数が死ぬ |
| b. **解析完了直後・3案の前**（推奨） | analyzing→emailGate→insightsShown | URL投入済み＋「サイトを本当に読んだ」証拠を先出し＋「会社の方向けの内容なので確認します」が成立する唯一の位置 | 3案を見る前の離脱は発生（→§4ガードレール） |
| c. 現行（Q1回答直後） | insightsShown→emailGate | 3案を見せた後で心理障壁が低い | **3案だけ見て去る匿名離脱を構造的に許す**＝社長課題そのもの |
| d. 予約クリック直後のみ | bookingStarted | 摩擦ゼロ | 取得率が最も低い（§4.5で社長却下済み） |

**推奨: b。** (1)URL入力のサンクコスト・完了した解析という成果物・あと1入力で開く損失回避が全部この一点に揃う（HubSpot Website Grader等のメール先出しと同じ業界慣行）。(2)「ここから先は御社の関係者向けの内容なので、会社アドレスで確認します」という配慮ゲートが成立するのはこの位置だけ。(3)乱入URL対策とワンパスで解ける。

### 1.2 CVRを殺さない見せ方

ゲート画面は「要求」ではなく「**完成報告＋開封手続き**」として見せる。順序が命:
1. **価値の証拠を先に**: T1「{companyName}の診断が、まとまりました。」→解析サマリー実文＋読み取りシグナル1行。
2. **完成済みを伝える**: 「3つの活用仮説と進め方プランまで用意できます。」——軸ラベルまで見せ、タイトル・本文は見せない。
3. **理由を言う**（§2コピー）。
4. **担保を並べる**: 無料／診断結果以外は送らない／プライバシー同意チェック／残り約60秒。
5. **入力は1欄＋1チェック＋1ボタン。** placeholder は `name@{診断対象ドメイン}` を動的生成。

**待ち時間の並走入力**: analyzing のチェックリスト下に同じメール欄を先出しし、解析中（5〜10秒）に入力・送信できるように。完了時点で送信済みならゲート画面を経由せず insightsShown へ直行。

**freemailの扱い**: ゲートでは拒否しない。日本の小規模企業は経営者本人がgmail運用が多く、freemail拒否は最良のリードを弾く。フラグ＋関係チップで処理。

### 1.3 before → after

**before（現行）**: idle→analyzing→insightsShown(3案+Q1)→[Q1回答]→emailGate（skip可）→deepening…／問題: 3案は匿名で全開・skipで最後まで匿名。

**after（本書）**: idle→analyzing（並走入力）→emailGate（必須・3案の前）→[不一致/freemail時のみ関係チップ]→insightsShown(3案+Q1)→deepening…／効果: 3案以降を見た人は100%メール特定・以降の全partialにemail同梱。

### 1.4 付随して直すコピー（虚偽の芽・必修）

- /ai Hero sub「無料・登録不要・約60秒」→「無料・約60秒。結果は会社のメール宛にもお届けします。」（必須ゲート化で「登録不要」は虚偽）
- idle本文「登録不要・約60秒で〜」→「約60秒で〜」
- /ai FAQに1問追加:「なぜメールアドレスが必要ですか — 診断は対象企業の方向けの内容のため、会社のアドレスで関係を確認しています。結果送付とお問い合わせ対応以外には使いません。」
- PrivacyPageにメールの取得タイミング・利用目的・90日保持を追記。

## 2. 会社ドメイン確認フレーミング — コピー＋誠実な仕組み

### 2.1 「認証」と言ってよい条件

| 実装 | 実態 | 使える語 |
|---|---|---|
| A. ドメイン文字列照合のみ | 比較するだけ・所有は未証明 | 「確認」「照合」。「認証」不可（虚偽） |
| B. A＋実メール送信 | 照合＋入力アドレスに受付メール実送信（届く＝実在の傍証） | 「確認」。「認証」はまだ言えない |
| C. 確認コード（OTP） | コードで支配を証明 | 「認証」と言ってよい唯一の形 |

**推奨: B。語は「確認」で統一。** 社長案の狙い（営業ゲート感を消す＋乱入検知）はBで完全達成。Cは(1)モバイルで会社メール見られない層が即死(2)メール遅延で同期フロー崩壊(3)離脱2〜4割上乗せ——でPhase0不採用。「認証を行いますので」の語感自体が摩擦なので「確認」への言い換えはCVRもプラス。

### 2.2 ゲート画面の確定コピー（emailGate）

kicker(T3): `Confirm` ／ レール40%（「あと3問」）

> **{companyName}の診断が、まとまりました。**
>
> {analyzedSummary（実データ）}
> <small>読み取り: {signal1} ／ {signal2} ／ {signal3}</small>
>
> 3つの活用仮説（売上・コスト・現場実装）と、課題に絞った進め方プランまで用意できます。
>
> ここから先は、**{companyName}の関係者の方に向けた内容**です。会社のメールアドレスをご入力ください。診断対象のドメインとの一致を確認のうえ、結果はこのアドレスにもお送りします。
>
> ［input type=email / placeholder: `name@{診断対象ドメイン}`］
> ☐ [プライバシーポリシー](/privacy) に同意します
> ［submit: **確認して、診断を見る**］
>
> <small>無料です。診断結果のほかに営業のご案内をお送りすることはありません。会社のアドレスがない場合は、ふだんお使いのアドレスでも進めます（お立場を一つだけ伺います）。</small>

一言も嘘がないことの検証: 「関係者向けの内容」＝会社の内情に踏み込むプランを実際生成（真）。「一致を確認のうえ」＝照合を実際に行う（真・不一致でも進めるが確認自体は常に真）。「このアドレスにもお送りします」＝受付メールを即時実送信（真）。「営業のご案内を送らない」＝v2運用コミット。「必ず」「保証」「認証」不使用。

### 2.3 「確認」の実態（3層・全部本当にやる）

1. **ドメイン照合（即時・決定論）**: registrable domain（eTLD+1相当）で比較→`match/freemail/mismatch`。**クライアント即時算出（チップ用）＋Worker再計算（正値）**。jp規則: `co.jp/ne.jp/or.jp/ac.jp/go.jp/ed.jp/lg.jp/gr.jp`は末尾3ラベル、他は2ラベル。`www.`除去・サブドメインは一致扱い。
2. **受付メールの実送信（即時）**: ゲート送信と同時に3案＋診断コード＋予約リンクを実送信。届く＝実在の傍証＋約束の即時履行。途中離脱しても**社長の手元にメール＋3案＋診断コードが残る**＝最低保証。
3. **不一致時の自己申告（関係チップ）**: 機械的に分かる事実を尋問でなく1タップの自己申告に。

### 2.4 before → after

**before（社長案）**: 「会社ドメインでの認証を行いますので、メールアドレスの入力をお願いします」— 「認証」が実態超過／手続き感が摩擦／freemail許容と矛盾。

**after**: 「ここから先は{companyName}の関係者の方に向けた内容です。会社のメールアドレスをご入力ください。診断対象のドメインとの一致を確認のうえ、結果はこのアドレスにもお送りします。」— 実際にやること（照合・送付）だけを言う。

## 3. 乱入URL対策 — ドメイン一致の使い方・不一致分岐

### 3.1 方針

**乱入は「防ぐ」のではなく「識別する」。** 診断は誰にでも見せる（公開情報ベースの仮説で漏洩リスクゼロ。ブロックはコンサル・支援会社・グループ会社・複数ドメイン運用の正当な例外を敵に回す）。ドメイン照合＋関係チップで全リードに品質フラグを付け、フォロー優先度と通知温度を変える。

### 3.2 3値フラグと解釈

| `emailDomainMatch` | 判定 | 扱い |
|---|---|---|
| `match` | メール＝診断URLドメイン | 本人性最高・チップなし・Slack ✅ |
| `freemail` | gmail/yahoo/icloud等 | 中立（経営者本人の可能性）・チップ補完・Slack 🟡 |
| `mismatch` | 別法人ドメイン | 情報量最大（紹介/グループ/偵察）・チップ弁別・Slack 🟠 |

`mismatch`は**負のシグナルではない**: 「A社アドレスでB社を診断」はA社連絡先＋B社への関心の2情報を持つ高価値リード。偵察でも会社メールを差し出させた時点でコストを課せている。

### 3.3 関係チップ（freemail/mismatch時のみ・ゲート送信直後・同画面1タップ）

> **ありがとうございます。ひとつだけ教えてください。**
> （mismatch）{companyName}（{urlDomain}）とご入力のドメインが異なるようです。お立場に近いものは？
> （freemail）ご入力は個人のアドレスのようです。お立場に近いものは？
>
> チップ: `{companyName}の経営者・役員・社員です` ／ `支援先・取引先として調べています` ／ `導入検討・情報収集です`
> <text-button>答えずに進む</text-button>

エコーバック（固定）: 「承知しました。このまま診断を続けます。」／どれを選んでも・スキップしても3案へ／`relationship`を lead に記録（member/supporter/research/unknown）。

### 3.4 Slack通知への反映

| フラグ組合せ | 通知 | アクション |
|---|---|---|
| match | ✅ 本人リード | 通常フォロー（最優先） |
| freemail × member | 🟡 個人アドレス・本人申告 | 通常フォロー |
| mismatch × supporter | 🤝 支援者リード | 紹介・提携文脈でアプローチ |
| mismatch × research/unknown | 🟠 要観察 | 低優先（メールは手元にある） |

### 3.5 補助的な悪用対策（方針）

- typo/捨てアドレス: Phase1で(a)タイポ提案(gmial→gmail)(b)受付メールのバウンス検知→`Email Bounced`(c)使い捨てドメイン小辞書。Phase0では受付メール実送信が検知線。
- bot/連打: 既存レート制限維持・必要ならTurnstile（Phase2）。

### 3.6 before → after

**before**: 競合社員が興味本位で `client.co.jp` 入力→プランまで匿名で全部見て閉じる・Notionに匿名partialだけ。
**after**: 3案の前に会社メール要求→(a)自社メールで`mismatch`＋チップで正体判明 (b)入れなければ3案見られず`analyzed`止まり＝乱入コスト無限大。コンサルは`supporter`リードとして紹介商流に。

## 4. 最低1接点の担保とCVRトレードオフ

### 4.1 両にらみ2案

**A案（推奨）ハードゲート**: emailGateにスキップなし。メール＋同意なしで3案以降を一切見せない。
**B案（退却先）ソフトゲート**: 小さな「あとで」を残し、スキップ者は focusBuilding 直前（プラン生成前）で再ハード要求。3案まで匿名可・プラン以降100%特定。

| | A ハード | B ソフト |
|---|---|---|
| 特定リード率（3案閲覧者中） | 100% | スキップ率次第（推定40〜60%匿名） |
| 診断閲覧数 | 減る | 維持 |
| 匿名リード根絶 | 完全 | 部分（プラン到達者のみ） |
| 乱入抑止 | 強 | 弱 |
| 実装 | phase位置替えのみ | ＋再ゲート分岐 |

**推奨A。** (1)社長要求「最低1つを確実に」は確率的担保のBでは満たせない。(2)商品は3案でなく「深掘るほど具体化する体験＋人間バトン」で3案どまり匿名層は元々CVしない。(3)誠実ゲートなら通過者の質は上がる（コミットメント効果でQ1回答率・バトン到達率はむしろ上がる）。

### 4.2 CVR試算（仮定・実測で置換）

冷間100 URL投入あたり:

| | 現行(Q1後skip可) | A案(解析後ハード) |
|---|---|---|
| 解析完了 | 90 | 90 |
| 3案閲覧 | 90（匿名） | 40〜55（通過者のみ） |
| メール取得 | 20〜30 | **40〜55（3案閲覧者全員）** |
| アプローチ可能 | 20〜30 | 40〜55＋全員に品質フラグ |

**メール絶対数はA案が上回る見込み**が本設計の賭け。

### 4.3 ガードレールと退路（1フラグ）

- KPI: `ゲート通過率 = ai_email_gate_submitted ÷ 解析完了`。
- 閾値: 公開後2週間 or 解析100件の早い方。**通過率<35%ならB案へ**（`EMAIL_GATE_OPTIONAL=true` にするだけ・スキップ導線と再ゲートは最初から実装しフラグで隠す）。
- 併読: `ゲート到達前離脱`（analyzing中の閉じ）増加監視・utm別。

### 4.4 「最低限これは取る」の線引き

1. メール＋プライバシー同意（必須・唯一のPII）
2. `emailDomainMatch`（自動・摩擦ゼロ）
3. `relationship`（不一致時のみ1タップ・スキップ可）
4. 診断コード・companyUrl・utm（自動）
これ以外（氏名・電話・会社名・役職）は取らない。氏名すら要求しないことが「営業ゲートではない」の最終担保。メール1本あればドメイン＋公開情報で会社は特定できる。

## 5. 状態機械への載せ方（大改造なし）

### 5.1 phase遷移 before→after

```
before: idle→analyzing→insightsShown(3案+Q1)→emailGate→deepening→focusBuilding→focusShown
after:  idle→analyzing→emailGate→insightsShown(3案+Q1)→deepening→focusBuilding→focusShown
              └ analysisFailed も emailGate に合流（注記差分のみ）
```
phase enumは無変更（`emailGate`の再配置）。

### 5.2 ChatProvider 差分

- `analysisSuccess/analysisFail`: 遷移先を insightsShown/analysisFailed 表示前に **emailGate へ**。ただし `emailCaptured===true` なら emailGate スキップで直接 insightsShown。
- `submitEmailGate` 成功→ **insightsShown**（不一致/freemail時は同phase内 `gateStep=1` で関係チップ後）。
- `answerPain`: 遷移先を emailGate→**deepening** に戻す。
- 新フィールド: `emailDomainMatch` / `relationship` / `gateStep`（persist追加）。
- 新アクション: `answerRelationship(value)`。
- `skipEmailGate`: 削除せず `EMAIL_GATE_OPTIONAL`（既定false）背後に温存＝B案退路。optional時はスキップ→insightsShown、`buildFocus()`冒頭で `!emailCaptured` ならプラン生成前ハードゲート。
- `resetChat`（別URLで診断）: email/consent/emailCaptured を引き継ぐ。emailDomainMatch は新URLで再計算。

### 5.3 Worker 差分

- **capture_lead**: `emailDomainMatch` をサーバ側再計算（jp SLD規則・クライアント値は参考）。whitelistに`relationship`追加。Notionに `Email Domain Match`(select)/`Relationship`(select)。Slackに§3.4絵文字Tier。
- **メール2通構成**（現実装の矛盾解消——現行はemailGate時点でfocusPlan不在なのに即送し「プランを送る」約束と齟齬）:
  1. **受付メール**（ゲート送信時・即時）: 件名「【honkoma】{companyName}のAI活用診断 — 3つの仮説（診断コード {HK-XXXX}）」。本文＝3案＋「進め方プランまで進むと完成版レポートをお送りします」＋予約リンク＋診断コード。
  2. **レポートメール**（focusShown到達時）: フロントが focusReady 後 capture_lead 再送（focusPlan同梱）→既存 diagnosisEmail（プラン＋事例）。
  - **冪等性必須**: `(sessionId, mailType)` 単位で送信済み判定。二重送信防止。
- **partial_lead**: 変更不要（ゲート通過後は既存 buildPartialLead が email 自動同梱→全partialが特定済み＝A案の隠れた最大効果）。

### 5.4 UI（ui-redesign差分）

- emailGate は§6レイアウトのまま位置とコピーを§2.2に差し替え。レール40%「あと3問」。
- レール: analyzing 8→30% → emailGate 40% → insightsShown(Q1) 50% → Q2 62%/Q3 74% → focusBuilding 80→95% → focusShown 100%。
- focusShown副導線「先にメールで受け取る」→撤去、バトンに「この内容はレポートとして {email} にお送りします。」
- bookingStarted のインラインメール→撤去（取得済み）。「診断レポートは {email} にお届けします。」
- completed 最終ask→A案では撤去（B案フラグ時のみ）。
- ui-redesign §4.5冒頭に「本節は early-capture が上書き」注記。

### 5.5 計測（gtag/ai_chat）

| イベント | 発火 | label |
|---|---|---|
| `ai_email_gate_view` | emailGate表示 | source |
| `ai_email_gate_submitted` | 送信成功 | match/freemail/mismatch |
| `ai_email_gate_abandon` | ゲートで閉じ | source |
| `ai_relationship_answered` | 関係チップ | member/supporter/research/skipped |
| `ai_email_captured`（既存） | 維持 | emailGate(主)/booking/completed(B案) |

KPI: 主=特定リード数（取得絶対数）・ゲート通過率（§4.3）。従=通過後Q1回答率。

## opus/codex 実装ハンドオフ

**触るファイル**
- `ChatProvider.tsx`: §5.2遷移・新フィールド・answerRelationship・EMAIL_GATE_OPTIONAL・resetChatのemail引き継ぎ・クライアント側ドメイン照合util・focusReady後のcapture_lead再送
- `types.ts`: emailDomainMatch/relationship型追加
- `ChatStage.tsx`: emailGate位置・コピー差し替え（§2.2逐語）・関係チップ・analyzing並走入力・focusShown/bookingStarted/completed撤去差分・レール%・「登録不要」除去
- `AiDiagnosisPage.tsx`: Hero sub・FAQ1問
- `PrivacyPage.tsx`: 取得情報節追記
- `workers/ai-chat/src/index.ts`: サーバ側ドメイン照合(jp SLD)・freemail辞書・whitelist・Notionプロパティ・Slack Tier・メール2通構成＋冪等性

**受入基準**
1. 解析完了→emailGate→（メール＋同意）→3案。メール未送信で3案・プラン・事例がDOM上も一切露出しない。
2. `EMAIL_GATE_OPTIONAL=true` でskip導線が現れ、スキップ者は focusBuilding 前でハード要求（B案が1フラグで動く）。
3. `taro@example.co.jp`×`www.example.co.jp`→match（チップなし）。`taro@gmail.com`→freemailチップ。`taro@other-inc.jp`×`example.co.jp`→mismatchチップ。`corp.example.co.jp`サブドメインは match。判定はWorker値がNotionに記録（クライアント改ざん無効）。
4. チップのどの選択・スキップでも3案へ（関所化しない）。
5. ゲート送信で受付メール（3案＋診断コード）が届き、focusShown到達でレポートメール（プラン＋事例）が届く。高速完走でも各1通（冪等）。未同意はemailがリクエストに載らない。
6. ゲート通過後の全partial_leadにemail同梱・Slackにドメインフラグ絵文字。
7. 再開・別URL診断でゲート再表示されない（emailCaptured引き継ぎ）。
8. サイト全体から「登録不要」消滅。全文言に「認証」「必ず」「保証」なし。§5.5イベント発火。tsc/build通過。

## 社長への要判断

| # | 論点 | 推奨 |
|---|---|---|
| 1 | ハードゲート（スキップなし）の裁可。診断閲覧数は減るが3案以降は100%特定 | Yes（通過率<35%でB案退却を条件に） |
| 2 | 「認証」と書かない（「確認」統一）。認証にはOTP必要でCVR大幅減 | 「確認」で承認。OTPは将来の不一致リード限定オプション |
| 3 | freemailを拒否しない（フラグ＋チップ処理） | Yes |
| 4 | 不一致URLでも診断は見せる（ブロックせず識別） | Yes |
| 5 | メール2通構成（受付即時＋レポート完走時） | Yes（気になればPhase1で受付を遅延/省略） |
| 6 | 「登録不要」表記の撤回 | 必修（必須ゲートと両立で虚偽） |
| 7 | Slack不一致リードのフォロー方針 | 🤝支援者は当たる・🟠は静観を初期運用 |
