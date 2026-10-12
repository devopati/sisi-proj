import { useEffect, useState } from "react";
import { api } from "../utils/api";

/**
 * Loads data from the SISI API.
 *
 *   const { data, loading, error, refetch } = useFetch<Project[]>("/projects");
 *
 * Pass null as the path to wait (for example until you know an id).
 * When the path changes, the old data stays on screen until the new data arrives.
 */
export const useFetch = <T>(path: string | null) => {
  const [reloadCount, setReloadCount] = useState(0);
  const [response, setResponse] = useState<{ request: string; data: T | null; error: string } | null>(null);

  // Each path + reload gets its own name, so we can tell when the response we hold is out of date
  const request = `${path} #${reloadCount}`;

  useEffect(() => {
    if (!path) return;
    let ignore = false; // becomes true if a newer request starts before this one finishes

    api<T>(path)
      .then((data) => {
        if (!ignore) setResponse({ request, data, error: "" });
      })
      .catch((err: Error) => {
        if (!ignore) setResponse({ request, data: null, error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [path, request]);

  return {
    data: response?.data ?? null,
    error: response?.request === request ? response.error : "",
    loading: response?.request !== request,
    refetch: () => setReloadCount((count) => count + 1),
  };
};
