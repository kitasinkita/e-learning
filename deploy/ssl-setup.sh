#!/bin/bash
# SSL証明書自動取得・設定スクリプト（Let's Encrypt使用）

DOMAIN_NAME="your-domain.com"  # 実際のドメインに変更
EMAIL="your-email@example.com"  # 実際のメールアドレスに変更

echo "🔒 SSL証明書設定開始"

# Snapdインストール（Certbot用）
sudo apt install -y snapd
sudo snap install core
sudo snap refresh core

# Certbotインストール
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

# SSL証明書取得
sudo certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  --domains $DOMAIN_NAME \
  --redirect

# 自動更新設定
sudo systemctl enable snap.certbot.renew.timer

echo "✅ SSL設定完了！"
echo "🔒 HTTPS: https://$DOMAIN_NAME"
echo "🔄 証明書は自動更新されます"