# Class guide: turning SISI into a PWA

## Before class

Put the finished code on its own branch so `main` stays the starting point, then do one dry run in Chrome.

- [ ] Save the finished PWA on a branch. It's in your working copy now, not committed: `git checkout -b pwa`, then `git add -A`, then `git commit -m "Convert SISI to a PWA"`, then `git checkout main`. Students start from `main` (commit 66e45bb); you switch to `pwa` to show the end result.
- [ ] During class, copy any finished file onto `main` with `git checkout pwa -- public/sw.js` (works for every file named in this guide).
- [ ] Use Chrome or Edge. They fire the install event and have the Application panel this guide walks through.
- [ ] Dry run: `npm run api` in one terminal, `npm run pwa` in another, open http://localhost:4173, install the app, try the offline demo.
- [ ] Undo the dry run so the class sees a first install: uninstall the app, then DevTools → Application → Storage → Clear site data.
- [ ] Ports to remember: 4000 is the API, 5173 is `npm run dev`, 4173 is the built app from `npm run pwa`.
- [ ] Nothing new to install: the PWA uses no extra packages.

## Lesson plan at a glance

Six parts in 120 minutes: two files make SISI installable, one makes it work offline, and two React hooks tell the user what's going on.

| Part | Minutes | Students see | Files |
| --- | --- | --- | --- |
| 1. What a PWA is | 10 | The finished app installed and opening with the servers off | none |
| 2. Manifest and icons | 20 | Chrome's Manifest panel fill in, then the install option | `public/manifest.webmanifest`, `public/pwa-*.png`, `public/apple-touch-icon.png`, `index.html` |
| 3. The service worker | 30 | The three events and two caching strategies, line by line | `public/sw.js` |
| 4. Register, build, DevTools | 15 | The worker running and the caches filling up | `src/utils/registerServiceWorker.ts`, `src/main.tsx`, `package.json` |
| 5. React: banner and install button | 20 | An offline banner and an Install app button | `src/hooks/useOnlineStatus.ts`, `src/hooks/useInstallPrompt.ts`, `src/components/shared/common/OfflineBanner.tsx`, `Header.tsx`, `src/utils/api.ts`, `src/hooks/AuthProvider.tsx` |
| 6. Offline demo, questions | 25 | Everything working with no network | none |

## Part 1: what a PWA is (10 min)

A progressive web app is a website people can install like an app, which still opens without a connection.

**Open with the hook.** Start on the `pwa` branch with SISI already installed. Open it from the dock or Start menu: it has its own window and icon. Stop both servers with Ctrl+C, then reload. It still opens. Ask the class: "The server is off. Where did that page come from?" The rest of the lesson answers that.

**The three requirements** (write these on the board):

1. **HTTPS.** Browsers only run service workers on secure sites. `localhost` counts as secure, so class works without certificates.
2. **A web app manifest.** A JSON file with the app's name, icons, colours and how it opens.
3. **A service worker.** A script that sits between the app and the network and can answer from saved copies.

**Why it fits SISI.** Residents in wards with patchy mobile data can still check projects they've already opened. They install it straight from the browser, with no app store and no second codebase.

**Say up front:** installable and works offline are two different things. Part 2 makes it installable; Part 3 makes it work offline.

## Part 2: manifest and icons (20 min)

The manifest tells the browser what to call the app, which icons to use and how it opens; it lives in `public/` so Vite copies it unchanged.

**Step 1: create `public/manifest.webmanifest`.** Walk through the fields:

| Field | What it does | SISI's value |
| --- | --- | --- |
| `name` | Shown in the install dialog and splash screen | SISI – Sisi County |
| `short_name` | Shown under the home-screen icon | SISI |
| `start_url` | The page that opens when the app launches | `/` |
| `display` | `standalone` = own window, no address bar | `standalone` |
| `theme_color` | Colour of the title bar and task switcher | `#143d26` (tea dark) |
| `background_color` | Splash screen behind the icon while it loads | `#f5f7f4` (paper) |
| `icons` | 192 and 512 px, plus a maskable 512 | `pwa-192.png`, `pwa-512.png`, `pwa-maskable-512.png` |
| `shortcuts` | Long-press or right-click menu on the app icon | Browse projects, Propose a project, Follow the money |
| `screenshots` | Shown in Chrome's richer install dialog | `home-wide.png`, `project-narrow.png` |

**Step 2: the icons.** Point out the two kinds:

- **any** (`pwa-192.png`, `pwa-512.png`): shown as they are, with rounded corners drawn in.
- **maskable** (`pwa-maskable-512.png`): Android crops it into a circle or squircle, so it fills the square and keeps the lettering inside the middle 80%.
- **Apple touch icon** (`apple-touch-icon.png`, 180 px): iPhones use this instead of the manifest icons.

**Step 3: link it from `index.html`.** Three lines in the `<head>`:

```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#143d26" />
```

**Checkpoint.** Run `npm run dev`, open DevTools → Application → Manifest. Students should see the name, colours and all icons, with no warnings. Recent Chrome may already offer to install at this point. Say clearly: it installs, but it still won't open offline. That's Part 3.

## Part 3: the service worker (30 min)

`public/sw.js` is about 80 lines of plain JavaScript that the browser runs in the background; read it top to bottom with the class.

**The three events**, in the order they appear in the file:

1. **install** runs once per new version and saves the app shell: the page, the built JS and CSS, the icons. Point out the trick: Vite renames `index-B9Ql3zuN.js` on every build, so the worker downloads `/`, reads the current file names out of the HTML, and saves those.
2. **activate** runs when the new version takes over. It deletes every cache that isn't the current `VERSION`, then `clients.claim()` starts controlling tabs that are already open.
3. **fetch** runs for every request the app makes and decides where the answer comes from:

| The app asks for… | Answered by | If the network fails |
| --- | --- | --- |
| Votes, feedback, logins (`POST`) | Network only | Error message: it must reach the server |
| Opening a page | Network first | The saved `index.html` |
| SISI API data | Network first | The last saved answer |
| Logins under `/api/auth/` | Network only | Error message: it belongs to one person |
| Built JS and CSS, icons, fonts | Cache first | (only downloaded if missing) |
| Anything else (the Google Map) | Not touched | The browser handles it |

**The two caching strategies**, at the bottom of the file:

| Strategy | How it works | Used for | Why |
| --- | --- | --- | --- |
| Network first | Try the network and save a copy; if that fails, use the saved copy | Pages, API data | Data changes, so fresh beats saved whenever you can get it |
| Cache first | Use the saved copy; download only what's missing | Built JS and CSS, icons, Google Fonts | These files never change once built |

**Questions students will ask:**

- *Why can't I vote offline?* The worker only handles `GET` requests. A vote has to reach the server, so it goes straight to the network and fails with a clear message.
- *Why isn't my login saved?* Anything under `/api/auth/` belongs to one person. Saving it could show one person's account to the next person on the same device.
- *What's `response.clone()` for?* A response body can only be read once: one copy goes into the cache, the other goes back to the page.

**Point out `VERSION`.** Change it whenever `sw.js` or the shell files change. The browser sees a different file, installs the new worker, and `activate` deletes the old caches.

## Part 4: register, build, DevTools (15 min)

The worker only runs in the production build, so from here on the class uses `npm run pwa` (build + preview on port 4173), not `npm run dev`.

**Step 1: `src/utils/registerServiceWorker.ts`.** Two guards and one call:

- `import.meta.env.PROD` keeps it out of `npm run dev`. Ask the class why: Vite changes files constantly in dev, and a cache-first worker would keep serving the old ones.
- `"serviceWorker" in navigator` skips browsers without support.
- It registers `/sw.js` on the `load` event, so it never slows down the first paint.

**Step 2: call it in `src/main.tsx`**, before `createRoot`: `registerServiceWorker();`

**Step 3: the `pwa` script in `package.json`:** `"pwa": "npm run build && vite preview"`. Keep `npm run api` running in a second terminal.

**DevTools tour** (Application panel, left sidebar):

1. **Manifest:** name, icons, shortcuts, screenshots. Installability problems show here.
2. **Service workers:** status should read "activated and is running". Show the "Update on reload" checkbox and the Unregister link; they're the fixes when a cache gets stuck.
3. **Cache storage:** two caches, `sisi-app-v1` (page, JS, CSS, icons, fonts) and `sisi-data-v1` (API answers). Click around the app and refresh this list: entries appear as pages are visited.
4. **Network panel:** responses answered by the worker say "(ServiceWorker)" in the Size column.

**Checkpoint.** Everyone has the worker activated and at least one `/api/projects` entry in `sisi-data-v1`.

## Part 5: React, the offline banner and install button (20 min)

The worker works silently, so two small hooks tell the user what's happening; both use `useSyncExternalStore`, the hook for listening to things outside React.

**Step 1: `src/hooks/useOnlineStatus.ts`.** It subscribes to the browser's `online` and `offline` events and returns `navigator.onLine`. Connect it to the `useEffect` lessons: this is the same subscribe-and-clean-up idea, and React handles it for you.

**Step 2: `src/components/shared/common/OfflineBanner.tsx`**, rendered at the bottom of `Header.tsx`. The `role="status"` wrapper is always on the page so screen readers announce the message when it appears.

**Step 3: `src/hooks/useInstallPrompt.ts`.** Chrome and Edge fire `beforeinstallprompt` when the app can be installed. The hook keeps that event and gives back `canInstall` and `install()`. Three things to point out:

- It listens as soon as the file loads, because the event can fire before React renders anything.
- `event.preventDefault()` stops the browser's own pop-up so we can show our own button.
- Each event works once, so after `prompt()` the button disappears. iPhones never fire it: there, it's Share → Add to Home Screen.

**Step 4: the Install app button in `Header.tsx`.** It only renders when `canInstall` is true, so it never shows inside the installed app.

**Step 5: two small fixes so offline feels right.**

- `src/utils/api.ts` now throws an `ApiError` with the HTTP status, and says "You're offline. Connect to the internet and try again." instead of "Can't reach the SISI API" when there's no connection.
- In `src/hooks/AuthProvider.tsx` (next to your localStorage notes), the token is now removed only when the API answers 401. Before, opening the app offline logged people out.

**Checkpoint.** In DevTools → Network, set throttling to Offline: the banner appears. Set it back: it goes.

## The offline demo, step by step

The proof that the cache works is stopping the servers: on localhost, turning off Wi-Fi doesn't stop `localhost:4000` or `localhost:4173` from answering.

1. Terminal 1: `npm run api`. Terminal 2: `npm run pwa`. Open http://localhost:4173 in Chrome.
2. DevTools → Application → Service workers: wait for "activated and is running".
3. Click Projects, open a project, then Wards. Show Cache storage → `sisi-data-v1` filling up.
4. Click **Install app** (or the install icon in the address bar). SISI opens in its own window. Right-click its icon in the dock or taskbar to show the three shortcuts.
5. DevTools → Network → throttling → **Offline**. The yellow banner appears.
6. Stop both servers with Ctrl+C. Reload. The app still opens and the projects you visited are still there.
7. Open a ward you haven't visited yet. It says "You're offline. Connect to the internet and try again." Ask why: it was never saved.
8. Try to vote. Same message. Remind them: votes are `POST`, never cached.
9. Restart both servers and set throttling back to No throttling. The banner disappears and everything works again.
10. **Updating:** change `const VERSION = "v1"` to `"v2"` in `public/sw.js`, run `npm run pwa` again, reload twice. Cache storage now shows only `sisi-app-v2` and `sisi-data-v2`.

Tip: the Network panel's Offline switch doesn't always stop the service worker's own requests, which is why step 6 stops the servers.

## Troubleshooting during class

Most problems in a PWA lesson are an old worker or an old cache answering; the first fix to try is DevTools → Application → Storage → Clear site data, then reload.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Code changes don't show in the built app | The old worker is serving saved files | Run `npm run pwa` again (it copies `sw.js` at build time), bump `VERSION`, or tick "Update on reload" |
| No service worker in `npm run dev` | On purpose: it only registers in production | Use `npm run pwa` and port 4173 |
| No Install app button | Not Chrome or Edge, already installed, or the manifest has a problem | Check Application → Manifest for warnings; uninstall the old copy |
| No install option on an iPhone | Safari never fires `beforeinstallprompt` | Share → Add to Home Screen |
| Works on the laptop, not on a phone at `http://192.168…:4173` | Service workers need HTTPS everywhere except `localhost` | Deploy (Netlify, Vercel) or use Chrome's remote debugging port forwarding; the phone must reach the API too |
| Fonts look plain offline | On the very first visit, fonts loaded before the worker existed | Reload once while online, then go offline |
| A page is blank offline | The worker hadn't finished installing | Open the app online and wait for "activated and is running" |
| "Can't reach the SISI API" while online | The API isn't running | `npm run api` |
| Logged out after the API restarts | The API keeps logins in memory | Log in again; this is expected |
| Port 4173 still shows an old version | An earlier preview is still running, so Vite quietly moved the new one to 4174 | Stop the old one with Ctrl+C and use the address Vite prints |

## Questions to check understanding, and homework

Ask these at the end of Part 6; each answer is one sentence, given here for you.

| Question | Answer |
| --- | --- |
| Why does the worker only register in the production build? | In dev, Vite changes files constantly; a cache-first worker would keep serving old code. |
| Why network first for API data but cache first for `/assets`? | Data changes; built files get a new name whenever they change, so a saved copy is never stale. |
| Why can't you vote offline? | The worker only handles `GET`; a vote has to reach the server. |
| Why is `/api/auth/` never saved? | It belongs to one person; the next person on the device could see it. |
| What happens when you change `VERSION`? | The browser installs the new worker and `activate` deletes the old caches. |
| Why read the file names out of `index.html` during install? | Vite gives the JS and CSS new names on every build. |
| Why does turning off Wi-Fi not prove the cache works here? | `localhost` keeps working without Wi-Fi; you have to stop the servers. |
| Why `useSyncExternalStore` in the two hooks? | The online status and install event live outside React; this hook subscribes and cleans up for you. |

**Homework** (pick one or two):

1. **Update prompt.** Remove `self.skipWaiting()` and show "A new version is ready. Refresh" when a new worker is waiting (`registration.waiting`, then `postMessage` to it).
2. **Stay logged in offline.** Save the user object next to the token with `JSON.stringify`, and show it while offline. It builds on your localStorage notes in `AuthProvider.tsx`.
3. **Queue offline votes.** Save votes made offline and send them when the `online` event fires. Show "Will send when you're back online".
4. **Ready before the first visit.** In `install`, also save `/api/projects` and `/api/wards`, so those lists work offline even if the user never opened them.
5. **Install it on a phone.** Deploy the app and API to free hosting with HTTPS and install SISI on a real phone.

## In real projects: vite-plugin-pwa

At work you'd let `vite-plugin-pwa` write the service worker; version 2.0 supports this project's Vite 8 and saves every built file automatically, so the read-the-HTML trick isn't needed.

- **Hand-written (today):** students see every event and every caching decision.
- **Plugin:** fewer bugs, and it handles file lists, updates and caching strategies for you (it's built on Google's Workbox).

To switch, run `npm install -D vite-plugin-pwa`, delete `public/sw.js` and the `registerServiceWorker()` call (the plugin adds its own), and add it to `vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // keep using public/manifest.webmanifest
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/api/") &&
              !url.pathname.startsWith("/api/auth/"),
            handler: "NetworkFirst",
            options: { cacheName: "sisi-data" },
          },
          {
            urlPattern: ({ url }) => url.hostname.startsWith("fonts."),
            handler: "CacheFirst",
            options: { cacheName: "sisi-fonts" },
          },
        ],
      },
    }),
  ],
});
```

This config is a starting point I haven't run in this project; try it on a branch before showing it in class.
