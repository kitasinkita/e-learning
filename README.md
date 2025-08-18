# SmartLearn Pro - カスタマイズ型eラーニングシステム

スライド差し替えだけで、あらゆる業界・職種の研修に対応可能な次世代eラーニングプラットフォームです。

## ✨ 新機能 (2025-08-18更新)

- **🎨 Apple風デザインシステム**: WCAG準拠のアクセシビリティとモダンなUI/UX
- **📱 完全レスポンシブ対応**: デスクトップ・タブレット・モバイル最適化
- **🔧 DESIGN_RULE.md準拠**: 540行の包括的デザインガイドライン
- **🌐 本番環境**: http://52.195.12.32:3000 で稼働中

## 🚀 GitHub Codespacesでの起動方法

1. このリポジトリをFork またはCode → Create codespace on mainをクリック
2. Codespacesが起動するまで待つ（約2-3分）
3. ターミナルで自動的に `npm install` と `node setup.js` が実行されます
4. ポート3000が自動的に公開されます
5. ポップアップまたはPORTSタブから公開URLを取得

## 📖 使い方

### 管理者ログイン
- 社員ID: `ADMIN001`
- パスワード: `admin123`

### 受講者ログイン
- 伊藤: `EMP001` / `password123`
- 柳沢: `EMP002` / `password123`
- 渡辺: `EMP003` / `password123`
- 北川: `EMP004` / `password123`

## 🛠️ ローカル環境での起動

```bash
# 依存関係のインストール
npm install

# データベース初期化
node setup.js

# サーバー起動
npm start
```

## 📚 レッスン内容

1. **レッスン01**: Claude Code入門
2. **レッスン02**: 基本操作 & GitHub入門
3. **レッスン03**: MCP外部ツール連携
4. **レッスン04**: Playwright Web自動化
5. **レッスン05**: 総まとめ & ツール作成

## 🔧 技術スタック

- **バックエンド**: Node.js + Express.js + SQLite3
- **フロントエンド**: Vanilla JavaScript + Apple風デザインシステム
- **認証**: JWT + bcrypt
- **デプロイ**: AWS EC2 + PM2
- **デザイン**: DESIGN_RULE.md準拠（WCAG 2.1対応）

## 📝 機能

- ユーザー認証とロール管理
- 学習進捗の追跡
- スライド形式のレッスン
- 実演課題の提出と管理
- 管理者ダッシュボード
- 自動スライド数検出
