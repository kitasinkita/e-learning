// 各レッスンスライドに追加するeラーニング機能
// このスクリプトを各lesson_slides.htmlの最後に追加

class ELearningTracker {
    constructor(lessonId, totalSlides) {
        this.lessonId = lessonId;
        this.totalSlides = totalSlides;
        this.currentSlide = 1;
        this.startTime = Date.now();
        this.timeSpent = 0;
        this.apiBase = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
        
        this.init();
    }

    init() {
        this.addProgressTracker();
        this.addDemoButtons();
        this.setupSlideTracking();
        this.loadProgress();
        
        // 定期的に進捗を保存
        setInterval(() => {
            this.saveProgress();
        }, 30000); // 30秒ごと

        // ページ離脱時に進捗を保存
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }

    addProgressTracker() {
        const progressHtml = `
            <div id="elearning-progress" style="
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(255,255,255,0.95);
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                min-width: 250px;
                font-family: 'Noto Sans JP', sans-serif;
            ">
                <div style="margin-bottom: 10px;">
                    <strong>📊 学習進捗</strong>
                    <button onclick="this.parentElement.parentElement.style.display='none'" style="
                        float: right;
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        color: #999;
                    ">×</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <div style="background: #ecf0f1; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div id="progress-bar" style="
                            background: linear-gradient(90deg, #34495e, #2c3e50);
                            height: 100%;
                            width: 0%;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                </div>
                <div style="font-size: 0.9em; color: #7f8c8d;">
                    スライド: <span id="slide-progress">1/${this.totalSlides}</span><br>
                    学習時間: <span id="time-spent">0分</span>
                </div>
                <div style="margin-top: 10px;">
                    <button id="mark-complete-btn" onclick="elearningTracker.markComplete()" style="
                        background: #27ae60;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.9em;
                        font-weight: 600;
                        width: 100%;
                    ">レッスン完了</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', progressHtml);
    }

    addDemoButtons() {
        // 実演課題ボタンを各スライドに追加
        const demoTasks = this.getDemoTasks();
        
        demoTasks.forEach(task => {
            const targetSlide = document.querySelector(`[data-demo="${task.id}"]`);
            if (targetSlide || task.slideSelector) {
                const slideElement = targetSlide || document.querySelector(task.slideSelector);
                if (slideElement) {
                    const demoButton = `
                        <div style="
                            background: #3498db;
                            color: white;
                            padding: 20px;
                            border-radius: 12px;
                            margin: 30px 0;
                            border-left: 5px solid #2980b9;
                        ">
                            <h3 style="margin-bottom: 10px;">🎯 実演課題: ${task.title}</h3>
                            <p style="margin-bottom: 15px; opacity: 0.9;">${task.description}</p>
                            <button onclick="elearningTracker.submitDemo('${task.id}', '${task.title}')" style="
                                background: #2980b9;
                                color: white;
                                border: none;
                                padding: 12px 24px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 600;
                            ">実演を提出する</button>
                        </div>
                    `;
                    slideElement.querySelector('.slide-content').insertAdjacentHTML('beforeend', demoButton);
                }
            }
        });
    }

    getDemoTasks() {
        // レッスンごとの実演課題定義
        const tasks = {
            1: [
                {
                    id: "hello-world",
                    title: "Hello Worldプログラム作成",
                    description: "Claude Codeを使って、名前を入力してあいさつするプログラムを作成してください。",
                    slideSelector: ".slide-container:nth-child(10)" // 実習スライド
                },
                {
                    id: "calculator",
                    title: "計算プログラム作成",
                    description: "2つの数字を足し算する電卓プログラムを作成してください。",
                    slideSelector: ".slide-container:nth-child(10)"
                }
            ],
            2: [
                {
                    id: "text-replacement",
                    title: "テキスト置換ツール作成",
                    description: "複数のテキストファイルの文字列を一括置換するツールを作成してください。",
                    slideSelector: ".slide-container:nth-child(11)" // 実習スライド
                },
                {
                    id: "github-upload",
                    title: "GitHubへのアップロード",
                    description: "作成したプログラムをGitHubにアップロードしてください。",
                    slideSelector: ".slide-container:nth-child(12)"
                }
            ],
            3: [
                {
                    id: "csv-excel",
                    title: "CSV→Excel変換ツール",
                    description: "MCPを使用してCSVファイルをExcelに変換するツールを作成してください。",
                    slideSelector: ".slide-container:nth-child(10)"
                },
                {
                    id: "image-batch",
                    title: "画像一括処理",
                    description: "MCPを使用して画像の一括リサイズ処理を実装してください。",
                    slideSelector: ".slide-container:nth-child(11)"
                }
            ],
            4: [
                {
                    id: "screenshot-auto",
                    title: "スクリーンショット自動取得",
                    description: "Playwrightを使って複数サイトのスクリーンショットを自動取得するプログラムを作成してください。",
                    slideSelector: ".slide-container:nth-child(9)"
                },
                {
                    id: "form-automation",
                    title: "フォーム自動入力",
                    description: "Playwrightを使ってWebフォームへの自動入力を実装してください。",
                    slideSelector: ".slide-container:nth-child(10)"
                }
            ],
            5: [
                {
                    id: "news-collector",
                    title: "ニュース収集ツール",
                    description: "全ての学習内容を組み合わせてニュース自動収集ツールを作成してください。",
                    slideSelector: ".slide-container:nth-child(7)"
                },
                {
                    id: "form-automation-tool",
                    title: "フォーム自動化ツール",
                    description: "Webフォーム自動化の総合ツールを作成してください。",
                    slideSelector: ".slide-container:nth-child(9)"
                },
                {
                    id: "original-tool",
                    title: "オリジナルツール作成",
                    description: "学んだ技術を組み合わせてオリジナルの業務効率化ツールを作成してください。",
                    slideSelector: ".slide-container:nth-child(10)"
                }
            ]
        };

        return tasks[this.lessonId] || [];
    }

    setupSlideTracking() {
        // 既存のslide change関数をフック
        const originalChangeSlide = window.changeSlide;
        if (originalChangeSlide) {
            window.changeSlide = (n) => {
                originalChangeSlide(n);
                this.currentSlide = window.currentSlide || this.currentSlide + n;
                this.updateProgress();
            };
        }

        // showSlide関数もフック
        const originalShowSlide = window.showSlide;
        if (originalShowSlide) {
            window.showSlide = (n) => {
                originalShowSlide(n);
                this.currentSlide = n;
                this.updateProgress();
            };
        }
    }

    updateProgress() {
        const progressPercent = Math.round((this.currentSlide / this.totalSlides) * 100);
        const progressBar = document.getElementById('progress-bar');
        const slideProgress = document.getElementById('slide-progress');
        const timeSpentElement = document.getElementById('time-spent');

        if (progressBar) progressBar.style.width = `${progressPercent}%`;
        if (slideProgress) slideProgress.textContent = `${this.currentSlide}/${this.totalSlides}`;
        
        this.timeSpent = Math.floor((Date.now() - this.startTime) / 60000);
        if (timeSpentElement) timeSpentElement.textContent = `${this.timeSpent}分`;

        // 完了ボタンの状態更新
        const completeBtn = document.getElementById('mark-complete-btn');
        if (completeBtn) {
            if (this.currentSlide === this.totalSlides) {
                completeBtn.textContent = 'レッスン完了';
                completeBtn.style.background = '#27ae60';
            } else {
                completeBtn.textContent = `レッスン完了 (${this.currentSlide}/${this.totalSlides})`;
                completeBtn.style.background = '#95a5a6';
            }
        }
    }

    async loadProgress() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${this.apiBase}/api/progress`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const progressData = await response.json();
                const lessonProgress = progressData.find(p => p.lesson_id === this.lessonId);
                
                if (lessonProgress) {
                    this.currentSlide = lessonProgress.last_slide || 1;
                    this.timeSpent = lessonProgress.time_spent || 0;
                    
                    // スライドを該当位置に移動
                    if (window.showSlide) {
                        window.showSlide(this.currentSlide);
                    }
                }
            }
        } catch (error) {
            console.error('進捗の読み込みに失敗:', error);
        }
    }

    async saveProgress() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const status = this.currentSlide === this.totalSlides ? 'completed' : 'in_progress';

            await fetch(`${this.apiBase}/api/progress`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lesson_id: this.lessonId,
                    status: status,
                    last_slide: this.currentSlide,
                    time_spent: this.timeSpent
                })
            });
        } catch (error) {
            console.error('進捗の保存に失敗:', error);
        }
    }

    async markComplete() {
        try {
            await this.saveProgress();
            
            if (this.currentSlide < this.totalSlides) {
                const proceed = confirm(`まだ${this.totalSlides - this.currentSlide}スライド残っていますが、完了としますか？`);
                if (!proceed) return;
            }

            const token = localStorage.getItem('token');
            await fetch(`${this.apiBase}/api/progress`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lesson_id: this.lessonId,
                    status: 'completed',
                    last_slide: this.totalSlides,
                    time_spent: this.timeSpent
                })
            });

            alert('レッスンを完了しました！お疲れ様でした。');
            
            // ダッシュボードに戻る
            const returnToDashboard = confirm('受講ダッシュボードに戻りますか？');
            if (returnToDashboard) {
                window.location.href = '/student-dashboard.html';
            }

        } catch (error) {
            console.error('完了処理でエラー:', error);
            alert('完了処理に失敗しました');
        }
    }

    submitDemo(taskId, taskTitle) {
        const evidenceText = prompt(`実演課題「${taskTitle}」の実施内容を記載してください:\n\n例：\n- 実装したコードの説明\n- 実行結果のスクリーンショット\n- 発生した問題と解決方法\n- 学んだことや気づき`);
        
        if (!evidenceText || evidenceText.trim().length < 10) {
            alert('実演内容をもう少し詳しく記載してください（10文字以上）');
            return;
        }

        this.submitDemonstration(taskId, evidenceText);
    }

    async submitDemonstration(taskId, evidenceText) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('ログインが必要です');
                return;
            }

            const response = await fetch(`${this.apiBase}/api/demonstration`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lesson_id: this.lessonId,
                    task_id: taskId,
                    evidence_text: evidenceText
                })
            });

            if (response.ok) {
                alert('実演記録を提出しました！管理者が確認後、承認されます。');
            } else {
                const error = await response.json();
                alert(`提出に失敗しました: ${error.error || '不明なエラー'}`);
            }
        } catch (error) {
            console.error('実演提出エラー:', error);
            alert('提出に失敗しました。ネットワーク接続を確認してください。');
        }
    }
}

// グローバル変数として初期化（各レッスンファイルで使用）
let elearningTracker;

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    // レッスンIDと総スライド数は各ファイルで設定
    if (typeof LESSON_ID !== 'undefined' && typeof TOTAL_SLIDES !== 'undefined') {
        elearningTracker = new ELearningTracker(LESSON_ID, TOTAL_SLIDES);
    }
});

// ダッシュボードへのリンクを追加
document.addEventListener('DOMContentLoaded', () => {
    const dashboardLink = `
        <div style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
        ">
            <a href="/student-dashboard.html" style="
                background: #34495e;
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'Noto Sans JP', sans-serif;
            ">
                🏠 ダッシュボード
            </a>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', dashboardLink);
});