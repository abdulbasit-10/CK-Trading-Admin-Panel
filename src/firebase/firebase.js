import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDWI2MWxPWV8jlbEjrgheIFRUHy56mTIig",
  authDomain: "testing-c46db.firebaseapp.com",
  projectId: "testing-c46db",
  storageBucket: "testing-c46db.firebasestorage.app",
  messagingSenderId: "892807463563",
  appId: "1:892807463563:web:745aac924706f2583c8a8e",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
