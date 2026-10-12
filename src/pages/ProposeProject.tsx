import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import PageHeader from "../components/shared/ui/PageHeader";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import SelectField from "../components/shared/ui/SelectField";
import TextAreaField from "../components/shared/ui/TextAreaField";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { type Project, type Ward } from "../types";
import { api } from "../utils/api";
import { CATEGORIES } from "../utils/constants";
import { formatKES } from "../utils/format";
import { projectPath } from "../utils/paths";

const nextSteps = [
  "Your proposal is listed as Pending and residents can start voting.",
  "The county reviews proposals with strong support.",
  "If it's approved, the project gets a budget, dates and milestones.",
];

// Wrapped in <RequireAuth> in App.tsx, so there is always a logged-in user here
const ProposeProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: wards } = useFetch<Ward[]>("/wards");
  const { values, handleChange } = useForm({
    title: "",
    summary: "",
    description: "",
    category: "",
    wardId: "",
    budget: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const project = await api<Project>("/projects", {
        method: "POST",
        token: user?.token,
        // Form values are strings, the API wants numbers for these two
        body: { ...values, wardId: Number(values.wardId), budget: Number(values.budget) },
      });
      navigate(projectPath(project), { state: { justProposed: true } });
    } catch (err) {
      setError((err as Error).message);
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Propose a project"
        intro="Tell the county what your ward needs. Once you submit, residents can vote on your proposal."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6">
          <InputField
            label="Project name"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Kati bus stage shelter"
            maxLength={80}
            required
          />
          <InputField
            label="One-line summary"
            name="summary"
            value={values.summary}
            onChange={handleChange}
            hint={`Shown on project cards. ${140 - values.summary.length} characters left.`}
            maxLength={140}
            required
          />
          <TextAreaField
            label="Details"
            name="description"
            value={values.description}
            onChange={handleChange}
            hint="Who it helps, where exactly, and why it matters."
            rows={5}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <SelectField label="Ward" name="wardId" value={values.wardId} onChange={handleChange} required>
              <option value="">Choose a ward</option>
              {wards?.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </SelectField>
            <SelectField label="Category" name="category" value={values.category} onChange={handleChange} required>
              <option value="">Choose a category</option>
              {CATEGORIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </SelectField>
          </div>
          <InputField
            label="Estimated budget in Ksh"
            name="budget"
            type="number"
            value={values.budget}
            onChange={handleChange}
            min={10000}
            step={1000}
            hint={values.budget ? formatKES(Number(values.budget)) : "Your best estimate is fine."}
            required
          />

          {error && <ErrorMessage message={error} />}

          <PrimaryButton
            type="submit"
            title={sending ? "Submitting..." : "Submit proposal"}
            disabled={sending}
            className="self-start"
          />
        </form>

        <aside className="self-start">
          <h2 className="text-lg font-bold">What happens next</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {nextSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-tea-light text-sm font-bold text-tea">
                  {index + 1}
                </span>
                <p className="text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
};

export default ProposeProject;
