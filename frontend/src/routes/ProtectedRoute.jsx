import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // Wait until authentication is checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
}

export default ProtectedRoute;