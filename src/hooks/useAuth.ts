import { useContext, useDebugValue } from "react";
import { AuthContext } from "./authContext";

// const { user, signIn, signOut } = useAuth();
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside <AuthProvider>");
  useDebugValue(auth.user ? `Auth: ${auth.user.name}` : "Auth: Guest");
  return auth;
};
