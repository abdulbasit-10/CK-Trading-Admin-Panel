import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async () => {
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers not supported");
    return null;
  }

  // 1️⃣ Register service worker
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  // 2️⃣ Ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  // 3️⃣ Get FCM token
  const token = await getToken(messaging, {
    vapidKey: "BM372aIz6JtMOHjFICy9y5TnxLGfvc_oesAjgQf0iZxKyNUTXIF9Dj4FlhkQIcO75Tp08QJzIYzFKqlznU_ttEs",
    serviceWorkerRegistration: registration,
  });

  console.log("FCM TOKEN:", token);
  return token;
};
