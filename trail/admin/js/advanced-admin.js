// Advanced Admin Panel JavaScript
class AdvancedAdmin {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupAnimations();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(link.dataset.section);
            });
        });
        
        // Forms
        this.setupFormHandlers();
        
        // Mobile menu
        document.getElementById('mobile-menu')?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
    }
    
    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Update title
        const titles = {
            'dashboard': 'Dashboard Overview',
            'content': 'Add New Content',
            'manage': 'Manage Content',
            'analytics': 'Analytics Dashboard',
            'settings': 'Site Settings',
            'themes': 'Themes & Design',
            'users': 'User Management',
            'backup': 'Backup & Export'
        };
        
        document.getElementById('page-title').textContent = titles[sectionName];
        this.currentSection = sectionName;
        
        // Load section-specific data
        this.loadSectionData(sectionName);
    }
    
    setupFormHandlers() {
        // Video form
        document.getElementById('video-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleVideoUpload(e.target);
        });
        
        // Product form
        document.getElementById('product-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleProductUpload(e.target);
        });
    }
    
    async handleVideoUpload(form) {
        const formData = new FormData();
        
        // Get form data
        formData.append('title', form.querySelector('#video-title').value);
        formData.append('category', form.querySelector('#video-category').value);
        formData.append('description', form.querySelector('#video-description').value);
        formData.append('duration', form.querySelector('#video-duration').value);
        formData.append('price', form.querySelector('#video-price').value);
        formData.append('video', form.querySelector('#video-file').files[0]);
        formData.append('thumbnail', form.querySelector('#video-thumbnail').files[0]);
        formData.append('addToCourse', true);
        
        try {
            this.showLoadingNotification('Uploading video...');
            
            const response = await fetch('http://localhost:3000/api/videos', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccessNotification('Video uploaded successfully!');
                form.reset();
                this.loadDashboardData();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showErrorNotification('Upload failed: ' + error.message);
        }
    }
    
    async handleProductUpload(form) {
        const formData = new FormData();
        
        // Get form data
        formData.append('name', form.querySelector('#product-name').value);
        formData.append('category', form.querySelector('#product-category').value);
        formData.append('description', form.querySelector('#product-description').value);
        formData.append('price', form.querySelector('#product-price').value);
        formData.append('image', form.querySelector('#product-image').files[0]);
        formData.append('addToCourse', true);
        
        try {
            this.showLoadingNotification('Adding product...');
            
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccessNotification('Product added successfully!');
                form.reset();
                this.loadDashboardData();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showErrorNotification('Upload failed: ' + error.message);
        }
    }
    
    async loadDashboardData() {
        try {
            // Load videos
            const videosResponse = await fetch('http://localhost:3000/api/videos');
            const videos = await videosResponse.json();
            
            // Load products
            const productsResponse = await fetch('http://localhost:3000/api/products');
            const products = await productsResponse.json();
            
            // Load visitors
            const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
            
            // Load purchases
            const purchases = JSON.parse(localStorage.getItem('purchaseAttempts') || '[]');
            
            // Update stats
            this.updateStats({
                videos: videos.length || 0,
                products: products.length || 0,
                visitors: visitors.length || 0,
                purchases: purchases.length || 0
            });
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    updateStats(stats) {
        this.animateCounter('total-videos', stats.videos);
        this.animateCounter('total-products', stats.products);
        this.animateCounter('total-visitors', stats.visitors);
        this.animateCounter('total-purchases', stats.purchases);
    }
    
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'manage':
                this.loadManageContent();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }
    
    loadAnalytics() {
        // Load analytics data
        console.log('Loading analytics...');
    }
    
    loadManageContent() {
        // Load content management
        console.log('Loading content management...');
    }
    
    loadSettings() {
        // Load settings
        console.log('Loading settings...');
    }
    
    setupAnimations() {
        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });
        
        document.querySelectorAll('.stat-card, .feature-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    toggleMobileMenu() {
        document.getElementById('sidebar').classList.toggle('active');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle',
            'loading': 'fas fa-spinner fa-spin'
        };
        
        notification.innerHTML = `
            <i class="${icons[type]}" style="margin-right: 0.5rem;"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        if (type !== 'loading') {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        }
        
        return notification;
    }
    
    showSuccessNotification(message) {
        return this.showNotification(message, 'success');
    }
    
    showErrorNotification(message) {
        return this.showNotification(message, 'error');
    }
    
    showLoadingNotification(message) {
        return this.showNotification(message, 'loading');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAdmin();
});