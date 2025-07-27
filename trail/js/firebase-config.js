// Firebase configuration for client-side
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase (add this script tag to your HTML)
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>

// Simple visitor tracking with Firebase
const FirebaseTracker = {
  init: function() {
    // Track visitor
    this.trackVisitor();
  },
  
  trackVisitor: function() {
    const visitorData = {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'Direct'
    };
    
    // Send to your server which will handle Firebase
    fetch('http://localhost:3000/api/firebase/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitorData)
    }).catch(err => console.log('Firebase tracking error:', err));
  }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
  FirebaseTracker.init();
});