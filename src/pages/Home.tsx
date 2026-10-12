import { Link } from "react-router";
import MoneySummary from "../components/projects/MoneySummary";
import ProjectCard from "../components/projects/ProjectCard";
import Contours from "../components/shared/ui/Contours";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import StatusPill from "../components/shared/ui/StatusPill";
import { useFetch } from "../hooks/useFetch";
import { type Project, type Stats, type Ward } from "../types";
import { PROJECT_STATUSES } from "../utils/constants";
import { formatNumber, formatShortKES } from "../utils/format";

const steps = [
  { title: "Propose", text: "Any registered resident can suggest a project for their ward." },
  { title: "Vote", text: "Residents support or reject proposals. The best-supported go to the county for review." },
  { title: "Build", text: "Approved projects get a budget, a timeline and milestones you can check." },
  { title: "Follow up", text: "Track spending and progress, and tell the county what you see on the ground." },
];

const Home = () => {
  const wards = useFetch<Ward[]>("/wards");
  const stats = useFetch<Stats>("/stats");
  const underway = useFetch<Project[]>("/projects?status=In%20Progress");
  const byStatus = stats.data?.projects.byStatus;

  return (
    <div className="flex flex-col gap-24">
      {/* Hero: the four wards, each with how much of its money has been spent */}
      <section className="relative overflow-hidden rounded-2xl bg-tea-dark p-6 text-white md:p-10 lg:p-14">
        <Contours seed={7} className="pointer-events-none absolute inset-0 size-full text-white/6" />

        <div className="relative flex flex-col gap-8">
          <div className="max-w-5xl">
            <h1 className="type-display text-4xl md:text-5xl xl:text-6xl">
              See what's being built in your ward, and have a say in what comes next.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Propose projects, vote on proposals, and follow every shilling from budget to finished work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/projects" title="Browse projects" variant="light" />
            <Link
              to="/projects/propose"
              className="rounded-lg border border-white/40 px-5 py-2.5 font-semibold transition hover:bg-white/10"
            >
              Propose a project
            </Link>
          </div>
        </div>

        <div className="relative mt-14">
          <h2 className="mb-3 text-white/70">Choose your ward</h2>
          {wards.error ? (
            <p>
              {wards.error}{" "}
              <button type="button" onClick={wards.refetch} className="font-semibold underline underline-offset-4">
                Try again
              </button>
            </p>
          ) : !wards.data ? (
            <p className="text-white/70">Loading wards...</p>
          ) : (
            <ul className="grid lg:grid-cols-2 lg:gap-x-12">
              {wards.data.map((ward, index) => {
                const percentSpent = ward.budget ? Math.round((ward.spent / ward.budget) * 100) : 0;
                return (
                  <li key={ward.id} className="border-t border-white/15">
                    <Link to={`/wards/${ward.id}`} className="group flex flex-col gap-3 py-5">
                      <span className="flex flex-col gap-1">
                        <span className="type-display text-4xl transition group-hover:text-tea-light md:text-5xl">
                          {ward.name}
                        </span>
                        <span className="text-white/75 tabular-nums">
                          {formatShortKES(ward.budget)} committed, {percentSpent}% spent
                        </span>
                      </span>
                      <span
                        className="block h-1.5 overflow-hidden rounded bg-white/15"
                        title={`${percentSpent}% of ${ward.name}'s committed money spent`}
                      >
                        <span
                          className="block h-full animate-fill-in rounded bg-tea-light"
                          style={{ width: `${percentSpent}%`, animationDelay: `${300 + index * 120}ms` }}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Money */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="type-display text-3xl md:text-4xl">Where the money is</h2>
          <Link to="/projects/monitoring" className="font-semibold text-tea underline-offset-4 hover:underline">
            See spending project by project
          </Link>
        </div>

        {stats.error ? (
          <ErrorMessage message={stats.error} onRetry={stats.refetch} />
        ) : !stats.data ? (
          <Loader label="Loading spending" />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
              <MoneySummary stats={stats.data} />
              <div className="rounded-xl border border-line bg-white p-6">
                <h3 className="font-bold">Projects at each stage</h3>
                <ul className="mt-3 divide-y divide-line">
                  {PROJECT_STATUSES.map((status) => (
                    <li key={status} className="flex items-center justify-between py-2.5">
                      <StatusPill status={status} />
                      <span className="font-semibold tabular-nums">{byStatus?.[status]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-lg text-muted">
              Residents have cast {formatNumber(stats.data.participation.votes)} votes and left{" "}
              {formatNumber(stats.data.participation.feedback)} pieces of feedback so far.
            </p>
          </>
        )}
      </section>

      {/* Projects underway */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="type-display text-3xl md:text-4xl">Being built now</h2>
          <Link to="/projects" className="font-semibold text-tea underline-offset-4 hover:underline">
            See all projects
          </Link>
        </div>
        {underway.error ? (
          <ErrorMessage message={underway.error} onRetry={underway.refetch} />
        ) : !underway.data ? (
          <Loader label="Loading projects" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {underway.data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* How it works: a real sequence, so the steps are numbered */}
      <section className="flex flex-col gap-8">
        <h2 className="type-display text-3xl md:text-4xl">How SISI works</h2>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3 border-t-2 border-tea pt-4">
              <span className="text-4xl font-bold text-tea tabular-nums">{index + 1}</span>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Home;
