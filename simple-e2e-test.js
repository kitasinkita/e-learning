const { chromium } = require('playwright');

// シンプルなE2Eテスト
async function runSimpleE2ETest() {
    console.log('🚀 シンプルE2Eテストを開始します...');

    const browser = await chromium.launch({ 
        headless: false,  // ブラウザを表示
        slowMo: 1000     // 操作を1秒ずつ実行
    });
    
    const page = await browser.newPage();

    try {
        // 1. ログインページにアクセス
        console.log('📱 ログインページにアクセス中...');
        await page.goto('http://localhost:3000/login.html');
        await page.waitForLoadState('networkidle');
        
        // ページが正しく読み込まれたか確認
        const title = await page.title();
        console.log(`✅ ページタイトル: ${title}`);
        
        // ログインフォームが表示されているか確認
        await page.waitForSelector('#employee_id');
        await page.waitForSelector('#password');
        await page.waitForSelector('#login-btn');
        console.log('✅ ログインフォームが表示されました');

        // 2. 受講者でログイン
        console.log('👤 受講者ログイン中... (伊藤)');
        await page.fill('#employee_id', 'EMP001');
        await page.fill('#password', 'password123');
        await page.click('#login-btn');
        
        // ダッシュボードへの遷移を待機
        await page.waitForURL('**/student-dashboard.html', { timeout: 15000 });
        console.log('✅ 受講者ダッシュボードに遷移しました');

        // ユーザー名確認
        const userName = await page.locator('#user-name').textContent();
        console.log(`   ユーザー名: ${userName}`);

        // 学習統計確認
        const completedLessons = await page.locator('#completed-lessons').textContent();
        const totalProgress = await page.locator('#total-progress').textContent();
        console.log(`   完了レッスン: ${completedLessons}, 全体進捗: ${totalProgress}`);

        // 3. レッスンカード確認
        console.log('📚 レッスンカード確認中...');
        const lessonCards = await page.locator('.lesson-card').count();
        console.log(`✅ ${lessonCards}個のレッスンカードが表示されています`);

        // 4. 実演提出モーダルテスト
        console.log('🎯 実演提出モーダルテスト中...');
        await page.click('.lesson-card .btn-secondary[onclick*="showDemos(1)"]');
        
        // モーダル表示待機
        await page.waitForSelector('div[style*="position: fixed"]');
        console.log('✅ 実演提出モーダルが表示されました');
        
        // モーダルを閉じる
        await page.click('button:has-text("閉じる")');
        await page.waitForTimeout(1000);

        // 5. ログアウト
        console.log('🚪 ログアウト中...');
        await page.click('.logout-btn');
        await page.waitForURL('**/login.html', { timeout: 10000 });
        console.log('✅ ログアウト成功');

        // 6. 管理者ログイン
        console.log('🔧 管理者ログイン中...');
        await page.fill('#employee_id', 'ADMIN001');
        await page.fill('#password', 'admin123');
        await page.click('#login-btn');
        
        await page.waitForURL('**/admin-dashboard.html', { timeout: 15000 });
        console.log('✅ 管理者ダッシュボードに遷移しました');

        // 統計確認
        const totalUsers = await page.locator('#total-users').textContent();
        const activeLearners = await page.locator('#active-learners').textContent();
        const pendingDemos = await page.locator('#pending-demos').textContent();
        
        console.log(`   統計情報:`);
        console.log(`   - 総ユーザー数: ${totalUsers}`);
        console.log(`   - アクティブ学習者: ${activeLearners}`);
        console.log(`   - 承認待ち実演: ${pendingDemos}`);

        // 7. タブ切り替えテスト
        console.log('📊 管理者機能テスト中...');
        
        // ユーザー管理タブ
        await page.click('button[onclick="showTab(\'users\')"]');
        await page.waitForTimeout(2000);
        const usersTable = await page.locator('#users-table tr').count();
        console.log(`✅ ユーザー管理: ${usersTable}件表示`);
        
        // 学習進捗タブ  
        await page.click('button[onclick="showTab(\'progress\')"]');
        await page.waitForTimeout(2000);
        const progressTable = await page.locator('#progress-table tr').count();
        console.log(`✅ 学習進捗: ${progressTable}件表示`);
        
        // 実演管理タブ
        await page.click('button[onclick="showTab(\'demonstrations\')"]');
        await page.waitForTimeout(2000);
        const demoTable = await page.locator('#demonstrations-table tr').count();
        console.log(`✅ 実演管理: ${demoTable}件表示`);

        console.log('\n🎉 シンプルE2Eテスト完了！');
        console.log('\n📋 テスト結果:');
        console.log('✅ ログイン機能');
        console.log('✅ 受講者ダッシュボード');
        console.log('✅ 実演提出モーダル');
        console.log('✅ ログアウト機能');
        console.log('✅ 管理者ダッシュボード');
        console.log('✅ 管理者機能（ユーザー・進捗・実演管理）');

    } catch (error) {
        console.error('❌ E2Eテストエラー:', error.message);
        
        // エラー時のスクリーンショット
        try {
            await page.screenshot({ path: 'error-screenshot.png' });
            console.log('📸 エラー時のスクリーンショットを保存しました: error-screenshot.png');
        } catch (screenshotError) {
            console.log('スクリーンショット保存に失敗');
        }
    } finally {
        // ブラウザを5秒後に閉じる
        setTimeout(async () => {
            await browser.close();
        }, 5000);
    }
}

// メイン実行
async function main() {
    // サーバー接続確認
    console.log('🔍 サーバー接続確認中...');
    try {
        const response = await fetch('http://localhost:3000/login.html');
        if (response.ok) {
            console.log('✅ サーバーが正常に稼働中');
        } else {
            throw new Error('サーバー応答エラー');
        }
    } catch (error) {
        console.error('❌ サーバーに接続できません');
        console.log('📝 対処方法: npm start でサーバーを起動してください');
        return;
    }

    await runSimpleE2ETest();
}

main().catch(console.error);