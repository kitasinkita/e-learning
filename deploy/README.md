# 🚀 AWS EC2デプロイガイド（パブリックIP運用版）

## 📋 超簡単！3ステップデプロイ

### 1. GitHubリポジトリ準備
```bash
# ローカルでコミット・プッシュ
git add .
git commit -m "AWS移行準備: パブリックIP運用版"
git push origin main
```

### 2. AWS EC2インスタンス作成
1. **AWS Console** → EC2 → Launch Instance
2. **Name**: `elearning-server`
3. **OS**: Ubuntu Server 22.04 LTS (ARM64推奨)
4. **Instance type**: `t4g.nano` (月額500円)
5. **Key pair**: 新規作成または既存選択
6. **Security Group**: 以下ポート開放
   - SSH (22) - あなたのIPのみ
   - カスタムTCP (3000) - 0.0.0.0/0  ← **これが重要！**

### 3. サーバーへSSH接続
```bash
# 秘密鍵のパーミッション設定
chmod 400 your-key.pem

# SSH接続
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 3. 全自動デプロイ（1コマンド）
```bash
# サーバー初期設定 + アプリデプロイを一気に実行
wget https://raw.githubusercontent.com/kitasinkita/e-learning/main/deploy/server-setup.sh && \
chmod +x server-setup.sh && \
./server-setup.sh && \
wget https://raw.githubusercontent.com/kitasinkita/e-learning/main/deploy/simple-deploy.sh && \
chmod +x simple-deploy.sh && \
./simple-deploy.sh
```

**完了！** これで `http://YOUR-PUBLIC-IP:3000` でアクセス可能

### 6. ドメイン・DNS設定（オプション）
独自ドメインを使用する場合：
1. **ドメイン登録**: Route 53, お名前.com等
2. **DNS設定**: A recordでEC2のIPアドレス指定
3. **SSL設定**: Let's Encryptで無料SSL
   ```bash
   # SSL証明書取得
   wget https://raw.githubusercontent.com/kitasinkita/e-learning/main/deploy/ssl-setup.sh
   chmod +x ssl-setup.sh
   
   # ドメイン・メール編集
   nano ssl-setup.sh
   
   # SSL設定実行
   ./ssl-setup.sh
   ```

## 🔧 運用コマンド

### アプリケーション管理
```bash
# ステータス確認
pm2 status

# ログ確認
pm2 logs elearning

# 再起動
pm2 restart elearning

# 停止
pm2 stop elearning
```

### 更新デプロイ
```bash
cd /var/www/elearning
git pull origin main
npm ci --production
pm2 restart elearning
```

### バックアップ
```bash
# データベースバックアップ
cp /var/www/elearning/elearning.db ~/backup-$(date +%Y%m%d).db

# 定期バックアップ設定
echo "0 2 * * * cp /var/www/elearning/elearning.db ~/backup-\$(date +\%Y\%m\%d).db" | crontab -
```

## 💰 料金目安

| インスタンス | 月額料金 | スペック |
|-------------|----------|----------|
| t4g.nano | $3.26 (約500円) | 2vCPU, 0.5GB RAM |
| t3.nano | $4.73 (約700円) | 2vCPU, 0.5GB RAM |

※新規アカウントは12ヶ月無料枠あり

## 🚨 トラブルシューティング

### アプリが起動しない
```bash
# ログ確認
pm2 logs elearning

# 手動起動テスト
cd /var/www/elearning
node server.js
```

### メモリ不足
```bash
# メモリ使用量確認
free -h

# スワップファイル作成（推奨）
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 接続できない
1. Security Groupのポート設定確認
2. Nginx設定確認: `sudo nginx -t`
3. PM2プロセス確認: `pm2 status`