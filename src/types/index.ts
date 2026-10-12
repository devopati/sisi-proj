export type ProductType = {
  name: string;
  price: number;
};

export type StatusType =
  | "Rejected"
  | "Pending"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "On Hold"
  | "Cancelled"
  | "Failed"
  | "Success"
  | "Error";

export interface UserType {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "guest";
  status: StatusType;
}

export interface CurrUserType extends UserType {
  token: string;
}

// ---------- SISI API types (see API.md) ----------

export type ProjectStatus = "Pending" | "Approved" | "In Progress" | "Completed" | "Rejected";

export interface Milestone {
  title: string;
  done: boolean;
}

export interface Votes {
  support: number;
  reject: number;
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
  votes: Votes;
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
  votes: Votes;
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
