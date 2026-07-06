# 引き継ぎガイド（HANDOFF）— honkoma コーポLP刷新

> 別のClaude/エンジニアがこのリポジトリの編集を引き継ぐための起点。まず本書 →
> 該当する設計docの順で読めば、文脈ゼロから続きを作れます。最終更新: 2026-07-06。

## 0. これは何か
株式会社honkoma（B2B・AI伴走導入／10名）のコーポレートサイト。「会社の顔＋採用」の
2軸で全面刷新した。ブランド基準は LayerX（layerx.co.jp）。**新ポジショニング＝
「会社を、AIネイティブへ。徹底的な伴走でトランスフォーム」**。

- リポジトリ: `MaururuTakumi/qucikcliplp`
- 作業ブランチ: **`feat/design-system`**（デフォルト=`master`。本番は master 追従）
- 本番ドメイン: **https://ltdhonkoma.com/**
- 技術: React 18 + TypeScript + Vite + Tailwind + React Router v6 + Framer Motion（`m.*` + LazyMotion）

## 1. 動かす
```bash
git clone https://github.com/MaururuTakumi/qucikcliplp.git
cd qucikcliplp && git checkout feat/design-system
npm install
npm run dev            # http://localhost:5173
npm run build          # 本番ビルド（dist/）
npx tsc --noEmit       # 型チェック（コミット前に必ず green に）
```

## 2. 迷ったらこの順で読む（設計が正典・コードは実装）
| 目的 | doc |
|---|---|
| サイト全体のIA/サイトマップ/セクション構成 | `docs/site-ia-design.md` |
| /product の再設計・行動指針4原則 | `docs/product-and-principles-design.md` |
| 導入事例（カード→記事）の読了→問い合わせ動線 | `docs/case-study-conversion-design.md` |
| AIチャット「AIに聞いてみる」動線（予約ファースト） | `docs/ai-chat-funnel-ux-redesign.md`（動線の最新・上位差分）/ `contact-ai-funnel-design.md` / `contact-ai-advanced-design.md`（基盤） |
| デザイン/モーションの型 | `docs/component-animation-blueprint.md` / `docs/lp-redesign-brief.md` |
| LayerX分析（土台） | `docs/layerx-structure-analysis.md` / `layerx-content-analysis.md` |
| AIチャット基盤のセットアップ実態（Secrets/Notion/Slack） | `docs/ai-chat-setup-prompt.md` |

**Sonnet等でも安全に編集するためのスキル**: `.claude/skills/honkoma-lp/`（SKILL.md + references/）。
デザインシステムの部品・レシピ・アンチパターン・検証手順・正データが入っている。編集前に読む。

## 3. デザインシステム（守る規約）
- **色・余白はセマンティックトークンのみ**（`src/design/tokens.css`）。`var(--color-accent)`
  `var(--text-primary)` `var(--surface-base/raised)` 等。生の色値・旧Tailwind（cream/ink/warm）は使わない。
- ページは部品の積み重ね: `SectionShell`（`theme="inverse"`で濃紺・`wedge`で斜め境界）/
  `SectionHeading`（`enLabel`/`title`/`level`/`index`）/ `StaggerGrid` / `Reveal` / `ArrowCTA`
  （`to`|`href`|`onClick`、`variant` fill/outline/ghost、`direction="external"`）。手本=`src/pages/ProductPage.tsx` `RecruitPage.tsx`。
- モーションは `m.*`（`motion.*` 直import禁止）。duration/easing は `src/design/tokens.ts` から（リテラル禁止）。
- 行動指針など**共有コピーは1箇所を正本に**（原本=/about#principles、/recruitは同文再掲。片方だけ編集しない）。

## 4. 現在地（2026-07-06 時点で完了）
IA移行 M1〜M12 すべて完了 + 導入事例の箱 + 予約ファースト動線 v1。全ページ新DS化・新ポジショニング反映。
- ルート: `/`（ホーム）`/about` `/team` `/product` `/hotel` `/case-studies` `/case-studies/:slug`
  `/recruit` `/contact` `/privacy`。`/d2c`・`/review-ai` は `/product` へリダイレクト（削除済）。
- **廃止した概念（復活させない）**: プラン制（スタンダード/AI顧問/AI秘書）、口コミAI、D2C、
  料金数値、比較表、裏取りなし定量成果（監査#5-14）。
- **行動指針4原則**（正本=/about#principles）: 自分事 / まず、解く。/ 最先端に、立ち続ける。/ 今日、やる。
- **導入事例** `src/data/caseStudies.ts`: 実名(許諾済)=BuySell / 貞栄会 / 株式会社慶洋エンジニアリング、
  匿名=クリニック / ITサービス / コンサル / 広告代理店(=AViC匿名)。声・写真は取得後に差し替え（捏造しない）。
- **AIチャット動線**: 3案直後に主CTA「日程を選ぶ」（Googleカレンダー
  `https://calendar.app.google/DcGsqPYBvRf3dvZJ8` を新規タブ）、副=メール(pull型)。取得前の質問は無し。

## 5. 役割分担（この体制で進めてきた）
- **fable（Claude Fable 5・sub-agent）**: 資産性の高い設計・コピー・ポジショニング（IA/行動指針/
  /product/動線設計）。「マッキンゼーにトイレ掃除させない」＝単純労働に使わない。
- **Opus/Sonnet**: 実装（ページ組み立て・内容流し込み・リスキン）。Sonnetは機械的リスキン向き。
- **codex（別デバイス）**: AIチャット基盤 `src/features/ai-chat/` と `workers/ai-chat/`（Cloudflare Worker・
  DeepSeek・Notion・Slack）。**同じ作業ツリーで並行するときは、相手が編集中の未コミットファイルに触らない。**

## 6. 残タスク / 引き継ぎ先の入口
- **本番デプロイ**: GitHub issue **#41**（フロントVercel + Worker + ドメイン + 検証）。チャット基盤準備=#38/#39/#40。
- **AIチャット動線の後続（staged）**: `docs/ai-chat-funnel-ux-redesign.md` の未実装分＝取得後エンリッチ
  3問（課題/規模/役職）・モバイルsticky予約バー・進捗ドット・3案カードのevidence折りたたみ・
  予約完了の自動リード化（Googleカレンダーはwebhook無し→Google Apps Script等が要る）。
- **差し替え待ち**: 導入事例の"お客様の声"（貞栄会・慶洋）、チーム写真10名分（ホームJoin Us/採用のマソンリー）。
- **要対応ブロッカー**: #39 の Notion `Inbound Leads` DB を Worker の integration に共有（未共有だと保存が404）。

## 7. コミット/PR運用
- 変更は `feat/design-system` にコミット→push。コミット末尾に `Co-Authored-By` を付けてきた。
- コミット前に `npx tsc --noEmit`（+ 必要なら `npm run build`）を green に。
- プレビュー検証は claude-in-chrome（実ブラウザ）推奨。プレビューMCPは hidden tab で
  IntersectionObserver/rAF が発火せず whileInView/マウント演出の検証に不向き。
- 本番へ出すときは `feat/design-system → master` のPR（issue #41 の手順）。
