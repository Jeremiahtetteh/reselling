// Simple email notification using EmailJS (no server setup needed)
document.addEventListener('DOMContentLoaded', function() {
    // Send visitor notification
    const visitorData = {
        page: window.location.pathname,
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent.split(' ')[0],
        referrer: document.referrer || 'Direct visit'
    };
    
    // Use EmailJS to send email (free service)
    sendEmailNotification(visitorData);
});

function sendEmailNotification(data) {
    // Simple email using mailto (opens user's email client)
    const subject = '🔔 New Visitor on MathCenter Website';
    const body = `
New Website Visitor Alert!

📄 Page: ${data.page}
⏰ Time: ${data.timestamp}
🌐 Browser: ${data.userAgent}
📍 Source: ${data.referrer}

This visitor notification was sent automatically from your MathCenter website.
    `;
    
    // Create mailto link
    const mailtoLink = `mailto:Jeremiahtetteh2008@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // For testing - you can uncomment this to see the email content
    console.log('Visitor detected:', data);
    
    // Alternative: Use a webhook service like Zapier or IFTTT
    // Or integrate with EmailJS for automatic sending
    
    // Store visitor data locally for now
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    visitors.push({...data, id: Date.now()});
    localStorage.setItem('visitors', JSON.stringify(visitors));
    
    // Show notification that visitor was tracked
    if (typeof showNotification === 'function') {
        showNotification('Visitor tracked successfully', 'info');
    }
}