import { useEffect, useState } from "react";
import { type CurrUserType, type UserType } from "../types";
import { api, ApiError } from "../utils/api";
import { syncQueuedVotes } from "../utils/offlineVotes";
import { AuthContext } from "./authContext";

// const name = "david"
// const obj = {
//   name:"pp",
//   age:29
// }

// store variables that are not objects or arrays just a string
// localStorage.setItem("my-name",name) //store string
// localStorage.setItem("my-obj",JSON.stringify(obj))

// const myObj = JSON.parse(localStorage.getItem("my-obj") as any) //get stored value and convert back to what it was

// localStorage.clear(); //Clear entire localstorage
// localStorage.removeItem("my-name") //remove specific item

const TOKEN_KEY = "sisi-token";
const USER_KEY = "sisi-user";

const isCachedUser = (value: unknown): value is CurrUserType => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<CurrUserType>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.token === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.status === "string"
  );
};

const readCachedUser = () => {
  const saved = localStorage.getItem(USER_KEY);
  if (!saved) return null;

  try {
    const parsed: unknown = JSON.parse(saved);
    if (isCachedUser(parsed) && parsed.token === localStorage.getItem(TOKEN_KEY)) return parsed;
    throw new Error("The saved user profile is invalid or does not match the saved token.");
  } catch (error) {
    console.error("Could not restore the saved user profile:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CurrUserType | null>(readCachedUser);
  const [checking, setChecking] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  // On page load: if a token was saved earlier, ask the API who it belongs to
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    api<UserType>("/auth/me", { token })
      .then((me) => setUser({ ...me, token }))
      .catch((error) => {
        // Forget the token only when the API rejected it (e.g. the API restarted).
        // If we're just offline, keep it for when the connection comes back.
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        } else if (!(error instanceof ApiError)) {
          console.error("Could not verify the saved login:", error);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!user) return;

    const sendQueuedVotes = () => {
      void syncQueuedVotes(user.id, user.token).catch((error: unknown) => {
        console.error("Could not sync queued votes:", error);
        window.dispatchEvent(
          new CustomEvent("sisi-vote-sync-error", {
            detail: {
              userId: user.id,
              message: error instanceof Error ? error.message : "Could not sync your saved vote.",
            },
          }),
        );
      });
    };

    window.addEventListener("online", sendQueuedVotes);
    if (navigator.onLine) sendQueuedVotes();

    return () => window.removeEventListener("online", sendQueuedVotes);
  }, [user]);

  const signIn = (newUser: CurrUserType) => {
    localStorage.setItem(TOKEN_KEY, newUser.token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
