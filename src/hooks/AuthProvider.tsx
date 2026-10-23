import { useEffect, useState } from "react";
import { type CurrUserType, type UserType } from "../types";
import { api, ApiError } from "../utils/api";
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

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CurrUserType | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser) as CurrUserType;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const [checking, setChecking] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  // On page load: if a token was saved earlier, ask the API who it belongs to
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    let cancelled = false;

    api<UserType>("/auth/me", { token })
      .then((me) => {
        if (cancelled) return;
         const currentUser = { ...me, token } as CurrUserType;

         localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
         setUser(currentUser);
      })
      .catch((error) => {
        if (cancelled) return;
        // Forget the token only when the API rejected it (e.g. the API restarted).
        // If we're just offline, keep it for when the connection comes back.
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
        //For network/offline errors, keep the cached user and token
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = (newUser: CurrUserType) => {
    localStorage.setItem(TOKEN_KEY, newUser.token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setChecking(false);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setChecking(false);
  };

  return (
    <AuthContext.Provider value={{ user, checking, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
