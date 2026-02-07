/* eslint-disable no-undef */

// Firebase compat SDKs (required for service workers)
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDWI2MWxPWV8jlbEjrgheIFRUHy56mTIig",
  authDomain: "testing-c46db.firebaseapp.com",
  projectId: "testing-c46db",
  storageBucket: "testing-c46db.firebasestorage.app",
  messagingSenderId: "892807463563",
  appId: "1:892807463563:web:745aac924706f2583c8a8e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
