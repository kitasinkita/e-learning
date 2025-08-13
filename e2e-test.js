const { chromium } = require('playwright');

async function runE2ETest() {
    const browser = await chromium.launch({ headless: false }); // ブラウザを表示
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🚀 E2Eテストを開始します...');

    try {
        // 1. ログインページのアクセステスト
        console.log('📱 1. ログインページにアクセス');
        await page.goto('http://localhost:3000');
        await page.waitForSelector('#login-form', { timeout: 10000 });
        console.log('✅ ログインページが正常に表示されました');

        // ページタイトル確認
        const title = await page.title();
        console.log(`   - ページタイトル: ${title}`);

        // デモアカウント表示確認
        const demoCredentials = await page.locator('.demo-credentials').isVisible();
        console.log(`   - デモアカウント表示: ${demoCredentials ? '✅' : '❌'}`);

        // 2. 受講者ログインテスト
        console.log('\n👤 2. 受講者ログインテスト (伊藤)');
        await page.fill('#employee_id', 'EMP001');
        await page.fill('#password', 'password123');
        await page.click('#login-btn');

        // ダッシュボードへの遷移を待機
        await page.waitForURL('**/student-dashboard.html', { timeout: 10000 });
        console.log('✅ 受講者ダッシュボードに遷移しました');

        // ユーザー名表示確認
        const userName = await page.locator('#user-name').textContent();
        console.log(`   - 表示ユーザー名: ${userName}`);

        // 学習進捗確認
        const completedLessons = await page.locator('#completed-lessons').textContent();
        console.log(`   - 完了レッスン数: ${completedLessons}`);

        // 3. レッスンアクセステスト
        console.log('\n📚 3. レッスンアクセステスト');
        const firstLessonBtn = page.locator('.lesson-card .btn-primary').first();
        await firstLessonBtn.click();

        // 新しいタブ/ウィンドウでレッスンが開かれることを待機
        const newPage = await context.waitForEvent('page');
        await newPage.waitForLoadState();
        console.log('✅ レッスンページが開きました');

        const lessonTitle = await newPage.title();
        console.log(`   - レッスンタイトル: ${lessonTitle}`);

        // 進捗トラッカーの表示確認
        const progressTracker = await newPage.locator('#elearning-progress').isVisible();
        console.log(`   - 進捗トラッカー表示: ${progressTracker ? '✅' : '❌'}`);

        // スライドナビゲーションテスト
        console.log('   - スライドナビゲーションテスト');
        await newPage.click('#nextBtn');
        await page.waitForTimeout(1000);
        
        const slideNumber = await newPage.locator('#currentSlide').textContent();
        console.log(`     - 現在のスライド: ${slideNumber}`);

        // レッスンページを閉じる
        await newPage.close();

        // 4. 実演提出テスト
        console.log('\n🎯 4. 実演提出テスト');
        await page.click('.lesson-card .btn-secondary[onclick*="showDemos(1)"]');

        // 実演提出モーダルの表示を待機
        await page.waitForSelector('div[style*="position: fixed"]', { timeout: 5000 });
        console.log('✅ 実演提出モーダルが表示されました');

        // 実演内容入力
        const textArea = page.locator('textarea').first();
        await textArea.fill('Hello Worldプログラムを作成しました。Claude Codeを使用して、ユーザーの名前を入力して挨拶するプログラムを実装。正常に動作することを確認しました。');

        // 提出ボタンクリック
        await page.click('button[onclick*="submitDemo"]');
        await page.waitForTimeout(2000);

        console.log('✅ 実演記録を提出しました');

        // モーダルを閉じる
        await page.click('button:has-text("閉じる")');

        // 5. ログアウトテスト
        console.log('\n🚪 5. ログアウトテスト');
        await page.click('.logout-btn');
        await page.waitForURL('**/login.html', { timeout: 5000 });
        console.log('✅ ログアウトしてログインページに戻りました');

        // 6. 管理者ログインテスト
        console.log('\n🔧 6. 管理者ログインテスト');
        await page.fill('#employee_id', 'ADMIN001');
        await page.fill('#password', 'admin123');
        await page.click('#login-btn');

        await page.waitForURL('**/admin-dashboard.html', { timeout: 10000 });
        console.log('✅ 管理者ダッシュボードに遷移しました');

        // 統計データ確認
        const totalUsers = await page.locator('#total-users').textContent();
        const activeLearners = await page.locator('#active-learners').textContent();
        const pendingDemos = await page.locator('#pending-demos').textContent();

        console.log(`   - 登録ユーザー数: ${totalUsers}`);
        console.log(`   - 学習中ユーザー: ${activeLearners}`);
        console.log(`   - 承認待ち実演: ${pendingDemos}`);

        // 7. ユーザー管理テスト
        console.log('\n👥 7. ユーザー管理テスト');
        await page.click('button[onclick="showTab(\'users\')"]');
        await page.waitForTimeout(1000);

        const usersTable = await page.locator('#users-table tr').count();
        console.log(`✅ ユーザー一覧表示 (${usersTable}件のユーザー)`);

        // 8. 学習進捗確認テスト
        console.log('\n📊 8. 学習進捗確認テスト');
        await page.click('button[onclick="showTab(\'progress\')"]');
        await page.waitForTimeout(2000);

        const progressTable = await page.locator('#progress-table tr').count();
        console.log(`✅ 学習進捗表示 (${progressTable}件の進捗記録)`);

        // 9. 実演管理テスト
        console.log('\n🎯 9. 実演管理テスト');
        await page.click('button[onclick="showTab(\'demonstrations\')"]');
        await page.waitForTimeout(2000);

        const demoTable = await page.locator('#demonstrations-table tr').count();
        console.log(`✅ 実演記録表示 (${demoTable}件の実演記録)`);

        // 実演詳細確認（最初の詳細ボタンをクリック）
        const detailBtn = page.locator('button:has-text("詳細")').first();
        if (await detailBtn.isVisible()) {
            await detailBtn.click();
            await page.waitForSelector('#demo-modal', { state: 'visible' });
            console.log('✅ 実演詳細モーダルが表示されました');
            
            // モーダルを閉じる
            await page.click('button:has-text("閉じる")');
        }

        // 10. 新規ユーザー登録テスト
        console.log('\n➕ 10. 新規ユーザー登録テスト');
        await page.click('button[onclick="showTab(\'users\')"]');
        await page.waitForTimeout(1000);

        await page.fill('input[name="employee_id"]', 'EMP004');
        await page.fill('input[name="name"]', '田中');
        await page.fill('input[name="email"]', 'tanaka@company.com');
        await page.fill('input[name="department"]', 'テスト部署');
        await page.fill('input[name="password"]', 'testpassword123');

        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);

        console.log('✅ 新規ユーザー登録を実行しました');

        // 11. システム概要確認
        console.log('\n📈 11. システム概要確認');
        await page.click('button[onclick="showTab(\'overview\')"]');
        await page.waitForTimeout(2000);

        const updatedTotalUsers = await page.locator('#total-users').textContent();
        console.log(`✅ システム概要更新確認 - 総ユーザー数: ${updatedTotalUsers}`);

        console.log('\n🎉 E2Eテストが正常に完了しました！');

        // 結果サマリー
        console.log('\n📋 テスト結果サマリー:');
        console.log('✅ ログイン・ログアウト機能');
        console.log('✅ 受講者ダッシュボード');
        console.log('✅ レッスンアクセス・ナビゲーション');
        console.log('✅ 実演提出機能');
        console.log('✅ 管理者ダッシュボード');
        console.log('✅ ユーザー管理機能');
        console.log('✅ 学習進捗管理');
        console.log('✅ 実演記録管理');
        console.log('✅ 新規ユーザー登録');
        console.log('✅ システム統計表示');

    } catch (error) {
        console.error('❌ E2Eテストでエラーが発生しました:', error);
    } finally {
        await browser.close();
    }
}

// Playwrightがインストールされているかチェック
async function checkPlaywright() {
    try {
        await chromium.launch({ headless: true });
        console.log('✅ Playwright環境が正常です');
        return true;
    } catch (error) {
        console.log('❌ Playwrightがインストールされていません');
        console.log('📦 インストールコマンド: npx playwright install');
        return false;
    }
}

// メイン実行
async function main() {
    console.log('🔍 E2Eテスト環境チェック...');
    
    // サーバー接続確認
    try {
        const response = await fetch('http://localhost:3000');
        if (response.ok) {
            console.log('✅ サーバーが稼働中です');
        } else {
            throw new Error('サーバー応答エラー');
        }
    } catch (error) {
        console.error('❌ サーバーに接続できません。npm start でサーバーを起動してください。');
        return;
    }

    // Playwright環境チェック
    const playwrightOk = await checkPlaywright();
    if (!playwrightOk) {
        return;
    }

    // E2Eテスト実行
    await runE2ETest();
}

main().catch(console.error);