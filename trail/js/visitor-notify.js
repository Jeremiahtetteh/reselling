// Simple visitor notification system
document.addEventListener('DOMContentLoaded', function() {
    // Send visitor notification
    const visitorData = {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct visit'
    };
    
    // Send notification to server
    fetch('http://localhost:3000/api/visitor-alert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitorData)
    }).catch(err => {
        // Silently fail if server is not running
        console.log('Visitor notification failed:', err);
    });
});