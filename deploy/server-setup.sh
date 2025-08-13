#!/bin/bash
# AWS EC2 Ubuntu初期設定スクリプト

echo "🚀 AWS EC2 eラーニングサーバー設定開始"

# システム更新
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS インストール
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2（プロセス管理）インストール
sudo npm install -g pm2

# Nginx（リバースプロキシ）インストール
sudo apt install -y nginx

# SQLite3インストール
sudo apt install -y sqlite3

# Git設定
sudo apt install -y git

# アプリケーション用ディレクトリ作成
sudo mkdir -p /var/www/elearning
sudo chown -R $USER:$USER /var/www/elearning

# ファイアウォール設定
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ サーバー初期設定完了"
echo "次のステップ: アプリケーションのデプロイ"