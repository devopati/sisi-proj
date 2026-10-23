
import { useEffect, useReducer, useRef, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField, {type InputFieldHandle,} from "../components/shared/ui/InputField";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { type CurrUserType } from "../types";
import { api } from "../utils/api";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<
  Record<"phone" | "password" | "confirmPassword", string>
>;

type RegisterState = {
  form: RegisterForm;
  fieldErrors: RegisterErrors;
  code: string;
  devCode: string;
  step: "details" | "code";
  loading: boolean;
  error: string;
};

type RegisterAction =
  | { type: "formEdited"; name: string; value: string }
  | { type: "validationFailed"; errors: RegisterErrors }
  | { type: "codeChanged"; code: string }
  | { type: "codeSent"; devCode: string }
  | { type: "requestStarted" }
  | { type: "requestFailed"; error: string }
  | { type: "requestFinished" }
  | { type: "backToDetails" }
  | { type: "clearError" };

const initialState: RegisterState = {
  form: {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  },
  fieldErrors: {},
  code: "",
  devCode: "",
  step: "details",
  loading: false,
  error: "",
};

function registerReducer(
  state: RegisterState,
  action: RegisterAction,
): RegisterState {
  switch (action.type) {
    case "formEdited": {
      const fieldErrors = { ...state.fieldErrors };

      if (action.name in fieldErrors) {
        delete fieldErrors[action.name as keyof RegisterErrors];
      }

      if (action.name === "password") {
        delete fieldErrors.password;
        delete fieldErrors.confirmPassword;
      }

      return {
        ...state,
        form: {
          ...state.form,
          [action.name]: action.value,
        },
        fieldErrors,
        error: "",
      };
    }

    case "validationFailed":
      return {
        ...state,
        fieldErrors: action.errors,
      };

    case "codeChanged":
      return {
        ...state,
        code: action.code,
        error: "",
      };

    case "codeSent":
      return {
        ...state,
        devCode: action.devCode,
        step: "code",
        loading: false,
        error: "",
      };

    case "requestStarted":
      return {
        ...state,
        loading: true,
        error: "",
      };

    case "requestFailed":
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case "requestFinished":
      return {
        ...state,
        loading: false,
      };

    case "backToDetails":
      return {
        ...state,
        step: "details",
        error: "",
        loading: false,
      };

    case "clearError":
      return {
        ...state,
        error: "",
      };

    default:
      return state;
  }
}

function validate(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!/^0[17]\d{8}$/.test(form.phone)) {
    errors.phone = "Use 10 digits starting with 07 or 01";
  }

  if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

// Set to false when you no longer need to inspect form state.
const SHOW_FORM_STATE = false;

const Register = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? "/";

  const [state, dispatch] = useReducer(registerReducer, initialState);

  const phoneRef = useRef<InputFieldHandle>(null);
  const passwordRef = useRef<InputFieldHandle>(null);
  const confirmPasswordRef = useRef<InputFieldHandle>(null);
  const codeRef = useRef<InputFieldHandle>(null);

  const { form, fieldErrors, code, devCode, step, loading, error } = state;

  // Focus the SMS input when the code step appears.
  useEffect(() => {
    if (step === "code") {
      codeRef.current?.focus();
    }
  }, [step]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch({ type: "formEdited", name, value });
  };

  const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(form);
    dispatch({ type: "validationFailed", errors: validationErrors });

    // Focus the first invalid field.
    if (validationErrors.phone) {
      phoneRef.current?.focus();
      return;
    }

    if (validationErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    if (validationErrors.confirmPassword) {
      confirmPasswordRef.current?.focus();
      return;
    }

    dispatch({ type: "requestStarted" });

    try {
      const res = await api<{
        message: string;
        phone: string;
        devCode: string;
      }>("/auth/register", {
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        },
      });

      dispatch({ type: "codeSent", devCode: res.devCode });
    } catch (err) {
      dispatch({
        type: "requestFailed",
        error: (err as Error).message,
      });
    }
  };

  const handleVerify = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "requestStarted" });

    try {
      const loggedInUser = await api<CurrUserType>("/auth/verify", {
        method: "POST",
        body: { phone: form.phone, code },
      });

      signIn(loggedInUser);
      navigate(from, { replace: true });
    } catch (err) {
      dispatch({
        type: "requestFailed",
        error: (err as Error).message,
      });
    }
  };

  if (step === "code") {
    return (
      <AuthLayout
        title="Confirm your phone"
        intro={`We sent a 4-digit code to ${form.phone}.`}
      >
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <InputField
            ref={codeRef}
            label="SMS code"
            value={code}
            onChange={(e) =>
              dispatch({ type: "codeChanged", code: e.target.value })
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            hint={`Practice API code: ${devCode}`}
            required
          />

          {error && <ErrorMessage message={error} />}

          <PrimaryButton
            type="submit"
            title={loading ? "Checking..." : "Verify"}
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => dispatch({ type: "backToDetails" })}
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
          <Link
            to="/login"
            state={location.state}
            className="font-semibold text-tea underline underline-offset-4"
          >
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
          ref={phoneRef}
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="Eg 07.../ 01..."
          error={fieldErrors.phone}
          required
        />

        <InputField
          ref={passwordRef}
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          error={fieldErrors.password}
          required
        />

        <InputField
          ref={confirmPasswordRef}
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          required
        />

        {error && <ErrorMessage message={error} />}

        <PrimaryButton
          type="submit"
          title={loading ? "Creating account..." : "Register"}
          disabled={loading}
        />

        {SHOW_FORM_STATE && (
          <pre className="overflow-x-auto rounded-md bg-paper p-3 text-sm">
            {JSON.stringify(form, null, 2)}
          </pre>
        )}
      </form>
    </AuthLayout>
  );
};

export default Register;
