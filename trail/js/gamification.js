// Gamification System
class MathGameSystem {
    constructor() {
        this.userStats = JSON.parse(localStorage.getItem('mathGameStats') || '{}');
        this.achievements = [
            { id: 'first_purchase', name: 'First Steps', desc: 'Made your first course purchase', icon: 'fas fa-baby', points: 100 },
            { id: 'course_complete', name: 'Course Master', desc: 'Completed your first course', icon: 'fas fa-graduation-cap', points: 500 },
            { id: 'streak_7', name: 'Week Warrior', desc: 'Studied for 7 days straight', icon: 'fas fa-fire', points: 300 },
            { id: 'quiz_master', name: 'Quiz Champion', desc: 'Scored 100% on 5 quizzes', icon: 'fas fa-trophy', points: 400 },
            { id: 'helper', name: 'Community Helper', desc: 'Helped 10 other students', icon: 'fas fa-hands-helping', points: 250 }
        ];
        this.init();
    }
    
    init() {
        this.createGameInterface();
        this.checkDailyLogin();
        this.updateDisplay();
    }
    
    createGameInterface() {
        const gameSystem = document.createElement('div');
        gameSystem.innerHTML = `
            <div class="game-system">
                <div class="game-toggle" onclick="toggleGamePanel()">
                    <i class="fas fa-gamepad"></i>
                    <span class="level-badge">${this.getLevel()}</span>
                </div>
                
                <div class="game-panel" id="game-panel">
                    <div class="game-header">
                        <h3><i class="fas fa-trophy"></i> Math Champion</h3>
                        <button onclick="closeGamePanel()"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div class="player-stats">
                        <div class="stat-item">
                            <div class="stat-icon"><i class="fas fa-star"></i></div>
                            <div>
                                <div class="stat-value" id="total-points">0</div>
                                <div class="stat-label">Points</div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon"><i class="fas fa-level-up-alt"></i></div>
                            <div>
                                <div class="stat-value" id="current-level">1</div>
                                <div class="stat-label">Level</div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon"><i class="fas fa-fire"></i></div>
                            <div>
                                <div class="stat-value" id="streak-days">0</div>
                                <div class="stat-label">Day Streak</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="progress-section">
                        <h4>Level Progress</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" id="level-progress"></div>
                        </div>
                        <div class="progress-text" id="progress-text">0 / 1000 XP</div>
                    </div>
                    
                    <div class="achievements-section">
                        <h4>Achievements</h4>
                        <div class="achievements-grid" id="achievements-grid">
                            <!-- Achievements will be loaded here -->
                        </div>
                    </div>
                    
                    <div class="daily-challenges">
                        <h4>Daily Challenges</h4>
                        <div class="challenge-list" id="challenge-list">
                            <!-- Daily challenges will be loaded here -->
                        </div>
                    </div>
                    
                    <div class="leaderboard">
                        <h4>Leaderboard</h4>
                        <div class="leaderboard-list" id="leaderboard-list">
                            <!-- Leaderboard will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(gameSystem);
        this.addGameStyles();
    }
    
    addGameStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .game-system {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 999;
            }
            
            .game-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #ffd700, #ffb347);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .game-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(255, 215, 0, 0.6);
            }
            
            .game-toggle i {
                color: white;
                font-size: 1.5rem;
            }
            
            .level-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4757;
                color: white;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bold;
            }
            
            .game-panel {
                position: absolute;
                top: 0;
                right: 70px;
                width: 400px;
                max-height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }
            
            .game-panel.open {
                display: flex;
            }
            
            .game-header {
                background: linear-gradient(45deg, #ffd700, #ffb347);
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .game-header button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.5rem;
            }
            
            .player-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                padding: 1rem;
                border-bottom: 1px solid #eee;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                text-align: center;
            }
            
            .stat-icon {
                width: 40px;
                height: 40px;
                background: #f0f8ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #4facfe;
            }
            
            .stat-value {
                font-size: 1.2rem;
                font-weight: bold;
                color: #333;
            }
            
            .stat-label {
                font-size: 0.8rem;
                color: #666;
            }
            
            .progress-section {
                padding: 1rem;
                border-bottom: 1px solid #eee;
            }
            
            .progress-bar {
                width: 100%;
                height: 10px;
                background: #f0f0f0;
                border-radius: 5px;
                overflow: hidden;
                margin: 0.5rem 0;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4facfe, #00f2fe);
                transition: width 0.3s ease;
            }
            
            .progress-text {
                text-align: center;
                font-size: 0.9rem;
                color: #666;
            }
            
            .achievements-section, .daily-challenges, .leaderboard {
                padding: 1rem;
                border-bottom: 1px solid #eee;
                max-height: 150px;
                overflow-y: auto;
            }
            
            .achievements-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 0.5rem;
            }
            
            .achievement-item {
                text-align: center;
                padding: 0.5rem;
                border-radius: 10px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .achievement-item.unlocked {
                background: #d4edda;
                color: #155724;
            }
            
            .achievement-item.locked {
                background: #f8f9fa;
                color: #6c757d;
                opacity: 0.6;
            }
            
            .achievement-icon {
                font-size: 1.5rem;
                margin-bottom: 0.3rem;
            }
            
            .achievement-name {
                font-size: 0.7rem;
                font-weight: bold;
            }
            
            .challenge-item, .leaderboard-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                margin-bottom: 0.5rem;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .challenge-progress {
                font-size: 0.8rem;
                color: #4facfe;
                font-weight: bold;
            }
        `;
        document.head.appendChild(styles);
    }
    
    checkDailyLogin() {
        const today = new Date().toDateString();
        const lastLogin = this.userStats.lastLogin;
        
        if (lastLogin !== today) {
            if (lastLogin === new Date(Date.now() - 86400000).toDateString()) {
                this.userStats.streak = (this.userStats.streak || 0) + 1;
            } else {
                this.userStats.streak = 1;
            }
            
            this.userStats.lastLogin = today;
            this.addPoints(50, 'Daily login bonus!');
            this.saveStats();
        }
    }
    
    addPoints(points, reason = '') {
        this.userStats.totalPoints = (this.userStats.totalPoints || 0) + points;
        this.saveStats();
        this.updateDisplay();
        
        if (reason) {
            this.showPointsNotification(points, reason);
        }
        
        this.checkLevelUp();
        this.checkAchievements();
    }
    
    getLevel() {
        const points = this.userStats.totalPoints || 0;
        return Math.floor(points / 1000) + 1;
    }
    
    checkLevelUp() {
        const currentLevel = this.getLevel();
        const lastLevel = this.userStats.lastLevel || 1;
        
        if (currentLevel > lastLevel) {
            this.userStats.lastLevel = currentLevel;
            this.saveStats();
            this.showLevelUpNotification(currentLevel);
        }
    }
    
    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.userStats.achievements) this.userStats.achievements = [];
            
            if (!this.userStats.achievements.includes(achievement.id)) {
                let unlocked = false;
                
                switch(achievement.id) {
                    case 'first_purchase':
                        const purchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
                        unlocked = Object.keys(purchases).length > 0;
                        break;
                    case 'streak_7':
                        unlocked = (this.userStats.streak || 0) >= 7;
                        break;
                }
                
                if (unlocked) {
                    this.userStats.achievements.push(achievement.id);
                    this.addPoints(achievement.points, `Achievement unlocked: ${achievement.name}!`);
                }
            }
        });
    }
    
    updateDisplay() {
        document.getElementById('total-points').textContent = this.userStats.totalPoints || 0;
        document.getElementById('current-level').textContent = this.getLevel();
        document.getElementById('streak-days').textContent = this.userStats.streak || 0;
        
        const currentPoints = this.userStats.totalPoints || 0;
        const currentLevel = this.getLevel();
        const pointsForCurrentLevel = (currentLevel - 1) * 1000;
        const pointsForNextLevel = currentLevel * 1000;
        const progressPoints = currentPoints - pointsForCurrentLevel;
        const progressPercent = (progressPoints / 1000) * 100;
        
        document.getElementById('level-progress').style.width = progressPercent + '%';
        document.getElementById('progress-text').textContent = `${progressPoints} / 1000 XP`;
        
        this.updateAchievements();
        this.updateChallenges();
        this.updateLeaderboard();
    }
    
    updateAchievements() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;
        
        grid.innerHTML = this.achievements.map(achievement => {
            const unlocked = (this.userStats.achievements || []).includes(achievement.id);
            return `
                <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}" title="${achievement.desc}">
                    <div class="achievement-icon"><i class="${achievement.icon}"></i></div>
                    <div class="achievement-name">${achievement.name}</div>
                </div>
            `;
        }).join('');
    }
    
    updateChallenges() {
        const challenges = [
            { name: 'Complete a quiz', progress: '0/1', points: 100 },
            { name: 'Watch 3 videos', progress: '0/3', points: 150 },
            { name: 'Study for 30 minutes', progress: '0/30', points: 200 }
        ];
        
        const list = document.getElementById('challenge-list');
        if (!list) return;
        
        list.innerHTML = challenges.map(challenge => `
            <div class="challenge-item">
                <div>
                    <div>${challenge.name}</div>
                    <div class="challenge-progress">${challenge.progress}</div>
                </div>
                <div>+${challenge.points} XP</div>
            </div>
        `).join('');
    }
    
    updateLeaderboard() {
        const leaderboard = [
            { name: 'MathWiz2023', points: 15420, level: 16 },
            { name: 'AlgebraKing', points: 12890, level: 13 },
            { name: 'You', points: this.userStats.totalPoints || 0, level: this.getLevel() },
            { name: 'GeometryGuru', points: 8750, level: 9 },
            { name: 'CalculusChamp', points: 7200, level: 8 }
        ].sort((a, b) => b.points - a.points);
        
        const list = document.getElementById('leaderboard-list');
        if (!list) return;
        
        list.innerHTML = leaderboard.slice(0, 5).map((player, index) => `
            <div class="leaderboard-item ${player.name === 'You' ? 'current-user' : ''}">
                <div>
                    <strong>#${index + 1}</strong> ${player.name}
                    <span style="color: #666; font-size: 0.8rem;">Lv.${player.level}</span>
                </div>
                <div>${player.points} XP</div>
            </div>
        `).join('');
    }
    
    showPointsNotification(points, reason) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #ffd700, #ffb347);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
            z-index: 1002;
            animation: bounceIn 0.5s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-star"></i>
                <div>
                    <div style="font-weight: bold;">+${points} XP</div>
                    <div style="font-size: 0.8rem;">${reason}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
    }
    
    showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 1003;
            animation: zoomIn 0.5s ease;
        `;
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
            <h2>LEVEL UP!</h2>
            <p>You've reached Level ${level}!</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: white; color: #ff6b6b; border: none; border-radius: 20px; cursor: pointer;">Awesome!</button>
        `;
        
        document.body.appendChild(notification);
    }
    
    saveStats() {
        localStorage.setItem('mathGameStats', JSON.stringify(this.userStats));
    }
}

// Global functions
function toggleGamePanel() {
    document.getElementById('game-panel').classList.toggle('open');
}

function closeGamePanel() {
    document.getElementById('game-panel').classList.remove('open');
}

// Initialize gamification
document.addEventListener('DOMContentLoaded', () => {
    window.mathGameSystem = new MathGameSystem();
});