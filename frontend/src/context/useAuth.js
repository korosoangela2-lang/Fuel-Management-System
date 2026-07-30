import { useContext } from "react";
import { AuthContext } from "./AuthContextBase";

// Custom hook for accessing the auth context
export function useAuth() {
  return useContext(AuthContext);
}
