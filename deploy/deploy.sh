#!/bin/bash
# eラーニングシステム自動デプロイスクリプト（パブリックIP運用版）

set -e  # エラー時に終了

APP_DIR="/var/www/elearning"
REPO_URL="https://github.com/kitasinkita/e-learning.git"
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)  # AWSパブリックIP自動取得

echo "🚀 eラーニングシステムデプロイ開始"
echo "📍 パブリックIP: $PUBLIC_IP"

# アプリケーションディレクトリへ移動
cd $APP_DIR

# 既存のアプリがあれば停止
pm2 stop elearning 2>/dev/null || true

# Gitリポジトリクローン（または更新）
if [ -d ".git" ]; then
    echo "📡 既存リポジトリを更新"
    git pull origin main
else
    echo "📡 リポジトリをクローン"
    git clone $REPO_URL .
fi

# 依存関係インストール
echo "📦 依存関係インストール"
npm ci --production

# データベース初期化（初回のみ）
if [ ! -f "elearning.db" ]; then
    echo "🗄️ データベース初期化"
    node setup.js
fi

# PM2設定ファイル作成
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'elearning',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# PM2でアプリケーション起動
echo "🔄 PM2でアプリケーション起動"
pm2 start ecosystem.config.js

# PM2設定を保存（再起動時に自動起動）
pm2 save
pm2 startup | tail -1 | sudo bash

echo "✅ デプロイ完了！"
echo ""
echo "🌐 アクセスURL: http://$PUBLIC_IP:3000"
echo "👤 管理者ログイン: ADMIN001 / admin123"
echo "👥 受講者ログイン: EMP001 (伊藤) / password123"
echo ""
echo "📊 PM2ステータス: pm2 status"
echo "📝 ログ確認: pm2 logs elearning"
echo "🔄 アプリ再起動: pm2 restart elearning"