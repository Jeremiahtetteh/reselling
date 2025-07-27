# EmailJS Setup Guide

EmailJS is now integrated into your MathCenter website. Follow these steps to complete the setup:

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended)
4. Connect your Gmail account (Jeremiahtetteh2008@gmail.com)

## Step 3: Create Email Template

1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```
Subject: {{subject}}

{{message}}

---
Sent from MathCenter Website
```

## Step 4: Get Your Keys

1. Go to "Integration" tab
2. Copy your:
   - **Public Key** (User ID)
   - **Service ID**
   - **Template ID**

## Step 5: Update Your Website

Replace these values in your HTML files:

**In index.html and contact.html:**
```javascript
emailjs.init({
  publicKey: "YOUR_ACTUAL_PUBLIC_KEY", // Replace this
});
```

**In js/emailjs-notifications.js:**
```javascript
const serviceID = 'YOUR_ACTUAL_SERVICE_ID';     // Replace this
const templateID = 'YOUR_ACTUAL_TEMPLATE_ID';   // Replace this
```

## Step 6: Test

1. Visit your website
2. Try purchasing something or filling contact form
3. Check Jeremiahtetteh2008@gmail.com for emails

## What You'll Get:

✅ **Visitor Notifications** - When someone visits your site
✅ **Purchase Alerts** - When someone tries to buy something  
✅ **Contact Form Emails** - When someone fills contact form
✅ **Automatic Delivery** - No manual sending required

## Free Limits:

- 200 emails per month (free plan)
- Upgrade for more emails if needed

Your EmailJS integration is ready once you add your actual keys!