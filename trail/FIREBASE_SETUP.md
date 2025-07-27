# Firebase Setup for Email Notifications

## Quick Setup (5 minutes):

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Name it "mathcenter" 
4. Enable Google Analytics (optional)

### 2. Get Service Account Key
1. In Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Replace content in `firebase-service-account.json`

### 3. Update Email in Server
Edit `server.js` line 20:
```javascript
to: 'Jeremiahtetteh2008@gmail.com',  // ✅ Already set
```

### 4. Install & Run
```bash
npm install
npm start
```

## What You Get:

✅ **Instant Email Alerts** - Get notified when someone visits your site
✅ **Real-time Database** - All visitor data stored in Firebase  
✅ **Analytics Dashboard** - View visitor stats in Firebase Console
✅ **Scalable** - Handles unlimited visitors

## Email Notifications Include:
- Page visited (index.html, courses.html, etc.)
- Exact timestamp
- User's browser/device info
- Where they came from (Google, direct, etc.)

## Alternative (No Firebase):
If you skip Firebase setup, email notifications still work via the existing system. Firebase just adds real-time database storage and better analytics.

## Test It:
1. Start server: `npm start`
2. Visit your website
3. Check Jeremiahtetteh2008@gmail.com for instant notification!