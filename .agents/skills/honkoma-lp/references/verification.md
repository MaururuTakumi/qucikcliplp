# 検証プロトコル（この順で・証跡を残すまで完了と言わない）

## 1. 型（自分の差分のみ）
- ローカルにtypescriptが無ければ `npm i --no-save typescript@5.6.3`（`--no-save`厳守）。
- `npx tsc --noEmit -p tsconfig.app.json` を実行。
- **基準: 自分が触った/作ったファイルのエラーが0**。`blog.ts` / `HomePage` / `screens/*` 等の既存レガシーエラー（unused import・marked型）は**あなたの責任ではない・無視**。
  → 自分のファイル名でgrepして0を確認: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -E '<自分のファイル>'`

## 2. ビルド
- `npm run build`（vite/esbuild）が成功すること。

## 3. プレビュー描画
- `preview_start` → `preview_screenshot` で崩れ・色・レイアウトを確認。
- 色/寸法の厳密確認は `preview_inspect`（スクショに頼らない）。

## 4. ⚠️ スクロール演出は実ブラウザで（最重要の落とし穴）
- **Reveal / RevealGroup / whileInView / スクロール連動 は、プレビューMCPだと `document.hidden=true` で IntersectionObserver・rAF が発火せず「動かない」と誤診断する。** 必ず **claude-in-chrome（実ブラウザ）** で `http://localhost:5173/...` を開き、スクロールしてフェードアップが起きるのを目視/スクショ。
- 静的な見た目だけならプレビューMCPで可。動きが絡んだら実ブラウザ。
- 検証用の生きたカタログは `/_lab`（dev専用ルート）。

## 5. Proof
- before/after または動作後のスクショを残す。inverseセクションは反転が効いているか、ArrowCTAはhover/focusが効くか（実ブラウザ）まで見る。
