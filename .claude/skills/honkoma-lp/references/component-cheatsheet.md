# コンポーネント・チートシート

## ArrowCTA — `src/components/ui/ArrowCTA.tsx`
円形矢印ボタン。サイトの標準CTA/リンク。
- props: `label`(必須aria) / `size` sm|md|lg / `variant` outline|fill|ghost / `direction` right|up|external / `hover` sweepSwap|spin / `withText` / 排他で `to|href|onClick`
- 例: `<ArrowCTA to="/recruit" size="lg" variant="fill" withText="採用情報へ" label="採用情報へ" />`
- 外部リンク: `<ArrowCTA href="..." direction="external" hover="spin" label="..." />`
- back-to-top: `direction="up" variant="ghost"`
- ⚠️ inverseセクション内では props不要で自動反転する。手で色を変えない。
- ⚠️ `to`/`href`/`onClick` は同時指定不可（型で排他）。

## Reveal / RevealGroup — `src/components/motion/Reveal.tsx`
inViewでフェードアップ。**新規要素はまずこれで包む。**
- Reveal props: `variant` fadeUp|fade|clip|scaleIn / `delay` / `duration` / `distance` / `viewport{once,amount}` / `as`
- RevealGroup: 子を stagger 表示（1つのobserverで束ねる）。カード群・リスト向け。
- 例: `<RevealGroup stagger={0.1}><Reveal>...</Reveal><Reveal>...</Reveal></RevealGroup>`
- ⚠️ 検証は実ブラウザで（隠れタブ不可・`verification.md`）。
- ⚠️ reduced-motion時は初期非表示にせず常時可視（対応済み・自作時のみ注意）。

## tokens — `src/design/tokens.ts` / `.css`
- `.ts`: `dur{instant,fast,base,reveal,hero}` `ease{out,inOut,soft,spring}` `stagger` `dist` `viewport` `scroll`。**アニメの数値は全部ここから。**
- `.css`: semantic変数 `--color-accent / -bright / -soft`, `--surface-base/-raised/-inverse`, `--text-primary/-secondary/-on-inverse`, `--focus-ring`, `--section-py`, `--fs-*`
- Tailwind: `ds-accent`, `ds-surface`, `ds-ink` 等（`ds` namespace）。フォント: `font-en`(Space Grotesk)。

## 未実装（使うな・計画のみ）
FloatingNav / WedgeTransition / TextReveal / SectionHeading / UnderlineTabs / Marquee / StaggerGrid / ProfileCard / ListRow / ScrollScene(embraceStack) → `docs/component-animation-blueprint.md` §2。
※実装が進むにつれ「実在資産」へ移動する。**このファイルで"実在"に載っていないものを import しない。** 必要になったら「未実装です」と告げてエスカレーション（`escalation.md`）。
