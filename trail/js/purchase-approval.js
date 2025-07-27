// Purchase Approval System
class PurchaseApproval {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupPurchaseHandlers();
        this.checkApprovalStatus();
    }
    
    // Handle purchase requests
    async submitPurchaseRequest(courseTitle, price, userEmail = null) {
        // Get user email if not provided
        if (!userEmail) {
            userEmail = prompt('Please enter your email address:');
            if (!userEmail) {
                this.showNotification('Email is required for purchase', 'error');
                return;
            }
        }
        
        const purchaseRequest = {
            id: Date.now().toString(),
            user: userEmail,
            course: courseTitle,
            price: price,
            status: 'pending',
            timestamp: new Date().toISOString(),
            requestDate: new Date().toLocaleString()
        };
        
        // Store in localStorage (simulating database)
        const requests = JSON.parse(localStorage.getItem('purchaseRequests') || '[]');
        requests.push(purchaseRequest);
        localStorage.setItem('purchaseRequests', JSON.stringify(requests));
        
        // Store user's purchase status
        const userPurchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        if (!userPurchases[userEmail]) {
            userPurchases[userEmail] = [];
        }
        userPurchases[userEmail].push({
            course: courseTitle,
            status: 'pending',
            id: purchaseRequest.id
        });
        localStorage.setItem('userPurchases', JSON.stringify(userPurchases));
        
        // Send to server if available
        try {
            await fetch('http://localhost:3000/api/purchase-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchaseRequest)
            });
        } catch (error) {
            console.log('Server not available, using local storage');
        }
        
        this.showPendingModal(courseTitle);
        
        // Track purchase attempt
        if (typeof trackPurchaseAttempt === 'function') {
            trackPurchaseAttempt(courseTitle, price, userEmail);
        }
    }
    
    // Show pending approval modal
    showPendingModal(courseTitle) {
        const modal = document.createElement('div');
        modal.className = 'approval-modal';
        modal.innerHTML = `
            <div class="approval-modal-content">
                <div class="approval-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Purchase Request Submitted</h3>
                <p>Your request to purchase <strong>"${courseTitle}"</strong> has been submitted.</p>
                <div class="status-info">
                    <div class="status-badge pending">
                        <i class="fas fa-hourglass-half"></i>
                        Waiting for Admin Approval
                    </div>
                </div>
                <p class="approval-text">
                    You will receive access to the course once an admin approves your purchase. 
                    This usually takes a few minutes.
                </p>
                <div class="approval-actions">
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        OK, I'll Wait
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.reload()">
                        Check Status
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-check for approval every 10 seconds
        const checkInterval = setInterval(() => {
            if (this.checkCourseAccess(courseTitle)) {
                clearInterval(checkInterval);
                document.body.removeChild(modal);
                this.showApprovedModal(courseTitle);
            }
        }, 10000);
        
        // Stop checking after 5 minutes
        setTimeout(() => clearInterval(checkInterval), 300000);
    }
    
    // Show approved modal
    showApprovedModal(courseTitle) {
        const modal = document.createElement('div');
        modal.className = 'approval-modal';
        modal.innerHTML = `
            <div class="approval-modal-content">
                <div class="approval-icon approved">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Purchase Approved!</h3>
                <p>Your purchase of <strong>"${courseTitle}"</strong> has been approved!</p>
                <div class="status-info">
                    <div class="status-badge approved">
                        <i class="fas fa-check"></i>
                        Access Granted
                    </div>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-primary" onclick="window.open('${this.getCourseUrl(courseTitle)}', '_blank')">
                        <i class="fas fa-play"></i> Start Learning
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Check if user has access to a course
    checkCourseAccess(courseTitle, userEmail = null) {
        if (!userEmail) {
            userEmail = this.getCurrentUserEmail();
        }
        
        const userPurchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        const purchases = userPurchases[userEmail] || [];
        
        return purchases.some(purchase => 
            purchase.course === courseTitle && purchase.status === 'approved'
        );
    }
    
    // Check approval status on page load
    checkApprovalStatus() {
        const userEmail = this.getCurrentUserEmail();
        if (!userEmail) return;
        
        const userPurchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        const purchases = userPurchases[userEmail] || [];
        
        // Check for newly approved courses
        purchases.forEach(purchase => {
            if (purchase.status === 'approved' && !purchase.notified) {
                this.showApprovedModal(purchase.course);
                purchase.notified = true;
            }
        });
        
        localStorage.setItem('userPurchases', JSON.stringify(userPurchases));
    }
    
    // Get current user email (simplified)
    getCurrentUserEmail() {
        return localStorage.getItem('currentUserEmail') || null;
    }
    
    // Set current user email
    setCurrentUserEmail(email) {
        localStorage.setItem('currentUserEmail', email);
    }
    
    // Get course URL
    getCourseUrl(courseTitle) {
        const courseMap = {
            "Algebra Basics: Solving Simple Equations": "https://www.youtube.com/watch?v=Qyd_v3DGzTM",
            "Introduction to Calculus: Limits": "https://www.youtube.com/watch?v=riXcZT2ICjA",
            "Geometry: Triangle Proofs Made Easy": "https://www.youtube.com/watch?v=JUzH3UXDH7E",
            "Algebra Mastery Course": "https://www.youtube.com/watch?v=LwCRRUa8yTU",
            "Calculus Fundamentals": "https://www.youtube.com/watch?v=HfACrKJ_Y2w",
            "Geometry Essentials": "https://www.youtube.com/watch?v=302eJ3TzJQU"
        };
        
        return courseMap[courseTitle] || "https://www.youtube.com/watch?v=JwOmHKPNBRY";
    }
    
    // Setup purchase button handlers
    setupPurchaseHandlers() {
        // Override existing payment modal function
        window.originalShowPaymentModal = window.showPaymentModal;
        window.showPaymentModal = (courseTitle, price) => {
            this.submitPurchaseRequest(courseTitle, price);
        };
        
        // Handle purchase buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary') && 
                (e.target.textContent.includes('Purchase') || 
                 e.target.textContent.includes('Start Course') ||
                 e.target.textContent.includes('Get Product'))) {
                
                e.preventDefault();
                
                const card = e.target.closest('.video-card, .course-card, .tool-card');
                if (card) {
                    const title = card.querySelector('h3')?.textContent || 'Unknown Course';
                    const priceText = card.querySelector('[style*="primary-color"]')?.textContent || '$0';
                    const price = priceText.replace(/[^0-9.]/g, '');
                    
                    this.submitPurchaseRequest(title, price);
                }
            }
        });
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4facfe'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
    window.purchaseApproval = new PurchaseApproval();
});

// Add CSS styles
const approvalStyles = document.createElement('style');
approvalStyles.textContent = `
    .approval-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .approval-modal-content {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    }
    
    .approval-icon {
        font-size: 4rem;
        color: #ffc107;
        margin-bottom: 1rem;
    }
    
    .approval-icon.approved {
        color: #4caf50;
    }
    
    .approval-modal-content h3 {
        margin-bottom: 1rem;
        color: #333;
    }
    
    .status-info {
        margin: 1.5rem 0;
    }
    
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .status-badge.pending {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-badge.approved {
        background: #d4edda;
        color: #155724;
    }
    
    .approval-text {
        color: #666;
        line-height: 1.6;
        margin: 1rem 0;
    }
    
    .approval-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(approvalStyles);