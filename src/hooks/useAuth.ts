import { useContext } from "react";
import { AuthContext } from "./authContext";

// const { user, signIn, signOut } = useAuth();
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside <AuthProvider>");
  return auth;
};
