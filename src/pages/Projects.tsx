import { useSearchParams } from "react-router";
import ProjectCard from "../components/projects/ProjectCard";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import PageHeader from "../components/shared/ui/PageHeader";
import SelectField from "../components/shared/ui/SelectField";
import { useFetch } from "../hooks/useFetch";
import { type Project, type Ward } from "../types";
import { CATEGORIES, PROJECT_STATUSES } from "../utils/constants";

const Projects = () => {
  // Filters live in the URL (/projects?status=Pending&wardId=2), so a filtered list can be shared.
  // The same query string goes straight to the API.
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: projects, loading, error, refetch } = useFetch<Project[]>(`/projects?${searchParams}`);
  const { data: wards } = useFetch<Ward[]>("/wards");

  const status = searchParams.get("status") ?? "";
  const wardId = searchParams.get("wardId") ?? "";
  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";
  const hasFilters = Boolean(status || wardId || category || q);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Projects"
        intro="Every project proposed in Sisi County, from new ideas waiting for votes to finished work."
      >
        <LinkButton to="/projects/monitoring" title="Follow the money" variant="outline" />
        <LinkButton to="/projects/propose" title="Propose a project" />
      </PageHeader>

      <div className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <InputField
            label="Search"
            type="search"
            value={q}
            onChange={(e) => setFilter("q", e.target.value)}
            placeholder="Borehole, road, market..."
          />
          <SelectField label="Ward" value={wardId} onChange={(e) => setFilter("wardId", e.target.value)}>
            <option value="">All wards</option>
            {wards?.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </SelectField>
          <SelectField label="Category" value={category} onChange={(e) => setFilter("category", e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </SelectField>
        </div>

        <div role="group" aria-label="Filter by stage" className="flex flex-wrap gap-2">
          {["", ...PROJECT_STATUSES].map((value) => (
            <button
              key={value || "all"}
              type="button"
              onClick={() => setFilter("status", value)}
              aria-pressed={status === value}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                status === value ? "border-tea bg-tea text-white" : "border-line bg-white hover:border-tea"
              }`}
            >
              {value || "All stages"}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !projects ? (
        <Loader label="Loading projects" />
      ) : (
        <section aria-busy={loading} className="flex flex-col gap-5">
          <p className="text-muted" role="status">
            {loading ? "Updating..." : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
          </p>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line p-10 text-center">
              <p className="text-lg font-semibold">No projects match these filters.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => setSearchParams({}, { replace: true })}
                    className="rounded-lg border border-tea px-5 py-2.5 font-semibold text-tea hover:bg-tea-light"
                  >
                    Clear filters
                  </button>
                )}
                <LinkButton to="/projects/propose" title="Propose a project" />
              </div>
            </div>
          ) : (
            <div className={`grid gap-6 transition md:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Projects;
