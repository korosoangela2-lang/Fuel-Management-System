import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import FuelInventory from "../pages/admin/FuelInventory";

import UserDashboard from "../pages/user/Dashboard";
import AvailableFuel from "../pages/user/AvailableFuel";
import FuelOrders from "../pages/user/FuelOrders";
import OrderHistory from "../pages/user/OrderHistory";
import DeliveryTracking from "../pages/user/DeliveryTracking";

import Unauthorized from "../pages/shared/Unauthorized";
import NotFound from "../pages/shared/NotFound";

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Guest Routes */}

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/fuel-inventory"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <FuelInventory />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/available-fuel"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <AvailableFuel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fuel-orders"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <FuelOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-history"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/delivery-tracking"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <DeliveryTracking />
          </ProtectedRoute>
        }
      />

      {/* Shared */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;