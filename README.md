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

SISI is a progressive web app: it can be installed, and pages you've opened still work offline. The service worker only runs in the production build:

```bash
npm run pwa   # build, then serve it → http://localhost:4173
```

In Chrome or Edge, click **Install app** in the header. The worker is [public/sw.js](public/sw.js) and the app details are in [public/manifest.webmanifest](public/manifest.webmanifest).

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

If the API runs on another address, create `.env.local` with `VITE_API_URL=http://your-host:4000/api`.
