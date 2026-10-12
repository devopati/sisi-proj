// Override with VITE_API_URL in a .env.local file if the API runs somewhere else
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type Options = { method?: "GET" | "POST"; body?: unknown; token?: string };

// Calls the SISI API and throws with the API's error message when the request fails
export const api = async <T>(path: string, { method = "GET", body, token }: Options = {}): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws when the server can't be reached at all
    throw new Error("Can't reach the SISI API. Start it with `npm run api`.");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};
