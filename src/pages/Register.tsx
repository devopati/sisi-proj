import { useEffect, useReducer, useRef, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField, { type InputFieldHandle } from "../components/shared/ui/InputField";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { type CurrUserType } from "../types";
import { api } from "../utils/api";

// Lesson aid: shows the form state under the form as you type. Set to false to hide it.
const SHOW_FORM_STATE = true;

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RegisterState = {
  form: RegisterForm;
  code: string;
  devCode: string;
  step: "details" | "code";
  loading: boolean;
  error: string;
  errors: Partial<Record<keyof RegisterForm, string>>;
};

type RegisterAction =
  | { type: "fieldChange"; name: keyof RegisterForm; value: string }
  | { type: "codeChange"; value: string }
  | { type: "submitStart" }
  | { type: "submitSuccess"; devCode: string }
  | { type: "submitError"; message: string }
  | { type: "goToCode"; devCode: string }
  | { type: "goToDetails" }
  | { type: "validationError"; errors: Partial<Record<keyof RegisterForm, string>> }
  | { type: "clearError" };

const emptyForm: RegisterForm = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

const initialState: RegisterState = {
  form: emptyForm,
  code: "",
  devCode: "",
  step: "details",
  loading: false,
  error: "",
  errors: {},
};

const validateForm = (form: RegisterForm) => {
  const errors: Partial<Record<keyof RegisterForm, string>> = {};

  if (!form.name.trim()) errors.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Use a valid email address";
  if (!/^0[17]\d{8}$/.test(form.phone.trim())) errors.phone = "Use 10 digits starting with 07 or 01";
  if (form.password.length < 8) errors.password = "Use at least 8 characters";
  if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";

  return errors;
};

const reducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case "fieldChange":
      return {
        ...state,
        error: "",
        form: { ...state.form, [action.name]: action.value },
        errors: { ...state.errors, [action.name]: undefined },
      };
    case "codeChange":
      return { ...state, code: action.value, error: "" };
    case "submitStart":
      return { ...state, loading: true, error: "" };
    case "submitSuccess":
      return { ...state, loading: false, step: "code", devCode: action.devCode, errors: {} };
    case "submitError":
      return { ...state, loading: false, error: action.message };
    case "goToCode":
      return { ...state, loading: false, step: "code", devCode: action.devCode, error: "", errors: {} };
    case "goToDetails":
      return { ...state, loading: false, step: "details", error: "", code: "" };
    case "validationError":
      return { ...state, loading: false, errors: action.errors, error: "" };
    case "clearError":
      return { ...state, error: "" };
    default:
      return state;
  }
};

const Register = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [state, dispatch] = useReducer(reducer, initialState);
  const { form, code, devCode, step, loading, error, errors } = state;
  const fieldRefs = useRef<Record<string, InputFieldHandle | null>>({});
  const codeRef = useRef<InputFieldHandle | null>(null);

  useEffect(() => {
    if (step === "code") {
      window.requestAnimationFrame(() => codeRef.current?.focus());
    }
  }, [step]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "fieldChange", name: name as keyof RegisterForm, value });
  };

  const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      dispatch({ type: "validationError", errors: validationErrors });
      window.requestAnimationFrame(() => fieldRefs.current[firstErrorKey]?.focus());
      return;
    }

    dispatch({ type: "submitStart" });
    try {
      const res = await api<{ message: string; phone: string; devCode: string }>("/auth/register", {
        method: "POST",
        body: { name: form.name, email: form.email, phone: form.phone, password: form.password },
      });
      dispatch({ type: "goToCode", devCode: res.devCode });
    } catch (err) {
      dispatch({ type: "submitError", message: (err as Error).message });
    }
  };

  const handleVerify = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "submitStart" });
    try {
      const loggedInUser = await api<CurrUserType>("/auth/verify", {
        method: "POST",
        body: { phone: form.phone, code },
      });
      signIn(loggedInUser);
      navigate(from, { replace: true });
    } catch (err) {
      dispatch({ type: "submitError", message: (err as Error).message });
    }
  };

  if (step === "code") {
    return (
      <AuthLayout title="Confirm your phone" intro={`We sent a 4-digit code to ${form.phone}.`}>
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <InputField
            ref={codeRef}
            label="SMS code"
            value={code}
            onChange={(e) => dispatch({ type: "codeChange", value: e.target.value })}
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
            onClick={() => dispatch({ type: "goToDetails" })}
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
          ref={(node) => {
            fieldRefs.current.name = node;
          }}
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          error={errors.name}
          required
        />
        <InputField
          ref={(node) => {
            fieldRefs.current.email = node;
          }}
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          error={errors.email}
          required
        />
        <InputField
          ref={(node) => {
            fieldRefs.current.phone = node;
          }}
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="0712345678"
          error={errors.phone}
          required
        />
        <InputField
          ref={(node) => {
            fieldRefs.current.password = node;
          }}
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          error={errors.password}
          required
        />
        <InputField
          ref={(node) => {
            fieldRefs.current.confirmPassword = node;
          }}
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          error={errors.confirmPassword}
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
