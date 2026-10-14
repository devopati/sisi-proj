/**
 * Registers public/sw.js, the service worker that lets SISI open offline.
 *
 * Only in the production build (`npm run pwa`). During `npm run dev`, Vite
 * changes files all the time, and a service worker answering with saved
 * copies would hide your changes.
 */
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  // Wait until the page has loaded, so registering doesn't slow it down
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) => console.error("Service worker registration failed:", error));
  });
};
