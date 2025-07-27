// Simple analytics tracking
const Analytics = {
    // Track page views
    trackPageView: function(page) {
        const data = {
            page: page,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        // Send to server
        fetch('http://localhost:3000/api/analytics/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.log('Analytics error:', err));
    },
    
    // Track video plays
    trackVideoPlay: function(videoId, videoTitle) {
        const data = {
            event: 'video_play',
            videoId: videoId,
            videoTitle: videoTitle,
            timestamp: new Date().toISOString()
        };
        
        fetch('http://localhost:3000/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.log('Analytics error:', err));
    },
    
    // Track purchases
    trackPurchase: function(itemId, itemTitle, price) {
        const data = {
            event: 'purchase',
            itemId: itemId,
            itemTitle: itemTitle,
            price: price,
            timestamp: new Date().toISOString()
        };
        
        fetch('http://localhost:3000/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.log('Analytics error:', err));
    }
};

// Auto-track page views
document.addEventListener('DOMContentLoaded', function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    Analytics.trackPageView(page);
});