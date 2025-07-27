document.addEventListener('DOMContentLoaded', function() {
    // Load videos from database
    async function loadVideos() {
        const videosContainer = document.querySelector('.videos-grid');
        if (!videosContainer) return;
        
        try {
            // Fetch videos from Node.js API
            const response = await fetch('http://localhost:3000/api/videos');
            const videos = await response.json();
            
            // Keep the first 3 existing videos if they exist
            const existingVideos = videosContainer.querySelectorAll('.video-card');
            const existingCount = Math.min(existingVideos.length, 3);
            
            // If we have admin-added videos, add them after the existing ones
            if (videos && videos.length > 0) {
                videos.forEach((video, index) => {
                    // Skip if we already have 3 videos displayed
                    if (existingCount + index >= 3) return;
                    
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card';
                    videoCard.innerHTML = `
                        <div class="thumbnail">
                            <img src="${video.thumbnailPath}" alt="${video.title}">
                            <span class="duration">${video.duration}</span>
                        </div>
                        <div class="video-info">
                            <h3>${video.title}</h3>
                            <p>${video.description}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                <span style="font-weight: 600; color: var(--primary-color)">$${parseFloat(video.price).toFixed(2)}</span>
                                <a href="#" class="btn btn-small btn-primary video-purchase-btn" data-id="${video._id}">Purchase</a>
                            </div>
                        </div>
                    `;
                    
                    videosContainer.appendChild(videoCard);
                    
                    // Add click event to play the video
                    videoCard.addEventListener('click', function(e) {
                        // Don't trigger if clicking the purchase button
                        if (e.target.classList.contains('video-purchase-btn')) return;
                        
                        // Track video play and show modal
                        Analytics.trackVideoPlay(video._id, video.title);
                        showVideoModal(video);
                    });
                });
                
                // Add purchase button event listeners
                document.querySelectorAll('.video-purchase-btn').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const videoId = this.getAttribute('data-id');
                        const video = videos.find(v => v._id == videoId);
                        
                        if (video) {
                            // Process payment
                            Payment.processPayment(video._id, video.title, video.price)
                                .then(result => {
                                    showNotification(`Payment successful! You now have access to "${video.title}"`, 'success');
                                    Analytics.trackPurchase(video._id, video.title, video.price);
                                })
                                .catch(error => {
                                    if (error !== 'Payment cancelled') {
                                        showNotification('Payment failed. Please try again.', 'error');
                                    }
                                });
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }
    
    // Show video in modal
    async function showVideoModal(video) {
        // Create modal element with loading indicator
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <span class="close-modal">&times;</span>
                <div class="video-container">
                    <div class="video-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading video...</p>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <div class="video-purchase">
                        <span class="video-price">$${parseFloat(video.price).toFixed(2)}</span>
                        <button class="btn btn-primary purchase-btn" data-id="${video._id}">Purchase Full Course</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Try to load video from file path
        try {
            if (video.filePath) {
                // Use the file path from the database
                const videoContainer = modal.querySelector('.video-container');
                videoContainer.innerHTML = `
                    <video controls autoplay>
                        <source src="${video.filePath}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
            } else {
                // Fallback to thumbnail if no video path
                const videoContainer = modal.querySelector('.video-container');
                videoContainer.innerHTML = `
                    <div class="video-placeholder">
                        <img src="${video.thumbnailPath}" alt="${video.title}">
                        <div class="play-overlay">
                            <i class="fas fa-play-circle"></i>
                        </div>
                    </div>
                    <p class="video-note">Note: This is a preview. The full video is available after purchase.</p>
                `;
            }
        } catch (error) {
            console.error('Error loading video:', error);
            // Show error message
            const videoContainer = modal.querySelector('.video-container');
            videoContainer.innerHTML = `
                <div class="video-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading video. Please try again later.</p>
                </div>
                <div class="video-placeholder">
                    <img src="${video.thumbnailPath}" alt="${video.title}">
                </div>
            `;
        }
        
        // Close modal when clicking X or outside
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
        
        // Purchase button functionality
        const purchaseBtn = modal.querySelector('.purchase-btn');
        purchaseBtn.addEventListener('click', () => {
            showNotification(`Thank you for purchasing "${video.title}" for $${parseFloat(video.price).toFixed(2)}!`, 'success');
        });
    }
    
    // Load products from database
    async function loadProducts() {
        const toolsContainer = document.querySelector('.tools-grid');
        if (!toolsContainer) return;
        
        try {
            // Fetch products from Node.js API
            const response = await fetch('http://localhost:3000/api/products');
            const products = await response.json();
            
            // Only display products in the tools section if they are of category 'tool'
            const toolProducts = products.filter(product => product.category === 'tool');
            
            // Keep the first 3 existing tools if they exist
            const existingTools = toolsContainer.querySelectorAll('.tool-card');
            const existingCount = Math.min(existingTools.length, 3);
            
            // If we have admin-added tool products, add them after the existing ones
            if (toolProducts && toolProducts.length > 0) {
                toolProducts.forEach((product, index) => {
                    // Skip if we already have 3 tools displayed
                    if (existingCount + index >= 3) return;
                    
                    const toolCard = document.createElement('div');
                    toolCard.className = 'tool-card';
                    toolCard.innerHTML = `
                        <div class="tool-icon"><img src="${product.imagePath}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"></div>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <a href="#" class="btn btn-small product-purchase-btn" data-id="${product._id}">$${parseFloat(product.price).toFixed(2)}</a>
                    `;
                    
                    toolsContainer.appendChild(toolCard);
                });
                
                // Add purchase button event listeners
                document.querySelectorAll('.product-purchase-btn').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        const productId = this.getAttribute('data-id');
                        const product = toolProducts.find(p => p._id == productId);
                        
                        if (product) {
                            showNotification(`Thank you for purchasing "${product.name}" for $${parseFloat(product.price).toFixed(2)}!`, 'success');
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }
    
    // Helper function to extract YouTube ID from URL
    function getYouTubeId(url) {
        if (!url) return '';
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : '';
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '1002';
            notificationContainer.style.maxWidth = '300px';
            document.body.appendChild(notificationContainer);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.padding = '15px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        notification.style.color = 'white';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.animation = 'slideIn 0.3s ease-out forwards';
        
        // Set background color based on type
        if (type === 'success') notification.style.backgroundColor = '#4caf50';
        else if (type === 'error') notification.style.backgroundColor = '#f44336';
        else notification.style.backgroundColor = '#2196f3'; // info
        
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px; font-size: 16px;">&times;</button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Add CSS for animation if it doesn't exist
        if (!document.getElementById('notification-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'notification-styles';
            styleEl.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                if (notification.parentNode === notificationContainer) {
                    notificationContainer.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                if (notification.parentNode === notificationContainer) {
                    notificationContainer.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Add video styles
    addVideoStyles();
    
    // Load content
    loadVideos();
    loadProducts();
});

// Add CSS for video loading and error states
function addVideoStyles() {
    if (!document.getElementById('video-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'video-styles';
        styleEl.textContent = `
            .video-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }
            
            .video-modal.active {
                display: flex;
            }
            
            .video-modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 800px;
                position: relative;
                overflow: hidden;
            }
            
            .close-modal {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 2rem;
                color: white;
                cursor: pointer;
                z-index: 1001;
            }
            
            .video-container {
                position: relative;
                padding-bottom: 56.25%; /* 16:9 aspect ratio */
                height: 0;
            }
            
            .video-container video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .video-info {
                padding: 1.5rem;
            }
            
            .video-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 300px;
                background-color: #f8f9fa;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .video-loading i {
                font-size: 3rem;
                color: #4a80f0;
                margin-bottom: 1rem;
            }
            
            .video-error {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                background-color: #fff5f5;
                color: #e53e3e;
                margin-bottom: 1rem;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .video-error i {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .video-placeholder {
                position: relative;
                width: 100%;
                height: 100%;
                background-color: #000;
                position: absolute;
                top: 0;
                left: 0;
            }
            
            .video-placeholder img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .play-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(0, 0, 0, 0.3);
            }
            
            .play-overlay i {
                font-size: 4rem;
                color: white;
                opacity: 0.8;
            }
            
            .video-note {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px;
                text-align: center;
                font-style: italic;
            }
            
            .video-purchase {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1rem;
            }
            
            .video-price {
                font-weight: 600;
                color: #4a80f0;
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(styleEl);
    }
}