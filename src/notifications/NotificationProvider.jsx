import { createContext, useContext, useEffect, useState } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { requestNotificationPermission } from "../firebase/notifications"; // your helper
import { notificationAPI } from "../api/notificationApi";
import useAuth from "../auth/useAuth";

export const NotificationContext = createContext(null);

const normalizeNotification = (raw) => ({
  id: raw.notification_id || raw.id || `${Date.now()}-${Math.random()}`,
  title: raw.title || "Notification",
  body: raw.body || "",
  data: raw.data || null,
  is_read: !!raw.is_read,
  created_at: raw.created_at || new Date().toISOString(),
});

export const NotificationProvider = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 1️⃣ Load persisted notifications from the backend whenever the admin
  // logs in / reloads the page so events that happened while they were
  // offline (e.g. a user registered overnight) still appear in the bell.
  useEffect(() => {
    if (loading || !isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    const loadPersisted = async () => {
      try {
        const rows = await notificationAPI.getNotifications();
        if (cancelled) return;

        const normalized = rows.map(normalizeNotification);
        setNotifications(normalized);
        setUnreadCount(normalized.filter((n) => !n.is_read).length);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    loadPersisted();

    return () => {
      cancelled = true;
    };
  }, [loading, isAuthenticated]);

  // 2️⃣ Listen for live Firebase Cloud Messaging payloads so brand new
  // events (e.g. a registration that just completed) pop up instantly
  // without waiting for the next page reload.
  useEffect(() => {
    if (loading || !isAuthenticated) return;

    let unsubscribe = () => {};

    const initFCM = async () => {
      const messaging = getMessaging();

      const token = await requestNotificationPermission();
      if (!token) return;

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("New Firebase message:", payload);

        const message = normalizeNotification({
          notification_id: payload.messageId,
          title: payload.notification?.title,
          body: payload.notification?.body,
          data: payload.data,
          is_read: false,
          created_at: new Date().toISOString(),
        });

        setNotifications((prev) => [message, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    };

    initFCM();

    return () => {
      try {
        unsubscribe();
      } catch (_) {
        // onMessage may not return a cleanup fn in some SDK versions
      }
    };
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

