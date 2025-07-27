// Enhanced Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }
    
    init() {
        this.createContainer();
        this.setupStyles();
    }
    
    createContainer() {
        if (document.getElementById('notification-system')) return;
        
        const container = document.createElement('div');
        container.id = 'notification-system';
        container.className = 'notification-system';
        document.body.appendChild(container);
    }
    
    setupStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .notification-system {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 350px;
            }
            
            .notification-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                margin-bottom: 10px;
                overflow: hidden;
                transform: translateX(400px);
                transition: all 0.3s ease;
                border-left: 4px solid #4facfe;
            }
            
            .notification-item.show {
                transform: translateX(0);
            }
            
            .notification-item.success {
                border-left-color: #4caf50;
            }
            
            .notification-item.error {
                border-left-color: #f44336;
            }
            
            .notification-item.warning {
                border-left-color: #ff9800;
            }
            
            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px 8px;
            }
            
            .notification-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: #333;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
                padding: 4px;
                border-radius: 4px;
            }
            
            .notification-close:hover {
                background: #f5f5f5;
            }
            
            .notification-body {
                padding: 0 16px 12px;
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .notification-actions {
                padding: 8px 16px 12px;
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }
            
            .notification-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            .notification-btn.primary {
                background: #4facfe;
                color: white;
            }
            
            .notification-btn.secondary {
                background: #f5f5f5;
                color: #666;
            }
            
            .notification-btn:hover {
                transform: translateY(-1px);
            }
        `;
        document.head.appendChild(styles);
    }
    
    show(options) {
        const {
            type = 'info',
            title = 'Notification',
            message = '',
            duration = 5000,
            actions = []
        } = options;
        
        const id = Date.now().toString();
        const notification = this.createNotification(id, type, title, message, actions);
        
        const container = document.getElementById('notification-system');
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
        
        return id;
    }
    
    createNotification(id, type, title, message, actions) {
        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        notification.dataset.id = id;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">
                    <i class="${icons[type]}"></i>
                    <span>${title}</span>
                </div>
                <button class="notification-close" onclick="notificationSystem.remove('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${message ? `<div class="notification-body">${message}</div>` : ''}
            ${actions.length > 0 ? `
                <div class="notification-actions">
                    ${actions.map(action => `
                        <button class="notification-btn ${action.type || 'secondary'}" 
                                onclick="${action.onClick}; notificationSystem.remove('${id}')">
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        return notification;
    }
    
    remove(id) {
        const notification = document.querySelector(`[data-id="${id}"]`);
        if (notification) {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
    
    success(title, message, actions) {
        return this.show({ type: 'success', title, message, actions });
    }
    
    error(title, message, actions) {
        return this.show({ type: 'error', title, message, actions });
    }
    
    warning(title, message, actions) {
        return this.show({ type: 'warning', title, message, actions });
    }
    
    info(title, message, actions) {
        return this.show({ type: 'info', title, message, actions });
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// Global notification functions
window.showNotification = (message, type = 'info') => {
    notificationSystem.show({
        type,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message
    });
};

window.showSuccessNotification = (message) => {
    notificationSystem.success('Success', message);
};

window.showErrorNotification = (message) => {
    notificationSystem.error('Error', message);
};