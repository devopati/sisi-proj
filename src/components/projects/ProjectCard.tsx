import { Link } from "react-router";
import { type Project } from "../../types";
import { formatShortKES, isFunded } from "../../utils/format";
import { projectPath } from "../../utils/paths";
import ProgressBar from "../shared/ui/ProgressBar";
import StatusPill from "../shared/ui/StatusPill";
import ProjectCover from "./ProjectCover";
import VoteButtons from "./VoteButtons";

const ProjectCard = ({ project }: { project: Project }) => {
  const link = projectPath(project);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <Link to={link} tabIndex={-1} aria-hidden>
        <ProjectCover project={project} className="h-28" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <StatusPill status={project.status} />
          <span className="text-sm text-muted">{project.ward.name} ward</span>
        </div>

        <h3 className="text-lg leading-snug font-bold">
          <Link to={link} className="underline-offset-4 hover:text-tea hover:underline">
            {project.title}
          </Link>
        </h3>

        <p className="leading-relaxed">{project.summary}</p>

        <div className="mt-auto flex flex-col gap-4 pt-2">
          {isFunded(project.status) ? (
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <span>
                  {formatShortKES(project.spent)} of {formatShortKES(project.budget)} spent
                </span>
                <span className="font-semibold">{project.progress}% built</span>
              </div>
              <ProgressBar value={project.progress} label={`${project.progress}% built`} />
            </div>
          ) : (
            <p className="text-sm text-muted">
              {project.status === "Rejected" ? "Asked for" : "Asking for"} {formatShortKES(project.budget)}
            </p>
          )}

          <div className="flex flex-wrap items-start justify-between gap-3 border-t border-line pt-4">
            <VoteButtons projectId={project.id} initialVotes={project.votes} />
            <Link
              to={`${link}#feedback`}
              className="py-1.5 text-sm font-semibold text-tea underline-offset-4 hover:underline"
            >
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
