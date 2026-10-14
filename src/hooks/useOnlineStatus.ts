import { useSyncExternalStore } from "react";

// useSyncExternalStore lets React listen to something that lives outside React,
// here the browser's "online" and "offline" events
const subscribe = (onChange: () => void) => {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
};

// const online = useOnlineStatus(); → true when the device has a connection
export const useOnlineStatus = () =>
  useSyncExternalStore(subscribe, () => navigator.onLine);
