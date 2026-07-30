import { useState } from "react";
import { AuthContext } from "./AuthContextBase";
import { logoutUser } from "../services/authService";

export function AuthProvider({ children }) {
  // Logged in user, restored synchronously from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // JWT token, restored synchronously from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Restoring from localStorage is synchronous, so there's nothing to wait on.
  const [loading] = useState(false);

  // Login function
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function. Blocklisting the token server-side is best-effort — the
  // client always clears local state even if the request fails.
  const logout = () => {
    if (token) {
      logoutUser().catch(() => {});
    }

    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
