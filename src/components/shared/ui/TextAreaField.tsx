import { type ComponentProps } from "react";
import { fieldClass } from "./fieldStyles";

type TextAreaFieldProps = ComponentProps<"textarea"> & { label: string; hint?: string };

const TextAreaField = ({ label, hint, className = "", rows = 4, ...textareaProps }: TextAreaFieldProps) => {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <textarea {...textareaProps} rows={rows} className={`${fieldClass} ${className}`} />
      {hint && <span className="text-sm text-muted">{hint}</span>}
    </label>
  );
};

export default TextAreaField;
