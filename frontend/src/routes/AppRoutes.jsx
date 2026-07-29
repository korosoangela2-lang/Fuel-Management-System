import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import UserDashboard from "../pages/user/Dashboard";

import Unauthorized from "../pages/shared/Unauthorized";
import NotFound from "../pages/shared/NotFound";

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Customer routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["customer"]}
          >
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized */}
      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;