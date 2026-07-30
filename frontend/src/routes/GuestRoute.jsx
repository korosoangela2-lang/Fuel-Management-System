import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestRoute({ children }) {
  const {
    loading,
    isAuthenticated,
    user,
  } = useAuth();

  // Wait while checking localStorage
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  // Already logged in?
  if (isAuthenticated) {
    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default GuestRoute;