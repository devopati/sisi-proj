import { useEffect, useState } from "react";

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    const saved = window.localStorage.getItem(key);
    if (saved === null) return initialValue;

    try {
      return JSON.parse(saved) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(key);
    if (saved === null) {
      setValue(initialValue);
      return;
    }

    try {
      setValue(JSON.parse(saved) as T);
    } catch {
      setValue(initialValue);
    }
  }, [initialValue, key]);

  const updateValue = (nextValue: T | ((current: T) => T)) => {
    setValue((current) => {
      const resolved = typeof nextValue === "function" ? (nextValue as (current: T) => T)(current) : nextValue;

      if (typeof window !== "undefined") {
        const serialised = JSON.stringify(resolved);
        if (resolved === null || resolved === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialised);
        }
      }

      return resolved;
    });
  };

  return [value, updateValue] as const;
};
