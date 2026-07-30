import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import { ADMIN_ROLES, CUSTOMER_ROLES } from "../utils/roles";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import FuelInventory from "../pages/admin/FuelInventory";
import Orders from "../pages/admin/Orders";
import Customers from "../pages/admin/Customers";
import Deliveries from "../pages/admin/Deliveries";
import AdminReports from "../pages/admin/Reports";
import Analytics from "../pages/admin/Analytics";
import UserManagement from "../pages/admin/UserManagement";
import SystemSettings from "../pages/admin/SystemSettings";

import UserDashboard from "../pages/user/Dashboard";
import AvailableFuel from "../pages/user/AvailableFuel";
import FuelOrders from "../pages/user/FuelOrders";
import OrderHistory from "../pages/user/OrderHistory";
import DeliveryTracking from "../pages/user/DeliveryTracking";
import UserReports from "../pages/user/Reports";

import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";
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
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/fuel-inventory"
        element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <FuelInventory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/deliveries"
        element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <Deliveries />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SystemSettings />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/available-fuel"
        element={
          <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
            <AvailableFuel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fuel-orders"
        element={
          <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
            <FuelOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-history"
        element={
          <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/delivery-tracking"
        element={
          <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
            <DeliveryTracking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={CUSTOMER_ROLES}>
            <UserReports />
          </ProtectedRoute>
        }
      />

      {/* Shared authenticated routes — any signed-in role */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
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
