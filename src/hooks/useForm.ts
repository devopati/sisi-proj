import { useState, type ChangeEvent } from "react";

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * The "multiple inputs" pattern from pages/Register.tsx, moved into a custom hook
 * so every form can reuse it.
 *
 *   const { values, handleChange, reset } = useForm({ email: "", password: "" });
 *   <input name="email" value={values.email} onChange={handleChange} />
 *
 * Works for <input>, <select> and <textarea>. Values are always strings,
 * so convert numbers (like a budget) when you submit.
 */
export const useForm = <T extends Record<string, string>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: ChangeEvent<FieldElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, setValues, reset };
};
