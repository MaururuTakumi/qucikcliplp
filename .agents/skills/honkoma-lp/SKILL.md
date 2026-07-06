---
name: honkoma-lp
description: Use when editing, extending, or adding to the honkoma corporate LP in this repo (qucikcliplp) — new sections/pages, reusing design-system components (ArrowCTA, Reveal, tokens, inverse theme), animations, or the AI contact funnel. Triggers on "honkomaのLP", "セクション追加", "ページ追加", "ArrowCTA", "Reveal", "デザインシステム", "inverseテーマ", or editing src/pages or src/components in this project. Enforces the design-system rules, the company fact table, and the compliance/anti-exaggeration constraints so the LP is never broken or made non-compliant.
---

# honkoma LP 編集ハーネス

このプロジェクトは **株式会社honkoma のコーポレートLP**（React 18 + TS + Vite + Tailwind + Framer Motion）。「会社の顔 ＋ 採用」の2軸で刷新中。**LayerX級のモーションとホバー質感を、再利用可能なコンポーネント資産として作り込む**のが核。

## まず思考様式を合わせる（デザインシステム先行）
- **既存の資産を組み合わせて作る。ゼロから書かない。** 新しい色・アニメ・ボタンを発明する前に、必ず既存トークン/コンポーネントで足りないか確認する。
- **真実は docs/ にある。記憶や推測で会社情報・数値を書かない。**
  - デザイン/コンポーネント正典 → `docs/component-animation-blueprint.md`
  - 会社の正データ/監査/LayerX参照 → `docs/lp-redesign-brief.md`
  - 問い合わせ動線/AIチャット → `docs/contact-ai-funnel-design.md`
- **迷ったら参照ファイル（このスキルの `references/`）を読む。** SKILL本体は地図。

## 🚫 黄金律（非交渉・破ったら止まる）
1. **既存トークンを上書きしない。** `tailwind.config.js` の `cream/ink/accent(orange)` 等の既存キーは温存。新規は必ず `ds` namespace か semantic CSS変数で。
2. **`motion.` を直importしない。** framer-motion は必ず `m.` + LazyMotion 経由（`import { m } from 'framer-motion'`）。理由: MotionProvider が strict。
3. **duration/easing を直値で書かない。** 必ず `src/design/tokens.ts`（dur/ease/stagger 等）を参照。
4. **色を直値で書かない。** semantic CSS変数（`var(--color-accent)` 等）か Tailwind `ds-*` のみ。
5. **暗い/濃紺の面は `data-theme="inverse"` を付ける。** 子（ArrowCTA等）が props無しで自動反転する。手で色を反転させない。
6. **prefers-reduced-motion と a11y を必ず満たす**（既存プリミティブは対応済み。自作する時だけ注意）。
7. **誇大表現・断定的数値保証を書かない**（景表法）。数値は正データ表 or レンジ表現のみ。
8. **触ったファイルの tsc エラーは 0。**（リポジトリ全体には既存レガシーエラーが残る。基準は「自分の差分にエラーを足さない」→ 検証プロトコル参照）
9. **whileInView(Reveal系)の目視確認は実ブラウザ(Codex-in-chrome)で行う。** プレビューMCPは隠れタブで IntersectionObserver が発火せず「動いてない」と誤判定する。

## 実在する再利用資産（クイックリファレンス）
| 資産 | パス | 使い所 |
|---|---|---|
| デザイントークン | `src/design/tokens.css` / `.ts` | 色・余白・radius / 時間・easing・stagger |
| MotionProvider | `src/motion/MotionProvider.tsx` | root済み。`m.`が使える前提を供給 |
| variants | `src/motion/variants.ts` | `fadeUp` `clipRevealY` `staggerContainer` `useReducedMotionSafe` |
| Reveal / RevealGroup | `src/components/motion/Reveal.tsx` | 「inViewでフェードアップ」。まず全部これで包む |
| ArrowCTA | `src/components/ui/ArrowCTA.tsx` | 円形矢印ボタン。CTA/カード/リンクの標準 |

詳細な props・落とし穴は **`references/component-cheatsheet.md`** を読む。未実装で計画中のもの（FloatingNav / WedgeTransition / embraceStack 3D 等）は `docs/component-animation-blueprint.md` §2 を参照。**未実装資産を「あるもの」として使わない**。

## やること別レシピ（手順は `references/recipes.md`）
- 新セクションを追加 → recipes.md「新セクション追加」
- 新ページを追加 → recipes.md「新ページ追加」
- アニメーションを足す → recipes.md「アニメーション追加」
- inverse(濃紺)セクション → recipes.md「inverseテーマ」
- ArrowCTA を置く → recipes.md「ArrowCTA再利用」

## 完了前に必ず（検証プロトコル）
**`references/verification.md` の手順を上から実行し、証跡（スクショ）を残すまで完了と言わない。** 要点だけ:
1. 自分の触ったファイルの tsc エラー 0 を確認（レガシーエラーは無視）
2. `npm run build` が通る
3. preview で描画・崩れなし
4. **Reveal等のスクロール演出は Codex-in-chrome の実ブラウザで発火確認**
5. スクショで proof

## 内容の真実 & コンプラ
会社情報・数値は **`references/facts-and-compliance.md` の正データ表を唯一のソースに**。監査issue(#5-14)の誇大・不整合を**再発させない**。詳細は同ファイル。

## 自走してよい範囲 / fableに回す範囲
- **自走OK**: 既存コンポーネントの合成・セクション追加・ページ追加・コピー流し込み（正データ準拠）・inverse適用・ArrowCTA/Reveal配置・監査対応。
- **fableへエスカレーション**: 仕様に落ちない"手触り"の作り込み（embraceStack 3D #19、新しいモーション・プリミティブの発明、デザイン言語レベルの判断）→ 出し方は `references/escalation.md`。

## アンチパターン（全リストは `references/anti-patterns.md`）
既存トークン上書き / `motion.`直import / duration直値 / inverse無視で手動反転 / Reveal検証を隠れタブでやる / 未実装資産を使う / 誇大表現 — をやらない。
