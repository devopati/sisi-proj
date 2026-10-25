import { Link } from "react-router";
import ProjectCard from "../components/projects/ProjectCard";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import PageHeader from "../components/shared/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { type Project } from "../types";

const MyProposals = () => {
  const { user } = useAuth();
  const { data: projects, loading, error, refetch } = useFetch<Project[]>("/projects");

  if (error) return <div className="flex flex-col gap-4"><p className="text-murram">{error}</p><button type="button" onClick={refetch} className="self-start rounded-lg border border-tea px-3 py-2 font-semibold text-tea">Try again</button></div>;
  if (!projects || loading) return <Loader label="Loading your proposals" />;

  const myProjects = projects.filter((project) => project.proposedBy === user?.name);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="My proposals" intro="Projects you've put forward to Sisi County for review." />

      {myProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <p className="text-lg font-semibold">You haven't proposed any projects yet.</p>
          <div className="mt-4 flex justify-center">
            <LinkButton to="/projects/propose" title="Propose a project" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <Link to="/projects" className="text-sm font-semibold text-tea underline underline-offset-4">
        Browse all projects
      </Link>
    </div>
  );
};

export default MyProposals;
