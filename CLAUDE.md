# 🤖 SmartLearn Pro 開発ガイド

## 📋 プロジェクト概要

SmartLearn Pro（旧Claude Code eラーニングシステム）の開発・保守において、Claude Codeを効果的に活用するためのガイドです。

**プロジェクト名**: SmartLearn Pro - カスタマイズ型eラーニングシステム  
**開発元**: AI研修法人  
**コンセプト**: スライド差し替えだけで、あらゆる業界・職種の研修に対応可能な汎用eラーニングプラットフォーム

### プロジェクト構成
```
smartlearn-pro/
├── server.js                    # Express.js メインサーバー
├── setup.js                     # SQLite DB初期化スクリプト
├── auto-deploy.sh               # AWS自動デプロイスクリプト
├── package.json                 # Node.js依存関係
├── public/                      # フロントエンド（HTML/CSS/JS）
│   ├── login.html              # ログイン画面
│   ├── student-dashboard.html  # 受講者ダッシュボード
│   └── admin-dashboard.html    # 管理者ダッシュボード
├── slides/                      # レッスンスライド（HTML）
│   ├── lesson1_slides.html     # レッスン1: Claude Code入門（デモ例）
│   ├── lesson2_slides.html     # レッスン2: 基本操作
│   ├── lesson3_slides.html     # レッスン3: MCP連携
│   ├── lesson4_slides.html     # レッスン4: Playwright
│   ├── lesson5_slides.html     # レッスン5: 総まとめ
│   ├── lesson6_slides.html     # レッスン6: AWS EC2デプロイ実践
│   ├── lesson7_slides.html     # レッスン7: Claude Code実践 iOSアプリ開発（PDF）
│   ├── lesson8_slides.html     # レッスン8: Flutter + Claude Code開発環境構築
│   └── system-overview.html    # システム概要（営業資料）
├── elearning.db                # SQLiteデータベース
├── CLAUDE.md                    # 本ファイル（開発ガイド）
└── docs/                       # その他ドキュメント類
    ├── TECHNICAL_SPEC.md
    ├── SETUP_GUIDE.md
    └── TROUBLESHOOTING.md
```

### 技術スタック
- **バックエンド**: Node.js + Express.js + SQLite3
- **認証**: JWT + bcrypt
- **フロントエンド**: Vanilla JavaScript + HTML/CSS
- **デプロイ**: AWS EC2 (52.195.12.32) / GitHub Codespaces

### 🌐 本番環境・デプロイ情報

#### AWS EC2本番サーバー
- **サーバーIP**: 52.195.12.32
- **アクセスURL**: http://52.195.12.32:3000
- **SSH接続**: `ssh -i "$HOME/elearning-key.pem" ubuntu@52.195.12.32`
- **ファイルアップロード**: `scp -i "$HOME/elearning-key.pem" ファイル名 ubuntu@52.195.12.32:/var/www/elearning/`
- **SSHキー**: $HOME/elearning-key.pem (既存キー、**必ず使用**、新規作成禁止)
- **サーバーパス**: /var/www/elearning (アプリケーションディレクトリ)

#### デプロイ方法
1. **Git経由（推奨）**:
   ```bash
   ssh -i "$HOME/elearning-key.pem" ubuntu@52.195.12.32 "cd /var/www/elearning && git pull origin main"
   ```

2. **自動デプロイスクリプト**:
   ```bash
   ./auto-deploy.sh  # 初回セットアップ時のみ
   ```

3. **個別ファイルアップロード**:
   ```bash
   scp -i "$HOME/elearning-key.pem" ./slides/new-file.html ubuntu@52.195.12.32:/var/www/elearning/slides/
   ```

#### デフォルトアカウント
- **管理者**: ADMIN001 / admin123
- **受講者**: EMP001 (伊藤) / password123
- **受講者**: EMP002 (柳沢) / password123  
- **受講者**: EMP003 (渡辺) / password123

#### GitHub連携
- **リポジトリ**: https://github.com/kitasinkita/e-learning.git
- **ブランチ**: main
- **重要**: 新機能開発後は必ずGitHubにプッシュしてからAWSに反映

---

## 🚀 Claude Codeでの開発フロー

### 🔧 必須：プロジェクト開始時のセットアップ

```bash
# 1. プロジェクトクローン
git clone https://github.com/kitasinkita/e-learning.git
cd e-learning

# 2. 依存関係インストール
npm install

# 3. データベース初期化
node setup.js

# 4. 開発サーバー起動
npm start
```

**重要**: 初回起動後は http://localhost:3000 でローカル環境をテスト

### 📋 開始前チェックリスト

#### Claude Code使用時の必須確認事項
- [ ] CLAUDE.mdを読み込み済み
- [ ] プロジェクトのコンセプト理解（SmartLearn Pro = カスタマイズ型システム）
- [ ] AWS接続情報確認（SSH鍵: $HOME/elearning-key.pem）
- [ ] GitHubリポジトリ接続確認
- [ ] ローカル開発環境動作確認

#### 新機能開発時の流れ
1. **要件確認**: カスタマイズ性を損なわない設計か確認
2. **ローカル開発**: npm start で開発環境起動
3. **テスト**: simple-e2e-test.js実行
4. **Git管理**: add → commit → push
5. **AWS反映**: ssh経由でgit pull実行
6. **動作確認**: http://52.195.12.32:3000で本番確認

### 2. 開発時の基本コマンド

```bash
# サーバー起動（開発用）
npm start

# データベースリセット
rm elearning.db && node setup.js

# 依存関係更新
npm update

# テスト実行
node simple-e2e-test.js
```

---

## 💡 Claude Codeプロンプト例

### 新機能開発

#### レッスンスライド作成
```
レッスン2「基本操作 & GitHub入門」のスライドを作成してください。

要件:
- レッスン1と同じデザイン・構造を維持
- 11-12スライド構成
- Claude Codeの効果的なプロンプト技法
- GitHub基本操作（clone, commit, push）
- VS Code + GitHub統合ワークフロー
- 実習課題2つ含む

ファイル: ../slides/lesson2_slides.html
```

#### API機能追加
```
学習時間の詳細統計APIを追加してください。

要件:
- エンドポイント: GET /api/admin/time-stats
- 管理者権限必須
- レスポンス: ユーザー別・レッスン別学習時間
- 日別・週別・月別の集計機能
- 既存のserver.jsに追加

参考: 既存のprogressテーブルのtime_spentカラムを活用
```

### バグ修正・改善

#### CORS問題修正
```
ログイン時の「サーバーとの通信に失敗」エラーを修正してください。

現象:
- GitHub Codespacesで不定期に発生
- ローカル環境では問題なし
- CORSエラーと思われる

調査・修正対象:
- server.jsのCORS設定
- フロントエンドのAPI呼び出し
- 環境別設定の分離

既存ファイル: server.js, public/login.html
```

#### レスポンシブ対応
```
管理者ダッシュボードのモバイル表示を改善してください。

問題:
- テーブルが横にはみ出る
- ボタンが小さくて押しにくい
- フォントサイズが不適切

対象ファイル: public/admin-dashboard.html
要件: 768px以下でのレイアウト最適化
```

### データベース操作

#### テーブル設計変更
```
notifications テーブルを新規追加してください。

要件:
- ユーザーへの通知機能
- 既存のusersテーブルと関連付け
- 未読・既読管理
- 通知タイプ（レッスン完了、実演レビュー等）

setup.jsに追加してマイグレーション対応も含めて
```

---

## 🔧 よく使用する修正パターン

### 1. 新しいレッスン追加

```
レッスン6「Python AI開発入門」を追加してください。

作業内容:
1. slides/lesson6_slides.html作成
2. student-dashboard.htmlのlessons配列に追加
3. server.jsのスライド数検出対応
4. setup.jsのサンプルデータ追加

要件:
- 既存レッスンと同じ構造
- 新しい実演課題2つ
- 15スライド程度
```

### 2. UI/UX改善

```
ダッシュボードのユーザビリティを改善してください。

改善点:
- 読み込み中のローディング表示
- エラーメッセージの分かりやすさ
- ボタンのホバー効果強化
- 進捗バーの視認性向上

対象: public/student-dashboard.html, public/admin-dashboard.html
```

### 3. セキュリティ強化

```
ログイン機能のセキュリティを強化してください。

実装内容:
- パスワード強度チェック
- ログイン試行回数制限
- セッションタイムアウト警告
- CSRF対策

対象ファイル: server.js, public/login.html
```

---

## 📊 開発時の注意点

### 1. データベース操作
- **必ずバックアップ**: `cp elearning.db backup.db`
- **マイグレーション**: 既存データ保持を考慮
- **テスト環境**: 本番データを直接触らない

### 2. フロントエンド開発
- **認証チェック**: 全ページで`checkAuth()`実行
- **エラーハンドリング**: ユーザーフレンドリーなメッセージ
- **レスポンシブ**: モバイル・タブレット対応

### 3. API設計
- **認証必須**: `authenticateToken`ミドルウェア使用
- **エラーレスポンス**: 統一されたフォーマット
- **ログ出力**: デバッグ用のconsole.log追加

---

## 🧪 テスト・デバッグ

### 開発用プロンプト

```
このコードをテストしてください。

テスト項目:
1. 正常系: 期待される動作確認
2. 異常系: エラーハンドリング確認
3. セキュリティ: 認証・認可の確認
4. パフォーマンス: 大量データでの動作

テストファイル: simple-e2e-test.js を拡張
```

### デバッグ支援

```
以下のエラーの原因を調査して修正してください。

エラーメッセージ: [エラー内容をペースト]
発生タイミング: [操作手順]
環境: GitHub Codespaces / ローカル
ブラウザ: Chrome/Safari/Firefox

関連ファイルを確認して根本原因を特定してください。
```

---

## 📈 パフォーマンス最適化

### Claude Codeでの最適化依頼

```
システムのパフォーマンスを改善してください。

調査・改善対象:
1. SQLクエリの最適化
2. フロントエンドのJavaScript処理
3. 画像・CSS最適化
4. キャッシュ戦略

現在の問題:
- ダッシュボード読み込みが遅い
- 大量ユーザー時のレスポンス低下

目標: 3秒以内での画面表示
```

---

## 🔒 セキュリティチェックリスト

### セキュリティ監査プロンプト

```
セキュリティ監査を実施してください。

チェック項目:
□ SQLインジェクション対策
□ XSS（クロスサイトスクリプティング）対策
□ CSRF対策
□ 認証・認可の実装
□ パスワードハッシュ化
□ セッション管理
□ 入力値検証
□ エラー情報の漏洩防止

問題があれば修正案も提示してください。
```

---

## 📚 ドキュメント更新

### ドキュメント生成プロンプト

```
新機能のドキュメントを更新してください。

更新対象:
- TECHNICAL_SPEC.md: API仕様追加
- SETUP_GUIDE.md: 新しい設定手順
- TROUBLESHOOTING.md: 新しい問題と解決策

変更内容: [機能変更の詳細]
```

---

## 🚀 デプロイ・運用

### デプロイ支援

```
本番環境へのデプロイを準備してください。

作業内容:
1. 環境変数設定ファイル作成
2. 本番用設定の分離
3. デプロイスクリプト作成
4. ヘルスチェック機能追加

デプロイ先: Render / Railway / Vercel
```

### 運用監視

```
システム監視機能を追加してください。

実装内容:
- ログ機能強化
- エラー通知機能
- パフォーマンス計測
- ユーザー行動分析

目的: 安定運用とユーザー体験向上
```

---

## 🤝 チーム開発

### コードレビュー依頼

```
以下のコードをレビューしてください。

レビュー観点:
1. コード品質・可読性
2. セキュリティ
3. パフォーマンス
4. 既存コードとの一貫性
5. テストカバレッジ

ファイル: [変更したファイルを指定]
```

### リファクタリング

```
既存コードをリファクタリングしてください。

目的:
- 保守性向上
- 重複コード削減
- モジュール化
- TypeScript化検討

対象: server.js（500行超のため分割）
```

---

## 📝 コード生成テンプレート

### 新API追加テンプレート

```
以下の仕様でAPIを追加してください。

エンドポイント: [HTTPメソッド] /api/[パス]
認証: 必要/不要
パラメータ: [リクエスト形式]
レスポンス: [レスポンス形式]
処理内容: [具体的な処理]

既存のserver.jsに追加し、エラーハンドリングも含めてください。
```

### 新画面追加テンプレート

```
以下の仕様で新しい画面を作成してください。

画面名: [画面名]
URL: [パス]
機能: [画面の機能説明]
レイアウト: 既存のadmin-dashboard.htmlと同じデザイン
認証: 必要
API連携: [使用するAPI]

HTMLファイル作成とserver.jsルート追加をお願いします。
```

---

## 🔄 定期メンテナンス

### 月次メンテナンス

```
月次メンテナンスを実施してください。

作業内容:
1. 依存関係の更新（セキュリティパッチ含む）
2. ログファイルのローテーション
3. データベースの最適化
4. 不要ファイルの削除
5. バックアップの確認

npm audit も実行してセキュリティチェックしてください。
```

---

## 🚨 開発履歴・トラブルシューティング記録

### 📅 開発履歴

### 2025-08-13 SmartLearn Pro への名称変更・カスタマイズ対応強化

#### 主要変更内容
1. **システム名変更**: Claude Code eラーニング → SmartLearn Pro
2. **コンセプト変更**: 特定用途システム → カスタマイズ型汎用プラットフォーム
3. **営業資料作成**: system-overview.html（6スライド構成）
4. **業界対応例追加**: 飲食店、税理士事務所、医療機関、小売業、製造業、一般企業

#### ファイル変更
- `slides/system-overview.html`: 新規作成（営業用プレゼンテーション）
- `public/login.html`: システム概要へのリンク追加
- `CLAUDE.md`: 包括的な開発ガイドに改訂

#### 技術メモ
- スライド差し替えによる完全カスタマイズ対応
- 既存機能はそのままに汎用性を拡張
- AWS本番環境も正常に反映済み

### 2025-08-13 進捗表示バグ修正作業

#### 発見された問題
1. **進捗表示110%バグ**: 全ユーザーで「01 Claude Code入門」が110%表示
2. **ユーザー別進捗未反映**: 伊藤、柳沢、渡辺が全員同じ進捗値
3. **スライドファイル不在**: `/slides/`ディレクトリが空でスライド閲覧不可

#### 根本原因分析
- **API不整合**: `/api/lesson/1/slide-count`が404エラー返却
- **パス設定ミス**: server.js:113行目で`../slides`を指定（正しくは`./slides`）
- **デフォルト値問題**: フロントエンドが`totalSlides=10`、実際は15スライド
- **サンプルデータ**: 全ユーザーで`last_slide=11`の同一進捗データ

#### 実施した修正
1. **server.js修正**:
   ```javascript
   // 修正前: path.join(__dirname, '../slides', ...)
   // 修正後: path.join(__dirname, 'slides', ...)
   
   // エラー時のデフォルト値追加
   const defaultSlideCounts = { 1: 15, 2: 12, 3: 14, 4: 13, 5: 16 };
   ```

2. **データベース調整**:
   ```sql
   -- ユーザー別の差分進捗データ作成
   UPDATE progress SET last_slide = CASE 
     WHEN user_id = 2 THEN 8   -- EMP001: 53%
     WHEN user_id = 3 THEN 12  -- EMP002: 80%  
     WHEN user_id = 4 THEN 5   -- EMP003: 33%
   END WHERE lesson_id = 1;
   ```

3. **スライドファイル追加**: `/slides/`ディレクトリにlesson1-5_slides.html配置

#### 最終状態（リセット実行）
- **ユーザーアカウント**: 保持（EMP001/EMP002/EMP003 + ADMIN001）
- **学習履歴**: 完全リセット（progress, demonstrations = 0件）
- **動作状況**: 0からの挙動テスト可能

#### 技術メモ
- スライド数カウント: `grep -c 'slide-container' filename.html`
- サーバー再起動時は`lsof -ti:3000 | xargs kill`でポート解放
- API応答例: `{"lessonId":1,"totalSlides":15}`

#### 今後の注意点
1. スライドファイル追加時はサーバー再起動必須
2. 進捗データ変更時はブラウザ強制リロード推奨
3. E2Eテストは Playwright MCP 推奨

### 2025-08-18 Apple風デザインシステム適用・AWS本番反映

#### 主要変更内容
1. **デザインシステム統一**: DESIGN_RULE.md準拠のApple風デザイン適用
2. **プライマリカラー変更**: #34495e系 → #3B82F6 (blue-500) 系
3. **アクセシビリティ向上**: WCAG 2.1準拠のコントラスト比・タッチターゲット
4. **レスポンシブ強化**: モバイル・タブレット最適化
5. **AWS本番環境反映**: SSH接続問題解決後の完全デプロイ

#### ファイル変更
- `DESIGN_RULE.md`: 新規作成（540行のApple風デザインガイドライン）
- `public/login.html`: 完全リデザイン（Apple風UI/UX）
- `public/student-dashboard.html`: デザインシステム適用
- `public/admin-dashboard.html`: 管理画面UI刷新

#### 技術的改善
- **8pxベース余白システム**: 一貫したスペーシング
- **角丸統一**: rounded-lg(8px), rounded-xl(12px), rounded-2xl(16px), rounded-3xl(24px)
- **影システム**: shadow-sm, shadow-md, shadow-xl
- **カラーシステム**: プライマリ・グレースケール・システムカラーの体系化
- **タイポグラフィ**: font-semibold以上、適切な行間設定

#### AWS反映トラブルシューティング
**問題**: SSH接続タイムアウト（Operation timed out）
**原因**: セキュリティグループのIP制限（22番ポート）
- 許可IP: 122.210.79.154/32, 103.5.140.137/32
- 現在IP: 223.132.9.11 → 許可リストに追加必要

**解決手順**:
1. 現在IPをセキュリティグループに追加
2. SSH接続確認: `ssh -i '/Users/sk/elearning-key.pem' ubuntu@52.195.12.32`
3. git pull実行: `cd /var/www/elearning && git pull origin main`
4. PM2再起動: `pm2 restart elearning`

#### 最終確認結果
- **全ページタイトル更新**: "SmartLearn Pro" に統一 ✅
- **Apple風デザイン反映**: プライマリカラー #3B82F6 確認 ✅
- **レスポンシブ動作**: モバイル・デスクトップ対応 ✅
- **本番環境**: http://52.195.12.32:3000 正常動作 ✅

#### デプロイコマンド（今後用）
```bash
# ローカル → GitHub
git add . && git commit -m "変更内容" && git push origin main

# GitHub → AWS（IP許可済み前提）
ssh -i '/Users/sk/elearning-key.pem' ubuntu@52.195.12.32 \
  "cd /var/www/elearning && git pull origin main && pm2 restart elearning"
```

#### 今後の注意点
1. **SSH接続**: IP変更時はセキュリティグループ更新必須
2. **デザイン追加**: DESIGN_RULE.md準拠を維持
3. **デプロイ**: 必ずGitHub → AWS の順序で実行
4. **動作確認**: デプロイ後は必ず本番環境での確認実施

---

### 2025-10-23 レッスン7追加: PDF.jsによるPDFスライド表示機能

#### 主要変更内容
1. **PDFスライド表示システム実装**: Mozilla PDF.jsを使用したPDFレンダリング機能
2. **レッスン7追加**: 「Claude Code実践: iOSアプリ開発」（Oikonさんのプレゼン資料）
3. **25ページ対応**: PDFの各ページをスライド形式で表示
4. **既存システムとの統合**: 進捗管理・完了機能の完全対応

#### ファイル変更
- `slides/lesson7_slides.html`: 新規作成（PDF.jsベースのビューア）
- `slides/claude-code-presentation.pdf`: 追加（17.4MB、25ページ）
- `public/student-dashboard.html`: レッスン7を配列に追加
- `server.js`: デフォルトスライド数に `7: 25` を追加

#### 技術実装
- **PDF.js CDN**: v3.11.174（worker含む）
- **Canvas レンダリング**: scale 2.0 で高解像度表示
- **ナビゲーション**: ←→キー対応、進捗バー、ページカウンター
- **進捗管理**: 既存APIとの完全互換（`/api/progress`, `/api/progress/complete`）
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応

#### デプロイ状況
- **GitHub**: ✅ プッシュ完了（commit: 1ccbf79）
- **AWS EC2**: ⚠️ SSH接続不可（IP制限）
  - 現在IP: `153.161.216.163`
  - HTTP (3000): ✅ アクセス可能
  - SSH (22): ❌ タイムアウト（セキュリティグループで要IP追加）

#### AWS反映手順（未実施）
```bash
# AWSコンソールまたは許可済みIPから実行
ssh -i "$HOME/elearning-key.pem" ubuntu@52.195.12.32 \
  "cd /var/www/elearning && git pull origin main && pm2 restart elearning"
```

または、**AWS EC2 Instance Connect** / **Session Manager** から：
```bash
cd /var/www/elearning
git pull origin main
pm2 restart elearning
```

#### 技術メモ
- PDF.jsはスライド数カウント対象外（`slide-container`クラスなし）
- `totalSlides: 25` を student-dashboard.html で固定値設定
- PDFファイルサイズ大（17.4MB）→ 初回ロード時間に注意
- 既存のHTML形式レッスンと共存可能

#### 今後の拡張案
- [ ] PDF圧縮・最適化（ファイルサイズ削減）
- [ ] ページサムネイル表示
- [ ] 検索機能（PDF内テキスト）
- [ ] アノテーション機能
- [ ] 他のPDF資料も同様の方式で追加可能

---

### 2025-11-06 レッスン8追加: Flutter + Claude Code開発環境構築

#### 主要変更内容
1. **Flutter環境セットアップマニュアル追加**: AI支援によるクロスプラットフォームアプリ開発
2. **レッスン8追加**: 「Flutter + Claude Code開発環境構築」（23スライド構成）
3. **HTMLスライド形式**: 既存レッスンと同様のスライド形式で実装
4. **Mac/Windows両対応**: プラットフォーム別のセットアップ手順を網羅

#### ファイル変更
- `slides/lesson8_slides.html`: 新規作成（Flutter環境セットアップマニュアル、23スライド）
- `public/student-dashboard.html`: レッスン8を配列に追加
- `server.js`: デフォルトスライド数に `8: 23` を追加
- `server.js`: スライド検出ロジック改善（`class="slide"`にも対応）

#### レッスン8の内容
1. **Flutter SDKインストール**: Mac（Homebrew/公式サイト）、Windows（ZIPダウンロード）
2. **Android Studioセットアップ**: 初期設定、Android SDK、Command-line Tools
3. **プラグイン設定**: Flutter & Dartプラグインインストール
4. **SDKライセンス承認**: flutter doctor --android-licenses
5. **環境確認**: flutter doctor -v での動作確認
6. **Androidエミュレータ作成**: Pixel 7エミュレータ設定
7. **VS Code設定**: Flutter拡張機能 + Claude Code連携
8. **プロジェクト作成**: flutter create による初回プロジェクト生成
9. **Claude Codeでアプリ開発**: AI支援による実践的な開発手法
10. **ホットリロード**: 高速開発サイクルの活用
11. **トラブルシューティング**: よくあるエラーと解決方法

#### 実演課題
- **Flutter環境セットアップ**: 開発環境の完全構築
- **最初のFlutterアプリ作成**: Claude Codeを使った初回アプリ開発

#### 技術実装
- **HTMLスライド形式**: `class="slide"` を使用した23スライド構成
- **プラットフォームバッジ**: Mac/Windows/両対応の視覚的な区別
- **コードブロック**: ターミナルコマンドの明確な表示
- **注意喚起ボックス**: note（黄）、success（緑）、warning（赤）、info（青）
- **レスポンシブ対応**: モバイル・タブレット・デスクトップ最適化

#### デプロイ状況
- **GitHub**: ✅ プッシュ完了（commit: 7d07fa0）
- **AWS EC2**: ✅ デプロイ完了
  - git pull成功（3ファイル変更、976行追加）
  - PM2再起動完了
  - API確認: `/api/lesson/8/slide-count` → 23スライド正常取得
  - スライドアクセス: `/slides/lesson8_slides.html` → HTTP 200

#### スライド検出ロジック改善
```javascript
// 修正前: slide-containerのみ検出
const slideCount = (slideContent.match(/class="slide-container"/g) || []).length;

// 修正後: slide-containerとslideクラス両方に対応
const slideContainerCount = (slideContent.match(/class="slide-container"/g) || []).length;
const slideClassCount = (slideContent.match(/class="slide"/g) || []).length;
const slideCount = Math.max(slideContainerCount, slideClassCount);
```

#### 技術メモ
- スライド形式の違い: レッスン1-6は`slide-container`、レッスン8は`slide`クラス
- スライド数カウント: `grep -c 'class="slide"' filename.html` → 23スライド
- デフォルト値設定: server.jsで `8: 23` を明示的に設定
- サーバー再起動で即座に反映

#### 今後の展開
- [ ] 実際のFlutterアプリ開発実習（レッスン9検討）
- [ ] Flutter実践プロジェクト課題の追加
- [ ] iOSビルド対応手順の補足（Macユーザー向け）
- [ ] Flutter Web対応の説明追加
- [ ] パフォーマンス最適化手法の追加レッスン

---

### 2025-11-13 レッスン0追加: インターネットの歴史（日米比較）

#### 主要変更内容
1. **イントロダクション教材の追加**: Claude Code学習前の基礎知識習得用スライド
2. **レッスン0追加**: 「インターネットの歴史 - 日本とアメリカの比較」（21スライド構成）
3. **Reveal.js形式**: 既存スライドとは異なるプレゼンテーションフレームワークを採用
4. **TCP/IPからAI革命まで**: 1960年代から2020年代までのインターネット史を網羅

#### ファイル変更
- `slides/lesson0_slides.html`: 新規作成（Reveal.js形式、21スライド）
- `public/student-dashboard.html`: lessons配列の先頭にlesson 0を追加
- `server.js`: デフォルトスライド数に `0: 21` を追加
- `.gitignore`: 更新

#### レッスン0の内容
1. **前史（1960-70年代）**: TCP/IPの発明、ARPANET誕生
2. **黎明期（1980年代）**: パソコン通信の時代、日米の比較
3. **WWWの登場（1990年代前半）**: 商用インターネットの始まり
4. **ドットコムブーム（1990年代後半）**: Google創業、Yahoo! JAPAN、iモード
5. **ブロードバンド時代（2000年代前半）**: Web 2.0、mixi、YouTube
6. **モバイル革命（2000年代後半）**: iPhone登場、スマートフォン普及
7. **ソーシャルメディア成熟（2010年代）**: LINE、Instagram、TikTok
8. **AI革命（2020年代）**: ChatGPT、生成AI、LLM時代

#### 実演課題
- **インターネット年表理解**: 主要な技術・サービスの登場年と背景理解
- **TCP/IP基礎知識確認**: インターネットの基盤技術の理解確認

#### 技術実装
- **Reveal.js 4.5.0**: スライドプレゼンテーションフレームワーク
- **Adobe Spectrum Design System準拠**: 統一されたデザインシステム
- **21スライド構成**: `<section>`タグベース
- **閑話休題コーナー**: ARPANETの軍事起源、TCP/IP階層モデル、AIの歴史など
- **日米比較表**: 各時代における日本とアメリカの違いを可視化
- **レスポンシブ対応**: 1200x800px基準、スケーラブル設計

#### デプロイ状況
- **GitHub**: ✅ プッシュ完了（commit: 302c5fc）
  - 4ファイル変更、776行追加
- **AWS EC2**: ⚠️ SSH接続不可（IP制限）
  - 現在IP: `180.47.213.52`
  - HTTP (3000): ✅ アクセス可能
  - SSH (22): ❌ タイムアウト（セキュリティグループで要IP追加）

#### AWS反映手順（未実施）
```bash
# セキュリティグループで180.47.213.52/32を許可後
ssh -i "$HOME/elearning-key.pem" ubuntu@52.195.12.32 \
  "cd /var/www/elearning && git pull origin main && pm2 restart elearning"
```

または、**AWS Systems Manager Session Manager**から：
```bash
cd /var/www/elearning
git pull origin main
pm2 restart elearning
```

#### 技術メモ
- Reveal.jsスライドはserver.jsのスライド検出ロジックで正常にカウント可能
- スライド数カウント: `grep -c '<section' filename.html` → 21スライド
- Adobe Spectrum Design Systemとの整合性を考慮したデザイン
- 閑話休題セクションには丸みのあるGoogle Fontsを使用
- 既存のHTML形式スライド（lesson1-8）とReveal.js形式が共存可能

#### 今後の展開
- [ ] レッスン0完了後の学習フロー最適化
- [ ] 追加の導入教材検討（プログラミング基礎、Git基礎など）
- [ ] スライド内容の定期更新（最新技術動向の反映）

---

### 2025-11-20 レッスン8スライド更新: Claude Code指示例の改善

#### 主要変更内容
1. **Claude Code指示例の改善**: 環境構築済みを前提とした実践的な指示形式に変更
2. **受講者体験の向上**: より明確な開発タスクの提示
3. **即座の実践開始**: セットアップ手順をスキップしてアプリ開発に集中できる形式

#### ファイル変更
- `slides/lesson8_slides.html`: Slide 17の例1〜例4を修正

#### 変更内容詳細
**修正前の指示例:**
- 例1: 「ボタンを押すとカウントアップするシンプルなアプリを作って」
- 例2: 「タスクを追加・削除・完了できるTODOリストアプリを作って」
- 例3: 「スイカゲームのような落ちゲーを作って。果物でなく動物にして」
- 例4: 「四則演算ができる電卓アプリを作って」

**修正後の指示例:**
- 例1: 「FlutterとAndroid Studioはインストール済です。ボタンを押すとカウントアップするシンプルなアプリを作ってください」
- 例2: 「FlutterとAndroid Studioはインストール済です。タスクを追加・削除・完了できるTODOリストアプリを作ってください」
- 例3: 「FlutterとAndroid Studioはインストール済です。スイカゲームのような落ちゲーを作ってください。果物でなく動物にしてください」
- 例4: 「FlutterとAndroid Studioはインストール済です。四則演算ができる電卓アプリを作ってください」

#### デプロイ状況
- **GitHub**: ✅ プッシュ完了（commit: 941491e）
- **AWS EC2**: ✅ デプロイ完了
  - git pull成功（1ファイル変更、4行修正）
  - PM2再起動完了
  - 本番環境: http://52.195.12.32:3000/slides/lesson8_slides.html

#### 改善効果
1. **明確な前提条件の提示**: 受講者が環境セットアップ済みであることを明示
2. **Claude Codeへの効果的な指示**: AI支援ツールへの適切なコンテキスト提供
3. **実践的な学習体験**: セットアップではなくアプリ開発そのものに集中可能
4. **再現性の向上**: 同じ指示で一貫した結果が得られる

#### 技術メモ
- スライド17のアプリ開発例はClaude Codeのプロンプト例として機能
- 環境構築済みの前提を明示することで、Claude Codeが適切なコード生成を実行
- 受講者は例をそのままコピーしてClaude Codeに依頼可能

---

### 2025-11-27 AWS EC2インスタンス障害復旧

#### 発生した問題
- **発生日時**: 2025/11/26 23:32 GMT+9
- **症状**: インスタンスの接続性チェック失敗
- **影響**: SSH接続不可、HTTPアクセス不可、本番環境完全停止

#### 原因
- EC2インスタンス内部の障害（OS/ネットワーク系）
- 約12時間ダウン状態が継続

#### 復旧手順
1. AWSコンソールでインスタンスステータス確認
2. **インスタンスを再起動（Reboot）** を実行
3. ステータスチェックが緑になるまで待機（約2分）
4. SSH接続確認
5. PM2ステータス確認（自動起動で復旧済み）
6. HTTPアクセス確認

#### 復旧確認コマンド
```bash
# SSH接続テスト
ssh -i "$HOME/elearning-key.pem" ubuntu@52.195.12.32 "uptime"

# PM2ステータス確認
ssh -i "$HOME/elearning-key.pem" ubuntu@52.195.12.32 "pm2 status"

# HTTPアクセス確認
curl -s -o /dev/null -w "%{http_code}" http://52.195.12.32:3000/
```

#### 復旧結果
- **SSH接続**: 成功
- **PM2 (elearning)**: online（自動復旧）
- **HTTP (3000)**: 302（正常）
- **IPアドレス**: 変更なし（52.195.12.32）

#### 技術メモ
- **再起動(Reboot)** ではIPアドレスは変わらない
- **停止→起動(Stop→Start)** はElastic IPでない場合IPが変わる可能性あり
- PM2はシステム起動時に自動でアプリを起動する設定済み
- 接続性チェック失敗時はまず再起動を試す

#### 今後の対策検討
- [ ] CloudWatchアラームによる障害検知の自動化
- [ ] 定期的なヘルスチェック監視の導入
- [ ] 障害時の自動復旧（Auto Recovery）設定の検討

---

## 🎯 SmartLearn Pro カスタマイズガイド

### 🔄 新業界対応のスライド作成手順

#### 1. 要件ヒアリング用プロンプト
```
[業界名]向けの研修システムを構築したいと思います。

以下の情報を整理してください:
1. 業界の特徴・課題
2. 必要な研修内容（5-7項目）
3. 実演・実習で学ぶべきスキル
4. 評価・修了基準
5. 受講対象者（新人/中堅/管理職等）

この情報を基に、lesson1-5の構成でスライドを作成します。
```

#### 2. スライド作成用プロンプト
```
[業界名]向けの研修スライドを作成してください。

業界: [飲食店/税理士事務所/医療機関等]
レッスン数: 5レッスン
各レッスン: 12-15スライド構成

要件:
- 既存のlesson1_slides.htmlと同じHTML構造
- 業界特有の用語・手順を含む
- 実演課題2つ/レッスン
- ビジュアル重視（絵文字・色分け活用）

ファイル名: slides/[業界名]_lesson[1-5]_slides.html
```

#### 3. システム設定変更用プロンプト
```
新しい研修コースを追加してください。

作業内容:
1. student-dashboard.htmlのlessons配列更新
2. server.jsのルート追加
3. setup.jsのサンプルデータ追加（新業界用ユーザー）
4. admin-dashboard.htmlに新コース管理機能追加

既存のClaude Code研修はデモとして残し、新研修を並行運用します。
```

### 🏢 営業・提案資料の活用

#### system-overview.html の使い方
1. **ログインページから**: 「システムの特徴・導入効果はこちら」リンク
2. **営業プレゼン**: 6スライド構成で顧客にシステム概要説明
3. **カスタマイズ事例**: 業界別対応例を具体的に提示

#### 提案時のポイント
- スライド差し替えだけで即導入可能
- 初月無料・導入サポート付き
- 従来研修費の1/10以下のコスト
- リアルタイム進捗管理機能

---

## ⚠️ 重要な注意事項・制約

### 絶対に守るべきルール
1. **SSH鍵**: `$HOME/elearning-key.pem`以外は使用禁止
2. **新機能開発**: カスタマイズ性を損なわない設計必須
3. **本番反映**: 必ずGitHub → AWS の順序で実行
4. **データベース**: 本番データの直接操作禁止
5. **セキュリティ**: 認証なしのエンドポイント追加禁止

### Claude Code使用時の注意
- CLAUDE.mdを必ず最初に読み込む
- 新しいSSH鍵を作成しようとした場合は即座に制止
- プロジェクトコンセプト（カスタマイズ型）を常に意識
- 既存機能を壊さない増分開発を心がける

---

## 🚀 今後の開発ロードマップ

### Phase 1: 基盤強化（完了）
- ✅ カスタマイズ型システムへの転換
- ✅ 営業資料・デモ環境整備
- ✅ AWS本番環境安定化

### Phase 2: 機能拡張（予定）
- [ ] 複数コース同時運用機能
- [ ] 業界テンプレート管理システム
- [ ] 自動スライド生成AI機能
- [ ] 詳細分析・レポート機能

### Phase 3: スケール対応（将来）
- [ ] マルチテナント対応
- [ ] 大規模ユーザー対応
- [ ] 外部システム連携API
- [ ] モバイルアプリ対応

---

このCLAUDE.mdを参考に、SmartLearn Proの開発を効率的に進めてください。プロジェクト開始時は必ず「📋 開始前チェックリスト」を確認し、具体的な状況に応じてプロンプトをカスタマイズしてご利用ください。