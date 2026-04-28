# LP管理エージェント向け マージ依頼プロンプト

以下をLP管理エージェントにそのまま渡してください。

```text
qucikcliplp のホテル向けLP追加ブランチをレビューし、問題なければ自然にマージしてください。

Repository:
https://github.com/MaururuTakumi/qucikcliplp

Branch:
feature/hotel-ota-lp

Branch URL:
https://github.com/MaururuTakumi/qucikcliplp/tree/feature/hotel-ota-lp

PR作成URL:
https://github.com/MaururuTakumi/qucikcliplp/pull/new/feature/hotel-ota-lp

目的:
honkoma既存LPに、ホテル向けRevenue IntelligenceのLPを追加する。
Route alias は /hotel, /hotels, /hasip。

主な変更:
- src/pages/HotelPage.tsx を新規追加
- /hotel, /hotels, /hasip を HotelPage にルーティング
- Header / Footer にホテル向け導線を追加
- ContactPage にホテル向け問い合わせ選択肢と専用placeholderを追加
- public/assets/hotel/ に匿名化されたRevenue Intelligenceサンプル画像とロゴ素材を追加
- public/sitemap.xml に /hotel を追加
- vercel.json にSPA rewriteを追加
- docs/ に広告・ABM・アウトリーチ関連の実行資料を追加

レビュー観点:
1. 既存LPのブランドトーン、ヘッダー、フッター、余白、フォントと自然につながっているか。
2. /hotel, /hotels, /hasip が本番デプロイで直接アクセス可能か。
3. VercelのSPA rewriteが既存挙動を壊さないか。
4. ContactPageの既存問い合わせ導線を壊していないか。
5. 公開LP内にプロジェクト上のNG語、内部語、取得方法を前面に出す語が出ていないか。
   検査対象は `src`, `public`, `vercel.json` を中心にしてください。
   `docs` 配下は営業実行資料のため、ターゲット企業名やレビュー用の確認語が含まれる場合があります。

NG観点:
   - 確実
   - 保証
   - 絶対
   - sold at
   - Evidence
   - snapshot
   - Hermes
   - proof.md
   - data_sample
   - 公開OTA
   - 定点観測
   - PMS接続なし
6. 実在ホテル名が公開LPや公開アセットに残っていないか。
   特に、リッチモンドホテル / ブラッサム / 都ホテル / オリエンタルホテル。
7. public配下にPPT/PDF/CSV/XLSXなどの営業資料や内部資料が公開されていないか。
8. 390px / 768px / 1024px / 1440px程度で横はみ出しや文字崩れがないか。

推奨検証コマンド:
npm install
npm run build
rg -n "確実|保証|絶対|sold at|Evidence|snapshot|Hermes|proof\\.md|data_sample|公開OTA|定点観測|PMS接続なし|リッチモンドホテル|ブラッサム|都ホテル|オリエンタルホテル" src public vercel.json
find public -type f \\( -iname "*.ppt" -o -iname "*.pptx" -o -iname "*.pdf" -o -iname "*.xlsx" -o -iname "*.csv" \\) -print

期待する判断:
- ブロッカーがなければPR化してmasterへ通常マージ。
- もし既存本番URLやVercel設定との競合があれば、マージ前に修正。
- 軽微な文言やデザイン差分は、マージを止めずにfollow-up issue化。

補足:
このLPは「データ取得方法」ではなく「ホテルのRevenue Intelligence / 需要変化通知 / 競合料金変化 / 対応ワークフロー」を前面に出す方針です。
公開資料として過剰な成果断定を避け、PMSやサイトコントローラー連携はFAQ内で段階対応として扱っています。
```
