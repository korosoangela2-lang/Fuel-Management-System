import { Routes, Route } from "react-router-dom";

// Authentication
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/admin/Dashboard";

// Shared
import NotFound from "../pages/shared/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;