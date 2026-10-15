import { useEffect, useState } from "react";
import { type CurrUserType, type UserType } from "../types";
import { api, ApiError } from "../utils/api";
import { AuthContext } from "./authContext";

const TOKEN_KEY = "sisi-token";
const USER_KEY = "sisi-user"; // New key to store the full user object

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. Initialize state with the cached user if it exists
  const [user, setUser] = useState<CurrUserType | null>(() => {
    const cachedUser = localStorage.getItem(USER_KEY);
    return cachedUser ? JSON.parse(cachedUser) : null;
  });

  const [checking, setChecking] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  // On page load: if a token was saved earlier, ask the API who it belongs to
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    api<UserType>("/auth/me", { token })
      .then((me) => {
        const updatedUser = { ...me, token };
        setUser(updatedUser);
        // Keep the cache fresh with the latest data from the API
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      })
      .catch((error) => {
        // Forget the token ONLY when the API explicitly rejected it (401 Unauthorized).
        // If we're offline (status 0) or there's another network error,
        // we do nothing here, so the initialized cached user remains active!
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  const signIn = (newUser: CurrUserType) => {
    localStorage.setItem(TOKEN_KEY, newUser.token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser)); // 2. Save full user object
    setUser(newUser);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY); // 3. Clear user object on sign out
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
