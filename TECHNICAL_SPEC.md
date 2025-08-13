# 🔧 技術仕様書

## 📋 システムアーキテクチャ

### アプリケーション構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  フロントエンド   │ ── │   Express.js    │ ── │    SQLite3      │
│ (Vanilla JS/HTML)│    │   (Node.js)     │    │  (Database)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ データベース詳細

### テーブル設計

#### users テーブル
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT UNIQUE NOT NULL,      -- 社員ID
    name TEXT NOT NULL,                    -- 氏名
    email TEXT UNIQUE NOT NULL,            -- メールアドレス
    password TEXT NOT NULL,                -- ハッシュ化パスワード
    department TEXT,                       -- 部署
    role TEXT DEFAULT 'student',           -- ロール (admin/student)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME                    -- 最終ログイン
);
```

#### progress テーブル
```sql
CREATE TABLE progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,              -- ユーザーID
    lesson_id INTEGER NOT NULL,            -- レッスンID (1-5)
    status TEXT DEFAULT 'not_started',     -- ステータス
    started_at DATETIME,                   -- 開始日時
    completed_at DATETIME,                 -- 完了日時
    last_slide INTEGER DEFAULT 0,         -- 最後に見たスライド
    time_spent INTEGER DEFAULT 0,         -- 学習時間(秒)
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, lesson_id)
);
```

#### demonstrations テーブル
```sql
CREATE TABLE demonstrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,              -- ユーザーID
    lesson_id INTEGER NOT NULL,            -- レッスンID
    task_id TEXT NOT NULL,                 -- 課題ID
    status TEXT DEFAULT 'pending',         -- ステータス
    evidence_text TEXT,                    -- 実演内容テキスト
    evidence_file TEXT,                    -- 添付ファイル(未使用)
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,                  -- レビュー日時
    reviewer_id INTEGER,                   -- レビュアーID
    feedback TEXT,                         -- フィードバック
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔐 認証システム

### JWT実装
```javascript
// トークン生成
const token = jwt.sign(
    { userId: user.id, employeeId: user.employee_id, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
);

// トークン検証ミドルウェア
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // ...検証ロジック
};
```

### ロール管理
- **admin**: 全機能アクセス可能
- **student**: 学習機能のみアクセス可能

## 📡 API仕様

### 認証関連

#### POST /api/login
```json
// Request
{
    "employee_id": "EMP001",
    "password": "password123"
}

// Response
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "employee_id": "EMP001",
        "name": "伊藤",
        "role": "student"
    }
}
```

#### GET /api/verify-token
```json
// Headers: Authorization: Bearer <token>
// Response
{
    "id": 1,
    "employee_id": "EMP001",
    "role": "student"
}
```

### 学習進捗関連

#### POST /api/progress
```json
// Request
{
    "lesson_id": 1,
    "status": "in_progress",
    "last_slide": 5,
    "time_spent": 300
}

// Response
{
    "message": "進捗が更新されました"
}
```

#### GET /api/progress
```json
// Response
[
    {
        "id": 1,
        "user_id": 1,
        "lesson_id": 1,
        "status": "completed",
        "last_slide": 10,
        "time_spent": 1800
    }
]
```

### スライド数取得

#### GET /api/lesson/:id/slide-count
```json
// Response
{
    "lessonId": 1,
    "totalSlides": 11
}
```

### 管理者機能

#### GET /api/admin/users
```json
// Response
[
    {
        "id": 1,
        "employee_id": "EMP001",
        "name": "伊藤",
        "department": "開発部",
        "last_login": "2025-01-13T10:30:00.000Z"
    }
]
```

#### GET /api/admin/progress
```json
// Response
[
    {
        "id": 1,
        "user_id": 1,
        "lesson_id": 1,
        "status": "completed",
        "name": "伊藤",
        "employee_id": "EMP001"
    }
]
```

## 🎨 フロントエンド詳細

### 主要機能

#### 動的スライド数取得
```javascript
// レッスンごとにスライド数を自動取得
async function loadSlideCounts() {
    for (let lessonId = 1; lessonId <= 5; lessonId++) {
        const response = await fetch(`/api/lesson/${lessonId}/slide-count`);
        const data = await response.json();
        lesson.totalSlides = data.totalSlides;
    }
}
```

#### リアルタイム進捗更新
```javascript
// スライド移動時に進捗を自動保存
function updateProgress() {
    const status = currentSlide === totalSlides ? 'completed' : 'in_progress';
    fetch('/api/progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            lesson_id: 1,
            status: status,
            last_slide: currentSlide,
            time_spent: sessionTime
        })
    });
}
```

#### 認証状態管理
```javascript
// ページロード時に認証チェック
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return false;
    }
    
    const response = await fetch('/api/verify-token', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
        return false;
    }
    
    return true;
}
```

## 🔧 設定ファイル

### package.json
```json
{
    "name": "claude-code-elearning",
    "version": "1.0.0",
    "scripts": {
        "start": "node server.js",
        "test": "node simple-e2e-test.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "sqlite3": "^5.1.6",
        "bcrypt": "^5.1.1",
        "jsonwebtoken": "^9.0.2",
        "cors": "^2.8.5"
    }
}
```

### .devcontainer/devcontainer.json
```json
{
    "name": "Claude Code eLearning System",
    "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
    "postCreateCommand": "npm install && node setup.js",
    "forwardPorts": [3000],
    "portsAttributes": {
        "3000": {
            "label": "eLearning System",
            "onAutoForward": "notify",
            "visibility": "public"
        }
    }
}
```

## 📊 統計計算ロジック

### 管理者ダッシュボード統計

#### 学習中ユーザー数
```javascript
// 少なくとも1つのレッスンを開始したユニークユーザー数
const activeUserIds = new Set(progress.map(p => p.user_id));
const activeLearners = activeUserIds.size;
```

#### コース完了者数
```javascript
// 5レッスン全てを完了したユーザー数
const userProgress = {};
progress.forEach(p => {
    if (!userProgress[p.user_id]) {
        userProgress[p.user_id] = new Set();
    }
    if (p.status === 'completed') {
        userProgress[p.user_id].add(p.lesson_id);
    }
});
const completedUsers = Object.values(userProgress)
    .filter(lessons => lessons.size === 5).length;
```

## 🚀 デプロイメント

### GitHub Codespaces
- 自動セットアップ対応
- ポート3000自動公開
- 開発環境即座に利用可能

### 環境変数
```bash
PORT=3000                                    # サーバーポート
JWT_SECRET=claude-code-learning-secret-key   # JWT暗号化キー
NODE_ENV=production                          # 環境設定
```

## 🔍 重要な実装ポイント

### セキュリティ
- パスワードはbcryptでハッシュ化
- JWTトークンで認証管理
- ロールベースアクセス制御

### パフォーマンス
- SQLiteの軽量性を活用
- 動的スライド数取得でメモリ効率化
- フロントエンドでの適切なキャッシュ管理

### 拡張性
- レッスン数の動的対応
- ユーザーロールの柔軟な管理
- APIファーストアーキテクチャ