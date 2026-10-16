import { useState } from "react";

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );

  // 1. Request permission from the user
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return "unsupported" as const;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result; // "granted", "denied", or "default"
  };

  // 2. Send a local notification
  const sendNotification = (
    title: string,
    body: string,
    iconUrl = "/pwa-192.png",
  ) => {
    if (permission === "granted") {
      // Check if the service worker is available for better PWA notification handling
      if ("serviceWorker" in navigator && "Notification" in window) {
        // Using the Service Worker registration ensures the notification
        // behaves like a native PWA notification (stays in the notification tray)
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: iconUrl,
            badge: "/pwa-96.png", // Optional: small icon for the status bar
          });
        });
      } else {
        // Fallback for standard web pages
        new Notification(title, { body, icon: iconUrl });
      }
    }
  };

  return { permission, requestPermission, sendNotification };
};
