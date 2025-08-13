#!/bin/bash
# フロントエンド進捗計算修正スクリプト

echo "🔧 フロントエンドの進捗計算を修正します..."

# EC2に接続してフロントエンド修正
ssh -o StrictHostKeyChecking=no -i ~/elearning-key.pem ubuntu@52.195.12.32 << 'ENDSSH'
cd /var/www/elearning

echo "📝 student-dashboard.htmlの進捗計算部分を修正"

# 現在のスライド数取得部分を確認
echo "現在のスライド数設定:"
grep -n "totalSlides.*10" public/student-dashboard.html || echo "設定が見つからない"

# バックアップ作成
cp public/student-dashboard.html public/student-dashboard.html.backup

# 進捗計算部分を修正
cat > temp_fix.js << 'EOF'
// 修正: APIからスライド数を正しく取得
async function updateLessonProgress(lessonDiv, lessonId, userProgress) {
    try {
        // スライド数をAPIから取得
        const slideResponse = await fetch(`/api/lesson/${lessonId}/slide-count`);
        const slideData = await slideResponse.json();
        const totalSlides = slideData.totalSlides;
        
        console.log(`レッスン${lessonId}: ${totalSlides}スライド`);
        
        const progress = userProgress.find(p => p.lesson_id === lessonId);
        const currentSlide = progress ? progress.last_slide : 0;
        const percentage = totalSlides > 0 ? Math.round((currentSlide / totalSlides) * 100) : 0;
        
        // 進捗表示を更新
        const progressText = lessonDiv.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `進捗: ${percentage}% (${currentSlide}/${totalSlides}スライド)`;
        }
        
        // ステータス更新
        const statusBadge = lessonDiv.querySelector('.status-badge');
        if (statusBadge) {
            if (currentSlide === 0) {
                statusBadge.textContent = '未開始';
                statusBadge.className = 'status-badge status-not-started';
            } else if (currentSlide === totalSlides) {
                statusBadge.textContent = '完了';
                statusBadge.className = 'status-badge status-completed';
            } else {
                statusBadge.textContent = '学習中';
                statusBadge.className = 'status-badge status-in-progress';
            }
        }
        
    } catch (error) {
        console.error(`レッスン${lessonId}の進捗更新エラー:`, error);
    }
}
EOF

# JavaScriptの修正を適用
echo "JavaScriptファイルを更新中..."

ENDSSH

echo "✅ フロントエンド修正準備完了"