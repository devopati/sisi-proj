import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router";
import FeedbackSection from "../components/projects/FeedbackSection";
import MilestoneList from "../components/projects/MilestoneList";
import ProjectCover from "../components/projects/ProjectCover";
import VoteButtons from "../components/projects/VoteButtons";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import ProgressBar from "../components/shared/ui/ProgressBar";
import StatusPill from "../components/shared/ui/StatusPill";
import { useFetch } from "../hooks/useFetch";
import { type Project } from "../types";
import {
  formatDate,
  formatKES,
  formatTimeLeft,
  isFunded,
} from "../utils/format";
import { projectPath } from "../utils/paths";

// Route: /projects/:id/:slug (only the id is sent to the API)
const ProjectDetails = () => {
  const { id, slug } = useParams();
  const location = useLocation();
  //copy link state
  const {
    data: project,
    loading,
    error,
    refetch,
  } = useFetch<Project>(`/projects/${id}`);

  const justProposed = (location.state as { justProposed?: boolean } | null)
    ?.justProposed;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy project link:", error);
    }
  };

  // Scroll to feedback when a link points to #feedback.
  useEffect(() => {
    if (project && location.hash === "#feedback") {
      document.getElementById("feedback")?.scrollIntoView();
    }
  }, [project, location.hash]);

  if (loading) {
    return <Loader label="Loading project" />;
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-start gap-5">
        <h1 className="type-display text-4xl">
          This project couldn't be loaded
        </h1>
        <ErrorMessage message={error} onRetry={refetch} />
        <LinkButton to="/projects" title="See all projects" variant="outline" />
      </div>
    );
  }

  // Fix the URL if the slug is missing or incorrect.
  if (slug !== project.slug) {
    return <Navigate to={projectPath(project) + location.hash} replace />;
  }

  const funded = isFunded(project.status);

  // Calculate completed milestones from the existing project data.
  const completedMilestones = project.milestones.filter(
    (milestone) => milestone.done,
  ).length;

  // Calculate the time message without adding state.
  const timeLeft =
    project.status === "Completed"
      ? "Finished"
      : formatTimeLeft(project.endDate);

  return (
    <div className="flex flex-col gap-10">
      <Link
        to="/projects"
        className="self-start font-semibold text-tea underline-offset-4 hover:underline"
      >
        Back to all projects
      </Link>

      {justProposed && (
        <p
          role="status"
          className="rounded-lg bg-tea-light px-5 py-4 text-tea-dark"
        >
          <strong>Your proposal is in.</strong> It stays Pending until the
          county reviews it. Residents can vote on it now.
        </p>
      )}

      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={project.status} />
          <span className="text-muted">{project.ward.name} ward</span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="items-right rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
        >
          {copied ? "Copied" : "Copy link"}
        </button>

        <h1 className="type-display mt-4 text-4xl md:text-5xl">
          {project.title}
        </h1>

        <p className="mt-4 text-xl text-muted">{project.summary}</p>
      </header>

      <ProjectCover project={project} className="h-40 rounded-xl md:h-56" />

      <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
        <div className="flex min-w-0 flex-col gap-14">
          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold">About this project</h2>

            <p className="max-w-prose text-lg leading-relaxed">
              {project.description}
            </p>

            <dl className="grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted">Ward</dt>
                <dd>
                  <Link
                    to={`/wards/${project.ward.id}`}
                    className="font-semibold text-tea hover:underline"
                  >
                    {project.ward.name}
                  </Link>
                </dd>
              </div>

              <div>
                <dt className="text-sm text-muted">Proposed by</dt>
                <dd className="font-semibold">{project.proposedBy}</dd>
              </div>

              <div>
                <dt className="text-sm text-muted">Proposed on</dt>
                <dd className="font-semibold">
                  {formatDate(project.createdAt)}
                </dd>
              </div>
            </dl>
          </section>

          {project.milestones.length > 0 && (
            <section className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold">Milestones</h2>

              <p className="text-sm text-muted">
                {completedMilestones} of {project.milestones.length} milestones
                done
              </p>

              <MilestoneList milestones={project.milestones} />
            </section>
          )}

          <FeedbackSection projectId={project.id} />
        </div>

        <aside className="order-first flex flex-col gap-6 self-start lg:sticky lg:top-24 lg:order-none">
          <section className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Money and progress</h2>

            {funded ? (
              <>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted">Budget</dt>
                    <dd className="font-semibold tabular-nums">
                      {formatKES(project.budget)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted">Spent</dt>
                    <dd className="font-semibold tabular-nums">
                      {formatKES(project.spent)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted">Starts</dt>
                    <dd className="font-semibold">
                      {formatDate(project.startDate)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted">Due</dt>
                    <dd className="font-semibold">
                      {formatDate(project.endDate)}
                    </dd>

                    {timeLeft && (
                      <dd className="mt-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            timeLeft === "Finished"
                              ? "bg-tea-light text-tea-dark"
                              : timeLeft.startsWith("Overdue")
                                ? "bg-red-100 text-red-700"
                                : timeLeft === "Due today"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {timeLeft}
                        </span>
                      </dd>
                    )}
                  </div>
                </dl>

                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold">
                    {project.progress}% built
                  </p>

                  <ProgressBar
                    value={project.progress}
                    size="lg"
                    label={`${project.progress}% built`}
                  />
                </div>
              </>
            ) : (
              <>
                <p>
                  <span className="text-sm text-muted">
                    {project.status === "Rejected"
                      ? "Budget asked for"
                      : "Budget requested"}
                  </span>
                  <br />
                  <span className="text-2xl font-bold tabular-nums">
                    {formatKES(project.budget)}
                  </span>
                </p>

                <p className="text-sm text-muted">
                  No money is committed until the county approves a project.
                </p>
              </>
            )}
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Your vote</h2>

            <p className="text-sm text-muted">
              Support or reject this project. You need to be logged in to vote.
            </p>

            <VoteButtons projectId={project.id} initialVotes={project.votes} />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetails;
