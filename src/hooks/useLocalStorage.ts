
import { useEffect, useState } from "react";

function readValue<T>(key: string, initialValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? initialValue : (JSON.parse(stored) as T);
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((previous: T) => T)) => void] {
  const [entry, setEntry] = useState(() => ({
    key,
    value: readValue(key, initialValue),
  }));

  // Read the correct saved value if the key changes.
  const value =
    entry.key === key ? entry.value : readValue(key, initialValue);

  useEffect(() => {
    if (entry.key !== key) {
      setEntry({ key, value: readValue(key, initialValue) });
    }
  }, [key, entry.key, initialValue]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable or full; the UI can still work.
    }
  }, [key, value]);

  const setValue = (next: T | ((previous: T) => T)) => {
    setEntry((previous) => {
      const previousValue =
        previous.key === key
          ? previous.value
          : readValue(key, initialValue);

      const newValue =
        typeof next === "function"
          ? (next as (previous: T) => T)(previousValue)
          : next;

      return { key, value: newValue };
    });
  };

  return [value, setValue];
}
