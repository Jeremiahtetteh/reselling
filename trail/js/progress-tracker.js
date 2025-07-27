// Progress Tracking System
class ProgressTracker {
    constructor() {
        this.progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        this.init();
    }
    
    init() {
        this.createProgressBar();
        this.trackPageProgress();
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.innerHTML = `
            <div class="progress-tracker" id="progress-tracker">
                <div class="progress-fill" id="progress-fill"></div>
                <div class="progress-text" id="progress-text">0%</div>
            </div>
        `;
        
        document.body.appendChild(progressBar);
        this.addProgressStyles();
    }
    
    addProgressStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .progress-tracker {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.2);
                z-index: 9999;
                transition: opacity 0.3s ease;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4facfe, #00f2fe);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                display: none;
            }
        `;
        document.head.appendChild(styles);
    }
    
    trackPageProgress() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            this.updateProgress(Math.min(scrollPercent, 100));
        });
    }
    
    updateProgress(percent) {
        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('progress-text');
        
        if (fill) {
            fill.style.width = percent + '%';
        }
        
        if (text) {
            text.textContent = Math.round(percent) + '%';
            text.style.display = percent > 10 ? 'block' : 'none';
        }
    }
    
    trackCourseProgress(courseId, progress) {
        this.progress[courseId] = progress;
        localStorage.setItem('userProgress', JSON.stringify(this.progress));
        
        if (window.notificationSystem) {
            notificationSystem.info('Progress Saved', `Course progress: ${progress}%`);
        }
    }
    
    getCourseProgress(courseId) {
        return this.progress[courseId] || 0;
    }
}

// Initialize progress tracker
document.addEventListener('DOMContentLoaded', () => {
    new ProgressTracker();
});