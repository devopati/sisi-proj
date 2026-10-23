import { useCallback, useDebugValue, useEffect, useState } from "react";
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

  const refetch = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

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


  const data = response?.data ?? null;
  const error = response?.request === request ? response.error : "";
  const loading = response?.request !== request;

  useDebugValue(!path ? "Fetch: waiting" : loading ? `Fetch: "${path}" loading` : error ? `Fetch: error ${error}` : "Fetch: loaded");
  return { data, error, loading, refetch, };

};

