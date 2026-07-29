import { createContext, useContext, useEffect, useState } from "react";

// Create the authentication context
const AuthContext = createContext();

// Custom hook for accessing the context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Logged in user
  const [user, setUser] = useState(null);

  // JWT token
  const [token, setToken] = useState(null);

  // Loading state while checking localStorage
  const [loading, setLoading] = useState(true);

  // Restore login session after refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Login function
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
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