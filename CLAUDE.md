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

株式会社Honkomaの企業ウェブサイトです。ルーティーンワークの自動化、AI導入支援、Claude CodeやOpenClawなどAIツールの導入支援を提供するテクノロジーカンパニーのマルチページサイトです。React + TypeScript + Vite + Tailwind CSS + React Routerで構築されています。

## アーキテクチャ

### メインエントリーポイント
- `src/index.tsx`: React Routerを使用したルーティング設定
- `src/components/Layout/Layout.tsx`: 全ページ共通レイアウト

### ページ構成
以下の6つの主要ページで構成されています：
- `src/pages/HomePage.tsx`: ホーム（AI導入・業務自動化のCTAを中心に据えたランディングページ）
- `src/pages/AboutPage.tsx`: 会社概要（理念、ミッション、会社情報）
- `src/pages/ProductPage.tsx`: サービス紹介（3つのサービス詳細 + FAQ）
- `src/pages/TeamPage.tsx`: メンバー紹介（CEO、共同創業者）
- `src/pages/ContactPage.tsx`: お問い合わせフォーム
- `src/pages/PrivacyPage.tsx`: プライバシーポリシー

### 共通レイアウト
- `src/components/Layout/Header.tsx`: ナビゲーション付きヘッダー（CTAボタン含む）
- `src/components/Layout/Footer.tsx`: 企業情報フッター
- `src/components/Layout/Layout.tsx`: レイアウトラッパー

### 外部連携
- Google Apps Script: 問い合わせフォームのバックエンド
- Google Analytics: gtag関数でイベント計測
- Supabase: 環境変数設定済み（現在未使用）

### スタイリング
- Tailwind CSS使用
- カスタムカラー: primary（indigo系）、accent（cyan/teal/emerald）、dark（navy系）
- フォント: Syne（display）+ Noto Sans JP（body）
- レスポンシブデザイン対応（mobile-first）
- カスタムアニメーション: float, pulse-glow, gradient-x

### SEO対策
- 各ページ固有のメタタグ設定
- 企業サイト向け構造化データ（Corporation, WebSite）
- セマンティックHTML
- ARIA属性対応
- Open Graph、Twitter Card対応

### ルーティング
React Routerによるクライアントサイドルーティング：
- `/`: ホーム
- `/about`: 会社概要
- `/product`: サービス紹介
- `/team`: メンバー紹介
- `/contact`: お問い合わせ
- `/privacy`: プライバシーポリシー

## ファイル構造のポイント

- `public/`: 静的アセット（画像、SEOファイル）
- `src/components/`: 共通コンポーネント
  - `Layout/`: レイアウト関連
  - `ui/`: 再利用可能なUIコンポーネント
- `src/pages/`: 各ページコンポーネント
- `src/lib/`: ユーティリティ（Supabase設定等）

## 重要な設定

### 問い合わせフォーム
ContactPageのフォームは既存のGoogle Apps Script URLに送信されます。
フォーム項目：名前、メール、会社名、部署名、問い合わせ種別、内容

### 企業情報
- 企業理念：「テクノロジーで、人の可能性を解放する」
- ミッション：「AI導入のハードルをゼロにする」
- メンバー：CEO 林拓海、共同創業者・エンジニア 中島幸祐
