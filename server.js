const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'claude-code-learning-secret-key';

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/slides', express.static(path.join(__dirname, 'slides')));

// データベース初期化
const db = new sqlite3.Database('elearning.db');

// テーブル作成
db.serialize(() => {
    // ユーザーテーブル
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        department TEXT,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
    )`);

    // 学習進捗テーブル
    db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        status TEXT DEFAULT 'not_started',
        started_at DATETIME,
        completed_at DATETIME,
        last_slide INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, lesson_id)
    )`);

    // テスト結果テーブル
    db.run(`CREATE TABLE IF NOT EXISTS test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        question_id TEXT NOT NULL,
        answer TEXT,
        is_correct BOOLEAN,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // 実演記録テーブル
    db.run(`CREATE TABLE IF NOT EXISTS demonstrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        task_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        evidence_text TEXT,
        evidence_file TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_at DATETIME,
        reviewer_id INTEGER,
        feedback TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // 初期管理者ユーザー作成
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (employee_id, name, email, password, role) 
            VALUES ('ADMIN001', '管理者', 'admin@company.com', ?, 'admin')`, [adminPassword]);
});

// JWTトークン検証ミドルウェア
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// 管理者権限チェック
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: '管理者権限が必要です' });
    }
    next();
};

// ===== スライド数取得エンドポイント =====

// スライド数を動的に取得
app.get('/api/lesson/:id/slide-count', (req, res) => {
    const lessonId = req.params.id;
    const slidePath = path.join(__dirname, 'slides', `lesson${lessonId}_slides.html`);
    
    try {
        const fs = require('fs');
        const slideContent = fs.readFileSync(slidePath, 'utf8');

        // slideクラスの数を数える（slide-containerまたはslideクラス）
        const slideContainerCount = (slideContent.match(/class="slide-container"/g) || []).length;
        const slideClassCount = (slideContent.match(/class="slide"/g) || []).length;
        const slideCount = Math.max(slideContainerCount, slideClassCount);

        res.json({ lessonId: parseInt(lessonId), totalSlides: slideCount });
    } catch (error) {
        // スライドファイルが見つからない場合はデフォルト値を返す
        const defaultSlideCounts = { 0: 21, 1: 15, 2: 12, 3: 14, 4: 13, 5: 16, 6: 18, 7: 25, 8: 23, 9: 18 };
        const defaultCount = defaultSlideCounts[lessonId] || 15;
        res.json({ lessonId: parseInt(lessonId), totalSlides: defaultCount });
    }
});

// ===== 認証エンドポイント =====

// ログイン
app.post('/api/login', (req, res) => {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
        return res.status(400).json({ error: '社員IDとパスワードを入力してください' });
    }

    db.get('SELECT * FROM users WHERE employee_id = ?', [employee_id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'データベースエラー' });
        }

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: '社員IDまたはパスワードが正しくありません' });
        }

        // 最終ログイン時刻を更新
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        const token = jwt.sign(
            { userId: user.id, employeeId: user.employee_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                employee_id: user.employee_id,
                name: user.name,
                email: user.email,
                department: user.department,
                role: user.role
            }
        });
    });
});

// ユーザー登録（管理者のみ）
app.post('/api/register', authenticateToken, requireAdmin, (req, res) => {
    const { employee_id, name, email, password, department } = req.body;

    if (!employee_id || !name || !email || !password) {
        return res.status(400).json({ error: '必須項目を全て入力してください' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (employee_id, name, email, password, department) 
            VALUES (?, ?, ?, ?, ?)`,
        [employee_id, name, email, hashedPassword, department],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: '社員IDまたはメールアドレスが既に登録されています' });
                }
                return res.status(500).json({ error: 'データベースエラー' });
            }

            res.json({ message: 'ユーザーが正常に登録されました', userId: this.lastID });
        }
    );
});

// ===== 学習進捗エンドポイント =====

// 進捗開始/更新
app.post('/api/progress', authenticateToken, (req, res) => {
    const { lesson_id, status, last_slide, time_spent } = req.body;
    const user_id = req.user.userId;

    const now = new Date().toISOString();

    db.run(`INSERT OR REPLACE INTO progress 
            (user_id, lesson_id, status, started_at, completed_at, last_slide, time_spent)
            VALUES (?, ?, ?, 
                COALESCE((SELECT started_at FROM progress WHERE user_id = ? AND lesson_id = ?), ?),
                CASE WHEN ? = 'completed' THEN ? ELSE NULL END,
                ?, ?)`,
        [user_id, lesson_id, status, user_id, lesson_id, now, status, now, last_slide, time_spent],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'データベースエラー' });
            }
            res.json({ message: '進捗が更新されました' });
        }
    );
});

// 進捗取得
app.get('/api/progress', authenticateToken, (req, res) => {
    const user_id = req.user.userId;

    db.all('SELECT * FROM progress WHERE user_id = ?', [user_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'データベースエラー' });
        }
        res.json(rows);
    });
});

// ===== 実演記録エンドポイント =====

// 実演提出
app.post('/api/demonstration', authenticateToken, (req, res) => {
    const { lesson_id, task_id, evidence_text } = req.body;
    const user_id = req.user.userId;

    db.run(`INSERT OR REPLACE INTO demonstrations 
            (user_id, lesson_id, task_id, status, evidence_text, submitted_at)
            VALUES (?, ?, ?, 'submitted', ?, CURRENT_TIMESTAMP)`,
        [user_id, lesson_id, task_id, evidence_text],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'データベースエラー' });
            }
            res.json({ message: '実演記録が提出されました' });
        }
    );
});

// ===== 管理者エンドポイント =====

// 全ユーザー一覧
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT id, employee_id, name, email, department, role, created_at, last_login 
            FROM users ORDER BY created_at DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'データベースエラー' });
        }
        res.json(rows);
    });
});

// 全進捗一覧
app.get('/api/admin/progress', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT p.*, u.name, u.employee_id, u.department
            FROM progress p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.lesson_id, u.name`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'データベースエラー' });
        }
        res.json(rows);
    });
});

// 実演記録一覧（管理者）
app.get('/api/admin/demonstrations', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT d.*, u.name, u.employee_id, u.department
            FROM demonstrations d
            JOIN users u ON d.user_id = u.id
            ORDER BY d.submitted_at DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'データベースエラー' });
        }
        res.json(rows);
    });
});

// 実演レビュー
app.put('/api/admin/demonstration/:id', authenticateToken, requireAdmin, (req, res) => {
    const { status, feedback } = req.body;
    const demonstration_id = req.params.id;
    const reviewer_id = req.user.userId;

    db.run(`UPDATE demonstrations 
            SET status = ?, feedback = ?, reviewed_at = CURRENT_TIMESTAMP, reviewer_id = ?
            WHERE id = ?`,
        [status, feedback, reviewer_id, demonstration_id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'データベースエラー' });
            }
            res.json({ message: '実演がレビューされました' });
        }
    );
});

// トークン検証エンドポイント
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.json({
        id: req.user.userId,
        employee_id: req.user.employeeId,
        role: req.user.role
    });
});

// ルートパス - ログインページにリダイレクト
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// 静的ファイルの明示的なルート
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/student-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student-dashboard.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '内部サーバーエラー' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`eラーニングシステムがポート${PORT}で起動しました`);
    console.log(`管理者ログイン: 社員ID: ADMIN001, パスワード: admin123`);
    console.log(`LANアクセス: http://[このマシンのIPアドレス]:${PORT}`);
});

module.exports = app;