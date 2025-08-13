#!/bin/bash
# 🚀 超簡単！IPアドレス運用版デプロイスクリプト

set -e

APP_DIR="/var/www/elearning"
REPO_URL="https://github.com/kitasinkita/e-learning.git"
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)

echo "🚀 eラーニングシステム簡単デプロイ"
echo "📍 パブリックIP: $PUBLIC_IP"

# アプリケーションディレクトリ作成
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR
cd $APP_DIR

# 既存アプリ停止
pm2 stop elearning 2>/dev/null || true

# リポジトリクローン/更新
if [ -d ".git" ]; then
    git pull origin main
else
    git clone $REPO_URL .
fi

# 依存関係インストール
npm ci --production

# データベース初期化（初回のみ）
if [ ! -f "elearning.db" ]; then
    node setup.js
fi

# PM2でアプリ起動
pm2 start server.js --name elearning
pm2 save
pm2 startup | tail -1 | sudo bash

echo ""
echo "✅ デプロイ完了！"
echo ""
echo "🌐 アクセスURL: http://$PUBLIC_IP:3000"
echo "👤 管理者: ADMIN001 / admin123"  
echo "👥 受講者: EMP001 (伊藤) / password123"
echo "👥 受講者: EMP002 (柳沢) / password123"
echo "👥 受講者: EMP003 (渡辺) / password123"
echo ""
echo "📊 ステータス確認: pm2 status"
echo "📝 ログ確認: pm2 logs elearning"