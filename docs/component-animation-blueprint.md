# honkoma LP刷新 — 再利用可能コンポーネント＆アニメーション体系 設計図 v1

> 設計: Fable 5（頭脳担当）。issue化・実装管理: Opus。
> スコープ: デザイントークン / モーション・プリミティブ / 汎用UIコンポーネント。**内容・コピー・ページ組み立ては範囲外（後工程の労働）**。
> 全コンポーネント共通の前提: TypeScript strict、props駆動・ページ非依存、`prefers-reduced-motion` 対応必須、モバイル挙動を仕様に含む。
> 関連: [lp-redesign-brief.md](./lp-redesign-brief.md)（LayerX分解§3・アニメ目録§7・技術方針§9）

前提の把握: Framer Motion v11 導入済み・r3f 未導入（React 18 なので **r3f v8系**を指定）、現行 Tailwind テーマはオレンジ系ハードコードで未トークン化、Header は sticky の素朴実装（モーフなし）。

---

## 1. Foundation / デザイントークン

### 1.1 ファイル構成（新設）

```
src/design/tokens.css        ← CSS変数（カラー/スペーシング/radius）: Tailwindと非React資産の単一ソース
src/design/tokens.ts         ← モーショントークン（Framer Motionが直接importするJS値）
src/motion/variants.ts       ← 共有variantsファクトリ（fadeUp, clipReveal, staggerContainer…）
src/motion/MotionProvider.tsx ← MotionConfig + reduced-motionポリシーの一元化
```

**原則: 「CSSに置くもの＝色・寸法」「TSに置くもの＝時間・イージング」。** Framer Motion はJS値しか受けないので、モーションだけCSS変数化しても資産にならない。逆に色はCSS変数にしておけば LayerX藍→honkoma青→将来の再ブランディングを1ファイル差し替えで吸収できる。

### 1.2 カラートークン（2層構造）

**Layer 1: プリミティブ（raw値）** — honkomaロゴ由来で初期値を置くが、名前に色名を含めない。

```css
:root {
  --brand-600: #0462CB;   /* ロゴ濃青 */
  --brand-400: #2F9BFF;   /* ロゴ明青 */
  --brand-100: #DCEEFF;   /* 派生: 淡色ウェッジ・ピル背景用 */
  --navy-900:  #0A1B2E;   /* 派生: inverseセクション(Join Us相当)。LayerXの#1E2530ポジション */
  --gray-050:  #F4F6F8;   /* ページ背景。LayerXの#F4F4F6ポジション */
  --ink-900:   #0E1116;
}
```

**Layer 2: セマンティック（コンポーネントはこちらのみ参照）**

```css
:root {
  --color-accent:        var(--brand-600);
  --color-accent-bright: var(--brand-400);
  --color-accent-soft:   var(--brand-100);
  --surface-base:        var(--gray-050);
  --surface-raised:      #FFFFFF;
  --surface-inverse:     var(--navy-900);
  --text-primary:        var(--ink-900);
  --text-secondary:      color-mix(in srgb, var(--ink-900) 62%, transparent);
  --text-on-inverse:     #F2F5F9;
  --focus-ring:          var(--brand-400);
}
[data-theme="inverse"] { /* 濃紺セクション内で全セマンティックを反転再定義 */ }
```

- Tailwind側は `colors: { accent: 'var(--color-accent)', surface: {...} }` で参照。**既存の cream/ink/orange系トークンは残置**（旧ページを壊さない）。新コンポーネントは新namespaceのみ使用し、移行はページ刷新時に自然に完了する。
- `data-theme="inverse"` 方式にする理由: Join Us型の濃紺セクションで、子コンポーネント（ArrowCTA, SectionHeading等）が **propsなしで自動的に色反転** する。コンポーネントにthemeプロップを増殖させない。

### 1.3 モーショントークン（`src/design/tokens.ts`）

```ts
export const dur = {
  instant: 0.15,  // フォーカスリング・微小フィードバック
  fast:    0.30,  // hover（塗り・矢印スワップ）
  base:    0.50,  // タブ下線・ピルモーフ
  reveal:  0.80,  // カード/テキストのinViewリビール
  hero:    1.10,  // ヒーロー見出し・ウェッジ遷移
} as const;

export const ease = {
  out:   [0.16, 1, 0.3, 1],    // expo-out。リビール系の既定。LayerXの「スッと減速」の質感
  inOut: [0.83, 0, 0.17, 1],   // ウェッジ遷移・オーバーレイ（加速→減速の横断）
  soft:  [0.33, 1, 0.68, 1],   // hover系（out より控えめ）
  spring: { type: 'spring', stiffness: 300, damping: 32, mass: 0.9 }, // layoutアニメ（下線・ピル）専用
} as const;

export const stagger = { tight: 0.06, base: 0.10, loose: 0.16 } as const;

export const dist = { revealY: 32, revealYLg: 56, hoverLift: -4, textClipY: '110%' } as const;

export const viewport = {
  default: { once: true, amount: 0.25 },   // カード・見出し
  eager:   { once: true, amount: 0.10 },   // 背の高い要素（グリッド全体）
  hero:    { once: true, amount: 0.5 },
} as const;

export const scroll = {
  navMorphY: 0.85,        // ナビモーフ発火: viewport高さ×この係数
  sceneRange: ['start end', 'end start'] as const, // useScrollのoffset既定
} as const;
```

**運用ルール（このプロジェクトの「AIっぽさ回避」の核）:**
- duration/easing の直値をコンポーネントに書くことを禁止。必ずトークン参照。
- 「1セクション1エフェクト」（brief §4）。同一ビューポート内で同時発火するリビールは1グループまで。
- `once: true` が既定（LayerXは再入場で再発火しない。落ち着きの源泉）。

### 1.4 タイポ / スペーシング方針

- **日本語**: Noto Sans JP 継続（Weight 400/500/700）。**英字アクセント**: 幾何学サンセリフを1つ追加（推奨: `Space Grotesk` または `Inter`、self-host）。用途は英字ラベル・ナンバリング（"What We Do" / "01"）限定。フォントは全サイトで**この2つのみ**。
- 見出しスケール: `clamp()` ベースのfluid型を `--fs-hero: clamp(2.5rem, 6vw, 5.5rem)` 等4段（hero/h2/h3/label）でCSS変数化。
- **縦書き**: `writing-mode: vertical-rl; text-orientation: mixed` をユーティリティクラス `.writing-vertical` として定義（Tailwind plugin 1個追加）。英数字は `upright` にしない（LayerX同様、混植は mixed）。
- セクション垂直リズム: `--section-py: clamp(5rem, 12vh, 10rem)`。LayerXの「余白たっぷり・縦リズム広め」をトークンで強制。

### 1.5 Reduced Motion / グローバルポリシー

- ルートで `<MotionConfig reducedMotion="user">`（MotionProvider内）。これでFramer Motionのtransform系アニメは自動無効化される。
- **ただし自動無効化で不十分な3箇所は個別対応を各仕様に明記**: (a) opacity 0 で始まる要素が非表示のまま残らないこと、(b) marquee（CSS keyframesなのでメディアクエリで停止）、(c) r3fシーン（静止フレームにフォールバック）。
- MotionProvider が `useReducedMotionSafe(): boolean` を提供し、全プリミティブがこれを参照。

---

## 2. コンポーネント / アニメーション・プリミティブ目録

依存の浅い順。**P-** はプリミティブ（他の土台）、**C-** は合成コンポーネント。

### P-0. MotionProvider + 共有variants — [fable-craft]

- **パス**: `src/motion/MotionProvider.tsx` / `src/motion/variants.ts`
- **目的**: reduced-motionポリシー・LazyMotion（バンドル削減 `domAnimation`）・共有variantsの単一ソース。全プリミティブの前提。
- **Props API**:
  ```ts
  type MotionProviderProps = { children: ReactNode };
  // variants.ts はファクトリをexport:
  export const fadeUp: (opts?: { distance?: number; duration?: number; delay?: number }) => Variants;
  export const clipRevealY: (opts?: { duration?: number }) => Variants; // overflow-hidden親とセット
  export const staggerContainer: (opts?: { stagger?: number; delayChildren?: number }) => Variants;
  export const useReducedMotionSafe: () => boolean;
  ```
- **アニメーション仕様**: 自身は動かない。`LazyMotion features={domAnimation} strict` + `MotionConfig reducedMotion="user"`。
- **依存**: framer-motion のみ。
- **再利用例**: `Layout.tsx` のルートに1回だけ設置。以後すべてのページ・コンポーネントが暗黙に恩恵を受ける。
- **AC**: ①OSのreduce設定ONで全transform系アニメが消え、かつ全コンテンツが可視 ②`m.` コンポーネント使用で framer-motion のバンドル寄与が計測上 ~30KB gzip 以下 ③variantsの直書きが新規コンポーネントに存在しない（レビュー基準）。

### P-1. Reveal / RevealGroup — スクロールリビール基本形 — [fable-craft]

- **パス**: `src/components/motion/Reveal.tsx`
- **目的**: 「inViewでフェードアップ」を全サイトで統一する最頻出プリミティブ。LayerX目録§7-8の土台。
- **Props API**:
  ```ts
  type RevealProps = {
    children: ReactNode;
    as?: ElementType;                       // default 'div'
    variant?: 'fadeUp' | 'fade' | 'clip' | 'scaleIn'; // default 'fadeUp'
    delay?: number;
    duration?: number;                      // default dur.reveal
    distance?: number;                      // default dist.revealY
    viewport?: { once?: boolean; amount?: number }; // default viewport.default
    className?: string;
  };
  type RevealGroupProps = Omit<RevealProps, 'delay'> & {
    stagger?: number;                       // default stagger.base
    delayChildren?: number;
  }; // 子のRevealはvariant継承・whileInViewを親に委譲（1つのIntersectionObserverで済む）
  ```
- **状態/ホバー**: なし（表示アニメ専用）。
- **アニメーション仕様**: トリガー `whileInView`。`fadeUp` = opacity 0→1 + y 32→0、`dur.reveal`、`ease.out`。`clip` = 親 `overflow:hidden` + 子 y 110%→0（テキスト行向け）。reduced-motion時は初期stateを適用しない（常時可視）。
- **依存**: P-0。
- **再利用例**: セクション導入文、CTA、フッター列、下層ページの全ブロック。「とりあえずRevealで包む」が新ページ作成の既定動作になる。
- **AC**: ①ファーストビュー内の要素はマウント直後に発火（スクロール不要）②`once:true`で再入場時に再発火しない ③CLSゼロ（transformのみ、layoutに影響しない）④モバイルで `amount` 到達前にチラ見えしない。

### P-2. TextReveal — ヒーロー見出しリビール（縦書き対応） — [fable-craft]

- **パス**: `src/components/motion/TextReveal.tsx`
- **目的**: LayerX目録§7-1「縦大見出しの出現」。「まだ見ぬ未来を、一緒に」を含む全ページの見出し演出資産。
- **Props API**:
  ```ts
  type TextRevealProps = {
    text: string | string[];               // string[] = 行を明示分割（折返し任せにしない）
    as?: 'h1' | 'h2' | 'h3' | 'p';        // default 'h1'
    mode?: 'lines' | 'chars';              // default 'lines'。charsはヒーロー専用の強演出
    orientation?: 'horizontal' | 'vertical' | 'vertical-md'; // vertical-md = md以上のみ縦書き
    delay?: number;
    staggerChildren?: number;              // default stagger.base (lines) / stagger.tight (chars)
    className?: string;
  };
  ```
- **アニメーション仕様**: 各行（各文字）を `overflow:hidden` のマスクspanで包み、内側を **横書き: y 110%→0 / 縦書き: x 110%→0**（vertical-rlではブロック進行方向が水平のため）。`dur.hero`、`ease.out`、行stagger。トリガーはヒーロー=mount時、それ以外=whileInView。**セマンティクス**: 分割spanは `aria-hidden`、実テキストは `sr-only` で全文を保持（スクリーンリーダー・SEO・コピペを壊さない）。
- **状態/ホバー**: なし。
- **依存**: P-0、`.writing-vertical` ユーティリティ（§1.4）。
- **再利用例**: トップHero（縦書き）、下層ページタイトル（横書きlines）、Join Usのミッション再掲。
- **AC**: ①縦書きモードで Safari/Chrome/Firefox の3ブラウザで行マスクが崩れない ②`vertical-md` はモバイルで横書きにフォールバックし、行分割指定が両方向で破綻しない ③reduced-motionで即時全文表示 ④コピペで正しい全文が取れる。

### P-3. WedgeTransition — 斜めウェッジ（LayerXの署名） — [fable-craft]

- **パス**: `src/components/motion/Wedge.tsx`（2 export）
- **目的**: LayerX目録§7-3。サイトの「署名的モーション」。2形態を1モジュールで提供。`WedgeDivider`（セクション境界の静的/inView斜め分割）と `WedgeOverlay`（ルート遷移時に画面を斜めバーが横断）。
- **Props API**:
  ```ts
  type WedgeDividerProps = {
    angle?: number;                 // deg, default 6（モバイルは自動で×0.6）
    colors?: [string, string?];     // CSS var参照。default ['var(--color-accent)', 'var(--color-accent-soft)']
    direction?: 'ltr' | 'rtl';
    height?: string;                // default 'clamp(64px, 10vw, 140px)'
    animateInView?: boolean;        // true: バーが順にスライドイン (stagger.base)
  };
  type WedgeOverlayProps = {
    children: ReactNode;            // <Routes> を包む。AnimatePresence mode="wait" 内蔵
    bars?: number;                  // default 2（濃青+淡青）
    skipOn?: (from: string, to: string) => boolean; // 例: クエリ変更のみ等はスキップ
  };
  ```
- **アニメーション仕様**: `clip-path: polygon()` を使う（transform+回転長方形はSafariでにじむ）。Divider inView時: 各バーが `x: -110%→0`、`dur.hero`、`ease.inOut`、stagger 0.12。Overlay: 退場ページの上を淡青→濃青の2バーが `x: -110%→0→110%` で横断（合計 ~0.9s）、横断ピークで route swap。**スクロール位置リセットとfocus移動をOverlayが責務として持つ**。reduced-motion: Overlayは単純クロスフェード(0.2s)に縮退。
- **依存**: P-0、react-router v6（Overlayのみ）。
- **再利用例**: Hero→What We Do境界、明色→濃紺(Join Us)境界、全ページ遷移。**divider と overlay が同じ角度・同じ色トークンを共有する**ことでブランドの一貫性が資産になる。
- **AC**: ①遷移中に旧ページのスクロール位置が新ページに漏れない ②連打ナビゲーションで壊れない ③60fps（clip-pathとtransformのみ、再レイアウトなし）④reduced-motionでクロスフェード動作 ⑤モバイルで角度が緩和され三角形が画面を食いすぎない。

### P-4. ScrollScene — スクロール連動3Dラッパー（r3f） — [fable-craft]

- **パス**: `src/components/motion/ScrollScene.tsx` + `src/components/motion/scenes/`（プリセット群）
- **目的**: LayerX目録§7-2/§7-4。ヒーロー・行動指針の3Dビジュアル基盤。**「Canvasの管理・スクロール接続・フォールバック」をラッパーが吸収し、幾何形状はプリセットとして差し替え可能**にするのが資産設計。
- **依存追加**: `three@^0.170`、`@react-three/fiber@^8.17`、`@react-three/drei@^9.114`。**React 18のため r3f v9系（React 19必須）は不可、v8系を固定すること。** `React.lazy` + dynamic import でCanvas一式を分離チャンク化（3D未使用ページのバンドルに影響ゼロ）。
- **Props API**:
  ```ts
  type ScenePreset = 'cubeStack' | 'discStack' | 'shardSphere';
  type SceneRenderProps = { progress: number /* 0-1 */; reducedMotion: boolean };
  type ScrollSceneProps = {
    scene: ScenePreset | ((p: SceneRenderProps) => ReactNode); // プリセット or 自作シーン
    progress?: MotionValue<number>;   // 省略時: 自身のコンテナ基準で useScroll(offset: scroll.sceneRange)
    accent?: string;                  // CSS var名。default '--color-accent'。JS側でgetComputedStyleから解決
    fallback?: ReactNode;             // 静止画(nanobanana生成)。WebGL不可/reduced-motion/低速回線時
    mobile?: 'full' | 'lite' | 'fallback'; // default 'lite'（dpr=1・ジオメトリ簡略）
    dprCap?: number;                  // default 1.5
    className?: string;
    interactive?: boolean;            // pointerパララックス（±3deg程度）default false
  };
  ```
- **アニメーション仕様**: スクロール接続は **Framer Motionの `useScroll` → MotionValue を r3f の `useFrame` 内で `.get()`**（Reactの再レンダーを介さない = 60fps担保の要）。プリセット: `cubeStack`（Hero用・等角投影風の正立方体群、分散→整列積層＋回転、"レイヤー"メタファーのhonkoma版）／`discStack`（原則ページ・円盤が縦積み）／`shardSphere`（球が破片から組上げ）。ライティングは環境光+方向光1灯のフラット陰影（フォトリアル禁止）。マテリアル色は `accent` トークン注入。
- **マウント制御**: IntersectionObserverで viewport外はrAFループ停止（`frameloop="demand"` + invalidate）。同時マウントは1ページ2 Canvasまで。
- **状態/ホバー**: `interactive` 時のみpointerパララックス。
- **再利用例**: トップHero背景、行動指針01〜05の各ビジュアル（`progress`を外部注入しナンバリング進行=§7-4と同期）、採用ページのアイキャッチ。
- **AC**: ①Lighthouse mobile perf がシーン追加前比 -5pt 以内 ②WebGL非対応・reduced-motionで `fallback` 静止画が同レイアウトで出る（CLSなし）③スクロールとprogressの追従にジャンクがない ④viewport外でGPU使用が止まる ⑤`accent`のCSS var差し替えが3Dマテリアルに反映される。

### P-5. ArrowCTA — 円形矢印ボタン — [fable-craft]

- **パス**: `src/components/ui/ArrowCTA.tsx`
- **目的**: LayerX目録§7-7。カード・CTA・グリッド項目の全域で使う最重要ホバー資産。**サイトの「手触り」はほぼこのボタンで決まる。**
- **Props API**:
  ```ts
  type ArrowCTAProps = {
    size?: 'sm' | 'md' | 'lg';            // 40 / 56 / 96px
    variant?: 'outline' | 'fill' | 'ghost';
    direction?: 'right' | 'up' | 'external'; // upはback-to-top、externalは↗
    label: string;                          // aria-label必須（型で強制）
    withText?: string;                      // 併記テキスト（「事業内容へ」等）。円の左に配置
    to?: string; href?: string; onClick?: MouseEventHandler; // 排他。to=Link/href=a/onClick=button
    hover?: 'sweepSwap' | 'spin';          // default 'sweepSwap'
    className?: string;
  };
  ```
- **状態とホバー挙動**（`sweepSwap`・LayerX忠実再現）: **default**=1.5pxボーダー円（accent）、矢印accent色。**hover**=①背景が中心から円形に塗り拡がる（内側疑似要素 scale 0→1、`dur.fast`、`ease.soft`）②矢印が右へ抜けて左から2本目が入る（矢印2本重ね、x:0→130% / x:-130%→0）③矢印色が `--text-on-inverse` に反転。**解除時は逆再生でなく即0.2sフェードで戻す**。**active**=scale 0.96。**focus-visible**=2px focus-ringオフセット、hover演出もフォーカスで発火。`spin`=矢印が-45°→0°回転しつつ塗り。**タッチ**=hover演出なし・activeのみ（`@media (hover: hover)` ガード）。
- **依存**: P-0、react-router Link。
- **再利用例**: What We Do各カード、News/実績行、Join Us大円CTA（lg）、メンバーカード、back-to-top（FloatingNav内でup+ghost）。
- **AC**: ①`inverse`テーマ内でpropsなしに配色反転 ②キーボードTab→Enterで動作しfocusリング可視 ③hover往復で破綻しない ④3形態（Link/a/button）で正しいセマンティクス。

### P-6. UnderlineTabs — 動くアンダーライン — [fable-craft]

- **パス**: `src/components/ui/UnderlineTabs.tsx`
- **目的**: LayerX目録§7-6。「私たちについて」配下ナビや将来のサービス切替タブ。
- **Props API**:
  ```ts
  type TabItem = { id: string; label: string; to?: string };  // to指定でルーターリンク化
  type UnderlineTabsProps = {
    tabs: TabItem[];
    activeId: string;
    onChange?: (id: string) => void;
    size?: 'sm' | 'md';
    stretch?: boolean;          // 均等幅
    className?: string;
  };
  ```
- **状態/ホバー**: 非activeタブ hover: テキスト secondary→primary（`dur.fast`）＋薄い下線をopacityでプレビュー。active: 太下線（2px, accent）。
- **アニメーション仕様**: 下線は単一要素の `layoutId="tab-underline"` で移動（`ease.spring`）。幅の異なるタブ間でも自動追従。ルーターモード時は `useLocation` でactive判定。**キーボード**: `to`ありならnav（roleをnavに）、なければWAI-ARIA Tabs（tablist・矢印キー）。
- **依存**: P-0。
- **再利用例**: 「私たちについて」ナビ、採用の職種/カルチャー切替、実績のカテゴリフィルタ。
- **AC**: ①タブ幅が異なっても下線が正確追従 ②横スクロール（モバイル溢れ時）対応、active選択で自動可視化 ③reduced-motionで瞬間移動 ④aria属性がモードに応じ正しい。

### P-7. Marquee — ロゴ/テキスト横流し — [fable-craft]

- **パス**: `src/components/ui/Marquee.tsx`
- **目的**: LayerX目録§7-9。導入実績30社のロゴ帯、採用のキーワード帯。
- **Props API**:
  ```ts
  type MarqueeProps = {
    children: ReactNode;          // ロゴ<img>やテキストの列
    speed?: number;               // px/s, default 60
    direction?: 'left' | 'right';
    pauseOnHover?: boolean;       // default true
    fadeEdges?: boolean;          // default true（両端をmask-imageでフェード）
    gap?: number;                 // px, default 64
  };
  ```
- **アニメーション仕様**: コンテンツを2回複製し CSS keyframes `translateX(0→-50%)` 無限ループ。durationは ResizeObserver で実幅から `width/speed` を算出（速度がコンテンツ量に依存しない＝資産性）。複製分は `aria-hidden`。`prefers-reduced-motion`: アニメ停止し折返しの静的グリッドに縮退（CSSのみ）。
- **状態/ホバー**: `pauseOnHover` 時 `animation-play-state: paused`。
- **依存**: なし（Framer Motion不使用。CSSが最軽量・最安定）。
- **再利用例**: トップの実績ロゴ帯、採用の「自分事」キーワード帯、フッター上の帯。
- **AC**: ①ループの継ぎ目が視認できない ②ロゴ3〜30枚で速度一定・破綻なし ③reduced-motionで全ロゴ静的閲覧可 ④メインスレッド負荷ゼロ（composite only）。

### P-8. SectionHeading — セクション見出し（縦書き・英字ラベル・ナンバリング） — [fable-craft]

- **パス**: `src/components/ui/SectionHeading.tsx`
- **目的**: LayerXの「英字ラベル＋特大和文見出し（＋01/05ナンバリング）」の型を全セクションで統一する組版資産。
- **Props API**:
  ```ts
  type SectionHeadingProps = {
    title: string | string[];        // TextRevealへ委譲
    enLabel?: string;                // "What We Do" 等。Space Grotesk・トラッキング広め
    index?: { current: number; total?: number };  // "01/05" 表示
    orientation?: 'horizontal' | 'vertical' | 'vertical-md';
    level?: 1 | 2 | 3;               // 見出しレベル（h要素）
    align?: 'start' | 'center';
    reveal?: boolean;                // default true（TextReveal使用）
    className?: string;
  };
  ```
- **状態/ホバー**: なし。inverse テーマ自動追従（§1.2）。
- **アニメーション仕様**: enLabel が先に fade（delay 0）→ title が TextReveal lines（delay 0.15）→ index が fade（delay 0.3）の固定シーケンス。**この順序を焼き込むことで全ページのリズムが揃う。**
- **依存**: P-0, P-2。
- **再利用例**: 全セクション冒頭。Hero（level=1, vertical-md）、What We Do（level=2）、行動指針（index付き）。
- **AC**: ①縦書き時のenLabel/indexの配置が仕様どおり ②h1〜h3のアウトラインが正しい ③title未リビール状態でもスペース確保でCLSなし。

### C-1. FloatingNav — モーフするナビ（→Menuピル＋円形プログレス） — [fable-craft]

- **パス**: `src/components/Layout/FloatingNav/`（`index.tsx`, `MenuPill.tsx`, `ProgressCircle.tsx`, `MenuOverlay.tsx`, `useNavPhase.ts`）
- **目的**: LayerX目録§7-5。全ページ共通のUXの背骨。現行 `Header.tsx` を置換する。
- **Props API**:
  ```ts
  type NavLink = { label: string; to: string; children?: { label: string; to: string }[] };
  type FloatingNavProps = {
    links: NavLink[];
    cta?: { label: string; to: string };     // 「採用情報」ピル等
    logo: ReactNode;
    morphAt?: number;                        // default: vh * scroll.navMorphY
    hideOnScrollDown?: boolean;              // default true（フルバー時のみ）
  };
  // useNavPhase(): 'full' | 'condensed' — scrollY・方向から算出。他コンポーネントも購読可
  ```
- **状態とホバー挙動**: **phase full**（上部）=横並びナビ＋右端CTAピル。リンクhover: テキスト色遷移＋細下線 `scaleX 0→1`（`dur.fast`）。**phase condensed**（morphAt超過）=フルバーが上へ退場（y:-100%, `ease.out`）と同時に左上「Menu」ピル・右上 ProgressCircle＋↑ が scale0.8+fade→1 で入場（stagger 0.08）。**layoutIdモーフは使わない**（形状差が大きく2要素退場/入場の方が忠実で壊れにくい）。MenuPill hover: 背景 soft→accent、テキスト反転。ProgressCircle: SVG circle `pathLength` を `scrollYProgress` 直結（spring damping 40）、hoverで↑nudge、クリックでsmooth top。MenuOverlay（ピル押下）: 全画面が `clip-path: circle()` でピル位置から展開、リンクは RevealGroup stagger。**focus trap・Escで閉じる・背景スクロールロック必須**。
- **アニメーション仕様**: スクロール監視は `useScroll` + ヒステリシス（発火点±80pxデッドバンドで境界チラつき防止）。
- **依存**: P-0, P-1, P-5（↑=ArrowCTA up/ghost）。
- **再利用例**: 全ページ共通。`links` propsだけで将来のIA変更に無改修追従。
- **AC**: ①境界往復でチラつかない ②Overlayのfocus trap/Esc/スクロールロック機能 ③キーボードのみで全ナビ操作可 ④モバイル: フルバー段階からMenuピル形態を既定（横並び非表示）⑤ルート遷移でOverlay自動クローズ ⑥reduced-motionで退場/入場が瞬時。

### C-2. StaggerGrid — カード/グリッドのstaggerフェードアップ — [fable-craft]

- **パス**: `src/components/ui/StaggerGrid.tsx`
- **目的**: LayerX目録§7-8。「グリッドに入れれば揃って気持ちよく出る」を保証するレイアウト＋モーション複合資産。
- **Props API**:
  ```ts
  type StaggerGridProps = {
    children: ReactNode;                      // 任意のカード
    columns?: { base?: number; md?: number; lg?: number }; // default {base:1, md:2, lg:3}
    gap?: 'sm' | 'md' | 'lg';
    stagger?: number;                         // default stagger.base
    masonry?: boolean;                        // CSS columnsベース（チーム写真グリッド用）
    maxStagger?: number;                      // default 6 — 7枚目以降はdelay頭打ち（下段が待たされない）
    className?: string;
  };
  ```
- **アニメーション仕様**: `staggerContainer` variants＋子は `fadeUp` 継承。`viewport.eager`。`maxStagger` が資産価値: 30ロゴでも間延びしない。masonry時は列単位でdelayを散らす。
- **依存**: P-0, P-1。
- **再利用例**: What We Do 3カード、メンバーグリッド、実績ロゴグリッド、Join Usチーム写真マソンリー、News行リスト。
- **AC**: ①子1〜30個で破綻しない ②masonryで画像高さバラバラでも隙間なし ③スクロール高速通過で未発火残りなし ④columns変更がモーションに影響しない。

### C-3. ProfileCard — メンバー/実績カード — [fable-craft]（グリッド配置・データ流し込みは labor）

- **パス**: `src/components/ui/ProfileCard.tsx`
- **目的**: LayerX経営メンバーグリッドのカード単体（顔写真＋名前JP＋ローマ字＋役職＋円形→）。
- **Props API**:
  ```ts
  type ProfileCardProps = {
    image: string;
    name: string;
    nameEn?: string;             // ローマ字。Space Grotesk
    role?: string;
    tags?: string[];             // 実績カード転用時: 業種タグ等
    to?: string;                 // 詳細ページ。指定時カード全体がリンク
    aspect?: '3/4' | '1/1' | '4/3';
    showArrow?: boolean;         // default: !!to
  };
  ```
- **状態とホバー挙動**: default=角丸画像＋名前ブロック＋右下ArrowCTA(sm/outline)。**hover（カード全体）**: ①画像 scale1→1.05（`dur.reveal`, overflow-hidden）②ArrowCTAのhover演出を**連動発火**（group-hover — カードのどこを触ってもボタン反応）③名前に下線 `scaleX 0→1`。focus-visible=外周リング、hoverと同演出。入場はStaggerGrid任せ（自身はwhileInView持たない=二重発火防止）。
- **依存**: P-0, P-5。
- **再利用例**: 経営メンバー、チームページ、実績カード（tags）、採用のカルチャー紹介カード。
- **AC**: ①`to`ありでカード全域クリック可・Enter遷移 ②画像未読込時aspect比でスペース確保（CLSなし）③タッチでhoverなしでも情報全表示 ④ArrowCTA連動がgroup-hoverで同期。

### C-4. ListRow — News/実績の行リスト（補完提案） — [fable-craft]

- **パス**: `src/components/ui/ListRow.tsx`
- **目的**: LayerX「Latest News」の行UI（日付＋カテゴリピル＋見出し＋外部リンクアイコン）。brief §3の示唆どおり**導入実績/メディア掲載を同じUIで見せる**汎用行。目録§7に明示はないがLayerX再現に必須と判断し追加。
- **Props API**:
  ```ts
  type ListRowProps = {
    title: string;
    meta?: string;                     // 日付等
    pill?: { label: string; tone?: 'accent' | 'neutral' | string }; // カテゴリ色ピル
    thumb?: ReactNode;                 // ロゴ画像等
    href?: string; to?: string;
    external?: boolean;                // ↗アイコン
  };
  ```
- **状態/ホバー**: default=上下ボーダー区切り行。hover=背景 `--surface-raised` フェードイン＋タイトル x:0→8px nudge＋外部アイコン↗方向2pxシフト（`dur.fast`, `ease.soft`）。入場はStaggerGrid(1列)委譲。
- **依存**: P-0。
- **再利用例**: News一覧、導入実績リスト、採用の募集職種リスト。
- **AC**: ①行全体リンクでキーボード可 ②pillのtoneがトークン参照で任意色差替可 ③長タイトル折返しで崩れなし。

### C-5. SectionShell — セクション背景・テーマ切替の器 — [仕様=fable / 実装=labor]

- **パス**: `src/components/Layout/SectionShell.tsx`
- **目的**: `--section-py` リズム・`data-theme="inverse"`・WedgeDivider接続を1つの器に。ページ組み立て工程が**これを並べるだけ**でLayerXの縦リズムを再現。
- **Props API**:
  ```ts
  type SectionShellProps = {
    children: ReactNode;
    theme?: 'default' | 'inverse';
    wedge?: 'top' | 'bottom' | 'both' | false;   // WedgeDivider自動挿入
    width?: 'content' | 'wide' | 'full';
    id?: string;                                  // アンカー
    as?: 'section' | 'div' | 'footer';
  };
  ```
- **状態/ホバー/アニメ**: なし（器）。wedge指定時にP-3を接続するだけ。
- **依存**: P-3、tokens.css。
- **AC**: ①inverse内で子群がpropsなし反転 ②wedge色が前後セクションのsurfaceと連続 ③縦paddingがトークン一元管理。

### C-6. MotionLab — プリミティブ検証ページ（dev専用） — [骨格=fable / 例追加=labor]

- **パス**: `src/pages/_lab/MotionLab.tsx`（`import.meta.env.DEV` のみルート登録）
- **目的**: 全プリミティブを1画面で目視検証する「生きたカタログ」。**後工程のOpus/Sonnetがコピペ元として参照する使用例集**でもあり、モデル非依存資産の要。各プリミティブのAC検証はこのページ上で行う。
- **仕様**: 各プリミティブにつき「既定props」「主要バリエーション」「inverseテーマ内」の3例＋reduced-motionトグル（devスイッチ）。

---

## 3. ビルド順序 / 依存グラフ

```
[Phase 0] tokens.css / tokens.ts / variants.ts / MotionProvider(P-0)  ← 全ての前提
    │
[Phase 1] 独立プリミティブ（並行可能）
    ├─ P-1 Reveal/RevealGroup
    ├─ P-5 ArrowCTA          ← 最初に完成度を見せる「手触りの基準器」
    ├─ P-7 Marquee
    └─ P-6 UnderlineTabs
    │
[Phase 2] テキスト/境界系
    ├─ P-2 TextReveal（→ P-8 SectionHeading が依存）
    └─ P-3 WedgeTransition（Divider先行、Overlayはルーター統合のため後半）
    │
[Phase 3] 合成コンポーネント
    ├─ P-8 SectionHeading（P-2依存）
    ├─ C-2 StaggerGrid（P-1依存）
    ├─ C-3 ProfileCard / C-4 ListRow（P-5依存）
    ├─ C-1 FloatingNav（P-1, P-5依存・現Header置換）
    └─ C-5 SectionShell（P-3依存）
    │
[Phase 4] 重量級（独立トラック・Phase 1と並行着手可）
    └─ P-4 ScrollScene（r3f v8導入 → cubeStack → 残プリセット）
    │
[Phase 5 = 後工程の労働] ページ組み立て
    Home(Hero/WhatWeDo/実績/JoinUs) → About系下層 → 採用 → §8監査issue反映 → 旧ページ整理
```

- **クリティカルパス**: Phase 0 → P-5/P-1 → C-1。ここまでで「サイトの手触り」が確定。
- **並行性**: P-4（3D）は独立トラック。Heroは `fallback` 静止画で先に組めるため、3D完成をページ組み立てのブロッカーにしない。
- **各Phase完了条件**: MotionLab（C-6）上で該当プリミティブのAC全項目を通すこと。

---

## 4. オーナーシップ・サマリ

### fable-craft（資産価値が高く作り込むべきもの — issue化単位）
Foundation一式(P-0/§1) / ArrowCTA(P-5) / Reveal(P-1) / TextReveal縦書き(P-2) / WedgeTransition(P-3) / ScrollScene+cubeStack(P-4) / FloatingNav(C-1) / UnderlineTabs(P-6) / Marquee(P-7) / SectionHeading(P-8) / StaggerGrid(C-2) / ProfileCard(C-3) / ListRow(C-4) / MotionLab骨格(C-6)

### opus/sonnet-labor（仕様どおり組むだけの労働）
- SectionShell 実装（C-5、仕様は本書で完結）
- ScrollScene 残プリセット（discStack/shardSphere — cubeStackの雛形の変奏）
- MotionLab への使用例追加
- **Phase 5 全部**: ページ組み立て、コピー/データ流し込み、正データ反映、§8監査issue 10件の解消、旧サービスページの整理・リダイレクト、OG/メタ、nanobanana静止画の生成・差し込み
- Tailwind旧トークン（orange系）の段階的除去

### 実装時の横断的注意（各issueに転記）
1. r3fは **v8系固定**（React 18のため。v9はReact 19必須）。three/fiber/dreiのバージョン組合せをlockで固定。
2. 全プリミティブ: framer-motionは `m.` + LazyMotion(`domAnimation`) 経由。`motion.` 直importは禁止（バンドル二重化防止）。
3. duration/easing直値の禁止（tokens.ts参照のみ）。カラーはセマンティックCSS変数のみ参照。
4. 各コンポーネントのDoD = 本書のAC + MotionLab掲載 + reduced-motion目視 + モバイル実機（375px）確認。

### 未決事項 → §5で確定済み
- ~~Hero 3Dのモチーフ最終形~~ → §5① `embraceStack` に確定
- ~~英字フォントの最終選定~~ → §5② Space Grotesk に確定

---

## 5. 確定追補（未決2点の決定 — fable, 2026-07-05）

### ① Hero 3Dシーン最終形 — 名称変更: `cubeStack` → **`embraceStack`**（#19）

「等角キューブ群」の骨格は残しつつ、**無機質な積層をやめ、ロゴの"抱きかかえる腕＝弧で包む"を幾何化**。LayerXが「レイヤー＝板の積層」なら honkomaは「**包み・囲い・その中で立ち上がる芽（＝育つ人・未来）**」。プリセット名を意味に合わせ改名。

**ジオメトリ**（等角風 `OrthographicCamera`、見下ろし約35°/方位45°）:
1. **包む弧（Embrace Arcs）×3枚** — 主役。`TorusGeometry` を弧に切った開いた囲い（arc≈π×1.15/太めチューブ）。半径比 1.0/0.72/0.48、Y軸周りに約15°ずつ位相ずらしでネスト。
2. **芯キューブ（Core Cubes）×3個** — 弧の内側中心に `RoundedBox`（bevel強め＝ロゴの丸み）を縦に軽く積む。スケール 0.9/0.7/0.55。**この3個だけが等角キューブの名残**。
3. **浮遊ドット（Motes）×6–8個** — ごく小さい球。弧周囲にまばら、終端でゆっくり公転。「一緒に/集まる人」。過剰にしない。

**progress 0→1 の振り付け**（「バラバラ→包まれて立ち上がる」を1ストローク）:
| progress | 状態 |
|---|---|
| 0.0 | 弧は開き切って離れ散在（arc狭め＝ほどけた）、キューブ分散・低位置、ドット外周拡散、全体うっすら傾き |
| 0.0→0.55 | 弧が**閉じながら中心へ寄る**（arc補間で腕が伸びて囲む＋半径定位置）。キューブが下から中心へ集まり縦に積む＝「抱擁成立」の山場 |
| 0.55→1.0 | 包み終えた全体がY軸周りをゆっくり半回転（約90–110°）。ドットが外周公転開始。キューブ最上段が微かに伸び上がる（+3%脈動＝芽が育つ） |
| 1.0 | 静止せず常時微回転（0.05rad/s）＋ドット公転（生きている感） |
実装: progress(MotionValue)を `useFrame` 内 `.get()` → rotation.y/position/torus arc を lerp（再レンダー経由禁止, P-4）。弧の閉じに easeOutExpo近似、集合に軽いoinvershoot(damped)で「抱きしめる」手触り。

**カラー**（外淡→芯濃＝包まれた中心が最も確か）:
| 要素 | material color | 補足 |
|---|---|---|
| 外弧 | `--color-accent-soft`(#DCEEFF) | opacity~0.85 包む空気感 |
| 中弧 | `--color-accent-bright`(#2F9BFF) | ロゴ明青 |
| 内弧 | `--color-accent`(#0462CB) | ロゴ濃青 |
| 芯キューブ3個 | accent→accent-bright（下濃→上明） | 芽が上へ明るく＝希望 |
| ドット | accent-bright, emissive弱 | |
material=`MeshStandardMaterial`(roughness0.55/metalness0.05＝和紙〜マット樹脂)。色はJS側 `getComputedStyle` でCSS変数解決し注入（トークン差替が3Dに効く）。

**ライティング**（フラット陰影）: `ambientLight` intensity **0.75**、`directionalLight`×1 position `[3,5,4]`・intensity **0.9**・暖白(#FFF7EE相当。青に温度を足す＝ブランド要件を光で担保)。影は落とさない（必要なら極薄`ContactShadows` opacity0.15）。フォトリアル禁止。

**モバイルlite**: 弧3→2枚・キューブ3→2個・ドット省略、dpr1.0固定、torusセグメント約半分、回転控えめ・常時微回転停止、viewport外`frameloop="demand"`停止。

**fallback静止画（nanobanana）**: embraceStack progress≈0.9を正面やや見下ろし等角で切り取り。背景`--surface-base`微グラデ、弧=淡→明→濃青レイヤー、芯=濃青。マット/ソフトシャドウ/余白広め/ミニマル。プロンプト末尾: *flat geometric, no photorealism, no purple, generous whitespace, soft matte blue palette*。

**変奏**: `discStack`(行動指針)=弧を薄い円盤(角丸シリンダー)に置換、下から積層・淡濃を下上反転。`shardSphere`(Fact Base)=芯を球の分割破片に置換、progress0散→1収束、弧なし。

### ② 英字フォント — **Space Grotesk** に確定（#15 Foundationに焼く）

**選定理由**: 幾何学サンセリフだが角に呼吸があり「幾何学的だが冷たくない」＝ブランド要件（青×人間味）に一致。Interは中立・汎用UI然として"署名"にならない。英字はアクセント（ラベル/ナンバリング/短コピー）限定なので中立性より"らしさ"優先。ロゴの丸み・Noto Sans JPとの併置で英字がアクセントとして立つ。数字("01/05")が主役用途で字形が記憶に残る。

**ウェイト/用途**（アクセント限定・2ウェイトのみ）:
| ウェイト | 用途 |
|---|---|
| Medium(500) | 英字ラベル("What We Do")・ナンバリング"01/05"。トラッキング広め |
| Bold(700) | Hero英字コピー・強調ナンバリング（大サイズ限定） |
400/300/600は入れない。英字は本文に使わない（本文はNoto Sans JP）。

**self-host**: `@fontsource/space-grotesk`(OFL, npm)、woff2のみ、**latinサブセットのみ**（500/700 の2ファイル、~40–60KB）。`font-display:swap`、preloadはトップのHero英字のみ。
```css
:root {
  --font-en: 'Space Grotesk', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif;
  --font-jp: 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif;
}
```
Tailwind: `fontFamily.en = ['var(--font-en)']`。既存sans(Noto)据え置き。

**組版指針**: 大文字ラベルは `letter-spacing:0.08em`（アクセント記号化）、数字は0.04em。Hero英字コピー（文章）は逆に -0.01em微詰め。**英字ラベルは和文見出しと別行・別サイズで扱う**（インライン混植回避＝ベースライン調整コストゼロ、保守性/資産性が高い）。縦書き見出し脇の数字は `text-orientation` 適用せず横倒しのまま正立表示。
