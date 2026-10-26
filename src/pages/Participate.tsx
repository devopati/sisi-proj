import { useRef, useState, type KeyboardEvent, type SubmitEvent } from "react";
import { Link, useSearchParams } from "react-router";
import MoneySummary from "../components/projects/MoneySummary";
import ProjectCard from "../components/projects/ProjectCard";
import WardSpending from "../components/projects/WardSpending";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import PageHeader from "../components/shared/ui/PageHeader";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import SelectField from "../components/shared/ui/SelectField";
import TextAreaField from "../components/shared/ui/TextAreaField";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { useToast } from "../hooks/toastContext";
import { type Feedback, type Project, type Stats } from "../types";
import { api } from "../utils/api";
import { projectPath } from "../utils/paths";

const tabs = [
  { id: "vote", label: "Vote on proposals" },
  { id: "money", label: "Follow the money" },
  { id: "feedback", label: "Give feedback" },
];

// ---------- Vote ----------
const VoteTab = () => {
  const { data: proposals, error, refetch } = useFetch<Project[]>("/projects?status=Pending");

  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!proposals) return <Loader label="Loading proposals" />;

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-2xl text-lg text-muted">
        These proposals are waiting for residents' votes. The ones with the most support go to the county for review.
      </p>
      {proposals.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-lg">No proposals are waiting for votes right now.</p>
          <LinkButton to="/projects/propose" title="Propose a project" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Money ----------
const MoneyTab = () => {
  const { data: stats, error, refetch } = useFetch<Stats>("/stats");

  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!stats) return <Loader label="Loading spending" />;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <MoneySummary stats={stats} />
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-bold">Spending by ward</h2>
          <WardSpending byWard={stats.byWard} />
        </section>
      </div>
      <div>
        <LinkButton to="/projects/monitoring" title="See spending project by project" variant="outline" />
      </div>
    </div>
  );
};

// ---------- Feedback ----------
const FeedbackTab = () => {
  const { user, checking } = useAuth();
  const { data: projects } = useFetch<Project[]>("/projects");
  const { values, handleChange, setValues } = useForm({ projectId: "", name: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [postedOn, setPostedOn] = useState<Project | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setPostedOn(null);
    try {
      await api<Feedback>(`/projects/${values.projectId}/feedback`, {
        method: "POST",
        body: { message: values.message, name: user ? user.name : values.name },
      });
      setPostedOn(projects?.find((project) => project.id === Number(values.projectId)) ?? null);
      setValues((prev) => ({ ...prev, message: "" }));
      showToast("Feedback posted");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6">
        <SelectField label="Project" name="projectId" value={values.projectId} onChange={handleChange} required>
          <option value="">Choose a project</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title} ({project.ward.name})
            </option>
          ))}
        </SelectField>
        <TextAreaField
          label="Your feedback"
          name="message"
          value={values.message}
          onChange={handleChange}
          placeholder="What's working, what isn't, and what should change?"
          rows={5}
          required
        />
        {user ? (
          <p className="text-sm text-muted">
            Posting as <strong className="text-ink">{user.name}</strong>
          </p>
        ) : checking ? null : (
          <InputField
            label="Your name"
            name="name"
            value={values.name}
            onChange={handleChange}
            hint="Leave this blank to post anonymously."
          />
        )}

        {error && <ErrorMessage message={error} />}
        {postedOn && (
          <p role="status" className="rounded-lg bg-tea-light px-4 py-3 text-tea-dark">
            Feedback posted on {postedOn.title}.{" "}
            <Link to={`${projectPath(postedOn)}#feedback`} className="font-semibold underline underline-offset-4">
              See it on the project page
            </Link>
          </p>
        )}

        <PrimaryButton
          type="submit"
          title={sending ? "Posting..." : "Post feedback"}
          disabled={sending}
          className="self-start"
        />
      </form>

      <aside className="self-start text-muted">
        <h2 className="text-lg font-bold text-ink">Good feedback is specific</h2>
        <p className="mt-3">
          Say where you saw something and when. "The culvert near Bondeni river floods after rain" helps the county
          more than "the road is bad".
        </p>
        <p className="mt-3">Anyone can post feedback. You don't need an account.</p>
      </aside>
    </div>
  );
};

const Participate = () => {
  // The open tab lives in the URL (?tab=money) so other pages can link straight to it
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = tabs.some((tab) => tab.id === searchParams.get("tab")) ? searchParams.get("tab") : "vote";
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const current = tabs[index];
    const lastIndex = tabs.length - 1;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      tabRefs.current[nextIndex]?.focus();
      setSearchParams({ tab: tabs[nextIndex].id }, { replace: true });
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = (index - 1 + tabs.length) % tabs.length;
      tabRefs.current[previousIndex]?.focus();
      setSearchParams({ tab: tabs[previousIndex].id }, { replace: true });
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      tabRefs.current[0]?.focus();
      setSearchParams({ tab: tabs[0].id }, { replace: true });
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      tabRefs.current[lastIndex]?.focus();
      setSearchParams({ tab: tabs[lastIndex].id }, { replace: true });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSearchParams({ tab: current.id }, { replace: true });
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Have your say"
        intro="Vote on new proposals, check how public money is being spent, and tell the county what you see on the ground."
      />

      <div role="tablist" aria-label="Ways to take part" className="flex flex-wrap gap-2 border-b border-line">
        {tabs.map((tab, index) => (
          <button
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            aria-selected={activeTab === tab.id}
            aria-controls="participate-panel"
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            onClick={() => setSearchParams({ tab: tab.id }, { replace: true })}
            className={`-mb-px border-b-2 px-4 py-3 font-semibold transition ${
              activeTab === tab.id ? "border-tea text-tea" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div tabIndex={0} role="tabpanel" id="participate-panel" aria-labelledby={`tab-${activeTab}`}>
        {activeTab === "vote" && <VoteTab />}
        {activeTab === "money" && <MoneyTab />}
        {activeTab === "feedback" && <FeedbackTab />}
      </div>
    </div>
  );
};

export default Participate;
