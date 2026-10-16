// Seed data for the SISI mock API.
// Everything here is fictional — swap in your own county's details.
// Data lives in memory: changes made through the API reset when the server restarts.

export const county = {
  name: "Sisi County",
  tagline: "Your county, your voice.",
  about:
    "Sisi County is a dynamic county located in the Central Province of Kenya. " +
    "Home to the wards of Nyathuna, Kikuyu, Wangige, and Karura, our county is committed " +
    "to transparent governance and community-driven development. The county government uses SISI " +
    "so residents can propose projects, vote on them, track how public money is spent, " +
    "and give feedback on work in their ward.",
  headquarters: "Kikuyu Town",
  population: 203600,
  areaKm2: 404,
  contact: {
    phone: "+254 700 000 000",
    email: "info@sisicounty.go.ke",
    address: "County Headquarters, Kikuyu Town",
    hours: "Mon–Fri, 8:00am – 5:00pm",
  },
  location: { lat: -1.245, lng: 36.662 }, // Approximate Kikuyu coords
  mapEmbedUrl: "https://www.google.com/maps?q=-1.245,36.662&z=13&output=embed",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=-1.245,36.662",
};

export const wards = [
  {
    id: 1,
    name: "Nyathuna",
    population: 45000,
    areaKm2: 95,
    description:
      "A rapidly growing ward known for its vibrant community and developing infrastructure.",
    image: "https://picsum.photos/seed/nyathuna/800/500",
  },
  {
    id: 2,
    name: "Kikuyu",
    population: 68000,
    areaKm2: 110,
    description:
      "The commercial and administrative heart of the county, home to the main market and county offices.",
    image: "https://picsum.photos/seed/kikuyu/800/500",
  },
  {
    id: 3,
    name: "Wangige",
    population: 52000,
    areaKm2: 88,
    description:
      "A densely populated ward with a strong focus on community health and education initiatives.",
    image: "https://picsum.photos/seed/wangige/800/500",
  },
  {
    id: 4,
    name: "Karura",
    population: 38600,
    areaKm2: 111,
    description:
      "A serene ward bordered by the forest, focusing on environmental conservation and security.",
    image: "https://picsum.photos/seed/karura/800/500",
  },
];

export const projects = [
  {
    id: 1,
    slug: "nyathuna-level-3-hospital",
    title: "Nyathuna Level 3 Hospital Upgrade",
    category: "Health",
    status: "In Progress",
    wardId: 1,
    summary:
      "Upgrading the local health facility to a Level 3 hospital to serve 45,000 residents.",
    description:
      "Residents currently travel far for specialized care. This project upgrades the facility with a maternity wing, outpatient departments, and modern diagnostic equipment.",
    budget: 15000000,
    spent: 6500000,
    progress: 45,
    startDate: "2026-03-02",
    endDate: "2026-12-15",
    image: "https://picsum.photos/seed/nyathuna-hospital/800/500",
    milestones: [
      { title: "Site preparation", done: true },
      { title: "Foundation and framing", done: true },
      { title: "Medical equipment installation", done: false },
      { title: "Staffing and handover", done: false },
    ],
    votes: { support: 412, reject: 18 },
    proposedBy: "Nyathuna Community Health Committee",
    createdAt: "2025-11-04T09:00:00.000Z",
  },
  {
    id: 2,
    slug: "kikuyu-police-post-expansion",
    title: "Kikuyu Additional Police Post",
    category: "Security",
    status: "Approved",
    wardId: 2,
    summary:
      "Construction of an additional police post to enhance security in the busy market area.",
    description:
      "As the commercial center grows, so does the need for visible security. This project builds a modern police post with holding cells and community policing offices.",
    budget: 8500000,
    spent: 0,
    progress: 10,
    startDate: "2026-06-01",
    endDate: "2026-11-30",
    image: "https://picsum.photos/seed/kikuyu-police/800/500",
    milestones: [
      { title: "Land allocation", done: true },
      { title: "Tendering", done: false },
      { title: "Construction", done: false },
      { title: "Commissioning", done: false },
    ],
    votes: { support: 538, reject: 41 },
    proposedBy: "Kikuyu Traders Welfare Group",
    createdAt: "2025-05-12T09:00:00.000Z",
  },
  {
    id: 3,
    slug: "wangige-level-4-hospital-proposal",
    title: "Wangige Level 4 Hospital Proposal",
    category: "Health",
    status: "Pending",
    wardId: 3,
    summary:
      "A proposal to build a new Level 4 hospital to serve the growing Wangige population.",
    description:
      "Wangige needs a comprehensive healthcare facility. This proposal seeks funding for a Level 4 hospital with surgical theaters, pediatric wards, and emergency services.",
    budget: 45000000,
    spent: 0,
    progress: 0,
    startDate: null,
    endDate: null,
    image: "https://picsum.photos/seed/wangige-hospital/800/500",
    milestones: [],
    votes: { support: 690, reject: 12 },
    proposedBy: "Wangige Residents Association",
    createdAt: "2026-06-18T09:00:00.000Z",
  },
  {
    id: 4,
    slug: "karura-community-policing-initiative",
    title: "Karura Security and Police Posts",
    category: "Security",
    status: "In Progress",
    wardId: 4,
    summary:
      "Establishing two new community police posts and installing street lighting for safety.",
    description:
      "To protect our forest-adjacent communities, this project establishes two new police posts and installs solar street lights along key access roads.",
    budget: 9200000,
    spent: 4000000,
    progress: 40,
    startDate: "2026-01-15",
    endDate: "2026-09-30",
    image: "https://picsum.photos/seed/karura-security/800/500",
    milestones: [
      { title: "Site survey", done: true },
      { title: "Foundation laying", done: true },
      { title: "Solar light installation", done: false },
      { title: "Handover to police", done: false },
    ],
    votes: { support: 301, reject: 57 },
    proposedBy: "Karura Community Watch",
    createdAt: "2025-09-22T09:00:00.000Z",
  },
];

export const feedback = [
  {
    id: 1,
    projectId: 1,
    name: "John Kamau",
    message:
      "Great to see the hospital upgrade finally starting. Our ward needs this!",
    createdAt: "2026-09-30T14:12:00.000Z",
  },
  {
    id: 2,
    projectId: 2,
    name: "Anonymous",
    message:
      "Please ensure the new police post has adequate parking for patrol vehicles.",
    createdAt: "2026-10-03T08:45:00.000Z",
  },
];

// Passwords are stored in plain text because this is a classroom mock. Never do this in a real API.
export const users = [
  {
    id: 1,
    name: "Demo Citizen",
    email: "demo@example.com",
    phone: "0700000001",
    password: "password123",
    role: "user",
    status: "Approved",
  },
];
