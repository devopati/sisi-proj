// SISI mock API: a tiny JSON API for the frontend lessons.
// No dependencies. Start it with `npm run api`, then open http://localhost:4000/api
// Docs: API.md in the project root.

import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { county, feedback, projects, users, wards } from "./data.js";

const PORT = Number(process.env.PORT ?? 4000);
// Fake network latency (ms) so loading states are visible. Turn off with DELAY=0.
const DELAY = Number(process.env.DELAY ?? 500);

const STATUSES = ["Pending", "Approved", "In Progress", "Completed", "Rejected"];
// Only these projects have money allocated; Pending/Rejected budgets are just requests.
const FUNDED = ["Approved", "In Progress", "Completed"];

const sessions = new Map(); // token -> userId
const smsCodes = new Map(); // phone -> code
const votes = new Map(); // "projectId:userId" -> "support" | "reject"
const contactMessages = [];

// ---------- helpers ----------

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class Created {
  constructor(data) {
    this.data = data;
  }
}

const fail = (status, message) => {
  throw new HttpError(status, message);
};

const required = (body, fields) => {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === "");
  if (missing.length) fail(400, `Missing required field(s): ${missing.join(", ")}`);
};

const nextId = (list) => Math.max(0, ...list.map((item) => item.id)) + 1;
const sum = (list, key) => list.reduce((total, item) => total + item[key], 0);
const slugify = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sameText = (value, filter) => !filter || String(value).toLowerCase() === filter.toLowerCase();

const findProject = (id) => projects.find((p) => p.id === Number(id)) ?? fail(404, `Project ${id} not found`);
const findWard = (id) => wards.find((w) => w.id === Number(id)) ?? fail(404, `Ward ${id} not found`);
const findUserByPhone = (phone) => users.find((u) => u.phone === phone) ?? fail(404, "No account with that phone number");

const withWard = (project) => {
  const { id, name } = findWard(project.wardId);
  return { ...project, ward: { id, name } };
};

const withWardTotals = (ward) => {
  const wardProjects = projects.filter((p) => p.wardId === ward.id);
  const funded = wardProjects.filter((p) => FUNDED.includes(p.status));
  return { ...ward, projectCount: wardProjects.length, budget: sum(funded, "budget"), spent: sum(funded, "spent") };
};

// ---------- auth helpers ----------

const publicUser = ({ password: _password, ...user }) => user;

const sendSmsCode = (phone) => {
  const code = String(Math.floor(1000 + Math.random() * 9000));
  smsCodes.set(phone, code);
  console.log(`📱 SMS to ${phone}: your SISI code is ${code}`);
  return code;
};

const consumeSmsCode = (phone, code) => {
  if (smsCodes.get(phone) !== String(code)) fail(400, "Invalid or expired code");
  smsCodes.delete(phone);
};

const startSession = (user) => {
  const token = randomUUID();
  sessions.set(token, user.id);
  return { ...publicUser(user), token };
};

const currentUser = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = users.find((u) => u.id === sessions.get(token));
  if (!user) fail(401, "Login required. Send the header Authorization: Bearer <token>");
  return user;
};

// ---------- routes ----------
// Each handler gets { req, body, params, query } and returns the JSON to send.
// Return `new Created(data)` to respond with 201 instead of 200.

const routes = [
  ["GET", "/api", () => routes.map(([method, path]) => `${method} ${path}`)],

  // Auth
  [
    "POST",
    "/api/auth/register",
    ({ body }) => {
      required(body, ["name", "email", "phone", "password"]);
      if (users.some((u) => u.email === body.email)) fail(409, "That email is already registered");
      if (users.some((u) => u.phone === body.phone)) fail(409, "That phone number is already registered");
      const user = {
        id: nextId(users),
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password,
        role: "user",
        status: "Pending",
      };
      users.push(user);
      const devCode = sendSmsCode(user.phone);
      return new Created({ message: `Verification code sent to ${user.phone}`, phone: user.phone, devCode });
    },
  ],
  [
    "POST",
    "/api/auth/verify",
    ({ body }) => {
      required(body, ["phone", "code"]);
      const user = findUserByPhone(body.phone);
      consumeSmsCode(body.phone, body.code);
      user.status = "Approved";
      return startSession(user);
    },
  ],
  [
    "POST",
    "/api/auth/login",
    ({ body }) => {
      required(body, ["email", "password"]);
      const user = users.find((u) => u.email === body.email && u.password === body.password);
      if (!user) fail(401, "Wrong email or password");
      if (user.status !== "Approved") fail(403, "Verify your phone number first (POST /api/auth/verify)");
      return startSession(user);
    },
  ],
  [
    "POST",
    "/api/auth/forgot-password",
    ({ body }) => {
      required(body, ["phone"]);
      findUserByPhone(body.phone);
      const devCode = sendSmsCode(body.phone);
      return { message: `Reset code sent to ${body.phone}`, devCode };
    },
  ],
  [
    "POST",
    "/api/auth/reset-password",
    ({ body }) => {
      required(body, ["phone", "code", "password"]);
      const user = findUserByPhone(body.phone);
      consumeSmsCode(body.phone, body.code);
      user.password = body.password;
      user.status = "Approved";
      return { message: "Password updated. You can now log in." };
    },
  ],
  ["GET", "/api/auth/me", ({ req }) => publicUser(currentUser(req))],

  // Projects
  [
    "GET",
    "/api/projects",
    ({ query }) => {
      const search = query.get("q")?.toLowerCase();
      return projects
        .filter(
          (p) =>
            sameText(p.status, query.get("status")) &&
            sameText(p.category, query.get("category")) &&
            sameText(p.wardId, query.get("wardId")) &&
            (!search || `${p.title} ${p.summary}`.toLowerCase().includes(search)),
        )
        .map(withWard);
    },
  ],
  ["GET", "/api/projects/:id", ({ params }) => withWard(findProject(params.id))],
  [
    "POST",
    "/api/projects",
    ({ req, body }) => {
      const user = currentUser(req);
      required(body, ["title", "summary", "category", "wardId", "budget"]);
      findWard(body.wardId);
      const slug = slugify(body.title);
      const project = {
        id: nextId(projects),
        slug,
        title: body.title,
        category: body.category,
        status: "Pending",
        wardId: Number(body.wardId),
        summary: body.summary,
        description: body.description || body.summary,
        budget: Number(body.budget),
        spent: 0,
        progress: 0,
        startDate: null,
        endDate: null,
        image: `https://picsum.photos/seed/${slug}/800/500`,
        milestones: [],
        votes: { support: 0, reject: 0 },
        proposedBy: user.name,
        createdAt: new Date().toISOString(),
      };
      projects.push(project);
      return new Created(withWard(project));
    },
  ],
  [
    "POST",
    "/api/projects/:id/vote",
    ({ req, body, params }) => {
      const user = currentUser(req);
      const project = findProject(params.id);
      if (!["support", "reject"].includes(body.choice)) fail(400, 'choice must be "support" or "reject"');
      const key = `${project.id}:${user.id}`;
      const previous = votes.get(key);
      if (previous) project.votes[previous]--;
      project.votes[body.choice]++;
      votes.set(key, body.choice);
      return { votes: project.votes, myVote: body.choice };
    },
  ],
  [
    "GET",
    "/api/projects/:id/feedback",
    ({ params }) => {
      const project = findProject(params.id);
      return feedback
        .filter((f) => f.projectId === project.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  ],
  [
    "POST",
    "/api/projects/:id/feedback",
    ({ body, params }) => {
      const project = findProject(params.id);
      required(body, ["message"]);
      const entry = {
        id: nextId(feedback),
        projectId: project.id,
        name: body.name || "Anonymous",
        message: body.message,
        createdAt: new Date().toISOString(),
      };
      feedback.push(entry);
      return new Created(entry);
    },
  ],

  // Wards
  ["GET", "/api/wards", () => wards.map(withWardTotals)],
  [
    "GET",
    "/api/wards/:id",
    ({ params }) => {
      const ward = findWard(params.id);
      return { ...withWardTotals(ward), projects: projects.filter((p) => p.wardId === ward.id).map(withWard) };
    },
  ],

  // Stats (home overview + money monitoring)
  [
    "GET",
    "/api/stats",
    () => {
      const funded = projects.filter((p) => FUNDED.includes(p.status));
      const allocated = sum(funded, "budget");
      const spent = sum(funded, "spent");
      return {
        projects: {
          total: projects.length,
          byStatus: Object.fromEntries(STATUSES.map((s) => [s, projects.filter((p) => p.status === s).length])),
        },
        budget: { allocated, spent, percentSpent: allocated ? Math.round((spent / allocated) * 100) : 0 },
        byWard: wards.map(withWardTotals).map(({ id, name, budget, spent }) => ({ id, name, budget, spent })),
        participation: {
          citizens: users.length,
          votes: projects.reduce((total, p) => total + p.votes.support + p.votes.reject, 0),
          feedback: feedback.length,
        },
      };
    },
  ],

  // About + Contact
  ["GET", "/api/county", () => county],
  [
    "POST",
    "/api/contact",
    ({ body }) => {
      required(body, ["name", "email", "message"]);
      const ticket = {
        id: nextId(contactMessages),
        name: body.name,
        email: body.email,
        subject: body.subject || "General enquiry",
        message: body.message,
        createdAt: new Date().toISOString(),
      };
      contactMessages.push(ticket);
      console.log(`✉️  Contact message #${ticket.id} from ${ticket.name}: ${ticket.message}`);
      return new Created({
        message: `Thanks ${ticket.name}, we'll get back to you within 2 working days.`,
        ticketId: ticket.id,
      });
    },
  ],
];

// ---------- server ----------

const matchRoute = (method, pathname) => {
  const parts = pathname.replace(/\/+$/, "").split("/");
  for (const [routeMethod, pattern, handler] of routes) {
    const patternParts = pattern.split("/");
    if (routeMethod !== method || patternParts.length !== parts.length) continue;
    const params = {};
    const matched = patternParts.every((part, i) => {
      if (part.startsWith(":")) params[part.slice(1)] = decodeURIComponent(parts[i]);
      return part.startsWith(":") || part === parts[i];
    });
    if (matched) return { handler, params };
  }
};

const readBody = async (req) => {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw) ?? {};
  } catch {
    fail(400, "Request body must be valid JSON");
  }
};

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.writeHead(204).end();

  const url = new URL(req.url, `http://${req.headers.host}`);
  let status = 200;
  let data;
  try {
    const route = matchRoute(req.method, url.pathname);
    if (!route) fail(404, `No route for ${req.method} ${url.pathname}. See GET /api for the list.`);
    const body = req.method === "POST" ? await readBody(req) : {};
    const result = await route.handler({ req, body, params: route.params, query: url.searchParams });
    if (result instanceof Created) [status, data] = [201, result.data];
    else data = result;
  } catch (error) {
    if (!(error instanceof HttpError)) console.error(error);
    status = error.status ?? 500;
    data = { error: error instanceof HttpError ? error.message : "Something went wrong on the server" };
  }

  setTimeout(() => {
    res.writeHead(status, { "Content-Type": "application/json" }).end(JSON.stringify(data));
    console.log(`${req.method} ${req.url} → ${status}`);
  }, DELAY);
});

server.listen(PORT, () => {
  console.log(`SISI mock API running at http://localhost:${PORT}/api (delay ${DELAY}ms)`);
  console.log("Demo login: demo@example.com / password123");
});
