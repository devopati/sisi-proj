import { type Project } from "../../types";
import Contours from "../shared/ui/Contours";

type ProjectCoverProps = {
  project: Pick<Project, "id" | "category">;
  className?: string; // set the height, e.g. "h-32"
};

// A drawn cover with the project's category. Used instead of project.image,
// because the practice API's images are random placeholder photos.
const ProjectCover = ({ project, className = "" }: ProjectCoverProps) => {
  return (
    <div className={`relative overflow-hidden bg-tea-light ${className}`}>
      <Contours seed={project.id} className="absolute inset-0 size-full text-tea/20" />
      <span className="type-display absolute bottom-3 left-4 text-2xl text-tea-dark/80">{project.category}</span>
    </div>
  );
};

export default ProjectCover;
