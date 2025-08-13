# 🚀 セットアップガイド

## 📦 環境構築方法

### 方法1: GitHub Codespaces（推奨）

#### 🌟 メリット
- ✅ 環境構築不要（ブラウザのみ）
- ✅ 自動セットアップ
- ✅ 外部公開可能
- ✅ 無料枠利用可能（月120時間）

#### 📋 手順

1. **リポジトリにアクセス**
   ```
   https://github.com/kitasinkita/e-learning
   ```

2. **Codespacesを起動**
   - 緑の「Code」ボタンをクリック
   - 「Codespaces」タブを選択
   - 「Create codespace on main」をクリック

3. **自動セットアップ完了まで待機（2-3分）**
   - Node.js環境構築
   - 依存関係インストール（npm install）
   - データベース初期化（node setup.js）

4. **サーバー起動**
   ```bash
   npm start
   ```

5. **ポート公開設定**
   - VS Code下部の「PORTS」タブをクリック
   - ポート3000の行で右クリック
   - 「Port Visibility」→「Public」を選択

6. **アクセスURL取得**
   - ポート3000の地球アイコン🌐をクリック
   - 表示されるURLが外部公開アドレス

#### 🔗 アクセスURL形式
```
https://[ユーザー名]-[リポジトリ名]-[ランダム文字].app.github.dev/
```

---

### 方法2: ローカル環境

#### 📋 必要な環境
- Node.js 18以上
- npm
- Git

#### 🛠️ インストール手順

1. **リポジトリクローン**
   ```bash
   git clone https://github.com/kitasinkita/e-learning.git
   cd e-learning
   ```

2. **依存関係インストール**
   ```bash
   npm install
   ```

3. **データベース初期化**
   ```bash
   node setup.js
   ```

4. **サーバー起動**
   ```bash
   npm start
   ```

5. **アクセス**
   ```
   http://localhost:3000
   ```

#### 🌐 LAN公開（オプション）
同一ネットワーク内からアクセスする場合：
```bash
# IPアドレスを確認
ipconfig getifaddr en0  # macOS
ipconfig                # Windows

# ブラウザでアクセス
http://[IPアドレス]:3000
```

---

### 方法3: その他のクラウドサービス

#### Render（推奨）
1. GitHubアカウントでRenderにログイン
2. 「New Web Service」を選択
3. GitHubリポジトリを連携
4. 以下の設定：
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. デプロイ完了まで待機

#### Railway
1. GitHubアカウントでRailwayにログイン
2. 「Deploy from GitHub repo」を選択
3. リポジトリを選択してデプロイ

---

## 🔧 初期設定

### 管理者アカウント
```
社員ID: ADMIN001
パスワード: admin123
```

### テストユーザー
```
伊藤: EMP001 / password123
柳沢: EMP002 / password123
渡辺: EMP003 / password123
北川: EMP004 / password123
```

### データベースリセット
```bash
# データベースを削除して再初期化
rm elearning.db
node setup.js
```

---

## 📂 フォルダ構成確認

セットアップ後、以下の構成になっていることを確認：

```
e-learning/
├── 📄 server.js              # メインサーバー
├── 📄 setup.js              # DB初期化
├── 📄 package.json          # 依存関係
├── 📁 public/               # フロントエンド
│   ├── login.html
│   ├── student-dashboard.html
│   └── admin-dashboard.html
├── 📁 slides/               # ⚠️ 要確認
│   ├── lesson1_slides.html  # 必須
│   ├── lesson2_slides.html  # 作成要
│   ├── lesson3_slides.html  # 作成要
│   ├── lesson4_slides.html  # 作成要
│   └── lesson5_slides.html  # 作成要
├── 📁 .devcontainer/        # Codespaces設定
└── 📊 elearning.db         # SQLiteDB
```

---

## ✅ 動作確認

### 1. ログイン機能
- [ ] 管理者ログイン（ADMIN001）
- [ ] 受講者ログイン（EMP001）
- [ ] 無効な認証情報でのエラー確認

### 2. 受講者機能
- [ ] ダッシュボード表示
- [ ] レッスン1開始
- [ ] 進捗の保存確認
- [ ] 実演記録提出

### 3. 管理者機能
- [ ] 管理者ダッシュボード表示
- [ ] ユーザー一覧確認
- [ ] 学習進捗確認
- [ ] 統計情報確認

### 4. システム機能
- [ ] 自動ログアウト（8時間後）
- [ ] スライド数自動検出
- [ ] レスポンシブデザイン

---

## 🚨 よくある問題と解決策

### Codespacesでサーバーが起動しない
```bash
# ターミナルで順番に実行
npm install
node setup.js
npm start
```

### ログイン時に通信エラー
server.jsのCORS設定を確認：
```javascript
app.use(cors({
    origin: true,
    credentials: true
}));
```

### スライドが表示されない
slidesフォルダとファイルを作成：
```bash
mkdir -p ../slides
touch ../slides/lesson1_slides.html
# 他のレッスンファイルも同様に作成
```

### ポートが公開されない
1. PORTSタブでVisibilityをPublicに設定
2. Codespacesを再起動
3. 別のポート（3001など）を試す

---

## 📞 サポート

### GitHub Issues
問題や要望は以下で報告：
```
https://github.com/kitasinkita/e-learning/issues
```

### 緊急時の対応
1. Codespacesの再起動
2. ローカル環境での動作確認
3. データベースの再初期化

---

## 🔐 セキュリティ注意事項

### 本番環境での変更必須項目
1. **JWT_SECRET**の変更
2. **管理者パスワード**の変更
3. **テストユーザー**の削除または変更
4. **HTTPS**の強制設定

### 推奨設定
```javascript
// 本番環境用の環境変数
process.env.JWT_SECRET = 'your-secure-secret-key';
process.env.ADMIN_PASSWORD = 'your-secure-admin-password';
```