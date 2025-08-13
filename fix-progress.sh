#!/bin/bash
# 進捗データ修正スクリプト

echo "🔧 進捗データをリセットして修正します..."

# EC2に接続して修正実行
ssh -o StrictHostKeyChecking=no -i ~/elearning-key.pem ubuntu@52.195.12.32 << 'ENDSSH'
cd /var/www/elearning

echo "📊 現在の進捗データ確認"
sqlite3 elearning.db "SELECT user_id, lesson_id, last_slide FROM progress;"

echo -e "\n🗄️ 進捗データをリセット"
sqlite3 elearning.db "DELETE FROM progress;"

echo -e "\n✅ 進捗データリセット完了"
sqlite3 elearning.db "SELECT COUNT(*) FROM progress;"

echo -e "\n🔄 アプリケーション再起動"
pm2 restart elearning

echo -e "\n📋 修正完了 - クリーンな状態で開始できます"
ENDSSH

echo ""
echo "✅ 進捗データ修正完了！"
echo "🌐 http://52.195.12.32:3000 でテストしてください"