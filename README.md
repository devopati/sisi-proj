# SISI

A public participation platform for a county government. Residents can propose projects for their ward, vote on proposals, follow how public money is spent, and give feedback.

Built with React, TypeScript, Tailwind CSS and React Router. It talks to a small practice API in [`server/`](server/), documented in [API.md](API.md). Sisi County and all its data are made up.

## Run it

```bash
npm install
npm run api   # the practice API → http://localhost:4000/api
npm run dev   # the app, in a second terminal
```

Log in with `demo@example.com` / `password123`, or register a new account. No real SMS is sent: the code appears on screen and in the API terminal.

The API keeps everything in memory, so restarting it resets all the data and logs everyone out.

## Install it as an app

SISI is a progressive web app: it can be installed, and cached pages and data still work offline. The service worker only runs in the production build:

```bash
npm run pwa   # build, then serve it → http://localhost:4173
```

In Chrome or Edge, click **Install app** in the header. The worker is [public/sw.js](public/sw.js) and the app details are in [public/manifest.webmanifest](public/manifest.webmanifest).

### Caching strategy

| Request | Strategy | Offline behavior |
| --- | --- | --- |
| App shell, built JS/CSS, icons and fonts | Cache first | Uses the installed app shell and previously downloaded files. |
| Page navigation | Network first | Uses the cached home page as the single-page-app fallback. |
| `GET /api/projects` and `GET /api/wards` | Network first; the two lists are also seeded during service-worker install | Shows the latest response when online and a saved response when offline. Other API GETs are saved after you visit them. |
| `/api/auth/*` and other form submissions | Network only | Login, registration, feedback, proposals and other POSTs need a connection. |
| Project votes | Network when online; queued in local storage when offline | Queued votes are sent when the browser reports it is online again. |
| External content such as the contact-page map | Browser/network | Not cached by the service worker. |

### Offline behavior and limitations

- The app shell, projects list and wards list are pre-cached; other GET data is available offline only after it has been fetched successfully at least once.
- The worker uses network-first for project and ward data, so offline users see the last successful cached response, which may be stale.
- Votes made offline are stored per user in this browser and retried when the browser reports an online connection. They are not encrypted or shared across devices.
- Queued votes need the same account to be signed in and the API to accept them before they are removed. Failed attempts stay queued for another online event.
- Authentication, registration, feedback, proposals, contact forms and other POST requests require a connection. External content such as the map is not cached.

This is a learning implementation, not durable transaction storage: local storage can be cleared, is not encrypted, and does not provide Background Sync guarantees. Do not use this queue for sensitive or high-value actions.

The app requests the API through the same-origin `/api` path so the service worker can cache GET responses. Vite proxies this path to the local practice API on port 4000 for both development and preview. In production, configure the hosting platform or a reverse proxy to route the app's same-origin `/api` requests to the API; pointing `VITE_API_URL` at a separate origin bypasses service-worker caching.

### Service worker lifecycle and updates

The first worker installs the app shell and activates immediately because there is no older version controlling the page. On a later release, the new worker installs its shell and data caches but waits while the current worker controls open pages. The header then shows **A new version is ready. Update now**. Selecting the button sends `SKIP_WAITING` to the waiting worker; it activates, removes old versioned caches, claims the open clients and the page reloads under the new worker. The service-worker console logs the install, confirmation and activation steps.

Change `VERSION` in [public/sw.js](public/sw.js) for each release (the current worker is `v3`). To verify an update, install and load one version, change the version and rebuild, then reload the app and confirm the waiting prompt appears before choosing **Update now**. Capture the waiting state and the page after activation in browser DevTools when preparing assignment evidence.

The app also includes a persistent dark-mode switch and dismissible toast messages as additional participation and accessibility improvements.

## Pages

| Page | URL | File |
| --- | --- | --- |
| Home | `/` | [pages/Home.tsx](src/pages/Home.tsx) |
| Register + SMS code | `/register` | [pages/Register.tsx](src/pages/Register.tsx) |
| Log in | `/login` | [pages/Login.tsx](src/pages/Login.tsx) |
| Forgot password | `/forgot-password` | [pages/ForgotPassword.tsx](src/pages/ForgotPassword.tsx) |
| All projects, with filters | `/projects` | [pages/Projects.tsx](src/pages/Projects.tsx) |
| Single project | `/projects/:id/:slug` | [pages/ProjectDetails.tsx](src/pages/ProjectDetails.tsx) |
| Project proposal (login needed) | `/projects/propose` | [pages/ProposeProject.tsx](src/pages/ProposeProject.tsx) |
| Monitoring: money and progress | `/projects/monitoring` | [pages/Monitoring.tsx](src/pages/Monitoring.tsx) |
| All wards | `/wards` | [pages/Wards.tsx](src/pages/Wards.tsx) |
| Single ward | `/wards/:id` | [pages/WardDetails.tsx](src/pages/WardDetails.tsx) |
| Participate: vote, money, feedback | `/participate` | [pages/Participate.tsx](src/pages/Participate.tsx) |
| About | `/about` | [pages/AboutUs.tsx](src/pages/AboutUs.tsx) |
| Contact, with map | `/contact` | [pages/ContactUs.tsx](src/pages/ContactUs.tsx) |

All routes are set up in [App.tsx](src/App.tsx).

## Folders

```
src/
  pages/                one file per page
  components/
    shared/common/      Header, Footer, CommonLayout (wraps every page)
    shared/ui/          PrimaryButton, StatusPill, InputField, SelectField, TextAreaField,
                        ProgressBar, Loader, ErrorMessage, PageHeader, LinkButton, Contours
    projects/           ProjectCard, VoteButtons, FeedbackSection, MilestoneList,
                        MoneySummary, WardSpending, ProjectCover
    wards/              WardDisplayCard
    auth/               AuthLayout, RequireAuth
  hooks/                useFetch, useForm, useVote, useAuth + AuthProvider
  utils/                api (fetch helper), format (money, dates), paths, constants
  types/                TypeScript types for everything the API returns
server/                 the practice API (plain Node, no dependencies)
```

## Where to find each idea

| Idea | Look at |
| --- | --- |
| Forms with multiple inputs, one `handleChange` | [pages/Register.tsx](src/pages/Register.tsx) |
| The same pattern as a custom hook | [hooks/useForm.ts](src/hooks/useForm.ts), used by every other form |
| Fetching with `useEffect`, loading and error states, cleanup | [hooks/useFetch.ts](src/hooks/useFetch.ts) |
| `useContext` for the logged-in user | [hooks/AuthProvider.tsx](src/hooks/AuthProvider.tsx), [hooks/useAuth.ts](src/hooks/useAuth.ts) |
| Sending a token with a request | [hooks/useVote.ts](src/hooks/useVote.ts), [pages/ProposeProject.tsx](src/pages/ProposeProject.tsx) |
| Routes, layouts and `<Outlet />` | [App.tsx](src/App.tsx), [CommonLayout.tsx](src/components/shared/common/CommonLayout.tsx) |
| URL params with `useParams` | [pages/ProjectDetails.tsx](src/pages/ProjectDetails.tsx) |
| Filters stored in the URL with `useSearchParams` | [pages/Projects.tsx](src/pages/Projects.tsx), [pages/Participate.tsx](src/pages/Participate.tsx) |
| Pages that need a login | [components/auth/RequireAuth.tsx](src/components/auth/RequireAuth.tsx) |
| Passing data between pages with navigation state | [pages/Login.tsx](src/pages/Login.tsx) (`from`), [pages/ProposeProject.tsx](src/pages/ProposeProject.tsx) (`justProposed`) |

## Design

Colours come from the county itself: tea green (`tea`), murram-road red (`murram`, only for rejections and errors), maize gold (`maize`, for pending) and lake blue (`lake`, for approved). They're defined once in [index.css](src/index.css) and used as Tailwind classes like `bg-tea` and `text-murram`. Headings use Archivo stretched wide with the `type-display` class.

The API's `image` fields hold random placeholder photos, so the app draws topographic covers instead ([Contours.tsx](src/components/shared/ui/Contours.tsx)). Once you have real photos, swap them back in with `<img src={project.image} />`.

For local development and `npm run pwa`, `/api` is proxied to `http://localhost:4000`. In a deployment, keep the API on the app's origin with a hosting-platform or reverse-proxy rule; a cross-origin `VITE_API_URL` will work for online API calls but cannot be intercepted or cached by this app's service worker.
