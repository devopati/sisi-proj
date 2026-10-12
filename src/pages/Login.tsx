import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { type CurrUserType } from "../types";
import { api } from "../utils/api";

const Login = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Where to go after logging in: the page that sent us here, or home
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const { values, handleChange } = useForm({ email: "", password: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const loggedInUser = await api<CurrUserType>("/auth/login", { method: "POST", body: values });
      signIn(loggedInUser);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setSending(false);
    }
  };

  if (user && !sending) return <Navigate to={from} replace />;

  return (
    <AuthLayout
      title="Log in"
      intro="Log in to vote on projects and propose new ones."
      footer={
        <>
          <p>
            New to SISI?{" "}
            <Link to="/register" state={location.state} className="font-semibold text-tea underline underline-offset-4">
              Create an account
            </Link>
          </p>
          <p className="text-muted">Practice account: demo@example.com / password123</p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <Link to="/forgot-password" className="-mt-2 self-end text-sm font-semibold text-tea hover:underline">
          Forgot your password?
        </Link>
        {error && <ErrorMessage message={error} />}
        <PrimaryButton type="submit" title={sending ? "Logging in..." : "Log in"} disabled={sending} />
      </form>
    </AuthLayout>
  );
};

export default Login;
