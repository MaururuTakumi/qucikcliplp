# レシピ

各レシピは「読む→組む→検証」の順。組んだら必ず `verification.md` を実行する。

## 新セクション追加
1. `docs/component-animation-blueprint.md` §3 の縦リズム（`--section-py`）に従う。器は `<section>`。
2. 中身は既存コンポーネント合成。見出し→`Reveal` or `SectionHeading`、カード群→`RevealGroup`。
3. 色は semantic変数 / `ds-*`。濃紺にするなら `data-theme="inverse"` を section に付与。
4. コピー/数値は `facts-and-compliance.md` の正データのみ。
5. `verification.md` を実行。Reveal演出は実ブラウザ確認。

## 新ページ追加
1. `src/pages/XxxPage.tsx` を既存ページの構造に倣って作成。
2. `src/index.tsx` の `<Routes>` に `<Route path=... element={<XxxPage/>} />` 追加。
3. Header/Footer のナビは触る前に既存を確認（IA変更は影響大→迷えばエスカレーション）。
4. 上記「新セクション追加」を各ブロックに適用。`verification.md`。

## アニメーション追加
1. まず `variants.ts` の `fadeUp/clipRevealY/staggerContainer` で足りるか確認。
2. 足りれば `Reveal`/`RevealGroup` を使う。**新variantを直書きしない。**
3. どうしても新規モーションが要る → `tokens.ts` の `dur`/`ease` だけ使い最小実装、複雑なら fable にエスカレーション。**直値・`motion.`直import禁止。**
4. 実ブラウザで発火確認。

## inverseテーマ
- 濃紺の面 = 親に `data-theme="inverse"`。
- 中の ArrowCTA / テキスト / semantic色は自動反転。**手で色指定しない。**
- 例: Join Us / ChatDrawer / CTAバンド。

## ArrowCTA再利用
- `component-cheatsheet.md` の props表を見る。主要CTA=fill/lg、副=outline、外部=external+spin。
- `label`(aria)は必須。日本語でOK。
