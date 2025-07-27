// Track purchase attempts and send email notifications
function trackPurchaseAttempt(itemTitle, itemPrice, customerEmail = 'Unknown') {
    const purchaseData = {
        item: itemTitle,
        price: itemPrice,
        customerEmail: customerEmail,
        timestamp: new Date().toLocaleString(),
        page: window.location.pathname
    };
    
    // Store purchase attempt
    const purchases = JSON.parse(localStorage.getItem('purchaseAttempts') || '[]');
    purchases.push({...purchaseData, id: Date.now()});
    localStorage.setItem('purchaseAttempts', JSON.stringify(purchases));
    
    // Send email notification
    sendPurchaseEmail(purchaseData);
    
    console.log('Purchase attempt tracked:', purchaseData);
}

function sendPurchaseEmail(data) {
    const subject = '💰 NEW PURCHASE ATTEMPT - MathCenter';
    const body = `
🚨 PURCHASE ALERT! 🚨

Someone just tried to purchase from your MathCenter website!

💳 PURCHASE DETAILS:
📦 Item: ${data.item}
💵 Price: $${data.price}
📧 Customer Email: ${data.customerEmail}
⏰ Time: ${data.timestamp}
📄 Page: ${data.page}

This is a hot lead! Consider following up with this potential customer.

---
Sent automatically from your MathCenter website
    `;
    
    // Create mailto link
    const mailtoLink = `mailto:Jeremiahtetteh2008@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client (user will need to click send)
    setTimeout(() => {
        window.open(mailtoLink, '_blank');
    }, 1000);
}

// Override the existing Payment.processPayment function
if (window.Payment) {
    const originalProcessPayment = window.Payment.processPayment;
    
    window.Payment.processPayment = function(itemId, itemTitle, price) {
        // Track the purchase attempt
        trackPurchaseAttempt(itemTitle, price);
        
        // Continue with original payment process
        return originalProcessPayment.call(this, itemId, itemTitle, price);
    };
}

// Track purchase button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('video-purchase-btn') || 
        e.target.classList.contains('product-purchase-btn') ||
        e.target.classList.contains('course-enroll-btn')) {
        
        // Get item details
        const card = e.target.closest('.video-card, .tool-card, .course-card');
        if (card) {
            const title = card.querySelector('h3')?.textContent || 'Unknown Item';
            const priceText = card.querySelector('[class*="price"]')?.textContent || '$0';
            const price = priceText.replace(/[^0-9.]/g, '');
            
            trackPurchaseAttempt(title, price);
        }
    }
});