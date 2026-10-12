import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import LinkButton from "../components/shared/ui/LinkButton";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import { useForm } from "../hooks/useForm";
import { api } from "../utils/api";

// Step 1: phone number → SMS code. Step 2: code + new password.
const ForgotPassword = () => {
  const { values, handleChange } = useForm({ phone: "", code: "", password: "" });
  const [step, setStep] = useState<"phone" | "reset" | "done">("phone");
  const [devCode, setDevCode] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await api<{ message: string; devCode: string }>("/auth/forgot-password", {
        method: "POST",
        body: { phone: values.phone },
      });
      setDevCode(res.devCode);
      setStep("reset");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const handleReset = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await api("/auth/reset-password", { method: "POST", body: values });
      setStep("done");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  if (step === "done") {
    return (
      <AuthLayout title="Password changed" intro="You can now log in with your new password.">
        <LinkButton to="/login" title="Log in" />
      </AuthLayout>
    );
  }

  if (step === "reset") {
    return (
      <AuthLayout title="Choose a new password" intro={`We sent a 4-digit code to ${values.phone}.`}>
        <form onSubmit={handleReset} className="flex flex-col gap-5">
          <InputField
            label="SMS code"
            name="code"
            value={values.code}
            onChange={handleChange}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            hint={`Practice API code: ${devCode}`}
            required
          />
          <InputField
            label="New password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {error && <ErrorMessage message={error} />}
          <PrimaryButton type="submit" title={sending ? "Saving..." : "Save new password"} disabled={sending} />
          <button type="button" onClick={() => setStep("phone")} className="text-sm font-semibold text-tea hover:underline">
            Use a different phone number
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      intro="Enter the phone number on your account and we'll text you a code to reset it."
      footer={
        <Link to="/login" className="font-semibold text-tea underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSendCode} className="flex flex-col gap-5">
        <InputField
          label="Phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="0712345678"
          required
        />
        {error && <ErrorMessage message={error} />}
        <PrimaryButton type="submit" title={sending ? "Sending..." : "Send code"} disabled={sending} />
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
