const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// データベース初期化とサンプルデータ作成
const db = new sqlite3.Database('elearning.db');

console.log('🔧 eラーニングシステムのセットアップを開始します...');

db.serialize(() => {
    // 既存テーブル削除（クリーンインストール用）
    db.run('DROP TABLE IF EXISTS demonstrations');
    db.run('DROP TABLE IF EXISTS test_results');
    db.run('DROP TABLE IF EXISTS progress');
    db.run('DROP TABLE IF EXISTS users');

    // テーブル再作成
    console.log('📋 データベーステーブルを作成中...');
    
    db.run(`CREATE TABLE users (
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

    db.run(`CREATE TABLE progress (
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

    db.run(`CREATE TABLE test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        question_id TEXT NOT NULL,
        answer TEXT,
        is_correct BOOLEAN,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE demonstrations (
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

    // サンプルユーザーデータ作成
    console.log('👥 サンプルユーザーを作成中...');
    
    const users = [
        {
            employee_id: 'ADMIN001',
            name: '管理者',
            email: 'admin@company.com',
            password: bcrypt.hashSync('admin123', 10),
            department: 'システム管理部',
            role: 'admin'
        },
        {
            employee_id: 'EMP001',
            name: '伊藤',
            email: 'ito@company.com',
            password: bcrypt.hashSync('password123', 10),
            department: '営業部',
            role: 'student'
        },
        {
            employee_id: 'EMP002',
            name: '柳沢',
            email: 'yanagisawa@company.com',
            password: bcrypt.hashSync('password123', 10),
            department: 'マーケティング部',
            role: 'student'
        },
        {
            employee_id: 'EMP003',
            name: '渡辺',
            email: 'watanabe@company.com',
            password: bcrypt.hashSync('password123', 10),
            department: '開発部',
            role: 'student'
        },
        {
            employee_id: 'EMP004',
            name: '北川',
            email: 'kitagawa@company.com',
            password: bcrypt.hashSync('password123', 10),
            department: '営業部',
            role: 'student'
        },
        {
            employee_id: 'EMP005',
            name: '安谷屋',
            email: 'adaniya@company.com',
            password: bcrypt.hashSync('password123', 10),
            department: '営業部',
            role: 'student'
        }
    ];

    const stmt = db.prepare(`INSERT INTO users (employee_id, name, email, password, department, role) 
                             VALUES (?, ?, ?, ?, ?, ?)`);

    users.forEach(user => {
        stmt.run(user.employee_id, user.name, user.email, user.password, user.department, user.role);
    });
    stmt.finalize();

    // サンプル進捗データ作成
    console.log('📊 サンプル進捗データを作成中...');
    
    const sampleProgress = [
        // 伊藤の進捗
        { user_id: 2, lesson_id: 1, status: 'completed', last_slide: 11, time_spent: 45 },
        { user_id: 2, lesson_id: 2, status: 'in_progress', last_slide: 7, time_spent: 25 },
        
        // 柳沢の進捗
        { user_id: 3, lesson_id: 1, status: 'completed', last_slide: 11, time_spent: 52 },
        { user_id: 3, lesson_id: 2, status: 'completed', last_slide: 12, time_spent: 38 },
        { user_id: 3, lesson_id: 3, status: 'in_progress', last_slide: 5, time_spent: 20 },
        
        // 渡辺の進捗
        { user_id: 4, lesson_id: 1, status: 'completed', last_slide: 11, time_spent: 35 },
        { user_id: 4, lesson_id: 2, status: 'completed', last_slide: 12, time_spent: 42 },
        { user_id: 4, lesson_id: 3, status: 'completed', last_slide: 12, time_spent: 48 },
        { user_id: 4, lesson_id: 4, status: 'in_progress', last_slide: 8, time_spent: 30 }
    ];

    const progressStmt = db.prepare(`INSERT INTO progress (user_id, lesson_id, status, started_at, completed_at, last_slide, time_spent) 
                                     VALUES (?, ?, ?, datetime('now', '-' || ? || ' hours'), 
                                             CASE WHEN ? = 'completed' THEN datetime('now', '-' || ? || ' hours', '+' || ? || ' minutes') ELSE NULL END,
                                             ?, ?)`);

    sampleProgress.forEach((prog, index) => {
        const hoursAgo = Math.floor(Math.random() * 72) + 1; // 1-72時間前
        const completionHours = prog.status === 'completed' ? Math.floor(Math.random() * 24) + 1 : 0;
        
        progressStmt.run(
            prog.user_id, 
            prog.lesson_id, 
            prog.status, 
            hoursAgo,
            prog.status,
            completionHours,
            prog.time_spent,
            prog.last_slide, 
            prog.time_spent
        );
    });
    progressStmt.finalize();

    // サンプル実演記録作成
    console.log('🎯 サンプル実演記録を作成中...');
    
    const sampleDemonstrations = [
        {
            user_id: 2,
            lesson_id: 1,
            task_id: 'hello-world',
            status: 'submitted',
            evidence_text: 'Claude Codeを使ってHello Worldプログラムを作成しました。\n\n実装内容：\n- 名前を入力するプロンプト\n- 入力された名前での挨拶表示\n- エラーハンドリング\n\n実行結果：\n正常に動作し、「こんにちは、田中さん！」と表示されました。'
        },
        {
            user_id: 3,
            lesson_id: 1,
            task_id: 'hello-world',
            status: 'approved',
            evidence_text: '名前入力機能付きの挨拶プログラムを完成させました。入力チェック機能も追加して、空文字の場合は再入力を促すようにしました。',
            feedback: '素晴らしい実装です！エラーハンドリングまで考慮されており、実用的なプログラムになっています。'
        },
        {
            user_id: 3,
            lesson_id: 2,
            task_id: 'text-replacement',
            status: 'submitted',
            evidence_text: 'テキスト置換ツールを作成しました。フォルダ内の全.txtファイルを対象に、指定した文字列を一括置換できます。処理結果も表示されるようにしました。'
        },
        {
            user_id: 4,
            lesson_id: 1,
            task_id: 'calculator',
            status: 'approved',
            evidence_text: '2つの数値の四則演算ができる電卓を作成しました。小数点の計算にも対応しています。',
            feedback: '基本機能に加えて四則演算まで実装されていて excellent です！'
        }
    ];

    const demoStmt = db.prepare(`INSERT INTO demonstrations (user_id, lesson_id, task_id, status, evidence_text, feedback, submitted_at, reviewed_at) 
                                 VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' hours'), 
                                         CASE WHEN ? IN ('approved', 'rejected') THEN datetime('now', '-' || ? || ' hours') ELSE NULL END)`);

    sampleDemonstrations.forEach(demo => {
        const hoursAgo = Math.floor(Math.random() * 48) + 1;
        const reviewHours = demo.status !== 'submitted' ? Math.floor(Math.random() * 24) + 1 : 0;
        
        demoStmt.run(
            demo.user_id,
            demo.lesson_id, 
            demo.task_id,
            demo.status,
            demo.evidence_text,
            demo.feedback || null,
            hoursAgo,
            demo.status,
            reviewHours
        );
    });
    demoStmt.finalize();

    console.log('✅ セットアップが完了しました！');
    console.log('');
    console.log('📌 ログイン情報:');
    console.log('');
    console.log('🔧 管理者アカウント:');
    console.log('   社員ID: ADMIN001');
    console.log('   パスワード: admin123');
    console.log('');
    console.log('👥 サンプル受講者アカウント:');
    console.log('   社員ID: EMP001 (伊藤) / パスワード: password123');
    console.log('   社員ID: EMP002 (柳沢) / パスワード: password123'); 
    console.log('   社員ID: EMP003 (渡辺) / パスワード: password123');
    console.log('   社員ID: EMP004 (北川) / パスワード: password123');
    console.log('   社員ID: EMP005 (安谷屋) / パスワード: password123');
    console.log('');
    console.log('🚀 サーバーを起動するには: npm start');
    console.log('🌐 アクセスURL: http://localhost:3000');
    console.log('');
});

db.close();