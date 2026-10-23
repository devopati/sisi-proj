
import { useImperativeHandle,useRef,useState, type ComponentProps, type Ref } from "react";
import { fieldClass } from "./fieldStyles";

export type InputFieldHandle = {
  focus: () => void;
  selectAll: () => void;
};

type InputFieldProps =Omit<ComponentProps<"input">, "ref"> & {
  label: string;
  hint?: string;
  error?: string;
  ref?: Ref<InputFieldHandle>;
};

const InputField = ({
  label,
  hint,
  error,
  className = "",
  type = "text",
  id,
  name,
  ref,
  ...inputProps
}: InputFieldProps) => {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    selectAll: () => inputRef.current?.select(),
  }));

  const isPassword = type === "password";
  const inputId = id ?? name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>

      <div className="relative">
        <input
          {...inputProps}
          ref={inputRef}
          id={inputId}
          name={name}
          type={isPassword && visible ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={`${fieldClass} ${className} ${
            isPassword ? "pr-16" : ""
          } ${error ? "border-red-500" : ""}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}

      {hint && !error && (
        <span id={`${inputId}-hint`} className="text-sm text-muted">
          {hint}
        </span>
      )}
    </div>
  );
};

export default InputField;
