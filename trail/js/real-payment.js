// Real Payment System with Multiple Options
class RealPaymentSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupPaymentHandlers();
        this.createPaymentModal();
    }
    
    createPaymentModal() {
        const modal = document.createElement('div');
        modal.id = 'real-payment-modal';
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="payment-modal-content">
                <div class="payment-header">
                    <h3>Complete Your Purchase</h3>
                    <button class="close-modal" onclick="this.closest('.payment-modal').style.display='none'">×</button>
                </div>
                
                <div class="course-summary">
                    <div class="course-info">
                        <h4 id="payment-course-title">Course Title</h4>
                        <div class="price-display">
                            <span class="currency">$</span>
                            <span id="payment-price">0.00</span>
                        </div>
                    </div>
                </div>
                
                <div class="customer-info">
                    <h4>Customer Information</h4>
                    <div class="form-group">
                        <input type="email" id="customer-email" placeholder="Your email address" required>
                    </div>
                    <div class="form-group">
                        <input type="text" id="customer-name" placeholder="Full name" required>
                    </div>
                </div>
                
                <div class="payment-methods">
                    <h4>Choose Payment Method</h4>
                    <div class="payment-options">
                        <button class="payment-option" data-method="paypal">
                            <i class="fab fa-paypal"></i>
                            <span>PayPal</span>
                        </button>
                        <button class="payment-option" data-method="cashapp">
                            <i class="fas fa-dollar-sign"></i>
                            <span>Cash App</span>
                        </button>
                        <button class="payment-option" data-method="mobilemoney">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Mobile Money</span>
                        </button>
                        <button class="payment-option" data-method="card">
                            <i class="fas fa-credit-card"></i>
                            <span>Credit Card</span>
                        </button>
                    </div>
                </div>
                
                <div class="payment-details" id="payment-details">
                    <!-- Payment method specific forms will appear here -->
                </div>
                
                <div class="payment-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.payment-modal').style.display='none'">Cancel</button>
                    <button class="btn btn-primary" id="process-payment" disabled>
                        <i class="fas fa-lock"></i> Pay Now
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupPaymentMethodHandlers();
    }
    
    setupPaymentHandlers() {
        // Override existing payment functions
        window.showPaymentModal = (courseTitle, price) => {
            this.showPaymentModal(courseTitle, price);
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
                    
                    this.showPaymentModal(title, price);
                }
            }
        });
    }
    
    showPaymentModal(courseTitle, price) {
        const modal = document.getElementById('real-payment-modal');
        document.getElementById('payment-course-title').textContent = courseTitle;
        document.getElementById('payment-price').textContent = parseFloat(price).toFixed(2);
        
        // Reset form
        document.getElementById('customer-email').value = '';
        document.getElementById('customer-name').value = '';
        document.getElementById('payment-details').innerHTML = '';
        document.getElementById('process-payment').disabled = true;
        
        // Remove active states
        document.querySelectorAll('.payment-option').forEach(btn => btn.classList.remove('active'));
        
        modal.style.display = 'flex';
    }
    
    setupPaymentMethodHandlers() {
        document.querySelectorAll('.payment-option').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active state from all buttons
                document.querySelectorAll('.payment-option').forEach(b => b.classList.remove('active'));
                
                // Add active state to clicked button
                btn.classList.add('active');
                
                const method = btn.dataset.method;
                this.showPaymentForm(method);
                
                document.getElementById('process-payment').disabled = false;
            });
        });
        
        document.getElementById('process-payment').addEventListener('click', () => {
            this.processPayment();
        });
    }
    
    showPaymentForm(method) {
        const container = document.getElementById('payment-details');
        
        switch(method) {
            case 'paypal':
                container.innerHTML = `
                    <div class="payment-form">
                        <h5><i class="fab fa-paypal"></i> PayPal Payment</h5>
                        <p>You will be redirected to PayPal to complete your payment securely.</p>
                        <div class="payment-info">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure payment powered by PayPal</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'cashapp':
                container.innerHTML = `
                    <div class="payment-form">
                        <h5><i class="fas fa-dollar-sign"></i> Cash App Payment</h5>
                        <div class="form-group">
                            <label>Cash App Username</label>
                            <input type="text" id="cashapp-username" placeholder="$username" required>
                        </div>
                        <div class="payment-info">
                            <i class="fas fa-info-circle"></i>
                            <span>You'll receive payment instructions via email</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'mobilemoney':
                container.innerHTML = `
                    <div class="payment-form">
                        <h5><i class="fas fa-mobile-alt"></i> Mobile Money</h5>
                        <div class="form-group">
                            <label>Mobile Number</label>
                            <input type="tel" id="mobile-number" placeholder="+1234567890" required>
                        </div>
                        <div class="form-group">
                            <label>Provider</label>
                            <select id="mobile-provider" required>
                                <option value="">Select Provider</option>
                                <option value="mtn">MTN Mobile Money</option>
                                <option value="vodafone">Vodafone Cash</option>
                                <option value="airtel">Airtel Money</option>
                                <option value="tigo">Tigo Cash</option>
                            </select>
                        </div>
                        <div class="payment-info">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Payment request will be sent to your phone</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'card':
                container.innerHTML = `
                    <div class="payment-form">
                        <h5><i class="fas fa-credit-card"></i> Credit/Debit Card</h5>
                        <div class="form-group">
                            <label>Card Number</label>
                            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Expiry Date</label>
                                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required>
                            </div>
                            <div class="form-group">
                                <label>CVV</label>
                                <input type="text" id="card-cvv" placeholder="123" maxlength="4" required>
                            </div>
                        </div>
                        <div class="payment-info">
                            <i class="fas fa-lock"></i>
                            <span>Your card information is encrypted and secure</span>
                        </div>
                    </div>
                `;
                
                // Add card formatting
                this.setupCardFormatting();
                break;
        }
    }
    
    setupCardFormatting() {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                e.target.value = formattedValue;
            });
        }
        
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
    }
    
    async processPayment() {
        const courseTitle = document.getElementById('payment-course-title').textContent;
        const price = document.getElementById('payment-price').textContent;
        const customerEmail = document.getElementById('customer-email').value;
        const customerName = document.getElementById('customer-name').value;
        const activeMethod = document.querySelector('.payment-option.active')?.dataset.method;
        
        // Validate required fields
        if (!customerEmail || !customerName || !activeMethod) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Show processing state
        const processBtn = document.getElementById('process-payment');
        const originalText = processBtn.innerHTML;
        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        processBtn.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            this.completePayment(courseTitle, price, customerEmail, customerName, activeMethod);
            processBtn.innerHTML = originalText;
            processBtn.disabled = false;
        }, 2000);
    }
    
    completePayment(courseTitle, price, customerEmail, customerName, paymentMethod) {
        // Create payment record
        const paymentRecord = {
            id: Date.now().toString(),
            course: courseTitle,
            price: price,
            customerEmail: customerEmail,
            customerName: customerName,
            paymentMethod: paymentMethod,
            status: 'paid',
            timestamp: new Date().toISOString(),
            paymentDate: new Date().toLocaleString()
        };
        
        // Store payment record
        const payments = JSON.parse(localStorage.getItem('completedPayments') || '[]');
        payments.push(paymentRecord);
        localStorage.setItem('completedPayments', JSON.stringify(payments));
        
        // Create approval request (only after payment)
        const approvalRequest = {
            id: paymentRecord.id,
            user: customerEmail,
            userName: customerName,
            course: courseTitle,
            price: price,
            paymentMethod: paymentMethod,
            status: 'pending',
            timestamp: new Date().toISOString(),
            requestDate: new Date().toLocaleString(),
            paymentId: paymentRecord.id
        };
        
        // Store approval request
        const requests = JSON.parse(localStorage.getItem('purchaseRequests') || '[]');
        requests.push(approvalRequest);
        localStorage.setItem('purchaseRequests', JSON.stringify(requests));
        
        // Store user purchase status
        const userPurchases = JSON.parse(localStorage.getItem('userPurchases') || '{}');
        if (!userPurchases[customerEmail]) {
            userPurchases[customerEmail] = [];
        }
        userPurchases[customerEmail].push({
            course: courseTitle,
            status: 'pending',
            id: approvalRequest.id,
            paymentId: paymentRecord.id
        });
        localStorage.setItem('userPurchases', JSON.stringify(userPurchases));
        
        // Close modal
        document.getElementById('real-payment-modal').style.display = 'none';
        
        // Show success message with approval requirement
        this.showSuccessModal(courseTitle, paymentMethod);
        
        // Track purchase attempt
        this.trackPurchaseAttempt(courseTitle, price, customerEmail);
        
        // Send to server if available
        this.sendToServer(paymentRecord, approvalRequest);
    }
    
    showSuccessModal(courseTitle, paymentMethod) {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Payment Successful!</h3>
                <p>Your payment for <strong>"${courseTitle}"</strong> has been processed successfully via ${paymentMethod}.</p>
                <div class="status-info">
                    <div class="status-badge pending">
                        <i class="fas fa-clock"></i>
                        Awaiting Admin Approval
                    </div>
                </div>
                <p class="next-steps">
                    Your purchase is now being reviewed by our team. You'll receive access once approved (usually within a few minutes).
                </p>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="window.location.href='user-dashboard.html'">
                        <i class="fas fa-tachometer-alt"></i> View My Dashboard
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Continue Browsing
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 10000);
    }
    
    async sendToServer(paymentRecord, approvalRequest) {
        try {
            await fetch('http://localhost:3000/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentRecord)
            });
            
            await fetch('http://localhost:3000/api/purchase-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(approvalRequest)
            });
        } catch (error) {
            console.log('Server not available, using local storage');
        }
    }
    
    trackPurchaseAttempt(courseTitle, price, customerEmail) {
        const attempt = {
            item: courseTitle,
            price: price,
            customerEmail: customerEmail,
            timestamp: new Date().toLocaleString(),
            status: 'awaiting_approval'
        };
        
        const attempts = JSON.parse(localStorage.getItem('purchaseAttempts') || '[]');
        attempts.push(attempt);
        localStorage.setItem('purchaseAttempts', JSON.stringify(attempts));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1002;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the payment system
document.addEventListener('DOMContentLoaded', () => {
    window.realPaymentSystem = new RealPaymentSystem();
});

// Add CSS styles
const paymentStyles = document.createElement('style');
paymentStyles.textContent = `
    .payment-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .payment-modal-content {
        background: white;
        border-radius: 20px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    }
    
    .payment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid #eee;
    }
    
    .payment-header h3 {
        margin: 0;
        color: #333;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0.5rem;
    }
    
    .course-summary {
        padding: 1.5rem 2rem;
        background: #f8f9fa;
        border-bottom: 1px solid #eee;
    }
    
    .course-info h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
    }
    
    .price-display {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: #4facfe;
    }
    
    .currency {
        margin-right: 0.2rem;
    }
    
    .customer-info, .payment-methods {
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #eee;
    }
    
    .customer-info h4, .payment-methods h4 {
        margin: 0 0 1rem 0;
        color: #333;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
    }
    
    .form-group input, .form-group select {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus, .form-group select:focus {
        outline: none;
        border-color: #4facfe;
        box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
    }
    
    .payment-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .payment-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 2px solid #eee;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .payment-option:hover {
        border-color: #4facfe;
        transform: translateY(-2px);
    }
    
    .payment-option.active {
        border-color: #4facfe;
        background: #f0f8ff;
    }
    
    .payment-option i {
        font-size: 1.5rem;
        color: #4facfe;
    }
    
    .payment-option span {
        font-weight: 500;
        color: #333;
    }
    
    .payment-details {
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #eee;
    }
    
    .payment-form h5 {
        margin: 0 0 1rem 0;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .payment-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem;
        background: #f0f8ff;
        border-radius: 8px;
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #4facfe;
    }
    
    .payment-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding: 1.5rem 2rem;
    }
    
    .success-modal {
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
        z-index: 1001;
        animation: fadeIn 0.3s ease;
    }
    
    .success-modal-content {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    }
    
    .success-icon {
        font-size: 4rem;
        color: #4caf50;
        margin-bottom: 1rem;
    }
    
    .success-modal-content h3 {
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
    
    .next-steps {
        color: #666;
        line-height: 1.6;
        margin: 1rem 0;
    }
    
    .success-actions {
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
document.head.appendChild(paymentStyles);