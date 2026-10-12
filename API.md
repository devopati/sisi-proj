# SISI API

A small practice API for building the SISI frontend. It runs on your own machine, needs nothing beyond Node, and answers in JSON.

All the data (Sisi County, its wards and projects) is made up. It lives in memory, so **restarting the API resets everything**, including new accounts and login tokens.

## Run it

Use two terminals:

```bash
npm run api   # the API  → http://localhost:4000/api
npm run dev   # the React app
```

- Open http://localhost:4000/api in your browser to see every route.
- Every response is delayed by **500 ms on purpose** so you can see your loading states. To turn it off, run `DELAY=0 npm run api`. To use a different port, run `PORT=5000 npm run api`.
- **Demo account:** `demo@example.com` / `password123`

## The basics

**Base URL:** `http://localhost:4000/api`. Every path below starts from here.

**Sending data:** `POST` requests take a JSON body. Send the header `Content-Type: application/json` and pass the body through `JSON.stringify(...)`.

**Logging in:** routes marked 🔒 need a token. You get one from `POST /auth/login` (or `POST /auth/verify`). Send it with every 🔒 request in this header:

```
Authorization: Bearer <token>
```

**SMS codes:** no real SMS is sent. The code comes back in the response as `devCode`, and it's also printed in the API terminal.

**Errors:** when something goes wrong you get an error status code and a message you can show the user:

```json
{ "error": "Wrong email or password" }
```

| Status | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created something new |
| `400` | A field is missing or invalid, or the SMS code is wrong |
| `401` | Not logged in, or wrong email/password |
| `403` | Phone number not verified yet |
| `404` | That project, ward or route doesn't exist |
| `409` | Email or phone is already registered |

> ⚠️ `fetch` does **not** throw on `400`/`404`/`500`. It only throws when the server can't be reached. Always check `res.ok`. The `api()` helper at the bottom of this page does it for you.

## Which page uses what

| Page | Endpoints |
| --- | --- |
| Home | `GET /stats`, `GET /projects?status=In Progress` |
| Register + SMS code | `POST /auth/register` → `POST /auth/verify` |
| Login | `POST /auth/login`, then `GET /auth/me` on page load |
| Forgot password | `POST /auth/forgot-password` → `POST /auth/reset-password` |
| Projects | `GET /projects` (with filters) |
| Single project `/projects/:id/:slug` | `GET /projects/:id`, `GET` + `POST /projects/:id/feedback`, `POST /projects/:id/vote` |
| Project proposal | `GET /wards` (for the ward dropdown), `POST /projects` |
| Monitoring | `GET /stats`, plus each project's `budget`, `spent`, `progress` and `milestones` |
| Wards | `GET /wards` |
| Single ward | `GET /wards/:id` |
| Participate | `POST /projects/:id/vote`, `POST /projects/:id/feedback`, `GET /stats` |
| About | `GET /county` |
| Contact | `GET /county` (details + map), `POST /contact` |

## All endpoints

| Method | Path | | What it does |
| --- | --- | --- | --- |
| `GET` | `/` | | Lists every route |
| `POST` | `/auth/register` | | Create an account and send an SMS code |
| `POST` | `/auth/verify` | | Confirm the SMS code and log in |
| `POST` | `/auth/login` | | Log in with email and password |
| `POST` | `/auth/forgot-password` | | Send a reset code by SMS |
| `POST` | `/auth/reset-password` | | Set a new password using the code |
| `GET` | `/auth/me` | 🔒 | Get the logged-in user |
| `GET` | `/projects` | | List projects (can filter) |
| `GET` | `/projects/:id` | | Get one project |
| `POST` | `/projects` | 🔒 | Propose a new project |
| `POST` | `/projects/:id/vote` | 🔒 | Vote to support or reject a project |
| `GET` | `/projects/:id/feedback` | | List feedback on a project |
| `POST` | `/projects/:id/feedback` | | Leave feedback on a project |
| `GET` | `/wards` | | List wards with totals |
| `GET` | `/wards/:id` | | Get one ward and its projects |
| `GET` | `/stats` | | Numbers for the home page and money monitoring |
| `GET` | `/county` | | County info, contacts and map links |
| `POST` | `/contact` | | Send a message to the county |

---

## Auth

### `POST /auth/register`

Creates an account and sends a 4-digit SMS code. The account can't log in until the phone is verified.

```json
// body: all fields required
{ "name": "Wanjiku", "email": "wanjiku@example.com", "phone": "0711111111", "password": "secret" }
```

```json
// 201
{ "message": "Verification code sent to 0711111111", "phone": "0711111111", "devCode": "7134" }
```

Errors: `400` missing field, `409` email or phone already registered.

### `POST /auth/verify`

Checks the SMS code, activates the account **and logs the user in**.

```json
// body
{ "phone": "0711111111", "code": "7134" }
```

```json
// 200: the user plus a token (same shape as login)
{
  "id": 2,
  "name": "Wanjiku",
  "email": "wanjiku@example.com",
  "phone": "0711111111",
  "role": "user",
  "status": "Approved",
  "token": "093e5ad0-2db2-4527-a78f-8d3430d4264e"
}
```

Errors: `400` wrong code, `404` no account with that phone.

### `POST /auth/login`

```json
// body
{ "email": "demo@example.com", "password": "password123" }
```

Returns the same user + `token` object as `/auth/verify`. It matches `CurrUserType` in `src/types`, plus a `phone` field.

Errors: `401` wrong email or password, `403` phone not verified yet.

### `POST /auth/forgot-password`

```json
// body
{ "phone": "0700000001" }
```

```json
// 200
{ "message": "Reset code sent to 0700000001", "devCode": "9806" }
```

### `POST /auth/reset-password`

```json
// body
{ "phone": "0700000001", "code": "9806", "password": "newpassword" }
```

```json
// 200
{ "message": "Password updated. You can now log in." }
```

### `GET /auth/me` 🔒

Returns the logged-in user (without the token). Call it when the app loads to check whether a saved token still works. If you get `401`, the token is no longer valid (for example, the API restarted), so log the user out.

---

## Projects

Every project looks like this:

```json
{
  "id": 1,
  "slug": "mlimani-community-borehole",
  "title": "Mlimani Community Borehole",
  "category": "Water",
  "status": "In Progress",
  "wardId": 1,
  "ward": { "id": 1, "name": "Mlimani" },
  "summary": "Drilling and equipping a solar-powered borehole to serve 3,000 households.",
  "description": "Residents of upper Mlimani walk up to 4 km for water...",
  "budget": 4500000,
  "spent": 2100000,
  "progress": 45,
  "startDate": "2026-03-02",
  "endDate": "2026-12-15",
  "image": "https://picsum.photos/seed/mlimani-community-borehole/800/500",
  "milestones": [
    { "title": "Hydrogeological survey", "done": true },
    { "title": "Drilling", "done": true },
    { "title": "Solar pump installation", "done": false }
  ],
  "votes": { "support": 412, "reject": 18 },
  "proposedBy": "Mlimani Residents Association",
  "createdAt": "2025-11-04T09:00:00.000Z"
}
```

- `status` is one of `"Pending"`, `"Approved"`, `"In Progress"`, `"Completed"` or `"Rejected"`. Use it for your `StatusPill`.
- `budget` and `spent` are in Kenyan shillings (KES). Format them with `formatCurrency(amount, "KES")` from `src/utils`.
- `progress` is a percentage from 0 to 100.
- Pending and rejected projects have `startDate`/`endDate` set to `null` and no milestones.
- Categories in the data: Water, Markets, Health, Roads, Energy, Education, Agriculture.

### `GET /projects`

Returns an array of projects. All filters are optional, ignore upper/lower case, and can be combined:

| Query | Example | Keeps projects where |
| --- | --- | --- |
| `status` | `?status=pending` | the status matches |
| `category` | `?category=water` | the category matches |
| `wardId` | `?wardId=2` | the project is in that ward |
| `q` | `?q=road` | the title or summary contains the text |

```
GET /projects?status=In%20Progress&wardId=4
```

Tip: build query strings with `new URLSearchParams({ status, q })`. It handles the space in "In Progress" for you.

### `GET /projects/:id`

Returns one project. Your page URL can be `/projects/1/mlimani-community-borehole`, but only the **id** goes to the API: `GET /projects/1`.

Errors: `404`.

### `POST /projects` 🔒

Submits a proposal. It's created with `status: "Pending"`, no money spent and zero votes. `proposedBy` is the logged-in user's name.

```json
// body: description is optional, everything else is required
{
  "title": "Ziwani Boda Boda Shed",
  "summary": "A covered waiting shed for riders at the stage.",
  "description": "Riders wait in the sun and rain...",
  "category": "Transport",
  "wardId": 3,
  "budget": 900000
}
```

Returns `201` and the new project. Errors: `400` missing field, `401` not logged in, `404` unknown `wardId`.

### `POST /projects/:id/vote` 🔒

Each user gets one vote per project. Voting again changes your vote.

```json
// body
{ "choice": "support" }   // or "reject"
```

```json
// 200: the updated totals
{ "votes": { "support": 129, "reject": 9 }, "myVote": "support" }
```

Errors: `400` choice isn't `"support"` or `"reject"`, `401`, `404`.

### `GET /projects/:id/feedback`

Returns feedback on the project, newest first.

```json
[
  { "id": 2, "projectId": 1, "name": "Anonymous", "message": "Please add a cattle trough next to the water kiosk.", "createdAt": "2026-10-03T08:45:00.000Z" }
]
```

### `POST /projects/:id/feedback`

No login needed. If `name` is left out, it's saved as `"Anonymous"`.

```json
// body
{ "message": "The road is much better now!", "name": "Otieno" }
```

Returns `201` and the new feedback entry. Errors: `400` missing `message`, `404`.

---

## Wards

### `GET /wards`

```json
[
  {
    "id": 1,
    "name": "Mlimani",
    "population": 48200,
    "areaKm2": 112,
    "description": "Hilly farming ward known for tea and dairy...",
    "image": "https://picsum.photos/seed/mlimani/800/500",
    "projectCount": 2,
    "budget": 4500000,
    "spent": 2100000
  }
]
```

`budget` and `spent` only count funded projects (Approved, In Progress, Completed).

### `GET /wards/:id`

Returns the same ward object plus `"projects": [...]`, an array of every project in that ward. Errors: `404`.

---

## Stats

### `GET /stats`

Use this for the home page overview and the money monitoring page.

```json
{
  "projects": {
    "total": 8,
    "byStatus": { "Pending": 2, "Approved": 1, "In Progress": 2, "Completed": 2, "Rejected": 1 }
  },
  "budget": { "allocated": 36300000, "spent": 19400000, "percentSpent": 53 },
  "byWard": [
    { "id": 1, "name": "Mlimani", "budget": 4500000, "spent": 2100000 },
    { "id": 2, "name": "Kati", "budget": 7800000, "spent": 7650000 }
  ],
  "participation": { "citizens": 1, "votes": 2848, "feedback": 4 }
}
```

`budget` counts only funded projects. A Pending or Rejected project's budget is just the amount requested.

---

## County and contact

### `GET /county`

```json
{
  "name": "Sisi County",
  "tagline": "Your county, your voice.",
  "about": "Sisi County is a lakeside county of four wards...",
  "headquarters": "Kati Town",
  "population": 189300,
  "areaKm2": 404,
  "contact": {
    "phone": "+254 700 000 000",
    "email": "info@sisicounty.example",
    "address": "County Headquarters, Kati Town",
    "hours": "Mon–Fri, 8:00am – 5:00pm"
  },
  "location": { "lat": -0.0917, "lng": 34.768 },
  "mapEmbedUrl": "https://www.google.com/maps?q=-0.0917,34.768&z=13&output=embed",
  "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=-0.0917,34.768"
}
```

- Google map: `<iframe src={county.mapEmbedUrl} className="w-full h-80" loading="lazy" />`
- Directions: `<a href={county.directionsUrl} target="_blank">Get directions</a>`

### `POST /contact`

```json
// body: subject is optional
{ "name": "Jo", "email": "jo@example.com", "subject": "Water", "message": "When will the borehole open?" }
```

```json
// 201
{ "message": "Thanks Jo, we'll get back to you within 2 working days.", "ticketId": 1 }
```

---

## TypeScript types

Copy these into `src/types/index.ts`. Login and verify already match your `CurrUserType`. Add `phone: string` to `UserType` if you want to show the phone number.

```ts
export type ProjectStatus = "Pending" | "Approved" | "In Progress" | "Completed" | "Rejected";

export interface Milestone {
  title: string;
  done: boolean;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  wardId: number;
  ward: { id: number; name: string };
  summary: string;
  description: string;
  budget: number;
  spent: number;
  progress: number;
  startDate: string | null;
  endDate: string | null;
  image: string;
  milestones: Milestone[];
  votes: { support: number; reject: number };
  proposedBy: string;
  createdAt: string;
}

export interface Ward {
  id: number;
  name: string;
  population: number;
  areaKm2: number;
  description: string;
  image: string;
  projectCount: number;
  budget: number;
  spent: number;
}

export interface WardDetail extends Ward {
  projects: Project[];
}

export interface Feedback {
  id: number;
  projectId: number;
  name: string;
  message: string;
  createdAt: string;
}

export interface VoteResult {
  votes: { support: number; reject: number };
  myVote: "support" | "reject";
}

export interface Stats {
  projects: { total: number; byStatus: Record<ProjectStatus, number> };
  budget: { allocated: number; spent: number; percentSpent: number };
  byWard: { id: number; name: string; budget: number; spent: number }[];
  participation: { citizens: number; votes: number; feedback: number };
}

export interface County {
  name: string;
  tagline: string;
  about: string;
  headquarters: string;
  population: number;
  areaKm2: number;
  contact: { phone: string; email: string; address: string; hours: string };
  location: { lat: number; lng: number };
  mapEmbedUrl: string;
  directionsUrl: string;
}
```

## Using it from React

### A small fetch helper

This lives in [`src/utils/api.ts`](src/utils/api.ts). It adds the base URL, JSON headers and the token, and it **throws** with the API's error message when the response isn't OK. The version in the project also gives a friendly message when the API isn't running. For loading data in a component, the project wraps it in a `useFetch` hook ([`src/hooks/useFetch.ts`](src/hooks/useFetch.ts)).

```ts
export const API_URL = "http://localhost:4000/api";

type Options = { method?: "GET" | "POST"; body?: unknown; token?: string };

export const api = async <T>(path: string, { method = "GET", body, token }: Options = {}): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};
```

### Loading a list with `useEffect`

```tsx
const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Project[]>("/projects")
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return projects.map((project) => <ProjectCard key={project.id} {...project} />);
};
```

### Re-fetching when a filter changes

Put the filter in the dependency array. The effect runs again every time it changes.

```tsx
const [status, setStatus] = useState("");

useEffect(() => {
  const params = new URLSearchParams({ status });
  api<Project[]>(`/projects?${params}`).then(setProjects);
}, [status]);
```

### Logging in and sending the token

```tsx
const handleLogin = async () => {
  try {
    const user = await api<CurrUserType>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem("token", user.token);
    setCurrentUser(user); // e.g. a value in your user context
  } catch (err) {
    setError((err as Error).message); // "Wrong email or password"
  }
};

const handleVote = async (projectId: number) => {
  const { votes } = await api<VoteResult>(`/projects/${projectId}/vote`, {
    method: "POST",
    body: { choice: "support" },
    token: currentUser.token,
  });
  // update the card's vote count with `votes`
};
```

## Changing the data

All the seed data is in [`server/data.js`](server/data.js). Edit it to use your own county's wards and projects, then restart `npm run api`. The routes are in [`server/index.js`](server/index.js).
