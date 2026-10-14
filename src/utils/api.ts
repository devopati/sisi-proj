// Override with VITE_API_URL in a .env.local file if the API runs somewhere else
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type Options = { method?: "GET" | "POST"; body?: unknown; token?: string };

// An error from the API, with its HTTP status (0 when the API couldn't be reached)
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Calls the SISI API and throws an ApiError with the API's message when the request fails
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
    const message = navigator.onLine
      ? "Can't reach the SISI API. Start it with `npm run api`."
      : "You're offline. Connect to the internet and try again.";
    throw new ApiError(message, 0);
  }
  const data = await res.json();
  if (!res.ok) throw new ApiError(data.error, res.status);
  return data;
};
