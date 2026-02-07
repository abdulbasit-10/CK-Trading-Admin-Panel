import { createContext, useContext, useEffect, useState } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { requestNotificationPermission } from "../firebase/notifications"; // your helper
import useAuth from "../auth/useAuth";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    const initFCM = async () => {
      const messaging = getMessaging();

      // 1️⃣ Request permission (already done)
      const token = await requestNotificationPermission();
      if (!token) return;

      // 2️⃣ Listen for foreground messages
      onMessage(messaging, (payload) => {
        console.log("New Firebase message:", payload);

        const message = {
          id: payload.messageId || Date.now(),
          title: payload.notification?.title || "Notification",
          body: payload.notification?.body || "",
          created_at: new Date().toISOString(),
        };

        setNotifications((prev) => [message, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    };

    initFCM();
  }, [loading, isAuthenticated]);

  const markAllAsRead = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

