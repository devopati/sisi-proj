import { forwardRef, useImperativeHandle, useRef, useState, type ComponentProps } from "react";
import { fieldClass } from "./fieldStyles";

export type InputFieldHandle = {
  focus: () => void;
  selectAll: () => void;
};

// Accepts every normal <input> prop (name, value, onChange, type, required...) plus a label
type InputFieldProps = ComponentProps<"input"> & {
  label: string;
  hint?: string;
  error?: string;
};

const InputField = forwardRef<InputFieldHandle, InputFieldProps>(
  ({ label, hint, error, className = "", type = "text", ...inputProps }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        selectAll: () => {
          inputRef.current?.focus();
          inputRef.current?.select();
        },
      }),
      [],
    );

    const resolvedType = type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{label}</span>
        <div className="relative">
          <input {...inputProps} ref={inputRef} type={resolvedType} className={`${fieldClass} ${type === "password" ? "pr-20" : ""} ${className}`} />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-tea hover:bg-tea-light"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {hint && <span className="text-sm text-muted">{hint}</span>}
        {error && (
          <span role="alert" className="text-sm font-medium text-murram">
            {error}
          </span>
        )}
      </label>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
