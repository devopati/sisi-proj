import { useMemo, useState } from "react";
import { Link } from "react-router";
import MoneySummary from "../components/projects/MoneySummary";
import WardSpending from "../components/projects/WardSpending";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import Loader from "../components/shared/ui/Loader";
import PageHeader from "../components/shared/ui/PageHeader";
import ProgressBar from "../components/shared/ui/ProgressBar";
import StatusPill from "../components/shared/ui/StatusPill";
import { useFetch } from "../hooks/useFetch";
import { type Project, type Stats } from "../types";
import { formatKES, isFunded } from "../utils/format";
import { projectPath } from "../utils/paths";

type SortKey = "budget" | "spent" | "progress";
type SortDirection = "asc" | "desc";

const Monitoring = () => {
  const stats = useFetch<Stats>("/stats");
  const projects = useFetch<Project[]>("/projects");
  const funded = projects.data?.filter((project) => isFunded(project.status)) ?? [];
  const [sortBy, setSortBy] = useState<SortKey>("budget");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sortedProjects = useMemo(() => {
    const rows = [...funded];
    rows.sort((a, b) => {
      const left = sortBy === "budget" ? a.budget : sortBy === "spent" ? a.spent : a.progress;
      const right = sortBy === "budget" ? b.budget : sortBy === "spent" ? b.spent : b.progress;
      return direction === "asc" ? left - right : right - left;
    });
    return rows;
  }, [direction, funded, sortBy]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(key);
    setDirection("desc");
  };

  const getSortState = (key: SortKey) => {
    if (sortBy !== key) return "none";
    return direction === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="flex flex-col gap-14">
      <PageHeader
        title="Follow the money"
        intro="How much has been committed to approved projects, how much has been spent, and how far along the work is."
      />

      {stats.error ? (
        <ErrorMessage message={stats.error} onRetry={stats.refetch} />
      ) : !stats.data ? (
        <Loader label="Loading spending" />
      ) : (
        <div className="grid gap-10 lg:grid-cols-2">
          <MoneySummary stats={stats.data} />
          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold">Spending by ward</h2>
            <WardSpending byWard={stats.data.byWard} />
          </section>
        </div>
      )}

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Project by project</h2>
        {projects.error ? (
          <ErrorMessage message={projects.error} onRetry={projects.refetch} />
        ) : !projects.data ? (
          <Loader label="Loading projects" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-line text-sm text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Project</th>
                  <th className="px-4 py-3 font-semibold">Ward</th>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th aria-sort={getSortState("budget")} className="px-4 py-3 text-right font-semibold">
                    <button type="button" onClick={() => handleSort("budget")} className="inline-flex items-center gap-2">
                      Budget {sortBy === "budget" ? (direction === "asc" ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th aria-sort={getSortState("spent")} className="px-4 py-3 text-right font-semibold">
                    <button type="button" onClick={() => handleSort("spent")} className="inline-flex items-center gap-2">
                      Spent {sortBy === "spent" ? (direction === "asc" ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th aria-sort={getSortState("progress")} className="w-44 px-4 py-3 font-semibold">
                    <button type="button" onClick={() => handleSort("progress")} className="inline-flex items-center gap-2">
                      Built {sortBy === "progress" ? (direction === "asc" ? "↑" : "↓") : ""}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sortedProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3">
                      <Link to={projectPath(project)} className="font-semibold hover:text-tea hover:underline">
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{project.ward.name}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={project.status} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatKES(project.budget)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatKES(project.spent)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProgressBar value={project.progress} label={`${project.progress}% built`} />
                        <span className="w-10 text-right text-sm tabular-nums">{project.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-sm text-muted">
          Only approved projects have money committed. Pending and rejected proposals are on the{" "}
          <Link to="/projects" className="text-tea underline underline-offset-4">
            projects page
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default Monitoring;
