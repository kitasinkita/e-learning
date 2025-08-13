# 🔧 トラブルシューティングガイド

## 🚨 緊急対応

### システム全体が動かない場合
1. **Codespacesの再起動**
   - ブラウザタブを閉じる
   - GitHub → Codespaces → Restart

2. **ローカル環境での確認**
   ```bash
   git clone https://github.com/kitasinkita/e-learning.git
   cd e-learning
   npm install && node setup.js && npm start
   ```

3. **データベースリセット**
   ```bash
   rm elearning.db
   node setup.js
   npm start
   ```

---

## 🌐 アクセス・接続エラー

### 「ページが表示されません」「502 Bad Gateway」
**原因**: サーバーが起動していない

**解決方法**:
```bash
# 1. プロセス確認
ps aux | grep node

# 2. サーバー起動
npm start

# 3. ポート確認
netstat -an | grep 3000
```

### 「CORS policy」エラー
**原因**: クロスオリジン設定の問題

**解決方法**:
1. server.jsを編集
```javascript
app.use(cors({
    origin: true,
    credentials: true
}));
```

2. サーバー再起動
```bash
# Ctrl+C でサーバー停止
npm start
```

### 「Connection refused」エラー
**原因**: ポート設定の問題

**解決方法**:
1. **Codespacesの場合**
   - PORTSタブでPort 3000のVisibilityをPublicに変更
   - 地球アイコンをクリックしてURLを確認

2. **ローカルの場合**
   ```bash
   # 別のポートで起動
   PORT=3001 npm start
   ```

---

## 🔐 認証・ログインエラー

### 「サーバーとの通信に失敗しました」
**原因**: API通信の問題

**解決方法**:
1. **ブラウザのコンソールを確認**
   - F12 → Console → エラーメッセージを確認

2. **URLの確認**
   ```javascript
   // フロントエンドでAPIベースURLを確認
   console.log(window.location.origin);
   ```

3. **ネットワークタブの確認**
   - F12 → Network → ログイン時のリクエストを確認

### 「無効なトークンです」
**原因**: JWT認証の問題

**解決方法**:
```bash
# 1. ローカルストレージをクリア
localStorage.clear();

# 2. ページをリロード

# 3. 再ログイン
```

### ログイン後すぐにログアウトされる
**原因**: トークンの期限切れ

**解決方法**:
1. server.jsでトークン期限を確認
```javascript
// 現在: 8時間
{ expiresIn: '8h' }

// 延長する場合
{ expiresIn: '24h' }
```

---

## 📊 データベース関連エラー

### 「Database is locked」
**原因**: SQLiteファイルがロックされている

**解決方法**:
```bash
# 1. サーバー停止
# Ctrl+C

# 2. プロセス確認・終了
ps aux | grep node
kill [プロセスID]

# 3. データベースファイル削除・再作成
rm elearning.db
node setup.js
npm start
```

### 「Table doesn't exist」
**原因**: データベース初期化未完了

**解決方法**:
```bash
# データベース再初期化
node setup.js
```

### ユーザーデータが消える
**原因**: データベースファイルの場所の問題

**解決方法**:
```bash
# 1. データベースファイル場所確認
ls -la elearning.db

# 2. バックアップ作成
cp elearning.db elearning_backup.db

# 3. 相対パス確認
pwd
```

---

## 🎨 フロントエンド表示エラー

### 「読み込み中...」が消えない
**原因**: API通信の失敗

**解決方法**:
1. **コンソールエラー確認**
   ```javascript
   // F12でコンソールを開いて確認
   ```

2. **API URLの確認**
   ```javascript
   // student-dashboard.htmlで確認
   console.log(API_BASE); // 正しいURLが表示されるか
   ```

### スライドが表示されない
**原因**: slidesフォルダまたはファイルが存在しない

**解決方法**:
```bash
# 1. フォルダ確認
ls -la ../slides/

# 2. フォルダ作成
mkdir -p ../slides

# 3. レッスンファイル作成
touch ../slides/lesson1_slides.html
touch ../slides/lesson2_slides.html
touch ../slides/lesson3_slides.html
touch ../slides/lesson4_slides.html
touch ../slides/lesson5_slides.html

# 4. lesson1にコンテンツをコピー
# （既存のlesson1_slides.htmlの内容をコピー）
```

### 進捗が保存されない
**原因**: JWT認証の問題

**解決方法**:
1. **トークン確認**
   ```javascript
   // ブラウザコンソールで確認
   console.log(localStorage.getItem('token'));
   ```

2. **API通信確認**
   ```javascript
   // NetworkタブでPOST /api/progressの結果を確認
   ```

---

## 📱 モバイル・レスポンシブ問題

### モバイルで表示が崩れる
**解決方法**:
```css
/* 緊急修正用CSS */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
    }
    .lessons-grid {
        grid-template-columns: 1fr;
    }
}
```

### タッチ操作が効かない
**解決方法**:
```css
/* タッチ対応強化 */
button, .btn {
    min-height: 44px;
    min-width: 44px;
}
```

---

## ⚡ パフォーマンス問題

### 読み込みが遅い（Codespaces）
**原因**: 
- Codespaces起動直後
- 無料プランの制限

**解決方法**:
1. **5分程度待機**（初回セットアップ）
2. **キャッシュクリア**
   - Ctrl+Shift+R (ハードリロード)
3. **別の時間帯に試行**

### メモリ不足エラー
**解決方法**:
```bash
# Node.jsメモリ制限を増やす
node --max-old-space-size=4096 server.js
```

---

## 🔍 デバッグ方法

### フロントエンドデバッグ
```javascript
// コンソールで実行
console.log('Current user:', currentUser);
console.log('Progress data:', progressData);
console.log('API Base:', API_BASE);
```

### バックエンドデバッグ
```javascript
// server.jsに追加
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});
```

### ネットワーク通信確認
1. **F12 → Network**
2. **ログイン操作を実行**
3. **失敗したリクエストを確認**
4. **Response/Headers/Payloadを確認**

---

## 📞 エスカレーション

### 解決できない場合
1. **GitHub Issuesで報告**
   ```
   https://github.com/kitasinkita/e-learning/issues
   ```

2. **必要な情報**
   - エラーメッセージ（スクリーンショット）
   - ブラウザのコンソールログ
   - 実行環境（Codespaces/ローカル）
   - 再現手順

3. **緊急時の代替案**
   - ローカル環境での一時運用
   - 他のホスティングサービス（Render等）の利用

---

## 🔄 システム復旧手順

### 完全初期化（最終手段）
```bash
# 1. 全データバックアップ
cp elearning.db backup_$(date +%Y%m%d).db

# 2. 完全削除
rm -rf node_modules
rm elearning.db
rm package-lock.json

# 3. 再インストール
npm install

# 4. 再初期化
node setup.js

# 5. 起動確認
npm start
```

### Codespacesの完全リセット
1. GitHub → Settings → Codespaces
2. 対象Codespacesを「Delete」
3. 新しいCodespacesを作成
4. セットアップを最初から実行