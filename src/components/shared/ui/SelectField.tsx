import { type ComponentProps } from "react";
import { fieldClass } from "./fieldStyles";

// Pass the <option> elements as children
type SelectFieldProps = ComponentProps<"select"> & { label: string };

const SelectField = ({ label, children, className = "", ...selectProps }: SelectFieldProps) => {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <select {...selectProps} className={`${fieldClass} ${className}`}>
        {children}
      </select>
    </label>
  );
};

export default SelectField;
