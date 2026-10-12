import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { type CurrUserType } from "../types";
import { api } from "../utils/api";

/**
 * Forms with multiple inputs
 *
 * 1. Keep every input in ONE state object instead of one useState per input.
 * 2. Give each input a `name` that matches a key in that object.
 * 3. Use ONE handleChange for all inputs: e.target.name tells us which key to update.
 * 4. On submit, call e.preventDefault() (stops the page reload) and send the whole object to the API.
 *
 * The other forms in this project use the same idea through the useForm hook (hooks/useForm.ts).
 */

// Lesson aid: shows the form state under the form as you type. Set to false to hide it.
const SHOW_FORM_STATE = true;

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const emptyForm: RegisterForm = { name: "", email: "", phone: "", password: "" };

const Register = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // One handler for every input. [name] is a "computed key": if name is "email",
  // this becomes { ...prev, email: value }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: send all four fields to the API in one request
  const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api<{ message: string; phone: string; devCode: string }>("/auth/register", {
        method: "POST",
        body: form,
      });
      setDevCode(res.devCode);
      setStep("code");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: confirm the SMS code. The API logs the user in and returns a token
  const handleVerify = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const loggedInUser = await api<CurrUserType>("/auth/verify", {
        method: "POST",
        body: { phone: form.phone, code },
      });
      signIn(loggedInUser);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  if (step === "code") {
    return (
      <AuthLayout title="Confirm your phone" intro={`We sent a 4-digit code to ${form.phone}.`}>
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <InputField
            label="SMS code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            hint={`Practice API code: ${devCode}`}
            required
          />
          {error && <ErrorMessage message={error} />}
          <PrimaryButton type="submit" title={loading ? "Checking..." : "Verify"} disabled={loading} />
          <button
            type="button"
            onClick={() => setStep("details")}
            className="text-sm font-semibold text-tea hover:underline"
          >
            Change my details
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an account"
      intro="Register to vote on projects and propose new ones. We'll text you a code to confirm your phone."
      footer={
        <p>
          Already registered?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-tea underline underline-offset-4">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <InputField
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <InputField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="0712345678"
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        {error && <ErrorMessage message={error} />}

        <PrimaryButton type="submit" title={loading ? "Creating account..." : "Register"} disabled={loading} />

        {SHOW_FORM_STATE && (
          <pre className="overflow-x-auto rounded-md bg-paper p-3 text-sm">{JSON.stringify(form, null, 2)}</pre>
        )}
      </form>
    </AuthLayout>
  );
};

export default Register;
