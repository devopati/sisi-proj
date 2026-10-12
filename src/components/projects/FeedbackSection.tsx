import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import { type Feedback } from "../../types";
import { api } from "../../utils/api";
import { formatDate } from "../../utils/format";
import ErrorMessage from "../shared/ui/ErrorMessage";
import InputField from "../shared/ui/InputField";
import Loader from "../shared/ui/Loader";
import PrimaryButton from "../shared/ui/PrimaryButton";
import TextAreaField from "../shared/ui/TextAreaField";

const FeedbackSection = ({ projectId }: { projectId: number }) => {
  const { user, checking } = useAuth();
  const { data: feedback, loading, error, refetch } = useFetch<Feedback[]>(`/projects/${projectId}/feedback`);
  const { values, handleChange, setValues } = useForm({ name: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [posted, setPosted] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    setPosted(false);
    try {
      await api<Feedback>(`/projects/${projectId}/feedback`, {
        method: "POST",
        body: { message: values.message, name: user ? user.name : values.name },
      });
      setValues((prev) => ({ ...prev, message: "" }));
      setPosted(true);
      refetch();
    } catch (err) {
      setSendError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="feedback" className="flex scroll-mt-24 flex-col gap-6">
      <h2 className="text-2xl font-bold">Feedback from residents</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5">
        <TextAreaField
          label="Your feedback"
          name="message"
          value={values.message}
          onChange={handleChange}
          placeholder="What's working, what isn't, and what should change?"
          rows={3}
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
        {sendError && <ErrorMessage message={sendError} />}
        {posted && (
          <p role="status" className="font-semibold text-tea">
            Feedback posted. Thank you.
          </p>
        )}
        <PrimaryButton
          type="submit"
          title={sending ? "Posting..." : "Post feedback"}
          disabled={sending}
          className="self-start"
        />
      </form>

      {loading && !feedback ? (
        <Loader label="Loading feedback" />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : feedback?.length === 0 ? (
        <p className="text-muted">No feedback yet. Be the first to say something about this project.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {feedback?.map((item) => (
            <li key={item.id} className="py-4">
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-semibold">{item.name}</span>
                <span className="text-sm text-muted">{formatDate(item.createdAt)}</span>
              </p>
              <p className="mt-1 leading-relaxed">{item.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FeedbackSection;
