/**
 * SISI service worker
 *
 * A service worker is a script the browser runs in the background, separate
 * from the page. Every request the app makes passes through its "fetch"
 * listener, so it can answer from a saved copy when there's no connection.
 *
 * It has three events:
 *   1. install  – runs once, when this file is new or has changed
 *   2. activate – runs when it takes over from the old version
 *   3. fetch    – runs for every request the app makes
 *
 * Registered from src/utils/registerServiceWorker.ts (production build only).
 */

// Change VERSION whenever you edit this file or the files in APP_SHELL.
// The browser then installs the new worker and deletes the old caches.
const VERSION = "v1";
const APP_CACHE = `sisi-app-${VERSION}`; // HTML, JS, CSS, icons, fonts
const DATA_CACHE = `sisi-data-${VERSION}`; // answers from the SISI API

// Files the app needs to open at all, saved as soon as the worker installs
const APP_SHELL = [
  "/manifest.webmanifest",
  "/favicon.svg",
  "/pwa-192.png",
  "/pwa-512.png",
];

// ---------- 1. install: save the app shell ----------

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);

      // Save the page itself
      const page = await fetch("/", { cache: "no-store" });
      await cache.put("/", page.clone());

      // Vite renames the built JS and CSS on every build (index-B9Ql3zuN.js),
      // so read their current names from the page we just downloaded
      const html = await page.text();
      const builtFiles = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
        .map((match) => match[1]);

      await cache.addAll([...APP_SHELL, ...builtFiles]);

      // Take over now, instead of waiting for every open tab to close
      await self.skipWaiting();
    })(),
  );
});

// ---------- 2. activate: delete caches from older versions ----------

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      const oldNames = names.filter(
        (name) => name !== APP_CACHE && name !== DATA_CACHE,
      );
      await Promise.all(oldNames.map((name) => caches.delete(name)));

      // Start controlling tabs that are already open
      await self.clients.claim();
    })(),
  );
});

// ---------- 3. fetch: decide where each answer comes from ----------

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Votes, feedback, logins and forms always go straight to the network
  if (request.method !== "GET") return;

  // Opening a page: every URL in the app is the same index.html,
  // so try the network and fall back to the saved copy of "/"
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, APP_CACHE, "/"));
    return;
  }

  // SISI API: try the network, fall back to the last answer we saved.
  // Anything under /api/auth/ belongs to one person, so it's never saved.
  if (url.pathname.startsWith("/api/")) {
    if (!url.pathname.startsWith("/api/auth/")) {
      event.respondWith(networkFirst(request, DATA_CACHE));
    }
    return;
  }

  // Our own files and Google Fonts never change once built,
  // so use the saved copy first and only download what's missing
  const isFont =
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com";
  if (url.origin === self.location.origin || isFont) {
    event.respondWith(cacheFirst(request));
  }

  // Anything else (like the Google Map on the contact page) isn't touched
});

// ---------- caching strategies ----------

// Network first: fresh data when online, the last saved copy when offline
async function networkFirst(request, cacheName, cacheKey = request) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(cacheKey, response.clone());
    return response;
  } catch {
    const saved = await cache.match(cacheKey);
    return saved ?? Response.error();
  }
}

// Cache first: the saved copy if we have one, otherwise download and save it
async function cacheFirst(request) {
  const cache = await caches.open(APP_CACHE);
  const saved = await cache.match(request);
  if (saved) return saved;

  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}
