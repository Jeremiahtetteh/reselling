// Advanced Features System
class AdvancedFeatures {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupMathRenderer();
        this.setupCollaborativeNotes();
        this.setupVirtualWhiteboard();
        this.setupOfflineMode();
    }
    

    

    
    setupMathRenderer() {
        // LaTeX-style math rendering
        const mathRenderer = document.createElement('script');
        mathRenderer.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
        document.head.appendChild(mathRenderer);
        
        const mathjax = document.createElement('script');
        mathjax.innerHTML = `
            window.MathJax = {
                tex: {
                    inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                    displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
                }
            };
        `;
        document.head.appendChild(mathjax);
        
        const mathjaxScript = document.createElement('script');
        mathjaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        document.head.appendChild(mathjaxScript);
    }
    
    setupCollaborativeNotes() {
        const notesPanel = document.createElement('div');
        notesPanel.innerHTML = `
            <div class="notes-system">
                <div class="notes-toggle" onclick="toggleNotes()">
                    <i class="fas fa-sticky-note"></i>
                </div>
                
                <div class="notes-panel" id="notes-panel">
                    <div class="notes-header">
                        <h3>Study Notes</h3>
                        <div class="notes-actions">
                            <button onclick="shareNotes()"><i class="fas fa-share"></i></button>
                            <button onclick="exportNotes()"><i class="fas fa-download"></i></button>
                            <button onclick="closeNotes()"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    
                    <div class="notes-content">
                        <textarea id="notes-editor" placeholder="Take notes while studying..."></textarea>
                    </div>
                    
                    <div class="notes-footer">
                        <button onclick="saveNotes()" class="save-btn">
                            <i class="fas fa-save"></i> Auto-saved
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const styles = document.createElement('style');
        styles.textContent = `
            .notes-system {
                position: fixed;
                top: 100px;
                left: 20px;
                z-index: 999;
            }
            
            .notes-toggle {
                width: 50px;
                height: 50px;
                background: #ffa502;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .notes-toggle:hover {
                transform: scale(1.1);
            }
            
            .notes-panel {
                position: absolute;
                top: 0;
                left: 60px;
                width: 300px;
                height: 400px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }
            
            .notes-panel.open {
                display: flex;
            }
            
            .notes-header {
                background: #ffa502;
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notes-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            .notes-actions button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.3rem;
            }
            
            .notes-content {
                flex: 1;
                padding: 1rem;
            }
            
            #notes-editor {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                resize: none;
                font-family: inherit;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            .notes-footer {
                padding: 1rem;
                border-top: 1px solid #eee;
                text-align: center;
            }
            
            .save-btn {
                background: #2ed573;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.8rem;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(notesPanel);
        
        // Auto-save notes
        setInterval(() => {
            const notes = document.getElementById('notes-editor')?.value;
            if (notes) {
                localStorage.setItem('studyNotes', notes);
            }
        }, 5000);
        
        // Load saved notes
        setTimeout(() => {
            const savedNotes = localStorage.getItem('studyNotes');
            if (savedNotes && document.getElementById('notes-editor')) {
                document.getElementById('notes-editor').value = savedNotes;
            }
        }, 1000);
    }
    
    setupVirtualWhiteboard() {
        const whiteboard = document.createElement('div');
        whiteboard.innerHTML = `
            <div class="whiteboard-system">
                <div class="whiteboard-toggle" onclick="toggleWhiteboard()">
                    <i class="fas fa-chalkboard"></i>
                </div>
                
                <div class="whiteboard-panel" id="whiteboard-panel">
                    <div class="whiteboard-header">
                        <h3>Virtual Whiteboard</h3>
                        <div class="whiteboard-tools">
                            <button onclick="setTool('pen')" class="tool-btn active" data-tool="pen">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button onclick="setTool('eraser')" class="tool-btn" data-tool="eraser">
                                <i class="fas fa-eraser"></i>
                            </button>
                            <button onclick="clearWhiteboard()" class="tool-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button onclick="closeWhiteboard()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <canvas id="whiteboard-canvas" width="600" height="400"></canvas>
                </div>
            </div>
        `;
        
        const styles = document.createElement('style');
        styles.textContent = `
            .whiteboard-system {
                position: fixed;
                top: 160px;
                left: 20px;
                z-index: 999;
            }
            
            .whiteboard-toggle {
                width: 50px;
                height: 50px;
                background: #3742fa;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .whiteboard-panel {
                position: absolute;
                top: 0;
                left: 60px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }
            
            .whiteboard-panel.open {
                display: flex;
            }
            
            .whiteboard-header {
                background: #3742fa;
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .whiteboard-tools {
                display: flex;
                gap: 0.5rem;
            }
            
            .tool-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.5rem;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .tool-btn.active,
            .tool-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            #whiteboard-canvas {
                border: none;
                cursor: crosshair;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(whiteboard);
        
        // Initialize canvas drawing
        setTimeout(() => {
            this.initWhiteboardDrawing();
        }, 1000);
    }
    
    initWhiteboardDrawing() {
        const canvas = document.getElementById('whiteboard-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentTool = 'pen';
        
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (currentTool === 'pen') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
            } else if (currentTool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 10;
            }
            
            ctx.lineTo(x, y);
            ctx.stroke();
        });
        
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        window.setTool = (tool) => {
            currentTool = tool;
            document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        };
        
        window.clearWhiteboard = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }
    

    
    setupOfflineMode() {
        // Service Worker for offline functionality
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
        
        // Offline indicator
        const offlineIndicator = document.createElement('div');
        offlineIndicator.innerHTML = `
            <div class="offline-indicator" id="offline-indicator" style="display: none;">
                <i class="fas fa-wifi-slash"></i>
                <span>Offline Mode</span>
            </div>
        `;
        
        const styles = document.createElement('style');
        styles.textContent = `
            .offline-indicator {
                position: fixed;
                top: 80px;
                right: 20px;
                background: #ff4757;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(offlineIndicator);
        
        // Monitor online/offline status
        window.addEventListener('online', () => {
            document.getElementById('offline-indicator').style.display = 'none';
        });
        
        window.addEventListener('offline', () => {
            document.getElementById('offline-indicator').style.display = 'flex';
        });
    }
}

// Global functions

// Screen recording removed

window.toggleNotes = () => {
    document.getElementById('notes-panel').classList.toggle('open');
};

window.closeNotes = () => {
    document.getElementById('notes-panel').classList.remove('open');
};

window.shareNotes = () => {
    const notes = document.getElementById('notes-editor').value;
    if (navigator.share) {
        navigator.share({
            title: 'My Study Notes',
            text: notes
        });
    } else {
        navigator.clipboard.writeText(notes);
        alert('Notes copied to clipboard!');
    }
};

window.exportNotes = () => {
    const notes = document.getElementById('notes-editor').value;
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-notes.txt';
    a.click();
};

window.saveNotes = () => {
    const notes = document.getElementById('notes-editor').value;
    localStorage.setItem('studyNotes', notes);
};

window.toggleWhiteboard = () => {
    document.getElementById('whiteboard-panel').classList.toggle('open');
};

window.closeWhiteboard = () => {
    document.getElementById('whiteboard-panel').classList.remove('open');
};

// Initialize advanced features
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedFeatures();
});