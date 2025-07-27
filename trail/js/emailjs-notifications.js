// EmailJS notification system
function sendEmailJSNotification(type, data) {
    // Replace with your actual EmailJS service details
    const serviceID = 'YOUR_SERVICE_ID';
    const templateID = 'YOUR_TEMPLATE_ID';
    
    let templateParams = {};
    
    if (type === 'visitor') {
        templateParams = {
            to_email: 'Jeremiahtetteh2008@gmail.com',
            subject: '🔔 New Visitor on MathCenter Website',
            message: `
New Website Visitor Alert!

📄 Page: ${data.page}
⏰ Time: ${data.timestamp}
🌐 Browser: ${data.userAgent}
📍 Source: ${data.referrer}

This visitor notification was sent automatically from your MathCenter website.
            `
        };
    } else if (type === 'purchase') {
        templateParams = {
            to_email: 'Jeremiahtetteh2008@gmail.com',
            subject: '💰 NEW PURCHASE ATTEMPT - MathCenter',
            message: `
🚨 PURCHASE ALERT! 🚨

Someone just tried to purchase from your MathCenter website!

💳 PURCHASE DETAILS:
📦 Item: ${data.item}
💵 Price: $${data.price}
📧 Customer Email: ${data.customerEmail}
⏰ Time: ${data.timestamp}
📄 Page: ${data.page}

This is a hot lead! Consider following up with this potential customer.
            `
        };
    } else if (type === 'contact') {
        templateParams = {
            to_email: 'Jeremiahtetteh2008@gmail.com',
            subject: '📧 New Contact Form Submission - MathCenter',
            message: `
New Contact Form Submission!

👤 Name: ${data.name}
📧 Email: ${data.email}
📝 Subject: ${data.subject}
💬 Message: ${data.message}
⏰ Time: ${new Date().toLocaleString()}

Someone has reached out through your MathCenter contact form.
            `
        };
    }
    
    // Send email using EmailJS
    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
        })
        .catch(function(error) {
            console.log('Email failed to send:', error);
            // Fallback to mailto if EmailJS fails
            fallbackToMailto(type, data);
        });
}

function fallbackToMailto(type, data) {
    let subject, body;
    
    if (type === 'visitor') {
        subject = '🔔 New Visitor on MathCenter Website';
        body = `
New Website Visitor Alert!

📄 Page: ${data.page}
⏰ Time: ${data.timestamp}
🌐 Browser: ${data.userAgent}
📍 Source: ${data.referrer}

This visitor notification was sent automatically from your MathCenter website.
        `;
    } else if (type === 'purchase') {
        subject = '💰 NEW PURCHASE ATTEMPT - MathCenter';
        body = `
🚨 PURCHASE ALERT! 🚨

Someone just tried to purchase from your MathCenter website!

💳 PURCHASE DETAILS:
📦 Item: ${data.item}
💵 Price: $${data.price}
📧 Customer Email: ${data.customerEmail}
⏰ Time: ${data.timestamp}
📄 Page: ${data.page}

This is a hot lead! Consider following up with this potential customer.
        `;
    } else if (type === 'contact') {
        subject = '📧 New Contact Form Submission - MathCenter';
        body = `
New Contact Form Submission!

👤 Name: ${data.name}
📧 Email: ${data.email}
📝 Subject: ${data.subject}
💬 Message: ${data.message}
⏰ Time: ${new Date().toLocaleString()}

Someone has reached out through your MathCenter contact form.
        `;
    }
    
    const mailtoLink = `mailto:Jeremiahtetteh2008@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
}

// Export functions for use in other scripts
window.sendEmailJSNotification = sendEmailJSNotification;