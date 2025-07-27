// Content Loader - Loads admin-created content into the site
class ContentLoader {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadCustomFeatures();
        this.loadPageContent();
        this.loadVideos();
        this.loadCourses();
        this.loadTools();
        this.applyFeatureToggles();
    }
    
    loadCustomFeatures() {
        const features = JSON.parse(localStorage.getItem('customFeatures') || '[]');
        
        features.forEach(feature => {
            if (feature.enabled) {
                // Create feature element
                const featureElement = document.createElement('div');
                featureElement.innerHTML = feature.code;
                featureElement.className = 'custom-feature';
                featureElement.setAttribute('data-feature', feature.name);
                
                // Add to page
                document.body.appendChild(featureElement);
                
                // Execute any JavaScript in the feature
                const scripts = featureElement.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.head.appendChild(newScript);
                });
            }
        });
    }
    
    loadPageContent() {
        const pageContent = JSON.parse(localStorage.getItem('pageContent') || '{}');
        
        Object.keys(pageContent).forEach(section => {
            const content = pageContent[section];
            const element = document.querySelector(`[data-section="${section}"]`);
            
            if (element) {
                if (content.title) {
                    const titleElement = element.querySelector('h1, h2, h3');
                    if (titleElement) titleElement.textContent = content.title;
                }
                
                if (content.content) {
                    const contentElement = element.querySelector('.content, p');
                    if (contentElement) contentElement.innerHTML = content.content;
                }
                
                if (content.background) {
                    element.style.backgroundImage = `url(${content.background})`;
                }
            }
        });
    }
    
    loadVideos() {
        const videos = JSON.parse(localStorage.getItem('siteVideos') || '[]');
        const videoContainer = document.querySelector('.videos-grid, .video-library');
        
        if (videoContainer && videos.length > 0) {
            const videoHTML = videos.map(video => `
                <div class="video-card">
                    <div class="video-thumbnail">
                        <img src="https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg" alt="${video.title}">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                        <div class="video-meta">
                            <span class="category">${video.category}</span>
                            <span class="price">$${video.price}</span>
                        </div>
                        <button class="btn btn-primary" onclick="showPaymentModal('${video.title}', '${video.price}')">
                            Purchase Video
                        </button>
                    </div>
                </div>
            `).join('');
            
            videoContainer.innerHTML = videoHTML;
        }
    }
    
    loadCourses() {
        const courses = JSON.parse(localStorage.getItem('siteCourses') || '[]');
        const courseContainer = document.querySelector('.courses-grid, .course-library');
        
        if (courseContainer && courses.length > 0) {
            const courseHTML = courses.map(course => `
                <div class="course-card">
                    <div class="course-image">
                        <img src="${course.image || 'https://via.placeholder.com/300x200'}" alt="${course.title}">
                    </div>
                    <div class="course-info">
                        <h3>${course.title}</h3>
                        <p>${course.description}</p>
                        <div class="course-meta">
                            <span class="duration">${course.duration}</span>
                            <span class="price">$${course.price}</span>
                        </div>
                        <button class="btn btn-primary" onclick="showPaymentModal('${course.title}', '${course.price}')">
                            Enroll Now
                        </button>
                    </div>
                </div>
            `).join('');
            
            courseContainer.innerHTML = courseHTML;
        }
    }
    
    loadTools() {
        const tools = JSON.parse(localStorage.getItem('siteTools') || '[]');
        const toolContainer = document.querySelector('.tools-grid, .study-tools');
        
        if (toolContainer && tools.length > 0) {
            const toolHTML = tools.map(tool => `
                <div class="tool-card">
                    <div class="tool-icon">
                        <i class="${tool.icon}"></i>
                    </div>
                    <div class="tool-info">
                        <h3>${tool.name}</h3>
                        <p>${tool.description}</p>
                        <button class="btn btn-primary" onclick="openTool('${tool.url}')">
                            Use Tool
                        </button>
                    </div>
                </div>
            `).join('');
            
            toolContainer.innerHTML = toolHTML;
        }
    }
    
    applyFeatureToggles() {
        const features = JSON.parse(localStorage.getItem('siteFeatures') || '{}');
        
        // Apply feature toggles
        Object.keys(features).forEach(featureName => {
            const isEnabled = features[featureName];
            
            switch(featureName) {
                    
                case 'liveChat':
                    if (!isEnabled) {
                        const chatWidget = document.querySelector('.chat-widget, .live-chat');
                        if (chatWidget) chatWidget.style.display = 'none';
                    }
                    break;
                    
                case 'gamification':
                    if (!isEnabled) {
                        const gameSystem = document.querySelector('.game-system, .gamification');
                        if (gameSystem) gameSystem.style.display = 'none';
                    }
                    break;
                    
                case 'whiteboard':
                    if (!isEnabled) {
                        const whiteboard = document.querySelector('.whiteboard-system');
                        if (whiteboard) whiteboard.style.display = 'none';
                    }
                    break;
                    
                case 'notes':
                    if (!isEnabled) {
                        const notes = document.querySelector('.notes-system');
                        if (notes) notes.style.display = 'none';
                    }
                    break;
                    
                case 'payments':
                    if (!isEnabled) {
                        const paymentButtons = document.querySelectorAll('.btn-primary[onclick*="showPaymentModal"]');
                        paymentButtons.forEach(btn => btn.style.display = 'none');
                    }
                    break;
            }
        });
    }
}

// Global function for tools
window.openTool = (url) => {
    if (url.startsWith('http')) {
        window.open(url, '_blank');
    } else {
        // Assume it's a JavaScript function
        try {
            eval(url);
        } catch (error) {
            console.error('Error executing tool function:', error);
        }
    }
};

// Initialize content loader
document.addEventListener('DOMContentLoaded', () => {
    new ContentLoader();
});