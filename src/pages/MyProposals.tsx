
import { Link } from "react-router";
import ProjectCard from "../components/projects/ProjectCard";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import PageHeader from "../components/shared/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import type { Project } from "../types";

const MyProposals = () => {
  const { user } = useAuth();
  const {
    data: projects,
    loading,
    error,
    refetch,
  } = useFetch<Project[]>("/projects");

  const myProjects = (projects ?? []).filter(
    (project) => project.proposedBy === user?.name,
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My proposals"
        intro="Projects you have proposed for your community."
      >
        <LinkButton to="/projects/propose" title="Propose a project" />
      </PageHeader>

      {error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !projects ? (
        <Loader label="Loading your proposals" />
      ) : myProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <p className="text-lg font-semibold">You haven't proposed any projects yet.</p>
          <p className="mt-2 text-muted">
            Have an idea that could help your community? Start your first proposal.
          </p>
          <div className="mt-4">
            <LinkButton
              to="/projects/propose"
              title="Propose a project"
            />
          </div>
          <p className="mt-4 text-sm">
            <Link
              to="/projects"
              className="font-semibold text-tea underline underline-offset-4"
            >
              Browse all projects
            </Link>
          </p>
        </div>
      ) : (
        <section
          aria-busy={loading}
          className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${
            loading ? "opacity-60" : ""
          }`}
        >
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      )}
    </div>
  );
};

export default MyProposals;
