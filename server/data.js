// Seed data for the SISI mock API.
// Everything here is fictional — swap in your own county's details.
// Data lives in memory: changes made through the API reset when the server restarts.

export const county = {
  name: "Sisi County",
  tagline: "Your county, your voice.",
  about:
    "Sisi County is a lakeside county of four wards, home to farmers, fishermen and traders. " +
    "The county government uses SISI so residents can propose projects, vote on them, " +
    "track how public money is spent and give feedback on work in their ward.",
  headquarters: "Kati Town",
  population: 189300,
  areaKm2: 404,
  contact: {
    phone: "+254 700 000 000",
    email: "info@sisicounty.example",
    address: "County Headquarters, Kati Town",
    hours: "Mon–Fri, 8:00am – 5:00pm",
  },
  location: { lat: -0.0917, lng: 34.768 },
  mapEmbedUrl: "https://www.google.com/maps?q=-0.0917,34.768&z=13&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=-0.0917,34.768",
};

export const wards = [
  {
    id: 1,
    name: "Mlimani",
    population: 48200,
    areaKm2: 112,
    description: "Hilly farming ward known for tea and dairy, with villages spread across the ridges.",
    image: "https://picsum.photos/seed/mlimani/800/500",
  },
  {
    id: 2,
    name: "Kati",
    population: 63500,
    areaKm2: 38,
    description: "The county's commercial centre, home to the main market and the county offices.",
    image: "https://picsum.photos/seed/kati/800/500",
  },
  {
    id: 3,
    name: "Ziwani",
    population: 41900,
    areaKm2: 156,
    description: "Lakeside ward whose economy runs on fishing and small-scale irrigation.",
    image: "https://picsum.photos/seed/ziwani/800/500",
  },
  {
    id: 4,
    name: "Bondeni",
    population: 35700,
    areaKm2: 98,
    description: "Fertile valley ward with a strong dairy cooperative and maize farming.",
    image: "https://picsum.photos/seed/bondeni/800/500",
  },
];

export const projects = [
  {
    id: 1,
    slug: "mlimani-community-borehole",
    title: "Mlimani Community Borehole",
    category: "Water",
    status: "In Progress",
    wardId: 1,
    summary: "Drilling and equipping a solar-powered borehole to serve 3,000 households.",
    description:
      "Residents of upper Mlimani walk up to 4 km for water in the dry season. " +
      "This project drills a borehole, installs a solar pump and builds a water kiosk run by a community committee.",
    budget: 4500000,
    spent: 2100000,
    progress: 45,
    startDate: "2026-03-02",
    endDate: "2026-12-15",
    image: "https://picsum.photos/seed/mlimani-community-borehole/800/500",
    milestones: [
      { title: "Hydrogeological survey", done: true },
      { title: "Drilling", done: true },
      { title: "Solar pump installation", done: false },
      { title: "Water kiosk handover", done: false },
    ],
    votes: { support: 412, reject: 18 },
    proposedBy: "Mlimani Residents Association",
    createdAt: "2025-11-04T09:00:00.000Z",
  },
  {
    id: 2,
    slug: "kati-market-shade-upgrade",
    title: "Kati Market Shade Upgrade",
    category: "Markets",
    status: "Completed",
    wardId: 2,
    summary: "Roofed stalls, drainage and lighting for 250 traders at Kati open-air market.",
    description:
      "Traders lost stock every rainy season. The market now has roofed stalls, " +
      "covered drainage, lighting and a lockable store for perishable goods.",
    budget: 7800000,
    spent: 7650000,
    progress: 100,
    startDate: "2025-08-01",
    endDate: "2026-02-28",
    image: "https://picsum.photos/seed/kati-market-shade-upgrade/800/500",
    milestones: [
      { title: "Site clearing", done: true },
      { title: "Roofing and stalls", done: true },
      { title: "Drainage and lighting", done: true },
      { title: "Handover to traders", done: true },
    ],
    votes: { support: 538, reject: 41 },
    proposedBy: "Kati Traders Welfare Group",
    createdAt: "2025-05-12T09:00:00.000Z",
  },
  {
    id: 3,
    slug: "ziwani-maternity-wing",
    title: "Ziwani Health Centre Maternity Wing",
    category: "Health",
    status: "Approved",
    wardId: 3,
    summary: "A 20-bed maternity wing so mothers no longer travel 30 km to deliver.",
    description:
      "Ziwani Health Centre has no maternity ward. The new wing adds 20 beds, " +
      "a delivery room and a newborn unit. Construction starts once a contractor is selected.",
    budget: 12000000,
    spent: 0,
    progress: 0,
    startDate: "2027-01-10",
    endDate: "2027-10-30",
    image: "https://picsum.photos/seed/ziwani-maternity-wing/800/500",
    milestones: [
      { title: "Design approval", done: true },
      { title: "Contractor tendering", done: false },
      { title: "Construction", done: false },
      { title: "Equipping and staffing", done: false },
    ],
    votes: { support: 690, reject: 12 },
    proposedBy: "County Department of Health",
    createdAt: "2026-06-18T09:00:00.000Z",
  },
  {
    id: 4,
    slug: "bondeni-kati-link-road",
    title: "Bondeni–Kati Link Road",
    category: "Roads",
    status: "In Progress",
    wardId: 4,
    summary: "Grading and murraming 5 km of road linking Bondeni farms to Kati market.",
    description:
      "Farmers lose produce when the road becomes impassable after rain. " +
      "The project grades and murrams 5 km of road and adds culverts at three river crossings.",
    budget: 9200000,
    spent: 6900000,
    progress: 70,
    startDate: "2026-01-15",
    endDate: "2026-11-30",
    image: "https://picsum.photos/seed/bondeni-kati-link-road/800/500",
    milestones: [
      { title: "Survey and design", done: true },
      { title: "Grading", done: true },
      { title: "Culverts", done: false },
      { title: "Murraming", done: false },
    ],
    votes: { support: 301, reject: 57 },
    proposedBy: "Bondeni Farmers Cooperative",
    createdAt: "2025-09-22T09:00:00.000Z",
  },
  {
    id: 5,
    slug: "kati-main-street-solar-lights",
    title: "Kati Main Street Solar Lights",
    category: "Energy",
    status: "Pending",
    wardId: 2,
    summary: "60 solar street lights along Kati Main Street to make evenings safer.",
    description:
      "Shops close early because the main street is dark after 7pm. " +
      "This proposal installs 60 solar-powered street lights along the 3 km stretch.",
    budget: 3000000,
    spent: 0,
    progress: 0,
    startDate: null,
    endDate: null,
    image: "https://picsum.photos/seed/kati-main-street-solar-lights/800/500",
    milestones: [],
    votes: { support: 128, reject: 9 },
    proposedBy: "Amina W.",
    createdAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: 6,
    slug: "mlimani-ecde-classrooms",
    title: "Mlimani ECDE Classrooms",
    category: "Education",
    status: "Pending",
    wardId: 1,
    summary: "Two early-childhood classrooms and a play area at Mlimani Primary.",
    description:
      "More than 90 children share a single ECDE classroom. " +
      "This proposal builds two classrooms, child-sized toilets and an outdoor play area.",
    budget: 5600000,
    spent: 0,
    progress: 0,
    startDate: null,
    endDate: null,
    image: "https://picsum.photos/seed/mlimani-ecde-classrooms/800/500",
    milestones: [],
    votes: { support: 87, reject: 15 },
    proposedBy: "Mlimani Parents' Association",
    createdAt: "2026-09-28T09:00:00.000Z",
  },
  {
    id: 7,
    slug: "ziwani-fish-cold-storage",
    title: "Ziwani Fish Cold Storage",
    category: "Agriculture",
    status: "Rejected",
    wardId: 3,
    summary: "A cold room at Ziwani landing beach to cut post-harvest fish losses.",
    description:
      "Rejected for this budget cycle: the proposed plot is flood-prone. " +
      "The committee is welcome to resubmit with an alternative site.",
    budget: 6400000,
    spent: 0,
    progress: 0,
    startDate: null,
    endDate: null,
    image: "https://picsum.photos/seed/ziwani-fish-cold-storage/800/500",
    milestones: [],
    votes: { support: 76, reject: 203 },
    proposedBy: "Ziwani Beach Management Unit",
    createdAt: "2026-04-02T09:00:00.000Z",
  },
  {
    id: 8,
    slug: "bondeni-dairy-milk-cooler",
    title: "Bondeni Dairy Milk Cooler",
    category: "Agriculture",
    status: "Completed",
    wardId: 4,
    summary: "A 5,000-litre milk cooler for the Bondeni dairy cooperative.",
    description:
      "Farmers used to lose evening milk to spoilage. The cooler lets the cooperative " +
      "collect twice a day and sell in bulk to processors.",
    budget: 2800000,
    spent: 2750000,
    progress: 100,
    startDate: "2025-05-05",
    endDate: "2025-10-20",
    image: "https://picsum.photos/seed/bondeni-dairy-milk-cooler/800/500",
    milestones: [
      { title: "Cooler purchase", done: true },
      { title: "Power connection", done: true },
      { title: "Farmer training", done: true },
    ],
    votes: { support: 255, reject: 6 },
    proposedBy: "Bondeni Dairy Cooperative",
    createdAt: "2025-02-14T09:00:00.000Z",
  },
];

export const feedback = [
  {
    id: 1,
    projectId: 1,
    name: "Otieno",
    message: "The drilling crew has been on site every day. Great progress!",
    createdAt: "2026-09-30T14:12:00.000Z",
  },
  {
    id: 2,
    projectId: 1,
    name: "Anonymous",
    message: "Please add a cattle trough next to the water kiosk.",
    createdAt: "2026-10-03T08:45:00.000Z",
  },
  {
    id: 3,
    projectId: 2,
    name: "Mama Njeri",
    message: "Since the roof went up we can trade right through the rainy season.",
    createdAt: "2026-03-15T11:20:00.000Z",
  },
  {
    id: 4,
    projectId: 4,
    name: "Kiprono",
    message: "The section near the river still floods after heavy rain.",
    createdAt: "2026-08-21T17:05:00.000Z",
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
