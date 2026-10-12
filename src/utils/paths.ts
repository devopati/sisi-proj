import { type Project } from "../types";

// The project page URL: /projects/1/mlimani-community-borehole
export const projectPath = (project: Pick<Project, "id" | "slug">) => `/projects/${project.id}/${project.slug}`;
