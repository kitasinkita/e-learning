#!/bin/bash
# 自動デプロイスクリプト

EC2_IP="52.195.12.32"
KEY_PATH="$HOME/elearning-key.pem"

echo "🚀 EC2へのデプロイを開始します"
echo "📍 IP: $EC2_IP"

# SSHで接続してデプロイコマンドを実行
ssh -o StrictHostKeyChecking=no -i "$KEY_PATH" ubuntu@$EC2_IP << 'ENDSSH'
echo "📦 サーバー初期設定開始"

# 必要なパッケージインストール
sudo apt update
sudo apt install -y nodejs npm git nginx sqlite3
sudo npm install -g pm2

# アプリケーションディレクトリ作成
sudo mkdir -p /var/www/elearning
sudo chown -R ubuntu:ubuntu /var/www/elearning

# リポジトリクローン
cd /var/www/elearning
git clone https://github.com/kitasinkita/e-learning.git .

# 依存関係インストール
npm ci --production

# データベース初期化
node setup.js

# PM2でアプリ起動
pm2 start server.js --name elearning
pm2 save
pm2 startup | tail -1 | sudo bash

echo "✅ デプロイ完了！"
ENDSSH

echo ""
echo "🌐 アクセスURL: http://$EC2_IP:3000"
echo "👤 管理者: ADMIN001 / admin123"
echo "👥 受講者: EMP001/EMP002/EMP003 / password123"