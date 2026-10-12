import { createContext } from "react";
import { type CurrUserType } from "../types";

export interface AuthContextType {
  user: CurrUserType | null;
  checking: boolean; // true while a saved token is being checked on page load
  signIn: (user: CurrUserType) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
