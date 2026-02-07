import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthProvider from './auth/AuthProvider';
import { NotificationProvider } from './notifications/NotificationProvider';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
      <App />
      </NotificationProvider>

    </AuthProvider>
  </React.StrictMode>
);