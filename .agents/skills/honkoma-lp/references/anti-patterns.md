# アンチパターン集（やったら止めて直す）

1. ❌ `tailwind.config.js` の既存 `accent`(orange) を青に書き換える
   → ✅ 新規は `ds` namespace / semantic変数。既存キーは温存。
2. ❌ `import { motion } from 'framer-motion'` → `<motion.div>`
   → ✅ `import { m } from 'framer-motion'` → `<m.div>`（Provider済み）。
3. ❌ `transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}` と直書き
   → ✅ `tokens.ts` の `dur.reveal` / `ease.out` を参照。
4. ❌ 濃紺セクションで文字色を手で `#fff` 指定
   → ✅ 親に `data-theme="inverse"`、色は semantic変数任せ。
5. ❌ Reveal を preview(隠れタブ)で見て「動かない」と判断し作り直す
   → ✅ claude-in-chrome の実ブラウザで発火確認。
6. ❌ 計画中の FloatingNav / embraceStack を「あるもの」として import
   → ✅ 未実装。使わない or fableへ。
7. ❌「導入20社」「継続率98%」等を書く
   → ✅ `facts-and-compliance.md` の正データ・監査禁止事項に従う。
8. ❌ 全リポジトリの tsc エラーを見て「壊した」と誤認し関係ない箇所を触る
   → ✅ 自分の差分のファイルだけ見る。レガシーエラーは無視。
