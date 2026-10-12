import { useState, type SubmitEvent } from "react";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import Loader from "../components/shared/ui/Loader";
import PageHeader from "../components/shared/ui/PageHeader";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import TextAreaField from "../components/shared/ui/TextAreaField";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { type County } from "../types";
import { api } from "../utils/api";

const ContactUs = () => {
  const { user, checking } = useAuth();
  const { data: county, error: countyError, refetch } = useFetch<County>("/county");
  const { values, handleChange, reset } = useForm({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState<{ message: string; ticketId: number } | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      // Logged-in users don't see the name and email fields, so use their account details
      const body = user ? { ...values, name: user.name, email: user.email } : values;
      const result = await api<{ message: string; ticketId: number }>("/contact", { method: "POST", body });
      setReply(result);
      reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Contact the county"
        intro="Questions about a project, a problem to report, or help using SISI. Send a message and the county will reply within 2 working days."
      />

      <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
        <aside className="flex flex-col gap-6 self-start">
          {countyError ? (
            <ErrorMessage message={countyError} onRetry={refetch} />
          ) : !county ? (
            <Loader label="Loading contact details" />
          ) : (
            <dl className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6">
              <div>
                <dt className="text-sm text-muted">Phone</dt>
                <dd>
                  <a href={`tel:${county.contact.phone.replace(/\s/g, "")}`} className="font-semibold text-tea hover:underline">
                    {county.contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${county.contact.email}`} className="font-semibold text-tea hover:underline">
                    {county.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Office</dt>
                <dd className="font-semibold">{county.contact.address}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Opening hours</dt>
                <dd className="font-semibold">{county.contact.hours}</dd>
              </div>
            </dl>
          )}
        </aside>

        {checking ? (
          <Loader label="Loading" />
        ) : reply ? (
          <div role="status" className="flex flex-col items-start gap-4 self-start rounded-xl bg-tea-light p-6 text-tea-dark">
            <h2 className="text-2xl font-bold">Message sent</h2>
            <p className="text-lg">{reply.message}</p>
            <p>
              Your reference number is <strong>#{reply.ticketId}</strong>.
            </p>
            <button type="button" onClick={() => setReply(null)} className="font-semibold underline underline-offset-4">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6">
            {user ? (
              <p className="text-sm text-muted">
                Sending as <strong className="text-ink">{user.name}</strong> ({user.email})
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <InputField label="Your name" name="name" value={values.name} onChange={handleChange} required />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <InputField
              label="Subject"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              placeholder="Water supply in Mlimani"
            />
            <TextAreaField
              label="Message"
              name="message"
              value={values.message}
              onChange={handleChange}
              rows={6}
              required
            />
            {error && <ErrorMessage message={error} />}
            <PrimaryButton
              type="submit"
              title={sending ? "Sending..." : "Send message"}
              disabled={sending}
              className="self-start"
            />
          </form>
        )}
      </div>

      {county && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="type-display text-3xl">Find us</h2>
            <a
              href={county.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-tea underline-offset-4 hover:underline"
            >
              Get directions in Google Maps
            </a>
          </div>
          <iframe
            src={county.mapEmbedUrl}
            title={`Map showing ${county.contact.address}`}
            loading="lazy"
            className="aspect-4/3 w-full rounded-xl border border-line md:aspect-21/9"
          />
        </section>
      )}
    </div>
  );
};

export default ContactUs;
