import { type ComponentProps } from "react";
import { fieldClass } from "./fieldStyles";

// Accepts every normal <input> prop (name, value, onChange, type, required...) plus a label
type InputFieldProps = ComponentProps<"input"> & {
  label: string;
  hint?: string;
};

const InputField = ({ label, hint, className = "", ...inputProps }: InputFieldProps) => {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <input {...inputProps} className={`${fieldClass} ${className}`} />
      {hint && <span className="text-sm text-muted">{hint}</span>}
    </label>
  );
};

export default InputField;
