import { Link, useParams } from "react-router";
import ProjectCard from "../components/projects/ProjectCard";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Contours from "../components/shared/ui/Contours";
import Loader from "../components/shared/ui/Loader";
import { useFetch } from "../hooks/useFetch";
import { type WardDetail } from "../types";
import { formatKES, formatNumber } from "../utils/format";

// Route: /wards/:id
const WardDetails = () => {
  const { id } = useParams();
  const { data: ward, loading, error, refetch } = useFetch<WardDetail>(`/wards/${id}`);

  if (loading) return <Loader label="Loading ward" />;

  if (error || !ward) {
    return (
      <div className="flex flex-col items-start gap-5">
        <h1 className="type-display text-4xl">This ward couldn't be loaded</h1>
        <ErrorMessage message={error} onRetry={refetch} />
        <LinkButton to="/wards" title="See all wards" variant="outline" />
      </div>
    );
  }

  const facts = [
    { label: "Residents", value: formatNumber(ward.population) },
    { label: "Area", value: `${ward.areaKm2} km²` },
    { label: "Projects", value: String(ward.projectCount) },
    { label: "Money committed", value: formatKES(ward.budget) },
    { label: "Money spent", value: formatKES(ward.spent) },
  ];

  return (
    <div className="flex flex-col gap-14">
      <Link to="/wards" className="self-start font-semibold text-tea underline-offset-4 hover:underline">
        Back to all wards
      </Link>

      <header className="relative overflow-hidden rounded-2xl bg-tea-dark p-6 text-white md:p-10">
        <Contours seed={ward.id + 10} className="absolute inset-0 size-full text-white/10" />
        <div className="relative">
          <h1 className="type-display text-5xl md:text-7xl">{ward.name}</h1>
          <p className="mt-5 max-w-xl text-xl text-white/80">{ward.description}</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm text-white/70">{fact.label}</dt>
                <dd className="text-lg font-semibold tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="type-display text-3xl">Projects in {ward.name}</h2>
          <LinkButton to="/projects/propose" title="Propose a project here" variant="outline" />
        </div>

        {ward.projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-10 text-center text-lg">
            No projects in {ward.name} yet. Be the first to propose one.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ward.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WardDetails;
