# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

### 開発サーバー起動
```bash
npm run dev
```
開発サーバーは http://localhost:5173/ で起動します。

### プロダクションビルド
```bash
npm run build
```

## プロジェクト概要

株式会社Honkomaの企業ウェブサイトです。Quick ClipというApp Clipを活用したQRコード決済ソリューションを提供する会社のマルチページサイトです。React + TypeScript + Vite + Tailwind CSS + React Routerで構築されています。

## アーキテクチャ

### メインエントリーポイント
- `src/index.tsx`: React Routerを使用したルーティング設定
- `src/components/Layout/Layout.tsx`: 全ページ共通レイアウト

### ページ構成
以下の6つの主要ページで構成されています：
- `src/pages/HomePage.tsx`: ホーム（会社の顔となるページ）
- `src/pages/AboutPage.tsx`: 会社概要（理念、ミッション、会社情報、沿革）
- `src/pages/ProductPage.tsx`: 商品紹介（Quick Clipの詳細）
- `src/pages/TeamPage.tsx`: 役員紹介（CEO、共同創業者、CTO）
- `src/pages/ContactPage.tsx`: お問い合わせフォーム
- `src/pages/PrivacyPage.tsx`: プライバシーポリシー

### 共通レイアウト
- `src/components/Layout/Header.tsx`: ナビゲーション付きヘッダー
- `src/components/Layout/Footer.tsx`: 企業情報フッター
- `src/components/Layout/Layout.tsx`: レイアウトラッパー

### 既存セクションの活用
ProductPageでは既存のLPセクションを統合：
- `src/screens/Desktop/sections/`: 既存のセクションコンポーネント
  - IntroductionSection: 課題提起
  - FeatureSection: 3ステップフロー
  - StepsSection: メリット紹介
  - ThreeStepsSection: 実際の導入フロー
  - UseCaseSection: 導入事例

### 外部連携
- Google Apps Script: 問い合わせフォームのバックエンド
- Google Analytics: gtag関数でイベント計測
- Supabase: 環境変数設定済み（現在未使用）

### スタイリング
- Tailwind CSS使用
- カスタムカラー: primary（blue系）、企業カラー
- レスポンシブデザイン対応（mobile-first）
- 一貫したデザインシステム

### SEO対策
- 各ページ固有のメタタグ設定
- 企業サイト向け構造化データ（Corporation, WebSite, SoftwareApplication）
- セマンティックHTML
- ARIA属性対応
- Open Graph、Twitter Card対応

### ルーティング
React Routerによるクライアントサイドルーティング：
- `/`: ホーム
- `/about`: 会社概要
- `/product`: 商品紹介
- `/team`: 役員紹介
- `/contact`: お問い合わせ
- `/privacy`: プライバシーポリシー

## ファイル構造のポイント

- `public/`: 静的アセット（画像、SEOファイル、既存のQuick Clipアセット）
- `src/components/`: 共通コンポーネント
  - `Layout/`: レイアウト関連
  - `ui/`: 再利用可能なUIコンポーネント
- `src/pages/`: 各ページコンポーネント
- `src/screens/Desktop/sections/`: 既存LPセクション（ProductPageで活用）
- `src/lib/`: ユーティリティ（Supabase設定等）

## 重要な設定

### 問い合わせフォーム
ContactPageのフォームは既存のGoogle Apps Script URLに送信されます。
フォーム項目：名前、メール、会社名、部署名、問い合わせ種別、内容

### 企業情報
- 企業理念：「本当に困っている人の力になる」
- ミッション：「ユーザーの体験を起点にした購買体験を豊かにして売り手、買い手がWin-Winになる世界を目指す」
- 役員：CEO 林拓海、共同創業者 中島幸祐、CTO 谷口俊哉