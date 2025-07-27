// Live Chat System
class LiveChat {
    constructor() {
        this.isOpen = false;
        this.messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        this.init();
    }
    
    init() {
        this.createChatWidget();
        this.setupEventListeners();
    }
    
    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <div class="chat-widget" id="chat-widget">
                <div class="chat-toggle" id="chat-toggle">
                    <i class="fas fa-comments"></i>
                    <span class="chat-badge" id="chat-badge">1</span>
                </div>
                
                <div class="chat-window" id="chat-window">
                    <div class="chat-header">
                        <div class="chat-title">
                            <i class="fas fa-headset"></i>
                            <span>MathCenter Support</span>
                        </div>
                        <button class="chat-close" id="chat-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>Hi! I'm here to help you with any questions about our math courses. How can I assist you today?</p>
                                <span class="message-time">${new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Type your message..." maxlength="500">
                        <button id="chat-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
        this.addChatStyles();
    }
    
    addChatStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                font-family: Arial, sans-serif;
            }
            
            .chat-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #4facfe, #00f2fe);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            
            .chat-toggle i {
                color: white;
                font-size: 1.5rem;
            }
            
            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4757;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bold;
            }
            
            .chat-window {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 350px;
                height: 450px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .chat-window.open {
                display: flex;
            }
            
            .chat-header {
                background: linear-gradient(45deg, #4facfe, #00f2fe);
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chat-title {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
            }
            
            .chat-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .chat-close:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .chat-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .message {
                display: flex;
                gap: 0.5rem;
                max-width: 80%;
            }
            
            .bot-message {
                align-self: flex-start;
            }
            
            .user-message {
                align-self: flex-end;
                flex-direction: row-reverse;
            }
            
            .message-avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                flex-shrink: 0;
            }
            
            .bot-message .message-avatar {
                background: #e3f2fd;
                color: #1976d2;
            }
            
            .user-message .message-avatar {
                background: #4facfe;
                color: white;
            }
            
            .message-content {
                background: #f5f5f5;
                padding: 0.8rem;
                border-radius: 15px;
                position: relative;
            }
            
            .user-message .message-content {
                background: #4facfe;
                color: white;
            }
            
            .message-content p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .message-time {
                font-size: 0.7rem;
                opacity: 0.7;
                display: block;
                margin-top: 0.3rem;
            }
            
            .chat-input-container {
                padding: 1rem;
                border-top: 1px solid #eee;
                display: flex;
                gap: 0.5rem;
            }
            
            #chat-input {
                flex: 1;
                padding: 0.8rem;
                border: 1px solid #ddd;
                border-radius: 20px;
                outline: none;
                font-size: 0.9rem;
            }
            
            #chat-input:focus {
                border-color: #4facfe;
            }
            
            #chat-send {
                background: #4facfe;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            #chat-send:hover {
                background: #3a9ef0;
            }
            
            @media (max-width: 768px) {
                .chat-window {
                    width: 300px;
                    height: 400px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    setupEventListeners() {
        document.getElementById('chat-toggle').addEventListener('click', () => {
            this.toggleChat();
        });
        
        document.getElementById('chat-close').addEventListener('click', () => {
            this.closeChat();
        });
        
        document.getElementById('chat-send').addEventListener('click', () => {
            this.sendMessage();
        });
        
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatBadge = document.getElementById('chat-badge');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add('open');
            chatBadge.style.display = 'none';
            this.isOpen = true;
        }
    }
    
    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('open');
        this.isOpen = false;
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            this.generateBotResponse(message);
        }, 1000);
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        const isBot = sender === 'bot';
        const avatar = isBot ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save to localStorage
        this.messages.push({ text, sender, timestamp: Date.now() });
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }
    
    generateBotResponse(userMessage) {
        const responses = {
            'hello': 'Hi there! How can I help you with your math learning today?',
            'hi': 'Hello! I\'m here to assist you with any questions about our courses.',
            'price': 'Our courses range from $19.99 to $49.99. Each course includes video lessons, practice problems, and lifetime access.',
            'payment': 'We accept PayPal, Cash App, Mobile Money, and Credit Cards. All payments are secure and processed instantly.',
            'course': 'We offer courses in Algebra, Calculus, Geometry, Trigonometry, Statistics, and SAT Prep. Which subject interests you?',
            'help': 'I can help you with course information, pricing, payment methods, and technical support. What do you need help with?',
            'support': 'For technical support, you can contact us through the contact form or email info@mathcenter.com',
            'access': 'After purchasing a course, it needs admin approval (usually within minutes). You\'ll then get full access through your dashboard.',
            'refund': 'We offer a 30-day money-back guarantee if you\'re not satisfied with your course.',
            'default': 'Thanks for your message! For detailed support, please use our contact form or email info@mathcenter.com. An admin will get back to you soon!'
        };
        
        let response = responses.default;
        
        // Simple keyword matching
        const message = userMessage.toLowerCase();
        for (const [keyword, reply] of Object.entries(responses)) {
            if (message.includes(keyword)) {
                response = reply;
                break;
            }
        }
        
        this.addMessage(response, 'bot');
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiveChat();
});